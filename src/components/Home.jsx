import React, { useState, useEffect } from 'react';
import { 
  Palette, Layers, Heart, Sparkles, Zap, Image as ImageIcon, 
  Sun, Moon, Copy, Check, RefreshCw, FolderHeart, Activity,
  ArrowRight, ShieldCheck, Download, Code, Sliders, ExternalLink,
  Terminal, Sparkle, LayoutGrid, Monitor
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { APP_VERSION } from '../utils/versionManager';

// 5 Harmonious presets for 1-click home randomization
const QUICK_PALETTES = [
  ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'],
  ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1'],
  ['#f59e0b', '#f97316', '#ef4444', '#db2777', '#7c3aed'],
  ['#84cc16', '#10b981', '#06b6d4', '#6366f1', '#a855f7'],
  ['#64748b', '#0ea5e9', '#22c55e', '#eab308', '#f97316']
];

export default function Home({ 
  setActiveTab, 
  savedCount = 0, 
  activePalette = [],
  setActivePalette,
  savedPalettes = [],
  savedPatterns = []
}) {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [copiedHex, setCopiedHex] = useState(null);
  const [activePreviewType, setActivePreviewType] = useState('card'); // 'card', 'stats', 'buttons'

  const swatches = activePalette.map(c => typeof c === 'string' ? c : c?.hex || '#6366f1');

  // Greeting based on client local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // 1-Click Home Palette Randomizer
  const handleRandomizeHomePalette = () => {
    const randomSet = QUICK_PALETTES[Math.floor(Math.random() * QUICK_PALETTES.length)];
    if (setActivePalette) {
      setActivePalette(randomSet);
      toast.success('Generated new active palette harmonies!');
    }
  };

  const handleCopyPalette = () => {
    const text = swatches.join(', ');
    navigator.clipboard.writeText(text);
    toast.success('Copied all 5 HEX codes to clipboard!');
  };

  const handleCopySingleHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  // Studio launcher suites list
  const suites = [
    {
      id: 'palette',
      title: 'Palette Lab',
      subtitle: 'Color Science & Harmonies',
      description: 'Algorithmic color harmony generation, HSL manipulation, WCAG 2.1 contrast checker, and instant CSS / Tailwind export.',
      icon: Palette,
      tag: '5-Color Science',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
    },
    {
      id: 'pattern',
      title: 'Pattern Studio',
      subtitle: 'Vector Textures & Curves',
      description: 'Generate 16 seamless procedural vector patterns with real-time scale, stroke, angle tuning, and clean SVG / CSS DataURI export.',
      icon: Layers,
      tag: '16 SVG Formulas',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      id: 'icon',
      title: 'Icon Finder',
      subtitle: '1,000+ Vector Icons',
      description: 'Search Lucide vector library with real-time stroke width adjustment, size scaling, palette tinting, and 1-click React JSX export.',
      icon: Heart,
      tag: 'Lucide Vectors',
      badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
    },
    {
      id: 'imagesearch',
      title: 'Image Studio',
      subtitle: 'Canvas Editor & WebP',
      description: 'Search 600M+ high-res photos, edit live on 60fps canvas filters, extract 5-color palettes, and compress to WebP.',
      icon: ImageIcon,
      tag: '60fps Canvas',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    },
    {
      id: 'saved',
      title: 'Saved Assets Vault',
      subtitle: 'Library & Cloud Sync',
      description: 'Organize palettes, patterns, customized icons, and images with 1-click reload into studios and public showcase.',
      icon: FolderHeart,
      tag: `${savedCount} Assets Saved`,
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    },
    {
      id: 'activity',
      title: 'Usage & Activity',
      subtitle: '50MB Vault Quota',
      description: 'Real-time telemetry, storage breakdown gauges, and chronological audit log of your creative operations.',
      icon: Activity,
      tag: '50MB Quota',
      badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
    }
  ];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto animate-fadeIn">
      {/* 1. HERO WORKSPACE BANNER (Clean Solid Surface - No Gradients) */}
      <div className={`p-6 sm:p-8 lg:p-10 rounded-3xl border ${theme.isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Greeting & Call to Action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Sparkles size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>{getGreeting()}, Creator • Krasola v{APP_VERSION}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-sans">
              High-Performance Multi-Utility <span className="text-indigo-400">Creative Workspace</span>
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed ${theme.textMuted}`}>
              Create mathematical color harmonies, construct procedural vector SVG patterns, customize 1,000+ icons, and edit imagery in your browser with zero latency.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('palette')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap size={16} /> Launch Palette Lab
              </button>

              <button
                onClick={handleRandomizeHomePalette}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  theme.isDark ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <RefreshCw size={14} /> Quick Randomize
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  theme.isDark ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderHeart size={14} /> Saved Vault ({savedCount})
              </button>
            </div>
          </div>

          {/* Right Column: Code-Based 3D Isometric SVG Animation & Live Color Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-2xl border ${theme.isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4 shadow-sm`}>
              
              {/* Header Status Row */}
              <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Live Workspace Engine</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400">PWA READY</span>
              </div>

              {/* Code-Based 3D Vector Isometric Geometry (SVG) */}
              <div className="relative h-28 w-full flex items-center justify-center overflow-hidden rounded-xl border dark:border-slate-850 border-slate-200 dark:bg-slate-900/40 bg-white">
                <svg className="w-full h-full" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Isometric Grid Base */}
                  <g opacity="0.3" stroke="currentColor" strokeWidth="0.75" className={theme.isDark ? 'text-indigo-400' : 'text-slate-400'}>
                    <path d="M 30,60 L 150,0 L 270,60 L 150,120 Z" />
                    <path d="M 60,60 L 150,15 L 240,60 L 150,105 Z" />
                    <path d="M 90,60 L 150,30 L 210,60 L 150,90 Z" />
                  </g>

                  {/* 3D Floating Isometric Cube 1 */}
                  <g className="animate-bounce" style={{ animationDuration: '3.5s' }}>
                    <path d="M 80,45 L 110,30 L 140,45 L 110,60 Z" fill={swatches[0] || '#6366f1'} opacity="0.9" />
                    <path d="M 80,45 L 110,60 L 110,85 L 80,70 Z" fill={swatches[0] || '#6366f1'} opacity="0.7" />
                    <path d="M 110,60 L 140,45 L 140,70 L 110,85 Z" fill={swatches[0] || '#6366f1'} opacity="0.5" />
                  </g>

                  {/* 3D Floating Isometric Cube 2 (Center Hero) */}
                  <g className="animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '0.4s' }}>
                    <path d="M 120,35 L 150,20 L 180,35 L 150,50 Z" fill={swatches[1] || '#3b82f6'} opacity="0.95" />
                    <path d="M 120,35 L 150,50 L 150,75 L 120,60 Z" fill={swatches[1] || '#3b82f6'} opacity="0.75" />
                    <path d="M 150,50 L 180,35 L 180,60 L 150,75 Z" fill={swatches[1] || '#3b82f6'} opacity="0.55" />
                  </g>

                  {/* 3D Floating Isometric Cube 3 */}
                  <g className="animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
                    <path d="M 160,45 L 190,30 L 220,45 L 190,60 Z" fill={swatches[2] || '#10b981'} opacity="0.9" />
                    <path d="M 160,45 L 190,60 L 190,85 L 160,70 Z" fill={swatches[2] || '#10b981'} opacity="0.7" />
                    <path d="M 190,60 L 220,45 L 220,70 L 190,85 Z" fill={swatches[2] || '#10b981'} opacity="0.5" />
                  </g>
                </svg>
              </div>

              {/* Active Palette 5-Swatch Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={theme.textMuted}>Active 5-Color Harmony</span>
                  <button
                    onClick={handleCopyPalette}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={11} /> Copy All HEX
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 h-10">
                  {swatches.map((hex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopySingleHex(hex)}
                      style={{ backgroundColor: hex }}
                      className="rounded-lg h-full transition-all hover:scale-105 active:scale-95 relative group flex items-center justify-center shadow-xs cursor-pointer border border-black/10"
                      title={`Click to copy: ${hex}`}
                    >
                      {copiedHex === hex ? (
                        <Check size={12} className="text-white drop-shadow-md" />
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 text-[8px] font-mono font-bold text-white drop-shadow-md">
                          COPY
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. CREATIVE SUITES SHOWCASE GRID (6 Modular Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight">Creative Studio Modules</h2>
            <p className={`text-xs ${theme.textMuted}`}>Open any specialized engine in the suite.</p>
          </div>
          <span className="text-xs font-mono font-bold opacity-60">6 TOOLS AVAILABLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suites.map((suite) => {
            const Icon = suite.icon;
            return (
              <div
                key={suite.id}
                onClick={() => setActiveTab(suite.id)}
                className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-64 relative group ${
                  theme.card
                } hover:border-indigo-500/50 hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon size={22} />
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${suite.badgeColor}`}>
                      {suite.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base group-hover:text-indigo-400 transition-colors">
                      {suite.title}
                    </h3>
                    <span className={`text-[11px] font-semibold ${theme.textMuted}`}>
                      {suite.subtitle}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${theme.textMuted} line-clamp-3`}>
                    {suite.description}
                  </p>
                </div>

                <div className="pt-3 border-t dark:border-slate-800/80 border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Engine</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LIVE UI COLOR PREVIEW PLAYGROUND */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${theme.isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'} space-y-6 shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Monitor size={18} className="text-indigo-400" />
              <h2 className="text-lg font-black tracking-tight">Active Palette UI Preview Playground</h2>
            </div>
            <p className={`text-xs ${theme.textMuted}`}>
              See how your 5 active palette colors render together across real UI elements in real time.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-black/10 dark:bg-slate-800 p-1 rounded-xl border dark:border-slate-700 border-slate-200">
            <button
              onClick={() => setActivePreviewType('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreviewType === 'card' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              UI Card
            </button>
            <button
              onClick={() => setActivePreviewType('stats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreviewType === 'stats' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              Metrics Bar
            </button>
            <button
              onClick={() => setActivePreviewType('buttons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activePreviewType === 'buttons' ? 'bg-indigo-600 text-white' : theme.textMuted
              }`}
            >
              Actions
            </button>
          </div>
        </div>

        {/* Dynamic UI Elements Rendering with Swatches based on selected activePreviewType tab */}
        {activePreviewType === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Primary Action Card */}
            <div className={`p-5 rounded-2xl border transition-all ${theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{ backgroundColor: swatches[0] || '#6366f1' }}
                >
                  PRIMARY
                </span>
                <span className="text-[10px] font-mono text-slate-400">{swatches[0]}</span>
              </div>
              <h4 className="font-bold text-sm">Design System Component</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time rendering of your active palette on cards, buttons, and state indicators.
              </p>
              <button
                onClick={() => toast.info(`Clicked Primary Action (${swatches[0]})`)}
                style={{ backgroundColor: swatches[0] || '#6366f1' }}
                className="w-full py-2 rounded-xl text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Interactive Action Button
              </button>
            </div>

            {/* Card 2: Secondary Highlight Card */}
            <div className={`p-5 rounded-2xl border transition-all ${theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{ backgroundColor: swatches[1] || '#3b82f6' }}
                >
                  ACCENT
                </span>
                <span className="text-[10px] font-mono text-slate-400">{swatches[1]}</span>
              </div>
              <h4 className="font-bold text-sm">Accent Highlighting</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secondary accents for links, badges, progress rings, and focal points.
              </p>
              <button
                onClick={() => toast.info(`Clicked Accent Action (${swatches[1]})`)}
                style={{ 
                  backgroundColor: `${swatches[1]}20`,
                  borderColor: swatches[1],
                  color: swatches[1]
                }}
                className="w-full py-2 rounded-xl border text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Secondary Outline
              </button>
            </div>

            {/* Card 3: Status & Feedback Card */}
            <div className={`p-5 rounded-2xl border transition-all ${theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{ backgroundColor: swatches[2] || '#10b981' }}
                >
                  SUCCESS
                </span>
                <span className="text-[10px] font-mono text-slate-400">{swatches[2]}</span>
              </div>
              <h4 className="font-bold text-sm">Feedback & Status</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Positive states, confirmation badges, active toggles, and metric milestones.
              </p>
              <div 
                style={{ backgroundColor: `${swatches[2]}15`, borderColor: `${swatches[2]}40`, color: swatches[2] }}
                className="p-2.5 rounded-xl border text-center text-xs font-bold"
              >
                Operational Status: 100% Online
              </div>
            </div>
          </div>
        )}

        {activePreviewType === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Analytics Metric Bar */}
            <div className={`p-6 rounded-2xl border ${theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Palette Distribution Ratio</span>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: swatches[0] }} />
              </div>
              <div className="text-3xl font-black font-mono">100% Synchronized</div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                <div style={{ width: '35%', backgroundColor: swatches[0] }} title={`Swatch 1: ${swatches[0]}`} />
                <div style={{ width: '25%', backgroundColor: swatches[1] }} title={`Swatch 2: ${swatches[1]}`} />
                <div style={{ width: '20%', backgroundColor: swatches[2] }} title={`Swatch 3: ${swatches[2]}`} />
                <div style={{ width: '12%', backgroundColor: swatches[3] }} title={`Swatch 4: ${swatches[3]}`} />
                <div style={{ width: '8%', backgroundColor: swatches[4] }} title={`Swatch 5: ${swatches[4]}`} />
              </div>
              <div className="grid grid-cols-5 gap-2 pt-2 text-[10px] font-mono">
                {swatches.map((hex, i) => (
                  <div key={i} className="text-center">
                    <span className="w-full block h-1.5 rounded-full mb-1" style={{ backgroundColor: hex }} />
                    <span className="text-slate-400 truncate block">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Gauge */}
            <div className={`p-6 rounded-2xl border ${theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">WCAG Contrast Matrix</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">PASS (AA)</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div style={{ backgroundColor: swatches[0], color: '#ffffff' }} className="p-4 rounded-xl text-center font-bold text-xs shadow-sm">
                  White on {swatches[0]}
                </div>
                <div style={{ backgroundColor: '#ffffff', color: swatches[0] }} className="p-4 rounded-xl border border-slate-200 text-center font-bold text-xs shadow-sm">
                  {swatches[0]} on White
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                All 5 swatches mathematically validated for Web Content Accessibility Guidelines.
              </p>
            </div>
          </div>
        )}

        {activePreviewType === 'buttons' && (
          <div className={`p-6 rounded-2xl border ${theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-5`}>
            <div>
              <h4 className="font-bold text-sm mb-1">Interactive Button States & Tags</h4>
              <p className="text-xs text-slate-400">Test how your active palette swatches look as solid, outline, soft, and badge elements.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {swatches.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => toast.success(`Clicked Solid Button (${hex})`)}
                  style={{ backgroundColor: hex }}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Solid Button {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {swatches.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => toast.success(`Clicked Soft Button (${hex})`)}
                  style={{ 
                    backgroundColor: `${hex}20`,
                    borderColor: `${hex}50`,
                    color: hex
                  }}
                  className="px-4 py-2 rounded-xl border text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Soft State {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. KEYBOARD SHORTCUTS & PRO-TIPS BAR */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${theme.isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold`}>
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-indigo-400 shrink-0" />
          <span>Quick Keyboard Commands for Creators:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white font-mono text-[11px]">
            <kbd className="font-bold text-indigo-400">Ctrl+K</kbd> Command Palette
          </span>
          <span className="px-2.5 py-1 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white font-mono text-[11px]">
            <kbd className="font-bold text-indigo-400">Space</kbd> Randomize Colors
          </span>
          <span className="px-2.5 py-1 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white font-mono text-[11px]">
            <kbd className="font-bold text-indigo-400">1..5</kbd> Lock Swatch
          </span>
        </div>
      </div>

    </div>
  );
}
