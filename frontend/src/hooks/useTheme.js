import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'mininft-theme';
const THEMES = ['dark', 'light'];

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved && THEMES.includes(saved)) return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const setSpecificTheme = useCallback((newTheme) => {
    if (THEMES.includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setTheme: setSpecificTheme,
  };
}

export default useTheme;
