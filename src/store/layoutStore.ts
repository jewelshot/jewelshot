/**
 * Layout State Management
 *
 * Manages all bar visibility states (top, bottom, left, right).
 * Ensures proper layout responsiveness and toggle functionality.
 *
 * @example
 * ```tsx
 * const { leftSidebarOpen, toggleLeftSidebar } = useLayoutStore();
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Layout store state interface
 */
interface LayoutState {
  /**
   * Top bar visibility
   */
  topBarOpen: boolean;

  /**
   * Bottom bar visibility
   */
  bottomBarOpen: boolean;

  /**
   * Left sidebar visibility (default: open)
   */
  leftSidebarOpen: boolean;

  /**
   * Right sidebar visibility (default: closed)
   */
  rightSidebarOpen: boolean;

  /**
   * Toggle top bar
   */
  toggleTopBar: () => void;

  /**
   * Toggle bottom bar
   */
  toggleBottomBar: () => void;

  /**
   * Toggle left sidebar
   */
  toggleLeftSidebar: () => void;

  /**
   * Toggle right sidebar
   */
  toggleRightSidebar: () => void;
}

/**
 * Layout Zustand Store
 *
 * Centralized state management for all bars.
 */
export const useLayoutStore = create<LayoutState>()(
  devtools(
    (set) => ({
      topBarOpen: true,
      bottomBarOpen: true,
      leftSidebarOpen: true, // Default: expanded
      rightSidebarOpen: false, // Default: collapsed

      toggleTopBar: () =>
        set(
          (state) => ({ topBarOpen: !state.topBarOpen }),
          undefined,
          'layout/toggleTopBar'
        ),

      toggleBottomBar: () =>
        set(
          (state) => ({ bottomBarOpen: !state.bottomBarOpen }),
          undefined,
          'layout/toggleBottomBar'
        ),

      toggleLeftSidebar: () =>
        set(
          (state) => ({ leftSidebarOpen: !state.leftSidebarOpen }),
          undefined,
          'layout/toggleLeftSidebar'
        ),

      toggleRightSidebar: () =>
        set(
          (state) => ({ rightSidebarOpen: !state.rightSidebarOpen }),
          undefined,
          'layout/toggleRightSidebar'
        ),
    }),
    {
      name: 'layout-store',
    }
  )
);
