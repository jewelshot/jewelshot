'use client';

import React from 'react';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function FilterChip({ label, active, onClick, icon }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? 'bg-[rgba(139,92,246,0.3)] text-[rgba(196,181,253,1)] ring-1 ring-[rgba(139,92,246,0.5)]'
          : 'bg-[rgba(10,10,10,0.6)] text-[rgba(196,181,253,0.6)] hover:bg-[rgba(10,10,10,0.8)] hover:text-[rgba(196,181,253,0.8)]'
      } backdrop-blur-[16px]`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default FilterChip;
