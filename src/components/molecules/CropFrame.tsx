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
   * Crop area change callback - normalized 0-1 values
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
 * Uses normalized coordinates (0-1) for resolution independence
 */
export function CropFrame({
  aspectRatio,
  imageSize,
  onCropChange,
}: CropFrameProps) {
  // Normalized crop (0-1 range)
  const [crop, setCrop] = useState({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizePosition = useRef<string | null>(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, cropX: 0, cropY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify parent of crop changes
  useEffect(() => {
    onCropChange(crop);
  }, [crop, onCropChange]);

  // Adjust crop to maintain aspect ratio (normalized)
  const adjustForAspectRatio = (newCrop: typeof crop) => {
    if (aspectRatio === null) return newCrop;

    const currentRatio =
      (newCrop.width * imageSize.width) / (newCrop.height * imageSize.height);

    if (Math.abs(currentRatio - aspectRatio) > 0.01) {
      if (currentRatio > aspectRatio) {
        // Too wide, adjust width
        newCrop.width =
          (newCrop.height * imageSize.height * aspectRatio) / imageSize.width;
      } else {
        // Too tall, adjust height
        newCrop.height =
          (newCrop.width * imageSize.width) / (aspectRatio * imageSize.height);
      }
    }

    return newCrop;
  };

  // Get mouse position relative to container
  const getRelativeMousePos = (e: MouseEvent | React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Handle frame drag
  const handleFrameMouseDown = (e: React.MouseEvent) => {
    const mousePos = getRelativeMousePos(e);
    setIsDragging(true);
    dragStart.current = {
      mouseX: mousePos.x,
      mouseY: mousePos.y,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  // Handle resize
  const handleResizeMouseDown = (e: React.MouseEvent, position: string) => {
    e.stopPropagation();
    const mousePos = getRelativeMousePos(e);
    setIsResizing(true);
    resizePosition.current = position;
    dragStart.current = {
      mouseX: mousePos.x,
      mouseY: mousePos.y,
      cropX: crop.x,
      cropY: crop.y,
    };
  };

  // Global mouse move - normalized coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const mousePos = getRelativeMousePos(e);
        const deltaX =
          (mousePos.x - dragStart.current.mouseX) / imageSize.width;
        const deltaY =
          (mousePos.y - dragStart.current.mouseY) / imageSize.height;

        let newX = dragStart.current.cropX + deltaX;
        let newY = dragStart.current.cropY + deltaY;

        // Constrain to bounds (0-1)
        newX = Math.max(0, Math.min(newX, 1 - crop.width));
        newY = Math.max(0, Math.min(newY, 1 - crop.height));

        setCrop((prev) => ({ ...prev, x: newX, y: newY }));
      }

      if (isResizing && resizePosition.current) {
        const mousePos = getRelativeMousePos(e);
        const deltaX =
          (mousePos.x - dragStart.current.mouseX) / imageSize.width;
        const deltaY =
          (mousePos.y - dragStart.current.mouseY) / imageSize.height;
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

        // Constrain minimum size (5% of image)
        newCrop.width = Math.max(0.05, newCrop.width);
        newCrop.height = Math.max(0.05, newCrop.height);

        // Apply aspect ratio
        newCrop = adjustForAspectRatio(newCrop);

        // Constrain to bounds
        newCrop.x = Math.max(0, Math.min(newCrop.x, 1 - newCrop.width));
        newCrop.y = Math.max(0, Math.min(newCrop.y, 1 - newCrop.height));
        newCrop.width = Math.min(newCrop.width, 1 - newCrop.x);
        newCrop.height = Math.min(newCrop.height, 1 - newCrop.y);

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

  // Convert normalized to pixels for display
  const pixelCrop = {
    x: crop.x * imageSize.width,
    y: crop.y * imageSize.height,
    width: crop.width * imageSize.width,
    height: crop.height * imageSize.height,
  };

  return (
    <div
      ref={containerRef}
      className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
      style={{
        left: `${pixelCrop.x}px`,
        top: `${pixelCrop.y}px`,
        width: `${pixelCrop.width}px`,
        height: `${pixelCrop.height}px`,
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
