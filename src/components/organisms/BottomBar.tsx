/**
 * BottomBar Component
 *
 * Status bar at the bottom of the studio.
 * Shows status messages, info, and quick actions.
 *
 * @example
 * ```tsx
 * <BottomBar />
 * ```
 */

'use client';

import React from 'react';

export function BottomBar() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex h-10 items-center justify-between border-t border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.8)] px-6 backdrop-blur-[16px]"
      role="contentinfo"
    >
      {/* Left Section - Status */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/50">Ready</span>
      </div>

      {/* Center Section - Info */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/40">v0.1.0</span>
      </div>

      {/* Right Section - Quick Info */}
      <div className="flex items-center gap-4">
        {/* Quick info will be added here */}
      </div>
    </footer>
  );
}

export default BottomBar;
