'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  scale: number;
  position: { x: number; y: number };
  onScaleChange: (scale: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function ImageViewer({
  src,
  alt,
  scale,
  position,
  onScaleChange,
  onPositionChange,
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef<number | null>(null);
  const lastGestureScaleRef = useRef<number>(1);

  // Mouse drag
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastPositionRef.current.x;
      const deltaY = e.clientY - lastPositionRef.current.y;

      onPositionChange({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position, onPositionChange, isDragging]);

  // Wheel/Touchpad zoom and pan
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // macOS trackpad pinch sets ctrlKey
      // Windows Ctrl+Wheel also sets ctrlKey
      if (e.ctrlKey) {
        // Pinch to zoom (two-finger pinch on trackpad or Ctrl+Wheel)
        const delta = -e.deltaY * 0.01;
        const newScale = Math.max(0.1, Math.min(3.0, scale + delta));
        onScaleChange(newScale);
      } else {
        // Two-finger scroll: pan the image
        // Use smaller multiplier for smoother panning on trackpad
        onPositionChange({
          x: position.x - e.deltaX * 0.5,
          y: position.y - e.deltaY * 0.5,
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale, position, onScaleChange, onPositionChange]);

  // Touch events for mobile/trackpad pinch
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return null;
      const touch1 = touches[0];
      const touch2 = touches[1];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistanceRef.current = getTouchDistance(e.touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistanceRef.current) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        if (currentDistance) {
          const delta = (currentDistance - lastTouchDistanceRef.current) * 0.01;
          const newScale = Math.max(0.1, Math.min(3.0, scale + delta));
          onScaleChange(newScale);
          lastTouchDistanceRef.current = currentDistance;
        }
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistanceRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, onScaleChange]);

  // WebKit/Safari gesture events (for Safari trackpad pinch)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleGestureStart = (e: Event) => {
      e.preventDefault();
      lastGestureScaleRef.current = 1;
    };

    const handleGestureChange = (e: Event) => {
      e.preventDefault();
      const gestureScale = (e as unknown as { scale: number }).scale;
      const delta = gestureScale - lastGestureScaleRef.current;
      const newScale = Math.max(0.1, Math.min(3.0, scale + delta));
      onScaleChange(newScale);
      lastGestureScaleRef.current = gestureScale;
    };

    const handleGestureEnd = (e: Event) => {
      e.preventDefault();
      lastGestureScaleRef.current = 1;
    };

    // Add gesture events (Safari/WebKit)
    container.addEventListener('gesturestart', handleGestureStart);
    container.addEventListener('gesturechange', handleGestureChange);
    container.addEventListener('gestureend', handleGestureEnd);

    return () => {
      container.removeEventListener('gesturestart', handleGestureStart);
      container.removeEventListener('gesturechange', handleGestureChange);
      container.removeEventListener('gestureend', handleGestureEnd);
    };
  }, [scale, onScaleChange]);

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center p-8"
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full select-none object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 100ms ease-out',
          animation: 'scaleIn 700ms ease-in-out',
        }}
        draggable={false}
      />

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(${position.x}px, ${position.y}px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(${position.x}px, ${position.y}px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ImageViewer;
