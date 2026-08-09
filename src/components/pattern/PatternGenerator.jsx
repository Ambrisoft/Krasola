import React, { useState } from 'react';
import { Sliders, Sparkles, RotateCcw, ArrowRightLeft, Lock, Unlock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PatternGenerator({ 
  width, setWidth, 
  height, setHeight, 
  scale, setScale, 
  stroke, setStroke, 
  angle, setAngle,
  bg, color1, color2,
  onInspireMe,
  onResetDefaults,
  onSwapColors,
  keepActivePaletteLinked,
  setKeepActivePaletteLinked,
  encodedSvg
}) {
  const { theme } = useTheme();
  const [aspectRatio, setAspectRatio] = useState('square'); // 'square', 'banner', 'card', 'story'

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'banner': return 'aspect-[16/9] min-h-[280px]';
      case 'card': return 'aspect-[4/3] min-h-[300px]';
      case 'story': return 'aspect-[9/16] max-w-sm mx-auto h-[480px]';
      case 'square':
      default: return 'aspect-square min-h-[340px]';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[460px]">
      {/* Left panel: sliders & controls inspector */}
      <div className={`w-full lg:w-80 border rounded-2xl p-5 space-y-4 shrink-0 flex flex-col justify-between ${theme.card}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-200 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-60 flex items-center gap-1">
              <Sliders size={11} /> Transform Tile
            </span>
            
            {/* Quick Role Swap Button */}
            {onSwapColors && (
              <button
                onClick={onSwapColors}
                className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition-all ${
                  theme.isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Swap Color Roles (BG -> C1 -> C2)"
              >
                <ArrowRightLeft size={9} /> Swap Roles
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {/* Width */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Tile Width</span>
                <span>{width}px</span>
              </div>
              <input
                type="range" min="10" max="200" value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Height */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Tile Height</span>
                <span>{height}px</span>
              </div>
              <input
                type="range" min="10" max="200" value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Scale */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Scale</span>
                <span>{(scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min="0.1" max="3" step="0.05" value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Stroke */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Stroke</span>
                <span>{stroke}px</span>
              </div>
              <input
                type="range" min="1" max="15" value={stroke}
                onChange={(e) => setStroke(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Rotation Angle */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Rotation Angle</span>
                <span>{angle}°</span>
              </div>
              <input
                type="range" min="0" max="360" value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Palette Randomizer Lock Toggle */}
          <div className="pt-2 border-t border-slate-700/30 flex items-center justify-between">
            <span className="text-[10px] font-bold opacity-70 flex items-center gap-1">
              {keepActivePaletteLinked ? <Lock size={10} className="text-amber-400" /> : <Unlock size={10} className="text-indigo-400" />}
              <span>Lock Active Palette</span>
            </span>

            <button
              type="button"
              onClick={() => setKeepActivePaletteLinked(!keepActivePaletteLinked)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                keepActivePaletteLinked ? 'bg-amber-500' : 'bg-slate-700'
              }`}
              title={keepActivePaletteLinked ? 'Inspire Me will shuffle active palette' : 'Inspire Me will generate fresh random colors'}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                keepActivePaletteLinked ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Action buttons bar */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={onResetDefaults}
            className={`py-2 px-3 border text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              theme.isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
            title="Reset to default tile dimensions"
          >
            <RotateCcw size={12} /> Reset
          </button>
          
          <button
            onClick={onInspireMe}
            className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Sparkles size={12} className="text-indigo-200" /> Inspire Me
          </button>
        </div>
      </div>

      {/* Right panel: live repeated preview */}
      <div className={`flex-1 rounded-2xl border overflow-hidden relative flex flex-col justify-between ${theme.card}`}>
        {/* Header with Aspect Ratio selector and Swatch Tokens */}
        <div className={`p-3 border-b flex flex-wrap justify-between items-center gap-2 text-xs font-semibold ${
          theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/90 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={theme.textMuted}>Repeated Pattern Preview</span>
            <div className="flex gap-1">
              {['square', 'banner', 'card', 'story'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                    aspectRatio === ratio
                      ? 'bg-indigo-600 text-white'
                      : theme.isDark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Active Colors Swatch Strip */}
          <div className="flex items-center gap-1.5">
            <div style={{ backgroundColor: bg }} className="w-4 h-4 rounded-full border border-white/20 shadow" title={`BG: ${bg}`} />
            <div style={{ backgroundColor: color1 }} className="w-4 h-4 rounded-full border border-white/20 shadow" title={`Color1: ${color1}`} />
            <div style={{ backgroundColor: color2 }} className="w-4 h-4 rounded-full border border-white/20 shadow" title={`Color2: ${color2}`} />
          </div>
        </div>

        {/* Live SVG Background Renderer Container */}
        <div className="flex-1 p-4 flex items-center justify-center overflow-auto">
          <div
            className={`w-full rounded-2xl border shadow-2xl transition-all duration-300 ${getAspectClass()}`}
            style={{ backgroundImage: `url("data:image/svg+xml;utf8,${encodedSvg}")` }}
          />
        </div>
      </div>
    </div>
  );
}
