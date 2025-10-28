'use client';

import React, { useState, useRef, useEffect } from 'react';
import ResizeHandle from '@/components/atoms/ResizeHandle';
import CropGrid from '@/components/atoms/CropGrid';

interface CropFrameProps {
  aspectRatio: number | null;
  imageSize: { width: number; height: number };
  onCropChange: (crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

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
  const frameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragData = useRef({
    startX: 0,
    startY: 0,
    startCrop: { x: 0, y: 0, width: 0, height: 0 },
    handle: '',
  });

  // Set container ref on mount
  useEffect(() => {
    if (frameRef.current) {
      containerRef.current = frameRef.current.parentElement;
    }
  }, []);

  // Notify parent of crop changes
  useEffect(() => {
    onCropChange(crop);
  }, [crop, onCropChange]);

  // Constrain crop to maintain aspect ratio
  const constrainToAspectRatio = (
    newCrop: typeof crop,
    handle: string
  ): typeof crop => {
    if (!aspectRatio) return newCrop;

    const pixelWidth = newCrop.width * imageSize.width;
    const pixelHeight = newCrop.height * imageSize.height;
    const currentRatio = pixelWidth / pixelHeight;

    if (Math.abs(currentRatio - aspectRatio) < 0.01) return newCrop;

    // Adjust based on which handle is being dragged
    if (handle.includes('t') || handle.includes('b')) {
      // Height is changing, adjust width
      newCrop.width =
        (newCrop.height * imageSize.height * aspectRatio) / imageSize.width;
    } else {
      // Width is changing, adjust height
      newCrop.height =
        (newCrop.width * imageSize.width) / (aspectRatio * imageSize.height);
    }

    return newCrop;
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
      handle: 'move',
    };
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    dragData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
      handle,
    };
  };

  // Global mouse handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;
      if (!containerRef.current) return;

      e.preventDefault();

      const deltaX = e.clientX - dragData.current.startX;
      const deltaY = e.clientY - dragData.current.startY;
      const normDeltaX = deltaX / imageSize.width;
      const normDeltaY = deltaY / imageSize.height;

      if (isDragging) {
        // Move the frame
        const newCrop = {
          ...dragData.current.startCrop,
          x: dragData.current.startCrop.x + normDeltaX,
          y: dragData.current.startCrop.y + normDeltaY,
        };

        // Constrain to bounds
        newCrop.x = Math.max(0, Math.min(newCrop.x, 1 - newCrop.width));
        newCrop.y = Math.max(0, Math.min(newCrop.y, 1 - newCrop.height));

        setCrop(newCrop);
      } else if (isResizing) {
        // Resize the frame
        const handle = dragData.current.handle;
        let newCrop = { ...dragData.current.startCrop };

        if (handle.includes('l')) {
          newCrop.x = dragData.current.startCrop.x + normDeltaX;
          newCrop.width = dragData.current.startCrop.width - normDeltaX;
        }
        if (handle.includes('r')) {
          newCrop.width = dragData.current.startCrop.width + normDeltaX;
        }
        if (handle.includes('t')) {
          newCrop.y = dragData.current.startCrop.y + normDeltaY;
          newCrop.height = dragData.current.startCrop.height - normDeltaY;
        }
        if (handle.includes('b')) {
          newCrop.height = dragData.current.startCrop.height + normDeltaY;
        }

        // Constrain minimum size (5%)
        newCrop.width = Math.max(0.05, newCrop.width);
        newCrop.height = Math.max(0.05, newCrop.height);

        // Apply aspect ratio
        newCrop = constrainToAspectRatio(newCrop, handle);

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
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent default drag behavior
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, imageSize, aspectRatio]);

  // Convert to pixels for rendering
  const pixelCrop = {
    x: crop.x * imageSize.width,
    y: crop.y * imageSize.height,
    width: crop.width * imageSize.width,
    height: crop.height * imageSize.height,
  };

  return (
    <div
      ref={frameRef}
      className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
      style={{
        left: `${pixelCrop.x}px`,
        top: `${pixelCrop.y}px`,
        width: `${pixelCrop.width}px`,
        height: `${pixelCrop.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <CropGrid />

      <ResizeHandle
        position="tl"
        onMouseDown={(e) => handleResizeStart(e, 'tl')}
      />
      <ResizeHandle
        position="tr"
        onMouseDown={(e) => handleResizeStart(e, 'tr')}
      />
      <ResizeHandle
        position="bl"
        onMouseDown={(e) => handleResizeStart(e, 'bl')}
      />
      <ResizeHandle
        position="br"
        onMouseDown={(e) => handleResizeStart(e, 'br')}
      />
      <ResizeHandle
        position="t"
        onMouseDown={(e) => handleResizeStart(e, 't')}
      />
      <ResizeHandle
        position="r"
        onMouseDown={(e) => handleResizeStart(e, 'r')}
      />
      <ResizeHandle
        position="b"
        onMouseDown={(e) => handleResizeStart(e, 'b')}
      />
      <ResizeHandle
        position="l"
        onMouseDown={(e) => handleResizeStart(e, 'l')}
      />
    </div>
  );
}

export default CropFrame;
