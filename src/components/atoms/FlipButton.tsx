'use client';

import React from 'react';
import { FlipHorizontal, FlipVertical } from 'lucide-react';

interface FlipButtonProps {
  /**
   * Flip direction
   */
  direction: 'horizontal' | 'vertical';
  /**
   * Whether this flip is active
   */
  isActive: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

/**
 * FlipButton - Atomic component for image flip control
 */
export function FlipButton({ direction, isActive, onClick }: FlipButtonProps) {
  const Icon = direction === 'horizontal' ? FlipHorizontal : FlipVertical;
  const label = direction === 'horizontal' ? 'Horizontal' : 'Vertical';

  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-all ${
        isActive
          ? 'border-violet-500/50 bg-violet-500/10 text-violet-400'
          : 'border-white/10 bg-white/5 text-white/60 hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-white/80'
      }`}
      aria-label={`Flip ${label}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export default FlipButton;
