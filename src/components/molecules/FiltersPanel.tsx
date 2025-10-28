/**
 * FiltersPanel - Molecule Component
 * Professional filter effects (Vignette, Grain, Fade)
 *
 * Atomic Architecture:
 * - Uses AdjustSlider atoms for consistent UI
 * - Manages filter effect state
 * - Provides callback for parent components
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AdjustSlider } from '@/components/atoms/AdjustSlider';

interface FiltersPanelProps {
  /**
   * Callback when any filter value changes
   */
  onFilterChange?: (filters: FilterEffects) => void;
}

export interface FilterEffects {
  vignetteAmount?: number; // -100 to +100 (Negative: white, Positive: black)
  vignetteSize?: number; // 0 to 100 (Vignette radius)
  vignetteFeather?: number; // 0 to 100 (Edge softness)
  grainAmount?: number; // 0 to 100 (Grain intensity)
  grainSize?: number; // 0 to 100 (Particle size)
  fadeAmount?: number; // 0 to 100 (Film fade effect)
}

/**
 * FiltersPanel Component
 * Provides professional filter effect controls
 */
export function FiltersPanel({ onFilterChange }: FiltersPanelProps) {
  // Vignette state
  const [vignetteAmount, setVignetteAmount] = useState(0);
  const [vignetteSize, setVignetteSize] = useState(50);
  const [vignetteFeather, setVignetteFeather] = useState(50);

  // Grain state
  const [grainAmount, setGrainAmount] = useState(0);
  const [grainSize, setGrainSize] = useState(50);

  // Fade state
  const [fadeAmount, setFadeAmount] = useState(0);

  // Notify parent on change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        vignetteAmount,
        vignetteSize,
        vignetteFeather,
        grainAmount,
        grainSize,
        fadeAmount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    vignetteAmount,
    vignetteSize,
    vignetteFeather,
    grainAmount,
    grainSize,
    fadeAmount,
  ]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Vignette Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Vignette
        </h3>

        <AdjustSlider
          label="Amount"
          value={vignetteAmount}
          min={-100}
          max={100}
          onChange={setVignetteAmount}
        />

        <AdjustSlider
          label="Size"
          value={vignetteSize}
          min={0}
          max={100}
          onChange={setVignetteSize}
        />

        <AdjustSlider
          label="Feather"
          value={vignetteFeather}
          min={0}
          max={100}
          onChange={setVignetteFeather}
        />
      </div>

      {/* Grain Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Film Grain
        </h3>

        <AdjustSlider
          label="Amount"
          value={grainAmount}
          min={0}
          max={100}
          onChange={setGrainAmount}
        />

        <AdjustSlider
          label="Size"
          value={grainSize}
          min={0}
          max={100}
          onChange={setGrainSize}
        />
      </div>

      {/* Fade Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Film Fade
        </h3>

        <AdjustSlider
          label="Amount"
          value={fadeAmount}
          min={0}
          max={100}
          onChange={setFadeAmount}
        />
      </div>
    </div>
  );
}

export default FiltersPanel;
