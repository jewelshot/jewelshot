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

export function TopBar() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-6 backdrop-blur-[24px] backdrop-saturate-[200%]"
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
