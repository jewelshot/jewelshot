/**
 * Clarity Enhancement Algorithm
 * Professional local contrast enhancement with halo prevention
 *
 * Clarity increases mid-tone contrast to make images appear sharper
 * and more detailed without over-sharpening edges (which causes halos).
 */

import {
  applyBilateralFilter,
  calculateBilateralParams,
} from './bilateralFilter';
import { applyMultiScaleClarity, calculateScaleParams } from './multiScale';
import { applyGaussianBlur } from '../sharpness/gaussianBlur';

export interface ClarityParams {
  /**
   * Clarity amount (-100 to +100)
   * Positive: enhance clarity, Negative: soften
   */
  amount: number;

  /**
   * Processing method
   * - 'fast': Single-scale with bilateral filter (real-time preview)
   * - 'high': Multi-scale processing (final quality)
   */
  quality?: 'fast' | 'high';

  /**
   * Halo suppression strength (0-1)
   * Higher = more aggressive halo prevention
   */
  haloSuppression?: number;
}

/**
 * Apply professional clarity enhancement
 * Uses bilateral filtering and multi-scale processing
 *
 * @param imageData - Original image data
 * @param params - Clarity parameters
 * @returns Enhanced image data
 */
export function applyClarity(
  imageData: ImageData,
  params: ClarityParams
): ImageData {
  const { amount, quality = 'high', haloSuppression = 0.7 } = params;

  // Validate and clamp amount
  const clampedAmount = Math.max(-100, Math.min(100, amount));

  // Skip if no adjustment
  if (clampedAmount === 0) {
    return imageData;
  }

  // Normalize amount to -1 to +1
  const normalizedAmount = clampedAmount / 100;

  if (normalizedAmount < 0) {
    // NEGATIVE: Soften (reduce local contrast)
    return applySoftening(imageData, Math.abs(normalizedAmount));
  } else {
    // POSITIVE: Enhance (increase local contrast)
    if (quality === 'fast') {
      return applyFastClarity(imageData, normalizedAmount, haloSuppression);
    } else {
      return applyHighQualityClarity(
        imageData,
        normalizedAmount,
        haloSuppression
      );
    }
  }
}

/**
 * Fast clarity enhancement
 * Single-scale processing with Gaussian blur (much faster than bilateral)
 * Suitable for real-time preview
 */
function applyFastClarity(
  imageData: ImageData,
  amount: number,
  haloSuppression: number
): ImageData {
  const { width, height, data } = imageData;

  // Use simple Gaussian blur instead of bilateral for speed
  const blurRadius = 3 + Math.abs(amount) * 2; // 3-5px
  const blurred = applyGaussianBlur(imageData, blurRadius);
  const blurData = blurred.data;

  // Create output
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Enhance local contrast using unsharp mask approach
  // Enhanced = Original + (Original - Blurred) * Strength
  const strength = amount * 1.2; // Moderate effect for natural look

  for (let i = 0; i < data.length; i += 4) {
    // Calculate detail (high-pass)
    const detailR = data[i] - blurData[i];
    const detailG = data[i + 1] - blurData[i + 1];
    const detailB = data[i + 2] - blurData[i + 2];

    // Apply halo suppression (reduce extreme details)
    const haloFactor = calculateHaloSuppression(
      detailR,
      detailG,
      detailB,
      haloSuppression
    );

    // Add weighted detail back
    outputData[i] = clamp(data[i] + detailR * strength * haloFactor, 0, 255);
    outputData[i + 1] = clamp(
      data[i + 1] + detailG * strength * haloFactor,
      0,
      255
    );
    outputData[i + 2] = clamp(
      data[i + 2] + detailB * strength * haloFactor,
      0,
      255
    );
    outputData[i + 3] = data[i + 3]; // Preserve alpha
  }

  return output;
}

/**
 * High-quality clarity enhancement
 * Simplified multi-scale processing for better performance
 */
function applyHighQualityClarity(
  imageData: ImageData,
  amount: number,
  haloSuppression: number
): ImageData {
  // Use only 2 scales instead of 3 for speed
  const enhanced = applyMultiScaleClarity(imageData, amount, 2);

  // Apply light halo suppression as post-process
  if (haloSuppression > 0.5) {
    return applyHaloSuppression(imageData, enhanced, haloSuppression * 0.7);
  }

  return enhanced;
}

