/**
 * Fal.ai Client Tests
 *
 * Tests for the AI image generation and editing client.
 * These tests mock the fal.ai API to ensure proper functionality.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateImage, editImage } from '@/lib/ai/fal-client';
import type { GenerateInput, EditInput, FalOutput } from '@/lib/ai/fal-client';

// Mock fal.ai client
vi.mock('@fal-ai/client', () => {
  const mockFal = {
    config: vi.fn(),
    storage: {
      upload: vi.fn(),
    },
    subscribe: vi.fn(),
  };
  return {
    fal: mockFal,
  };
});

// Import the mocked fal after setting up the mock
import { fal } from '@fal-ai/client';

describe('fal-client', () => {
  const mockSuccessOutput: FalOutput = {
    images: [
      {
        url: 'https://example.com/generated-image.jpg',
        width: 1024,
        height: 1024,
        content_type: 'image/jpeg',
      },
    ],
    description: 'A beautiful generated image',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Default mock implementation for fal.subscribe
    (fal.subscribe as unknown).mockResolvedValue({
      data: mockSuccessOutput,
    });

    // Default mock for storage.upload
    (fal.storage.upload as unknown).mockResolvedValue(
      'https://fal.ai/storage/mock-image.jpg'
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateImage', () => {
    it('should generate an image with minimal input', async () => {
      const input: GenerateInput = {
        prompt: 'A beautiful sunset',
      };

      const result = await generateImage(input);

      expect(result).toEqual(mockSuccessOutput);
      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana',
        expect.objectContaining({
          input: expect.objectContaining({
            prompt: 'A beautiful sunset',
            num_images: 1,
            output_format: 'jpeg',
            aspect_ratio: '1:1',
          }),
          logs: true,
        })
      );
    });

    it('should generate an image with custom parameters', async () => {
      const input: GenerateInput = {
        prompt: 'A modern jewelry piece',
        num_images: 2,
        output_format: 'png',
        aspect_ratio: '16:9',
      };

      const result = await generateImage(input);

      expect(result).toEqual(mockSuccessOutput);
      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana',
        expect.objectContaining({
          input: {
            prompt: 'A modern jewelry piece',
            num_images: 2,
            output_format: 'png',
            aspect_ratio: '16:9',
          },
        })
      );
    });

    it('should call progress callback during generation', async () => {
      const onProgress = vi.fn();
      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      // Mock subscribe to call onQueueUpdate
      (fal.subscribe as unknown).mockImplementation(
        async (
          _model: unknown,
          options: { onQueueUpdate?: (update: unknown) => void }
        ) => {
          // Simulate queue updates
          options.onQueueUpdate?.({
            status: 'IN_QUEUE',
            logs: [{ message: 'Model loading...' }],
          });
          options.onQueueUpdate?.({
            status: 'IN_PROGRESS',
            logs: [{ message: 'Generating image...' }],
          });
          return { data: mockSuccessOutput };
        }
      );

      await generateImage(input, onProgress);

      expect(onProgress).toHaveBeenCalledWith(
        'INITIALIZING',
        'Starting generation...'
      );
      expect(onProgress).toHaveBeenCalledWith(
        'IN_QUEUE',
        'Waiting in queue...'
      );
      expect(onProgress).toHaveBeenCalledWith(
        'IN_PROGRESS',
        'Generating image...'
      );
    });

    it('should handle generation errors', async () => {
      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      const mockError = new Error('API rate limit exceeded');
      (fal.subscribe as unknown).mockRejectedValue(mockError);

      await expect(generateImage(input)).rejects.toThrow(
        'API rate limit exceeded'
      );
    });

    it('should handle unknown errors gracefully', async () => {
      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      (fal.subscribe as unknown).mockRejectedValue('Unknown error');

      await expect(generateImage(input)).rejects.toBe('Unknown error');
    });
  });

  describe('editImage', () => {
    it('should edit an image with external URL', async () => {
      const input: EditInput = {
        prompt: 'Make it more vibrant',
        image_url: 'https://example.com/original.jpg',
      };

      const result = await editImage(input);

      expect(result).toEqual(mockSuccessOutput);
      expect(fal.storage.upload).not.toHaveBeenCalled(); // External URL, no upload needed
      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana/edit',
        expect.objectContaining({
          input: expect.objectContaining({
            prompt: 'Make it more vibrant',
            image_urls: ['https://example.com/original.jpg'], // Edit API uses array
            num_images: 1,
            output_format: 'jpeg',
          }),
        })
      );
    });

    it('should upload and edit a base64 image', async () => {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const input: EditInput = {
        prompt: 'Enhance the colors',
        image_url: base64Image,
      };

      const result = await editImage(input);

      expect(fal.storage.upload).toHaveBeenCalled();
      expect(result).toEqual(mockSuccessOutput);
      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana/edit',
        expect.objectContaining({
          input: expect.objectContaining({
            prompt: 'Enhance the colors',
            image_urls: ['https://fal.ai/storage/mock-image.jpg'], // Edit API uses array
          }),
        })
      );
    });

    it('should edit with custom parameters', async () => {
      const input: EditInput = {
        prompt: 'Add dramatic lighting',
        image_url: 'https://example.com/image.jpg',
        num_images: 3,
        output_format: 'webp',
        aspect_ratio: '4:3',
      };

      const result = await editImage(input);

      expect(result).toEqual(mockSuccessOutput);
      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana/edit',
        expect.objectContaining({
          input: {
            prompt: 'Add dramatic lighting',
            image_urls: ['https://example.com/image.jpg'], // Edit API uses array
            num_images: 3,
            output_format: 'webp',
          },
        })
      );
    });

    it('should call progress callback during editing', async () => {
      const onProgress = vi.fn();
      const input: EditInput = {
        prompt: 'Test edit',
        image_url: 'https://example.com/image.jpg',
      };

      // Mock subscribe to call onQueueUpdate
      (fal.subscribe as unknown).mockImplementation(
        async (
          _model: unknown,
          options: { onQueueUpdate?: (update: unknown) => void }
        ) => {
          options.onQueueUpdate?.({
            status: 'IN_QUEUE',
            logs: [{ message: 'Model loading...' }],
          });
          options.onQueueUpdate?.({
            status: 'IN_PROGRESS',
            logs: [{ message: 'Processing...' }],
          });
          return { data: mockSuccessOutput };
        }
      );

      await editImage(input, onProgress);

      expect(onProgress).toHaveBeenCalledWith(
        'UPLOADING',
        'Uploading image...'
      );
      expect(onProgress).toHaveBeenCalledWith(
        'EDITING',
        'Processing with AI...'
      );
      expect(onProgress).toHaveBeenCalledWith(
        'IN_QUEUE',
        'Waiting in queue...'
      );
      expect(onProgress).toHaveBeenCalledWith('IN_PROGRESS', 'Processing...');
    });

    it('should handle edit errors', async () => {
      const input: EditInput = {
        prompt: 'Test edit',
        image_url: 'https://example.com/image.jpg',
      };

      const mockError = new Error('Invalid image format');
      (fal.subscribe as unknown).mockRejectedValue(mockError);

      await expect(editImage(input)).rejects.toThrow('Invalid image format');
    });

    it('should handle upload errors', async () => {
      const base64Image = 'data:image/png;base64,invalid';
      const input: EditInput = {
        prompt: 'Test edit',
        image_url: base64Image,
      };

      const mockError = new Error('Upload failed');
      (fal.storage.upload as unknown).mockRejectedValue(mockError);

      await expect(editImage(input)).rejects.toThrow('Upload failed');
    });

    it('should reject invalid image URL format', async () => {
      const input: EditInput = {
        prompt: 'Test edit',
        image_url: 'invalid-url',
      };

      // This will fail during the uploadIfNeeded internal call
      await expect(editImage(input)).rejects.toThrow();
    });
  });

  describe('Output format', () => {
    it('should return properly structured FalOutput', async () => {
      const input: GenerateInput = {
        prompt: 'Test',
      };

      const result = await generateImage(input);

      expect(result).toHaveProperty('images');
      expect(result).toHaveProperty('description');
      expect(Array.isArray(result.images)).toBe(true);
      expect(result.images[0]).toHaveProperty('url');
      expect(typeof result.images[0].url).toBe('string');
    });

    it('should handle multiple images in output', async () => {
      const multiImageOutput: FalOutput = {
        images: [
          { url: 'https://example.com/image1.jpg' },
          { url: 'https://example.com/image2.jpg' },
          { url: 'https://example.com/image3.jpg' },
        ],
        description: 'Multiple generated images',
      };

      (fal.subscribe as unknown).mockResolvedValue({ data: multiImageOutput });

      const input: GenerateInput = {
        prompt: 'Test',
        num_images: 3,
      };

      const result = await generateImage(input);

      expect(result.images).toHaveLength(3);
      expect(result.images[0].url).toBe('https://example.com/image1.jpg');
      expect(result.images[2].url).toBe('https://example.com/image3.jpg');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty prompt gracefully', async () => {
      const input: GenerateInput = {
        prompt: '',
      };

      await generateImage(input);

      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana',
        expect.objectContaining({
          input: expect.objectContaining({
            prompt: '',
          }),
        })
      );
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'a'.repeat(1000);
      const input: GenerateInput = {
        prompt: longPrompt,
      };

      await generateImage(input);

      expect(fal.subscribe).toHaveBeenCalledWith(
        'fal-ai/nano-banana',
        expect.objectContaining({
          input: expect.objectContaining({
            prompt: longPrompt,
          }),
        })
      );
    });

    it('should handle special characters in prompt', async () => {
      const input: GenerateInput = {
        prompt: 'Test with émojis 🎨 and spëcial çhars: @#$%^&*()',
      };

      await generateImage(input);

      expect(fal.subscribe).toHaveBeenCalled();
    });
  });
});
