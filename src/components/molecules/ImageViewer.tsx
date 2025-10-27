import React from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  scale: number;
}

export function ImageViewer({ src, alt, scale }: ImageViewerProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 400ms ease-in-out',
          animation: 'scaleIn 700ms ease-in-out',
        }}
      />
    </div>
  );
}

export default ImageViewer;
