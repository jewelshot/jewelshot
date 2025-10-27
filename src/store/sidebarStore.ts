/**
 * Sidebar State Management
 *
 * Manages left and right sidebar open/close state and animations.
 * Uses Zustand for lightweight, performant state management.
 *
 * @example
 * ```tsx
 * const { leftOpen, rightOpen, toggleLeft, toggleRight } = useSidebarStore();
 * <button onClick={toggleLeft}>Toggle Left Sidebar</button>
 * <button onClick={toggleRight}>Toggle Right Sidebar</button>
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Sidebar store state interface
 */
interface SidebarState {
  /**
   * Whether the left sidebar is currently open
   */
  leftOpen: boolean;

  /**
   * Whether the right sidebar is currently open
   */
  rightOpen: boolean;

  /**
   * Toggle left sidebar open/close state
   */
  toggleLeft: () => void;

  /**
   * Toggle right sidebar open/close state
   */
  toggleRight: () => void;

  /**
   * Explicitly open the left sidebar
   */
  openLeft: () => void;

  /**
   * Explicitly close the left sidebar
   */
  closeLeft: () => void;

  /**
   * Explicitly open the right sidebar
   */
  openRight: () => void;

  /**
   * Explicitly close the right sidebar
   */
  closeRight: () => void;
}

/**
 * Sidebar Zustand Store
 *
 * Centralized state management for both sidebars visibility.
 * Includes dev tools for debugging in development.
 */
export const useSidebarStore = create<SidebarState>()(
  devtools(
    (set) => ({
      leftOpen: true, // Default: left sidebar expanded
      rightOpen: false, // Default: right sidebar collapsed

      toggleLeft: () =>
        set(
          (state) => ({ leftOpen: !state.leftOpen }),
          undefined,
          'sidebar/toggleLeft'
        ),

      toggleRight: () =>
        set(
          (state) => ({ rightOpen: !state.rightOpen }),
          undefined,
          'sidebar/toggleRight'
        ),

      openLeft: () => set({ leftOpen: true }, undefined, 'sidebar/openLeft'),

      closeLeft: () => set({ leftOpen: false }, undefined, 'sidebar/closeLeft'),

      openRight: () => set({ rightOpen: true }, undefined, 'sidebar/openRight'),

      closeRight: () =>
        set({ rightOpen: false }, undefined, 'sidebar/closeRight'),
    }),
    {
      name: 'sidebar-store',
    }
  )
);
