'use client';

import React from 'react';

/**
 * CropGrid - Atomic component showing rule of thirds grid
 */
export function CropGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-60">
      {/* Vertical lines */}
      <div
        className="absolute left-1/3 top-0 h-full bg-white/10"
        style={{ width: '0.5px' }}
      />
      <div
        className="absolute left-2/3 top-0 h-full bg-white/10"
        style={{ width: '0.5px' }}
      />

      {/* Horizontal lines */}
      <div
        className="absolute left-0 top-1/3 w-full bg-white/10"
        style={{ height: '0.5px' }}
      />
      <div
        className="absolute left-0 top-2/3 w-full bg-white/10"
        style={{ height: '0.5px' }}
      />
    </div>
  );
}

export default CropGrid;
