import React from 'react';
import { Camera, Upload } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="space-y-6 text-center">
        {/* Camera Icon - First to appear */}
        <Camera
          className="mx-auto h-16 w-16 text-purple-400"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out forwards',
            opacity: 0,
          }}
        />

        {/* Title - Second to appear */}
        <h2
          className="text-2xl font-bold text-white"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out 0.15s forwards',
            opacity: 0,
          }}
        >
          Welcome to Jewelshot Studio
        </h2>

        {/* Subtitle - Third to appear */}
        <p
          className="text-white/60"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out 0.3s forwards',
            opacity: 0,
          }}
        >
          Upload an image to start editing
        </p>

        {/* Button - Last to appear with rotating border */}
        <div
          className="relative inline-block"
          style={{
            animation: 'welcomeZoomIn 1.6s ease-out 0.45s forwards',
            opacity: 0,
          }}
        >
          {/* Rotating border gradient */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 270deg, rgba(139,92,246,0.8) 290deg, rgba(139,92,246,0.4) 310deg, transparent 330deg)',
              animation: 'rotateBorder 3s linear infinite',
              padding: '2px',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0.6,
            }}
          />

          {/* Pulse glow effect */}
          <div
            className="absolute inset-0 rounded-xl bg-purple-500/20"
            style={{
              animation: 'buttonPulse 2s ease-in-out infinite',
              filter: 'blur(8px)',
            }}
          />

          {/* Actual button */}
          <button
            onClick={onUploadClick}
            className="relative inline-flex items-center gap-2 rounded-xl border border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(99,102,241,0.1)] px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
          >
            <Upload className="h-5 w-5" />
            Upload Image
          </button>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes welcomeZoomIn {
          0% {
            opacity: 0;
            transform: scale(1.3) translateY(20px);
            filter: blur(8px);
          }
          50% {
            filter: blur(2px);
          }
          85% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
          92% {
            /* Bounce effect - subtle zoom in */
            transform: scale(1.04) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        @keyframes rotateBorder {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes buttonPulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

export default EmptyState;
