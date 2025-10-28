'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  scale: number;
  position: { x: number; y: number };
  onScaleChange: React.Dispatch<React.SetStateAction<number>>;
  onPositionChange: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  transform?: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
}

export function ImageViewer({
  src,
  alt,
  scale,
  position,
  onScaleChange,
  onPositionChange,
  transform = { rotation: 0, flipHorizontal: false, flipVertical: false },
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Mouse drag
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      onPositionChange({
        x: e.clientX - startPosRef.current.x,
        y: e.clientY - startPosRef.current.y,
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position, onPositionChange]);

  // Scroll/Touchpad zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      onScaleChange((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [onScaleChange]);

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center p-8"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full select-none object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${transform.rotation}deg) scaleX(${transform.flipHorizontal ? -1 : 1}) scaleY(${transform.flipVertical ? -1 : 1})`,
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
