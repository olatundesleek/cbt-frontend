'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme data attribute
    root.setAttribute('data-theme', theme);

    // Tell browser which color scheme to use (critical part!)
    root.style.colorScheme = theme;

    // Persist theme choice
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setTheme(media.matches ? 'dark' : 'light');
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}
