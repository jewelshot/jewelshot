/**
 * Bottom Bar Component
 *
 * The bottom bar for the studio layout.
 * Adjusts width based on left and right sidebar states.
 *
 * @example
 * ```tsx
 * <BottomBar />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

export function BottomBar() {
  const { bottomOpen, leftOpen, rightOpen } = useLayoutStore();

  if (!bottomOpen) return null;

  return (
    <footer
      className="fixed bottom-0 z-50 flex h-10 items-center justify-between border-t border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] px-6 backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    >
      {/* Left Section - Status */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/50">Ready • v0.1.0</span>
      </div>

      {/* Right Section - Info */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/50">Bottom Bar Content</span>
      </div>
    </footer>
  );
}

export default BottomBar;
