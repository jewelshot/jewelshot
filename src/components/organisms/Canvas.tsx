'use client';

import React, { useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { Camera, Upload, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export function Canvas() {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1.0);

  const handleCanvasClick = () => {
    if (!uploadedImage) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setScale(1.0);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.15, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.15, 0.1));
  };

  const handleFitScreen = () => {
    setScale(1.0);
  };

  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;
  const topPos = topOpen ? 64 : 0;
  const bottomPos = bottomOpen ? 40 : 0;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={handleCanvasClick}
        className={`fixed z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${!uploadedImage && 'cursor-pointer'}`}
        style={{
          left: `${leftPos}px`,
          right: `${rightPos}px`,
          top: `${topPos}px`,
          bottom: `${bottomPos}px`,
        }}
      >
        {!uploadedImage && !isLoading && (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-6 text-center">
              <Camera className="mx-auto h-16 w-16 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                Welcome to Jewelshot Studio
              </h2>
              <p className="text-white/60">Upload an image to start editing</p>
              <button className="inline-flex items-center gap-2 rounded-xl border border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(99,102,241,0.1)] px-6 py-3 font-semibold text-white transition-all hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
                <Upload className="h-5 w-5" />
                Upload Image
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <div className="text-white/60">Loading...</div>
          </div>
        )}

        {uploadedImage && (
          <>
            <div className="flex h-full items-center justify-center p-8">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="max-h-full max-w-full object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-700 ease-in-out"
                style={{
                  animation: 'scaleIn 700ms ease-in-out forwards',
                  transform: `scale(${scale})`,
                }}
              />
            </div>

            {/* Zoom Controls - Top Right */}
            <div
              className="fixed z-20 flex items-center gap-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-2 backdrop-blur-[16px] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                top: topOpen ? '80px' : '16px',
                right: rightOpen ? '276px' : '16px',
              }}
            >
              <button
                onClick={handleZoomOut}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <div className="min-w-[60px] px-2 text-center text-sm font-medium text-white">
                {Math.round(scale * 100)}%
              </div>

              <button
                onClick={handleZoomIn}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <div className="mx-1 h-6 w-px bg-[rgba(139,92,246,0.2)]" />

              <button
                onClick={handleFitScreen}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
                title="Fit Screen"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default Canvas;
