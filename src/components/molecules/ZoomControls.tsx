'use client';

import React from 'react';
import { ZoomIn, ZoomOut, Locate } from 'lucide-react';
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
    <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
      <ZoomButton
        onClick={onZoomOut}
        icon={<ZoomOut className="h-3.5 w-3.5" />}
        title="Zoom Out"
        disabled={scale <= minZoom}
      />

      <ZoomDisplay value={scale} />

      <ZoomButton
        onClick={onZoomIn}
        icon={<ZoomIn className="h-3.5 w-3.5" />}
        title="Zoom In"
        disabled={scale >= maxZoom}
      />

      <div className="mx-0.5 h-5 w-px bg-[rgba(139,92,246,0.2)]" />

      <ZoomButton
        onClick={onFitScreen}
        icon={<Locate className="h-3.5 w-3.5" />}
        title="Fit Screen"
      />
    </div>
  );
}

export default ZoomControls;
