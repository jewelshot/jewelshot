'use client';

import React, { useState, useEffect } from 'react';
import { AdjustSlider } from '@/components/atoms/AdjustSlider';

export interface AdjustState {
  // Temel Işık
  brightness: number;
  contrast: number;
  exposure: number;
  // İleri Ton Kontrolü
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  // Netlik & Detay
  clarity: number;
  sharpness: number;
  dehaze: number;
}

interface AdjustPanelProps {
  /**
   * Adjust change handler
   */
  onAdjustChange?: (adjust: AdjustState) => void;
}

/**
 * AdjustPanel - Molecule component for image adjustment controls
 */
export function AdjustPanel({ onAdjustChange }: AdjustPanelProps) {
  const [adjust, setAdjust] = useState<AdjustState>({
    brightness: 0,
    contrast: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    sharpness: 0,
    dehaze: 0,
  });

  // Notify parent of changes
  useEffect(() => {
    if (onAdjustChange) {
      onAdjustChange(adjust);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjust]);

  const handleChange = (key: keyof AdjustState, value: number) => {
    setAdjust((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Light */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">⚡</span>
          <h4 className="text-xs font-semibold text-white/80">Basic Light</h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label="Brightness"
            value={adjust.brightness}
            min={-100}
            max={100}
            onChange={(v) => handleChange('brightness', v)}
          />
          <AdjustSlider
            label="Contrast"
            value={adjust.contrast}
            min={-100}
            max={100}
            onChange={(v) => handleChange('contrast', v)}
          />
          <AdjustSlider
            label="Exposure"
            value={adjust.exposure}
            min={-100}
            max={100}
            onChange={(v) => handleChange('exposure', v)}
          />
        </div>
      </div>

      {/* Advanced Tone Control */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🎚️</span>
          <h4 className="text-xs font-semibold text-white/80">
            Advanced Tone Control
          </h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label="Highlights"
            value={adjust.highlights}
            min={-100}
            max={100}
            onChange={(v) => handleChange('highlights', v)}
          />
          <AdjustSlider
            label="Shadows"
            value={adjust.shadows}
            min={-100}
            max={100}
            onChange={(v) => handleChange('shadows', v)}
          />
          <AdjustSlider
            label="Whites"
            value={adjust.whites}
            min={-100}
            max={100}
            onChange={(v) => handleChange('whites', v)}
          />
          <AdjustSlider
            label="Blacks"
            value={adjust.blacks}
            min={-100}
            max={100}
            onChange={(v) => handleChange('blacks', v)}
          />
        </div>
      </div>

      {/* Clarity & Detail */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">✨</span>
          <h4 className="text-xs font-semibold text-white/80">
            Clarity & Detail
          </h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label="Clarity"
            value={adjust.clarity}
            min={-100}
            max={100}
            onChange={(v) => handleChange('clarity', v)}
          />
          <AdjustSlider
            label="Sharpness"
            value={adjust.sharpness}
            min={0}
            max={100}
            onChange={(v) => handleChange('sharpness', v)}
          />
          <AdjustSlider
            label="Dehaze"
            value={adjust.dehaze}
            min={-100}
            max={100}
            onChange={(v) => handleChange('dehaze', v)}
          />
        </div>
      </div>
    </div>
  );
}

export default AdjustPanel;
