'use client';

import React from 'react';

/**
 * CropGrid - Atomic component showing rule of thirds grid
 */
export function CropGrid() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Vertical lines */}
      <div className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
      <div className="absolute left-2/3 top-0 h-full w-px bg-white/30" />

      {/* Horizontal lines */}
      <div className="absolute left-0 top-1/3 h-px w-full bg-white/30" />
      <div className="absolute left-0 top-2/3 h-px w-full bg-white/30" />
    </div>
  );
}

export default CropGrid;
