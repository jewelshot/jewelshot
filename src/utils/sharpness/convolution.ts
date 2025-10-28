/**
 * Convolution Matrix Operations
 * Core utility for image processing operations
 */

/**
 * Apply convolution matrix to image data
 * @param imageData - Original image data
 * @param kernel - Convolution kernel matrix (must be square, odd-sized)
 * @param divisor - Normalization divisor (defaults to sum of kernel values)
 * @param offset - Brightness offset (default: 0)
 * @returns Convolved image data
 */
export function applyConvolution(
  imageData: ImageData,
  kernel: number[][],
  divisor?: number,
  offset: number = 0
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  // Calculate kernel properties
  const kernelSize = kernel.length;
  const halfKernel = Math.floor(kernelSize / 2);

  // Calculate divisor if not provided (sum of all kernel values)
  if (!divisor) {
    divisor = kernel.flat().reduce((sum, val) => sum + val, 0);
    if (divisor === 0) divisor = 1; // Prevent division by zero
  }

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      // Apply kernel
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          // Calculate source pixel position
          const pixelY = y + ky - halfKernel;
          const pixelX = x + kx - halfKernel;

          // Skip if out of bounds (edge handling: replicate)
          const sampleY = Math.max(0, Math.min(height - 1, pixelY));
          const sampleX = Math.max(0, Math.min(width - 1, pixelX));

          const pixelIndex = (sampleY * width + sampleX) * 4;
          const kernelValue = kernel[ky][kx];

          r += data[pixelIndex] * kernelValue;
          g += data[pixelIndex + 1] * kernelValue;
          b += data[pixelIndex + 2] * kernelValue;
        }
      }

      // Normalize and clamp
      const outputIndex = (y * width + x) * 4;
      outputData[outputIndex] = Math.max(
        0,
        Math.min(255, r / divisor + offset)
      );
      outputData[outputIndex + 1] = Math.max(
        0,
        Math.min(255, g / divisor + offset)
      );
      outputData[outputIndex + 2] = Math.max(
        0,
        Math.min(255, b / divisor + offset)
      );
      outputData[outputIndex + 3] = data[(y * width + x) * 4 + 3]; // Preserve alpha
    }
  }

  return output;
}

/**
 * Generate 1D Gaussian kernel
 * @param radius - Kernel radius
 * @param sigma - Standard deviation
 * @returns 1D Gaussian kernel array
 */
export function generateGaussianKernel(
  radius: number,
  sigma: number
): number[] {
  const size = radius * 2 + 1;
  const kernel: number[] = new Array(size);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const x = i - radius;
    const value = Math.exp(-(x * x) / (2 * sigma * sigma));
    kernel[i] = value;
    sum += value;
  }

  // Normalize
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}

/**
 * Separate convolution for optimization (horizontal + vertical)
 * Much faster than 2D convolution for separable kernels (like Gaussian)
 */
export function applySeparableConvolution(
  imageData: ImageData,
  kernel: number[]
): ImageData {
  const { width, height } = imageData;

  // Horizontal pass
  const temp = applyHorizontalConvolution(imageData, kernel);

  // Vertical pass
  const output = applyVerticalConvolution(temp, kernel);

  return output;
}

function applyHorizontalConvolution(
  imageData: ImageData,
  kernel: number[]
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  const halfKernel = Math.floor(kernel.length / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let k = 0; k < kernel.length; k++) {
        const sampleX = Math.max(0, Math.min(width - 1, x + k - halfKernel));
        const pixelIndex = (y * width + sampleX) * 4;
        const kernelValue = kernel[k];

        r += data[pixelIndex] * kernelValue;
        g += data[pixelIndex + 1] * kernelValue;
        b += data[pixelIndex + 2] * kernelValue;
      }

      const outputIndex = (y * width + x) * 4;
      outputData[outputIndex] = r;
      outputData[outputIndex + 1] = g;
      outputData[outputIndex + 2] = b;
      outputData[outputIndex + 3] = data[(y * width + x) * 4 + 3];
    }
  }

  return output;
}

function applyVerticalConvolution(
  imageData: ImageData,
  kernel: number[]
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const outputData = output.data;

  const halfKernel = Math.floor(kernel.length / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let k = 0; k < kernel.length; k++) {
        const sampleY = Math.max(0, Math.min(height - 1, y + k - halfKernel));
        const pixelIndex = (sampleY * width + x) * 4;
        const kernelValue = kernel[k];

        r += data[pixelIndex] * kernelValue;
        g += data[pixelIndex + 1] * kernelValue;
        b += data[pixelIndex + 2] * kernelValue;
      }

      const outputIndex = (y * width + x) * 4;
      outputData[outputIndex] = Math.max(0, Math.min(255, r));
      outputData[outputIndex + 1] = Math.max(0, Math.min(255, g));
      outputData[outputIndex + 2] = Math.max(0, Math.min(255, b));
      outputData[outputIndex + 3] = data[(y * width + x) * 4 + 3];
    }
  }

  return output;
}
