import React, { useState, useRef } from 'react';
import { 
  Settings as GearIcon, 
  Palette, 
  Database, 
  Info, 
  Check, 
  Download, 
  Upload, 
  Trash2, 
  Sun, 
  Moon, 
  Sparkles,
  Keyboard,
  RefreshCw,
  Home,
  History
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { THEMES } from '../utils/themeUtils';
import { APP_VERSION, COMMIT_HASH, APP_STAGE, getFormattedBuildDate, checkForAppUpdates } from '../utils/versionManager';
import ChangelogModal from './version/ChangelogModal';

export default function SettingsComponent({ 
  savedPalettes, 
  savedPatterns, 
  savedIcons, 
  savedImages = [],
  setSavedPalettes, 
  setSavedPatterns, 
  setSavedIcons,
  setSavedImages,
  enableGlow,
  setEnableGlow,
  enableShortcuts,
  setEnableShortcuts,
  defaultTab,
  setDefaultTab
}) {
  const { theme, activeThemeId, setActiveThemeId } = useTheme();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('general');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    try {
      const result = await checkForAppUpdates();
      if (result.hasUpdate) {
        toast.info(`New version v${result.latestVersion} available! Reload to update.`);
      } else {
        toast.success(`You are on the latest version (v${APP_VERSION}).`);
      }
    } catch {
      toast.info(`Version v${APP_VERSION} is currently active.`);
    } finally {
      setIsCheckingUpdate(false);
    }
  };
  const [importStatus, setImportStatus] = useState(null);

  // Export data
  const handleExportData = () => {
    const backupData = {
      version: '1.0.0',
      saved_palettes: savedPalettes,
      saved_patterns: savedPatterns,
      saved_icons: savedIcons,
      saved_images: savedImages,
      exported_at: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `krasola_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import data
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.saved_palettes || parsed.saved_patterns || parsed.saved_icons || parsed.saved_images) {
          if (parsed.saved_palettes) setSavedPalettes(parsed.saved_palettes);
          if (parsed.saved_patterns) setSavedPatterns(parsed.saved_patterns);
          if (parsed.saved_icons) setSavedIcons(parsed.saved_icons);
          if (parsed.saved_images && setSavedImages) setSavedImages(parsed.saved_images);
          setImportStatus({ success: true, message: 'Data imported successfully!' });
        } else {
          setImportStatus({ success: false, message: 'Invalid backup file structure.' });
        }
      } catch (err) {
        setImportStatus({ success: false, message: 'Failed to parse JSON file.' });
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  // Reset all data
  const handleResetAll = () => {
    if (confirm('Are you absolutely sure you want to reset Krasola? This will delete all saved palettes, patterns, icons, and images, and revert all preferences.')) {
      setSavedPalettes([]);
      setSavedPatterns([]);
      setSavedIcons([]);
      if (setSavedImages) setSavedImages([]);
      setEnableGlow(true);
      setEnableShortcuts(true);
      setDefaultTab('home');
      setActiveThemeId('slate-dark');
      toast.success('All settings and data have been reset to factory defaults.');
    }
  };

  const sections = [
    { id: 'general', name: 'General Preferences', icon: GearIcon },
    { id: 'appearance', name: 'Theme & Appearance', icon: Palette },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'about', name: 'About Krasola', icon: Info },
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${theme.card}`}>
      {/* Mobile Horizontal Sub-Tab Strip (< lg) */}
      <div className={`lg:hidden border-b p-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0 ${
        theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : theme.isDark
                    ? 'text-slate-300 bg-slate-850 hover:bg-slate-800'
                    : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span>{section.name}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Sidebar (>= lg) */}
      <aside className={`hidden lg:flex flex-col w-64 border-r p-4 space-y-1.5 shrink-0 ${theme.isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
        <div className="px-3 py-2 mb-2">
          <h3 className="text-xs font-bold tracking-wider uppercase opacity-60">Settings</h3>
        </div>
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? theme.accent
                    : theme.isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Settings Panel */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-4xl">
        {/* General Preferences */}
        {activeSection === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">General Preferences</h3>
              <p className={`text-xs ${theme.textMuted}`}>Customize how Krasola behaves and operates.</p>
            </div>

            <div className={`space-y-4 border rounded-2xl p-4 ${theme.border}`}>
              {/* Option 1: Startup Tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Home size={15} className="text-indigo-400" /> Default Startup View
                  </h4>
                  <p className={`text-xs ${theme.textMuted}`}>Select which screen opens when you launch the application.</p>
                </div>
                <select
                  value={defaultTab}
                  onChange={(e) => setDefaultTab(e.target.value)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none transition-all cursor-pointer ${
                    theme.isDark 
                      ? 'bg-slate-800/90 border-slate-700 text-slate-200 focus:border-indigo-500' 
                      : 'bg-white border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option value="home">Workspace Overview</option>
                  <option value="palette">Palette Lab</option>
                  <option value="pattern">Pattern Studio</option>
                  <option value="icon">Icon Finder</option>
                  <option value="imagesearch">Image Search Studio</option>
                  <option value="saved">Saved Assets</option>
                </select>
              </div>

              <hr className={theme.border} />

              {/* Option 2: Glow Effects */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles size={15} className="text-amber-400" /> Ambient Glow Effects
                  </h4>
                  <p className={`text-xs ${theme.textMuted}`}>Toggle the colorful background blur glows (disabling increases performance on slow screens).</p>
                </div>
                <button
                  onClick={() => setEnableGlow(!enableGlow)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    enableGlow ? 'bg-indigo-600' : 'bg-slate-400/40'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    enableGlow ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <hr className={theme.border} />

              {/* Option 3: Keyboard Shortcuts */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Keyboard size={15} className="text-emerald-400" /> Enable Hotkeys
                  </h4>
                  <p className={`text-xs ${theme.textMuted}`}>Use keyboard shortcuts like [Space] in Palette Lab to instantly trigger actions.</p>
                </div>
                <button
                  onClick={() => setEnableShortcuts(!enableShortcuts)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    enableShortcuts ? 'bg-indigo-600' : 'bg-slate-400/40'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    enableShortcuts ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Theme & Appearance</h3>
              <p className={`text-xs ${theme.textMuted}`}>Choose from built-in theme presets with WCAG AA compliance and dynamic CSS variables.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {THEMES.map((themeObj) => {
                const isSelected = activeThemeId === themeObj.id;
                return (
                  <button
                    key={themeObj.id}
                    onClick={() => setActiveThemeId(themeObj.id)}
                    className={`text-left rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-all duration-300 relative group overflow-hidden ${
                      isSelected 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' 
                        : theme.isDark 
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60' 
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{themeObj.name}</span>
                        {themeObj.isDark ? (
                          <Moon size={12} className="text-blue-400" />
                        ) : (
                          <Sun size={12} className="text-amber-400" />
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'border-slate-400/40 text-transparent'
                      }`}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    </div>

                    <p className={`text-[11px] ${theme.textMuted} leading-relaxed line-clamp-2`}>
                      {themeObj.description}
                    </p>

                    <div className="pt-2 border-t dark:border-slate-800/60 border-slate-200/60 flex items-center justify-between w-full">
                      <div className="flex gap-1.5 items-center">
                        <span 
                          className="w-4 h-4 rounded-md border border-black/15 shadow-inner" 
                          style={{ backgroundColor: themeObj.bgHex }}
                          title={`Canvas: ${themeObj.bgHex}`} 
                        />
                        <span 
                          className="w-4 h-4 rounded-md border border-black/15 shadow-inner" 
                          style={{ backgroundColor: themeObj.sidebarHex }}
                          title={`Sidebar: ${themeObj.sidebarHex}`} 
                        />
                        <span 
                          className="w-4 h-4 rounded-md border border-black/15 shadow-inner" 
                          style={{ backgroundColor: themeObj.accentHex }}
                          title={`Accent: ${themeObj.accentHex}`} 
                        />
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400">
                        {themeObj.contrastRatio}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Data Management Tab */}
        {activeSection === 'data' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Data Management</h3>
              <p className={`text-xs ${theme.textMuted}`}>Export, import, and backup all your saved designs client-side.</p>
            </div>

            <div className={`space-y-6 border rounded-2xl p-6 ${theme.border}`}>
              {/* Asset statistics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 rounded-xl border ${theme.border}`}>
                  <span className="block text-xl font-bold text-indigo-400">{savedPalettes.length}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.textMuted}`}>Palettes</span>
                </div>
                <div className={`p-3 rounded-xl border ${theme.border}`}>
                  <span className="block text-xl font-bold text-emerald-400">{savedPatterns.length}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.textMuted}`}>Patterns</span>
                </div>
                <div className={`p-3 rounded-xl border ${theme.border}`}>
                  <span className="block text-xl font-bold text-sky-400">{savedIcons.length}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.textMuted}`}>Icons</span>
                </div>
              </div>

              <hr className={theme.border} />

              {/* Data operations */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportData}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Export Backup File (.json)
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 py-3 px-4 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    theme.isDark 
                      ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Upload size={14} /> Import Backup File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportData}
                  accept=".json"
                  className="hidden"
                />
              </div>

              {importStatus && (
                <div className={`p-3 rounded-xl text-center text-xs font-bold ${
                  importStatus.success 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {importStatus.message}
                </div>
              )}

              <hr className={theme.border} />

              {/* Reset Factory settings */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div>
                  <h4 className="text-sm font-semibold text-red-400 flex items-center gap-1.5">
                    <Trash2 size={15} /> Danger Zone
                  </h4>
                  <p className="text-xs text-slate-400">Perform a full wipe of Krasola, purging all saved design assets and local preferences.</p>
                </div>
                <button
                  onClick={handleResetAll}
                  className="py-2 px-4 bg-red-600 hover:bg-red-500 active:scale-95 transition-all text-white text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0"
                >
                  <RefreshCw size={12} /> Reset All Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About & Version Information Tab */}
        {activeSection === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">About Krasola</h3>
              <p className={`text-xs ${theme.textMuted}`}>Platform diagnostics, version control, and engine architecture.</p>
            </div>

            <div className={`border rounded-2xl p-6 space-y-6 ${theme.card}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 p-0.5 shadow-xl shadow-indigo-500/25 flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-white text-3xl">
                      K
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold">Krasola Creative Suite</h4>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {APP_STAGE}
                      </span>
                    </div>
                    <p className={`text-xs ${theme.textMuted}`}>SemVer {APP_VERSION} &middot; Commit {COMMIT_HASH}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsChangelogOpen(true)}
                    className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    <History size={13} /> View Changelog & Releases
                  </button>

                  <button
                    onClick={handleCheckUpdate}
                    disabled={isCheckingUpdate}
                    className="py-2 px-3.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <RefreshCw size={13} className={isCheckingUpdate ? 'animate-spin' : ''} />
                    {isCheckingUpdate ? 'Checking Server...' : 'Check Updates'}
                  </button>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${theme.isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                Krasola is a high-performance design workspace uniting Palette Lab, Pattern Studio, Image Search Hub, Cloud Vault, and In-App Notifications with real-time browser sandbox execution.
              </p>

              <hr className={theme.border} />

              {/* Version & Build Diagnostics Grid */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider opacity-60">System & Build Diagnostics</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${theme.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Semantic Version</span>
                    <span className="font-mono font-bold text-indigo-400">v{APP_VERSION}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${theme.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Git Commit</span>
                    <span className="font-mono font-bold text-sky-400">{COMMIT_HASH}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${theme.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Built On</span>
                    <span className={`font-medium truncate block ${theme.isDark ? 'text-slate-300' : 'text-slate-800 font-semibold'}`}>{getFormattedBuildDate()}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${theme.isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">PWA Engine</span>
                    <span className="font-medium text-emerald-400">Active (sw.js)</span>
                  </div>
                </div>
              </div>

              <hr className={theme.border} />

              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider opacity-60">Engine & Stack</h5>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  <li className="flex items-center gap-1.5">⚛️ React 18</li>
                  <li className="flex items-center gap-1.5">⚡ Vite 6 Bundler</li>
                  <li className="flex items-center gap-1.5">🎨 Tailwind CSS</li>
                  <li className="flex items-center gap-1.5">☁️ Supabase Cloud</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Release History & Changelog Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
        theme={theme}
      />
    </div>
  );
}
