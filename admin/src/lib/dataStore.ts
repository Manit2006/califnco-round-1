import { Product, Order, DealerApplication, ServiceBooking, UserProfile, NotificationItem, OrderStatus, DealerStatus, ServiceStatus } from '../types';
import { initialUsers, initialOrders, initialDealerApplications, initialServiceBookings, initialNotifications } from './mockData';
import productsSeed from '../../../firebase/seeds/products.json';
import { isFirebaseConfigured, db } from './firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY_PRODUCTS = 'califnco_admin_products_v1';
const STORAGE_KEY_ORDERS = 'califnco_admin_orders_v1';
const STORAGE_KEY_DEALERS = 'califnco_admin_dealers_v1';
const STORAGE_KEY_SERVICES = 'califnco_admin_services_v1';
const STORAGE_KEY_USERS = 'califnco_admin_users_v1';
const STORAGE_KEY_NOTIFS = 'califnco_admin_notifs_v1';

class DataStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private dealerApplications: DealerApplication[] = [];
  private serviceBookings: ServiceBooking[] = [];
  private users: UserProfile[] = [];
  private notifications: NotificationItem[] = [];
  private listeners: Array<() => void> = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const storedProds = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      this.products = storedProds ? JSON.parse(storedProds) : (productsSeed as unknown as Product[]);

      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : initialOrders;

      const storedDealers = localStorage.getItem(STORAGE_KEY_DEALERS);
      this.dealerApplications = storedDealers ? JSON.parse(storedDealers) : initialDealerApplications;

      const storedServices = localStorage.getItem(STORAGE_KEY_SERVICES);
      this.serviceBookings = storedServices ? JSON.parse(storedServices) : initialServiceBookings;

      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : initialUsers;

      const storedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : initialNotifications;

      this.isInitialized = true;
      this.saveToStorage();
    } catch (e) {
      console.warn('LocalStorage error, using in-memory fallbacks', e);
      this.products = productsSeed as unknown as Product[];
      this.orders = initialOrders;
      this.dealerApplications = initialDealerApplications;
      this.serviceBookings = initialServiceBookings;
      this.users = initialUsers;
      this.notifications = initialNotifications;
      this.isInitialized = true;
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEY_DEALERS, JSON.stringify(this.dealerApplications));
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(this.serviceBookings));
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Products ---
  public getProducts(): Product[] {
    if (!this.isInitialized) this.init();
    return this.products;
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    if (!this.isInitialized) this.init();
    const newProduct: Product = {
      ...product,
      id: 'prod-' + String(this.products.length + 1).padStart(3, '0') + '-' + Date.now().toString(36),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.products.unshift(newProduct);
    this.saveToStorage();

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'products', newProduct.id), newProduct).catch(console.error);
    }

    return newProduct;
  }

  public updateProduct(product: Product): void {
    if (!this.isInitialized) this.init();
    const idx = this.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      this.products[idx] = { ...product, updatedAt: Date.now() };
      this.saveToStorage();

      if (isFirebaseConfigured) {
        updateDoc(doc(db, 'products', product.id), { ...product, updatedAt: Date.now() }).catch(console.error);
      }
    }
  }

  public deleteProduct(productId: string): void {
    if (!this.isInitialized) this.init();
    this.products = this.products.filter(p => p.id !== productId);
    this.saveToStorage();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, 'products', productId)).catch(console.error);
    }
  }

  // --- Orders ---
  public getOrders(): Order[] {
    if (!this.isInitialized) this.init();
    return this.orders;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): void {
    if (!this.isInitialized) this.init();
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = Date.now();
      order.statusHistory.push({
        status: newStatus,
        timestamp: Date.now(),
        note: note || `Status updated to ${newStatus} by Admin`,
      });

      // Also trigger a notification for the customer / dealer
      this.sendNotification({
        recipientUserId: order.userId,
        title: `Order #${order.orderNumber} ${newStatus.toUpperCase()}`,
        message: note || `Your water purifier order is now ${newStatus}.`,
        type: 'order',
      });

      this.saveToStorage();

      if (isFirebaseConfigured) {
        updateDoc(doc(db, 'orders', orderId), {
          status: newStatus,
          statusHistory: order.statusHistory,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
    }
  }

  // --- Dealer Applications ---
  public getDealerApplications(): DealerApplication[] {
    if (!this.isInitialized) this.init();
    return this.dealerApplications;
  }

  public updateDealerStatus(appId: string, newStatus: DealerStatus, notes?: string): void {
    if (!this.isInitialized) this.init();
    const app = this.dealerApplications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      app.reviewedAt = Date.now();
      if (notes) app.adminNotes = notes;

      // Update associated user record role and dealerStatus
      const user = this.users.find(u => u.uid === app.userId || u.email === app.email);
      if (user) {
        user.dealerStatus = newStatus;
        if (newStatus === 'approved') {
          user.role = 'dealer';
          if (user.dealerDetails) {
            user.dealerDetails.approvedAt = Date.now();
          }
        }
      }

      this.sendNotification({
        recipientUserId: app.userId,
        title: `Dealer Application ${newStatus === 'approved' ? 'Approved! 🎉' : 'Update'}`,
        message: newStatus === 'approved'
          ? 'Congratulations! Your dealer account is approved. You can now purchase wholesale inventory at bulk discounts.'
          : 'Your dealer application was not approved. Reason: ' + (notes || 'Documentation requirements not met.'),
        type: 'dealer',
      });

      this.saveToStorage();

      if (isFirebaseConfigured) {
        updateDoc(doc(db, 'dealerApplications', appId), {
          status: newStatus,
          reviewedAt: Date.now(),
          adminNotes: notes || '',
        }).catch(console.error);

        if (user) {
          updateDoc(doc(db, 'users', user.uid), {
            dealerStatus: newStatus,
            role: newStatus === 'approved' ? 'dealer' : user.role,
          }).catch(console.error);
        }
      }
    }
  }

  // --- Service Bookings ---
  public getServiceBookings(): ServiceBooking[] {
    if (!this.isInitialized) this.init();
    return this.serviceBookings;
  }

  public updateServiceStatus(serviceId: string, newStatus: ServiceStatus): void {
    if (!this.isInitialized) this.init();
    const srv = this.serviceBookings.find(s => s.id === serviceId);
    if (srv) {
      srv.status = newStatus;
      srv.updatedAt = Date.now();

      this.sendNotification({
        recipientUserId: srv.userId,
        title: `Service Request #${srv.ticketNumber} ${newStatus.toUpperCase()}`,
        message: `Your service request for ${srv.purifierBrand} is now ${newStatus}.`,
        type: 'service',
      });

      this.saveToStorage();

      if (isFirebaseConfigured) {
        updateDoc(doc(db, 'serviceBookings', serviceId), {
          status: newStatus,
          updatedAt: Date.now(),
        }).catch(console.error);
      }
    }
  }

  public assignTechnician(serviceId: string, technicianName: string, phone: string, notes?: string): void {
    if (!this.isInitialized) this.init();
    const srv = this.serviceBookings.find(s => s.id === serviceId);
    if (srv) {
      srv.assignedTechnician = {
        name: technicianName,
        phone,
        assignedAt: Date.now(),
      };
      srv.status = 'assigned';
      if (notes) srv.technicianNotes = notes;
      srv.updatedAt = Date.now();

      this.sendNotification({
        recipientUserId: srv.userId,
        title: `Technician Assigned for Service #${srv.ticketNumber}`,
        message: `Technician ${technicianName} (${phone}) has been assigned for your water purifier service.`,
        type: 'service',
      });

      this.saveToStorage();

      if (isFirebaseConfigured) {
        updateDoc(doc(db, 'serviceBookings', serviceId), {
          assignedTechnician: srv.assignedTechnician,
          status: 'assigned',
          technicianNotes: notes || '',
          updatedAt: Date.now(),
        }).catch(console.error);
      }
    }
  }

  // --- Users ---
  public getUsers(): UserProfile[] {
    if (!this.isInitialized) this.init();
    return this.users;
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    if (!this.isInitialized) this.init();
    return this.notifications;
  }

  public sendNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): NotificationItem {
    if (!this.isInitialized) this.init();
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now().toString(36),
      isRead: false,
      createdAt: Date.now(),
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage();

    if (isFirebaseConfigured) {
      setDoc(doc(db, 'notifications', newNotif.id), newNotif).catch(console.error);
    }

    return newNotif;
  }
}

export const dataStore = new DataStore();
