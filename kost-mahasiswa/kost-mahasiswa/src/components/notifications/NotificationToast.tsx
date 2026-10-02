import React from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast, setActiveTab } = useApp();

  if (!activeToast) return null;

  const handleAction = () => {
    if (activeToast.linkAction) {
      setActiveTab(activeToast.linkAction as any);
    }
    dismissToast();
  };

  const getIcon = () => {
    switch (activeToast.type) {
      case 'booking':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'payment_due':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'system':
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Notifikasi Sistem Push
            </span>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-0.5">
            {activeToast.title}
          </h4>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {activeToast.message}
          </p>

          {activeToast.linkAction && (
            <button
              onClick={handleAction}
              className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Lihat Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
