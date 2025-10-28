'use client';

import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

interface CropToolbarProps {
  /**
   * Apply crop handler
   */
  onApply: () => void;
  /**
   * Cancel crop handler
   */
  onCancel: () => void;
  /**
   * Reset crop handler
   */
  onReset: () => void;
}

/**
 * CropToolbar - Action buttons for crop interface
 */
export function CropToolbar({ onApply, onCancel, onReset }: CropToolbarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.95)] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[16px]">
      {/* Cancel */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20"
      >
        <X className="h-4 w-4" />
        Cancel
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-md border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.05)] px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>

      {/* Apply */}
      <button
        onClick={onApply}
        className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 transition-all hover:border-green-500/50 hover:bg-green-500/20"
      >
        <Check className="h-4 w-4" />
        Apply Crop
      </button>
    </div>
  );
}

export default CropToolbar;
