/**
 * Sidebar State Management
 *
 * Manages sidebar open/close state and animations.
 * Uses Zustand for lightweight, performant state management.
 *
 * @example
 * ```tsx
 * const { isOpen, toggle } = useSidebarStore();
 * <button onClick={toggle}>Toggle Sidebar</button>
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Sidebar store state interface
 */
interface SidebarState {
  /**
   * Whether the sidebar is currently open
   */
  isOpen: boolean;

  /**
   * Toggle sidebar open/close state
   */
  toggle: () => void;

  /**
   * Explicitly open the sidebar
   */
  open: () => void;

  /**
   * Explicitly close the sidebar
   */
  close: () => void;
}

/**
 * Sidebar Zustand Store
 *
 * Centralized state management for sidebar visibility.
 * Includes dev tools for debugging in development.
 */
export const useSidebarStore = create<SidebarState>()(
  devtools(
    (set) => ({
      isOpen: false,

      toggle: () =>
        set(
          (state) => ({ isOpen: !state.isOpen }),
          undefined,
          'sidebar/toggle'
        ),

      open: () => set({ isOpen: true }, undefined, 'sidebar/open'),

      close: () => set({ isOpen: false }, undefined, 'sidebar/close'),
    }),
    {
      name: 'sidebar-store',
    }
  )
);
