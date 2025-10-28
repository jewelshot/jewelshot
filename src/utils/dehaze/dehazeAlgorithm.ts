/**
 * Dehaze Algorithm
 * Professional atmospheric haze removal using Dark Channel Prior
 */

import {
  calculateFastDarkChannel,
  estimateAtmosphericLight,
  calculateTransmissionMap,
} from './darkChannel';

export interface DehazeParams {
  /**
   * Dehaze strength (-100 to +100)
   * Positive: remove haze, Negative: add haze
   */
  strength: number;

  /**
   * Processing quality
   * - 'fast': Quick processing for real-time
   * - 'high': Better quality (slower)
   */
  quality?: 'fast' | 'high';

  /**
   * Haze retention factor (0.85-0.95)
   * Higher = more aggressive dehaze
   */
  omega?: number;

  /**
   * Minimum transmission threshold (0.1-0.3)
   * Prevents over-darkening
   */
  t0?: number;
}

/**
 * Apply professional dehaze using Dark Channel Prior
 *
 * Algorithm:
 * 1. Calculate dark channel
 * 2. Estimate atmospheric light
 * 3. Calculate transmission map
 * 4. Recover scene radiance
 *
 * @param imageData - Original hazy image
 * @param params - Dehaze parameters
 * @returns Dehazed image
 */
export function applyDehaze(
  imageData: ImageData,
  params: DehazeParams
): ImageData {
  const { strength, quality = 'fast', omega = 0.9, t0 = 0.1 } = params;

  // Validate and clamp strength
  const clampedStrength = Math.max(-100, Math.min(100, strength));

  // Skip if no adjustment
  if (clampedStrength === 0) {
    return imageData;
  }

  // Normalize strength to -1 to +1
  const normalizedStrength = clampedStrength / 100;

  if (normalizedStrength < 0) {
    // NEGATIVE: Add haze (atmospheric scattering simulation)
    return addHaze(imageData, Math.abs(normalizedStrength));
  } else {
    // POSITIVE: Remove haze
    if (quality === 'fast') {
      return removeFastDehaze(imageData, normalizedStrength, omega, t0);
    } else {
      return removeDehaze(imageData, normalizedStrength, omega, t0);
    }
  }
}

/**
 * Remove haze using Dark Channel Prior
 */
function removeDehaze(
  imageData: ImageData,
  strength: number,
  omega: number,
  t0: number
): ImageData {
  const { width, height, data } = imageData;

  // Step 1: Calculate dark channel
  const patchSize = 15;
  const darkChannel = calculateFastDarkChannel(imageData, patchSize);

  // Step 2: Estimate atmospheric light
  const atmosphericLight = estimateAtmosphericLight(imageData, darkChannel);

  // Step 3: Calculate transmission map
  const transmission = calculateTransmissionMap(
    imageData,
    atmosphericLight,
    omega,
    patchSize,
    true // Use fast calculation
  );

  // Step 4: Recover scene radiance
  const output = new ImageData(width, height);
  const outputData = output.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = Math.floor(i / 4);
    let t = transmission[pixelIndex];

    // Apply strength factor
    t = 1 - (1 - t) * strength;

    // Clamp transmission to avoid division by zero
    t = Math.max(t0, t);

    // Recover scene radiance: J = (I - A) / t + A
    const r = (data[i] - atmosphericLight[0]) / t + atmosphericLight[0];
    const g = (data[i + 1] - atmosphericLight[1]) / t + atmosphericLight[1];
    const b = (data[i + 2] - atmosphericLight[2]) / t + atmosphericLight[2];

    outputData[i] = clamp(r, 0, 255);
    outputData[i + 1] = clamp(g, 0, 255);
    outputData[i + 2] = clamp(b, 0, 255);
    outputData[i + 3] = data[i + 3]; // Preserve alpha
  }

  return output;
}

/**
 * Fast dehaze using ultra-simplified algorithm
 * No dark channel calculation - pure contrast/saturation approach
 * Much faster and more stable
 */
