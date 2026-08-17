import React, { useState, useEffect } from 'react';
import { Grid, Zap, Shield, Globe, Sparkles, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { fetchCommunityPatterns, fetchPlatformPatterns } from '../../utils/supabaseClient';

export default function PatternExplorer({ 
  patternTypes, 
  patternType, 
  onLoadTemplate,
  onLoadCommunityPattern,
  bg, color1, color2,
  isPaletteImported = false
}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('platform'); // 'platform' or 'community'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformPatterns, setPlatformPatterns] = useState([]);
  const [communityPatterns, setCommunityPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 40;

  // Fetch platform presets on mount
  useEffect(() => {
    fetchPlatformPatterns()
      .then(data => {
        if (data && data.length > 0) {
          setPlatformPatterns(data);
        }
      })
      .catch(err => console.warn("Could not fetch platform patterns:", err));
  }, []);

  // Fetch community patterns on tab switch
  useEffect(() => {
    if (activeTab === 'community') {
      setLoading(true);
      fetchCommunityPatterns()
        .then(data => {
          setCommunityPatterns(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
    setCurrentPage(1);
  }, [activeTab]);

  // Reset page on category or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const categories = ['All', 'Minimalist', 'Geometric', 'Flow', '3D', 'Tech', 'Abstract', 'Heritage', 'Weave', 'Stellar'];

  // Filter platform presets (from Supabase or fallback to base templates)
  const activePlatformList = platformPatterns.length > 0
    ? platformPatterns
    : Object.entries(patternTypes).map(([key, val]) => ({
        id: key,
        key: key,
        name: val.name,
        category: val.category,
        default_bg: val.defaultBg,
        default_color1: val.defaultColor1,
        default_color2: val.defaultColor2
      }));

  const filteredPlatformList = activePlatformList.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPlatformList.length / ITEMS_PER_PAGE) || 1;
  const paginatedPlatformList = filteredPlatformList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Filter community designs
  const filteredCommunityPatterns = communityPatterns.filter(pattern => {
    const baseTemplate = patternTypes[pattern.pattern_type];
    const matchesCategory = selectedCategory === 'All' || (baseTemplate && baseTemplate.category === selectedCategory);
    const matchesSearch = !searchQuery || pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            Pattern Templates Gallery
            {activeTab === 'platform' && (
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {filteredPlatformList.length} Presets
              </span>
            )}
          </h3>
          <p className={`text-xs ${theme.textMuted}`}>Browse and import curated vector pattern configurations. Hover cards to load into Canvas Studio.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Linked status badge */}
          {activeTab === 'platform' && (
            <div className={`px-3 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1 shrink-0 ${
              isPaletteImported
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <Sparkles size={10} />
              <span>{isPaletteImported ? 'Active colors linked' : 'Default Preset colors'}</span>
            </div>
          )}

          {/* Double Tab Switcher */}
          <div className={`inline-flex p-1 rounded-xl border transition-all ${
            theme.isDark 
              ? 'bg-slate-900/60 border-slate-800' 
              : 'bg-slate-200/70 border-slate-300 shadow-inner'
          }`}>
            <button
              onClick={() => setActiveTab('platform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'platform'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : theme.isDark 
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
              }`}
            >
              <Shield size={12} /> Krasola Presets
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'community'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : theme.isDark 
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
              }`}
            >
              <Globe size={12} /> Community Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pattern presets by name or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border transition-all ${
              theme.isDark 
                ? 'bg-slate-900/60 border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-500' 
                : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-md">
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
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : activeTab === 'platform' ? (
        /* Krasola Presets View */
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto max-h-[500px] pr-2">
            {paginatedPlatformList.map((p) => {
              const baseTemplate = patternTypes[p.key] || patternTypes.dots;
              const isSelected = patternType === p.key;
              const renderBg = isPaletteImported ? bg : (p.default_bg || '#0f172a');
              const renderC1 = isPaletteImported ? color1 : (p.default_color1 || '#6366f1');
              const renderC2 = isPaletteImported ? color2 : (p.default_color2 || '#38bdf8');

              const innerSvg = baseTemplate.svg(30, 30, 0.95, 1.5, renderC1, renderC2, renderBg);
              const previewSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <defs>${innerSvg.replace('id="pattern"', `id="explorer-${p.id || p.key}"`)}</defs>
                  <rect width="100%" height="100%" fill="url(#explorer-${p.id || p.key})" />
                </svg>
              `;

              return (
                <div
                  key={p.id || p.name}
                  onClick={() => onLoadTemplate && onLoadTemplate(p.key, p.default_bg, p.default_color1, p.default_color2, p.name)}
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
                        if (onLoadTemplate) onLoadTemplate(p.key, p.default_bg, p.default_color1, p.default_color2, p.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg flex items-center gap-1 shadow-lg transition-all duration-300 z-10"
                      title="Load preset into Canvas Studio"
                    >
                      <Zap size={9} /> Load
                    </button>
                  </div>

                  {/* Info Label */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="truncate w-full">
                      <span className="text-[10px] font-black uppercase tracking-wider block truncate" title={p.name}>
                        {p.name}
                      </span>
                      <span className={`text-[8px] uppercase tracking-widest ${theme.textMuted} block truncate`}>
                        {p.category || p.key}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {paginatedPlatformList.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-slate-400 italic">
                No platform presets found matching your search.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t dark:border-slate-850 pt-3 text-xs">
              <span className={`text-[11px] ${theme.textMuted}`}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredPlatformList.length)} of {filteredPlatformList.length} presets
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 rounded-lg border text-xs font-bold disabled:opacity-40 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                >
                  <ChevronLeft size={12} /> Prev
                </button>
                <span className="font-mono text-xs font-bold text-indigo-400">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-2.5 py-1 rounded-lg border text-xs font-bold disabled:opacity-40 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Community Creations View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto max-h-[500px] pr-2">
          {filteredCommunityPatterns.map((pattern) => {
            const baseTemplate = patternTypes[pattern.pattern_type] || patternTypes.dots;
            
            // Render community parameters
            const innerSvg = baseTemplate.svg(30, 30, pattern.scale, pattern.stroke, pattern.color1, pattern.color2, pattern.bg);
            const previewSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>${innerSvg.replace('id="pattern"', `id="community-${pattern.id}"`)}</defs>
                <rect width="100%" height="100%" fill="url(#community-${pattern.id})" />
              </svg>
            `;

            return (
              <div
                key={pattern.id}
                onClick={() => onLoadCommunityPattern && onLoadCommunityPattern(pattern)}
                className={`text-left rounded-2xl border p-3 flex flex-col justify-between h-40 transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                  theme.isDark
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
                      if (onLoadCommunityPattern) onLoadCommunityPattern(pattern);
                    }}
                    className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg flex items-center gap-1 shadow-lg transition-all duration-300 z-10"
                    title="Load design settings"
                  >
                    <Zap size={9} /> Load
                  </button>
                </div>

                {/* Info Label */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="truncate w-full">
                    <span className="text-[10px] font-black uppercase tracking-wider block truncate">
                      {pattern.name}
                    </span>
                    <span className={`text-[8px] uppercase tracking-widest ${theme.textMuted} block truncate`}>
                      by {pattern.username || 'Anonymous'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredCommunityPatterns.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-slate-400 italic">
              No community designs found matching the category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
