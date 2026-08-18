import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Rocket, 
  Palette, 
  Database, 
  Cpu, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText,
  Copy,
  Terminal,
  Layers
} from 'lucide-react';
import { DOCS_CATEGORIES, DOCS_SECTIONS } from '../data/docsContent';
import { DocsCodeBlock } from './docs/DocsCodeBlock';
import { DocsSearchModal } from './docs/DocsSearchModal';
import { APP_VERSION, COMMIT_HASH } from '../utils/versionManager';

export default function Documentation({ theme, onNavigateStudio }) {
  const [activeSectionId, setActiveSectionId] = useState('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileTopicsOpen, setIsMobileTopicsOpen] = useState(false);

  const activeSection = useMemo(() => {
    return DOCS_SECTIONS[activeSectionId] || DOCS_SECTIONS['overview'];
  }, [activeSectionId]);

  // Icons map for categories
  const categoryIcons = {
    'Rocket': Rocket,
    'Palette': Palette,
    'Database': Database,
    'Cpu': Cpu
  };

  // Calculate previous and next navigation items
  const { prevSection, nextSection } = useMemo(() => {
    const allKeys = Object.keys(DOCS_SECTIONS);
    const currentIndex = allKeys.indexOf(activeSectionId);
    return {
      prevSection: currentIndex > 0 ? DOCS_SECTIONS[allKeys[currentIndex - 1]] : null,
      nextSection: currentIndex < allKeys.length - 1 ? DOCS_SECTIONS[allKeys[currentIndex + 1]] : null
    };
  }, [activeSectionId]);

  // Render callout block
  const renderCallout = (callout) => {
    const variants = {
      tip: {
        bg: theme.isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900',
        icon: <Sparkles size={16} className={theme.isDark ? "text-emerald-400 shrink-0 mt-0.5" : "text-emerald-600 shrink-0 mt-0.5"} />
      },
      note: {
        bg: theme.isDark ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900',
        icon: <Info size={16} className={theme.isDark ? "text-indigo-400 shrink-0 mt-0.5" : "text-indigo-600 shrink-0 mt-0.5"} />
      },
      important: {
        bg: theme.isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900',
        icon: <AlertTriangle size={16} className={theme.isDark ? "text-amber-400 shrink-0 mt-0.5" : "text-amber-600 shrink-0 mt-0.5"} />
      },
      warning: {
        bg: theme.isDark ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900',
        icon: <ShieldAlert size={16} className={theme.isDark ? "text-rose-400 shrink-0 mt-0.5" : "text-rose-600 shrink-0 mt-0.5"} />
      }
    };

    const style = variants[callout.variant] || variants.note;

    return (
      <div className={`my-4 p-4 rounded-2xl border ${style.bg} flex items-start gap-3 text-xs leading-relaxed shadow-sm`}>
        {style.icon}
        <div>
          {callout.title && <h5 className="font-bold mb-1 text-sm">{callout.title}</h5>}
          <p className="font-medium">{callout.text}</p>
        </div>
      </div>
    );
  };

  // Render table block
  const renderTable = (table) => {
    return (
      <div className={`my-5 overflow-x-auto rounded-2xl border shadow-sm ${theme.isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white'}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={theme.isDark ? 'bg-slate-900/90 border-b border-slate-800 text-slate-200' : 'bg-slate-100 border-b border-slate-200 text-slate-800'}>
              {table.headers.map((h, i) => (
                <th key={i} className="py-3 px-4 font-bold uppercase tracking-wider text-[10px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${theme.isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
            {table.rows.map((row, rIdx) => (
              <tr key={rIdx} className={theme.isDark ? 'hover:bg-slate-800/40 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className={`py-3 px-4 ${cIdx === 0 ? 'font-bold text-indigo-500 dark:text-indigo-400' : theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col md:flex-row overflow-hidden ${theme.isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* 1. Desktop Left Navigation Sidebar (Hidden on < md:) */}
      <aside className={`hidden md:flex md:w-72 lg:w-80 shrink-0 border-r flex-col h-full overflow-hidden ${theme.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Search Trigger Header */}
        <div className={`p-4 border-b ${theme.isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-full py-2.5 px-3.5 rounded-xl border flex items-center justify-between text-xs transition-all shadow-sm ${
              theme.isDark 
                ? 'bg-slate-800/80 border-slate-700 hover:border-indigo-500 text-slate-300' 
                : 'bg-slate-100 border-slate-200 hover:border-indigo-500 text-slate-700 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-indigo-500" />
              <span className="font-semibold">Search documentation...</span>
            </div>
            <kbd className={`px-1.5 py-0.5 text-[10px] font-bold font-mono rounded border ${
              theme.isDark ? 'bg-slate-900/40 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-600'
            }`}>
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Categories & Topics Tree List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 scrollbar-thin">
          {DOCS_CATEGORIES.map((category) => {
            const IconComp = categoryIcons[category.icon] || FileText;

            return (
              <div key={category.id} className="space-y-1.5">
                <div className={`flex items-center gap-2 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${theme.isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <IconComp size={13} className="text-indigo-500" />
                  <span>{category.title}</span>
                </div>

                <div className="space-y-1">
                  {category.items.map((secKey) => {
                    const section = DOCS_SECTIONS[secKey];
                    if (!section) return null;
                    const isActive = activeSectionId === secKey;

                    return (
                      <button
                        key={secKey}
                        onClick={() => setActiveSectionId(secKey)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                            : theme.isDark
                              ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                        }`}
                      >
                        <span className="truncate">{section.title}</span>
                        {isActive && <ChevronRight size={13} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className={`p-3.5 border-t text-[10px] flex items-center justify-between ${theme.isDark ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-500 font-semibold'}`}>
          <span className="flex items-center gap-1">
            <BookOpen size={11} className="text-indigo-500" /> Diátaxis Architecture
          </span>
          <span className="font-mono font-bold">v{APP_VERSION}</span>
        </div>
      </aside>

      {/* 2. Center Interactive Reader Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 lg:p-12 scrollbar-thin max-w-4xl mx-auto w-full">
        {/* Mobile Sticky Topic Switcher Bar (< md:) */}
        <div className={`md:hidden mb-4 p-2.5 rounded-2xl border flex items-center justify-between shadow-sm ${
          theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => setIsMobileTopicsOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 truncate max-w-[220px]"
          >
            <BookOpen size={14} className="shrink-0" />
            <span className="truncate">{activeSection.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 shrink-0">
              Topics ▾
            </span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className={`p-2 rounded-xl border transition-all ${
              theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Search docs"
          >
            <Search size={14} />
          </button>
        </div>
        {/* Breadcrumb Bar */}
        <div className={`flex items-center gap-2 text-xs font-bold mb-6 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>Docs</span>
          <ChevronRight size={12} />
          <span className="capitalize">{activeSection.categoryId.replace('-', ' ')}</span>
          <ChevronRight size={12} />
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activeSection.title}</span>
        </div>

        {/* Document Header */}
        <div className={`space-y-3 pb-6 border-b ${theme.isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {activeSection.categoryId.toUpperCase()}
            </span>
            <span className={`text-xs flex items-center gap-1 font-semibold ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Clock size={12} /> {activeSection.readTime}
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeSection.title}
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {activeSection.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {activeSection.tags?.map((tag) => (
              <span 
                key={tag} 
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                  theme.isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Document Body Sections */}
        <div className="py-6 space-y-6">
          {activeSection.content.map((block, idx) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={idx} className={`text-sm leading-relaxed font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    {block.text}
                  </p>
                );

              case 'heading':
                return (
                  <h3 key={idx} className={`text-lg sm:text-xl font-bold tracking-tight pt-4 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                    {block.title}
                  </h3>
                );

              case 'callout':
                return <div key={idx}>{renderCallout(block)}</div>;

              case 'code':
                return (
                  <DocsCodeBlock
                    key={idx}
                    code={block.code}
                    language={block.language}
                    title={block.title}
                  />
                );

              case 'table':
                return <div key={idx}>{renderTable(block)}</div>;

              case 'list':
                return (
                  <ul key={idx} className={`space-y-2 text-sm list-disc list-inside font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Pagination & Next Navigation */}
        <div className={`pt-8 mt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${theme.isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          {prevSection ? (
            <button
              onClick={() => setActiveSectionId(prevSection.id)}
              className={`w-full sm:w-auto p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                theme.isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
              }`}
            >
              <ArrowLeft size={16} className="text-indigo-500 shrink-0" />
              <div>
                <span className={`text-[10px] uppercase font-extrabold block ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Previous</span>
                <span className={`text-xs font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-900'}`}>{prevSection.title}</span>
              </div>
            </button>
          ) : <div />}

          {nextSection && (
            <button
              onClick={() => setActiveSectionId(nextSection.id)}
              className={`w-full sm:w-auto p-3.5 rounded-2xl border text-right flex items-center gap-3 justify-end transition-all ${
                theme.isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
              }`}
            >
              <div>
                <span className={`text-[10px] uppercase font-extrabold block ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Next</span>
                <span className={`text-xs font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-900'}`}>{nextSection.title}</span>
              </div>
              <ArrowRight size={16} className="text-indigo-500 shrink-0" />
            </button>
          )}
        </div>
      </main>

      {/* Mobile Topic Selection Bottom Sheet */}
      {isMobileTopicsOpen && (
        <div 
          onClick={() => setIsMobileTopicsOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end justify-center p-0 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full rounded-t-3xl border-t shadow-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto backdrop-blur-2xl scrollbar-thin ${
              theme.isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* iOS Pill Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-500/30 mx-auto -mt-1 mb-2" />

            <div className={`flex items-center justify-between border-b pb-3 ${theme.isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                <span className="font-extrabold text-sm">Select Documentation Topic</span>
              </div>
              <button
                onClick={() => setIsMobileTopicsOpen(false)}
                className={`p-1.5 rounded-xl border ${theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {DOCS_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 px-1">
                    {category.title}
                  </span>
                  <div className="space-y-1">
                    {category.items.map((secKey) => {
                      const section = DOCS_SECTIONS[secKey];
                      if (!section) return null;
                      const isActive = activeSectionId === secKey;

                      return (
                        <button
                          key={secKey}
                          onClick={() => {
                            setActiveSectionId(secKey);
                            setIsMobileTopicsOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all active:scale-95 ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-md'
                              : theme.isDark ? 'bg-slate-850 hover:bg-slate-800 text-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{section.title}</span>
                          {isActive && <ChevronRight size={14} className="shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Quick Search Modal */}
      <DocsSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSection={(secId) => {
          if (secId) setActiveSectionId(secId);
          else setIsSearchOpen(true);
        }}
        theme={theme}
      />
    </div>
  );
}
