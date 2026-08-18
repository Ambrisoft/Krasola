import React from 'react';
import { 
  Palette, Layers, Heart, FolderHeart, Sparkles, Zap, Image as ImageIcon, 
  Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APP_VERSION } from '../utils/versionManager';

export default function Home({ setActiveTab, savedCount = 0, activePalette = [] }) {
  const { theme } = useTheme();
  const swatches = activePalette.map(c => typeof c === 'string' ? c : c?.hex || '#6366f1');

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      {/* 1. Hero Workspace Dashboard Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-850 p-8 md:p-12 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              <Sparkles size={12} />
              <span>Introducing Krasola v{APP_VERSION}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              The Ultimate Unified <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-300">Creative Workspace</span>
            </h2>
            
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Krasola combines essential utility tools for designers and developers in a single, high-performance dashboard. Create color schemes, construct dynamic SVG patterns, customize icons, and search/edit imagery client-side with zero latency.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('palette')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <Zap size={16} /> Get Started
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl border bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200 transition-all"
              >
                Saved Assets ({savedCount})
              </button>
            </div>
          </div>

          {/* Hero Sidebar: Workspace Info & Active Swatches Grid */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
            <div className="border-b border-indigo-500/20 pb-2 flex justify-between items-center text-xs font-bold text-slate-200">
              <span>ACTIVE SYSTEM STATE</span>
              <span className="text-[10px] text-indigo-400 font-mono">LIVE STATUS</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Theme status */}
              <div className="flex justify-between items-center text-slate-300">
                <span>Active Theme Mode</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase text-[9px] flex items-center gap-1">
                  {theme.isDark ? <Moon size={10} /> : <Sun size={10} />}
                  {theme.isDark ? 'Dark Theme' : 'Light Theme'}
                </span>
              </div>

              {/* Active Palette Row */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Current Palette Swatches</span>
                  <span className="text-[10px] text-slate-400">{swatches.length} Swatches Loaded</span>
                </div>
                
                <div className="flex h-8 rounded-lg overflow-hidden border border-black/10">
                  {swatches.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[10px] italic opacity-60 text-slate-400">
                      No palette loaded. Generate one in Palette Lab!
                    </div>
                  ) : (
                    swatches.map((hex, i) => (
                      <div key={i} style={{ backgroundColor: hex }} className="flex-1" title={hex} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Upgraded Creative Suites Launcher Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Explore Creator Suites</h3>
          <p className={`text-xs ${theme.textMuted}`}>Launch any of the built-in design utility panels.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Palette Lab */}
          <div
            onClick={() => setActiveTab('palette')}
            className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-60 relative overflow-hidden border ${theme.card} hover:border-indigo-500/40 hover:-translate-y-1.5`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <Palette size={20} />
              </div>
              <h4 className="font-bold text-base group-hover:text-indigo-400 transition-colors">Palette Lab</h4>
              <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                Generate aesthetic 5-color palettes based on mathematical rules. Check WCAG contrast and adjust HSL attributes.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 mt-4 group-hover:translate-x-1.5 transition-transform">
              Launch Suite <span>→</span>
            </div>
          </div>

          {/* Card 2: Pattern Studio */}
          <div
            onClick={() => setActiveTab('pattern')}
            className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-60 relative overflow-hidden border ${theme.card} hover:border-emerald-500/40 hover:-translate-y-1.5`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <h4 className="font-bold text-base group-hover:text-emerald-400 transition-colors">Pattern Studio</h4>
              <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                Build seamless vector patterns. Scale, rotate, adjust spacing, and assign colors to shapes using 16 standard SVG formulas.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-4 group-hover:translate-x-1.5 transition-transform">
              Launch Suite <span>→</span>
            </div>
          </div>

          {/* Card 3: Icon Finder */}
          <div
            onClick={() => setActiveTab('icon')}
            className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-60 relative overflow-hidden border ${theme.card} hover:border-sky-500/40 hover:-translate-y-1.5`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:scale-110 transition-transform">
                <Heart size={20} />
              </div>
              <h4 className="font-bold text-base group-hover:text-sky-400 transition-colors">Icon Finder</h4>
              <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                Search over 150,000 icons. Adjust scale, stroke thickness, rotation, and apply active color palettes to SVGs in real time.
              </p>
            </div>
            <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5 mt-4 group-hover:translate-x-1.5 transition-transform">
              Launch Suite <span>→</span>
            </div>
          </div>

          {/* Card 4: Image Studio */}
          <div
            onClick={() => setActiveTab('imagesearch')}
            className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-60 relative overflow-hidden border ${theme.card} hover:border-purple-500/40 hover:-translate-y-1.5`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <ImageIcon size={20} />
              </div>
              <h4 className="font-bold text-base group-hover:text-purple-400 transition-colors">Image Studio</h4>
              <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                Search 600M+ CC imagery. Extract 5-color palettes, edit photos on 60fps canvas, inspect licensing, and export code.
              </p>
            </div>
            <div className="text-xs font-semibold text-purple-400 flex items-center gap-1.5 mt-4 group-hover:translate-x-1.5 transition-transform">
              Launch Suite <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
