'use client';

import React from 'react';

interface TabButtonProps {
  /**
   * Tab label
   */
  label: string;
  /**
   * Whether this tab is active
   */
  active: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

/**
 * TabButton - Atomic component for tab navigation
 */
export function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-[rgba(139,92,246,0.15)] text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );
}

export default TabButton;
