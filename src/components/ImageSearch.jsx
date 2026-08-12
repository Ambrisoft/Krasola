import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Palette, 
  Sliders, 
  Info, 
  Download, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { searchImagesWithFallback } from './image/imageUtils';
import ImageSearchHub from './image/ImageSearchHub';
import ImageColorExtractor from './image/ImageColorExtractor';
import ImageEditorCanvas from './image/ImageEditorCanvas';
import ImageVectorStudio from './image/ImageVectorStudio';
import ImageExport from './image/ImageExport';
import { checkRateLimit } from '../utils/rateLimit';

export default function ImageSearch({ onSendToPaletteLab, onSaveImage }) {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState('search');
  const [isSubSidebarCollapsed, setIsSubSidebarCollapsed] = useState(false);

  // Helper to load persistent last search state from localStorage
  const getInitialSearchState = () => {
    try {
      const saved = localStorage.getItem('last_image_search_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse last_image_search_state:', e);
    }
    return null;
  };

  const initialSavedState = getInitialSearchState();

  // Search & API State initialized from persistent localStorage
  const [searchQuery, setSearchQuery] = useState(() => initialSavedState?.searchQuery || 'home');
  const [orientation, setOrientation] = useState(() => initialSavedState?.orientation || 'all');
  const [license, setLicense] = useState(() => initialSavedState?.license || 'all');
  const [imagesList, setImagesList] = useState(() => initialSavedState?.imagesList || []);
  const [loading, setLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState(() => initialSavedState?.providerInfo || '');
  const [selectedImage, setSelectedImage] = useState(() => initialSavedState?.selectedImage || null);

  // Sync current active search state to localStorage
  useEffect(() => {
    if (imagesList.length > 0) {
      localStorage.setItem('last_image_search_state', JSON.stringify({
        searchQuery,
        orientation,
        license,
        imagesList,
        providerInfo,
        selectedImage
      }));
    }
  }, [searchQuery, orientation, license, imagesList, providerInfo, selectedImage]);

  // Explicit Search Execution
  const handleExecuteSearch = async (targetQuery = searchQuery, targetOrientation = orientation, targetLicense = license) => {
    const rateLimit = checkRateLimit('image_search', 10, 60000); // 10 searches per minute limit
    if (!rateLimit.allowed) {
      alert(`Rate limit exceeded! Please wait ${rateLimit.retryAfter} seconds before trying again.`);
      return;
    }

    const q = targetQuery || 'home';
    setSearchQuery(q);
    setLoading(true);

    const res = await searchImagesWithFallback(q, { orientation: targetOrientation, license: targetLicense });
    setImagesList(res.results);
    setProviderInfo(res.provider);
    
    // Auto-select first result if none selected or if new query
    if (res.results.length > 0) {
      setSelectedImage(res.results[0]);
    }
    setLoading(false);
  };

  // On mount: restore previous search if available, or default to "home" only for first-time visitors
  useEffect(() => {
    if (!initialSavedState || !initialSavedState.imagesList || initialSavedState.imagesList.length === 0) {
      handleExecuteSearch('home', orientation, license);
    }
  }, []);

  const navItems = [
    { id: 'search', name: 'Search & Discovery', icon: Search },
    { id: 'extractor', name: 'Color Extractor', icon: Palette },
    { id: 'editor', name: 'Canvas Editor', icon: Sliders },
    { id: 'vector', name: 'Vector & Metadata', icon: Info },
    { id: 'export', name: 'Export & Vault', icon: Download }
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden ${theme.card}`}>
      {/* Collapsible Sub-Sidebar */}
      <aside className={`transition-all duration-300 border-b lg:border-b-0 lg:border-r flex flex-col justify-between shrink-0 relative ${
        isSubSidebarCollapsed ? 'w-full lg:w-16' : 'w-full lg:w-60'
      } ${
        theme.isDark ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-slate-200'
      }`}>
        <div className="p-4 space-y-4">
          {/* Header titles */}
          <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
            {!isSubSidebarCollapsed && (
              <div>
                <h3 className="text-sm font-black tracking-tight">Image Studio</h3>
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

          {/* Sub Navigation Items */}
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
                  <Icon size={16} />
                  {!isSubSidebarCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Selected Asset Mini-Badge */}
        {selectedImage && !isSubSidebarCollapsed && (
          <div className={`p-3 m-3 rounded-xl border ${theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-1 text-xs`}>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.textMuted} block`}>Active Image:</span>
            <p className="font-bold truncate text-[11px]">{selectedImage.title}</p>
          </div>
        )}
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto h-full relative">
        {activeSubTab === 'search' && (
          <ImageSearchHub
            searchQuery={searchQuery}
            onTriggerSearch={handleExecuteSearch}
            orientation={orientation}
            setOrientation={setOrientation}
            license={license}
            setLicense={setLicense}
            imagesList={imagesList}
            loading={loading}
            providerInfo={providerInfo}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            onOpenColorExtractor={() => setActiveSubTab('extractor')}
            onOpenEditor={() => setActiveSubTab('editor')}
          />
        )}

        {activeSubTab === 'extractor' && (
          <ImageColorExtractor
            selectedImage={selectedImage}
            onSendToPaletteLab={onSendToPaletteLab}
          />
        )}

        {activeSubTab === 'editor' && (
          <ImageEditorCanvas
            selectedImage={selectedImage}
          />
        )}

        {activeSubTab === 'vector' && (
          <ImageVectorStudio
            selectedImage={selectedImage}
          />
        )}

        {activeSubTab === 'export' && (
          <ImageExport
            selectedImage={selectedImage}
            onSaveImage={onSaveImage}
          />
        )}
      </main>
    </div>
  );
}
