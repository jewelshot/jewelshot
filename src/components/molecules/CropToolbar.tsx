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
    <div className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 gap-1.5 rounded-2xl border border-white/5 bg-black/40 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
      {/* Cancel */}
      <button
        onClick={onCancel}
        className="flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 px-5 py-2.5 text-sm font-medium text-red-400/90 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] active:scale-95"
      >
        <X className="h-3.5 w-3.5" />
        <span>Cancel</span>
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-2.5 text-sm font-medium text-white/60 hover:border-white/10 hover:bg-white/[0.05] hover:text-white/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset</span>
      </button>

      {/* Apply */}
      <button
        onClick={onApply}
        className="flex items-center gap-2 rounded-xl border border-green-500/10 bg-green-500/5 px-5 py-2.5 text-sm font-medium text-green-400/90 hover:border-green-500/20 hover:bg-green-500/10 hover:text-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] active:scale-95"
      >
        <Check className="h-3.5 w-3.5" />
        <span>Apply</span>
      </button>
    </div>
  );
}

export default CropToolbar;
