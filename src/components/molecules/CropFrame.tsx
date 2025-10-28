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
        const handle = dragData.current.handle;
        const startCrop = dragData.current.startCrop;

        // Anchor point (opposite corner/edge that stays fixed)
        // For aspect ratio mode, edge handles use center anchor
        // For free mode, edge handles use opposite edge anchor
        const anchorX = handle.includes('l')
          ? startCrop.x + startCrop.width
          : handle.includes('r')
            ? startCrop.x
            : aspectRatio
              ? startCrop.x + startCrop.width / 2 // Center for aspect ratio
              : startCrop.x; // Left edge for free mode
        const anchorY = handle.includes('t')
          ? startCrop.y + startCrop.height
          : handle.includes('b')
            ? startCrop.y
            : aspectRatio
              ? startCrop.y + startCrop.height / 2 // Center for aspect ratio
              : startCrop.y; // Top edge for free mode

        // Calculate target dimensions
        let targetWidth = startCrop.width;
        let targetHeight = startCrop.height;

        if (handle.includes('l') || handle.includes('r')) {
          targetWidth = handle.includes('l')
            ? anchorX - (startCrop.x + normDeltaX)
            : startCrop.width + normDeltaX;
        }
        if (handle.includes('t') || handle.includes('b')) {
          targetHeight = handle.includes('t')
            ? anchorY - (startCrop.y + normDeltaY)
            : startCrop.height + normDeltaY;
        }

        // Enforce minimum size
        targetWidth = Math.max(0.02, targetWidth);
        targetHeight = Math.max(0.02, targetHeight);

        // Apply aspect ratio
        if (aspectRatio) {
          const isEdgeH = handle === 't' || handle === 'b';
          const isEdgeV = handle === 'l' || handle === 'r';

          if (isEdgeH) {
            // Height control - calculate width
            targetWidth =
              (targetHeight * imageSize.height * aspectRatio) / imageSize.width;
          } else if (isEdgeV) {
            // Width control - calculate height
            targetHeight =
              (targetWidth * imageSize.width) /
              (aspectRatio * imageSize.height);
          } else {
            // Corner - use dominant axis
            if (Math.abs(normDeltaX) > Math.abs(normDeltaY)) {
              targetHeight =
                (targetWidth * imageSize.width) /
                (aspectRatio * imageSize.height);
            } else {
              targetWidth =
                (targetHeight * imageSize.height * aspectRatio) /
                imageSize.width;
            }
          }
        }

        // Calculate initial position from anchor
        let targetX: number;
        let targetY: number;

        if (aspectRatio) {
          // ASPECT RATIO MODE: anchor point determines position (with center alignment for edges)
          targetX = anchorX - targetWidth;
          targetY = anchorY - targetHeight;

          // Adjust for right/bottom anchored handles
          if (handle.includes('r')) targetX = anchorX;
          if (handle.includes('b')) targetY = anchorY;
          // Edge handles keep center
          if (handle === 't' || handle === 'b')
            targetX = anchorX - targetWidth / 2;
          if (handle === 'l' || handle === 'r')
            targetY = anchorY - targetHeight / 2;
        } else {
          // FREE MODE: only move the dragged edge, keep others fixed
          targetX = anchorX; // Default: keep left edge (for t/b/r handles)
          targetY = anchorY; // Default: keep top edge (for l/r/b handles)

          if (handle.includes('l')) targetX = anchorX - targetWidth; // Move left edge
          if (handle.includes('t')) targetY = anchorY - targetHeight; // Move top edge
        }

        // Boundary constraints
        if (aspectRatio) {
          // ASPECT RATIO MODE: scale proportionally to fit within bounds
          // First, ensure dimensions don't exceed canvas size
          if (targetWidth > 1 || targetHeight > 1) {
            const scaleForSize = Math.min(1 / targetWidth, 1 / targetHeight);
            targetWidth *= scaleForSize;
            targetHeight *= scaleForSize;

            // Recalculate position from anchor
            if (handle.includes('l')) targetX = anchorX - targetWidth;
            else if (handle.includes('r')) targetX = anchorX;
            else targetX = anchorX - targetWidth / 2;

            if (handle.includes('t')) targetY = anchorY - targetHeight;
            else if (handle.includes('b')) targetY = anchorY;
            else targetY = anchorY - targetHeight / 2;
          }

          // Then check if position causes overflow
          if (
            targetX < 0 ||
            targetY < 0 ||
            targetX + targetWidth > 1 ||
            targetY + targetHeight > 1
          ) {
            // Calculate required scale to fit within bounds
            let scale = 1;

            if (targetX < 0) scale = Math.min(scale, anchorX / targetWidth);
            if (targetY < 0) scale = Math.min(scale, anchorY / targetHeight);
            if (targetX + targetWidth > 1) {
              const availableWidth = 1 - anchorX;
              scale = Math.min(scale, availableWidth / targetWidth);
            }
            if (targetY + targetHeight > 1) {
              const availableHeight = 1 - anchorY;
              scale = Math.min(scale, availableHeight / targetHeight);
            }

            // Apply scale
            if (scale < 1) {
              targetWidth *= scale;
              targetHeight *= scale;

              // Recalculate position from anchor
              if (handle.includes('l')) targetX = anchorX - targetWidth;
              else if (handle.includes('r')) targetX = anchorX;
              else targetX = anchorX - targetWidth / 2;

              if (handle.includes('t')) targetY = anchorY - targetHeight;
              else if (handle.includes('b')) targetY = anchorY;
              else targetY = anchorY - targetHeight / 2;
            }
          }

          // Final position clamp
          targetX = Math.max(0, Math.min(targetX, 1 - targetWidth));
          targetY = Math.max(0, Math.min(targetY, 1 - targetHeight));
        } else {
          // FREE MODE: simple boundary clamp (no scaling)
          // Clamp position and dimensions independently
          if (targetX < 0) {
            targetWidth += targetX;
            targetX = 0;
          }
          if (targetY < 0) {
            targetHeight += targetY;
            targetY = 0;
          }
          if (targetX + targetWidth > 1) {
            targetWidth = 1 - targetX;
          }
          if (targetY + targetHeight > 1) {
            targetHeight = 1 - targetY;
          }

          // Ensure minimum size
          targetWidth = Math.max(0.02, Math.min(targetWidth, 1));
          targetHeight = Math.max(0.02, Math.min(targetHeight, 1));
        }

        setCrop({
          x: targetX,
          y: targetY,
          width: targetWidth,
          height: targetHeight,
        });
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
      className={`absolute ${
        isDragging || isResizing
          ? 'shadow-[0_0_0_9999px_rgba(0,0,0,0.75)]'
          : 'shadow-[0_0_0_9999px_rgba(0,0,0,0.7),0_0_32px_rgba(139,92,246,0.25),inset_0_0_0_1px_rgba(255,255,255,0.1)]'
      }`}
      style={{
        left: `${pixelCrop.x}px`,
        top: `${pixelCrop.y}px`,
        width: `${pixelCrop.width}px`,
        height: `${pixelCrop.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        willChange: 'left, top, width, height',
        border: '0.5px solid rgba(255, 255, 255, 0.6)',
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
