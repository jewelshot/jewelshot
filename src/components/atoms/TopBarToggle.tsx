'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

export function TopBarToggle() {
  const { topOpen, toggleTop } = useSidebarStore();

  return (
    <button
      onClick={toggleTop}
      className={`fixed left-1/2 z-[200] flex h-3 w-8 -translate-x-1/2 cursor-pointer items-center justify-center border border-[rgba(139,92,246,0.2)] bg-[rgba(17,17,17,0.8)] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:backdrop-blur-[10px] ${
        topOpen
          ? 'top-[52px] rounded-b-md border-b border-t-0'
          : 'top-0 rounded-t-md border-b-0 border-t'
      }`}
      aria-label={topOpen ? 'Close top bar' : 'Open top bar'}
      aria-expanded={topOpen}
    >
      <span
        className={`text-[8px] text-white/60 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] group-hover:text-[rgba(139,92,246,1)] ${
          topOpen ? 'rotate-180' : 'rotate-0'
        }`}
      >
        ∧
      </span>
    </button>
  );
}

export default TopBarToggle;
