import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, BookOpen, ChevronRight, Hash, ArrowRight } from 'lucide-react';
import { DOCS_SECTIONS, DOCS_CATEGORIES } from '../../data/docsContent';

export const DocsSearchModal = ({ isOpen, onClose, onSelectSection, theme }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectSection(null); // Signal open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectSection]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return Object.values(DOCS_SECTIONS).filter(section => {
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchSubtitle = section.subtitle.toLowerCase().includes(q);
      const matchTags = section.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchContent = section.content.some(item => {
        if (item.text) return item.text.toLowerCase().includes(q);
        if (item.title) return item.title.toLowerCase().includes(q);
        if (item.code) return item.code.toLowerCase().includes(q);
        return false;
      });
      return matchTitle || matchSubtitle || matchTags || matchContent;
    });
  }, [query]);

  if (!isOpen) return null;

  const getCategoryTitle = (catId) => {
    const cat = DOCS_CATEGORIES.find(c => c.id === catId);
    return cat ? cat.title : 'Documentation';
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
      />

      {/* Search Modal Box */}
      <div 
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] ${
          theme.isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-indigo-950/40' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
        }`}
      >
        {/* Input Bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${theme.isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'}`}>
          <Search size={18} className="text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Krasola docs, formulas, schemas, and APIs... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full text-sm font-medium bg-transparent focus:outline-none placeholder:text-slate-400 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 scrollbar-thin">
          {!query.trim() ? (
            <div className="p-8 text-center space-y-3">
              <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${theme.isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                <BookOpen size={22} />
              </div>
              <p className="text-xs text-slate-400">Type a keyword, studio name, formula, or schema to search documentation.</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {['WCAG 2.1', 'Ring Buffer', 'WebP Canvas', 'PostgreSQL', 'RLS', 'Shortcuts'].map((sugg) => (
                  <button
                    key={sugg}
                    onClick={() => setQuery(sugg)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                      theme.isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-500' : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-indigo-500'
                    }`}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching documentation topics found for <span className="font-bold text-indigo-400">"{query}"</span>.
            </div>
          ) : (
            searchResults.map((sec) => (
              <div
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 group ${
                  theme.isDark 
                    ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-indigo-500/50' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-500/50 shadow-sm'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {getCategoryTitle(sec.categoryId)}
                    </span>
                    <span className="text-slate-500">&middot;</span>
                    <span className="text-[10px] text-slate-400">{sec.readTime}</span>
                  </div>

                  <h4 className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors truncate">
                    {sec.title}
                  </h4>

                  <p className={`text-xs line-clamp-1 ${theme.textMuted}`}>
                    {sec.subtitle}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    {sec.tags?.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-500/10 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <ArrowRight size={16} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all mt-3 shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-[11px] flex items-center justify-between ${theme.isDark ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
          <span>⚡ Instant client-side indexing across 100% verified Krasola documentation</span>
          <span className="font-mono text-[10px]">v1.1.0</span>
        </div>
      </div>
    </div>
  );
};
