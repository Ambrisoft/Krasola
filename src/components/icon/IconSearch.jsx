import React from 'react';
import { Search, Loader2, RotateCw, FlipHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function IconSearch({ 
  searchQuery, setSearchQuery, 
  iconsList, selectedIcon, selectIconItem, loading,
  size, setSize,
  strokeWidth, setStrokeWidth,
  rotation, setRotation,
  flipH, setFlipH,
  flipV, setFlipV,
  color, setColor,
  modifiedSvg
}) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[440px]">
      
      {/* Left Column: Search & Results Grid */}
      <div className="flex-1 space-y-4 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Search icons (e.g. arrow, heart, home)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                theme.isDark 
                  ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-750 focus:border-indigo-500'
              }`}
            />
          </div>

          {/* Grid of matches */}
          <div className={`border rounded-2xl p-4 min-h-[280px] max-h-[320px] overflow-y-auto ${theme.card}`}>
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 size={24} className="text-indigo-500 animate-spin" />
              </div>
            ) : iconsList.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-xs italic opacity-60">
                No icons found. Try searching for "settings", "star", or "user".
              </div>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {iconsList.map((iconName) => {
                  const isSelected = selectedIcon === iconName;
                  const [prefix, name] = iconName.split(':');
                  return (
                    <button
                      key={iconName}
                      onClick={() => selectIconItem(iconName)}
                      className={`h-10 rounded-lg flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-indigo-650 text-white shadow-md' 
                          : theme.isDark ? 'bg-slate-800/80 hover:bg-slate-800 hover:text-slate-100 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-750'
                      }`}
                      title={iconName}
                    >
                      <img 
                        src={`https://api.iconify.design/${prefix}/${name}.svg?color=${isSelected ? 'white' : 'currentColor'}`}
                        alt={name}
                        className="w-5 h-5"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <span className={`text-[10px] italic ${theme.textMuted}`}>Icons fetched on the fly via Iconify API query search.</span>
      </div>

      {/* Right Column: Inspector customization panel */}
      <div className={`w-full lg:w-80 border rounded-2xl p-5 space-y-5 shrink-0 flex flex-col justify-between ${theme.card}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b dark:border-slate-800 border-slate-200 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Icon Editor</span>
          </div>

          {/* Big Preview box */}
          <div className="h-32 rounded-xl bg-slate-500/5 border border-slate-500/10 flex items-center justify-center relative overflow-hidden">
            {modifiedSvg ? (
              <div dangerouslySetInnerHTML={{ __html: modifiedSvg }} />
            ) : (
              <span className="text-xs italic opacity-55">No icon selected</span>
            )}
          </div>

          {/* Controls Sliders */}
          <div className="space-y-3">
            {/* Custom Color Input */}
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-500/5 border border-slate-500/10">
              <span className="text-[10px] font-bold uppercase">Color:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 text-[10px] font-mono text-center bg-transparent border-b border-slate-500/20 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-6 h-6 rounded-md cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                />
              </div>
            </div>

            {/* Size */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Size</span>
                <span>{size}px</span>
              </div>
              <input
                type="range" min="16" max="128" value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Stroke Width */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Stroke Width</span>
                <span>{strokeWidth}px</span>
              </div>
              <input
                type="range" min="0.5" max="5" step="0.5" value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Rotation */}
            <div>
              <div className={`flex justify-between text-[10px] font-semibold ${theme.textMuted} mb-1`}>
                <span>Rotation</span>
                <span>{rotation}°</span>
              </div>
              <input
                type="range" min="0" max="360" step="45" value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Flips */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                  flipH ? 'bg-indigo-600 border-indigo-600 text-white' : theme.isDark ? 'border-slate-800 text-slate-400 bg-slate-900/50 hover:bg-slate-800' : 'border-slate-200 text-slate-650 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <FlipHorizontal size={12} /> Flip Horizontal
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                  flipV ? 'bg-indigo-600 border-indigo-600 text-white' : theme.isDark ? 'border-slate-800 text-slate-400 bg-slate-900/50 hover:bg-slate-800' : 'border-slate-200 text-slate-650 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <RotateCw size={10} /> Flip Vertical
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
