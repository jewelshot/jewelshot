'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useThemeStore, themes, type Theme } from '@/store/themeStore';

export function TopBar() {
  const { topOpen, leftOpen, rightOpen } = useSidebarStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <header
      className="fixed z-50 h-16 border-b border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        top: topOpen ? '0px' : '-64px',
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Theme Selector */}
      <div className="flex h-full items-center justify-center gap-2">
        {(Object.keys(themes) as Theme[]).map((themeKey) => {
          const themeData = themes[themeKey];
          const isActive = theme === themeKey;

          return (
            <button
              key={themeKey}
              onClick={() => setTheme(themeKey)}
              className="group relative flex items-center gap-2 rounded-lg border px-4 py-2 transition-all duration-300"
              style={{
                borderColor: isActive
                  ? themeData.primary
                  : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: isActive
                  ? `${themeData.primary}15`
                  : 'rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Icon */}
              <span className="text-lg">{themeData.icon}</span>

              {/* Theme Name */}
              <span
                className="text-sm font-medium transition-colors duration-300"
                style={{
                  color: isActive
                    ? themeData.primary
                    : 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {themeData.name}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div
                  className="absolute inset-0 -z-10 rounded-lg opacity-20 blur-xl"
                  style={{
                    backgroundColor: themeData.primary,
                  }}
                />
              )}

              {/* Hover Effect */}
              <div
                className="absolute inset-0 -z-10 rounded-lg opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-10"
                style={{
                  backgroundColor: themeData.primary,
                }}
              />
            </button>
          );
        })}
      </div>
    </header>
  );
}

export default TopBar;
