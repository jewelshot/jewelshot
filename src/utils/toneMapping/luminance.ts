/**
 * Luminance Calculation Utilities
 * Convert RGB to perceptual luminance for tonal analysis
 */

/**
 * Calculate relative luminance from RGB values
 * Uses ITU-R BT.709 standard (same as Photoshop)
 *
 * Formula: L = 0.2126*R + 0.7152*G + 0.0722*B
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Luminance value (0-255)
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate normalized luminance (0-1 range)
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Normalized luminance (0-1)
 */
export function calculateNormalizedLuminance(
  r: number,
  g: number,
  b: number
): number {
  return calculateLuminance(r, g, b) / 255;
}

/**
 * Calculate luminance map for entire image
 * Returns Float32Array for performance and precision
 *
 * @param imageData - Source image data
 * @returns Float32Array of luminance values (0-1 range)
 */
export function calculateLuminanceMap(imageData: ImageData): Float32Array {
  const { width, height, data } = imageData;
  const luminanceMap = new Float32Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    luminanceMap[pixelIndex] = calculateNormalizedLuminance(r, g, b);
  }

  return luminanceMap;
}

/**
 * Convert RGB to HSL for color preservation
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns HSL values [h: 0-360, s: 0-1, l: 0-1]
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return [0, 0, l]; // Achromatic
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return [h * 360, s, l];
}

/**
 * Convert HSL to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns RGB values [r: 0-255, g: 0-255, b: 0-255]
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  h /= 360;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray]; // Achromatic
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Preserve color while adjusting luminance
 * Uses HSL color space to maintain hue and saturation
 *
 * @param r - Original red (0-255)
 * @param g - Original green (0-255)
 * @param b - Original blue (0-255)
 * @param newLuminance - Target luminance (0-1)
 * @returns Adjusted RGB [r, g, b]
 */
export function preserveColorWithLuminance(
  r: number,
  g: number,
  b: number,
  newLuminance: number
): [number, number, number] {
  const [h, s] = rgbToHsl(r, g, b);

  // Clamp new luminance
  const clampedL = Math.max(0, Math.min(1, newLuminance));

  return hslToRgb(h, s, clampedL);
}
