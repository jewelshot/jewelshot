/**
 * Dark Channel Prior Algorithm
 * Core of professional dehaze processing
 *
 * Paper: "Single Image Haze Removal Using Dark Channel Prior" (CVPR 2009)
 * by Kaiming He, Jian Sun, and Xiaoou Tang
 */

/**
 * Calculate dark channel of an image
 * Dark channel = min of RGB channels in local patch
 *
 * Observation: In most non-sky patches, at least one color channel
 * has very low intensity at some pixels
 *
 * @param imageData - Original image data
 * @param patchSize - Size of local patch (typically 15)
 * @returns Dark channel (grayscale)
 */
export function calculateDarkChannel(
  imageData: ImageData,
  patchSize: number = 15
): Float32Array {
  const { width, height, data } = imageData;
  const darkChannel = new Float32Array(width * height);
  const halfPatch = Math.floor(patchSize / 2);

  // For each pixel, find minimum of RGB in local patch
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minValue = 255;

      // Search in local patch
      for (let py = -halfPatch; py <= halfPatch; py++) {
        for (let px = -halfPatch; px <= halfPatch; px++) {
          const sampleY = Math.max(0, Math.min(height - 1, y + py));
          const sampleX = Math.max(0, Math.min(width - 1, x + px));
          const index = (sampleY * width + sampleX) * 4;

          // Find minimum of RGB channels
          const minRGB = Math.min(
            data[index],
            data[index + 1],
            data[index + 2]
          );
          minValue = Math.min(minValue, minRGB);
        }
      }

      darkChannel[y * width + x] = minValue / 255; // Normalize to 0-1
    }
  }

  return darkChannel;
}

/**
 * Fast dark channel calculation using downsampled image
 * Much faster than full resolution, good for real-time
 *
 * @param imageData - Original image data
 * @param patchSize - Patch size (will be scaled)
 * @returns Dark channel (grayscale)
 */
export function calculateFastDarkChannel(
  imageData: ImageData,
  patchSize: number = 15
): Float32Array {
  const { width, height, data } = imageData;

  // Downsample for speed (process at 1/4 resolution)
  const scale = 4;
  const smallWidth = Math.floor(width / scale);
  const smallHeight = Math.floor(height / scale);
  const smallPatchSize = Math.max(3, Math.floor(patchSize / scale));

  // Create downsampled image
  const smallData = new Uint8ClampedArray(smallWidth * smallHeight * 4);
  for (let y = 0; y < smallHeight; y++) {
    for (let x = 0; x < smallWidth; x++) {
      const srcY = y * scale;
      const srcX = x * scale;
      const srcIndex = (srcY * width + srcX) * 4;
      const dstIndex = (y * smallWidth + x) * 4;

      smallData[dstIndex] = data[srcIndex];
      smallData[dstIndex + 1] = data[srcIndex + 1];
      smallData[dstIndex + 2] = data[srcIndex + 2];
      smallData[dstIndex + 3] = data[srcIndex + 3];
    }
  }

  // Calculate dark channel on downsampled image
  const smallDarkChannel = new Float32Array(smallWidth * smallHeight);
  const halfPatch = Math.floor(smallPatchSize / 2);

  for (let y = 0; y < smallHeight; y++) {
    for (let x = 0; x < smallWidth; x++) {
      let minValue = 255;

      for (let py = -halfPatch; py <= halfPatch; py++) {
        for (let px = -halfPatch; px <= halfPatch; px++) {
          const sampleY = Math.max(0, Math.min(smallHeight - 1, y + py));
          const sampleX = Math.max(0, Math.min(smallWidth - 1, x + px));
          const index = (sampleY * smallWidth + sampleX) * 4;

          const minRGB = Math.min(
            smallData[index],
            smallData[index + 1],
            smallData[index + 2]
          );
          minValue = Math.min(minValue, minRGB);
        }
      }

      smallDarkChannel[y * smallWidth + x] = minValue / 255;
    }
  }

  // Upsample dark channel back to original size (bilinear interpolation)
  const darkChannel = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcY = y / scale;
      const srcX = x / scale;
      const y0 = Math.floor(srcY);
      const y1 = Math.min(smallHeight - 1, y0 + 1);
      const x0 = Math.floor(srcX);
      const x1 = Math.min(smallWidth - 1, x0 + 1);

      const fy = srcY - y0;
      const fx = srcX - x0;

      const v00 = smallDarkChannel[y0 * smallWidth + x0];
      const v01 = smallDarkChannel[y0 * smallWidth + x1];
      const v10 = smallDarkChannel[y1 * smallWidth + x0];
      const v11 = smallDarkChannel[y1 * smallWidth + x1];

      const v0 = v00 * (1 - fx) + v01 * fx;
      const v1 = v10 * (1 - fx) + v11 * fx;
      const v = v0 * (1 - fy) + v1 * fy;

      darkChannel[y * width + x] = v;
    }
  }

  return darkChannel;
}

