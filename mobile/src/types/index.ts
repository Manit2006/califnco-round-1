export type UserRole = 'customer' | 'dealer' | 'admin';
export type DealerStatus = 'pending' | 'approved' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ServiceStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceType = 'installation' | 'maintenance' | 'repair' | 'filter_replacement';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  dealerStatus?: DealerStatus;
  dealerDetails?: {
    companyName: string;
    gstin: string;
    tradeLicense: string;
    yearsInBusiness: number;
    billingAddress: string;
    appliedAt: number;
    approvedAt?: number;
  };
  referralCode: string;
  referredBy?: string;
  walletBalance: number;
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  brand: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  minOrderQuantity: number;
  stockQuantity: number;
  thumbnail: string;
  images: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number; // dynamically computed based on customer vs approved dealer
  totalPrice: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Shop' | 'Warehouse';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productThumbnail: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userRole: UserRole;
  userEmail: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'cod' | 'dealer_credit';
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: number;
    note?: string;
  }>;
  createdAt: number;
  updatedAt: number;
}

export interface ServiceBooking {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceType: ServiceType;
  purifierBrand: string;
  purifierModel?: string;
  issueDescription: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  serviceAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    pincode: string;
  };
  status: ServiceStatus;
  assignedTechnician?: {
    name: string;
    phone: string;
    assignedAt: number;
  };
  technicianNotes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: 'order' | 'dealer' | 'service' | 'promo' | 'system';
  isRead: boolean;
  createdAt: number;
}
