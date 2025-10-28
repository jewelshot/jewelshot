'use client';

import React, { useState, useRef, useEffect } from 'react';
import CropFrame from '@/components/molecules/CropFrame';
import CropToolbar from '@/components/molecules/CropToolbar';

interface CropModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Image source
   */
  imageSrc: string;
  /**
   * Aspect ratio (width/height) - null for free crop
   */
  aspectRatio: number | null;
  /**
   * Apply crop handler - returns cropped image as base64
   */
  onApply: (croppedImage: string) => void;
  /**
   * Cancel handler
   */
  onCancel: () => void;
}

/**
 * CropModal - Full-screen crop interface
 */
export function CropModal({
  isOpen,
  imageSrc,
  aspectRatio,
  onApply,
  onCancel,
}: CropModalProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [resetKey, setResetKey] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load image and get dimensions
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      // Calculate scaled dimensions to fit screen
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.8;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      setImageSize({ width, height });
    };
  }, [isOpen, imageSrc]);

  const handleApply = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop uses normalized coordinates (0-1)
    // Convert to actual image pixels
    const srcX = cropArea.x * img.naturalWidth;
    const srcY = cropArea.y * img.naturalHeight;
    const srcWidth = cropArea.width * img.naturalWidth;
    const srcHeight = cropArea.height * img.naturalHeight;

    // Set canvas size to crop area
    canvas.width = srcWidth;
    canvas.height = srcHeight;

    // Draw cropped image
    ctx.drawImage(
      img,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      0,
      0,
      srcWidth,
      srcHeight
    );

    // Get cropped image as base64
    const croppedImage = canvas.toDataURL('image/png');
    onApply(croppedImage);
  };

  const handleReset = () => {
    // Force remount of CropFrame by changing key
    setResetKey((prev) => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Image container */}
      <div
        className="relative"
        style={{ width: imageSize.width, height: imageSize.height }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Crop preview"
          className="block select-none"
          style={{ width: imageSize.width, height: imageSize.height }}
          draggable={false}
        />

        {/* Crop frame */}
        {imageSize.width > 0 && (
          <CropFrame
            key={resetKey}
            aspectRatio={aspectRatio}
            imageSize={imageSize}
            onCropChange={setCropArea}
          />
        )}
      </div>

      {/* Toolbar */}
      <CropToolbar
        onApply={handleApply}
        onCancel={onCancel}
        onReset={handleReset}
      />

      {/* Info bar */}
      <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.95)] px-4 py-2 backdrop-blur-[16px]">
        <p className="text-sm font-medium text-white">
          Crop Image
          {aspectRatio !== null && (
            <span className="ml-2 text-white/60">
              (Aspect Ratio:{' '}
              {[
                { ratio: 1, label: '1:1' },
                { ratio: 4 / 3, label: '4:3' },
                { ratio: 3 / 4, label: '3:4' },
                { ratio: 16 / 9, label: '16:9' },
                { ratio: 9 / 16, label: '9:16' },
              ].find((r) => Math.abs(r.ratio - aspectRatio) < 0.01)?.label ||
                'Custom'}
              )
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default CropModal;
