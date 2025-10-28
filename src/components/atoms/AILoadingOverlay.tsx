'use client';

import React from 'react';

interface AILoadingOverlayProps {
  progress?: string;
}

export function AILoadingOverlay({
  progress = 'AI Processing...',
}: AILoadingOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      {/* Elegant dark overlay with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* 3D Rotating Diamond Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* 3D Diamond */}
        <div
          className="relative"
          style={{
            perspective: '1000px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* Diamond wrapper with 3D transform */}
          <div
            className="relative h-32 w-32"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'rotateDiamond 4s ease-in-out infinite',
            }}
          >
            {/* Top pyramid (upper half) */}
            <div
              className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 100%',
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 origin-bottom"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 215, 0, 0.7))',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  transform: 'rotateX(30deg)',
                  boxShadow:
                    'inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 215, 0, 0.6)',
                }}
              />
              {/* Left face */}
              <div
                className="absolute inset-0 origin-bottom"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(192, 192, 192, 0.6))',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  transform: 'rotateY(-60deg) rotateX(30deg)',
                  boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.3)',
                }}
              />
              {/* Right face */}
              <div
                className="absolute inset-0 origin-bottom"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(192, 192, 192, 0.6))',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  transform: 'rotateY(60deg) rotateX(30deg)',
                  boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.3)',
                }}
              />
              {/* Back face */}
              <div
                className="absolute inset-0 origin-bottom"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(150, 150, 150, 0.5))',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  transform: 'rotateY(180deg) rotateX(30deg)',
                  boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Bottom pyramid (lower half) */}
            <div
              className="absolute bottom-0 left-1/2 h-16 w-16 -translate-x-1/2"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 0%',
              }}
            >
              {/* Front face */}
              <div
                className="absolute inset-0 origin-top"
                style={{
                  background:
                    'linear-gradient(to top, rgba(255, 215, 0, 0.8), rgba(255, 255, 255, 0.6))',
                  clipPath: 'polygon(50% 100%, 100% 0%, 0% 0%)',
                  transform: 'rotateX(-30deg)',
                  boxShadow:
                    'inset 0 0 20px rgba(255, 215, 0, 0.4), 0 0 25px rgba(255, 215, 0, 0.5)',
                }}
              />
              {/* Left face */}
              <div
                className="absolute inset-0 origin-top"
                style={{
                  background:
                    'linear-gradient(to top, rgba(192, 192, 192, 0.7), rgba(255, 255, 255, 0.5))',
                  clipPath: 'polygon(50% 100%, 100% 0%, 0% 0%)',
                  transform: 'rotateY(-60deg) rotateX(-30deg)',
                  boxShadow: 'inset 0 0 15px rgba(192, 192, 192, 0.3)',
                }}
              />
              {/* Right face */}
              <div
                className="absolute inset-0 origin-top"
                style={{
                  background:
                    'linear-gradient(to top, rgba(192, 192, 192, 0.7), rgba(255, 255, 255, 0.5))',
                  clipPath: 'polygon(50% 100%, 100% 0%, 0% 0%)',
                  transform: 'rotateY(60deg) rotateX(-30deg)',
                  boxShadow: 'inset 0 0 15px rgba(192, 192, 192, 0.3)',
                }}
              />
              {/* Back face */}
              <div
                className="absolute inset-0 origin-top"
                style={{
                  background:
                    'linear-gradient(to top, rgba(150, 150, 150, 0.6), rgba(255, 255, 255, 0.4))',
                  clipPath: 'polygon(50% 100%, 100% 0%, 0% 0%)',
                  transform: 'rotateY(180deg) rotateX(-30deg)',
                  boxShadow: 'inset 0 0 10px rgba(150, 150, 150, 0.2)',
                }}
              />
            </div>

            {/* Diamond glow */}
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </div>
        </div>

        {/* Progress text */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-sm font-semibold tracking-wide text-transparent"
            style={{
              textShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
            }}
          >
            {progress}
          </span>

          {/* Elegant dots */}
          <div className="flex gap-1.5">
            <span
              className="h-1.5 w-1.5 animate-[bounce_1.2s_infinite_0ms] rounded-full bg-gradient-to-br from-amber-300 to-amber-500"
              style={{ boxShadow: '0 0 6px rgba(255, 215, 0, 0.6)' }}
            />
            <span
              className="h-1.5 w-1.5 animate-[bounce_1.2s_infinite_250ms] rounded-full bg-gradient-to-br from-amber-300 to-amber-500"
              style={{ boxShadow: '0 0 6px rgba(255, 215, 0, 0.6)' }}
            />
            <span
              className="h-1.5 w-1.5 animate-[bounce_1.2s_infinite_500ms] rounded-full bg-gradient-to-br from-amber-300 to-amber-500"
              style={{ boxShadow: '0 0 6px rgba(255, 215, 0, 0.6)' }}
            />
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes rotateDiamond {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          25% {
            transform: rotateX(20deg) rotateY(90deg) rotateZ(0deg);
          }
          50% {
            transform: rotateX(0deg) rotateY(180deg) rotateZ(10deg);
          }
          75% {
            transform: rotateX(-20deg) rotateY(270deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(0deg) rotateY(360deg) rotateZ(0deg);
          }
        }
      `}</style>
    </div>
  );
}

export default AILoadingOverlay;
