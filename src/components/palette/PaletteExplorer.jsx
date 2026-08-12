import React, { useState, useEffect } from 'react';
import { Search, Zap, Globe, Shield, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { fetchPlatformPalettes, fetchCommunityPalettes } from '../../utils/supabaseClient';

export default function PaletteExplorer({ onLoadPalette, showToast }) {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('platform'); // 'platform' or 'community'
  const [platformPalettes, setPlatformPalettes] = useState([]);
  const [communityPalettes, setCommunityPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch libraries
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const presets = await fetchPlatformPalettes();
        const community = await fetchCommunityPalettes();
        
        const normalizedPresets = presets.map(p => ({
          ...p,
          tags: p.tags || [p.mode?.toLowerCase() || 'cool']
        }));
        const normalizedCommunity = community.map(c => ({
          ...c,
          tags: c.tags || [c.mode?.toLowerCase() || 'warm']
        }));
        setPlatformPalettes(normalizedPresets);
        setCommunityPalettes(normalizedCommunity);
      } catch (err) {
        console.error("Failed to load palettes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeTab]);

  const activePalettesList = activeTab === 'platform' ? platformPalettes : communityPalettes;
  const tags = ["all", "warm", "cool", "pastel", "neon", "retro", "minimalist", "dark"];

  const filteredPalettes = activePalettesList.filter(palette => {
    const matchesTag = selectedTag === 'all' || (palette.tags && palette.tags.includes(selectedTag));
    const matchesSearch = palette.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          palette.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub header with tab control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Explore Palettes Hub</h3>
          <p className={`text-xs ${theme.textMuted}`}>Browse and import curated trending templates from color libraries.</p>
        </div>

        {/* Double Tab Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900/60 border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('platform')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'platform'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={12} /> Krasola Presets
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'community'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe size={12} /> Community creations
          </button>
        </div>
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
                    ? 'bg-slate-800 hover:bg-slate-755 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : (
        /* Grid of cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPalettes.map((palette, idx) => (
            <div
              key={palette.id || idx}
              className={`rounded-2xl border p-4 space-y-4 backdrop-blur-xl transition-all duration-300 group hover:border-indigo-500/40 hover:-translate-y-1 ${theme.card}`}
            >
              {/* Header info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold">{palette.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1 items-center">
                    {palette.tags && palette.tags.map(t => (
                      <span key={t} className="text-[8px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                        {t}
                      </span>
                    ))}
                    {activeTab === 'community' && (
                      <span className="text-[9px] font-medium text-slate-400 ml-1">
                        by {palette.username || 'Anonymous'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {activeTab === 'community' && (
                    <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5 mr-2">
                      <Heart size={10} className="text-red-500 fill-red-500" /> {palette.likes || 0}
                    </span>
                  )}
                  <button
                    onClick={() => onLoadPalette(palette.colors)}
                    className="opacity-0 group-hover:opacity-100 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all"
                    title="Load into active workspace"
                  >
                    <Zap size={10} /> Load
                  </button>
                </div>
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
          {filteredPalettes.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-slate-400 italic">
              No palettes found matching the search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
