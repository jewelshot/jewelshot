/**
 * TopBar Component
 *
 * Main header bar at the top of the studio.
 * Contains logo, actions, and user controls.
 *
 * @example
 * ```tsx
 * <TopBar />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

interface TopBarProps {
  visible?: boolean;
}

export function TopBar({ visible = true }: TopBarProps) {
  const { leftSidebarOpen, rightSidebarOpen } = useLayoutStore();

  if (!visible) return null;

  return (
    <header
      className="fixed top-0 z-50 flex h-16 items-center justify-between border-b border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-6 backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftSidebarOpen ? '260px' : '0px',
        right: rightSidebarOpen ? '320px' : '0px',
      }}
      role="banner"
    >
      {/* Left Section - Logo/Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="text-lg font-semibold text-white">
            Jewelshot Studio
          </span>
        </div>
      </div>

      {/* Center Section - Placeholder */}
      <div className="flex items-center gap-3">
        {/* Actions will be added here */}
      </div>

      {/* Right Section - Placeholder */}
      <div className="flex items-center gap-3">
        {/* User controls will be added here */}
      </div>
    </header>
  );
}

export default TopBar;
