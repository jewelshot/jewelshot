'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import ZoomButton from '@/components/atoms/ZoomButton';
import ZoomDisplay from '@/components/atoms/ZoomDisplay';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  minZoom = 0.1,
  maxZoom = 3.0,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-2 backdrop-blur-[16px]">
      <ZoomButton
        onClick={onZoomOut}
        icon={<ZoomOut className="h-4 w-4" />}
        title="Zoom Out"
        disabled={scale <= minZoom}
      />

      <ZoomDisplay value={scale} />

      <ZoomButton
        onClick={onZoomIn}
        icon={<ZoomIn className="h-4 w-4" />}
        title="Zoom In"
        disabled={scale >= maxZoom}
      />

      <div className="mx-1 h-6 w-px bg-[rgba(139,92,246,0.2)]" />

      <ZoomButton
        onClick={onFitScreen}
        icon={<Maximize2 className="h-4 w-4" />}
        title="Fit Screen"
      />
    </div>
  );
}

export default ZoomControls;
