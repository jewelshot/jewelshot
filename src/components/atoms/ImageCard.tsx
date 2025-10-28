'use client';

import React, { useState } from 'react';

interface ImageCardProps {
  id: string;
  src: string;
  alt?: string;
  createdAt?: Date;
  onOpenInStudio?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export function ImageCard({
  id,
  src,
  alt = 'Gallery image',
  createdAt,
  onOpenInStudio,
  onDownload,
  onDelete,
}: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-lg bg-[rgba(10,10,10,0.8)] ring-1 ring-[rgba(139,92,246,0.2)] transition-all duration-300 hover:ring-2 hover:ring-[rgba(139,92,246,0.4)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg
            className="h-12 w-12 text-[rgba(196,181,253,0.3)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Overlay with Actions */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Open in Studio Button */}
        {onOpenInStudio && (
          <button
            onClick={onOpenInStudio}
            className="flex items-center gap-2 rounded-lg bg-[rgba(139,92,246,0.9)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[rgba(139,92,246,1)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Open in Studio
          </button>
        )}

        {/* Secondary Actions */}
        <div className="flex gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg bg-[rgba(255,255,255,0.1)] p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-[rgba(255,255,255,0.2)]"
              title="Download"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-[rgba(239,68,68,0.1)] p-2 text-red-400 transition-all duration-200 hover:scale-110 hover:bg-[rgba(239,68,68,0.2)]"
              title="Delete"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Date Badge */}
      {createdAt && (
        <div
          className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm"
          suppressHydrationWarning
        >
          {createdAt.toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default ImageCard;
