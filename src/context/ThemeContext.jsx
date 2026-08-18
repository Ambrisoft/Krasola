import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, getThemeById } from '../utils/themeUtils';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeThemeId, setActiveThemeId] = useState(() => {
    const saved = localStorage.getItem('active_theme_id');
    return saved && THEMES.some(t => t.id === saved) ? saved : 'slate-dark';
  });

  const activeTheme = getThemeById(activeThemeId);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('active_theme_id', activeThemeId);
  }, [activeThemeId]);

  // Synchronize document elements dark/light class list and data-theme attribute for CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', activeTheme.id);
    
    if (activeTheme.isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [activeTheme]);

  // Quick toggle between primary dark and light themes
  const toggleThemeMode = () => {
    if (activeTheme.isDark) {
      setActiveThemeId('slate-light');
    } else {
      setActiveThemeId('slate-dark');
    }
  };

  // Cycle through all themes
  const cycleNextTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.id === activeThemeId);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setActiveThemeId(THEMES[nextIndex].id);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: activeTheme, 
      activeThemeId, 
      setActiveThemeId, 
      allThemes: THEMES,
      toggleThemeMode,
      cycleNextTheme,
      isDark: activeTheme.isDark
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
