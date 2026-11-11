'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './icons';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const saved = document.documentElement.dataset.theme;
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Follows the device setting until the visitor picks a theme, then remembers the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(currentTheme());
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(currentTheme());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private windows can block storage; the theme still applies for this visit.
    }
    setTheme(next);
  };

  const label = theme === 'dark' ? '라이트 모드' : '다크 모드';
  return (
    <button className="btn icon-btn" type="button" onClick={toggle} data-tip={label} aria-label={label}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
