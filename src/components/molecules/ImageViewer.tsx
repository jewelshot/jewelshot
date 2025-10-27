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
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Touchpad zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only zoom when Ctrl is pressed (trackpad pinch)
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        onScaleChange((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [onScaleChange]);

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center p-8"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full select-none object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: 'transform 400ms ease-in-out',
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
