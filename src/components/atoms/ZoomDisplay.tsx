'use client';

import React from 'react';

interface ZoomDisplayProps {
  value: number;
}

export function ZoomDisplay({ value }: ZoomDisplayProps) {
  return (
    <div className="min-w-[64px] px-2 text-center text-sm font-medium tabular-nums text-white">
      {Math.round(value * 100)}%
    </div>
  );
}

export default ZoomDisplay;
