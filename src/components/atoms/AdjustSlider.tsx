'use client';

import React from 'react';

interface AdjustSliderProps {
  /**
   * Slider label
   */
  label: string;
  /**
   * Current value
   */
  value: number;
  /**
   * Minimum value
   */
  min: number;
  /**
   * Maximum value
   */
  max: number;
  /**
   * Change handler
   */
  onChange: (value: number) => void;
  /**
   * Step value
   */
  step?: number;
}

/**
 * AdjustSlider - Atomic component for image adjustment control
 */
export function AdjustSlider({
  label,
  value,
  min,
  max,
  onChange,
  step = 1,
}: AdjustSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleReset = () => {
    onChange(0);
  };

  // Calculate percentage for gradient
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/70">{label}</label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-violet-400">
            {value > 0 ? '+' : ''}
            {value}
          </span>
          {value !== 0 && (
            <button
              onClick={handleReset}
              className="text-[10px] text-white/40 hover:text-white/60"
              title="Reset"
            >
              ↺
            </button>
          )}
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          title={`${label}: ${value}`}
          aria-label={`${label} adjustment`}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
          style={{
            background: `linear-gradient(to right, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.3) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`,
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
    </div>
  );
}

export default AdjustSlider;
