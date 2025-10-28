import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCanvasUI } from '@/hooks/useCanvasUI';

describe('useCanvasUI', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCanvasUI());

      expect(result.current.isFullscreen).toBe(false);
      expect(result.current.background).toBe('none');
      expect(result.current.cropRatio).toBeNull();
      expect(result.current.isCropMode).toBe(false);
    });
  });

  describe('isFullscreen', () => {
    it('should toggle fullscreen state', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setIsFullscreen(true);
      });

      expect(result.current.isFullscreen).toBe(true);

      act(() => {
        result.current.setIsFullscreen(false);
      });

      expect(result.current.isFullscreen).toBe(false);
    });
  });

  describe('background', () => {
    it('should update background', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setBackground('black');
      });

      expect(result.current.background).toBe('black');
    });

    it('should handle all background types', () => {
      const { result } = renderHook(() => useCanvasUI());
      const backgrounds: Array<'none' | 'black' | 'gray' | 'white' | 'alpha'> =
        ['none', 'black', 'gray', 'white', 'alpha'];

      backgrounds.forEach((bg) => {
        act(() => {
          result.current.setBackground(bg);
        });
        expect(result.current.background).toBe(bg);
      });
    });
  });

  describe('cropRatio', () => {
    it('should set crop ratio', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setCropRatio(16 / 9);
      });

      expect(result.current.cropRatio).toBeCloseTo(1.7778, 4);
    });

    it('should handle null crop ratio (free crop)', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setCropRatio(4 / 3);
        result.current.setCropRatio(null);
      });

      expect(result.current.cropRatio).toBeNull();
    });

    it('should handle various aspect ratios', () => {
      const { result } = renderHook(() => useCanvasUI());
      const ratios = [1 / 1, 4 / 3, 16 / 9, 9 / 16, 21 / 9];

      ratios.forEach((ratio) => {
        act(() => {
          result.current.setCropRatio(ratio);
        });
        expect(result.current.cropRatio).toBeCloseTo(ratio, 4);
      });
    });
  });

  describe('isCropMode', () => {
    it('should toggle crop mode', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setIsCropMode(true);
      });

      expect(result.current.isCropMode).toBe(true);

      act(() => {
        result.current.setIsCropMode(false);
      });

      expect(result.current.isCropMode).toBe(false);
    });
  });

  describe('resetCropState', () => {
    it('should reset crop-related state', () => {
      const { result } = renderHook(() => useCanvasUI());

      // Set crop values
      act(() => {
        result.current.setIsCropMode(true);
        result.current.setCropRatio(16 / 9);
      });

      expect(result.current.isCropMode).toBe(true);
      expect(result.current.cropRatio).toBeCloseTo(1.7778, 4);

      // Reset
      act(() => {
        result.current.resetCropState();
      });

      expect(result.current.isCropMode).toBe(false);
      expect(result.current.cropRatio).toBeNull();
    });

    it('should not affect non-crop state', () => {
      const { result } = renderHook(() => useCanvasUI());

      // Set non-crop state
      act(() => {
        result.current.setIsFullscreen(true);
        result.current.setBackground('black');
        result.current.setIsCropMode(true);
        result.current.setCropRatio(16 / 9);
      });

      // Reset crop
      act(() => {
        result.current.resetCropState();
      });

      // Verify non-crop state unchanged
      expect(result.current.isFullscreen).toBe(true);
      expect(result.current.background).toBe('black');

      // Verify crop state reset
      expect(result.current.isCropMode).toBe(false);
      expect(result.current.cropRatio).toBeNull();
    });

    it('should maintain resetCropState reference stability', () => {
      const { result, rerender } = renderHook(() => useCanvasUI());
      const firstReset = result.current.resetCropState;

      rerender();

      expect(result.current.resetCropState).toBe(firstReset);
    });
  });

  describe('state independence', () => {
    it('should update states independently', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setBackground('black');
      });

      expect(result.current.background).toBe('black');
      expect(result.current.isFullscreen).toBe(false);
      expect(result.current.cropRatio).toBeNull();
      expect(result.current.isCropMode).toBe(false);
    });
  });

  describe('typical usage workflow', () => {
    it('should handle fullscreen workflow', () => {
      const { result } = renderHook(() => useCanvasUI());

      // Enter fullscreen
      act(() => {
        result.current.setIsFullscreen(true);
      });

      expect(result.current.isFullscreen).toBe(true);

      // Exit fullscreen
      act(() => {
        result.current.setIsFullscreen(false);
      });

      expect(result.current.isFullscreen).toBe(false);
    });

    it('should handle background change workflow', () => {
      const { result } = renderHook(() => useCanvasUI());

      // Change through various backgrounds
      const sequence: Array<'none' | 'black' | 'gray' | 'white' | 'alpha'> = [
        'black',
        'gray',
        'white',
        'alpha',
        'none',
      ];

      sequence.forEach((bg) => {
        act(() => {
          result.current.setBackground(bg);
        });
        expect(result.current.background).toBe(bg);
      });
    });

    it('should handle complete crop workflow', () => {
      const { result } = renderHook(() => useCanvasUI());

      // Start crop with ratio
      act(() => {
        result.current.setIsCropMode(true);
        result.current.setCropRatio(16 / 9);
      });

      expect(result.current.isCropMode).toBe(true);
      expect(result.current.cropRatio).toBeCloseTo(1.7778, 4);

      // Change ratio
      act(() => {
        result.current.setCropRatio(1 / 1);
      });

      expect(result.current.cropRatio).toBe(1);

      // Free crop
      act(() => {
        result.current.setCropRatio(null);
      });

      expect(result.current.cropRatio).toBeNull();
      expect(result.current.isCropMode).toBe(true);

      // Cancel crop
      act(() => {
        result.current.resetCropState();
      });

      expect(result.current.isCropMode).toBe(false);
      expect(result.current.cropRatio).toBeNull();
    });

    it('should handle complete UI session', () => {
      const { result } = renderHook(() => useCanvasUI());

      // Set background
      act(() => {
        result.current.setBackground('black');
      });

      // Enter fullscreen
      act(() => {
        result.current.setIsFullscreen(true);
      });

      // Start cropping
      act(() => {
        result.current.setIsCropMode(true);
        result.current.setCropRatio(4 / 3);
      });

      expect(result.current.background).toBe('black');
      expect(result.current.isFullscreen).toBe(true);
      expect(result.current.isCropMode).toBe(true);
      expect(result.current.cropRatio).toBeCloseTo(1.3333, 4);

      // Exit crop
      act(() => {
        result.current.resetCropState();
      });

      // Exit fullscreen
      act(() => {
        result.current.setIsFullscreen(false);
      });

      // Reset background
      act(() => {
        result.current.setBackground('none');
      });

      expect(result.current.background).toBe('none');
      expect(result.current.isFullscreen).toBe(false);
      expect(result.current.isCropMode).toBe(false);
      expect(result.current.cropRatio).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle resetting crop when already reset', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.resetCropState();
        result.current.resetCropState();
      });

      expect(result.current.isCropMode).toBe(false);
      expect(result.current.cropRatio).toBeNull();
    });

    it('should handle very small crop ratios', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setCropRatio(0.001);
      });

      expect(result.current.cropRatio).toBe(0.001);
    });

    it('should handle very large crop ratios', () => {
      const { result } = renderHook(() => useCanvasUI());

      act(() => {
        result.current.setCropRatio(100);
      });

      expect(result.current.cropRatio).toBe(100);
    });
  });
});
