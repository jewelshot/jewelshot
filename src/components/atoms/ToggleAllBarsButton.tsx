'use client';

import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface ToggleAllBarsButtonProps {
  /**
   * Whether all bars are currently open
   */
  allBarsOpen: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

export function ToggleAllBarsButton({
  allBarsOpen,
  onClick,
}: ToggleAllBarsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
      title={allBarsOpen ? 'Hide All Bars' : 'Show All Bars'}
    >
      {allBarsOpen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </button>
  );
}

export default ToggleAllBarsButton;
