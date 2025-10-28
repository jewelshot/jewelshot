'use client';

import React from 'react';

interface CropRatioButtonProps {
  /**
   * Ratio label (e.g., "1:1", "16:9")
   */
  label: string;
  /**
   * Ratio value (width/height)
   */
  ratio: number | null;
  /**
   * Whether this ratio is active
   */
  active: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

/**
 * CropRatioButton - Atomic component for crop aspect ratio selection
 * Shows visual representation of the aspect ratio
 */
export function CropRatioButton({
  label,
  ratio,
  active,
  onClick,
}: CropRatioButtonProps) {
  // Calculate visual dimensions for the ratio preview
  const getPreviewSize = () => {
    if (ratio === null) {
      // Free aspect - show dashed square
      return { width: 32, height: 32, dashed: true };
    }

    const maxSize = 32;
    if (ratio >= 1) {
      // Landscape
      return { width: maxSize, height: maxSize / ratio, dashed: false };
    } else {
      // Portrait
      return { width: maxSize * ratio, height: maxSize, dashed: false };
    }
  };

  const { width, height, dashed } = getPreviewSize();

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
        active
          ? 'border-[rgba(139,92,246,0.6)] bg-[rgba(139,92,246,0.2)] shadow-[0_0_12px_rgba(139,92,246,0.3)]'
          : 'border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.12)]'
      }`}
    >
      {/* Visual representation */}
      <div className="flex h-10 w-10 items-center justify-center">
        <div
          className={`${
            dashed
              ? 'border-2 border-dashed'
              : active
                ? 'bg-white'
                : 'bg-white/60'
          } rounded-sm transition-all ${
            active ? 'border-white' : 'border-white/50'
          }`}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      </div>

      {/* Label */}
      <span
        className={`text-xs font-medium transition-colors ${
          active ? 'text-white' : 'text-white/70'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default CropRatioButton;
