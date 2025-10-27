/**
 * RightSidebar Component
 *
 * Right sidebar for mode selection and prompt generation.
 * Conditionally shown based on image upload state.
 *
 * @example
 * ```tsx
 * <RightSidebar visible={hasImage} />
 * ```
 */

'use client';

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';

interface RightSidebarProps {
  /**
   * Whether the sidebar is visible
   * @default false
   */
  visible?: boolean;
}

export function RightSidebar({ visible = false }: RightSidebarProps) {
  const { topBarOpen, bottomBarOpen } = useLayoutStore();

  if (!visible) return null;

  return (
    <aside
      className="fixed right-0 z-30 w-[320px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        top: topBarOpen ? '64px' : '0px',
        bottom: bottomBarOpen ? '40px' : '0px',
      }}
      role="complementary"
      aria-label="Mode selection and prompt generation"
    >
      {/* Sidebar Content */}
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto p-4">
        {/* Content will be added here */}
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-white/40">
            Mode tabs and forms will appear here
          </p>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
