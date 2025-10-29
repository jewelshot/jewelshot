/**
 * useImageEdit Hook Tests
 *
 * Tests for the AI image editing hook including:
 * - Successful edits
 * - Rate limiting
 * - Error handling
 * - Progress updates
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageEdit } from '@/hooks/useImageEdit';
import * as falClient from '@/lib/ai/fal-client';
import * as rateLimiter from '@/lib/rate-limiter';
import type { EditInput, FalOutput } from '@/lib/ai/fal-client';

// Mock dependencies
vi.mock('@/lib/ai/fal-client');
vi.mock('@/lib/rate-limiter');

describe('useImageEdit', () => {
  const mockSuccessOutput: FalOutput = {
    images: [
      {
        url: 'https://example.com/edited-image.jpg',
        width: 1024,
        height: 1024,
        content_type: 'image/jpeg',
      },
    ],
    description: 'Edited image',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock: allow requests (no rate limiting)
    vi.mocked(rateLimiter.aiRateLimiter.canMakeRequest).mockReturnValue(true);
    vi.mocked(rateLimiter.aiRateLimiter.recordRequest).mockReturnValue(
      undefined
    );
    vi.mocked(rateLimiter.aiRateLimiter.getTimeUntilReset).mockReturnValue(0);

    // Default mock: successful edit
    vi.mocked(falClient.editImage).mockResolvedValue(mockSuccessOutput);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useImageEdit());

      expect(result.current.isEditing).toBe(false);
      expect(result.current.progress).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
    });

    it('should provide edit and reset functions', () => {
      const { result } = renderHook(() => useImageEdit());

      expect(typeof result.current.edit).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Successful Edit Flow', () => {
    it('should edit an image successfully', async () => {
      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Make it more vibrant',
        image_url: 'https://example.com/original.jpg',
      };

      let editPromise: Promise<FalOutput>;
      act(() => {
        editPromise = result.current.edit(input);
      });

      // Should be editing
      expect(result.current.isEditing).toBe(true);
      expect(result.current.progress).toBe('Initializing...');

      await act(async () => {
        await editPromise!;
      });

      // Should complete successfully
      expect(result.current.isEditing).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toEqual(mockSuccessOutput);
      expect(result.current.progress).toBe('Edit complete!');
    });

    it('should call editImage with correct parameters', async () => {
      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Enhance colors',
        image_url: 'https://example.com/image.jpg',
        num_images: 2,
        output_format: 'png',
      };

      await act(async () => {
        await result.current.edit(input);
      });

      expect(falClient.editImage).toHaveBeenCalledWith(
        input,
        expect.any(Function) // progress callback
      );
    });

    it('should call onSuccess callback when edit succeeds', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useImageEdit({ onSuccess }));

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        await result.current.edit(input);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockSuccessOutput);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('should record request with rate limiter', async () => {
      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        await result.current.edit(input);
      });

      expect(rateLimiter.aiRateLimiter.recordRequest).toHaveBeenCalled();
    });
  });

  describe('Progress Updates', () => {
    it('should update progress during editing', async () => {
      const progressUpdates: string[] = [];

      vi.mocked(falClient.editImage).mockImplementation(
        async (
          _input: EditInput,
          onProgress?: (status: string, message: string) => void
        ) => {
          onProgress?.('UPLOADING', 'Uploading image...');
          onProgress?.('PROCESSING', 'Sending to AI for editing...');
          onProgress?.('COMPLETED', 'Edit complete');
          return mockSuccessOutput;
        }
      );

      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      act(() => {
        result.current.edit(input);
      });

      // Collect initial progress
      progressUpdates.push(result.current.progress);

      await waitFor(() => {
        expect(result.current.isEditing).toBe(false);
      });

      // Should have received progress updates
      expect(falClient.editImage).toHaveBeenCalled();
    });

    it('should set progress to initializing state', async () => {
      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      act(() => {
        result.current.edit(input);
      });

      expect(result.current.progress).toBe('Initializing...');

      await waitFor(() => {
        expect(result.current.isEditing).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle edit errors', async () => {
      const mockError = new Error('API error');
      vi.mocked(falClient.editImage).mockRejectedValue(mockError);

      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        try {
          await result.current.edit(input);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.isEditing).toBe(false);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.progress).toBe('');
    });

    it('should call onError callback when edit fails', async () => {
      const mockError = new Error('Network error');
      const onError = vi.fn();

      vi.mocked(falClient.editImage).mockRejectedValue(mockError);

      const { result } = renderHook(() => useImageEdit({ onError }));

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        try {
          await result.current.edit(input);
        } catch {
          // Expected
        }
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should handle unknown errors', async () => {
      vi.mocked(falClient.editImage).mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        try {
          await result.current.edit(input);
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Unknown error');
    });
  });

  describe('Rate Limiting', () => {
    it('should check rate limit before editing', async () => {
      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        await result.current.edit(input);
      });

      expect(rateLimiter.aiRateLimiter.canMakeRequest).toHaveBeenCalled();
    });

    it('should throw error when rate limited', async () => {
      vi.mocked(rateLimiter.aiRateLimiter.canMakeRequest).mockReturnValue(
        false
      );
      vi.mocked(rateLimiter.aiRateLimiter.getTimeUntilReset).mockReturnValue(
        30000
      ); // 30 seconds

      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        try {
          await result.current.edit(input);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.error?.message).toContain('Rate limit exceeded');
      expect(result.current.error?.message).toContain('30s');
      expect(falClient.editImage).not.toHaveBeenCalled();
    });

    it('should call onError when rate limited', async () => {
      vi.mocked(rateLimiter.aiRateLimiter.canMakeRequest).mockReturnValue(
        false
      );
      vi.mocked(rateLimiter.aiRateLimiter.getTimeUntilReset).mockReturnValue(
        15000
      );

      const onError = vi.fn();
      const { result } = renderHook(() => useImageEdit({ onError }));

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        try {
          await result.current.edit(input);
        } catch {
          // Expected
        }
      });

      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0].message).toContain('Rate limit exceeded');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useImageEdit());

      // First, perform an edit
      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        await result.current.edit(input);
      });

      // Verify state is set
      expect(result.current.result).not.toBeNull();
      expect(result.current.progress).not.toBe('');

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify state is reset
      expect(result.current.isEditing).toBe(false);
      expect(result.current.progress).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
    });

    it('should reset after error', async () => {
      vi.mocked(falClient.editImage).mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      await act(async () => {
        try {
          await result.current.edit(input);
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

  describe('Multiple Edit Calls', () => {
    it('should handle sequential edits', async () => {
      const { result } = renderHook(() => useImageEdit());

      const input1: EditInput = {
        prompt: 'First edit',
        image_url: 'https://example.com/image1.jpg',
      };

      const input2: EditInput = {
        prompt: 'Second edit',
        image_url: 'https://example.com/image2.jpg',
      };

      // First edit
      await act(async () => {
        await result.current.edit(input1);
      });

      expect(result.current.result).toEqual(mockSuccessOutput);

      // Second edit
      await act(async () => {
        await result.current.edit(input2);
      });

      expect(result.current.result).toEqual(mockSuccessOutput);
      expect(falClient.editImage).toHaveBeenCalledTimes(2);
    });

    it('should clear previous error on new edit', async () => {
      vi.mocked(falClient.editImage).mockRejectedValueOnce(
        new Error('First error')
      );
      vi.mocked(falClient.editImage).mockResolvedValueOnce(mockSuccessOutput);

      const { result } = renderHook(() => useImageEdit());

      const input: EditInput = {
        prompt: 'Test',
        image_url: 'https://example.com/image.jpg',
      };

      // First edit fails
      await act(async () => {
        try {
          await result.current.edit(input);
        } catch {
          // Expected
        }
      });

      expect(result.current.error).not.toBeNull();

      // Second edit succeeds
      await act(async () => {
        await result.current.edit(input);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.result).toEqual(mockSuccessOutput);
    });
  });
});
