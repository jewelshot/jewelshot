'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  // Calculate initial crop based on aspect ratio
  const getInitialCrop = () => {
    if (!aspectRatio) {
      // Free crop - 80% of image, centered
      return { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };
    }

    // Calculate maximum crop area that fits aspect ratio
    const imageAspectRatio = imageSize.width / imageSize.height;

    if (aspectRatio > imageAspectRatio) {
      // Crop is wider than image - constrain by width
      const width = 0.9;
      const height =
        (width * imageSize.width) / (aspectRatio * imageSize.height);
      return {
        x: 0.05,
        y: (1 - height) / 2,
        width,
        height,
      };
    } else {
      // Crop is taller than image - constrain by height
      const height = 0.9;
      const width = (height * imageSize.height * aspectRatio) / imageSize.width;
      return {
        x: (1 - width) / 2,
        y: 0.05,
        width,
        height,
      };
    }
  };

  const [crop, setCrop] = useState(getInitialCrop());
  const cropRef = useRef(crop);

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

  // Keep cropRef in sync with crop state
  useEffect(() => {
    cropRef.current = crop;
  }, [crop]);

  // Set container ref on mount
  useEffect(() => {
    if (frameRef.current) {
      containerRef.current = frameRef.current.parentElement;
    }
  }, []);

  // Reset crop when aspect ratio changes
  useEffect(() => {
    const newCrop = getInitialCrop();
    setCrop(newCrop);
    onCropChange(newCrop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio]);

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
      e.stopPropagation();

      // Calculate delta with high precision
      const deltaX = e.clientX - dragData.current.startX;
      const deltaY = e.clientY - dragData.current.startY;
      const normDeltaX = deltaX / imageSize.width;
      const normDeltaY = deltaY / imageSize.height;

      if (isDragging) {
        // Move the frame - direct update for 1:1 mouse tracking
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
        // Simplified resize with proper aspect ratio handling - direct update for 1:1 tracking
        const handle = dragData.current.handle;
        const startCrop = dragData.current.startCrop;
        let newCrop = { ...startCrop };

        // Determine anchor point (opposite corner/edge that stays fixed)
        // For edge handles (t, b, l, r), anchor is the center of opposite edge
        // For corner handles (tl, tr, bl, br), anchor is the opposite corner
        const anchorX = handle.includes('l')
          ? startCrop.x + startCrop.width
          : handle.includes('r')
            ? startCrop.x
            : startCrop.x + startCrop.width / 2; // Center for top/bottom edges
        const anchorY = handle.includes('t')
          ? startCrop.y + startCrop.height
          : handle.includes('b')
            ? startCrop.y
            : startCrop.y + startCrop.height / 2; // Center for left/right edges

        // Calculate new dimensions based on mouse delta
        let newX = newCrop.x;
        let newY = newCrop.y;
        let newWidth = newCrop.width;
        let newHeight = newCrop.height;

        if (handle.includes('l')) {
          newX = startCrop.x + normDeltaX;
          newWidth = anchorX - newX;
        } else if (handle.includes('r')) {
          newWidth = startCrop.width + normDeltaX;
        }

        if (handle.includes('t')) {
          newY = startCrop.y + normDeltaY;
          newHeight = anchorY - newY;
        } else if (handle.includes('b')) {
          newHeight = startCrop.height + normDeltaY;
        }

        // Ensure minimum size (more precise - 2% instead of 5%)
        if (newWidth < 0.02) {
          newWidth = 0.02;
          if (handle.includes('l')) newX = anchorX - 0.02;
        }
        if (newHeight < 0.02) {
          newHeight = 0.02;
          if (handle.includes('t')) newY = anchorY - 0.02;
        }

        // Apply aspect ratio if needed
        if (aspectRatio) {
          // Determine which dimension to base the resize on
          const resizingWidth = handle === 'l' || handle === 'r';
          const resizingHeight = handle === 't' || handle === 'b';

          if (resizingHeight && !resizingWidth) {
            // Top or Bottom edge - height is changing, calculate width from height
            newWidth =
              (newHeight * imageSize.height * aspectRatio) / imageSize.width;

            // Keep horizontal center (since no horizontal handle was dragged)
            const centerX = startCrop.x + startCrop.width / 2;
            newX = centerX - newWidth / 2;
          } else if (resizingWidth && !resizingHeight) {
            // Left or Right edge - width is changing, calculate height from width
            newHeight =
              (newWidth * imageSize.width) / (aspectRatio * imageSize.height);

            // Keep vertical center (since no vertical handle was dragged)
            const centerY = startCrop.y + startCrop.height / 2;
            newY = centerY - newHeight / 2;
          } else {
            // Corner - maintain ratio, prefer the dimension that changed more
            const widthChange = Math.abs(normDeltaX);
            const heightChange = Math.abs(normDeltaY);

            if (widthChange > heightChange) {
              // Width changed more - adjust height
              newHeight =
                (newWidth * imageSize.width) / (aspectRatio * imageSize.height);
              if (handle.includes('t')) {
                newY = anchorY - newHeight;
              }
            } else {
              // Height changed more - adjust width
              newWidth =
                (newHeight * imageSize.height * aspectRatio) / imageSize.width;
              if (handle.includes('l')) {
                newX = anchorX - newWidth;
              }
            }
          }
        }

        // Constrain to bounds
        if (newX < 0) {
          newWidth += newX;
          newX = 0;
          if (aspectRatio) {
            newHeight =
              (newWidth * imageSize.width) / (aspectRatio * imageSize.height);
            if (handle === 't' || handle === 'b') {
              // Edge handle - keep vertical center
              newY = anchorY - newHeight / 2;
            } else if (handle.includes('t')) {
              newY = anchorY - newHeight;
            }
          }
        }
        if (newY < 0) {
          newHeight += newY;
          newY = 0;
          if (aspectRatio) {
            newWidth =
              (newHeight * imageSize.height * aspectRatio) / imageSize.width;
            if (handle === 'l' || handle === 'r') {
              // Edge handle - keep horizontal center
              newX = anchorX - newWidth / 2;
            } else if (handle.includes('l')) {
              newX = anchorX - newWidth;
            }
          }
        }
        if (newX + newWidth > 1) {
          newWidth = 1 - newX;
          if (aspectRatio) {
            newHeight =
              (newWidth * imageSize.width) / (aspectRatio * imageSize.height);
            if (handle === 't' || handle === 'b') {
              // Edge handle - keep vertical center
              newY = anchorY - newHeight / 2;
            } else if (handle.includes('t')) {
              newY = anchorY - newHeight;
            }
          }
        }
        if (newY + newHeight > 1) {
          newHeight = 1 - newY;
          if (aspectRatio) {
            newWidth =
              (newHeight * imageSize.height * aspectRatio) / imageSize.width;
            if (handle === 'l' || handle === 'r') {
              // Edge handle - keep horizontal center
              newX = anchorX - newWidth / 2;
            } else if (handle.includes('l')) {
              newX = anchorX - newWidth;
            }
          }
        }

        // Final check - ensure we're still in bounds after aspect ratio adjustments
        newX = Math.max(0, Math.min(newX, 1 - newWidth));
        newY = Math.max(0, Math.min(newY, 1 - newHeight));
        newWidth = Math.min(newWidth, 1 - newX);
        newHeight = Math.min(newHeight, 1 - newY);

        newCrop = { x: newX, y: newY, width: newWidth, height: newHeight };
        setCrop(newCrop);
      }
    };

    const handleMouseUp = () => {
      // Notify parent of final crop value
      onCropChange(cropRef.current);
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
      className={`absolute border border-white/90 ${
        isDragging || isResizing
          ? 'shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]'
          : 'shadow-[0_0_0_9999px_rgba(0,0,0,0.65),0_0_24px_rgba(139,92,246,0.5),0_0_12px_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(255,255,255,0.15)]'
      }`}
      style={{
        left: `${pixelCrop.x}px`,
        top: `${pixelCrop.y}px`,
        width: `${pixelCrop.width}px`,
        height: `${pixelCrop.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        willChange: 'left, top, width, height',
        // GPU acceleration for smooth rendering
        transform: 'translateZ(0)',
        // Subpixel rendering for precision
        backfaceVisibility: 'hidden',
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
