'use client';

import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CanvasFallbackProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Fallback UI for Canvas errors
 * Appears when Canvas component crashes
 */
export function CanvasFallback({ error, resetError }: CanvasFallbackProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      <div className="max-w-lg space-y-6 rounded-xl border border-red-500/30 bg-red-950/10 p-8 text-center backdrop-blur-xl">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Canvas Error</h2>
          <p className="text-sm text-white/60">
            The image editor encountered an unexpected error. Your work is safe,
            but you&apos;ll need to restart the editor.
          </p>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="rounded-lg bg-black/50 p-4 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-red-300">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-red-200/80">
              {error.toString()}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (resetError) resetError();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-600/20 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-purple-500/60 hover:bg-purple-600/30"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={() => router.push('/')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/20"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>

        <p className="text-xs text-white/40">
          Tip: Try uploading a smaller image or clearing your browser cache
        </p>
      </div>
    </div>
  );
}

export default CanvasFallback;
