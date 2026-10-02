import React from 'react';
import { AppointmentStatus } from '../../types';
import { Clock, CheckCircle2, Wrench, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  }[size];

  switch (status) {
    case 'Pending':
      return (
        <span
          id={`status-badge-pending`}
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          Pending
        </span>
      );
    case 'Confirmed':
      return (
        <span
          id={`status-badge-confirmed`}
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          Confirmed
        </span>
      );
    case 'In Service':
      return (
        <span
          id={`status-badge-in-service`}
          className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 ${sizeClasses}`}
        >
          <Wrench className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
          In Service
        </span>
      );
    case 'Completed':
      return (
        <span
          id={`status-badge-completed`}
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Completed
        </span>
      );
    case 'Cancelled':
      return (
        <span
          id={`status-badge-cancelled`}
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          id={`status-badge-default`}
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          {status}
        </span>
      );
  }
};