/**
 * Soften image (negative clarity)
 * Reduces local contrast for dreamy, soft look
 */
function applySoftening(imageData: ImageData, amount: number): ImageData {
  const { width, height, data } = imageData;

  // Use Gaussian blur for softening (much faster than bilateral)
  const blurRadius = 4 + amount * 6; // 4-10px
  const softened = applyGaussianBlur(imageData, blurRadius);
  const softenedData = softened.data;

  // Blend original with softened
  const output = new ImageData(width, height);
  const outputData = output.data;

  const blendFactor = amount * 0.7; // Max 70% blend

  for (let i = 0; i < data.length; i += 4) {
    outputData[i] = data[i] * (1 - blendFactor) + softenedData[i] * blendFactor;
    outputData[i + 1] =
      data[i + 1] * (1 - blendFactor) + softenedData[i + 1] * blendFactor;
    outputData[i + 2] =
      data[i + 2] * (1 - blendFactor) + softenedData[i + 2] * blendFactor;
    outputData[i + 3] = data[i + 3]; // Preserve alpha
  }

  return output;
}

/**
 * Calculate halo suppression factor for a pixel
 * Reduces enhancement for extreme detail values
 */
function calculateHaloSuppression(
  detailR: number,
  detailG: number,
  detailB: number,
  suppressionStrength: number
): number {
  // Calculate detail magnitude
  const magnitude = Math.sqrt(
    detailR * detailR + detailG * detailG + detailB * detailB
  );

  // Threshold for halo detection (strong edges)
  const haloThreshold = 50;

  if (magnitude > haloThreshold) {
    // Strong edge: apply suppression
    const excess = magnitude - haloThreshold;
    const suppressionFactor = Math.exp(
      -(excess * excess * suppressionStrength) / 5000
    );
    return 0.5 + suppressionFactor * 0.5; // 0.5 to 1.0
  }

  // Normal detail: no suppression
  return 1.0;
}

/**
 * Apply halo suppression as post-process
 * Compares original and enhanced images to detect and reduce halos
 */
function applyHaloSuppression(
  original: ImageData,
  enhanced: ImageData,
  suppressionStrength: number
): ImageData {
  const { width, height, data: origData } = original;
  const enhancedData = enhanced.data;
  const output = new ImageData(width, height);
  const outputData = output.data;

  for (let i = 0; i < origData.length; i += 4) {
    // Calculate change magnitude
    const deltaR = enhancedData[i] - origData[i];
    const deltaG = enhancedData[i + 1] - origData[i + 1];
    const deltaB = enhancedData[i + 2] - origData[i + 2];

    const changeMagnitude = Math.sqrt(
      deltaR * deltaR + deltaG * deltaG + deltaB * deltaB
    );

    // Calculate suppression factor
    const suppressionFactor = calculateHaloSuppression(
      deltaR,
      deltaG,
      deltaB,
      suppressionStrength
    );

    // Blend original and enhanced based on suppression
    outputData[i] = origData[i] + deltaR * suppressionFactor;
    outputData[i + 1] = origData[i + 1] + deltaG * suppressionFactor;
    outputData[i + 2] = origData[i + 2] + deltaB * suppressionFactor;
    outputData[i + 3] = origData[i + 3]; // Preserve alpha
  }

  return output;
}

/**
 * Clamp value to range
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Convert clarity slider value to optimal parameters
 *
 * @param clarityValue - Slider value (-100 to +100)
 * @param useHighQuality - Use high-quality processing
 * @returns Optimal clarity parameters
 */
export function clarityValueToParams(
  clarityValue: number,
  useHighQuality: boolean = true
): ClarityParams {
  const absValue = Math.abs(clarityValue);

  // Adaptive halo suppression: stronger for higher values
  let haloSuppression = 0.6;
  if (absValue > 60) {
    haloSuppression = 0.8;
  } else if (absValue < 30) {
    haloSuppression = 0.4;
  }

  return {
    amount: clarityValue,
    quality: useHighQuality ? 'high' : 'fast',
    haloSuppression,
  };
}
