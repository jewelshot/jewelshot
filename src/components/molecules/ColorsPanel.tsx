/**
 * ColorsPanel - Molecule Component
 * Professional color adjustment controls
 *
 * Atomic Architecture:
 * - Uses AdjustSlider atoms for consistent UI
 * - Manages color filter state
 * - Provides callback for parent components
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AdjustSlider } from '@/components/atoms/AdjustSlider';

interface ColorsPanelProps {
  /**
   * Callback when any color value changes
   */
  onColorChange?: (colors: ColorFilters) => void;
}

export interface ColorFilters {
  temperature?: number; // -100 to +100 (Blue ↔ Orange)
  tint?: number; // -100 to +100 (Green ↔ Magenta)
  saturation?: number; // -100 to +100 (Grayscale ↔ Vivid)
  vibrance?: number; // -100 to +100 (Smart saturation)
}

/**
 * ColorsPanel Component
 * Provides professional color adjustment controls
 */
export function ColorsPanel({ onColorChange }: ColorsPanelProps) {
  // Color state
  const [temperature, setTemperature] = useState(0);
  const [tint, setTint] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [vibrance, setVibrance] = useState(0);

  // Notify parent on change
  useEffect(() => {
    if (onColorChange) {
      onColorChange({
        temperature,
        tint,
        saturation,
        vibrance,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temperature, tint, saturation, vibrance]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Color Balance Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Color Balance
        </h3>

        <AdjustSlider
          label="Temperature"
          value={temperature}
          min={-100}
          max={100}
          onChange={setTemperature}
        />

        <AdjustSlider
          label="Tint"
          value={tint}
          min={-100}
          max={100}
          onChange={setTint}
        />
      </div>

      {/* Color Intensity Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Color Intensity
        </h3>

        <AdjustSlider
          label="Saturation"
          value={saturation}
          min={-100}
          max={100}
          onChange={setSaturation}
        />

        <AdjustSlider
          label="Vibrance"
          value={vibrance}
          min={-100}
          max={100}
          onChange={setVibrance}
        />
      </div>
    </div>
  );
}

export default ColorsPanel;
