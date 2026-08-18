import React, { useState, useEffect } from 'react';
import { 
  X, Check, Moon, Sun, Sparkles, Sliders, ShieldCheck, 
  Palette, Eye, ArrowRight 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../utils/themeUtils';

export default function ThemePanelModal({ isOpen, onClose }) {
  const { theme, activeThemeId, setActiveThemeId } = useTheme();
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'dark', 'light'

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredThemes = THEMES.filter((t) => {
    if (filterMode === 'dark') return t.isDark;
    if (filterMode === 'light') return !t.isDark;
    return true;
  });

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ${
          theme.isDark 
            ? 'bg-slate-900/95 border-slate-800 text-slate-100' 
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 md:p-6 border-b flex items-center justify-between shrink-0 ${
          theme.isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-tight">
                Workspace Theme Studio
              </h2>
              <p className={`text-xs ${theme.textMuted}`}>
                Choose from 7 curated design themes with real-time UI synchronization
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              theme.isDark 
                ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Bar & Quick Stats */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
          theme.isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/80 border-slate-100'
        }`}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : theme.isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Themes ({THEMES.length})
            </button>
            <button
              onClick={() => setFilterMode('dark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterMode === 'dark'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : theme.isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Moon size={12} className="text-blue-400" />
              Dark ({THEMES.filter(t => t.isDark).length})
            </button>
            <button
              onClick={() => setFilterMode('light')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterMode === 'light'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : theme.isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sun size={12} className="text-amber-400" />
              Light ({THEMES.filter(t => !t.isDark).length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={theme.textMuted}>Active Theme:</span>
            <span className="font-bold text-indigo-400 flex items-center gap-1">
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: theme.accentHex || '#6366f1' }}
              />
              {theme.name}
            </span>
          </div>
        </div>

        {/* Themes Grid Viewport */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredThemes.map((themeObj) => {
              const isSelected = activeThemeId === themeObj.id;
              return (
                <div
                  key={themeObj.id}
                  onClick={() => setActiveThemeId(themeObj.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative group flex flex-col justify-between gap-4 overflow-hidden ${
                    isSelected 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg' 
                      : theme.isDark 
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-800/40' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  {/* Accent ambient glow */}
                  <div 
                    className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: themeObj.accentHex }}
                  />

                  <div className="space-y-2.5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black tracking-tight">{themeObj.name}</span>
                        {themeObj.isDark ? (
                          <span className="p-1 rounded-md bg-blue-500/10 text-blue-400" title="Dark Palette">
                            <Moon size={11} />
                          </span>
                        ) : (
                          <span className="p-1 rounded-md bg-amber-500/10 text-amber-400" title="Light Palette">
                            <Sun size={11} />
                          </span>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'border-slate-400/40 text-transparent group-hover:border-slate-400'
                      }`}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                    </div>

                    <p className={`text-[11px] ${theme.textMuted} leading-relaxed line-clamp-2`}>
                      {themeObj.description}
                    </p>
                  </div>

                  {/* Real Dynamic Color Swatches & Contrast Tag */}
                  <div className="pt-2 border-t dark:border-slate-800/60 border-slate-200/60 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-inner"
                        style={{ backgroundColor: themeObj.bgHex }}
                        title={`Canvas: ${themeObj.bgHex}`}
                      />
                      <div 
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-inner"
                        style={{ backgroundColor: themeObj.sidebarHex }}
                        title={`Sidebar: ${themeObj.sidebarHex}`}
                      />
                      <div 
                        className="w-5 h-5 rounded-lg border border-black/15 shadow-inner"
                        style={{ backgroundColor: themeObj.accentHex }}
                        title={`Accent: ${themeObj.accentHex}`}
                      />
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-400" />
                      {themeObj.contrastRatio}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t px-6 flex items-center justify-between shrink-0 ${
          theme.isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/20 font-mono text-[10px] font-bold border border-slate-700">
              Esc
            </kbd>
            <span>to close</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            Done <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
