'use client';

import React, { useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import ZoomControls from '@/components/molecules/ZoomControls';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingState from '@/components/atoms/LoadingState';
import ImageViewer from '@/components/molecules/ImageViewer';

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
          <EmptyState onUploadClick={handleCanvasClick} />
        )}

        {isLoading && <LoadingState />}

        {uploadedImage && (
          <>
            <ImageViewer src={uploadedImage} alt="Uploaded" scale={scale} />

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
