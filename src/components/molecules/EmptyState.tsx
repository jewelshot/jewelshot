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

        {/* Button - Last to appear with pulse + floating effect */}
        <div
          className="relative inline-block"
          style={{
            animation:
              'welcomeZoomIn 1.6s ease-out 0.45s forwards, floatButton 3s ease-in-out 2.5s infinite',
            opacity: 0,
          }}
        >
          {/* Pulse glow behind button */}
          <div
            className="absolute inset-0 rounded-xl bg-purple-500"
            style={{
              animation:
                'glowFadeIn 1.6s ease-out 0.45s forwards, slowPulse 2.5s ease-in-out 2.05s infinite',
              filter: 'blur(12px)',
              transform: 'scale(1.1)',
              opacity: 0, // Start invisible, fade in with button
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
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        @keyframes glowFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.2;
          }
        }

        @keyframes slowPulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes floatButton {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

export default EmptyState;
