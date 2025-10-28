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
        // Simplified resize with proper aspect ratio handling
        const handle = dragData.current.handle;
        const startCrop = dragData.current.startCrop;
        let newCrop = { ...startCrop };

        // Determine anchor point (opposite corner/edge that stays fixed)
        const anchorX = handle.includes('l')
          ? startCrop.x + startCrop.width
          : startCrop.x;
        const anchorY = handle.includes('t')
          ? startCrop.y + startCrop.height
          : startCrop.y;

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

        // Ensure minimum size
        if (newWidth < 0.05) {
          newWidth = 0.05;
          if (handle.includes('l')) newX = anchorX - 0.05;
        }
        if (newHeight < 0.05) {
          newHeight = 0.05;
          if (handle.includes('t')) newY = anchorY - 0.05;
        }

        // Apply aspect ratio if needed
        if (aspectRatio) {
          const currentPixelWidth = newWidth * imageSize.width;
          const currentPixelHeight = newHeight * imageSize.height;
          const currentRatio = currentPixelWidth / currentPixelHeight;

          // Determine which dimension to base the resize on
          const resizingWidth = handle === 'l' || handle === 'r';
          const resizingHeight = handle === 't' || handle === 'b';

          if (resizingHeight && !resizingWidth) {
            // Only height is changing - calculate width
            newWidth =
              (newHeight * imageSize.height * aspectRatio) / imageSize.width;

            // Adjust position to keep anchor point
            if (handle.includes('l')) {
              newX = anchorX - newWidth;
            } else if (handle.includes('r')) {
              newX = anchorX;
            } else {
              // Center horizontally
              newX = anchorX - newWidth / 2;
            }
          } else if (resizingWidth && !resizingHeight) {
            // Only width is changing - calculate height
            newHeight =
              (newWidth * imageSize.width) / (aspectRatio * imageSize.height);

            // Adjust position to keep anchor point
            if (handle.includes('t')) {
              newY = anchorY - newHeight;
            } else if (handle.includes('b')) {
              newY = anchorY;
            } else {
              // Center vertically
              newY = anchorY - newHeight / 2;
            }
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
            if (handle.includes('t')) {
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
            if (handle.includes('l')) {
              newX = anchorX - newWidth;
            }
          }
        }
        if (newX + newWidth > 1) {
          newWidth = 1 - newX;
          if (aspectRatio) {
            newHeight =
              (newWidth * imageSize.width) / (aspectRatio * imageSize.height);
            if (handle.includes('t')) {
              newY = anchorY - newHeight;
            }
          }
        }
        if (newY + newHeight > 1) {
          newHeight = 1 - newY;
          if (aspectRatio) {
            newWidth =
              (newHeight * imageSize.height * aspectRatio) / imageSize.width;
            if (handle.includes('l')) {
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
