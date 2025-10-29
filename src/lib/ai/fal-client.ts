import { fal } from '@fal-ai/client';

/**
 * Convert base64 data URI to Blob
 */
function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Upload image to fal.ai storage
 */
async function uploadImage(imageUrl: string): Promise<string> {
  // If already a URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If base64, upload to fal.ai storage
  if (imageUrl.startsWith('data:')) {
    const blob = dataURItoBlob(imageUrl);
    const file = new File([blob], 'image.jpg', { type: blob.type });
    const url = await fal.storage.upload(file);
    return url;
  }

  throw new Error('Invalid image URL format');
}

/**
 * Configure fal.ai client
 *
 * API key should be set via environment variable:
 * NEXT_PUBLIC_FAL_KEY=your_key_here
 *
 * ⚠️ SECURITY NOTE:
 * For production, use a backend proxy to hide API keys.
 * See PRODUCTION_CHECKLIST.md for details.
 */
export function configureFalClient() {
  const apiKey = process.env.NEXT_PUBLIC_FAL_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('FAL_KEY not found. AI features will be disabled.');
    }
    return false;
  }

  // Configure client
  fal.config({
    credentials: apiKey,
    // Suppress warning in development (we're aware of the security implications)
    // TODO: For production, implement backend proxy
    requestMiddleware: async (url, options) => {
      // In development, suppress the browser warning
      if (process.env.NODE_ENV === 'development') {
        // Warning is expected - we'll use proxy in production
      }
      return [url, options];
    },
  });

  return true;
}

// Auto-configure on module load
configureFalClient();

/**
 * Nano Banana Input Parameters
 */
export interface NanoBananaInput {
  prompt: string;
  num_images?: number; // 1-4, default: 1
  output_format?: 'jpeg' | 'png' | 'webp'; // default: jpeg
  aspect_ratio?:
    | '21:9'
    | '1:1'
    | '4:3'
    | '3:2'
    | '2:3'
    | '5:4'
    | '4:5'
    | '3:4'
    | '16:9'
    | '9:16'; // default: 1:1
  limit_generations?: boolean; // default: false
  sync_mode?: boolean; // default: false
}

/**
 * Nano Banana Output
 */
export interface NanoBananaOutput {
  images: Array<{
    url: string;
    width?: number;
    height?: number;
    content_type?: string;
  }>;
  description: string;
}

/**
 * Generate image using Nano Banana (text-to-image)
 *
 * @param input - Generation parameters
 * @param onProgress - Progress callback
 * @returns Generated images
 *
 * @example
 * ```ts
 * const result = await generateImage({
 *   prompt: "A black lab swimming",
 *   num_images: 1,
 *   aspect_ratio: "1:1"
 * });
 *
 * console.log(result.images[0].url);
 * ```
 */
export async function generateImage(
  input: NanoBananaInput,
  onProgress?: (update: {
    status: string;
    logs?: Array<{ message: string }>;
  }) => void
): Promise<NanoBananaOutput> {
  try {
    const result = await fal.subscribe('fal-ai/nano-banana', {
      input: {
        prompt: input.prompt,
        num_images: input.num_images || 1,
        output_format: input.output_format || 'jpeg',
        aspect_ratio: input.aspect_ratio || '1:1',
        limit_generations: input.limit_generations ?? false,
        sync_mode: input.sync_mode ?? false,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (onProgress) {
          onProgress({
            status: update.status,
            logs: update.status === 'IN_PROGRESS' ? update.logs : undefined,
          });
        }
      },
    });

    return result.data as NanoBananaOutput;
  } catch (error) {
    console.error('Nano Banana generation failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate image'
    );
  }
}

/**
 * Nano Banana Edit Input Parameters (image-to-image)
 * Based on official fal.ai documentation
 */
export interface NanoBananaEditInput {
  prompt: string; // required
  image_urls: string[]; // required - Array of image URLs
  num_images?: number; // optional, 1-4, default: 1
  output_format?: 'jpeg' | 'png' | 'webp'; // optional, default: jpeg
  aspect_ratio?:
    | '21:9'
    | '1:1'
    | '4:3'
    | '3:2'
    | '2:3'
    | '5:4'
    | '4:5'
    | '3:4'
    | '16:9'
    | '9:16'; // optional, default: None (uses input image aspect ratio)
  sync_mode?: boolean; // optional, default: false
  limit_generations?: boolean; // optional, default: false
}

/**
 * Edit image using Nano Banana (image-to-image)
 *
 * @param input - Edit parameters
 * @param onProgress - Progress callback
 * @returns Edited images
 *
 * @example
 * ```ts
 * const result = await editImage({
 *   prompt: "make the sky more dramatic",
 *   image_urls: ["https://example.com/image.jpg"],
 *   num_images: 1
 * });
 *
 * console.log(result.images[0].url);
 * ```
 */
export async function editImage(
  input: NanoBananaEditInput,
  onProgress?: (update: {
    status: string;
    logs?: Array<{ message: string }>;
  }) => void
): Promise<NanoBananaOutput> {
  try {
    // Upload base64 images to fal.ai storage first
    if (onProgress) {
      onProgress({
        status: 'UPLOADING',
        logs: [{ message: 'Uploading image...' }],
      });
    }

    const uploadedUrls = await Promise.all(
      input.image_urls.map((url) => uploadImage(url))
    );

    // Build API input according to official documentation
    const apiInput: {
      prompt: string;
      image_urls: string[];
      num_images?: number;
      output_format?: string;
      aspect_ratio?: string;
      sync_mode?: boolean;
      limit_generations?: boolean;
    } = {
      prompt: input.prompt.trim() || 'enhance the image',
      image_urls: uploadedUrls,
    };

    // Add optional parameters if provided
    if (input.num_images !== undefined) {
      apiInput.num_images = input.num_images;
    }
    if (input.output_format) {
      apiInput.output_format = input.output_format;
    }
    if (input.aspect_ratio) {
      apiInput.aspect_ratio = input.aspect_ratio;
    }
    if (input.sync_mode !== undefined) {
      apiInput.sync_mode = input.sync_mode;
    }
    if (input.limit_generations !== undefined) {
      apiInput.limit_generations = input.limit_generations;
    }

    console.log('Sending to Nano Banana edit API:', apiInput);

    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: apiInput,
      logs: true,
      onQueueUpdate: (update) => {
        if (onProgress) {
          onProgress({
            status: update.status,
            logs: update.status === 'IN_PROGRESS' ? update.logs : undefined,
          });
        }
      },
    });

    return result.data as NanoBananaOutput;
  } catch (error) {
    console.error('Nano Banana edit failed:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to edit image'
    );
  }
}

/**
 * Check if fal.ai is configured
 */
export function isFalConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FAL_KEY;
}
