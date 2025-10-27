/**
 * SidebarToggle Component
 *
 * A micro toggle button that opens/closes the sidebar.
 * Features smooth animations and glassmorphism effects.
 *
 * @example
 * ```tsx
 * <SidebarToggle />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

export function SidebarToggle() {
  const { leftOpen, toggleLeft } = useLayoutStore();

  return (
    <button
      onClick={toggleLeft}
      className={`fixed top-1/2 z-[200] flex h-8 w-3 -translate-y-1/2 cursor-pointer items-center justify-center border border-[rgba(139,92,246,0.2)] bg-[rgba(17,17,17,0.8)] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:backdrop-blur-[10px] ${
        leftOpen
          ? 'left-[248px] rounded-l-md border-l border-r-0'
          : 'left-0 rounded-r-md border-l-0 border-r'
      } `}
      aria-label={leftOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={leftOpen}
    >
      {/* Arrow Icon */}
      <span
        className={`text-[8px] text-white/60 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] group-hover:text-[rgba(139,92,246,1)] ${leftOpen ? 'rotate-180' : 'rotate-0'} `}
      >
        ›
      </span>
    </button>
  );
}

export default SidebarToggle;