function removeFastDehaze(
  imageData: ImageData,
  strength: number,
  omega: number,
  t0: number
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Ultra-fast approach: estimate global atmospheric light from brightest pixels
  let maxBrightness = 0;
  let atmosphericR = 255,
    atmosphericG = 255,
    atmosphericB = 255;

  // Sample every 10th pixel for speed
  for (let i = 0; i < data.length; i += 40) {
    const brightness = data[i] + data[i + 1] + data[i + 2];
    if (brightness > maxBrightness) {
      maxBrightness = brightness;
      atmosphericR = data[i];
      atmosphericG = data[i + 1];
      atmosphericB = data[i + 2];
    }
  }

  // Process each pixel with simplified transmission
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Estimate transmission based on pixel darkness
    const minChannel = Math.min(r, g, b);
    const transmission = 1 - (minChannel / 255) * omega;
    const t = Math.max(t0, 1 - (1 - transmission) * strength);

    // Simple dehaze formula (less aggressive than full DCP)
    const factor = 1 / t;

    // Safety check for NaN/Infinity
    if (!isFinite(factor)) {
      outputData[i] = r;
      outputData[i + 1] = g;
      outputData[i + 2] = b;
      outputData[i + 3] = data[i + 3];
      continue;
    }

    const newR = r * factor;
    const newG = g * factor;
    const newB = b * factor;

    // Apply with soft limiting
    outputData[i] = clamp(newR, 0, 255);
    outputData[i + 1] = clamp(newG, 0, 255);
    outputData[i + 2] = clamp(newB, 0, 255);
    outputData[i + 3] = data[i + 3];
  }

  // Post-process: gentle boost for stability
  const contrastBoost = 1 + strength * 0.15; // Reduced from 0.3
  const saturationBoost = 1 + strength * 0.1; // Reduced from 0.2

  for (let i = 0; i < outputData.length; i += 4) {
    const r = outputData[i];
    const g = outputData[i + 1];
    const b = outputData[i + 2];

    // Apply contrast
    const contrastR = (r - 128) * contrastBoost + 128;
    const contrastG = (g - 128) * contrastBoost + 128;
    const contrastB = (b - 128) * contrastBoost + 128;

    // Apply saturation
    const gray = (contrastR + contrastG + contrastB) / 3;
    const finalR = gray + (contrastR - gray) * saturationBoost;
    const finalG = gray + (contrastG - gray) * saturationBoost;
    const finalB = gray + (contrastB - gray) * saturationBoost;

    // Safety check
    outputData[i] = isFinite(finalR) ? clamp(finalR, 0, 255) : outputData[i];
    outputData[i + 1] = isFinite(finalG)
      ? clamp(finalG, 0, 255)
      : outputData[i + 1];
    outputData[i + 2] = isFinite(finalB)
      ? clamp(finalB, 0, 255)
      : outputData[i + 2];
  }

  return output;
}

/**
 * Add haze to image (atmospheric scattering simulation)
 * Creates foggy/misty effect
 */
function addHaze(imageData: ImageData, strength: number): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Simulate atmospheric light (light gray/white)
  const atmosphericLight: [number, number, number] = [220, 225, 230];

  // Distance-based haze simulation
  // Center = far (more haze), edges = near (less haze)
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      // Calculate distance from center (simulates depth)
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = distance / maxDistance;

      // Transmission decreases with distance
      const baseTransmission = 0.4 + normalizedDistance * 0.4; // 0.4-0.8
      const transmission = Math.pow(baseTransmission, strength * 2);

      // Apply haze: I = J * t + A * (1 - t)
      const r =
        data[index] * transmission + atmosphericLight[0] * (1 - transmission);
      const g =
        data[index + 1] * transmission +
        atmosphericLight[1] * (1 - transmission);
      const b =
        data[index + 2] * transmission +
        atmosphericLight[2] * (1 - transmission);

      outputData[index] = clamp(r, 0, 255);
      outputData[index + 1] = clamp(g, 0, 255);
      outputData[index + 2] = clamp(b, 0, 255);
      outputData[index + 3] = data[index + 3];
    }
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
 * Convert dehaze slider value to optimal parameters
 *
 * @param dehazeValue - Slider value (-100 to +100)
 * @param useHighQuality - Use high-quality processing
 * @returns Optimal dehaze parameters
 */
export function dehazeValueToParams(
  dehazeValue: number,
  useHighQuality: boolean = false
): DehazeParams {
  const absValue = Math.abs(dehazeValue);

  // Simplified parameters for stability
  const omega = 0.7; // Lower for less aggressive effect
  const t0 = 0.2; // Higher to prevent over-darkening

  return {
    strength: dehazeValue,
    quality: useHighQuality ? 'high' : 'fast',
    omega,
    t0,
  };
}
