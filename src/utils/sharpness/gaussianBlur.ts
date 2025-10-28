/**
 * Gaussian Blur Algorithm
 * High-quality blur using Gaussian distribution
 */

import {
  generateGaussianKernel,
  applySeparableConvolution,
} from './convolution';

/**
 * Apply Gaussian blur to image data
 * Uses separable convolution for optimal performance
 *
 * @param imageData - Original image data
 * @param radius - Blur radius (0-20, typically 1-5 for sharpening)
 * @param sigma - Standard deviation (auto-calculated if not provided)
 * @returns Blurred image data
 */
export function applyGaussianBlur(
  imageData: ImageData,
  radius: number,
  sigma?: number
): ImageData {
  // Clamp radius
  radius = Math.max(0, Math.min(20, Math.round(radius)));

  // Auto-calculate sigma if not provided
  // Rule of thumb: sigma = radius / 3 for good coverage
  if (!sigma) {
    sigma = radius > 0 ? radius / 3 : 1;
  }

  // Generate 1D Gaussian kernel
  const kernel = generateGaussianKernel(radius, sigma);

  // Apply separable convolution (much faster than 2D)
  return applySeparableConvolution(imageData, kernel);
}

/**
 * Fast blur approximation using box blur
 * Much faster than Gaussian blur, good for preview
 *
 * @param imageData - Original image data
 * @param radius - Blur radius
 * @returns Blurred image data
 */
export function applyBoxBlur(imageData: ImageData, radius: number): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  radius = Math.max(1, Math.min(10, Math.round(radius)));

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let kx = -radius; kx <= radius; kx++) {
        const sampleX = Math.max(0, Math.min(width - 1, x + kx));
        const pixelIndex = (y * width + sampleX) * 4;

        r += data[pixelIndex];
        g += data[pixelIndex + 1];
        b += data[pixelIndex + 2];
        count++;
      }

      const outputIndex = (y * width + x) * 4;
      outputData[outputIndex] = r / count;
      outputData[outputIndex + 1] = g / count;
      outputData[outputIndex + 2] = b / count;
      outputData[outputIndex + 3] = data[(y * width + x) * 4 + 3];
    }
  }

  // Vertical pass
  const temp = new ImageData(new Uint8ClampedArray(outputData), width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let ky = -radius; ky <= radius; ky++) {
        const sampleY = Math.max(0, Math.min(height - 1, y + ky));
        const pixelIndex = (sampleY * width + x) * 4;

        r += temp.data[pixelIndex];
        g += temp.data[pixelIndex + 1];
        b += temp.data[pixelIndex + 2];
        count++;
      }

      const outputIndex = (y * width + x) * 4;
      outputData[outputIndex] = r / count;
      outputData[outputIndex + 1] = g / count;
      outputData[outputIndex + 2] = b / count;
    }
  }

  return output;
}
