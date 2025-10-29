'use client';

import React from 'react';
import { Maximize, Minimize } from 'lucide-react';

interface FullscreenButtonProps {
  /**
   * Whether fullscreen is active
   */
  isFullscreen: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

export function FullscreenButton({
  isFullscreen,
  onClick,
}: FullscreenButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? (
        <Minimize className="h-3.5 w-3.5" />
      ) : (
        <Maximize className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export default FullscreenButton;
