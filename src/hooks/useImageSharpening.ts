/**
 * Custom hook for professional image sharpening
 * Applies Photoshop-quality Unsharp Mask algorithm
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  applyUnsharpMask,
  applyGaussianBlur,
  sharpnessToUnsharpMask,
} from '@/utils/sharpness';

interface UseImageSharpeningOptions {
  /**
   * Original image source URL
   */
  originalSrc: string;

  /**
   * Sharpness value (-100 to +100)
   * Negative values apply blur
   * Positive values apply sharpening
   */
  sharpness: number;

  /**
   * Enable/disable sharpening processing
   */
  enabled: boolean;
}

interface UseImageSharpeningResult {
  /**
   * Processed image source (original if sharpness is 0 or disabled)
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
 * Hook for applying professional sharpening to images
 * Uses Unsharp Mask algorithm (Photoshop-quality)
 *
 * @param options - Configuration options
 * @returns Processed image result
 */
export function useImageSharpening(
  options: UseImageSharpeningOptions
): UseImageSharpeningResult {
  const { originalSrc, sharpness, enabled } = options;

  const [processedSrc, setProcessedSrc] = useState<string>(originalSrc);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Processing indicator delay timer (only show if processing takes > 200ms)
  const processingIndicatorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processImage = useCallback(async () => {
    // Skip if disabled or sharpness is 0
    if (!enabled || sharpness === 0) {
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
      // This prevents flash for fast operations
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

        // Check for abort
        if (signal.aborted) {
          reject(new Error('Processing aborted'));
        }
      });

      // Check for abort after load
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

      // Check for abort before processing
      if (signal.aborted) return;

      // Apply sharpening or blur
      let processed: ImageData;

      if (sharpness > 0) {
        // SHARPEN: Apply Unsharp Mask
        const params = sharpnessToUnsharpMask(sharpness);
        processed = applyUnsharpMask(imageData, params);
      } else {
        // BLUR: Apply Gaussian Blur
        const blurRadius = Math.abs(sharpness) / 10; // 0-10px
        processed = applyGaussianBlur(imageData, blurRadius);
      }

      // Check for abort after processing
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

      // Check for abort before setting result
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
        // Silently ignore abort errors
        return;
      }

      console.error('Image sharpening error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProcessedSrc(originalSrc); // Fallback to original
    } finally {
      // Clear processing indicator timer and hide indicator
      if (processingIndicatorTimerRef.current) {
        clearTimeout(processingIndicatorTimerRef.current);
        processingIndicatorTimerRef.current = null;
      }
      setIsProcessing(false);
    }
  }, [originalSrc, sharpness, enabled, processedSrc]);

  // Effect: Process image with debounce
  useEffect(() => {
    // Early exit: If disabled, instantly skip without timer
    if (!enabled || sharpness === 0) {
      setProcessedSrc(originalSrc);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce processing (500ms for smoother slider experience)
    debounceTimerRef.current = setTimeout(() => {
      processImage();
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [processImage, enabled, sharpness, originalSrc, setProcessedSrc]);

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
