/**
 * Bilateral Filter
 * Edge-preserving smoothing for clarity enhancement
 *
 * Bilateral filtering is a non-linear filter that smooths images while
 * preserving edges. Unlike Gaussian blur, it considers both spatial
 * distance and intensity difference when weighting neighboring pixels.
 */

/**
 * Apply bilateral filter to image data
 * Edge-aware blur that preserves sharp transitions
 *
 * @param imageData - Original image data
 * @param spatialSigma - Spatial domain sigma (controls blur radius)
 * @param rangeSigma - Range domain sigma (controls edge preservation)
 * @returns Filtered image data
 */
export function applyBilateralFilter(
  imageData: ImageData,
  spatialSigma: number = 3,
  rangeSigma: number = 25
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Calculate kernel radius from spatial sigma
  const kernelRadius = Math.ceil(spatialSigma * 2);

  // Pre-calculate spatial Gaussian weights
  const spatialKernel = createSpatialKernel(kernelRadius, spatialSigma);

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const centerIndex = (y * width + x) * 4;
      const centerR = data[centerIndex];
      const centerG = data[centerIndex + 1];
      const centerB = data[centerIndex + 2];

      let sumR = 0,
        sumG = 0,
        sumB = 0;
      let sumWeight = 0;

      // Iterate over kernel
      for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
        for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
          const sampleY = Math.max(0, Math.min(height - 1, y + ky));
          const sampleX = Math.max(0, Math.min(width - 1, x + kx));
          const sampleIndex = (sampleY * width + sampleX) * 4;

          const sampleR = data[sampleIndex];
          const sampleG = data[sampleIndex + 1];
          const sampleB = data[sampleIndex + 2];

          // Calculate intensity difference (Euclidean distance in RGB)
          const deltaR = centerR - sampleR;
          const deltaG = centerG - sampleG;
          const deltaB = centerB - sampleB;
          const intensityDiff = Math.sqrt(
            deltaR * deltaR + deltaG * deltaG + deltaB * deltaB
          );

          // Spatial weight (from pre-calculated kernel)
          const spatialWeight =
            spatialKernel[ky + kernelRadius][kx + kernelRadius];

          // Range weight (based on intensity difference)
          const rangeWeight = Math.exp(
            -(intensityDiff * intensityDiff) / (2 * rangeSigma * rangeSigma)
          );

          // Combined weight
          const weight = spatialWeight * rangeWeight;

          sumR += sampleR * weight;
          sumG += sampleG * weight;
          sumB += sampleB * weight;
          sumWeight += weight;
        }
      }

      // Normalize and write output
      if (sumWeight > 0) {
        outputData[centerIndex] = Math.round(sumR / sumWeight);
        outputData[centerIndex + 1] = Math.round(sumG / sumWeight);
        outputData[centerIndex + 2] = Math.round(sumB / sumWeight);
      } else {
        outputData[centerIndex] = centerR;
        outputData[centerIndex + 1] = centerG;
        outputData[centerIndex + 2] = centerB;
      }

      // Preserve alpha
      outputData[centerIndex + 3] = data[centerIndex + 3];
    }
  }

  return output;
}

/**
 * Create pre-calculated spatial Gaussian kernel
 * @param radius - Kernel radius
 * @param sigma - Spatial sigma
 * @returns 2D kernel array
 */
function createSpatialKernel(radius: number, sigma: number): number[][] {
  const size = radius * 2 + 1;
  const kernel: number[][] = [];

  for (let y = 0; y < size; y++) {
    kernel[y] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - radius;
      const dy = y - radius;
      const distance = dx * dx + dy * dy;
      kernel[y][x] = Math.exp(-distance / (2 * sigma * sigma));
    }
  }

  return kernel;
}

/**
 * Fast bilateral filter approximation using grid downsampling
 * Much faster than full bilateral filter, suitable for real-time preview
 *
 * @param imageData - Original image data
 * @param spatialSigma - Spatial sigma
 * @param rangeSigma - Range sigma
 * @returns Filtered image data
 */
export function applyFastBilateralFilter(
  imageData: ImageData,
  spatialSigma: number = 3,
  rangeSigma: number = 25
): ImageData {
  // For now, use simplified version with smaller kernel
  const simplifiedSpatialSigma = Math.max(1, spatialSigma / 2);
  return applyBilateralFilter(imageData, simplifiedSpatialSigma, rangeSigma);
}

/**
 * Calculate optimal bilateral filter parameters for clarity
 * Based on adjustment strength and image characteristics
 *
 * @param clarityAmount - Clarity adjustment (-100 to +100)
 * @returns Optimal filter parameters
 */
export function calculateBilateralParams(clarityAmount: number): {
  spatialSigma: number;
  rangeSigma: number;
} {
  const absClarityAmount = Math.abs(clarityAmount);

  if (clarityAmount > 0) {
    // Positive clarity: sharper local contrast
    // Smaller spatial sigma for finer detail
    const spatialSigma = 2 + (absClarityAmount / 100) * 2; // 2-4
    const rangeSigma = 20 + (absClarityAmount / 100) * 30; // 20-50
    return { spatialSigma, rangeSigma };
  } else {
    // Negative clarity: smoother, softer look
    // Larger spatial sigma for more blur
    const spatialSigma = 3 + (absClarityAmount / 100) * 5; // 3-8
    const rangeSigma = 15 + (absClarityAmount / 100) * 20; // 15-35
    return { spatialSigma, rangeSigma };
  }
}
