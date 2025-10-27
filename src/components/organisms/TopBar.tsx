/**
 * Top Bar Component
 *
 * The top bar for the studio layout.
 * Adjusts width based on left and right sidebar states.
 *
 * @example
 * ```tsx
 * <TopBar />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

export function TopBar() {
  const { topOpen, leftOpen, rightOpen } = useLayoutStore();

  if (!topOpen) return null;

  return (
    <header
      className="fixed top-0 z-50 flex h-16 items-center justify-between border-b border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-6 backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="text-lg font-semibold text-white">
            Jewelshot Studio
          </span>
        </div>
      </div>

      {/* Center Section - Placeholder */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/30">Top Bar Content</span>
      </div>

      {/* Right Section - Placeholder */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/30">Actions</span>
      </div>
    </header>
  );
}

export default TopBar;
