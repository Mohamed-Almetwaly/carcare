import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-900/95 text-white border-emerald-700 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700 shadow-rose-950/20'
              : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/20'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300" />}
          </div>
          <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
          <button
            id={`toast-close-${toast.id}`}
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-slate-400 hover:text-white transition-colors p-0.5 rounded"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
