import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    show: showToast,
    success: (msg, duration) => showToast(msg, 'success', duration),
    error: (msg, duration) => showToast(msg, 'error', duration),
    info: (msg, duration) => showToast(msg, 'info', duration),
    warning: (msg, duration) => showToast(msg, 'warning', duration)
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300 dark:text-rose-200 shadow-rose-950/40',
          icon: <AlertCircle size={16} className="text-rose-400 shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300 dark:text-amber-200 shadow-amber-950/40',
          icon: <AlertTriangle size={16} className="text-amber-400 shrink-0" />
        };
      case 'info':
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-300 dark:text-sky-200 shadow-sky-950/40',
          icon: <Info size={16} className="text-sky-400 shrink-0" />
        };
      case 'success':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 dark:text-emerald-200 shadow-emerald-950/40',
          icon: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const { bg, icon } = getToastStyles(t.type);
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-fadeIn ${bg}`}
              role="alert"
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-xs font-semibold leading-snug">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded-lg shrink-0"
                aria-label="Close notification"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
