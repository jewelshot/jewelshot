'use client';

import React, { useRef, useEffect } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  scale: number;
  position: { x: number; y: number };
  onScaleChange: React.Dispatch<React.SetStateAction<number>>;
  onPositionChange: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
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

  // Mouse drag
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let dragging = false;
    const lastPos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      dragging = true;
      lastPos.x = e.clientX;
      lastPos.y = e.clientY;
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      const deltaX = e.clientX - lastPos.x;
      const deltaY = e.clientY - lastPos.y;

      onPositionChange({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      lastPos.x = e.clientX;
      lastPos.y = e.clientY;
    };

    const handleMouseUp = () => {
      dragging = false;
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
  }, [onPositionChange, position]);

  // Wheel/Touchpad zoom and pan
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        // Ctrl+Wheel = Zoom
        const delta = -e.deltaY * 0.01;
        onScaleChange((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
      } else {
        // Normal scroll = Pan
        onPositionChange((prev) => ({
          x: prev.x - e.deltaX * 0.5,
          y: prev.y - e.deltaY * 0.5,
        }));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [onScaleChange, onPositionChange]);

  // Touch pinch zoom (mobile/tablet)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastDistance: number | null = null;

    const getTouchDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastDistance = getTouchDistance(e.touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastDistance) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        const delta = (currentDistance - lastDistance) * 0.01;
        onScaleChange((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
        lastDistance = currentDistance;
      }
    };

    const handleTouchEnd = () => {
      lastDistance = null;
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
  }, [onScaleChange]);

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
          transition: 'transform 100ms ease-out',
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
