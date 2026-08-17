import React from 'react';
import { 
  Download, 
  X, 
  Laptop, 
  Smartphone, 
  Zap, 
  Sparkles, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { usePwaInstall } from '../../utils/pwaManager';

export default function PwaInstallModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { canInstall, isInstalled, isIOS, triggerInstallPrompt } = usePwaInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const res = await triggerInstallPrompt();
    if (res.success) {
      toast.success("Thank you for installing Krasola!");
      onClose();
    } else if (res.outcome === 'dismissed') {
      toast.info("Installation postponed.");
    } else if (res.reason === 'no_prompt') {
      if (isIOS) {
        toast.info("Please follow the iOS instructions below to add to your Home Screen.");
      } else {
        toast.info("Use your browser's menu (top right) and select 'Install Krasola' or 'Add to Apps'.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-7 space-y-6 relative overflow-hidden backdrop-blur-2xl ${theme.card} ${
          theme.isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/95'
        }`}
      >
        {/* Background glow circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close button */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-xl">
                K
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">Install Krasola App</h3>
              <p className={`text-xs ${theme.textMuted}`}>Run Krasola as a standalone native app on your device.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              theme.isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Key App Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className={`p-3.5 rounded-2xl border text-center space-y-1 ${
            theme.isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Zap size={16} className="mx-auto text-indigo-400" />
            <h4 className="text-xs font-bold">Dedicated Window</h4>
            <p className={`text-[10px] ${theme.textMuted}`}>No browser URL bars or tabs</p>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center space-y-1 ${
            theme.isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Sparkles size={16} className="mx-auto text-sky-400" />
            <h4 className="text-xs font-bold">Instant 1-Click Launch</h4>
            <p className={`text-[10px] ${theme.textMuted}`}>From desktop taskbar or home screen</p>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center space-y-1 ${
            theme.isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <ShieldCheck size={16} className="mx-auto text-emerald-400" />
            <h4 className="text-xs font-bold">Offline Ready</h4>
            <p className={`text-[10px] ${theme.textMuted}`}>Cached assets for ultra-fast load</p>
          </div>
        </div>

        {/* Installation Instructions / Dynamic States */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
            <CheckCircle2 size={24} className="shrink-0" />
            <div>
              <h4 className="text-xs font-bold">Krasola is Already Installed!</h4>
              <p className="text-[11px] text-emerald-300/80">You can launch Krasola directly from your applications menu or home screen.</p>
            </div>
          </div>
        ) : isIOS ? (
          /* iOS Safari Instructions */
          <div className={`p-4 rounded-2xl border space-y-3 ${
            theme.isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <Smartphone size={14} /> iOS / Safari Installation Guide:
            </h4>
            <ol className="text-xs space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong className="text-white">Share</strong> button <Share size={12} className="inline mx-1 text-sky-400" /> in Safari’s toolbar.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare size={12} className="inline mx-1 text-emerald-400" />.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong className="text-white">Add</strong> in the top right to complete install.</span>
              </li>
            </ol>
          </div>
        ) : (
          /* Chrome / Edge / Android / Desktop Install */
          <div className="space-y-3 pt-2">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 active:scale-[0.98] text-white text-sm font-extrabold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} /> Install Standalone App
            </button>
            <p className={`text-center text-[11px] ${theme.textMuted}`}>
              Compatible with Chrome, Edge, Brave, Opera, and Android browsers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
