'use client';

import React from 'react';
import { RotateCw, RotateCcw } from 'lucide-react';

interface RotateSliderProps {
  /**
   * Current rotation value in degrees
   */
  value: number;
  /**
   * Change handler
   */
  onChange: (value: number) => void;
}

/**
 * RotateSlider - Atomic component for rotation control
 */
export function RotateSlider({ value, onChange }: RotateSliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleQuickRotate = (delta: number) => {
    const newValue = value + delta;
    // Clamp between -180 and 180
    onChange(Math.max(-180, Math.min(180, newValue)));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/70">Rotation</label>
        <span className="font-mono text-xs text-violet-400">{value}°</span>
      </div>

      <div className="flex items-center gap-2">
        {/* -30° Button */}
        <button
          onClick={() => handleQuickRotate(-30)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
          aria-label="Rotate -30 degrees"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Slider */}
        <div className="relative flex flex-1 items-center">
          <input
            type="range"
            min="-180"
            max="180"
            value={value}
            onChange={handleSliderChange}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
            style={{
              background: `linear-gradient(to right, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.3) ${((value + 180) / 360) * 100}%, rgba(255,255,255,0.1) ${((value + 180) / 360) * 100}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
          <style jsx>{`
            input[type='range']::-webkit-slider-thumb {
              appearance: none;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #8b5cf6;
              cursor: pointer;
              box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
              transition: all 0.15s;
            }
            input[type='range']::-webkit-slider-thumb:hover {
              transform: scale(1.15);
              box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
            }
            input[type='range']::-moz-range-thumb {
              width: 12px;
              height: 12px;
              border: none;
              border-radius: 50%;
              background: #8b5cf6;
              cursor: pointer;
              box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
              transition: all 0.15s;
            }
            input[type='range']::-moz-range-thumb:hover {
              transform: scale(1.15);
              box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
            }
          `}</style>
        </div>

        {/* +30° Button */}
        <button
          onClick={() => handleQuickRotate(30)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
          aria-label="Rotate +30 degrees"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default RotateSlider;
