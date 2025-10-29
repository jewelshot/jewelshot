'use client';

import React from 'react';
import { ImageOff, RefreshCw, Trash2 } from 'lucide-react';

interface GalleryFallbackProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Fallback UI for Gallery errors
 * Appears when Gallery component crashes
 */
export function GalleryFallback({ error, resetError }: GalleryFallbackProps) {
  const handleClearStorage = () => {
    if (
      confirm(
        'This will clear all saved images. Are you sure?\n\nThis might fix the error.'
      )
    ) {
      localStorage.removeItem('jewelshot_gallery_images');
      if (resetError) resetError();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="max-w-md space-y-6 rounded-xl border border-orange-500/30 bg-orange-950/10 p-8 text-center backdrop-blur-xl">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
          <ImageOff className="h-10 w-10 text-orange-400" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Gallery Error</h2>
          <p className="text-sm text-white/60">
            Failed to load your saved images. This might be due to corrupted
            data in storage.
          </p>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="rounded-lg bg-black/50 p-4 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-orange-300">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-orange-200/80">
              {error.toString()}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              if (resetError) resetError();
              window.location.reload();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-600/20 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-purple-500/60 hover:bg-purple-600/30"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Gallery
          </button>

          <button
            onClick={handleClearStorage}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-600/20 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-red-500/60 hover:bg-red-600/30"
          >
            <Trash2 className="h-4 w-4" />
            Clear Storage & Reset
          </button>
        </div>

        <p className="text-xs text-white/40">
          Note: Clearing storage will delete all saved images
        </p>
      </div>
    </div>
  );
}

export default GalleryFallback;
