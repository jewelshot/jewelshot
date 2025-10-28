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

  // Reset crop when aspect ratio changes
  useEffect(() => {
    setCrop(getInitialCrop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio]);

  // Notify parent of crop changes
  useEffect(() => {
    onCropChange(crop);
  }, [crop, onCropChange]);

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
        // Resize the frame with proper anchor point
        const handle = dragData.current.handle;
        const startCrop = dragData.current.startCrop;
        const newCrop = { ...startCrop };

        // Calculate anchor point (opposite corner/edge)
        const anchorX = handle.includes('l')
          ? startCrop.x + startCrop.width
          : startCrop.x;
        const anchorY = handle.includes('t')
          ? startCrop.y + startCrop.height
          : startCrop.y;

        // Apply deltas based on handle
        if (handle.includes('l')) {
          const newLeft = Math.max(
            0,
            Math.min(startCrop.x + normDeltaX, anchorX - 0.05)
          );
          newCrop.x = newLeft;
          newCrop.width = anchorX - newLeft;
        }
        if (handle.includes('r')) {
          const newRight = Math.max(
            anchorX + 0.05,
            Math.min(1, anchorX + normDeltaX)
          );
          newCrop.width = newRight - anchorX;
        }
        if (handle.includes('t')) {
          const newTop = Math.max(
            0,
            Math.min(startCrop.y + normDeltaY, anchorY - 0.05)
          );
          newCrop.y = newTop;
          newCrop.height = anchorY - newTop;
        }
        if (handle.includes('b')) {
          const newBottom = Math.max(
            anchorY + 0.05,
            Math.min(1, anchorY + normDeltaY)
          );
          newCrop.height = newBottom - anchorY;
        }

        // Apply aspect ratio constraint
        if (aspectRatio) {
          const oldWidth = newCrop.width;
          const oldHeight = newCrop.height;

          if (handle.includes('t') || handle.includes('b')) {
            // Vertical resize - adjust width to maintain ratio
            const targetWidth =
              (newCrop.height * imageSize.height * aspectRatio) /
              imageSize.width;

            // Check if new width fits
            if (handle.includes('l')) {
              // Anchor is on right, expand/shrink left
              const newLeft = anchorX - targetWidth;
              if (newLeft >= 0) {
                newCrop.width = targetWidth;
                newCrop.x = newLeft;
              } else {
                // Hit left bound, constrain by width
                newCrop.x = 0;
                newCrop.width = anchorX;
                newCrop.height =
                  (newCrop.width * imageSize.width) /
                  (aspectRatio * imageSize.height);
                if (handle.includes('t')) {
                  newCrop.y = anchorY - newCrop.height;
                }
              }
            } else if (handle.includes('r')) {
              // Anchor is on left, expand/shrink right
              if (anchorX + targetWidth <= 1) {
                newCrop.width = targetWidth;
              } else {
                // Hit right bound, constrain by width
                newCrop.width = 1 - anchorX;
                newCrop.height =
                  (newCrop.width * imageSize.width) /
                  (aspectRatio * imageSize.height);
                if (handle.includes('t')) {
                  newCrop.y = anchorY - newCrop.height;
                }
              }
            } else {
              // Top or bottom only - center horizontally
              newCrop.width = targetWidth;
              newCrop.x = Math.max(
                0,
                Math.min(
                  startCrop.x - (targetWidth - oldWidth) / 2,
                  1 - targetWidth
                )
              );
            }
          } else {
            // Horizontal resize - adjust height to maintain ratio
            const targetHeight =
              (newCrop.width * imageSize.width) /
              (aspectRatio * imageSize.height);

            // Check if new height fits
            if (handle.includes('t')) {
              // Anchor is on bottom, expand/shrink top
              const newTop = anchorY - targetHeight;
              if (newTop >= 0) {
                newCrop.height = targetHeight;
                newCrop.y = newTop;
              } else {
                // Hit top bound, constrain by height
                newCrop.y = 0;
                newCrop.height = anchorY;
                newCrop.width =
                  (newCrop.height * imageSize.height * aspectRatio) /
                  imageSize.width;
                if (handle.includes('l')) {
                  newCrop.x = anchorX - newCrop.width;
                }
              }
            } else if (handle.includes('b')) {
              // Anchor is on top, expand/shrink bottom
              if (anchorY + targetHeight <= 1) {
                newCrop.height = targetHeight;
              } else {
                // Hit bottom bound, constrain by height
                newCrop.height = 1 - anchorY;
                newCrop.width =
                  (newCrop.height * imageSize.height * aspectRatio) /
                  imageSize.width;
                if (handle.includes('l')) {
                  newCrop.x = anchorX - newCrop.width;
                }
              }
            } else {
              // Left or right only - center vertically
              newCrop.height = targetHeight;
              newCrop.y = Math.max(
                0,
                Math.min(
                  startCrop.y - (targetHeight - oldHeight) / 2,
                  1 - targetHeight
                )
              );
            }
          }
        }

        // Final bounds check
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
