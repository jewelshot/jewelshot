/**
 * Custom hook for managing image transformation state
 *
 * Manages all image transformation properties:
 * - Scale (zoom level)
 * - Position (pan x/y)
 * - Transform (rotation, flip horizontal/vertical)
 *
 * @example
 * ```tsx
 * const {
 *   scale,
 *   setScale,
 *   position,
 *   setPosition,
 *   transform,
 *   setTransform,
 *   resetTransform
 * } = useImageTransform();
 * ```
 */

import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Transform {
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

interface ImageTransformState {
  /**
   * Current zoom scale (0.1 to 3.0)
   */
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;

  /**
   * Current pan position
   */
  position: Position;
  setPosition: (position: Position | ((prev: Position) => Position)) => void;

  /**
   * Current transform (rotation, flips)
   */
  transform: Transform;
  setTransform: (
    transform: Transform | ((prev: Transform) => Transform)
  ) => void;

  /**
   * Reset all transformation state to initial values
   */
  resetTransform: () => void;
}

const DEFAULT_SCALE = 1.0;
const DEFAULT_POSITION: Position = { x: 0, y: 0 };
const DEFAULT_TRANSFORM: Transform = {
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
};

export function useImageTransform(): ImageTransformState {
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);

  /**
   * Reset all transformation state to defaults
   * Useful when loading new image or resetting view
   */
  const resetTransform = useCallback(() => {
    setScale(DEFAULT_SCALE);
    setPosition(DEFAULT_POSITION);
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  return {
    scale,
    setScale,
    position,
    setPosition,
    transform,
    setTransform,
    resetTransform,
  };
}
