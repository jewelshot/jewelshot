/**
 * Image Filter Utilities
 * Pure functions for image manipulation using Canvas API
 */

export interface AdjustFilters {
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  exposure?: number; // -100 to 100
  highlights?: number; // -100 to 100
  shadows?: number; // -100 to 100
  whites?: number; // -100 to 100
  blacks?: number; // -100 to 100
  clarity?: number; // -100 to 100
  sharpness?: number; // 0 to 100
  dehaze?: number; // -100 to 100
}

/**
 * Clamp value between min and max
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Apply brightness adjustment to image
 * @param imageData - Canvas ImageData object
 * @param value - Brightness value (-100 to 100)
 * @returns Modified ImageData
 */
export const applyBrightness = (
  imageData: ImageData,
  value: number
): ImageData => {
  if (value === 0) return imageData;

  const data = imageData.data;
  // Convert -100/+100 range to actual brightness adjustment
  const brightness = (value / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness to RGB channels (skip alpha at i+3)
    data[i] = clamp(data[i] + brightness, 0, 255); // Red
    data[i + 1] = clamp(data[i + 1] + brightness, 0, 255); // Green
    data[i + 2] = clamp(data[i + 2] + brightness, 0, 255); // Blue
  }

  return imageData;
};

/**
 * Apply contrast adjustment to image
 * @param imageData - Canvas ImageData object
 * @param value - Contrast value (-100 to 100)
 * @returns Modified ImageData
 */
export const applyContrast = (
  imageData: ImageData,
  value: number
): ImageData => {
  if (value === 0) return imageData;

  const data = imageData.data;
  // Convert -100/+100 range to contrast factor (0.5 to 2.0)
  const factor = (value + 100) / 100;
  const intercept = 128 * (1 - factor);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] * factor + intercept, 0, 255); // Red
    data[i + 1] = clamp(data[i + 1] * factor + intercept, 0, 255); // Green
    data[i + 2] = clamp(data[i + 2] * factor + intercept, 0, 255); // Blue
  }

  return imageData;
};

/**
 * Apply exposure adjustment to image
 * @param imageData - Canvas ImageData object
 * @param value - Exposure value (-100 to 100)
 * @returns Modified ImageData
 */
export const applyExposure = (
  imageData: ImageData,
  value: number
): ImageData => {
  if (value === 0) return imageData;

  const data = imageData.data;
  // Convert -100/+100 range to exposure multiplier (0.5 to 2.0)
  const exposure = Math.pow(2, value / 100);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] * exposure, 0, 255); // Red
    data[i + 1] = clamp(data[i + 1] * exposure, 0, 255); // Green
    data[i + 2] = clamp(data[i + 2] * exposure, 0, 255); // Blue
  }

  return imageData;
};

/**
 * Apply all filters to an image source
 * @param imageSrc - Image source (base64 or URL)
 * @param filters - Filter values
 * @returns Promise<string> - Filtered image as base64
 */
export const applyFilters = async (
  imageSrc: string,
  filters: AdjustFilters
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Apply filters in order
      if (filters.brightness !== undefined && filters.brightness !== 0) {
        imageData = applyBrightness(imageData, filters.brightness);
      }

      if (filters.contrast !== undefined && filters.contrast !== 0) {
        imageData = applyContrast(imageData, filters.contrast);
      }

      if (filters.exposure !== undefined && filters.exposure !== 0) {
        imageData = applyExposure(imageData, filters.exposure);
      }

      // Put modified image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert to base64
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageSrc;
  });
};

export default {
  applyBrightness,
  applyContrast,
  applyExposure,
  applyFilters,
};
