import React, { useState, useEffect } from 'react';
import { Grid, Zap, Shield, Globe, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { fetchCommunityPatterns } from '../../utils/supabaseClient';

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
  const [communityPatterns, setCommunityPatterns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch community patterns
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
  }, [activeTab]);

  const categories = ['All', 'Minimalist', 'Geometric', 'Flow', '3D', 'Tech', 'Abstract', 'Heritage', 'Weave', 'Stellar'];

  // Filter local templates
  const filteredPlatformEntries = Object.entries(patternTypes).filter(([key, value]) => {
    if (selectedCategory === 'All') return true;
    return value.category === selectedCategory;
  });

  // Filter community designs
  const filteredCommunityPatterns = communityPatterns.filter(pattern => {
    if (selectedCategory === 'All') return true;
    const baseTemplate = patternTypes[pattern.pattern_type];
    return baseTemplate && baseTemplate.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Sub Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Pattern Templates Gallery</h3>
          <p className={`text-xs ${theme.textMuted}`}>Browse and import curated pattern configurations. Hover cards to load into Canvas Studio.</p>
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
          <div className="inline-flex p-1 rounded-xl bg-slate-900/60 border border-slate-800">
            <button
              onClick={() => setActiveTab('platform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'platform'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield size={12} /> Krasola Presets
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'community'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe size={12} /> Community Gallery
            </button>
          </div>
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

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : activeTab === 'platform' ? (
        /* Krasola Presets View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto max-h-[500px] pr-2">
          {filteredPlatformEntries.map(([key, value]) => {
            const isSelected = patternType === key;
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
