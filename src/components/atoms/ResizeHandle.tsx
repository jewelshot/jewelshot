'use client';

import React from 'react';

interface ResizeHandleProps {
  /**
   * Handle position
   */
  position: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'r' | 'b' | 'l';
  /**
   * Mouse down handler
   */
  onMouseDown: (e: React.MouseEvent, position: string) => void;
}

/**
 * ResizeHandle - Atomic component for crop frame resizing
 */
export function ResizeHandle({ position, onMouseDown }: ResizeHandleProps) {
  const isCorner = ['tl', 'tr', 'bl', 'br'].includes(position);

  const getPositionStyles = () => {
    const cornerSize = 'h-2 w-2';
    const edgeSize =
      position === 't' || position === 'b' ? 'h-[3px] w-6' : 'h-6 w-[3px]';

    const positions = {
      tl: `top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize ${cornerSize}`,
      tr: `top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize ${cornerSize}`,
      bl: `bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize ${cornerSize}`,
      br: `bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize ${cornerSize}`,
      t: `top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize ${edgeSize}`,
      r: `top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize ${edgeSize}`,
      b: `bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize ${edgeSize}`,
      l: `top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize ${edgeSize}`,
    };

    return positions[position];
  };

  return (
    <div
      className={`group absolute z-10 bg-white hover:scale-[2] active:scale-150 ${
        isCorner
          ? 'rounded-full shadow-[0_0_8px_rgba(139,92,246,0.4),0_0_2px_rgba(255,255,255,0.6)] hover:shadow-[0_0_16px_rgba(139,92,246,0.7),0_0_6px_rgba(255,255,255,0.9)]'
          : 'rounded-full shadow-[0_0_6px_rgba(139,92,246,0.3),0_0_2px_rgba(255,255,255,0.5)] hover:shadow-[0_0_12px_rgba(139,92,246,0.6),0_0_4px_rgba(255,255,255,0.8)]'
      } ${getPositionStyles()}`}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)', // GPU acceleration
        touchAction: 'none', // Precise touch handling
        // Extended hit area with pseudo-element
        padding: '8px',
        margin: '-8px',
      }}
      onMouseDown={(e) => onMouseDown(e, position)}
    />
  );
}

export default ResizeHandle;
