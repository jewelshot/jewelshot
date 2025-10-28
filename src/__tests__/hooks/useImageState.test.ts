import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useImageState } from '@/hooks/useImageState';

describe('useImageState', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useImageState());

      expect(result.current.uploadedImage).toBeNull();
      expect(result.current.fileName).toBe('');
      expect(result.current.fileSize).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setUploadedImage', () => {
    it('should update uploaded image', () => {
      const { result } = renderHook(() => useImageState());
      const testImage = 'data:image/png;base64,test';

      act(() => {
        result.current.setUploadedImage(testImage);
      });

      expect(result.current.uploadedImage).toBe(testImage);
    });

    it('should accept null to clear image', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setUploadedImage('data:image/png;base64,test');
        result.current.setUploadedImage(null);
      });

      expect(result.current.uploadedImage).toBeNull();
    });
  });

  describe('setFileName', () => {
    it('should update file name', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setFileName('test-image.jpg');
      });

      expect(result.current.fileName).toBe('test-image.jpg');
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setFileName('image.png');
        result.current.setFileName('');
      });

      expect(result.current.fileName).toBe('');
    });
  });

  describe('setFileSize', () => {
    it('should update file size', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setFileSize(1024);
      });

      expect(result.current.fileSize).toBe(1024);
    });

    it('should handle zero size', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setFileSize(2048);
        result.current.setFileSize(0);
      });

      expect(result.current.fileSize).toBe(0);
    });
  });

  describe('setIsLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setIsLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setIsLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('resetImageState', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useImageState());

      // Set some values
      act(() => {
        result.current.setUploadedImage('data:image/png;base64,test');
        result.current.setFileName('test.jpg');
        result.current.setFileSize(2048);
        result.current.setIsLoading(true);
      });

      // Verify values are set
      expect(result.current.uploadedImage).toBe('data:image/png;base64,test');
      expect(result.current.fileName).toBe('test.jpg');
      expect(result.current.fileSize).toBe(2048);
      expect(result.current.isLoading).toBe(true);

      // Reset
      act(() => {
        result.current.resetImageState();
      });

      // Verify all reset
      expect(result.current.uploadedImage).toBeNull();
      expect(result.current.fileName).toBe('');
      expect(result.current.fileSize).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('should maintain resetImageState reference stability', () => {
      const { result, rerender } = renderHook(() => useImageState());
      const firstReset = result.current.resetImageState;

      rerender();

      expect(result.current.resetImageState).toBe(firstReset);
    });
  });

  describe('state independence', () => {
    it('should update states independently', () => {
      const { result } = renderHook(() => useImageState());

      act(() => {
        result.current.setFileName('test.jpg');
      });

      expect(result.current.fileName).toBe('test.jpg');
      expect(result.current.uploadedImage).toBeNull();
      expect(result.current.fileSize).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('typical usage workflow', () => {
    it('should handle complete upload workflow', () => {
      const { result } = renderHook(() => useImageState());

      // Start loading
      act(() => {
        result.current.setIsLoading(true);
        result.current.setFileName('photo.jpg');
        result.current.setFileSize(1024 * 500); // 500KB
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.fileName).toBe('photo.jpg');
      expect(result.current.fileSize).toBe(512000);

      // Upload complete
      act(() => {
        result.current.setUploadedImage('data:image/jpeg;base64,/9j/...');
        result.current.setIsLoading(false);
      });

      expect(result.current.uploadedImage).toBe(
        'data:image/jpeg;base64,/9j/...'
      );
      expect(result.current.isLoading).toBe(false);

      // Close image
      act(() => {
        result.current.resetImageState();
      });

      expect(result.current.uploadedImage).toBeNull();
      expect(result.current.fileName).toBe('');
      expect(result.current.fileSize).toBe(0);
    });
  });
});
