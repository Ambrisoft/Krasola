import React from 'react';
import { Search, Filter, ExternalLink, Download, Palette, Sliders, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ImageSearchHub({
  searchQuery,
  onTriggerSearch,
  orientation,
  setOrientation,
  license,
  setLicense,
  imagesList,
  loading,
  providerInfo,
  selectedImage,
  onSelectImage,
  onOpenColorExtractor,
  onOpenEditor
}) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = React.useState(searchQuery || 'home');

  React.useEffect(() => {
    if (searchQuery) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (onTriggerSearch) {
      onTriggerSearch(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Controls */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Main Search Input with Dedicated Search Button */}
          <div className="relative flex-1 flex items-center">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search 600M+ royalty-free images (press Enter or click Search)..."
              className={`w-full pl-10 pr-24 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none transition-all ${
                theme.isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
            {/* Dedicated Search Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all"
            >
              <Search size={13} />
              <span>Search</span>
            </button>
          </div>

          {/* Orientation Filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className={theme.textMuted} />
            <select
              value={orientation}
              onChange={(e) => {
                setOrientation(e.target.value);
                onTriggerSearch(inputValue, e.target.value, license);
              }}
              className={`text-xs font-bold px-3 py-2.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${
                theme.isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">All Orientations</option>
              <option value="wide">Landscape (Wide)</option>
              <option value="tall">Portrait (Tall)</option>
              <option value="square">Square</option>
            </select>
          </div>
        </form>

        {/* Status Bar showing active provider fallback */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-semibold ${theme.textMuted}`}>Source Engine:</span>
            <span className="font-bold text-indigo-400">{providerInfo || 'Openverse API (Layer 1)'}</span>
          </div>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold">
              <RefreshCw size={12} className="animate-spin" /> Fetching assets...
            </span>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {imagesList.length === 0 && !loading ? (
        <div className={`p-12 text-center rounded-2xl border ${theme.card} space-y-3`}>
          <ImageIcon size={36} className="mx-auto text-slate-400 opacity-60" />
          <h4 className="font-bold text-sm">No images found for "{searchQuery}"</h4>
          <p className={`text-xs ${theme.textMuted}`}>Try searching for broad terms like "minimal", "pattern", "city", or "neon".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {imagesList.map((img) => {
            const isSelected = selectedImage?.id === img.id;
            return (
              <div
                key={img.id}
                onClick={() => onSelectImage(img)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/30' : theme.card
                } hover:border-indigo-500/50 hover:-translate-y-1`}
              >
                {/* Image Container with aspect ratio */}
                <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={img.thumbnail}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                        {img.license}
                      </span>
                    </div>

                    {/* Quick action buttons on hover */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectImage(img);
                          onOpenColorExtractor();
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded-lg flex items-center gap-1 shadow-md"
                        title="Extract Palette"
                      >
                        <Palette size={11} /> Extract Swatches
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectImage(img);
                          onOpenEditor();
                        }}
                        className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-[10px] font-bold text-slate-200 rounded-lg flex items-center gap-1 backdrop-blur-md shadow-md border border-slate-700"
                        title="Edit Canvas"
                      >
                        <Sliders size={11} /> Edit Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-xs truncate">{img.title}</h4>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={theme.textMuted}>By {img.creator}</span>
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      View Source <ExternalLink size={9} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
