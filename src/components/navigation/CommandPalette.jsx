import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Palette, Layers, Heart, Image as ImageIcon, FolderHeart, 
  Activity, BookOpen, User, Settings, Moon, Sun, Sparkles, 
  Download, Bell, X, ArrowRight, CornerDownLeft, Command
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../utils/themeUtils';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigateTab, 
  onOpenThemeStudio, 
  onOpenInstallModal,
  onOpenNotifications
}) {
  const { theme, activeThemeId, setActiveThemeId } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Master commands dataset
  const studioCommands = [
    { id: 'tab-home', title: 'Workspace Home Overview', category: 'Studios', icon: Sparkles, action: () => onNavigateTab('home'), keywords: 'home dashboard start welcome' },
    { id: 'tab-palette', title: 'Palette Lab - Color Schemes & WCAG', category: 'Studios', icon: Palette, action: () => onNavigateTab('palette'), keywords: 'palette lab colors harmonies hex generator extractor' },
    { id: 'tab-pattern', title: 'Pattern Studio - Vector Backgrounds', category: 'Studios', icon: Layers, action: () => onNavigateTab('pattern'), keywords: 'pattern studio svg geometric textures canvas' },
    { id: 'tab-icon', title: 'Icon Finder - 150,000+ Vector Icons', category: 'Studios', icon: Heart, action: () => onNavigateTab('icon'), keywords: 'icon finder search lucide svg glyph symbols' },
    { id: 'tab-image', title: 'Image Studio - CC Search & Palette Extract', category: 'Studios', icon: ImageIcon, action: () => onNavigateTab('imagesearch'), keywords: 'image search stock photos unsplash editor' },
    { id: 'tab-saved', title: 'Saved Assets Vault', category: 'Studios', icon: FolderHeart, action: () => onNavigateTab('saved'), keywords: 'saved assets vault bookmarks cloud storage' },
    { id: 'tab-monitoring', title: 'Activity & Usage Hub', category: 'Studios', icon: Activity, action: () => onNavigateTab('monitoring'), keywords: 'monitoring telemetry analytics logs quota usage' },
    { id: 'tab-docs', title: 'Documentation & Architecture Guides', category: 'Studios', icon: BookOpen, action: () => onNavigateTab('docs'), keywords: 'docs documentation help api guides architecture' },
    { id: 'tab-account', title: 'Account & Cloud Vault Profile', category: 'Studios', icon: User, action: () => onNavigateTab('account'), keywords: 'account profile login auth supabase sync' },
    { id: 'tab-settings', title: 'Settings & Workspace Preferences', category: 'Studios', icon: Settings, action: () => onNavigateTab('settings'), keywords: 'settings preferences configuration glow shortcuts' },
  ];

  const themeCommands = THEMES.map((t) => ({
    id: `theme-${t.id}`,
    title: `Switch Theme to ${t.name}`,
    category: 'Themes',
    icon: t.isDark ? Moon : Sun,
    action: () => {
      setActiveThemeId(t.id);
    },
    keywords: `theme ${t.name} ${t.id} ${t.isDark ? 'dark' : 'light'} color scheme appearance`,
    accentHex: t.accentHex,
    isCurrentTheme: activeThemeId === t.id
  }));

  const actionCommands = [
    { id: 'act-theme-studio', title: 'Open Theme Studio Panel', category: 'Actions', icon: Palette, action: () => onOpenThemeStudio(), keywords: 'theme studio modal picker customize' },
    { id: 'act-install', title: 'Install Krasola as Desktop App (PWA)', category: 'Actions', icon: Download, action: () => onOpenInstallModal(), keywords: 'install app pwa standalone offline' },
    { id: 'act-notif', title: 'View In-App Notifications', category: 'Actions', icon: Bell, action: () => onOpenNotifications(), keywords: 'notifications alerts messages bell updates' }
  ];

  const allCommands = [...studioCommands, ...themeCommands, ...actionCommands];

  const filteredCommands = allCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const lowerQuery = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(lowerQuery) ||
      cmd.category.toLowerCase().includes(lowerQuery) ||
      cmd.keywords.toLowerCase().includes(lowerQuery)
    );
  });

  // Handle keyboard navigation inside command list
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start sm:items-center justify-center p-3 sm:p-4 pt-16 sm:pt-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all duration-300 ${
          theme.isDark 
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-slate-950/80' 
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Search Bar Input */}
        <div className={`p-4 border-b flex items-center gap-3 shrink-0 ${
          theme.isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/60'
        }`}>
          <Search size={18} className="text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search studios, themes, actions..."
            className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/20 font-mono text-[10px] font-bold border border-slate-700 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Command Results List */}
        <div 
          ref={listRef}
          className="p-2 overflow-y-auto max-h-[60vh] space-y-1 divide-y divide-transparent"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search size={28} className="mx-auto text-slate-500 opacity-40" />
              <p className={`text-xs font-semibold ${theme.textMuted}`}>
                No commands matching &quot;<span className="text-indigo-400">{query}</span>&quot;
              </p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : theme.isDark 
                        ? 'text-slate-300 hover:bg-slate-800/60' 
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : theme.isDark ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'
                    }`}>
                      <Icon size={16} />
                    </div>
                    
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{cmd.title}</span>
                        {cmd.isCurrentTheme && (
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
                          }`}>
                            Active
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-semibold truncate ${
                        isSelected ? 'text-indigo-100' : theme.textMuted
                      }`}>
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.accentHex && (
                      <span 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: cmd.accentHex }}
                      />
                    )}
                    {isSelected && (
                      <CornerDownLeft size={13} className="text-indigo-200 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className={`px-4 py-2.5 border-t flex items-center justify-between text-[10px] font-semibold ${
          theme.isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
        }`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-black/20 border border-slate-700 font-mono">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-black/20 border border-slate-700 font-mono">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-black/20 border border-slate-700 font-mono">↵</kbd>
              Select
            </span>
          </div>

          <span className="hidden sm:inline-block">Krasola Unified Command Hub</span>
        </div>
      </div>
    </div>
  );
}
