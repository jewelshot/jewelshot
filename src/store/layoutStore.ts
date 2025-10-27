/**
 * Layout State Management
 *
 * Manages all layout bars (left, right, top, bottom) open/close state and animations.
 * Uses Zustand for lightweight, performant state management.
 *
 * @example
 * ```tsx
 * const { leftOpen, rightOpen, topOpen, bottomOpen } = useLayoutStore();
 * <button onClick={toggleLeft}>Toggle Left Sidebar</button>
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Layout store state interface
 */
interface LayoutState {
  /**
   * Whether the left sidebar is currently open
   */
  leftOpen: boolean;

  /**
   * Whether the right sidebar is currently open
   */
  rightOpen: boolean;

  /**
   * Whether the top bar is currently open
   */
  topOpen: boolean;

  /**
   * Whether the bottom bar is currently open
   */
  bottomOpen: boolean;

  /**
   * Toggle left sidebar open/close state
   */
  toggleLeft: () => void;

  /**
   * Toggle right sidebar open/close state
   */
  toggleRight: () => void;

  /**
   * Toggle top bar open/close state
   */
  toggleTop: () => void;

  /**
   * Toggle bottom bar open/close state
   */
  toggleBottom: () => void;

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

  /**
   * Explicitly open the top bar
   */
  openTop: () => void;

  /**
   * Explicitly close the top bar
   */
  closeTop: () => void;

  /**
   * Explicitly open the bottom bar
   */
  openBottom: () => void;

  /**
   * Explicitly close the bottom bar
   */
  closeBottom: () => void;
}

/**
 * Layout Zustand Store
 *
 * Centralized state management for all layout bars visibility.
 * Includes dev tools for debugging in development.
 */
export const useLayoutStore = create<LayoutState>()(
  devtools(
    (set) => ({
      leftOpen: true, // Default: left sidebar expanded
      rightOpen: false, // Default: right sidebar collapsed
      topOpen: true, // Default: top bar expanded
      bottomOpen: true, // Default: bottom bar expanded

      toggleLeft: () =>
        set(
          (state) => ({ leftOpen: !state.leftOpen }),
          undefined,
          'layout/toggleLeft'
        ),

      toggleRight: () =>
        set(
          (state) => ({ rightOpen: !state.rightOpen }),
          undefined,
          'layout/toggleRight'
        ),

      toggleTop: () =>
        set(
          (state) => ({ topOpen: !state.topOpen }),
          undefined,
          'layout/toggleTop'
        ),

      toggleBottom: () =>
        set(
          (state) => ({ bottomOpen: !state.bottomOpen }),
          undefined,
          'layout/toggleBottom'
        ),

      openLeft: () => set({ leftOpen: true }, undefined, 'layout/openLeft'),

      closeLeft: () => set({ leftOpen: false }, undefined, 'layout/closeLeft'),

      openRight: () => set({ rightOpen: true }, undefined, 'layout/openRight'),

      closeRight: () =>
        set({ rightOpen: false }, undefined, 'layout/closeRight'),

      openTop: () => set({ topOpen: true }, undefined, 'layout/openTop'),

      closeTop: () => set({ topOpen: false }, undefined, 'layout/closeTop'),

      openBottom: () =>
        set({ bottomOpen: true }, undefined, 'layout/openBottom'),

      closeBottom: () =>
        set({ bottomOpen: false }, undefined, 'layout/closeBottom'),
    }),
    {
      name: 'layout-store',
    }
  )
);

// Backward compatibility alias
export const useSidebarStore = useLayoutStore;
