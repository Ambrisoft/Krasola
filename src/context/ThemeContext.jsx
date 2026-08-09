import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../utils/themeUtils';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeThemeId, setActiveThemeId] = useState(() => {
    const saved = localStorage.getItem('active_theme_id');
    return saved ? saved : 'slate-dark';
  });

  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('active_theme_id', activeThemeId);
  }, [activeThemeId]);

  // Synchronize document elements dark/light class list
  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme.isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, activeThemeId, setActiveThemeId }}>
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
