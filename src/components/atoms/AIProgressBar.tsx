'use client';

import React from 'react';

interface AIProgressBarProps {
  progress?: string;
  status?: 'uploading' | 'processing' | 'completing';
}

export function AIProgressBar({
  progress = 'Processing...',
  status = 'processing',
}: AIProgressBarProps) {
  const statusColors = {
    uploading: 'from-blue-500 to-cyan-500',
    processing: 'from-purple-500 to-pink-500',
    completing: 'from-green-500 to-emerald-500',
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] space-y-1.5">
      {/* Progress text */}
      <div className="flex items-center justify-between px-0.5">
        <span
          className="text-[10px] font-medium text-purple-300"
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        >
          {progress}
        </span>
        <div className="flex gap-0.5">
          <span
            className="h-0.5 w-0.5 animate-[bounce_1s_infinite_0ms] rounded-full bg-purple-400"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(139, 92, 246, 0.6))',
            }}
          />
          <span
            className="h-0.5 w-0.5 animate-[bounce_1s_infinite_200ms] rounded-full bg-purple-400"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(139, 92, 246, 0.6))',
            }}
          />
          <span
            className="h-0.5 w-0.5 animate-[bounce_1s_infinite_400ms] rounded-full bg-purple-400"
            style={{
              filter: 'drop-shadow(0 0 2px rgba(139, 92, 246, 0.6))',
            }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 overflow-hidden rounded-full bg-black/40">
        {/* Animated gradient */}
        <div
          className={`h-full w-full animate-[slideRight_1.5s_ease-in-out_infinite] bg-gradient-to-r ${statusColors[status]}`}
          style={{
            backgroundSize: '200% 100%',
            filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.6))',
          }}
        />

        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}

export default AIProgressBar;
