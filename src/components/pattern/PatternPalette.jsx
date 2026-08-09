import React from 'react';
import { Palette, Check, RefreshCw, Sparkles, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternPalette({ 
  activePalette = [], 
  onImportPalette,
  onSwapColors,
  onRestoreDefaults,
  isPaletteImported = false,
  bg, setBg, 
  color1, setColor1, 
  color2, setColor2 
}) {
  const { theme } = useTheme();

  const swatches = activePalette.map(c => typeof c === 'string' ? c : c?.hex || '#6366f1');

  const handleColorSelect = (role, hex) => {
    if (role === 'bg') setBg(hex);
    else if (role === 'color1') setColor1(hex);
    else if (role === 'color2') setColor2(hex);
  };

  return (
    <div className="space-y-6">
      {/* Sub Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Palette Connector</h3>
          <p className={`text-xs ${theme.textMuted}`}>Map color palette values manually to specific vector layout roles.</p>
        </div>

        <div className="flex items-center gap-2">
          {onSwapColors && (
            <button
              onClick={onSwapColors}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Rotate Color Roles (BG -> C1 -> C2)"
            >
              <ArrowRightLeft size={12} /> Swap Roles
            </button>
          )}

          {isPaletteImported && onRestoreDefaults && (
            <button
              onClick={onRestoreDefaults}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                theme.isDark ? 'bg-slate-805 hover:bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title="Restore template's original curated colors"
            >
              <RotateCcw size={12} /> Use Original Colors
            </button>
          )}

          <button
            onClick={onImportPalette}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md"
            title="Manually import active colors from Palette Lab"
          >
            <RefreshCw size={13} /> Import Active Palette Colors
          </button>
        </div>
      </div>

      {/* Shared Active Palette Source */}
      <div className={`p-4 border rounded-3xl space-y-4 ${theme.card}`}>
        <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-200 pb-2">
          <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Design Palette Source</span>
          
          <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
            isPaletteImported
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}>
            <Sparkles size={9} />
            <span>{isPaletteImported ? 'Active Palette Linked' : 'Default Presets (Click Import to Link)'}</span>
          </div>
        </div>
        
        <div className="flex h-12 rounded-xl overflow-hidden border border-black/10">
          {swatches.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs italic opacity-60">
              No palette loaded. Generate one in Palette Lab first!
            </div>
          ) : (
            swatches.map((hex, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: hex }}
                className="flex-1 hover:scale-105 transition-transform cursor-pointer relative group flex items-center justify-center"
                title={`HEX: ${hex}`}
                onClick={() => {
                  navigator.clipboard.writeText(hex);
                }}
              >
                <span className="text-[9px] font-bold text-white bg-slate-950/60 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx + 1}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Color Role Mapping Cards */}
      {swatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Background Role */}
          <div className={`border rounded-2xl p-4 space-y-3 ${theme.card}`}>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Background Color</h4>
              <span className={`text-[9px] ${theme.textMuted}`}>Sets the backdrop behind patterns</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {swatches.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorSelect('bg', hex)}
                  style={{ backgroundColor: hex }}
                  className="h-8 rounded-lg border border-black/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white"
                  title={`Map color ${idx + 1}`}
                >
                  {bg === hex && <Check size={11} className="drop-shadow-md stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Geometries Role */}
          <div className={`border rounded-2xl p-4 space-y-3 ${theme.card}`}>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Primary Geometries</h4>
              <span className={`text-[9px] ${theme.textMuted}`}>Fills main repeatable shapes</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {swatches.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorSelect('color1', hex)}
                  style={{ backgroundColor: hex }}
                  className="h-8 rounded-lg border border-black/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white"
                  title={`Map color ${idx + 1}`}
                >
                  {color1 === hex && <Check size={11} className="drop-shadow-md stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Highlights Role */}
          <div className={`border rounded-2xl p-4 space-y-3 ${theme.card}`}>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Secondary Highlights</h4>
              <span className={`text-[9px] ${theme.textMuted}`}>Accents on highlights & lines</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {swatches.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorSelect('color2', hex)}
                  style={{ backgroundColor: hex }}
                  className="h-8 rounded-lg border border-black/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white"
                  title={`Map color ${idx + 1}`}
                >
                  {color2 === hex && <Check size={11} className="drop-shadow-md stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
