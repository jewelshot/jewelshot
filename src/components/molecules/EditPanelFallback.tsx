'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface EditPanelFallbackProps {
  error?: Error;
  onClose?: () => void;
}

/**
 * Fallback UI for EditPanel errors
 * Appears inline when EditPanel crashes
 */
export function EditPanelFallback({ error, onClose }: EditPanelFallbackProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-yellow-500/30 bg-yellow-950/10 p-6 text-center backdrop-blur-xl">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
          <AlertCircle className="h-6 w-6 text-yellow-400" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Edit Panel Error</h3>
          <p className="text-xs text-white/60">
            The edit panel encountered an error. Close and try again.
          </p>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="rounded-lg bg-black/50 p-3 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-yellow-300">
              Error Details
            </summary>
            <pre className="mt-2 overflow-auto text-[10px] text-yellow-200/80">
              {error.toString()}
            </pre>
          </details>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
            Close Panel
          </button>
        )}
      </div>
    </div>
  );
}

export default EditPanelFallback;
