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
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-xl border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.85)] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-xl">
      {/* Cancel */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 hover:border-red-500/40 hover:bg-red-500/15 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)] active:scale-95"
      >
        <X className="h-4 w-4" />
        Cancel
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.03)] px-4 py-2.5 text-sm font-medium text-white/70 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.1)] hover:text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.2)] active:scale-95"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>

      {/* Apply */}
      <button
        onClick={onApply}
        className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-sm font-medium text-green-400 hover:border-green-500/40 hover:bg-green-500/15 hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] active:scale-95"
      >
        <Check className="h-4 w-4" />
        Apply Crop
      </button>
    </div>
  );
}

export default CropToolbar;
