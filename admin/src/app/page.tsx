'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';
import { dataStore } from '../lib/dataStore';
import { Product, Order, DealerApplication, ServiceBooking } from '../types';
import {
  IndianRupee,
  ShoppingCart,
  UserCheck,
  Wrench,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dealerApps, setDealerApps] = useState<DealerApplication[]>([]);
  const [services, setServices] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    const syncData = () => {
      setOrders([...dataStore.getOrders()]);
      setProducts([...dataStore.getProducts()]);
      setDealerApps([...dataStore.getDealerApplications()]);
      setServices([...dataStore.getServiceBookings()]);
    };

    syncData();
    const unsubscribe = dataStore.subscribe(syncData);
    return () => unsubscribe();
  }, []);

  // Compute metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const pendingDealers = dealerApps.filter(d => d.status === 'pending');
  const activeServices = services.filter(s => s.status !== 'completed' && s.status !== 'cancelled');
  const lowStockItems = products.filter(p => p.stockQuantity < 15);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} title="Operations Dashboard" />

        <main className="p-4 lg:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Califnco Water Ecosystem Live Monitor</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Water Treatment & Distribution Portal</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Unified operations console for retail customers, certified B2B dealers, inventory replenishment, and field service dispatch.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/products"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center space-x-1.5"
              >
                <Package className="w-4 h-4" />
                <span>Manage Inventory</span>
              </Link>
              <Link
                href="/dealers"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Review Dealers ({pendingDealers.length})</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Verified Net Revenue"
              value={`₹${totalRevenue.toLocaleString('en-IN')}`}
              change="+18.4%"
              isPositive={true}
              subtitle="vs previous billing period"
              icon={IndianRupee}
            />
            <StatsCard
              title="Total Orders Placed"
              value={orders.length}
              subtitle={`${pendingOrders.length} requiring fulfillment`}
              icon={ShoppingCart}
            />
            <StatsCard
              title="Pending Dealer Applications"
              value={pendingDealers.length}
              subtitle="Wholesale verification required"
              icon={UserCheck}
            />
            <StatsCard
              title="Active Service Tickets"
              value={activeServices.length}
              subtitle="Installations & repairs"
              icon={Wrench}
            />
          </div>

          {/* Low Stock Warning Banner if applicable */}
          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-300">
                  Inventory Replenishment Alert:
                </span>{' '}
                <span className="text-amber-800 dark:text-amber-400">
                  {lowStockItems.length} products have stock below 15 units (e.g. {lowStockItems.slice(0, 3).map(p => p.name).join(', ')}).
                </span>
                <Link href="/products" className="ml-2 font-semibold text-amber-900 dark:text-amber-200 underline">
                  Restock Catalog
                </Link>
              </div>
            </div>
          )}

          {/* Two-Column Grid: Recent Orders & Dealer Applications */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Orders (2 Columns) */}
            <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Dispatches & Orders</h3>
                  <p className="text-xs text-slate-500">Real-time snapshots of customer and wholesale orders</p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center space-x-1"
                >
                  <span>View All ({orders.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Order ID</th>
                      <th className="py-2.5 px-3">Customer / Dealer</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-3 font-medium">
                          <div>{order.userName}</div>
                          <div className="text-[10px] text-slate-400">{order.userEmail}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.userRole === 'dealer'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {order.userRole}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={order.paymentStatus} type="payment" />
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="py-3 px-3">
                          <Link
                            href="/orders"
                            className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                          >
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Dealer Applications (1 Column) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Dealer Queue</h3>
                  <p className="text-xs text-slate-500">Wholesale authorization</p>
                </div>
                <Link
                  href="/dealers"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-semibold flex items-center space-x-1"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
                {dealerApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {app.companyName}
                        </span>
                        <StatusBadge status={app.status} type="dealer" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Contact: {app.applicantName} • {app.phone}
                      </p>
                      <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                        GSTIN: {app.gstin}
                      </p>
                    </div>

                    {app.status === 'pending' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center space-x-2">
                        <button
                          onClick={() => dataStore.updateDealerStatus(app.id, 'approved', 'Verified GSTIN')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => dataStore.updateDealerStatus(app.id, 'rejected', 'Verification mismatch')}
                          className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {dealerApps.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No applications pending review.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
