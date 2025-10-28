/**
 * Unsharp Mask Algorithm
 * Professional-grade sharpening (Photoshop-quality)
 *
 * Algorithm:
 * 1. Create blurred version of original
 * 2. Subtract blurred from original to get edge mask
 * 3. Add weighted edge mask back to original
 *
 * Parameters match Photoshop's Unsharp Mask filter:
 * - Amount: Strength of sharpening (0-500%)
 * - Radius: Size of edge detection (0.1-250 pixels)
 * - Threshold: Minimum tonal change to sharpen (0-255)
 */

import { applyGaussianBlur } from './gaussianBlur';

export interface UnsharpMaskParams {
  amount: number; // 0-500 (percentage)
  radius: number; // 0.1-250 (pixels)
  threshold: number; // 0-255 (levels)
}

/**
 * Apply Unsharp Mask sharpening (Photoshop-quality)
 *
 * @param imageData - Original image data
 * @param params - Unsharp mask parameters
 * @returns Sharpened image data
 */
export function applyUnsharpMask(
  imageData: ImageData,
  params: UnsharpMaskParams
): ImageData {
  const { width, height, data } = imageData;
  const { amount, radius, threshold } = params;

  // Validate parameters
  const clampedAmount = Math.max(0, Math.min(500, amount)) / 100; // Convert to multiplier
  const clampedRadius = Math.max(0.1, Math.min(250, radius));
  const clampedThreshold = Math.max(0, Math.min(255, threshold));

  // Step 1: Create blurred version
  const blurred = applyGaussianBlur(imageData, clampedRadius);

  // Step 2 & 3: Calculate edge mask and apply sharpening
  const output = new ImageData(width, height);
  const outputData = output.data;

  for (let i = 0; i < data.length; i += 4) {
    // Process RGB channels
    for (let channel = 0; channel < 3; channel++) {
      const originalValue = data[i + channel];
      const blurredValue = blurred.data[i + channel];

      // Calculate edge mask (difference between original and blurred)
      const edgeMask = originalValue - blurredValue;

      // Apply threshold: only sharpen if difference exceeds threshold
      if (Math.abs(edgeMask) >= clampedThreshold) {
        // Add weighted edge mask back to original
        const sharpenedValue = originalValue + edgeMask * clampedAmount;

        // Clamp to valid range
        outputData[i + channel] = Math.max(0, Math.min(255, sharpenedValue));
      } else {
        // Below threshold: keep original
        outputData[i + channel] = originalValue;
      }
    }

    // Preserve alpha channel
    outputData[i + 3] = data[i + 3];
  }

  return output;
}

/**
 * Convert sharpness slider value (-100 to +100) to Unsharp Mask parameters
 * Mimics professional photo editing software behavior
 *
 * @param sharpness - Slider value (-100 to +100)
 * @returns Unsharp mask parameters
 */
export function sharpnessToUnsharpMask(sharpness: number): UnsharpMaskParams {
  const normalized = Math.max(-100, Math.min(100, sharpness)) / 100;

  if (normalized === 0) {
    // No sharpening
    return { amount: 0, radius: 0, threshold: 0 };
  } else if (normalized > 0) {
    // POSITIVE: Sharpen
    // Progressive sharpening: start subtle, get aggressive

    // Amount: 0 → 150% (light), 150% (moderate), 300% (strong)
    // At +33: 150%, At +66: 225%, At +100: 300%
    const amount = Math.pow(normalized, 0.8) * 300;

    // Radius: Start at 1.0px (detail), go to 2.5px (strong edges)
    // At +50: 1.5px, At +100: 2.5px
    const radius = 1.0 + normalized * 1.5;

    // Threshold: Start at 0 (sharpen everything), increase slightly to prevent noise
    // At +50: 2, At +100: 5
    const threshold = Math.min(5, normalized * 5);

    return { amount, radius, threshold };
  } else {
    // NEGATIVE: Blur (inverse sharpening)
    // For blur, we return negative amount to signal blur should be applied
    const absNormalized = Math.abs(normalized);

    // Return special blur parameters
    return {
      amount: -1, // Signal for blur
      radius: absNormalized * 10, // 0-10px blur
      threshold: 0,
    };
  }
}

/**
 * High-performance sharpening for preview
 * Uses simplified algorithm for real-time feedback
 *
 * @param imageData - Original image data
 * @param strength - Sharpening strength (0-1)
 * @returns Sharpened image data
 */
export function applyFastSharpen(
  imageData: ImageData,
  strength: number
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Simple 3x3 sharpening kernel
  const weight = strength * 0.5;
  const center = 1 + weight * 4;

  // Sharpening kernel:
  // [ 0,        -weight,  0       ]
  // [-weight,   center,  -weight  ]
  // [ 0,        -weight,  0       ]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4;

      for (let channel = 0; channel < 3; channel++) {
        const centerValue = data[index + channel];
        const top = data[((y - 1) * width + x) * 4 + channel];
        const bottom = data[((y + 1) * width + x) * 4 + channel];
        const left = data[(y * width + (x - 1)) * 4 + channel];
        const right = data[(y * width + (x + 1)) * 4 + channel];

        const sharpened =
          centerValue * center - (top + bottom + left + right) * weight;

        outputData[index + channel] = Math.max(0, Math.min(255, sharpened));
      }

      outputData[index + 3] = data[index + 3];
    }
  }

  // Copy edges (no sharpening)
  for (let x = 0; x < width; x++) {
    const topIndex = x * 4;
    const bottomIndex = ((height - 1) * width + x) * 4;
    for (let c = 0; c < 4; c++) {
      outputData[topIndex + c] = data[topIndex + c];
      outputData[bottomIndex + c] = data[bottomIndex + c];
    }
  }
  for (let y = 0; y < height; y++) {
    const leftIndex = y * width * 4;
    const rightIndex = (y * width + width - 1) * 4;
    for (let c = 0; c < 4; c++) {
      outputData[leftIndex + c] = data[leftIndex + c];
      outputData[rightIndex + c] = data[rightIndex + c];
    }
  }

  return output;
}
