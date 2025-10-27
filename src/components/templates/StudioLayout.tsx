/**
 * StudioLayout Component
 *
 * Complete studio layout with responsive bars.
 * All bars can be toggled independently.
 * Layout adjusts based on bar visibility states.
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
import { useLayoutStore } from '@/store/layoutStore';
import TopBar from '@/components/organisms/TopBar';
import BottomBar from '@/components/organisms/BottomBar';
import Sidebar from '@/components/organisms/Sidebar';
import RightSidebar from '@/components/organisms/RightSidebar';
import BarToggleButton from '@/components/atoms/BarToggleButton';

interface StudioLayoutProps {
  /**
   * Main content (Canvas area)
   */
  children: React.ReactNode;
}

export function StudioLayout({ children }: StudioLayoutProps) {
  const {
    topBarOpen,
    bottomBarOpen,
    leftSidebarOpen,
    rightSidebarOpen,
    toggleTopBar,
    toggleBottomBar,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useLayoutStore();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Top Bar */}
      <TopBar visible={topBarOpen} />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Sidebar */}
      <RightSidebar visible={rightSidebarOpen} />

      {/* Bottom Bar */}
      <BottomBar visible={bottomBarOpen} />

      {/* Toggle Buttons */}
      <BarToggleButton
        position="top"
        isOpen={topBarOpen}
        onClick={toggleTopBar}
      />
      <BarToggleButton
        position="bottom"
        isOpen={bottomBarOpen}
        onClick={toggleBottomBar}
      />
      <BarToggleButton
        position="left"
        isOpen={leftSidebarOpen}
        onClick={toggleLeftSidebar}
      />
      <BarToggleButton
        position="right"
        isOpen={rightSidebarOpen}
        onClick={toggleRightSidebar}
      />

      {/* Main Content Area - Responsive to all bars */}
      <main
        className="fixed transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{
          top: topBarOpen ? '64px' : '0px',
          bottom: bottomBarOpen ? '40px' : '0px',
          left: leftSidebarOpen ? '260px' : '0px',
          right: rightSidebarOpen ? '320px' : '0px',
        }}
        role="main"
      >
        {children}
      </main>
    </div>
  );
}

export default StudioLayout;
