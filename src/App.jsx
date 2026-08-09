import React, { useState, useEffect } from 'react';
import { Palette, Layers, Heart, FolderHeart, Laptop, ExternalLink, Settings, Home as HomeIcon, Keyboard, Info, Check, Copy, Image as ImageIcon } from 'lucide-react';
import { THEMES } from './utils/themeUtils';
import { useTheme } from './context/ThemeContext';
import Home from './components/Home';
import PaletteLab from './components/PaletteLab';
import PatternStudio from './components/PatternStudio';
import IconFinder from './components/IconFinder';
import ImageSearch from './components/ImageSearch';
import SavedAssets from './components/SavedAssets';
import SettingsComponent from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('pref_default_tab') || 'home';
  });
  const [activePalette, setActivePalette] = useState(['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);

  // User preferences states
  const [enableGlow, setEnableGlow] = useState(() => {
    const saved = localStorage.getItem('pref_enable_glow');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [enableShortcuts, setEnableShortcuts] = useState(() => {
    const saved = localStorage.getItem('pref_enable_shortcuts');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [defaultTab, setDefaultTab] = useState(() => {
    const saved = localStorage.getItem('pref_default_tab');
    return saved ? saved : 'home';
  });

  useEffect(() => {
    localStorage.setItem('pref_enable_glow', JSON.stringify(enableGlow));
  }, [enableGlow]);

  useEffect(() => {
    localStorage.setItem('pref_enable_shortcuts', JSON.stringify(enableShortcuts));
  }, [enableShortcuts]);

  useEffect(() => {
    localStorage.setItem('pref_default_tab', defaultTab);
  }, [defaultTab]);
  
  // Consume global ThemeContext
  const { theme, activeThemeId, setActiveThemeId } = useTheme();

  // Saved configs states (Local Storage fallback)
  const [savedPalettes, setSavedPalettes] = useState(() => {
    const saved = localStorage.getItem('saved_palettes');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedPatterns, setSavedPatterns] = useState(() => {
    const saved = localStorage.getItem('saved_patterns');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedIcons, setSavedIcons] = useState(() => {
    const saved = localStorage.getItem('saved_icons');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedImages, setSavedImages] = useState(() => {
    const saved = localStorage.getItem('saved_images');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('saved_palettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    localStorage.setItem('saved_patterns', JSON.stringify(savedPatterns));
  }, [savedPatterns]);

  useEffect(() => {
    localStorage.setItem('saved_icons', JSON.stringify(savedIcons));
  }, [savedIcons]);

  useEffect(() => {
    localStorage.setItem('saved_images', JSON.stringify(savedImages));
  }, [savedImages]);

  // Operations
  const handleSavePalette = (newPalette) => {
    setSavedPalettes(prev => [...prev, newPalette]);
  };
  const handleDeletePalette = (index) => {
    setSavedPalettes(prev => prev.filter((_, i) => i !== index));
  };
  const handleLoadPalette = (colors) => {
    setActivePalette(colors);
    setActiveTab('palette');
  };

  const handleSavePattern = (newPattern) => {
    setSavedPatterns(prev => [...prev, newPattern]);
  };
  const handleDeletePattern = (index) => {
    setSavedPatterns(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveIcon = (newIcon) => {
    setSavedIcons(prev => [...prev, newIcon]);
  };
  const handleDeleteIcon = (index) => {
    setSavedIcons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveImage = (newImage) => {
    setSavedImages(prev => [...prev, newImage]);
  };
  const handleDeleteImage = (index) => {
    setSavedImages(prev => prev.filter((_, i) => i !== index));
  };

  const copyHexToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1000);
  };

  const totalSavedCount = savedPalettes.length + savedPatterns.length + savedIcons.length + savedImages.length;

  // Breadcrumb mappings
  const tabTitles = {
    home: 'Workspace Overview',
    palette: 'Palette Lab',
    pattern: 'Pattern Studio',
    icon: 'Icon Finder',
    imagesearch: 'Image Search Studio',
    saved: 'Saved Assets',
    settings: 'Settings & Configurations'
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-all duration-300 ${theme.bg} ${theme.text}`}>
      {/* Sidebar navigation */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} border-r flex flex-col justify-between shrink-0 transition-all duration-300 ${theme.sidebar}`}>
        <div className={`p-4 space-y-7 overflow-y-auto ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {/* Logo / Header with Collapse Button */}
          <div className={`flex items-center justify-between w-full ${isCollapsed ? 'flex-col gap-4' : ''}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-extrabold text-lg shrink-0">
                K
              </div>
              {!isCollapsed && (
                <div className="transition-opacity duration-300">
                  <h1 className="text-md font-bold tracking-tight">Krasola</h1>
                  <span className={`text-[10px] font-semibold tracking-wider uppercase ${theme.textMuted}`}>Multi-Utility</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 rounded-xl border transition-all ${
                theme.isDark 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isCollapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1 pt-2 w-full">
            <button
              onClick={() => setActiveTab('home')}
              title="Home"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'home'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HomeIcon size={18} />
              {!isCollapsed && <span>Home</span>}
            </button>

            <button
              onClick={() => setActiveTab('palette')}
              title="Palette Lab"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'palette'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Palette size={18} />
              {!isCollapsed && <span>Palette Lab</span>}
            </button>

            <button
              onClick={() => setActiveTab('pattern')}
              title="Pattern Studio"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'pattern'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers size={18} />
              {!isCollapsed && <span>Pattern Studio</span>}
            </button>

            <button
              onClick={() => setActiveTab('icon')}
              title="Icon Finder"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'icon'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart size={18} />
              {!isCollapsed && <span>Icon Finder</span>}
            </button>

            <button
              onClick={() => setActiveTab('imagesearch')}
              title="Image Search Studio"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'imagesearch'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ImageIcon size={18} />
              {!isCollapsed && <span>Image Studio</span>}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              title="Saved Assets"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'saved'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderHeart size={18} />
              {!isCollapsed && <span>Saved Assets</span>}
              {totalSavedCount > 0 && (
                isCollapsed ? (
                  <span className="absolute w-2 h-2 rounded-full bg-indigo-500 translate-x-3 -translate-y-3" />
                ) : (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
                    theme.isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {totalSavedCount}
                  </span>
                )
              )}
            </button>
          </nav>
        </div>

        {/* Footer info containing settings button at the corner */}
        <div className={`p-3 border-t transition-colors duration-300 ${theme.border} flex items-center ${isCollapsed ? 'flex-col gap-1.5 justify-center' : 'justify-between px-4'}`}>
          <button
            onClick={() => {
              setActiveTab('settings');
              setIsCollapsed(true);
            }}
            title="Settings"
            className={`p-1.5 rounded-xl border transition-all ${
              activeTab === 'settings'
                ? theme.accent
                : theme.isDark
                  ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Settings size={14} />
          </button>
          <span className="text-[10px] text-slate-500 font-bold">
            {isCollapsed ? 'v1.0' : 'Krasola v1.0.0'}
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Global Dashboard Header */}
        <header className={`h-16 border-b px-6 flex items-center justify-between shrink-0 transition-colors duration-300 ${
          theme.isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Left: Active view breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={theme.textMuted}>Krasola</span>
            <span className={theme.textMuted}>/</span>
            <span className="text-sm font-bold tracking-tight">{tabTitles[activeTab]}</span>
          </div>

          {/* Center: Global active palette preview strip */}
          {activePalette.length > 0 && (
            <div className="hidden md:flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.textMuted} flex items-center gap-1`}>
                Active Palette:
              </span>
              <div className="flex rounded-lg overflow-hidden border dark:border-slate-800 border-slate-200">
                {activePalette.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyHexToClipboard(hex)}
                    style={{ backgroundColor: hex }}
                    title={`Click to copy: ${hex}`}
                    className="w-6 h-6 hover:scale-110 active:scale-95 transition-all relative group flex items-center justify-center"
                  >
                    {copiedHex === hex ? (
                      <Check size={10} className="text-white drop-shadow-md" />
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 text-[8px] text-white drop-shadow-md">
                        📋
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Right: Theme dropdown selector + Active helper */}
          <div className="flex items-center gap-4">
            {/* Quick Keyboard shortcut helpers */}
            {activeTab === 'palette' && (
              <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
                theme.isDark ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Keyboard size={13} className="text-indigo-400" />
                <span>Press <kbd className="font-bold bg-black/10 px-1 py-0.5 rounded text-[10px]">Space</kbd> to Randomize</span>
              </div>
            )}

            {/* Global Theme selector moved to header */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsCollapsed(true);
                }}
                className={`p-1.5 rounded-xl border transition-all ${
                  theme.isDark 
                    ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-250 text-slate-750'
                }`}
                title="Settings"
              >
                <Settings size={14} />
              </button>
              <select
                value={activeThemeId}
                onChange={(e) => setActiveThemeId(e.target.value)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${
                  theme.isDark 
                    ? 'bg-slate-800/90 border-slate-700 text-slate-200' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {THEMES.map((themeObj) => (
                  <option key={themeObj.id} value={themeObj.id}>
                    {themeObj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto h-full relative">
          {/* Glow Effects */}
          {enableGlow && (
            <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] ${theme.glow} rounded-full blur-[120px] pointer-events-none transition-all duration-300`} />
          )}

          <div className="relative z-10 h-full">
            {activeTab === 'home' && (
              <Home
                setActiveTab={setActiveTab}
                savedCount={totalSavedCount}
                activePalette={activePalette}
              />
            )}

            {activeTab === 'palette' && (
              <PaletteLab
                activePalette={activePalette}
                setActivePalette={setActivePalette}
                onSavePalette={handleSavePalette}
                enableShortcuts={enableShortcuts}
              />
            )}

            {activeTab === 'pattern' && (
              <PatternStudio
                activePalette={activePalette}
                onSavePattern={handleSavePattern}
              />
            )}

            {activeTab === 'icon' && (
              <IconFinder
                activePalette={activePalette}
                onSaveIcon={handleSaveIcon}
              />
            )}

            {activeTab === 'imagesearch' && (
              <ImageSearch
                onSendToPaletteLab={(colors) => {
                  setActivePalette(colors);
                  setActiveTab('palette');
                }}
                onSaveImage={handleSaveImage}
              />
            )}

            {activeTab === 'saved' && (
              <SavedAssets
                savedPalettes={savedPalettes}
                savedPatterns={savedPatterns}
                savedIcons={savedIcons}
                savedImages={savedImages}
                onDeletePalette={handleDeletePalette}
                onDeletePattern={handleDeletePattern}
                onDeleteIcon={handleDeleteIcon}
                onDeleteImage={handleDeleteImage}
                onLoadPalette={handleLoadPalette}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsComponent
                savedPalettes={savedPalettes}
                savedPatterns={savedPatterns}
                savedIcons={savedIcons}
                savedImages={savedImages}
                setSavedPalettes={setSavedPalettes}
                setSavedPatterns={setSavedPatterns}
                setSavedIcons={setSavedIcons}
                setSavedImages={setSavedImages}
                enableGlow={enableGlow}
                setEnableGlow={setEnableGlow}
                enableShortcuts={enableShortcuts}
                setEnableShortcuts={setEnableShortcuts}
                defaultTab={defaultTab}
                setDefaultTab={setDefaultTab}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
