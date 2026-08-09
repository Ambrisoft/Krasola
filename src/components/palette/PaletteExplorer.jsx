import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function PaletteExplorer({ onLoadPalette, showToast }) {
  const { theme } = useTheme();
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Curated trending library (20+ presets)
  const presetPalettes = [
    { name: "Sunset Horizon", tags: ["warm", "retro"], colors: ["#ff5e62", "#ff9966", "#ff5f6d", "#ffc3a0", "#ffafbd"] },
    { name: "Nordic Frost", tags: ["cool", "minimalist"], colors: ["#2e3440", "#3b4252", "#434c5e", "#4c566a", "#88c0d0"] },
    { name: "Cyberpunk Glow", tags: ["neon"], colors: ["#0d0221", "#0f082c", "#ff79c6", "#bd93f9", "#8be9fd"] },
    { name: "Muted Forest", tags: ["cool", "minimalist"], colors: ["#2d4a22", "#537a4a", "#88a381", "#ccd5ae", "#e9edc9"] },
    { name: "Vintage Cafe", tags: ["retro", "warm"], colors: ["#6f4e37", "#a0522d", "#cd853f", "#deb887", "#f5f5dc"] },
    { name: "Neon Vibes", tags: ["neon"], colors: ["#ff007f", "#7f00ff", "#00ffff", "#ff00ff", "#00ff00"] },
    { name: "Pastel Dreams", tags: ["pastel"], colors: ["#ffb7b2", "#ffdac1", "#e2f0cb", "#b5ead7", "#c7ceea"] },
    { name: "Desert Sand", tags: ["warm", "minimalist"], colors: ["#e07a5f", "#f4f1de", "#f2cc8f", "#81b29a", "#3d405b"] },
    { name: "Sherbet Swirl", tags: ["pastel", "warm"], colors: ["#f72585", "#7209b7", "#3f37c9", "#4cc9f0", "#4895ef"] },
    { name: "Ocean Deep", tags: ["cool"], colors: ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8"] },
    { name: "Lavender Fields", tags: ["pastel", "cool"], colors: ["#e8dbfc", "#f1e9fc", "#ded2f9", "#c3bef7", "#8a85e5"] },
    { name: "Retro Sunset", tags: ["retro", "warm"], colors: ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"] },
    { name: "Emerald Luxe", tags: ["cool", "minimalist"], colors: ["#064e3b", "#047857", "#10b981", "#34d399", "#a7f3d0"] },
    { name: "Midnight OLED", tags: ["dark", "minimalist"], colors: ["#020617", "#0f172a", "#1e293b", "#334155", "#64748b"] },
    { name: "Golden Amber", tags: ["warm"], colors: ["#451a03", "#78350f", "#b45309", "#d97706", "#f59e0b"] },
    { name: "Rose Velvet", tags: ["pastel", "warm"], colors: ["#881337", "#9f1239", "#be123c", "#e11d48", "#f43f5e"] },
    { name: "Solarized Dark", tags: ["dark", "cool"], colors: ["#002b36", "#073642", "#586e75", "#657b83", "#2aa198"] },
    { name: "Tokyo Neon Night", tags: ["neon"], colors: ["#18022b", "#30084f", "#e000ff", "#00e5ff", "#ffe600"] }
  ];

  const tags = ["all", "warm", "cool", "pastel", "neon", "retro", "minimalist", "dark"];

  const filteredPalettes = presetPalettes.filter(palette => {
    const matchesTag = selectedTag === 'all' || palette.tags.includes(selectedTag);
    const matchesSearch = palette.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          palette.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub header */}
      <div>
        <h3 className="text-lg font-bold tracking-tight">Explore Palettes</h3>
        <p className={`text-xs ${theme.textMuted}`}>Browse and import curated trending templates from color libraries.</p>
      </div>

      {/* Explorer Controls Bar */}
      <div className={`p-4 border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl transition-all duration-300 ${theme.card}`}>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search palettes or HEX..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
              theme.isDark 
                ? 'bg-slate-900/60 border-slate-700 text-slate-200 focus:border-indigo-500' 
                : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Tags flexbox */}
        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-end">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedTag === tag
                  ? theme.accent
                  : theme.isDark
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPalettes.map((palette, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-4 space-y-4 backdrop-blur-xl transition-all duration-300 group hover:border-indigo-500/40 hover:-translate-y-1 ${theme.card}`}
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold">{palette.name}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {palette.tags.map(t => (
                    <span key={t} className="text-[8px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onLoadPalette(palette.colors)}
                className="opacity-0 group-hover:opacity-100 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all"
                title="Load into active workspace"
              >
                <Zap size={10} /> Load
              </button>
            </div>

            {/* Colors render strip */}
            <div className="flex h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              {palette.colors.map((color, cIdx) => (
                <div
                  key={cIdx}
                  style={{ backgroundColor: color }}
                  className="flex-1 hover:scale-105 transition-transform cursor-pointer relative group/swatch flex items-center justify-center"
                  title={`Click to copy HEX: ${color}`}
                  onClick={() => {
                    navigator.clipboard.writeText(color);
                    if (showToast) showToast(`Copied HEX ${color.toUpperCase()}`);
                  }}
                >
                  <span className="opacity-0 group-hover/swatch:opacity-100 text-[8px] font-black text-white bg-slate-900/60 px-1 py-0.5 rounded pointer-events-none drop-shadow">
                    📋
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
