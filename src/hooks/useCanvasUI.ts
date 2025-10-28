/**
 * Custom hook for managing canvas UI state
 *
 * Manages UI-specific state:
 * - Fullscreen mode
 * - Background selector
 * - Crop mode and aspect ratio
 *
 * @example
 * ```tsx
 * const {
 *   isFullscreen,
 *   setIsFullscreen,
 *   background,
 *   setBackground,
 *   cropRatio,
 *   setCropRatio,
 *   isCropMode,
 *   setIsCropMode,
 *   resetCropState
 * } = useCanvasUI();
 * ```
 */

import { useState, useCallback } from 'react';

type BackgroundType = 'none' | 'black' | 'gray' | 'white' | 'alpha';

interface CanvasUIState {
  /**
   * Whether canvas is in fullscreen mode
   */
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;

  /**
   * Selected background type
   */
  background: BackgroundType;
  setBackground: (background: BackgroundType) => void;

  /**
   * Crop aspect ratio (null = free crop)
   */
  cropRatio: number | null;
  setCropRatio: (ratio: number | null) => void;

  /**
   * Whether crop mode is active
   */
  isCropMode: boolean;
  setIsCropMode: (mode: boolean) => void;

  /**
   * Reset crop-related state
   */
  resetCropState: () => void;
}

const DEFAULT_BACKGROUND: BackgroundType = 'none';
const DEFAULT_FULLSCREEN = false;
const DEFAULT_CROP_RATIO: number | null = null;
const DEFAULT_CROP_MODE = false;

export function useCanvasUI(): CanvasUIState {
  const [isFullscreen, setIsFullscreen] = useState(DEFAULT_FULLSCREEN);
  const [background, setBackground] =
    useState<BackgroundType>(DEFAULT_BACKGROUND);
  const [cropRatio, setCropRatio] = useState<number | null>(DEFAULT_CROP_RATIO);
  const [isCropMode, setIsCropMode] = useState(DEFAULT_CROP_MODE);

  /**
   * Reset crop-related state to defaults
   * Useful when exiting crop mode or loading new image
   */
  const resetCropState = useCallback(() => {
    setIsCropMode(false);
    setCropRatio(null);
  }, []);

  return {
    isFullscreen,
    setIsFullscreen,
    background,
    setBackground,
    cropRatio,
    setCropRatio,
    isCropMode,
    setIsCropMode,
    resetCropState,
  };
}
