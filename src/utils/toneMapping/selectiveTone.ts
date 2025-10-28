/**
 * Selective Tone Adjustment
 * Professional highlights and shadows adjustment with color preservation
 */

import {
  calculateNormalizedLuminance,
  preserveColorWithLuminance,
} from './luminance';
import { applySelectiveToneAdjustment } from './toneCurves';

export interface SelectiveToneParams {
  /**
   * Adjustment strength (-100 to +100)
   * Positive: brighten, Negative: darken
   */
  adjustment: number;

  /**
   * Target tonal range
   */
  range: 'highlights' | 'shadows';

  /**
   * Transition smoothness (0-1)
   * Lower: abrupt transition, Higher: smooth gradual transition
   * Default: 0.3
   */
  feather?: number;

  /**
   * Preserve color saturation during adjustment
   * Default: true
   */
  preserveColor?: boolean;
}

/**
 * Apply selective tone adjustment to image
 * Professional algorithm matching Photoshop/Lightroom quality
 *
 * Features:
 * - Luminance-based masking
 * - Smooth parametric curves
 * - Color preservation
 * - No halos or artifacts
 *
 * @param imageData - Original image data
 * @param params - Adjustment parameters
 * @returns Adjusted image data
 */
export function applySelectiveTone(
  imageData: ImageData,
  params: SelectiveToneParams
): ImageData {
  const { adjustment, range, feather = 0.3, preserveColor = true } = params;

  // Validate adjustment
  const clampedAdjustment = Math.max(-100, Math.min(100, adjustment));

  // Skip if no adjustment
  if (clampedAdjustment === 0) {
    return imageData;
  }

  // Normalize adjustment to -1 to +1 range
  const normalizedAdjustment = clampedAdjustment / 100;

  // Create output
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Calculate original luminance
    const originalLuminance = calculateNormalizedLuminance(r, g, b);

    // Apply selective tone adjustment
    const newLuminance = applySelectiveToneAdjustment(
      originalLuminance,
      normalizedAdjustment,
      range,
      feather
    );

    // Preserve color while adjusting luminance
    let newR: number, newG: number, newB: number;

    if (preserveColor && originalLuminance > 0.001) {
      // Color preservation mode: maintain hue and saturation
      [newR, newG, newB] = preserveColorWithLuminance(r, g, b, newLuminance);
    } else {
      // Simple proportional adjustment
      const ratio = newLuminance / Math.max(originalLuminance, 0.001);
      newR = Math.max(0, Math.min(255, r * ratio));
      newG = Math.max(0, Math.min(255, g * ratio));
      newB = Math.max(0, Math.min(255, b * ratio));
    }

    // Write adjusted values
    outputData[i] = Math.round(newR);
    outputData[i + 1] = Math.round(newG);
    outputData[i + 2] = Math.round(newB);
    outputData[i + 3] = a; // Preserve alpha
  }

  return output;
}

/**
 * Apply both highlights and shadows adjustments
 * Combines two selective tone adjustments efficiently
 *
 * @param imageData - Original image data
 * @param highlightAdjustment - Highlight adjustment (-100 to +100)
 * @param shadowAdjustment - Shadow adjustment (-100 to +100)
 * @param feather - Transition smoothness (0-1)
 * @returns Adjusted image data
 */
export function applyDualSelectiveTone(
  imageData: ImageData,
  highlightAdjustment: number,
  shadowAdjustment: number,
  feather: number = 0.3
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Normalize adjustments
  const normHighlight =
    Math.max(-100, Math.min(100, highlightAdjustment)) / 100;
  const normShadow = Math.max(-100, Math.min(100, shadowAdjustment)) / 100;

  // Skip if no adjustment
  if (normHighlight === 0 && normShadow === 0) {
    return imageData;
  }

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Calculate original luminance
    const originalLuminance = calculateNormalizedLuminance(r, g, b);

    // Apply highlight adjustment
    let adjustedLuminance = originalLuminance;
    if (normHighlight !== 0) {
      adjustedLuminance = applySelectiveToneAdjustment(
        adjustedLuminance,
        normHighlight,
        'highlights',
        feather
      );
    }

    // Apply shadow adjustment
    if (normShadow !== 0) {
      adjustedLuminance = applySelectiveToneAdjustment(
        adjustedLuminance,
        normShadow,
        'shadows',
        feather
      );
    }

    // Preserve color
    const [newR, newG, newB] = preserveColorWithLuminance(
      r,
      g,
      b,
      adjustedLuminance
    );

    // Write adjusted values
    outputData[i] = Math.round(newR);
    outputData[i + 1] = Math.round(newG);
    outputData[i + 2] = Math.round(newB);
    outputData[i + 3] = a; // Preserve alpha
  }

  return output;
}

/**
 * Convert slider value to appropriate feather amount
 * Provides natural-feeling adjustments at all levels
 *
 * @param adjustment - Adjustment value (-100 to +100)
 * @returns Optimal feather value (0.2-0.5)
 */
export function calculateOptimalFeather(adjustment: number): number {
  const absAdjustment = Math.abs(adjustment);

  // Stronger adjustments need more feathering to look natural
  // Weak: 0.2 (sharp transition)
  // Medium: 0.3 (balanced)
  // Strong: 0.5 (very smooth)
  if (absAdjustment < 30) {
    return 0.2;
  } else if (absAdjustment < 60) {
    return 0.3;
  } else {
    return 0.4;
  }
}
