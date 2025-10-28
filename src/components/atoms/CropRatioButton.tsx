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
 */
export function CropRatioButton({
  label,
  active,
  onClick,
}: CropRatioButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-16 w-16 flex-col items-center justify-center rounded-md border transition-all ${
        active
          ? 'border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.15)] text-white'
          : 'border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/70 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.1)] hover:text-white'
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default CropRatioButton;
