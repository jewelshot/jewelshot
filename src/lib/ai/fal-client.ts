/**
 * ============================================================================
 * FAL.AI CLIENT - CLEAN & MINIMAL IMPLEMENTATION
 * ============================================================================
 *
 * This is a fresh, minimal integration with fal.ai Nano Banana API.
 * Following the official documentation exactly:
 * https://fal.ai/models/fal-ai/nano-banana
 * https://fal.ai/models/fal-ai/nano-banana/edit
 */

import { fal } from '@fal-ai/client';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Initialize fal.ai client with API key
 */
function initializeFalClient() {
  const apiKey = process.env.NEXT_PUBLIC_FAL_KEY;

  if (!apiKey) {
    console.warn('⚠️ FAL_KEY not found. AI features will be disabled.');
    return;
  }

  fal.config({
    credentials: apiKey,
  });
}

// Auto-initialize on import
initializeFalClient();

// ============================================================================
// TYPES - Based on official fal.ai documentation
// ============================================================================

/**
 * Text-to-Image Generation Input
 */
export interface GenerateInput {
  prompt: string;
  num_images?: number;
  output_format?: 'jpeg' | 'png' | 'webp';
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
    | '9:16';
}

/**
 * Image-to-Image Edit Input
 */
export interface EditInput {
  prompt: string;
  image_url: string; // Single image URL or data URI
  num_images?: number;
  output_format?: 'jpeg' | 'png' | 'webp';
}

/**
 * API Output (both generate and edit return this)
 */
export interface FalOutput {
  images: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  description?: string;
}

/**
 * Progress callback
 */
export type ProgressCallback = (status: string, message?: string) => void;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Upload a data URI or blob to fal.ai storage
 * Only uploads if it's a base64 data URI, otherwise returns the URL as-is
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  // If it's already a URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a data URI, upload it
  if (imageUrl.startsWith('data:')) {
    // Convert data URI to Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });

    // Upload to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    return uploadedUrl;
  }

  throw new Error('Invalid image URL format');
}

// ============================================================================
// TEXT-TO-IMAGE GENERATION
// ============================================================================

/**
 * Generate image from text prompt
 *
 * @example
 * ```ts
 * const result = await generateImage({
 *   prompt: "A jewelry ring on white background",
 *   aspect_ratio: "16:9"
 * });
 * console.log(result.images[0].url);
 * ```
 */
export async function generateImage(
  input: GenerateInput,
  onProgress?: ProgressCallback
): Promise<FalOutput> {
  try {
    if (onProgress) onProgress('INITIALIZING', 'Starting generation...');

    const result = await fal.subscribe('fal-ai/nano-banana', {
      input: {
        prompt: input.prompt,
        num_images: input.num_images ?? 1,
        output_format: input.output_format ?? 'jpeg',
        aspect_ratio: input.aspect_ratio ?? '1:1',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (onProgress) {
          if (update.status === 'IN_QUEUE') {
            onProgress('IN_QUEUE', 'Waiting in queue...');
          } else if (update.status === 'IN_PROGRESS') {
            const lastLog = update.logs?.[update.logs.length - 1];
            onProgress('IN_PROGRESS', lastLog?.message || 'Generating...');
          } else if (update.status === 'COMPLETED') {
            onProgress('COMPLETED', 'Generation complete!');
          }
        }
      },
    });

    return result.data as FalOutput;
  } catch (error) {
    console.error('❌ Generation failed:', error);
    throw error;
  }
}

// ============================================================================
// IMAGE-TO-IMAGE EDITING
// ============================================================================

/**
 * Edit existing image with AI
 *
 * @example
 * ```ts
 * const result = await editImage({
 *   prompt: "enhance lighting and colors",
 *   image_url: "https://example.com/image.jpg"
 * });
 * console.log(result.images[0].url);
 * ```
 */
export async function editImage(
  input: EditInput,
  onProgress?: ProgressCallback
): Promise<FalOutput> {
  try {
    // Step 1: Upload image if needed
    if (onProgress) onProgress('UPLOADING', 'Uploading image...');

    const uploadedUrl = await uploadIfNeeded(input.image_url);
    console.log('✅ Image uploaded:', uploadedUrl);

    // Step 2: Call edit API
    if (onProgress) onProgress('EDITING', 'Processing with AI...');

    // Build the API request - exactly as per documentation
    const apiRequest = {
      prompt: input.prompt,
      image_urls: [uploadedUrl], // Edit API expects an array
      num_images: input.num_images ?? 1,
      output_format: input.output_format ?? 'jpeg',
    };

    console.log('🚀 Calling fal-ai/nano-banana/edit with:', apiRequest);

    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: apiRequest,
      logs: true,
      onQueueUpdate: (update) => {
        if (onProgress) {
          if (update.status === 'IN_QUEUE') {
            onProgress('IN_QUEUE', 'Waiting in queue...');
          } else if (update.status === 'IN_PROGRESS') {
            const lastLog = update.logs?.[update.logs.length - 1];
            onProgress('IN_PROGRESS', lastLog?.message || 'Editing...');
          } else if (update.status === 'COMPLETED') {
            onProgress('COMPLETED', 'Edit complete!');
          }
        }
      },
    });

    console.log('✅ Edit successful:', result.data);
    return result.data as FalOutput;
  } catch (error) {
    console.error('❌ Edit failed:', error);
    throw error;
  }
}

/**
 * Check if fal.ai is configured
 */
export function isFalConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FAL_KEY;
}
