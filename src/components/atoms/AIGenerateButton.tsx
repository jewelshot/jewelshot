'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIGenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function AIGenerateButton({
  onClick,
  disabled = false,
  loading = false,
}: AIGenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative overflow-hidden rounded-lg border border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(10,10,10,0.9)] to-[rgba(20,10,30,0.9)] px-4 py-2 text-white backdrop-blur-2xl transition-all duration-200 hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_0_16px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      title="Generate with AI"
      aria-label="Generate with AI"
      style={{
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Dark backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/50 backdrop-blur-2xl" />

      {/* Purple gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(99,102,241,0.1)] transition-opacity duration-200 group-hover:from-[rgba(139,92,246,0.3)] group-hover:to-[rgba(99,102,241,0.2)]" />

      {/* Shimmer effect */}
      {!loading && !disabled && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center gap-1.5">
        {loading ? (
          <>
            <Loader2
              className="h-3.5 w-3.5 animate-spin"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
              }}
            />
            <span className="text-xs font-medium">Generating...</span>
          </>
        ) : (
          <>
            <Sparkles
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
              }}
            />
            <span className="text-xs font-medium">Generate</span>
          </>
        )}
      </div>
    </button>
  );
}

export default AIGenerateButton;
