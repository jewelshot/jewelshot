'use client';

import React, { useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { Camera, Upload } from 'lucide-react';
import ZoomControls from '@/components/molecules/ZoomControls';

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
    setScale((prev) => Math.min(prev + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
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
                className="max-h-full max-w-full object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                style={{
                  transform: `scale(${scale})`,
                  transition: 'transform 400ms ease-in-out',
                  animation: 'scaleIn 700ms ease-in-out',
                }}
              />
            </div>

            {/* Zoom Controls - Top Right */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                top: topOpen ? '80px' : '16px',
                right: rightOpen ? '276px' : '16px',
              }}
            >
              <ZoomControls
                scale={scale}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitScreen={handleFitScreen}
              />
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
