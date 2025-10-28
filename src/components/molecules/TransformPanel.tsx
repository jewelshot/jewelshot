'use client';

import React, { useState, useEffect } from 'react';
import { RotateSlider } from '@/components/atoms/RotateSlider';
import { FlipButton } from '@/components/atoms/FlipButton';

interface TransformPanelProps {
  /**
   * Transform change handler
   */
  onTransformChange?: (transform: TransformState) => void;
}

export interface TransformState {
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

/**
 * TransformPanel - Molecule component for image transformation controls
 */
export function TransformPanel({ onTransformChange }: TransformPanelProps) {
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  // Notify parent of changes
  useEffect(() => {
    if (onTransformChange) {
      onTransformChange({
        rotation,
        flipHorizontal,
        flipVertical,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, flipHorizontal, flipVertical]);

  return (
    <div className="flex flex-col gap-4">
      {/* Rotate */}
      <div>
        <RotateSlider value={rotation} onChange={setRotation} />
      </div>

      {/* Flip */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-white/70">Flip</label>
        <div className="flex gap-2">
          <FlipButton
            direction="horizontal"
            isActive={flipHorizontal}
            onClick={() => setFlipHorizontal((prev) => !prev)}
          />
          <FlipButton
            direction="vertical"
            isActive={flipVertical}
            onClick={() => setFlipVertical((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}

export default TransformPanel;
