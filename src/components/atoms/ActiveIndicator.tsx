import React from 'react';

interface ActiveIndicatorProps {
  /**
   * Whether to show the active indicator
   */
  active: boolean;
}

export function ActiveIndicator({ active }: ActiveIndicatorProps) {
  if (!active) return null;

  return (
    <div className="absolute -left-px top-1/2 h-[60%] w-[2px] -translate-y-1/2 rounded-r-sm bg-gradient-to-b from-[#8b5cf6] to-[#6366f1]" />
  );
}

export default ActiveIndicator;
