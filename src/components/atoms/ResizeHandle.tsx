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
  const getPositionStyles = () => {
    const cornerSize = 'h-4 w-4';
    const edgeSize =
      position === 't' || position === 'b' ? 'h-2 w-12' : 'h-12 w-2';

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
      className={`absolute z-10 rounded-sm bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all hover:scale-125 ${getPositionStyles()}`}
      onMouseDown={(e) => onMouseDown(e, position)}
    />
  );
}

export default ResizeHandle;
