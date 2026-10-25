'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { dataStore } from '../../lib/dataStore';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  Clock,
  IndianRupee,
  MapPin,
  Calendar,
  X
} from 'lucide-react';

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const syncData = () => {
      setOrders([...dataStore.getOrders()]);
      if (selectedOrder) {
        const fresh = dataStore.getOrders().find(o => o.id === selectedOrder.id);
        if (fresh) setSelectedOrder(fresh);
      }
    };
    syncData();
    const unsubscribe = dataStore.subscribe(syncData);
    return () => unsubscribe();
  }, [selectedOrder]);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userPhone.includes(searchQuery);

    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchRole = roleFilter === 'all' || o.userRole === roleFilter;

    return matchSearch && matchStatus && matchRole;
  });

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const note = prompt(`Enter optional tracking or dispatcher note for status "${newStatus}":`, `Order transitioned to ${newStatus}`);
    dataStore.updateOrderStatus(selectedOrder.id, newStatus, note || undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} title="Orders & Fulfillment" />

        <main className="p-4 lg:p-8 space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Orders ({orders.length})</h2>
              <p className="text-xs text-slate-500">Track and dispatch customer and dealer water purifier orders</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order #, customer, phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Roles</option>
                <option value="customer">Retail Customers</option>
                <option value="dealer">Wholesale Dealers</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order Number</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer / Dealer</th>
                    <th className="py-3 px-4">Items Count</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{order.userName}</div>
                        <div className="text-[10px] text-slate-400">{order.userEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} units
                        <span className="text-[10px] text-slate-400 block">({order.items.length} unique)</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.paymentStatus} type="payment" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-semibold hover:bg-cyan-100 transition-colors inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                        No orders matching the specified filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Detailed Order Inspector Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                    {selectedOrder.orderNumber}
                  </span>
                  <StatusBadge status={selectedOrder.status} type="order" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 text-xs flex-1">
              {/* Status Update Actions */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-2">
                  Dispatch Lifecycle Controls:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={selectedOrder.status === 'confirmed'}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 transition-colors"
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('processing')}
                    disabled={selectedOrder.status === 'processing'}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold disabled:opacity-40 transition-colors"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('shipped')}
                    disabled={selectedOrder.status === 'shipped'}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-40 transition-colors"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('delivered')}
                    disabled={selectedOrder.status === 'delivered'}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-40 transition-colors"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold disabled:opacity-40 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Items Snapshot */}
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block mb-3">
                  Purchased Items Snapshot ({selectedOrder.items.length})
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.productThumbnail}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                            {item.productName}
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            ₹{item.unitPrice.toLocaleString('en-IN')} × {item.quantity} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold text-slate-900 dark:text-white">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18% Equipment Tax)</span>
                  <span>₹{selectedOrder.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.shippingFee > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping Charges</span>
                    <span>₹{selectedOrder.shippingFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Referral Discount</span>
                    <span>-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Amount Paid</span>
                  <span className="text-cyan-600 dark:text-cyan-400">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Shipping Address & Customer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white mb-2">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p className="text-slate-500 mt-0.5">{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p className="text-slate-500">{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-slate-500">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-slate-500 mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-2">Payment Details</div>
                  <p className="text-slate-500">
                    Method: <span className="font-semibold uppercase">{selectedOrder.paymentMethod}</span>
                  </p>
                  <p className="text-slate-500 mt-1">
                    Status: <StatusBadge status={selectedOrder.paymentStatus} type="payment" />
                  </p>
                  {selectedOrder.razorpayPaymentId && (
                    <p className="text-slate-500 mt-1 font-mono text-[10px]">
                      Payment ID: {selectedOrder.razorpayPaymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Audit Status History */}
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-2">Status Audit Trail</span>
                <div className="space-y-2 border-l-2 border-cyan-500 pl-3">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="text-slate-500">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                          {h.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {h.note && <p className="text-slate-400 text-[11px] mt-0.5">{h.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
