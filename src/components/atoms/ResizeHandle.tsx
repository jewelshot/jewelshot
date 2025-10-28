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
    const positions = {
      tl: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
      tr: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
      bl: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize',
      br: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize',
      t: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize',
      r: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
      b: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
      l: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
    };

    return positions[position];
  };

  return (
    <div
      className={`group absolute z-10 ${getPositionStyles()}`}
      style={{
        touchAction: 'none',
        // Hit area (invisible but clickable)
        padding: '8px',
      }}
      onMouseDown={(e) => onMouseDown(e, position)}
    >
      {/* Visible handle */}
      <div
        className={`bg-white/80 hover:bg-white group-hover:scale-125 group-active:scale-105 ${
          isCorner
            ? 'rounded-sm shadow-[0_0_4px_rgba(139,92,246,0.3),0_0_1px_rgba(255,255,255,0.4)] group-hover:shadow-[0_0_8px_rgba(139,92,246,0.5),0_0_2px_rgba(255,255,255,0.6)]'
            : 'rounded-[1px] shadow-[0_0_3px_rgba(139,92,246,0.25),0_0_1px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_6px_rgba(139,92,246,0.4),0_0_2px_rgba(255,255,255,0.5)]'
        }`}
        style={{
          width: isCorner
            ? '7px'
            : position === 't' || position === 'b'
              ? '14px'
              : '3px',
          height: isCorner
            ? '7px'
            : position === 't' || position === 'b'
              ? '3px'
              : '14px',
          willChange: 'transform',
          transform: 'translateZ(0)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default ResizeHandle;
