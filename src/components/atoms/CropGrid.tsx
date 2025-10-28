'use client';

import React from 'react';

/**
 * CropGrid - Atomic component showing rule of thirds grid
 */
export function CropGrid() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Vertical lines */}
      <div className="absolute left-1/3 top-0 h-full w-px bg-white/20 shadow-[0_0_2px_rgba(255,255,255,0.1)]" />
      <div className="absolute left-2/3 top-0 h-full w-px bg-white/20 shadow-[0_0_2px_rgba(255,255,255,0.1)]" />

      {/* Horizontal lines */}
      <div className="absolute left-0 top-1/3 h-px w-full bg-white/20 shadow-[0_0_2px_rgba(255,255,255,0.1)]" />
      <div className="absolute left-0 top-2/3 h-px w-full bg-white/20 shadow-[0_0_2px_rgba(255,255,255,0.1)]" />
    </div>
  );
}

export default CropGrid;
