import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'purple' | 'gold' | 'emerald' | 'rose';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'purple',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'jewelshot-theme',
    }
  )
);

export const themes = {
  purple: {
    name: 'Deep Purple',
    primary: '#a855f7',
    primaryDark: '#9333ea',
    primaryLight: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.5)',
    icon: '💜',
  },
  gold: {
    name: 'Midnight Gold',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    primaryLight: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.5)',
    icon: '✨',
  },
  emerald: {
    name: 'Emerald Noir',
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#34d399',
    glow: 'rgba(16, 185, 129, 0.5)',
    icon: '💎',
  },
  rose: {
    name: 'Rose Platinum',
    primary: '#ec4899',
    primaryDark: '#db2777',
    primaryLight: '#f472b6',
    glow: 'rgba(236, 72, 153, 0.5)',
    icon: '🌸',
  },
} as const;
