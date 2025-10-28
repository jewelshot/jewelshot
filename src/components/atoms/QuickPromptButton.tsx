'use client';

import React from 'react';
import { Sparkles, Square, Zap, Gem } from 'lucide-react';

interface QuickPromptButtonProps {
  label: string;
  icon: 'sparkles' | 'square' | 'zap' | 'gem';
  onClick: () => void;
  disabled?: boolean;
}

const iconMap = {
  sparkles: Sparkles,
  square: Square,
  zap: Zap,
  gem: Gem,
};

export function QuickPromptButton({
  label,
  icon,
  onClick,
  disabled = false,
}: QuickPromptButtonProps) {
  const Icon = iconMap[icon];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex flex-shrink-0 items-center gap-1.5 rounded-md border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.85)] px-3 py-1.5 text-white/90 backdrop-blur-xl transition-all duration-200 hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(10,10,10,0.95)] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      title={label}
      aria-label={label}
      style={{
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Dark backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-black/40 backdrop-blur-2xl" />

      {/* Icon */}
      <Icon
        className="h-3 w-3 text-purple-400 transition-transform duration-200 group-hover:scale-110"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))',
        }}
      />

      {/* Label */}
      <span className="whitespace-nowrap text-[11px] font-medium">{label}</span>

      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-r from-purple-600/0 to-pink-600/0 opacity-0 transition-opacity duration-200 group-hover:from-purple-600/10 group-hover:to-pink-600/5 group-hover:opacity-100" />
    </button>
  );
}

export default QuickPromptButton;
