'use client';

import React, { useState } from 'react';
import CropRatioButton from '@/components/atoms/CropRatioButton';

interface CropRatio {
  label: string;
  ratio: number | null; // null for "Free"
}

interface CropPanelProps {
  /**
   * Crop ratio change handler
   */
  onCropRatioChange: (ratio: number | null) => void;
}

const cropRatios: CropRatio[] = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '9:16', ratio: 9 / 16 },
  { label: '3:4', ratio: 3 / 4 },
  { label: '2:3', ratio: 2 / 3 },
  { label: '21:9', ratio: 21 / 9 },
  { label: '9:21', ratio: 9 / 21 },
  { label: '5:4', ratio: 5 / 4 },
  { label: '4:5', ratio: 4 / 5 },
];

/**
 * CropPanel - Molecule component for crop controls
 */
export function CropPanel({ onCropRatioChange }: CropPanelProps) {
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);

  const handleRatioClick = (ratio: number | null) => {
    setSelectedRatio(ratio);
    onCropRatioChange(ratio);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-3 text-xs font-medium text-white/80">Aspect Ratio</h4>
        <div className="grid grid-cols-4 gap-2">
          {cropRatios.map((item) => (
            <CropRatioButton
              key={item.label}
              label={item.label}
              ratio={item.ratio}
              active={selectedRatio === item.ratio}
              onClick={() => handleRatioClick(item.ratio)}
            />
          ))}
        </div>
      </div>

      {selectedRatio !== null && (
        <div className="rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] p-3">
          <p className="text-xs text-white/60">
            Selected ratio:{' '}
            <span className="font-medium text-white">
              {cropRatios.find((r) => r.ratio === selectedRatio)?.label}
            </span>
          </p>
          <p className="mt-1 text-xs text-white/50">
            Click and drag on the image to crop with this ratio
          </p>
        </div>
      )}
    </div>
  );
}

export default CropPanel;
