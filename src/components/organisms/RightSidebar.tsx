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

interface RightSidebarProps {
  /**
   * Whether the sidebar is visible
   * @default true
   */
  visible?: boolean;
}

export function RightSidebar({ visible = true }: RightSidebarProps) {
  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-10 right-0 top-16 z-30 w-[320px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] backdrop-blur-[24px] backdrop-saturate-[200%]"
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
