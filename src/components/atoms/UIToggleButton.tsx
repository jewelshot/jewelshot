'use client';

import React from 'react';

interface UIToggleButtonProps {
  controlsVisible: boolean;
  onToggle: () => void;
}

export default function UIToggleButton({
  controlsVisible,
  onToggle,
}: UIToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`group relative z-50 flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-[16px] transition-all duration-300 ${
        controlsVisible
          ? 'border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] text-white/70 hover:border-purple-500/40 hover:bg-purple-500/20 hover:text-purple-400'
          : 'border-purple-500/40 bg-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-500/60 hover:bg-purple-500/30'
      }`}
      title={controlsVisible ? 'Hide canvas controls' : 'Show canvas controls'}
      style={{ cursor: 'pointer' }}
    >
      {/* Icon */}
      <div className="relative h-4 w-4">
        {/* Eye Off (Hidden) */}
        <svg
          className={`absolute inset-0 transition-all duration-300 ${
            controlsVisible ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>

        {/* Eye On (Visible) */}
        <svg
          className={`absolute inset-0 transition-all duration-300 ${
            controlsVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </div>

      {/* Pulsing indicator when hidden */}
      {!controlsVisible && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-purple-500/10" />
      )}
    </button>
  );
}
