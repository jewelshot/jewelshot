/**
 * StudioLayout Component
 *
 * Main layout wrapper for the studio workspace.
 * Manages the grid layout of all major sections.
 *
 * @example
 * ```tsx
 * <StudioLayout>
 *   <Canvas />
 * </StudioLayout>
 * ```
 */

'use client';

import React from 'react';
import TopBar from '@/components/organisms/TopBar';
import BottomBar from '@/components/organisms/BottomBar';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarToggle from '@/components/atoms/SidebarToggle';
import RightSidebar from '@/components/organisms/RightSidebar';

interface StudioLayoutProps {
  /**
   * Main content (Canvas area)
   */
  children: React.ReactNode;

  /**
   * Whether to show the right sidebar
   * @default false
   */
  showRightSidebar?: boolean;
}

export function StudioLayout({
  children,
  showRightSidebar = false,
}: StudioLayoutProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Top Bar */}
      <TopBar />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Main Content Area */}
      <main
        className={`fixed bottom-10 left-0 right-0 top-16 transition-all duration-300 ${
          showRightSidebar ? 'right-[320px]' : 'right-0'
        }`}
        role="main"
      >
        {children}
      </main>

      {/* Right Sidebar (Conditional) */}
      <RightSidebar visible={showRightSidebar} />

      {/* Bottom Bar */}
      <BottomBar />
    </div>
  );
}

export default StudioLayout;
