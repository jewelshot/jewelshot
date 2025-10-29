/**
 * useTextToImage Hook Tests
 *
 * Tests for the text-to-image generation hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTextToImage } from '@/hooks/useTextToImage';
import * as falClient from '@/lib/ai/fal-client';
import type { GenerateInput, FalOutput } from '@/lib/ai/fal-client';

// Mock dependencies
vi.mock('@/lib/ai/fal-client');

describe('useTextToImage', () => {
  const mockSuccessOutput: FalOutput = {
    images: [
      {
        url: 'https://example.com/generated-image.jpg',
        width: 1024,
        height: 1024,
        content_type: 'image/jpeg',
      },
    ],
    description: 'A generated image',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock: successful generation
    vi.mocked(falClient.generateImage).mockResolvedValue(mockSuccessOutput);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useTextToImage());

      expect(result.current.isGenerating).toBe(false);
      expect(result.current.progress).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
    });

    it('should provide generate and reset functions', () => {
      const { result } = renderHook(() => useTextToImage());

      expect(typeof result.current.generate).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Successful Generation Flow', () => {
    it('should generate an image successfully', async () => {
      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'A beautiful sunset over mountains',
      };

      let generatePromise: Promise<FalOutput>;
      act(() => {
        generatePromise = result.current.generate(input);
      });

      // Should be generating
      expect(result.current.isGenerating).toBe(true);
      expect(result.current.progress).toBe('Initializing...');

      await act(async () => {
        await generatePromise!;
      });

      // Should complete successfully
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toEqual(mockSuccessOutput);
      expect(result.current.progress).toBe('Generation complete!');
    });

    it('should call generateImage with correct parameters', async () => {
      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'A modern jewelry piece',
        num_images: 2,
        output_format: 'png',
        aspect_ratio: '16:9',
      };

      await act(async () => {
        await result.current.generate(input);
      });

      expect(falClient.generateImage).toHaveBeenCalledWith(
        input,
        expect.any(Function) // progress callback
      );
    });

    it('should call onSuccess callback when generation succeeds', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useTextToImage({ onSuccess }));

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        await result.current.generate(input);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockSuccessOutput);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('should handle minimal input', async () => {
      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Simple prompt',
      };

      await act(async () => {
        await result.current.generate(input);
      });

      expect(result.current.result).toEqual(mockSuccessOutput);
      expect(falClient.generateImage).toHaveBeenCalledWith(
        input,
        expect.any(Function)
      );
    });
  });

  describe('Progress Updates', () => {
    it('should update progress during generation', async () => {
      const progressStates: string[] = [];

      vi.mocked(falClient.generateImage).mockImplementation(
        async (
          _input: GenerateInput,
          onProgress?: (status: string, message: string) => void
        ) => {
          onProgress?.('IN_QUEUE', 'Initializing model...');
          onProgress?.('IN_PROGRESS', 'Generating image...');
          onProgress?.('COMPLETED', 'Generation complete');
          return mockSuccessOutput;
        }
      );

      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      act(() => {
        progressStates.push(result.current.progress); // Should be empty initially
        result.current.generate(input);
      });

      // Progress is set after generate() is called
      await waitFor(() => {
        expect(result.current.isGenerating).toBe(false);
      });

      expect(falClient.generateImage).toHaveBeenCalled();
      expect(result.current.progress).toBe('Generation complete!');
    });

    it('should set initial progress state', async () => {
      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test',
      };

      act(() => {
        result.current.generate(input);
      });

      expect(result.current.progress).toBe('Initializing...');

      await waitFor(() => {
        expect(result.current.isGenerating).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle generation errors', async () => {
      const mockError = new Error('API error');
      vi.mocked(falClient.generateImage).mockRejectedValue(mockError);

      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        try {
          await result.current.generate(input);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.isGenerating).toBe(false);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.progress).toBe('');
    });

    it('should call onError callback when generation fails', async () => {
      const mockError = new Error('Network error');
      const onError = vi.fn();

      vi.mocked(falClient.generateImage).mockRejectedValue(mockError);

      const { result } = renderHook(() => useTextToImage({ onError }));

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        try {
          await result.current.generate(input);
        } catch {
          // Expected
        }
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should handle unknown errors', async () => {
      vi.mocked(falClient.generateImage).mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        try {
          await result.current.generate(input);
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Unknown error');
    });

    it('should clear result on error', async () => {
      const { result } = renderHook(() => useTextToImage());

      // First successful generation
      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        await result.current.generate(input);
      });

      expect(result.current.result).not.toBeNull();

      // Now fail
      vi.mocked(falClient.generateImage).mockRejectedValue(
        new Error('Test error')
      );

      await act(async () => {
        try {
          await result.current.generate(input);
        } catch {
          // Expected
        }
      });

      expect(result.current.result).toBeNull();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useTextToImage());

      // First, generate an image
      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        await result.current.generate(input);
      });

      // Verify state is set
      expect(result.current.result).not.toBeNull();
      expect(result.current.progress).not.toBe('');

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify state is reset
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.progress).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
    });

    it('should reset after error', async () => {
      vi.mocked(falClient.generateImage).mockRejectedValue(
        new Error('Test error')
      );

      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      await act(async () => {
        try {
          await result.current.generate(input);
        } catch {
          // Expected
        }
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Multiple Generation Calls', () => {
    it('should handle sequential generations', async () => {
      const { result } = renderHook(() => useTextToImage());

      const input1: GenerateInput = {
        prompt: 'First prompt',
      };

      const input2: GenerateInput = {
        prompt: 'Second prompt',
      };

      // First generation
      await act(async () => {
        await result.current.generate(input1);
      });

      expect(result.current.result).toEqual(mockSuccessOutput);

      // Second generation
      await act(async () => {
        await result.current.generate(input2);
      });

      expect(result.current.result).toEqual(mockSuccessOutput);
      expect(falClient.generateImage).toHaveBeenCalledTimes(2);
    });

    it('should clear previous error on new generation', async () => {
      vi.mocked(falClient.generateImage).mockRejectedValueOnce(
        new Error('First error')
      );
      vi.mocked(falClient.generateImage).mockResolvedValueOnce(
        mockSuccessOutput
      );

      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test prompt',
      };

      // First generation fails
      await act(async () => {
        try {
          await result.current.generate(input);
        } catch {
          // Expected
        }
      });

      expect(result.current.error).not.toBeNull();

      // Second generation succeeds
      await act(async () => {
        await result.current.generate(input);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.result).toEqual(mockSuccessOutput);
    });
  });

  describe('Different Aspect Ratios', () => {
    it('should handle 16:9 aspect ratio', async () => {
      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Wide image',
        aspect_ratio: '16:9',
      };

      await act(async () => {
        await result.current.generate(input);
      });

      expect(falClient.generateImage).toHaveBeenCalledWith(
        expect.objectContaining({
          aspect_ratio: '16:9',
        }),
        expect.any(Function)
      );
    });

    it('should handle multiple output formats', async () => {
      const { result } = renderHook(() => useTextToImage());

      const formats: Array<'jpeg' | 'png' | 'webp'> = ['jpeg', 'png', 'webp'];

      for (const format of formats) {
        const input: GenerateInput = {
          prompt: 'Test',
          output_format: format,
        };

        await act(async () => {
          await result.current.generate(input);
        });

        expect(falClient.generateImage).toHaveBeenCalledWith(
          expect.objectContaining({
            output_format: format,
          }),
          expect.any(Function)
        );
      }
    });
  });

  describe('Multiple Images', () => {
    it('should handle multiple image generation', async () => {
      const multiImageOutput: FalOutput = {
        images: [
          { url: 'https://example.com/image1.jpg' },
          { url: 'https://example.com/image2.jpg' },
          { url: 'https://example.com/image3.jpg' },
        ],
        description: 'Multiple images',
      };

      vi.mocked(falClient.generateImage).mockResolvedValue(multiImageOutput);

      const { result } = renderHook(() => useTextToImage());

      const input: GenerateInput = {
        prompt: 'Test',
        num_images: 3,
      };

      await act(async () => {
        await result.current.generate(input);
      });

      expect(result.current.result?.images).toHaveLength(3);
    });
  });
});
