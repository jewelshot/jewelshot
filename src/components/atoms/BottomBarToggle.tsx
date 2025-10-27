/**
 * Bottom Bar Toggle Button Component
 *
 * A toggle button to show/hide the bottom bar.
 *
 * @example
 * ```tsx
 * <BottomBarToggle />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

export function BottomBarToggle() {
  const { bottomOpen, toggleBottom } = useLayoutStore();

  return (
    <button
      onClick={toggleBottom}
      className={`fixed left-1/2 z-[200] flex h-3 w-8 -translate-x-1/2 cursor-pointer items-center justify-center border border-[rgba(139,92,246,0.2)] bg-[rgba(17,17,17,0.8)] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:backdrop-blur-[10px] ${
        bottomOpen
          ? 'bottom-[28px] rounded-t-md border-b-0 border-t'
          : 'bottom-0 rounded-b-md border-b border-t-0'
      } `}
      aria-label={bottomOpen ? 'Close bottom bar' : 'Open bottom bar'}
      aria-expanded={bottomOpen}
    >
      {/* Arrow Icon */}
      <span
        className={`text-[8px] text-white/60 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] group-hover:text-[rgba(139,92,246,1)] ${bottomOpen ? 'rotate-180' : 'rotate-0'} `}
      >
        ∨
      </span>
    </button>
  );
}

export default BottomBarToggle;
