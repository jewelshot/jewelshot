/**
 * AuroraBackground Component
 *
 * Displays animated gradient blobs for premium background effect.
 * Ported from studio.html aurora background implementation.
 *
 * Features:
 * - 4 gradient blobs positioned in corners
 * - Smooth animations with cubic-bezier easing
 * - Optimized for desktop (can be disabled on mobile)
 *
 * @example
 * <AuroraBackground />
 */

'use client';

import React from 'react';
import { useThemeStore } from '@/store/themeStore';

interface AuroraBackgroundProps {
  /**
   * Whether to show the aurora effect
   * @default true
   */
  enabled?: boolean;
}

const auroraGradients = {
  purple: {
    topLeft: 'rgba(107, 33, 168, 0.6)',
    topRight: 'rgba(55, 48, 163, 0.55)',
    bottomLeft: 'rgba(19, 78, 74, 0.5)',
    bottomRight: 'rgba(159, 18, 57, 0.5)',
  },
  gold: {
    topLeft: 'rgba(217, 119, 6, 0.5)',
    topRight: 'rgba(180, 83, 9, 0.45)',
    bottomLeft: 'rgba(99, 102, 241, 0.4)',
    bottomRight: 'rgba(219, 39, 119, 0.45)',
  },
  emerald: {
    topLeft: 'rgba(5, 150, 105, 0.55)',
    topRight: 'rgba(20, 184, 166, 0.5)',
    bottomLeft: 'rgba(6, 78, 59, 0.45)',
    bottomRight: 'rgba(6, 95, 70, 0.5)',
  },
  rose: {
    topLeft: 'rgba(219, 39, 119, 0.55)',
    topRight: 'rgba(236, 72, 153, 0.5)',
    bottomLeft: 'rgba(157, 23, 77, 0.45)',
    bottomRight: 'rgba(244, 114, 182, 0.5)',
  },
};

export function AuroraBackground({ enabled = true }: AuroraBackgroundProps) {
  const theme = useThemeStore((state) => state.theme);
  const gradients = auroraGradients[theme];

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Top-Left */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${gradients.topLeft} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          top: '-20%',
          left: '-20%',
          animation: 'float-1 28s ease-in-out infinite',
        }}
      />

      {/* Top-Right */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${gradients.topRight} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          top: '-20%',
          right: '-20%',
          animation: 'float-2 32s ease-in-out infinite',
        }}
      />

      {/* Bottom-Left */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${gradients.bottomLeft} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          bottom: '-20%',
          left: '-20%',
          animation: 'float-3 30s ease-in-out infinite',
        }}
      />

      {/* Bottom-Right */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${gradients.bottomRight} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          bottom: '-20%',
          right: '-20%',
          animation: 'float-4 26s ease-in-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, 50px) scale(1.1);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, 50px) scale(1.08);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, -50px) scale(1.12);
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, -50px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

export default AuroraBackground;
