import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useInvestigation();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const getIcon = () => {
          switch (n.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />;
            case 'error':
              return <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />;
          }
        };

        return (
          <div
            key={n.id}
            className="pointer-events-auto bg-white border border-slate-200 rounded-lg shadow-lg p-3.5 flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200"
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono ml-2">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
