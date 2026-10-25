import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'dealer' | 'service' | 'payment';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order' }) => {
  const normalized = (status || '').toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      // Success states
      case 'delivered':
      case 'approved':
      case 'completed':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';

      // Primary / Active states
      case 'processing':
      case 'shipped':
      case 'assigned':
      case 'in_progress':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800';

      // Confirmed / Info
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';

      // Warning / Pending states
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';

      // Danger / Cancelled / Rejected
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';

      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getLabel = () => {
    switch (normalized) {
      case 'in_progress':
        return 'In Progress';
      default:
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {getLabel()}
    </span>
  );
};
