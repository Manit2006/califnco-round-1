'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { dataStore } from '../../lib/dataStore';
import { DealerApplication, DealerStatus } from '../../types';
import {
  UserCheck,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function DealerApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<DealerApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const sync = () => {
      setApplications([...dataStore.getDealerApplications()]);
    };
    sync();
    const unsubscribe = dataStore.subscribe(sync);
    return () => unsubscribe();
  }, []);

  const filtered = applications.filter((app) => {
    const matchSearch =
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.gstin.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = (app: DealerApplication) => {
    const confirmApprove = confirm(`Approve wholesale dealer account for "${app.companyName}"? This will enable tier-1 wholesale pricing.`);
    if (confirmApprove) {
      dataStore.updateDealerStatus(app.id, 'approved', 'Verified GSTIN and trade documents by Admin');
    }
  };

  const handleReject = (app: DealerApplication) => {
    const reason = prompt(`Enter rejection reason for "${app.companyName}":`, 'Invalid or mismatched GSTIN documents');
    if (reason !== null) {
      dataStore.updateDealerStatus(app.id, 'rejected', reason);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} title="Dealer Approvals" />

        <main className="p-4 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dealer Applications ({applications.length})
              </h2>
              <p className="text-xs text-slate-500">
                Verify business credentials & authorize wholesale water purifier purchasing
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company, GSTIN, applicant..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved Dealers</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{app.companyName}</h3>
                        <p className="text-xs text-slate-500">
                          {app.applicantName} • {app.phone}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} type="dealer" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        GSTIN Number
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{app.gstin}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Trade License
                      </span>
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                        {app.tradeLicense}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Years in Business
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {app.yearsInBusiness} Years
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Application Date
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{app.billingAddress}</span>
                  </div>

                  {app.adminNotes && (
                    <div className="mt-2 text-xs text-slate-500 italic">
                      Review Note: "{app.adminNotes}"
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3">
                  {app.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(app)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Unlock Wholesale</span>
                      </button>
                      <button
                        onClick={() => handleReject(app)}
                        className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 font-semibold text-xs border border-rose-200 dark:border-rose-800 flex items-center justify-center space-x-1 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : app.status === 'approved' ? (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Wholesale Account Active</span>
                      </span>
                      <button
                        onClick={() => dataStore.updateDealerStatus(app.id, 'rejected', 'Revoked by Admin')}
                        className="text-xs text-rose-500 hover:underline font-normal"
                      >
                        Revoke Access
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-rose-500 font-semibold">
                      <span>Application Rejected</span>
                      <button
                        onClick={() => handleApprove(app)}
                        className="text-xs text-cyan-600 hover:underline font-normal"
                      >
                        Re-evaluate & Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                No dealer applications found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
