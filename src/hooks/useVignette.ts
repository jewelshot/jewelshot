/**
 * Custom hook for professional vignette effect
 * Applies radial gradient darkening or lightening from center to edges
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVignetteOptions {
  /**
   * Original image source URL
   */
  originalSrc: string;

  /**
   * Vignette amount (-100 to +100)
   * Negative: White vignette (brighten edges), Positive: Black vignette (darken edges)
   */
  amount: number;

  /**
   * Vignette size (0 to 100)
   * Controls how far from center the vignette extends
   */
  size: number;

  /**
   * Vignette feather/softness (0 to 100)
   * Controls edge blur/falloff
   */
  feather: number;

  /**
   * Enable/disable processing
   */
  enabled: boolean;
}

interface UseVignetteResult {
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
 * Hook for applying professional vignette effect
 * Uses radial gradient masking with adjustable size and feather
 *
 * @param options - Configuration options
 * @returns Processed image result
 */
export function useVignette(options: UseVignetteOptions): UseVignetteResult {
  const { originalSrc, amount, size, feather, enabled } = options;

  const [processedSrc, setProcessedSrc] = useState<string>(originalSrc);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processImage = useCallback(async () => {
    // Skip if disabled or no vignette
    if (!enabled || amount === 0) {
      setProcessedSrc(originalSrc);
      return;
    }

    // Abort previous processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setError(null);
      setIsProcessing(true);

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
        willReadFrequently: false,
      });

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      if (signal.aborted) return;

      // Apply vignette effect
      applyVignette(ctx, img.width, img.height, amount, size, feather);

      if (signal.aborted) return;

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

      console.error('Vignette error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProcessedSrc(originalSrc);
    } finally {
      setIsProcessing(false);
    }
  }, [originalSrc, amount, size, feather, enabled, processedSrc]);

  // Effect: Process image with debounce
  useEffect(() => {
    // Early exit: If disabled, instantly skip without timer
    if (!enabled || amount === 0) {
      setProcessedSrc(originalSrc);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce processing (300ms for smooth slider experience)
    debounceTimerRef.current = setTimeout(() => {
      processImage();
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [processImage, enabled, amount, originalSrc, setProcessedSrc]);

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

/**
 * Apply vignette effect using radial gradient
 *
 * @param ctx - Canvas 2D context
 * @param width - Image width
 * @param height - Image height
 * @param amount - Vignette amount (-100 to +100)
 * @param size - Vignette size (0 to 100)
 * @param feather - Edge softness (0 to 100)
 */
function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  size: number,
  feather: number
): void {
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate radius based on image diagonal
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

  // Size: 0 = small vignette (starts close to center), 100 = large (starts far from center)
  // Convert to inner radius (where vignette starts)
  const sizeNormalized = size / 100; // 0 to 1
  const innerRadius = maxRadius * (0.2 + sizeNormalized * 0.6); // 20% to 80% of max

  // Feather: Controls gradient spread
  // 0 = hard edge, 100 = very soft/gradual
  const featherNormalized = feather / 100; // 0 to 1
  const outerRadius = maxRadius * (0.8 + featherNormalized * 0.2); // Always reaches edges

  // Create radial gradient
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    innerRadius,
    centerX,
    centerY,
    outerRadius
  );

  // Normalize amount
  const intensity = Math.abs(amount) / 100; // 0 to 1
  const isDark = amount > 0;

  if (isDark) {
    // Black vignette (darken edges)
    // Center: transparent, Edges: black
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.9})`); // Max 90% opacity
  } else {
    // White vignette (brighten edges)
    // Center: transparent, Edges: white
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${intensity * 0.7})`); // Max 70% opacity
  }

  // Apply gradient with multiply/screen blend mode
  ctx.globalCompositeOperation = isDark ? 'multiply' : 'screen';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
}