/**
 * Estimate atmospheric light from dark channel
 * Atmospheric light = brightest pixels in darkest 0.1% of dark channel
 *
 * @param imageData - Original image data
 * @param darkChannel - Dark channel map
 * @returns Atmospheric light RGB values (0-255)
 */
export function estimateAtmosphericLight(
  imageData: ImageData,
  darkChannel: Float32Array
): [number, number, number] {
  const { width, height, data } = imageData;
  const totalPixels = width * height;

  // Find top 0.1% brightest pixels in dark channel
  const threshold = 0.001;
  const numBrightPixels = Math.max(1, Math.floor(totalPixels * threshold));

  // Create array of (darkChannelValue, index) pairs
  const pixels: Array<{ value: number; index: number }> = [];
  for (let i = 0; i < darkChannel.length; i++) {
    pixels.push({ value: darkChannel[i], index: i });
  }

  // Sort by dark channel value (descending)
  pixels.sort((a, b) => b.value - a.value);

  // Get brightest pixels in original image from top dark channel pixels
  let maxIntensity = 0;
  let atmosphericLight: [number, number, number] = [255, 255, 255];

  for (let i = 0; i < numBrightPixels; i++) {
    const pixelIndex = pixels[i].index * 4;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    const intensity = r + g + b;

    if (intensity > maxIntensity) {
      maxIntensity = intensity;
      atmosphericLight = [r, g, b];
    }
  }

  return atmosphericLight;
}

/**
 * Calculate transmission map
 * Transmission = 1 - omega * darkChannel(I/A)
 *
 * @param imageData - Original image data
 * @param atmosphericLight - Atmospheric light RGB
 * @param omega - Haze retention factor (0.9-0.95)
 * @param patchSize - Patch size for dark channel
 * @param useFast - Use fast calculation
 * @returns Transmission map (0-1)
 */
export function calculateTransmissionMap(
  imageData: ImageData,
  atmosphericLight: [number, number, number],
  omega: number = 0.95,
  patchSize: number = 15,
  useFast: boolean = true
): Float32Array {
  const { width, height, data } = imageData;

  // Normalize image by atmospheric light
  const normalized = new ImageData(width, height);
  const normalizedData = normalized.data;

  for (let i = 0; i < data.length; i += 4) {
    normalizedData[i] = Math.min(255, (data[i] / atmosphericLight[0]) * 255);
    normalizedData[i + 1] = Math.min(
      255,
      (data[i + 1] / atmosphericLight[1]) * 255
    );
    normalizedData[i + 2] = Math.min(
      255,
      (data[i + 2] / atmosphericLight[2]) * 255
    );
    normalizedData[i + 3] = data[i + 3];
  }

  // Calculate dark channel of normalized image
  const darkChannel = useFast
    ? calculateFastDarkChannel(normalized, patchSize)
    : calculateDarkChannel(normalized, patchSize);

  // Calculate transmission: t = 1 - omega * darkChannel
  const transmission = new Float32Array(width * height);
  for (let i = 0; i < transmission.length; i++) {
    transmission[i] = 1 - omega * darkChannel[i];
  }

  return transmission;
}

/**
 * Refine transmission map using guided filter
 * Simplified version for speed
 *
 * @param transmission - Raw transmission map
 * @param guide - Guide image (grayscale)
 * @param radius - Filter radius
 * @returns Refined transmission map
 */
export function refineTransmission(
  transmission: Float32Array,
  guide: Float32Array,
  radius: number = 30
): Float32Array {
  // For performance, we'll skip full guided filter
  // Instead, use simple box filter for smoothing
  const width = Math.sqrt(transmission.length);
  const height = width;
  const refined = new Float32Array(transmission.length);

  const halfRadius = Math.floor(radius / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let py = -halfRadius; py <= halfRadius; py++) {
        for (let px = -halfRadius; px <= halfRadius; px++) {
          const sampleY = Math.max(0, Math.min(height - 1, y + py));
          const sampleX = Math.max(0, Math.min(width - 1, x + px));
          const index = sampleY * width + sampleX;

          sum += transmission[index];
          count++;
        }
      }

      refined[y * width + x] = sum / count;
    }
  }

  return refined;
}
