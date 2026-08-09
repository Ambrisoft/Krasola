import React, { useState } from 'react';
import { Grid, Zap, Layers, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternExplorer({ 
  patternTypes, 
  patternType, 
  onLoadTemplate,
  bg, color1, color2,
  isPaletteImported = false
}) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Minimalist', 'Geometric', 'Flow', '3D', 'Tech', 'Abstract', 'Heritage', 'Weave', 'Stellar'];

  const filteredEntries = Object.entries(patternTypes).filter(([key, value]) => {
    if (selectedCategory === 'All') return true;
    return value.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Sub Header & Palette Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Templates Gallery (16 Formulas)</h3>
          <p className={`text-xs ${theme.textMuted}`}>Browse curated geometric pattern formulas. Hover over any card to load into Canvas Studio.</p>
        </div>

        {/* Palette Connection Status Badge */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
          isPaletteImported
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <Sparkles size={12} className={isPaletteImported ? 'text-emerald-400' : 'text-indigo-400'} />
          <span>{isPaletteImported ? 'Linked to Active Palette' : 'Default Curated Presets'}</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b dark:border-slate-800 border-slate-200">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-1 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : theme.isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of 16 Pattern Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto max-h-[500px] pr-2">
        {filteredEntries.map(([key, value]) => {
          const isSelected = patternType === key;

          // If palette is imported, use active palette colors; otherwise use template's default curated colors!
          const renderBg = isPaletteImported ? bg : (value.defaultBg || '#0f172a');
          const renderC1 = isPaletteImported ? color1 : (value.defaultColor1 || '#6366f1');
          const renderC2 = isPaletteImported ? color2 : (value.defaultColor2 || '#38bdf8');

          const innerSvg = value.svg(30, 30, 0.95, 1.5, renderC1, renderC2, renderBg);
          const previewSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>${innerSvg.replace('id="pattern"', `id="explorer-${key}"`)}</defs>
              <rect width="100%" height="100%" fill="url(#explorer-${key})" />
            </svg>
          `;

          return (
            <div
              key={key}
              onClick={() => onLoadTemplate && onLoadTemplate(key)}
              className={`text-left rounded-2xl border p-3 flex flex-col justify-between h-40 transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20'
                  : theme.isDark
                    ? 'border-slate-850 hover:border-slate-700 bg-slate-900/30'
                    : 'border-slate-200 hover:border-slate-350 bg-slate-50/20'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="w-full h-24 rounded-xl overflow-hidden border border-black/10 shadow-inner relative">
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />

                {/* Top-Right Load Button on Hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onLoadTemplate) onLoadTemplate(key);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg flex items-center gap-1 shadow-lg transition-all duration-300 z-10"
                  title="Load template into Canvas Studio"
                >
                  <Zap size={9} /> Load
                </button>
              </div>

              {/* Info Label */}
              <div className="pt-2 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-[10px] font-black uppercase tracking-wider block truncate">
                    {value.name}
                  </span>
                  <span className={`text-[8px] uppercase tracking-widest ${theme.textMuted}`}>
                    {value.category || key}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
