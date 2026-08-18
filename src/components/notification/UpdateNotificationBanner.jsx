import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { applyAppUpdate } from '../../utils/versionManager';

export const UpdateNotificationBanner = ({ updateInfo, onDismiss }) => {
  const { theme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!updateInfo || !updateInfo.hasUpdate) return null;

  const handleUpdateNow = async () => {
    setIsUpdating(true);
    await applyAppUpdate();
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-md w-[calc(100vw-2rem)] animate-fadeIn">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3.5 transition-all duration-300 ${
        theme.isDark 
          ? 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/60' 
          : 'bg-white/95 border-indigo-300 text-slate-900 shadow-xl'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight truncate">
                Update Available!
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-400">
                v{updateInfo.latestVersion}
              </span>
            </div>
            <p className={`text-[11px] font-medium leading-tight truncate ${theme.textMuted}`}>
              A new version of Krasola is ready to use.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleUpdateNow}
            disabled={isUpdating}
            className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <RefreshCw size={12} className={isUpdating ? 'animate-spin' : ''} />
            <span>{isUpdating ? 'Updating...' : 'Update Now'}</span>
          </button>

          <button
            onClick={onDismiss}
            className={`p-1.5 rounded-lg border transition-all ${
              theme.isDark 
                ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
                : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
            title="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
