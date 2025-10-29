/**
 * Custom hook for professional film grain effect
 * Adds realistic film grain texture with adjustable size and intensity
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGrainOptions {
  /**
   * Original image source URL
   */
  originalSrc: string;

  /**
   * Grain amount (0 to 100)
   * Controls grain intensity/visibility
   */
  amount: number;

  /**
   * Grain size (0 to 100)
   * Controls grain particle size
   */
  size: number;

  /**
   * Enable/disable processing
   */
  enabled: boolean;
}

interface UseGrainResult {
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
 * Hook for applying professional film grain effect
 * Uses Perlin-like noise for realistic organic grain texture
 *
 * @param options - Configuration options
 * @returns Processed image result
 */
export function useGrain(options: UseGrainOptions): UseGrainResult {
  const { originalSrc, amount, size, enabled } = options;

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
    // Skip if disabled or no grain
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
        willReadFrequently: true,
      });

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      if (signal.aborted) return;

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Apply grain effect
      applyGrain(imageData, amount, size);

      if (signal.aborted) return;

      // Put processed data back to canvas
      ctx.putImageData(imageData, 0, 0);

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

      console.error('Grain error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProcessedSrc(originalSrc);
    } finally {
      setIsProcessing(false);
    }
  }, [originalSrc, amount, size, enabled, processedSrc]);

  // Effect: Process image with debounce
  useEffect(() => {
    // Early exit: If disabled, skip without timer (preserve current processedSrc)
    if (!enabled) {
      return;
    }

    // If value is 0, reset to original
    if (amount === 0) {
      setProcessedSrc(originalSrc);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce processing (400ms for smooth slider experience)
    debounceTimerRef.current = setTimeout(() => {
      processImage();
    }, 400);

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
 * Apply film grain effect to image data
 * Uses random noise with luminance-based opacity for realistic film grain
 *
 * @param imageData - Image data to process
 * @param amount - Grain intensity (0-100)
 * @param size - Grain particle size (0-100)
 */
function applyGrain(imageData: ImageData, amount: number, size: number): void {
  const { width, height, data } = imageData;

  // Normalize parameters
  const intensity = (amount / 100) * 0.3; // Max 30% grain opacity
  const grainSize = Math.max(1, Math.floor((size / 100) * 3) + 1); // 1-4px grain size

  // Generate grain texture (cached for performance)
  const grainData = generateGrainTexture(width, height, grainSize);

  // Apply grain with luminance-aware blending
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      // Get original pixel
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      // Calculate luminance (ITU-R BT.709)
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Luminance-based grain intensity
      // More grain in mid-tones, less in pure blacks/whites
      const luminanceNormalized = luminance / 255;
      const luminanceFactor = 1 - Math.abs(luminanceNormalized - 0.5) * 2; // Peak at 0.5
      const grainIntensity = intensity * (0.5 + luminanceFactor * 0.5); // 50-100% of base

      // Get grain value
      const grain = grainData[y * width + x];

      // Blend grain with original (overlay mode)
      data[index] = clamp(r + grain * grainIntensity);
      data[index + 1] = clamp(g + grain * grainIntensity);
      data[index + 2] = clamp(b + grain * grainIntensity);
      // Alpha unchanged
    }
  }
}

/**
 * Generate realistic grain texture
 * Uses pseudo-random noise with smoothing for organic look
 *
 * @param width - Texture width
 * @param height - Texture height
 * @param grainSize - Grain particle size
 * @returns Grain texture data (-127 to +127 range)
 */
function generateGrainTexture(
  width: number,
  height: number,
  grainSize: number
): Float32Array {
  const texture = new Float32Array(width * height);

  // Generate base random noise
  for (let i = 0; i < texture.length; i++) {
    // Random value from -127 to +127
    texture[i] = (Math.random() - 0.5) * 254;
  }

  // Apply simple box blur for grain size control
  // Larger grain = more blur passes
  if (grainSize > 1) {
    const blurPasses = grainSize - 1;
    for (let pass = 0; pass < blurPasses; pass++) {
      boxBlur(texture, width, height, 1);
    }
  }

  return texture;
}

/**
 * Simple box blur for grain smoothing
 *
 * @param data - Texture data
 * @param width - Texture width
 * @param height - Texture height
 * @param radius - Blur radius
 */
function boxBlur(
  data: Float32Array,
  width: number,
  height: number,
  radius: number
): void {
  const temp = new Float32Array(data.length);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let dx = -radius; dx <= radius; dx++) {
        const sampleX = Math.max(0, Math.min(width - 1, x + dx));
        sum += data[y * width + sampleX];
        count++;
      }

      temp[y * width + x] = sum / count;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        const sampleY = Math.max(0, Math.min(height - 1, y + dy));
        sum += temp[sampleY * width + x];
        count++;
      }

      data[y * width + x] = sum / count;
    }
  }
}

/**
 * Clamp value to valid pixel range (0-255)
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}
