'use client';

import React from 'react';
import { ChevronUp } from 'lucide-react';

interface AIToggleButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function AIToggleButton({
  isExpanded,
  onClick,
  disabled = false,
}: AIToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative h-8 w-8 overflow-hidden rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.85)] backdrop-blur-xl transition-all duration-200 hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(10,10,10,0.95)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      title={isExpanded ? 'Hide prompt' : 'Show prompt'}
      aria-label={isExpanded ? 'Hide prompt' : 'Show prompt'}
      aria-expanded={isExpanded}
    >
      {/* Dark backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/40 backdrop-blur-2xl" />

      {/* Icon */}
      <div className="relative flex h-full w-full items-center justify-center">
        <ChevronUp
          className={`h-4 w-4 text-purple-300 transition-all duration-300 ease-out group-hover:text-white ${
            isExpanded ? 'rotate-0' : 'rotate-180'
          }`}
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
          }}
        />
      </div>
    </button>
  );
}

export default AIToggleButton;
