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
import { useSidebarStore } from '@/store/sidebarStore';

export function SidebarToggle() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <button
      onClick={toggle}
      className={`fixed top-1/2 z-[200] flex h-8 w-3 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/12 bg-[rgba(17,17,17,0.8)] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.15)] hover:backdrop-blur-[10px] ${
        isOpen
          ? 'left-[248px] rounded-l-md border-r-0 border-l'
          : 'left-0 rounded-r-md border-r border-l-0'
      } `}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={isOpen}
    >
      {/* Arrow Icon */}
      <span
        className={`text-[8px] text-white/60 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] group-hover:text-[rgba(139,92,246,1)] ${isOpen ? 'rotate-180' : 'rotate-0'} `}
      >
        ›
      </span>
    </button>
  );
}

export default SidebarToggle;
