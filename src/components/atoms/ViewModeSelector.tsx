'use client';

import React from 'react';

interface ViewModeSelectorProps {
  viewMode: 'normal' | 'side-by-side';
  onViewModeChange: (mode: 'normal' | 'side-by-side') => void;
  disabled?: boolean;
}

export function ViewModeSelector({
  viewMode,
  onViewModeChange,
  disabled = false,
}: ViewModeSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-0.5 backdrop-blur-[16px]">
      {/* Normal View */}
      <button
        onClick={() => onViewModeChange('normal')}
        disabled={disabled}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
          viewMode === 'normal'
            ? 'bg-[rgba(139,92,246,0.2)] text-[rgba(196,181,253,1)]'
            : 'text-[rgba(196,181,253,0.6)] hover:text-[rgba(196,181,253,0.8)]'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        title="Normal View"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
        <span>Normal</span>
      </button>

      {/* Side by Side View */}
      <button
        onClick={() => onViewModeChange('side-by-side')}
        disabled={disabled}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
          viewMode === 'side-by-side'
            ? 'bg-[rgba(139,92,246,0.2)] text-[rgba(196,181,253,1)]'
            : 'text-[rgba(196,181,253,0.6)] hover:text-[rgba(196,181,253,0.8)]'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        title="Side by Side Comparison"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <rect x="14" y="3" width="7" height="18" rx="1" />
        </svg>
        <span>Compare</span>
      </button>
    </div>
  );
}

export default ViewModeSelector;
