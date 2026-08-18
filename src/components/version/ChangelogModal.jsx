import React, { useState, useMemo } from 'react';
import { X, History, Sparkles, Tag, GitCommit, Search, Check, Copy, Shield, Wrench, RefreshCw, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { KRASOLA_CHANGELOG } from '../../data/changelogData';
import { APP_VERSION } from '../../utils/versionManager';

export default function ChangelogModal({ isOpen, onClose, theme }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'major' | 'minor' | 'patch'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVersions, setExpandedVersions] = useState(() => ({
    [KRASOLA_CHANGELOG[0]?.version]: true
  }));
  const [copiedCommit, setCopiedCommit] = useState(null);

  const toggleExpand = (version) => {
    setExpandedVersions(prev => ({
      ...prev,
      [version]: !prev[version]
    }));
  };

  const copyCommitHash = (commit) => {
    navigator.clipboard.writeText(commit);
    setCopiedCommit(commit);
    setTimeout(() => setCopiedCommit(null), 1500);
  };

  const filteredReleases = useMemo(() => {
    return KRASOLA_CHANGELOG.filter(rel => {
      // Type Filter
      if (activeFilter !== 'all' && rel.type !== activeFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = rel.title.toLowerCase().includes(q);
        const matchVer = rel.version.toLowerCase().includes(q);
        const matchSummary = rel.summary.toLowerCase().includes(q);
        const matchChanges = Object.values(rel.changes).flat().some(c => c.toLowerCase().includes(q));
        return matchTitle || matchVer || matchSummary || matchChanges;
      }
      return true;
    });
  }, [activeFilter, searchQuery]);

  if (!isOpen) return null;

  const typeBadges = {
    major: { label: 'Major Release', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    minor: { label: 'Minor Feature', bg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
    patch: { label: 'Patch / Fix', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl transition-all ${
          theme.isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between shrink-0 ${
          theme.isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shadow-sm">
              <History size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-none">
                  Release History & Changelog
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                  v{APP_VERSION} Active
                </span>
              </div>
              <p className={`text-xs mt-1 ${theme.textMuted}`}>
                Historical changelog adhering to SemVer 2.0 & Keep a Changelog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className={`p-3 sm:p-4 border-b flex flex-col sm:flex-row gap-2.5 items-center justify-between shrink-0 ${
          theme.isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/40'
        }`}>
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search changes, features, fixes..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border transition-all ${
                theme.isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
              } focus:outline-none`}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto scrollbar-none py-0.5">
            {['all', 'major', 'minor', 'patch'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 text-[11px] font-bold rounded-xl capitalize transition-all shrink-0 ${
                  activeFilter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : theme.isDark
                      ? 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? 'All Releases' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {filteredReleases.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <History size={32} className="mx-auto text-slate-500 opacity-50" />
              <p className="text-sm font-bold">No release records found</p>
              <p className={`text-xs ${theme.textMuted}`}>Try adjusting your search query or filters</p>
            </div>
          ) : (
            filteredReleases.map((rel) => {
              const isCurrent = rel.version === APP_VERSION;
              const isExpanded = expandedVersions[rel.version] !== false;
              const badgeStyle = typeBadges[rel.type] || typeBadges.patch;

              return (
                <div 
                  key={rel.version}
                  className={`rounded-2xl border transition-all ${
                    isCurrent 
                      ? 'border-indigo-500/50 bg-indigo-500/5 shadow-md shadow-indigo-500/5' 
                      : theme.isDark ? 'border-slate-800/80 bg-slate-850/50' : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  {/* Card Header */}
                  <div 
                    onClick={() => toggleExpand(rel.version)}
                    className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black tracking-tight">
                          v{rel.version}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500 text-white shadow-sm">
                            Current Active
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle.bg}`}>
                          {badgeStyle.label}
                        </span>
                      </div>

                      <h4 className={`text-xs sm:text-sm font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                        {rel.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-medium flex items-center gap-1 ${theme.textMuted}`}>
                        <Calendar size={12} /> {rel.date}
                      </span>
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className={`px-4 pb-4 pt-1 border-t space-y-3 ${theme.isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
                      <p className={`text-xs leading-relaxed font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {rel.summary}
                      </p>

                      {/* Categorized Changes */}
                      <div className="space-y-2 pt-1">
                        {rel.changes.added && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                              <Sparkles size={11} /> Added Features
                            </span>
                            <ul className="space-y-1 list-disc list-inside text-xs pl-1">
                              {rel.changes.added.map((c, i) => (
                                <li key={i} className={`leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rel.changes.fixed && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-sky-500 flex items-center gap-1">
                              <Wrench size={11} /> Fixes & Corrections
                            </span>
                            <ul className="space-y-1 list-disc list-inside text-xs pl-1">
                              {rel.changes.fixed.map((c, i) => (
                                <li key={i} className={`leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rel.changes.changed && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
                              <RefreshCw size={11} /> Improvements & Changes
                            </span>
                            <ul className="space-y-1 list-disc list-inside text-xs pl-1">
                              {rel.changes.changed.map((c, i) => (
                                <li key={i} className={`leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rel.changes.security && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-500 flex items-center gap-1">
                              <Shield size={11} /> Security & Policy
                            </span>
                            <ul className="space-y-1 list-disc list-inside text-xs pl-1">
                              {rel.changes.security.map((c, i) => (
                                <li key={i} className={`leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Commit SHA Badge */}
                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => copyCommitHash(rel.commit)}
                          className={`px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1.5 transition-all active:scale-95 ${
                            copiedCommit === rel.commit
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : theme.isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                          title="Click to copy commit SHA"
                        >
                          <GitCommit size={12} />
                          <span>{rel.commit}</span>
                          {copiedCommit === rel.commit ? <Check size={11} /> : <Copy size={11} />}
                        </button>

                        <span className={`text-[10px] ${theme.textMuted}`}>
                          Tagged in production
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 sm:p-4 border-t flex items-center justify-between shrink-0 text-xs ${
          theme.isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'
        }`}>
          <span className="text-[11px] font-medium">
            Total {KRASOLA_CHANGELOG.length} releases documented
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Close Changelog
          </button>
        </div>
      </div>
    </div>
  );
}
