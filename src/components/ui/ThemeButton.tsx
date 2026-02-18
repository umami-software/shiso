'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { button, icon } from '@/lib/variants';

export function ThemeButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <button
      onClick={toggleTheme}
      className={button({ variant: 'quiet', size: 'icon' })}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={icon()}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </span>
    </button>
  );
}
