/**
 * Multi-Scale Processing
 * Process image at multiple scales for natural clarity enhancement
 */

import { applyGaussianBlur } from '../sharpness/gaussianBlur';

/**
 * Multi-scale decomposition
 * Separates image into multiple frequency bands
 */
export interface ScaleLevel {
  /**
   * Scale index (0 = finest detail)
   */
  level: number;

  /**
   * Blur radius for this scale
   */
  radius: number;

  /**
   * Blurred image data at this scale
   */
  imageData: ImageData;

  /**
   * Detail layer (difference from next coarser scale)
   */
  detailLayer?: ImageData;
}

/**
 * Decompose image into multiple scales using Gaussian pyramid
 *
 * @param imageData - Original image
 * @param numScales - Number of scales to create (2-4 typical)
 * @param baseRadius - Base blur radius (typically 2-4)
 * @returns Array of scale levels
 */
export function decomposeMultiScale(
  imageData: ImageData,
  numScales: number = 3,
  baseRadius: number = 3
): ScaleLevel[] {
  const scales: ScaleLevel[] = [];

  // Scale 0: original image (no blur)
  scales.push({
    level: 0,
    radius: 0,
    imageData: cloneImageData(imageData),
  });

  // Create progressively blurred versions
  for (let i = 1; i < numScales; i++) {
    const radius = baseRadius * Math.pow(2, i - 1);
    const blurred = applyGaussianBlur(imageData, radius);

    scales.push({
      level: i,
      radius,
      imageData: blurred,
    });
  }

  // Calculate detail layers (difference between consecutive scales)
  for (let i = 0; i < scales.length - 1; i++) {
    scales[i].detailLayer = calculateDetailLayer(
      scales[i].imageData,
      scales[i + 1].imageData
    );
  }

  return scales;
}

/**
 * Calculate detail layer (high-pass filter)
 * Detail = Original - Blurred
 *
 * @param original - Original/finer scale
 * @param blurred - Blurred/coarser scale
 * @returns Detail layer
 */
function calculateDetailLayer(
  original: ImageData,
  blurred: ImageData
): ImageData {
  const { width, height, data: origData } = original;
  const blurData = blurred.data;
  const detail = new ImageData(width, height);
  const detailData = detail.data;

  for (let i = 0; i < origData.length; i += 4) {
    // Calculate difference (stored as offset from 128 for signed values)
    detailData[i] = 128 + (origData[i] - blurData[i]); // R
    detailData[i + 1] = 128 + (origData[i + 1] - blurData[i + 1]); // G
    detailData[i + 2] = 128 + (origData[i + 2] - blurData[i + 2]); // B
    detailData[i + 3] = origData[i + 3]; // A
  }

  return detail;
}

/**
 * Reconstruct image from scales with weighted detail layers
 *
 * @param scales - Multi-scale decomposition
 * @param weights - Weight for each detail layer (0 = no change, >1 = enhance)
 * @returns Reconstructed image
 */
export function reconstructFromScales(
  scales: ScaleLevel[],
  weights: number[]
): ImageData {
  if (scales.length === 0) {
    throw new Error('No scales provided');
  }

  // Start with coarsest scale (most blurred)
  const coarsestScale = scales[scales.length - 1];
  const { width, height } = coarsestScale.imageData;
  const result = cloneImageData(coarsestScale.imageData);
  const resultData = result.data;

  // Add weighted detail layers from coarse to fine
  for (let i = scales.length - 2; i >= 0; i--) {
    const detailLayer = scales[i].detailLayer;
    if (!detailLayer) continue;

    const weight = weights[i] || 1.0;
    const detailData = detailLayer.data;

    for (let j = 0; j < resultData.length; j += 4) {
      // Add weighted detail (remember: detail is offset by 128)
      resultData[j] = clamp(
        resultData[j] + (detailData[j] - 128) * weight,
        0,
        255
      );
      resultData[j + 1] = clamp(
        resultData[j + 1] + (detailData[j + 1] - 128) * weight,
        0,
        255
      );
      resultData[j + 2] = clamp(
        resultData[j + 2] + (detailData[j + 2] - 128) * weight,
        0,
        255
      );
    }
  }

  return result;
}

/**
 * Apply clarity using multi-scale processing
 * Enhances mid-tone contrast at multiple scales
 *
 * @param imageData - Original image
 * @param clarityAmount - Clarity strength (0-1, where 1 = 100%)
 * @param numScales - Number of scales (2-4)
 * @returns Enhanced image
 */
export function applyMultiScaleClarity(
  imageData: ImageData,
  clarityAmount: number,
  numScales: number = 3
): ImageData {
  // Decompose into multiple scales
  const scales = decomposeMultiScale(imageData, numScales, 3);

  // Calculate weights for each scale
  // Fine details get more weight, coarse details less
  const weights: number[] = [];
  for (let i = 0; i < scales.length - 1; i++) {
    // Progressive weighting: fine (1.0) → medium (0.7) → coarse (0.4)
    const baseWeight = 1.0 - (i / (scales.length - 1)) * 0.6;
    weights[i] = 1.0 + clarityAmount * baseWeight * 0.8;
  }

  // Reconstruct with enhanced details
  return reconstructFromScales(scales, weights);
}

/**
 * Clone ImageData
 */
function cloneImageData(imageData: ImageData): ImageData {
  const { width, height } = imageData;
  const clone = new ImageData(width, height);
  clone.data.set(imageData.data);
  return clone;
}

/**
 * Clamp value to range
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate optimal scale parameters for clarity
 *
 * @param clarityAmount - Clarity adjustment (-100 to +100)
 * @returns Scale parameters
 */
export function calculateScaleParams(clarityAmount: number): {
  numScales: number;
  baseRadius: number;
} {
  const absClarityAmount = Math.abs(clarityAmount);

  if (absClarityAmount < 30) {
    // Subtle: 2 scales, small radius
    return { numScales: 2, baseRadius: 2 };
  } else if (absClarityAmount < 60) {
    // Moderate: 3 scales, medium radius
    return { numScales: 3, baseRadius: 3 };
  } else {
    // Strong: 3 scales, larger radius
    return { numScales: 3, baseRadius: 4 };
  }
}
