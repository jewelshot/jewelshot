'use client';

import React from 'react';
import ToggleAllBarsButton from '@/components/atoms/ToggleAllBarsButton';
import FullscreenButton from '@/components/atoms/FullscreenButton';

interface ActionControlsProps {
  /**
   * Whether all bars are open
   */
  allBarsOpen: boolean;
  /**
   * Toggle all bars handler
   */
  onToggleAllBars: () => void;
  /**
   * Whether fullscreen is active
   */
  isFullscreen: boolean;
  /**
   * Toggle fullscreen handler
   */
  onToggleFullscreen: () => void;
}

export function ActionControls({
  allBarsOpen,
  onToggleAllBars,
  isFullscreen,
  onToggleFullscreen,
}: ActionControlsProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
      <ToggleAllBarsButton
        allBarsOpen={allBarsOpen}
        onClick={onToggleAllBars}
      />
      <div className="h-5 w-px bg-[rgba(139,92,246,0.2)]" />
      <FullscreenButton
        isFullscreen={isFullscreen}
        onClick={onToggleFullscreen}
      />
    </div>
  );
}

export default ActionControls;
