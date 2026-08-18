import React, { useState, useEffect } from 'react';
import { Palette, Layers, Heart, FolderHeart, Laptop, ExternalLink, Settings, Home as HomeIcon, Keyboard, Info, Check, Copy, Image as ImageIcon, User, Activity, Download, Menu, X, Sparkles, Smartphone, ChevronRight, Bell } from 'lucide-react';
import { THEMES } from './utils/themeUtils';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';
import { useNotifications } from './context/NotificationContext';
import Home from './components/Home';
import PaletteLab from './components/PaletteLab';
import PatternStudio from './components/PatternStudio';
import IconFinder from './components/IconFinder';
import ImageSearch from './components/ImageSearch';
import SavedAssets from './components/SavedAssets';
import SettingsComponent from './components/Settings';
import Account from './components/Account';
import Monitoring from './components/Monitoring';
import PwaInstallModal from './components/pwa/PwaInstallModal';
import { NotificationCenterDrawer } from './components/notification/NotificationCenterDrawer';
import { supabase, isSupabaseConfigured, uploadUserImage, fetchUserImages, deleteUserImage } from './utils/supabaseClient';
import { getUniquePaletteName, getUniquePatternName } from './utils/namingUtils';
import { recordUserActivity } from './utils/telemetryTracker';
import { usePwaInstall } from './utils/pwaManager';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('current_active_tab') || localStorage.getItem('pref_default_tab') || 'home';
  });
  const [activePalette, setActivePalette] = useState(['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedHex, setCopiedHex] = useState(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { canInstall, isInstalled } = usePwaInstall();

  useEffect(() => {
    sessionStorage.setItem('current_active_tab', activeTab);
  }, [activeTab]);

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
  
  // Consume global ThemeContext and ToastContext
  const { theme, activeThemeId, setActiveThemeId } = useTheme();
  const { toast, showToast } = useToast();
  const { unreadCount, toggleDrawer } = useNotifications();

  // User auth state tracker
  const [user, setUser] = useState(null);
  const [cloudPalettes, setCloudPalettes] = useState([]);
  const [cloudPatterns, setCloudPatterns] = useState([]);
  const [cloudImages, setCloudImages] = useState([]);

  const fetchCloudAssets = async (currentUser = user) => {
    if (isSupabaseConfigured && currentUser) {
      try {
        const { data: palettes } = await supabase
          .from('community_palettes')
          .select('*')
          .eq('user_id', currentUser.id);
        if (palettes) setCloudPalettes(palettes);

        const { data: patterns } = await supabase
          .from('community_patterns')
          .select('*')
          .eq('user_id', currentUser.id);
        if (patterns) {
          const normalized = patterns.map(p => ({
            id: p.id,
            user_id: p.user_id,
            username: p.username,
            name: p.name,
            patternType: p.pattern_type,
            is_public: p.is_public !== false,
            settings: {
              width: p.width,
              height: p.height,
              scale: p.scale,
              stroke: p.stroke,
              angle: p.angle,
              bg: p.bg,
              color1: p.color1,
              color2: p.color2
            }
          }));
          setCloudPatterns(normalized);
        }

        const images = await fetchUserImages(currentUser);
        if (images) setCloudImages(images);
      } catch (e) {
        console.warn("Error fetching cloud assets", e);
      }
    } else {
      setCloudPalettes([]);
      setCloudPatterns([]);
      setCloudImages([]);
    }
  };

  const syncGuestAssetsToCloud = async (currentUser) => {
    if (!isSupabaseConfigured || !currentUser) return;
    
    try {
      const localPalettes = JSON.parse(localStorage.getItem('saved_palettes') || '[]');
      const localPatterns = JSON.parse(localStorage.getItem('saved_patterns') || '[]');
      const localImages = JSON.parse(localStorage.getItem('saved_images') || '[]');

      if (localPalettes.length === 0 && localPatterns.length === 0 && localImages.length === 0) return;

      const username = currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'Anonymous';
      let syncedCount = 0;

      // 1. Sync guest palettes
      if (localPalettes.length > 0) {
        const { data: existingPalettes } = await supabase
          .from('community_palettes')
          .select('name')
          .eq('user_id', currentUser.id);
        
        const existingNames = new Set((existingPalettes || []).map(p => p.name));

        const palettesToInsert = localPalettes.filter(p => !existingNames.has(p.name)).map(p => ({
          user_id: currentUser.id,
          username: username,
          name: p.name,
          colors: p.colors,
          mode: p.mode || 'Custom',
          is_public: p.is_public === true,
          likes: 0
        }));

        if (palettesToInsert.length > 0) {
          const { error } = await supabase.from('community_palettes').insert(palettesToInsert);
          if (!error) {
            syncedCount += palettesToInsert.length;
          }
        }
      }

      // 2. Sync guest patterns
      if (localPatterns.length > 0) {
        const { data: existingPatterns } = await supabase
          .from('community_patterns')
          .select('name')
          .eq('user_id', currentUser.id);
        
        const existingNames = new Set((existingPatterns || []).map(p => p.name));

        const patternsToInsert = localPatterns.filter(p => !existingNames.has(p.name)).map(p => ({
          user_id: currentUser.id,
          username: username,
          name: p.name,
          pattern_type: p.patternType || 'dots',
          width: p.settings?.width || 40,
          height: p.settings?.height || 40,
          scale: p.settings?.scale || 1,
          stroke: p.settings?.stroke || 2,
          angle: p.settings?.angle || 0,
          bg: p.settings?.bg || '#0f172a',
          color1: p.settings?.color1 || '#6366f1',
          color2: p.settings?.color2 || '#38bdf8',
          is_public: p.is_public === true
        }));

        if (patternsToInsert.length > 0) {
          const { error } = await supabase.from('community_patterns').insert(patternsToInsert);
          if (!error) {
            syncedCount += patternsToInsert.length;
          }
        }
      }

      // 3. Clear local storage after successful sync
      localStorage.setItem('saved_palettes', '[]');
      localStorage.setItem('saved_patterns', '[]');
      setSavedPalettes([]);
      setSavedPatterns([]);

      if (syncedCount > 0) {
        showToast(`Synced ${syncedCount} guest creation${syncedCount > 1 ? 's' : ''} to your account!`);
      }
    } catch (e) {
      console.warn("Auto-sync error on login:", e);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          syncGuestAssetsToCloud(currentUser).then(() => fetchCloudAssets(currentUser));
        }
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          syncGuestAssetsToCloud(currentUser).then(() => fetchCloudAssets(currentUser));
        } else {
          setCloudPalettes([]);
          setCloudPatterns([]);
          setCloudImages([]);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCloudAssets(user);
    }
  }, [user]);

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

  // Combined items list
  const displayedPalettes = [...savedPalettes, ...cloudPalettes];
  const displayedPatterns = [...savedPatterns, ...cloudPatterns];
  const displayedImages = [...savedImages, ...cloudImages];

  // Operations
  const handleSavePalette = async (newPalette) => {
    const autoSyncVal = JSON.parse(localStorage.getItem('pref_auto_sync') || 'true');
    const isPublicChoice = newPalette.isPublic === true;

    // Smart unique name generation based on color profile
    const paletteName = newPalette.name || await getUniquePaletteName(
      newPalette.colors,
      displayedPalettes.map(p => p.name),
      isSupabaseConfigured ? supabase : null
    );

    if (user && autoSyncVal && isSupabaseConfigured) {
      try {
        const username = user.user_metadata?.display_name || user.email.split('@')[0];
        const { data, error } = await supabase.from('community_palettes').insert([{
          user_id: user.id,
          username: username,
          name: paletteName,
          colors: newPalette.colors,
          mode: newPalette.mode || 'Custom',
          is_public: isPublicChoice,
          likes: 0
        }]).select();
        if (!error && data) {
          fetchCloudAssets();
          recordUserActivity({
            category: 'creation',
            title: 'Saved Color Palette',
            description: `Saved "${paletteName}" (${newPalette.colors?.length || 5} swatches • ${isPublicChoice ? 'Public' : 'Private'})`,
            status: 'success'
          });
          showToast(
            isPublicChoice
              ? `Saved & published palette "${paletteName}" to Community!`
              : `Saved private palette "${paletteName}" to your cloud vault!`
          );
          return;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    // Fallback to local offline vault
    const localEntry = {
      ...newPalette,
      name: paletteName,
      is_public: false,
      id: newPalette.id || Math.random().toString(36).substring(2)
    };
    setSavedPalettes(prev => [...prev, localEntry]);
    recordUserActivity({
      category: 'creation',
      title: 'Saved Color Palette (Local)',
      description: `Saved "${paletteName}" to offline vault`,
      status: 'info'
    });
    showToast(`Saved private palette "${paletteName}" to local vault!`);
  };

  const handleDeletePalette = async (index) => {
    const item = displayedPalettes[index];
    if (item && item.user_id && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('community_palettes').delete().eq('id', item.id);
        if (error) throw error;
        fetchCloudAssets();
        showToast("Deleted from cloud vault!");
      } catch (e) {
        console.error(e);
      }
    } else if (item) {
      setSavedPalettes(prev => prev.filter(p => p.id !== item.id));
      showToast("Deleted from local vault.");
    }
  };

  const handleLoadPalette = (colors) => {
    setActivePalette(colors);
    setActiveTab('palette');
  };

  const handleSavePattern = async (newPattern) => {
    const autoSyncVal = JSON.parse(localStorage.getItem('pref_auto_sync') || 'true');
    const isPublicChoice = newPattern.isPublic === true;

    // Smart unique name generation based on pattern attributes
    const patternColors = [
      newPattern.settings?.bg,
      newPattern.settings?.color1,
      newPattern.settings?.color2
    ].filter(Boolean);

    const patternName = newPattern.name || await getUniquePatternName(
      newPattern.patternType,
      newPattern.settings,
      patternColors,
      displayedPatterns.map(p => p.name),
      isSupabaseConfigured ? supabase : null
    );

    if (user && autoSyncVal && isSupabaseConfigured) {
      try {
        const username = user.user_metadata?.display_name || user.email.split('@')[0];
        const { data, error } = await supabase.from('community_patterns').insert([{
          user_id: user.id,
          username: username,
          name: patternName,
          pattern_type: newPattern.patternType || 'dots',
          width: newPattern.settings?.width || 40,
          height: newPattern.settings?.height || 40,
          scale: newPattern.settings?.scale || 1,
          stroke: newPattern.settings?.stroke || 2,
          angle: newPattern.settings?.angle || 0,
          bg: newPattern.settings?.bg || '#0f172a',
          color1: newPattern.settings?.color1 || '#6366f1',
          color2: newPattern.settings?.color2 || '#38bdf8',
          is_public: isPublicChoice
        }]).select();
        if (!error && data) {
          fetchCloudAssets();
          recordUserActivity({
            category: 'creation',
            title: 'Saved Vector Pattern',
            description: `Saved "${patternName}" (${newPattern.patternType || 'dots'} • ${isPublicChoice ? 'Public' : 'Private'})`,
            status: 'success'
          });
          showToast(
            isPublicChoice
              ? `Saved & published pattern "${patternName}" to Community!`
              : `Saved private pattern "${patternName}" to your cloud account!`
          );
          return;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    // Fallback to local offline vault
    const localEntry = {
      ...newPattern,
      name: patternName,
      is_public: false,
      id: newPattern.id || Math.random().toString(36).substring(2)
    };
    setSavedPatterns(prev => [...prev, localEntry]);
    recordUserActivity({
      category: 'creation',
      title: 'Saved Vector Pattern (Local)',
      description: `Saved "${patternName}" to offline vault`,
      status: 'info'
    });
    showToast(`Saved private pattern "${patternName}" to local vault!`);
  };

  const handleTogglePublicAsset = async (assetType, item) => {
    if (!user) {
      toast.warning("Please sign in to publish your creations to the public Community Gallery!");
      return;
    }
    const table = assetType === 'palette' 
      ? 'community_palettes' 
      : assetType === 'pattern' 
        ? 'community_patterns' 
        : 'user_images';
    const newStatus = !item.is_public;

    if (item.user_id && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from(table)
          .update({ is_public: newStatus })
          .eq('id', item.id)
          .select();

        if (error) throw error;

        // Optimistically update cloud state for instant UI re-render
        if (assetType === 'palette') {
          setCloudPalettes(prev => prev.map(p => p.id === item.id ? { ...p, is_public: newStatus } : p));
        } else if (assetType === 'pattern') {
          setCloudPatterns(prev => prev.map(p => p.id === item.id ? { ...p, is_public: newStatus } : p));
        } else {
          setCloudImages(prev => prev.map(p => p.id === item.id ? { ...p, is_public: newStatus } : p));
        }

        await fetchCloudAssets();
        toast.success(newStatus ? `Published "${item.name || item.title}" to Community Gallery!` : `Made "${item.name || item.title}" Private.`);
      } catch (e) {
        console.error("Failed to toggle visibility:", e);
        toast.error("Failed to update visibility status.");
      }
    } else {
      // Local offline item being toggled by logged-in user
      if (assetType === 'palette') {
        await handleSavePalette({ ...item, isPublic: newStatus });
        setSavedPalettes(prev => prev.filter(p => p.id !== item.id));
      } else if (assetType === 'pattern') {
        await handleSavePattern({ ...item, isPublic: newStatus });
        setSavedPatterns(prev => prev.filter(p => p.id !== item.id));
      } else {
        await handleSaveImage({ ...item, isPublic: newStatus });
        setSavedImages(prev => prev.filter(p => p.id !== item.id));
      }
    }
  };

  const handleDeletePattern = async (index) => {
    const item = displayedPatterns[index];
    if (item && item.user_id && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('community_patterns').delete().eq('id', item.id);
        if (error) throw error;
        fetchCloudAssets();
        toast.success("Deleted from cloud vault!");
      } catch (e) {
        console.error(e);
      }
    } else if (item) {
      setSavedPatterns(prev => prev.filter(p => p.id !== item.id));
      toast.info("Deleted from local vault.");
    }
  };

  const handleSaveIcon = (newIcon) => {
    setSavedIcons(prev => [...prev, newIcon]);
    toast.success("Saved icon!");
  };
  const handleDeleteIcon = (index) => {
    setSavedIcons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveImage = async (newImage) => {
    if (user && isSupabaseConfigured) {
      try {
        if (newImage.blob) {
          await uploadUserImage(newImage.blob, {
            title: newImage.title || 'Untitled Artwork',
            creator: newImage.creator || 'Krasola Studio',
            width: newImage.width || 1920,
            height: newImage.height || 1080,
            isPublic: newImage.isPublic === true
          }, user);
          await fetchCloudAssets(user);
          recordUserActivity({
            category: 'storage',
            title: 'Uploaded Cloud Image',
            description: `Uploaded "${newImage.title}" (${newImage.width}×${newImage.height} • ${newImage.isPublic ? 'Public' : 'Private'})`,
            status: 'success'
          });
          toast.success(
            newImage.isPublic
              ? `Saved & published "${newImage.title}" to Community Gallery!`
              : `Saved private image "${newImage.title}" to your cloud vault!`
          );
          return;
        }
      } catch (e) {
        console.warn("Cloud image save error:", e);
        toast.error(e.message || "Failed to upload image to cloud storage.");
        return;
      }
    }

    // Local fallback
    const localEntry = {
      ...newImage,
      id: newImage.id || Math.random().toString(36).substring(2),
      is_public: false
    };
    setSavedImages(prev => [...prev, localEntry]);
    recordUserActivity({
      category: 'storage',
      title: 'Saved Image (Local)',
      description: `Saved "${newImage.title}" to offline vault`,
      status: 'info'
    });
    toast.info(`Saved "${newImage.title}" to local vault!`);
  };

  const handleDeleteImage = async (index) => {
    const item = displayedImages[index];
    if (item && item.user_id && isSupabaseConfigured) {
      try {
        await deleteUserImage(item.id, item.storage_path, user);
        await fetchCloudAssets(user);
        toast.success("Deleted image from cloud vault!");
      } catch (e) {
        toast.error(`Delete failed: ${e.message}`);
      }
    } else if (item) {
      setSavedImages(prev => prev.filter(p => p.id !== item.id));
      toast.info("Deleted from local vault.");
    }
  };

  const copyHexToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1000);
  };

  const totalSavedCount = displayedPalettes.length + displayedPatterns.length + savedIcons.length + savedImages.length;

  // Breadcrumb mappings
  const tabTitles = {
    home: 'Workspace Overview',
    palette: 'Palette Lab',
    pattern: 'Pattern Studio',
    icon: 'Icon Finder',
    imagesearch: 'Image Search Studio',
    saved: 'Saved Assets',
    monitoring: 'Activity & Usage Hub',
    account: 'Account Studio',
    settings: 'Settings & Configurations'
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-all duration-300 ${theme.bg} ${theme.text}`}>
      {/* Desktop Sidebar navigation */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} border-r hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 ${theme.sidebar}`}>
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

            <button
              onClick={() => setActiveTab('monitoring')}
              title="Activity & Usage Hub"
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all ${
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
              } ${
                activeTab === 'monitoring'
                  ? theme.accent
                  : theme.isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity size={18} />
              {!isCollapsed && <span>Usage & Activity</span>}
            </button>
          </nav>
        </div>

        {/* Desktop Sidebar Footer with Install App Banner */}
        <div className={`p-3 border-t transition-colors duration-300 ${theme.border} space-y-2`}>
          {!isInstalled && !isCollapsed && (
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600/20 to-sky-600/20 hover:from-indigo-600/30 hover:to-sky-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl flex items-center justify-between transition-all group"
            >
              <span className="flex items-center gap-1.5">
                <Download size={13} className="text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
                Install App
              </span>
              <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300">PWA</span>
            </button>
          )}

          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-1.5 justify-center' : 'justify-between px-1'}`}>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('account')}
                title="Account Studio"
                className={`p-1.5 rounded-xl border transition-all ${
                  activeTab === 'account'
                    ? theme.accent
                    : theme.isDark
                      ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <User size={14} />
              </button>
              <button
                onClick={() => setActiveTab('monitoring')}
                title="Activity & Usage"
                className={`p-1.5 rounded-xl border transition-all ${
                  activeTab === 'monitoring'
                    ? theme.accent
                    : theme.isDark
                      ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Activity size={14} />
              </button>
              <button
                onClick={() => setActiveTab('settings')}
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
            </div>
            <span className="text-[10px] text-slate-500 font-bold">
              {isCollapsed ? 'v1.0' : 'Krasola v1.0.0'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header (Shown on < 768px) */}
        <header className={`md:hidden h-14 border-b px-4 flex items-center justify-between shrink-0 z-30 transition-colors duration-300 ${
          theme.isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
        } backdrop-blur-md`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-base shrink-0">
              K
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight leading-none">Krasola</h1>
              <span className={`text-[9px] font-bold tracking-wider uppercase ${theme.textMuted}`}>{tabTitles[activeTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Notification Bell */}
            <button
              onClick={toggleDrawer}
              className={`p-2 rounded-xl border relative transition-all ${
                theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {!isInstalled && (
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="py-1 px-2.5 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
              >
                <Download size={12} /> Install
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-xl border transition-all ${
                theme.isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Open Menu"
            >
              <Menu size={16} />
            </button>
          </div>
        </header>

        {/* Global Desktop Header (Shown on >= 768px) */}
        <header className={`hidden md:flex h-16 border-b px-6 items-center justify-between shrink-0 transition-colors duration-300 ${
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
            <div className="flex items-center gap-3">
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

          {/* Right: Install button + Theme dropdown selector */}
          <div className="flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="py-1.5 px-3 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                title="Install Krasola as a standalone Desktop App"
              >
                <Download size={13} /> Install App
              </button>
            )}

            {/* Quick Keyboard shortcut helpers */}
            {activeTab === 'palette' && (
              <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
                theme.isDark ? 'bg-slate-800/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Keyboard size={13} className="text-indigo-400" />
                <span>Press <kbd className="font-bold bg-black/10 px-1 py-0.5 rounded text-[10px]">Space</kbd> to Randomize</span>
              </div>
            )}

            {/* Desktop Notification Bell */}
            <button
              onClick={toggleDrawer}
              className={`p-2 rounded-xl border relative transition-all ${
                theme.isDark 
                  ? 'bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Open Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Global Theme selector */}
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

        {/* Main Content Workspace with Adaptive Padding for Mobile Bottom Bar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-full relative pb-24 md:pb-8">
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
                isLoggedIn={!!user}
                enableShortcuts={enableShortcuts}
              />
            )}

            {activeTab === 'pattern' && (
              <PatternStudio
                activePalette={activePalette}
                onSavePattern={handleSavePattern}
                isLoggedIn={!!user}
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
                isLoggedIn={!!user}
              />
            )}

            {activeTab === 'saved' && (
              <SavedAssets
                savedPalettes={displayedPalettes}
                savedPatterns={displayedPatterns}
                savedIcons={savedIcons}
                savedImages={displayedImages}
                onDeletePalette={handleDeletePalette}
                onDeletePattern={handleDeletePattern}
                onDeleteIcon={handleDeleteIcon}
                onDeleteImage={handleDeleteImage}
                onLoadPalette={handleLoadPalette}
                onTogglePublic={handleTogglePublicAsset}
                user={user}
              />
            )}

            {activeTab === 'monitoring' && (
              <Monitoring
                user={user}
                savedPalettes={displayedPalettes}
                savedPatterns={displayedPatterns}
                savedImages={displayedImages}
              />
            )}

            {activeTab === 'account' && (
              <Account
                savedPalettes={savedPalettes}
                savedPatterns={savedPatterns}
                setSavedPalettes={setSavedPalettes}
                setSavedPatterns={setSavedPatterns}
                showToast={showToast}
                onRefreshCloud={fetchCloudAssets}
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

      {/* Mobile Bottom Navigation Bar (Fixed for < 768px with Safe Area Padding) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-all ${
        theme.isDark ? 'bg-slate-950/90 border-slate-850' : 'bg-white/95 border-slate-200 shadow-2xl'
      } pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-1.5 px-2 flex items-center justify-around`}>
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HomeIcon size={18} />
          <span className="text-[9px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('palette')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'palette' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette size={18} />
          <span className="text-[9px] mt-0.5">Palette</span>
        </button>

        <button
          onClick={() => setActiveTab('pattern')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'pattern' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size={18} />
          <span className="text-[9px] mt-0.5">Pattern</span>
        </button>

        <button
          onClick={() => setActiveTab('imagesearch')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'imagesearch' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon size={18} />
          <span className="text-[9px] mt-0.5">Image</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'saved' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderHeart size={18} />
          <span className="text-[9px] mt-0.5">Saved</span>
          {totalSavedCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            ['monitoring', 'account', 'settings', 'icon'].includes(activeTab)
              ? 'text-indigo-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu size={18} />
          <span className="text-[9px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Mobile Slide-Up Drawer / Bottom Sheet */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto backdrop-blur-2xl ${
              theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  K
                </div>
                <span className="font-bold text-sm">More Studios & Tools</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => { setActiveTab('monitoring'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'monitoring' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <Activity size={18} className="text-indigo-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">Usage Hub</span>
                  <span className={`text-[9px] ${theme.textMuted}`}>Quotas & activity</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('icon'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'icon' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <Heart size={18} className="text-pink-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">Icon Finder</span>
                  <span className={`text-[9px] ${theme.textMuted}`}>Lucide SVGs</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('account'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'account' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <User size={18} className="text-sky-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">Account</span>
                  <span className={`text-[9px] ${theme.textMuted}`}>Profile & Cloud</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  activeTab === 'settings' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <Settings size={18} className="text-slate-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">Settings</span>
                  <span className={`text-[9px] ${theme.textMuted}`}>Theme & Options</span>
                </div>
              </button>
            </div>

            {/* PWA Install Banner */}
            {!isInstalled && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-sky-600/20 border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone size={13} className="text-indigo-400" /> Install Krasola App
                  </h4>
                  <p className="text-[10px] text-slate-300">Run on your home screen like a native app</p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsInstallModalOpen(true);
                  }}
                  className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shrink-0 shadow-md"
                >
                  Install
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standalone PWA Install Modal */}
      <PwaInstallModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />

      {/* Unified In-App Notification Center Drawer */}
      <NotificationCenterDrawer 
        theme={theme} 
        onNavigateTab={setActiveTab} 
      />
    </div>
  );
}
