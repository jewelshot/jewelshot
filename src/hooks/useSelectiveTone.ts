/**
 * Custom hook for professional selective tone adjustment
 * Applies highlights and shadows adjustments with color preservation
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  applyDualSelectiveTone,
  calculateOptimalFeather,
} from '@/utils/toneMapping';

interface UseSelectiveToneOptions {
  /**
   * Original image source URL
   */
  originalSrc: string;

  /**
   * Highlight adjustment (-100 to +100)
   */
  highlights: number;

  /**
   * Shadow adjustment (-100 to +100)
   */
  shadows: number;

  /**
   * Enable/disable processing
   */
  enabled: boolean;
}

interface UseSelectiveToneResult {
  /**
   * Processed image source (original if no adjustment)
   */
  processedSrc: string;

  /**
   * Whether processing is in progress
   */
  isProcessing: boolean;

  /**
   * Error message if processing failed
   */
  error: string | null;
}

/**
 * Hook for applying professional highlights and shadows adjustments
 * Uses luminance-based selective tone mapping with color preservation
 *
 * @param options - Configuration options
 * @returns Processed image result
 */
export function useSelectiveTone(
  options: UseSelectiveToneOptions
): UseSelectiveToneResult {
  const { originalSrc, highlights, shadows, enabled } = options;

  const [processedSrc, setProcessedSrc] = useState<string>(originalSrc);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Processing indicator delay timer
  const processingIndicatorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processImage = useCallback(async () => {
    // Skip if disabled or no adjustment
    if (!enabled || (highlights === 0 && shadows === 0)) {
      setProcessedSrc(originalSrc);
      return;
    }

    // Abort previous processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear any pending processing indicator timer
    if (processingIndicatorTimerRef.current) {
      clearTimeout(processingIndicatorTimerRef.current);
      processingIndicatorTimerRef.current = null;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setError(null);

      // Start timer to show processing indicator after 200ms
      processingIndicatorTimerRef.current = setTimeout(() => {
        setIsProcessing(true);
      }, 200);

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      imgRef.current = img;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = originalSrc;

        if (signal.aborted) {
          reject(new Error('Processing aborted'));
        }
      });

      if (signal.aborted) return;

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvasRef.current = canvas;

      const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
      });

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (signal.aborted) return;

      // Calculate optimal feather based on adjustment strength
      const maxAdjustment = Math.max(Math.abs(highlights), Math.abs(shadows));
      const feather = calculateOptimalFeather(maxAdjustment);

      // Apply dual selective tone adjustment
      const processed = applyDualSelectiveTone(
        imageData,
        highlights,
        shadows,
        feather
      );

      if (signal.aborted) return;

      // Put processed data back to canvas
      ctx.putImageData(processed, 0, 0);

      // Convert to blob and create object URL
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (!blob) {
        throw new Error('Failed to create blob');
      }

      if (signal.aborted) {
        URL.revokeObjectURL(URL.createObjectURL(blob));
        return;
      }

      const url = URL.createObjectURL(blob);

      // Cleanup previous URL
      if (processedSrc !== originalSrc) {
        URL.revokeObjectURL(processedSrc);
      }

      setProcessedSrc(url);
    } catch (err) {
      if (err instanceof Error && err.message === 'Processing aborted') {
        return;
      }

      console.error('Selective tone adjustment error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProcessedSrc(originalSrc);
    } finally {
      // Clear processing indicator timer and hide indicator
      if (processingIndicatorTimerRef.current) {
        clearTimeout(processingIndicatorTimerRef.current);
        processingIndicatorTimerRef.current = null;
      }
      setIsProcessing(false);
    }
  }, [originalSrc, highlights, shadows, enabled, processedSrc]);

  // Effect: Process image with debounce
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce processing (500ms)
    debounceTimerRef.current = setTimeout(() => {
      processImage();
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [processImage]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Abort ongoing processing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (processingIndicatorTimerRef.current) {
        clearTimeout(processingIndicatorTimerRef.current);
      }

      // Revoke object URL
      if (processedSrc !== originalSrc) {
        URL.revokeObjectURL(processedSrc);
      }

      // Cleanup refs
      canvasRef.current = null;
      imgRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    processedSrc,
    isProcessing,
    error,
  };
}
