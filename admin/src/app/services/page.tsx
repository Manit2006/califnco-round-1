'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { dataStore } from '../../lib/dataStore';
import { ServiceBooking, ServiceStatus } from '../../types';
import {
  Wrench,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Search,
  UserPlus,
  X
} from 'lucide-react';

export default function ServicesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<ServiceBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [assignModalBooking, setAssignModalBooking] = useState<ServiceBooking | null>(null);
  const [techName, setTechName] = useState('Suresh Sharma (Senior Water Engineer)');
  const [techPhone, setTechPhone] = useState('+91 98112 34567');
  const [techNote, setTechNote] = useState('Assigned for doorstep service with genuine Califnco spares');

  useEffect(() => {
    const sync = () => {
      setServices([...dataStore.getServiceBookings()]);
    };
    sync();
    const unsubscribe = dataStore.subscribe(sync);
    return () => unsubscribe();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchSearch =
      s.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.purifierBrand.toLowerCase().includes(search.toLowerCase()) ||
      s.issueDescription.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalBooking) return;
    dataStore.assignTechnician(assignModalBooking.id, techName, techPhone, techNote);
    setAssignModalBooking(null);
  };

  const handleUpdateStatus = (id: string, newStatus: ServiceStatus) => {
    dataStore.updateServiceStatus(id, newStatus);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} title="Field Service Operations" />

        <main className="p-4 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Service & Installation Tickets ({services.length})
              </h2>
              <p className="text-xs text-slate-500">
                Dispatch certified field technicians for installation, preventive maintenance, and repairs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ticket, customer, appliance..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Technician</option>
                <option value="assigned">Technician Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {srv.ticketNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                          {srv.serviceType.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Requested: {new Date(srv.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={srv.status} type="service" />
                  </div>

                  {/* Appliance & Customer info */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Purifier Model:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {srv.purifierBrand} {srv.purifierModel || ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{srv.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{srv.userPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preferred Slot:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {srv.preferredDate} ({srv.preferredTimeSlot})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                      Issue / Service Note:
                    </span>
                    <p className="text-slate-500 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      "{srv.issueDescription}"
                    </p>
                  </div>

                  <div className="mt-3 text-xs text-slate-500 flex items-start space-x-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {srv.serviceAddress.addressLine}, {srv.serviceAddress.city} - {srv.serviceAddress.pincode}
                    </span>
                  </div>

                  {/* Assigned Technician Card if present */}
                  {srv.assignedTechnician ? (
                    <div className="mt-3 p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800/60 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block mb-1">
                        Assigned Field Engineer
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white">{srv.assignedTechnician.name}</p>
                      <p className="text-slate-500 mt-0.5">Contact: {srv.assignedTechnician.phone}</p>
                      {srv.technicianNotes && (
                        <p className="text-slate-400 italic mt-1 text-[11px]">"{srv.technicianNotes}"</p>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Status Transition Controls */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  {!srv.assignedTechnician && srv.status !== 'cancelled' && (
                    <button
                      onClick={() => setAssignModalBooking(srv)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center space-x-1 transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign Technician</span>
                    </button>
                  )}

                  {srv.status === 'assigned' && (
                    <button
                      onClick={() => handleUpdateStatus(srv.id, 'in_progress')}
                      className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all"
                    >
                      Start Service
                    </button>
                  )}

                  {srv.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(srv.id, 'completed')}
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {srv.status !== 'completed' && srv.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(srv.id, 'cancelled')}
                      className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-400 font-semibold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                No service tickets found matching the specified filters.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Assign Technician Modal */}
      {assignModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Assign Service Technician
              </h3>
              <button
                onClick={() => setAssignModalBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Ticket Reference
                </label>
                <input
                  type="text"
                  disabled
                  value={`${assignModalBooking.ticketNumber} (${assignModalBooking.purifierBrand})`}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Technician Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={techPhone}
                  onChange={(e) => setTechPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Instructions / Spares Kit Notes
                </label>
                <textarea
                  rows={3}
                  value={techNote}
                  onChange={(e) => setTechNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md shadow-cyan-600/20"
                >
                  Confirm & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
