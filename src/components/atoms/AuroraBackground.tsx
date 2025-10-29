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

interface AuroraBackgroundProps {
  /**
   * Whether to show the aurora effect
   * @default true
   */
  enabled?: boolean;
}

export function AuroraBackground({ enabled = true }: AuroraBackgroundProps) {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Top-Left: Deep Purple */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(107, 33, 168, 0.6) 0%, transparent 70%)',
          filter: 'blur(100px)',
          top: '-20%',
          left: '-20%',
          animation: 'float-1 28s ease-in-out infinite',
        }}
      />

      {/* Top-Right: Deep Indigo Blue */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(55, 48, 163, 0.55) 0%, transparent 70%)',
          filter: 'blur(100px)',
          top: '-20%',
          right: '-20%',
          animation: 'float-2 32s ease-in-out infinite',
        }}
      />

      {/* Bottom-Left: Deep Teal */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(19, 78, 74, 0.5) 0%, transparent 70%)',
          filter: 'blur(100px)',
          bottom: '-20%',
          left: '-20%',
          animation: 'float-3 30s ease-in-out infinite',
        }}
      />

      {/* Bottom-Right: Deep Crimson */}
      <div
        className="absolute h-[800px] w-[800px] rounded-full opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(159, 18, 57, 0.5) 0%, transparent 70%)',
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
