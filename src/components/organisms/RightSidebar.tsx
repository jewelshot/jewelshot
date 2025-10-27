/**
 * Right Sidebar Component
 *
 * The right sidebar for the studio layout.
 * Mirror/symmetric version of the left sidebar, initially empty.
 *
 * @example
 * ```tsx
 * <RightSidebar />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

export function RightSidebar() {
  const { rightOpen, topOpen, bottomOpen } = useLayoutStore();

  return (
    <aside
      className={`fixed right-0 z-[100] w-[260px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${rightOpen ? 'translate-x-0' : 'translate-x-full'} `}
      style={{
        top: topOpen ? '64px' : '0px',
        bottom: bottomOpen ? '40px' : '0px',
      }}
    >
      {/* Sidebar Content - Empty for now */}
      <div className="sidebar-scroll flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-3">
        <div className="space-y-4 text-center">
          <div className="text-4xl opacity-30">📸</div>
          <p className="text-sm text-white/30">Right Sidebar</p>
          <p className="text-xs text-white/20">Content will appear here</p>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
