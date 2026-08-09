import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Palette, 
  BookOpen, 
  Download, 
  FolderHeart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { 
  fetchIconsList, 
  fetchRawSvg, 
  modifySvg 
} from './icon/iconUtils';
import IconSearch from './icon/IconSearch';
import IconPalette from './icon/IconPalette';
import IconCollections from './icon/IconCollections';
import IconExport from './icon/IconExport';

export default function IconFinder({ activePalette = [], onSaveIcon }) {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState('search');
  const [isSubSidebarCollapsed, setIsSubSidebarCollapsed] = useState(false);

  // Search & API State
  const [searchQuery, setSearchQuery] = useState('home');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [iconsList, setIconsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [iconSvgContent, setIconSvgContent] = useState('');

  // Editor states
  const [color, setColor] = useState('#6366f1');
  const [size, setSize] = useState(64);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Sync color changes from Palette Lab
  useEffect(() => {
    if (activePalette.length >= 2) {
      setColor(activePalette[1]);
    }
  }, [activePalette]);

  // Debounced API fetch for icons search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery) return;
      setLoading(true);
      const list = await fetchIconsList(searchQuery, selectedCollection);
      setIconsList(list);
      
      // Auto-load first match on query change
      if (list.length > 0) {
        selectIconItem(list[0]);
      }
      setLoading(false);
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCollection]);

  // Load raw SVG for selected icon
  const selectIconItem = async (iconName) => {
    setSelectedIcon(iconName);
    const rawSvg = await fetchRawSvg(iconName);
    setIconSvgContent(rawSvg);
  };

  // Modify SVG based on editor parameters
  const modifiedSvg = modifySvg(iconSvgContent, {
    size,
    strokeWidth,
    color,
    rotation,
    flipH,
    flipV
  });

  // Save customized icon configuration
  const handleSave = () => {
    if (!selectedIcon) return;
    const name = prompt('Name this icon configuration:', `${selectedIcon.split(':').pop()} Config`);
    if (name) {
      onSaveIcon({
        name,
        iconName: selectedIcon,
        svg: modifiedSvg,
        settings: { color, size, strokeWidth, rotation, flipH, flipV }
      });
    }
  };

  const navItems = [
    { id: 'search', name: 'Search & Editor', icon: Search },
    { id: 'palette', name: 'Palette Matcher', icon: Palette },
    { id: 'collections', name: 'Icon Collections', icon: BookOpen },
    { id: 'export', name: 'Export Hub', icon: Download }
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${theme.card}`}>
      {/* Collapsible Sub-Sidebar */}
      <aside className={`transition-all duration-300 border-b lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0 relative z-20 ${
        isSubSidebarCollapsed ? 'w-full lg:w-16' : 'w-full lg:w-60'
      } ${
        theme.isDark ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-slate-200'
      }`}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
            {!isSubSidebarCollapsed && (
              <div>
                <h3 className="text-sm font-black tracking-tight">Icon Finder</h3>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.textMuted}`}>Creator Suite</span>
              </div>
            )}
            
            <button
              onClick={() => setIsSubSidebarCollapsed(!isSubSidebarCollapsed)}
              className="hidden lg:flex p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 text-xs text-slate-400 ml-auto transition-all"
              title={isSubSidebarCollapsed ? "Expand Sub-Sidebar" : "Collapse Sub-Sidebar"}
            >
              {isSubSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  title={item.name}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all ${
                    isSubSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5'
                  } ${
                    isActive
                      ? theme.accent
                      : theme.isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  {!isSubSidebarCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick action buttons in sidebar footer */}
        <div className={`p-4 border-t transition-colors duration-300 dark:border-slate-800 border-slate-200 ${
          isSubSidebarCollapsed ? 'flex flex-col items-center gap-3' : 'space-y-2'
        }`}>
          {!isSubSidebarCollapsed ? (
            <button
              onClick={handleSave}
              disabled={!selectedIcon}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <FolderHeart size={13} /> Save Icon
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!selectedIcon}
              className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow disabled:opacity-30 disabled:pointer-events-none"
              title="Save Icon"
            >
              <FolderHeart size={13} />
            </button>
          )}
        </div>
      </aside>

      {/* Workspace content tab shell */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {activeSubTab === 'search' && (
          <IconSearch
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            iconsList={iconsList} selectedIcon={selectedIcon} selectIconItem={selectIconItem} loading={loading}
            size={size} setSize={setSize}
            strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth}
            rotation={rotation} setRotation={setRotation}
            flipH={flipH} setFlipH={setFlipH}
            flipV={flipV} setFlipV={setFlipV}
            color={color} setColor={setColor}
            modifiedSvg={modifiedSvg}
          />
        )}

        {activeSubTab === 'palette' && (
          <IconPalette
            activePalette={activePalette}
            color={color} setColor={setColor}
          />
        )}

        {activeSubTab === 'collections' && (
          <IconCollections
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
        )}

        {activeSubTab === 'export' && (
          <IconExport
            modifiedSvg={modifiedSvg}
            selectedIcon={selectedIcon}
          />
        )}
      </main>
    </div>
  );
}
