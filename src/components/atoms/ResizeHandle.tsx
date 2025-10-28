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
    const cornerSize = 'h-3 w-3';
    const edgeSize =
      position === 't' || position === 'b' ? 'h-1 w-8' : 'h-8 w-1';

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
      className={`absolute z-10 bg-white transition-all duration-200 hover:scale-150 active:scale-125 ${
        isCorner
          ? 'rounded-full border-2 border-white shadow-[0_0_12px_rgba(139,92,246,0.6),0_0_4px_rgba(255,255,255,0.8)] hover:shadow-[0_0_16px_rgba(139,92,246,0.8),0_0_8px_rgba(255,255,255,1)]'
          : 'rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5),0_0_4px_rgba(255,255,255,0.6)] hover:shadow-[0_0_12px_rgba(139,92,246,0.7),0_0_6px_rgba(255,255,255,0.9)]'
      } ${getPositionStyles()}`}
      style={{ willChange: 'transform' }}
      onMouseDown={(e) => onMouseDown(e, position)}
    />
  );
}

export default ResizeHandle;
