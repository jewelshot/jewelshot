'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';

export function TopBar() {
  const { topOpen, leftOpen, rightOpen } = useSidebarStore();

  if (!topOpen) return null;

  return (
    <header
      className="fixed top-0 z-50 h-16 border-b border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '0px',
        right: rightOpen ? '260px' : '0px',
      }}
    />
  );
}

export default TopBar;
