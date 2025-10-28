'use client';

import React from 'react';

interface AILoadingOverlayProps {
  progress?: string;
}

export function AILoadingOverlay({
  progress = 'Processing with AI...',
}: AILoadingOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      {/* Subtle backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      {/* Glassmorphic center card */}
      <div
        className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl"
        style={{
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Simple rotating spinner */}
        <div
          className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
          style={{
            animation: 'spin 0.8s linear infinite',
          }}
        />

        {/* Progress text */}
        <span className="text-sm font-medium text-white/90">{progress}</span>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default AILoadingOverlay;
