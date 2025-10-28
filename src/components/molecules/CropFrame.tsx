'use client';

import React, { useState, useRef, useEffect } from 'react';
import ResizeHandle from '@/components/atoms/ResizeHandle';
import CropGrid from '@/components/atoms/CropGrid';

interface CropFrameProps {
  /**
   * Aspect ratio (width/height) - null for free crop
   */
  aspectRatio: number | null;
  /**
   * Image dimensions
   */
  imageSize: { width: number; height: number };
  /**
   * Crop area change callback
   */
  onCropChange: (crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

/**
 * CropFrame - Draggable and resizable crop frame
 */
export function CropFrame({
  aspectRatio,
  imageSize,
  onCropChange,
}: CropFrameProps) {
  const [crop, setCrop] = useState({
    x: imageSize.width * 0.1,
    y: imageSize.height * 0.1,
    width: imageSize.width * 0.8,
    height: imageSize.height * 0.8,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizePosition = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, cropX: 0, cropY: 0 });

  // Notify parent of crop changes
  useEffect(() => {
    onCropChange(crop);
  }, [crop, onCropChange]);

  // Adjust crop to maintain aspect ratio
  const adjustForAspectRatio = (newCrop: typeof crop) => {
    if (aspectRatio === null) return newCrop;

    const currentRatio = newCrop.width / newCrop.height;

    if (Math.abs(currentRatio - aspectRatio) > 0.01) {
      if (currentRatio > aspectRatio) {
        // Too wide, adjust width
        newCrop.width = newCrop.height * aspectRatio;
      } else {
        // Too tall, adjust height
        newCrop.height = newCrop.width / aspectRatio;
      }
    }

    return newCrop;
  };

  // Handle frame drag
  const handleFrameMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  // Handle resize
  const handleResizeMouseDown = (e: React.MouseEvent, position: string) => {
    e.stopPropagation();
    setIsResizing(true);
    resizePosition.current = position;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  // Global mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;

        let newX = dragStart.current.cropX + deltaX;
        let newY = dragStart.current.cropY + deltaY;

        // Constrain to image bounds
        newX = Math.max(0, Math.min(newX, imageSize.width - crop.width));
        newY = Math.max(0, Math.min(newY, imageSize.height - crop.height));

        setCrop((prev) => ({ ...prev, x: newX, y: newY }));
      }

      if (isResizing && resizePosition.current) {
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
        const pos = resizePosition.current;

        let newCrop = { ...crop };

        // Handle different resize positions
        if (pos.includes('l')) {
          newCrop.x = dragStart.current.cropX + deltaX;
          newCrop.width = crop.width - deltaX;
        }
        if (pos.includes('r')) {
          newCrop.width = crop.width + deltaX;
        }
        if (pos.includes('t')) {
          newCrop.y = dragStart.current.cropY + deltaY;
          newCrop.height = crop.height - deltaY;
        }
        if (pos.includes('b')) {
          newCrop.height = crop.height + deltaY;
        }

        // Constrain minimum size
        newCrop.width = Math.max(50, newCrop.width);
        newCrop.height = Math.max(50, newCrop.height);

        // Apply aspect ratio
        newCrop = adjustForAspectRatio(newCrop);

        // Constrain to image bounds
        newCrop.x = Math.max(
          0,
          Math.min(newCrop.x, imageSize.width - newCrop.width)
        );
        newCrop.y = Math.max(
          0,
          Math.min(newCrop.y, imageSize.height - newCrop.height)
        );
        newCrop.width = Math.min(newCrop.width, imageSize.width - newCrop.x);
        newCrop.height = Math.min(newCrop.height, imageSize.height - newCrop.y);

        setCrop(newCrop);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      resizePosition.current = null;
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, crop, imageSize, aspectRatio]);

  return (
    <div
      className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
      style={{
        left: `${crop.x}px`,
        top: `${crop.y}px`,
        width: `${crop.width}px`,
        height: `${crop.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleFrameMouseDown}
    >
      <CropGrid />

      {/* Resize handles */}
      <ResizeHandle position="tl" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="tr" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="bl" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="br" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="t" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="r" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="b" onMouseDown={handleResizeMouseDown} />
      <ResizeHandle position="l" onMouseDown={handleResizeMouseDown} />
    </div>
  );
}

export default CropFrame;
