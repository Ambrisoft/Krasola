import React from 'react';
import { Grid } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternTemplates({ 
  patternTypes, 
  patternType, 
  setPatternType,
  width, height, scale, stroke,
  bg, color1, color2
}) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Pattern Templates</h3>
        <p className={`text-xs ${theme.textMuted}`}>Select from 10+ standard geometric, wave, or grid repeatable layouts.</p>
      </div>

      {/* Grid of pattern cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 overflow-y-auto max-h-[460px] pr-2">
        {Object.entries(patternTypes).map(([key, value]) => {
          const isSelected = patternType === key;
          
          // Generate a small localized preview SVG
          const innerSvg = value.svg(30, 30, 0.9, 1.5, color1, color2, bg);
          const previewSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>${innerSvg.replace('id="pattern"', `id="preview-${key}"`)}</defs>
              <rect width="100%" height="100%" fill="url(#preview-${key})" />
            </svg>
          `;

          return (
            <button
              key={key}
              onClick={() => setPatternType(key)}
              className={`text-left rounded-2xl border p-3 flex flex-col justify-between h-36 transition-all duration-300 relative group overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : theme.isDark
                    ? 'border-slate-850 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/50'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/20 hover:bg-slate-50/50'
              }`}
            >
              {/* Pattern Mini Preview Canvas */}
              <div 
                className="w-full h-20 rounded-xl overflow-hidden border border-black/10 shadow-inner"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />

              {/* Title */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider block leading-tight truncate">
                  {value.name}
                </span>
                <span className={`text-[8px] uppercase tracking-widest ${theme.textMuted}`}>
                  {key}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
