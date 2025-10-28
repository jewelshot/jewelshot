import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useImageTransform } from '@/hooks/useImageTransform';

describe('useImageTransform', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useImageTransform());

      expect(result.current.scale).toBe(1.0);
      expect(result.current.position).toEqual({ x: 0, y: 0 });
      expect(result.current.transform).toEqual({
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
      });
    });
  });

  describe('setScale', () => {
    it('should update scale', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setScale(1.5);
      });

      expect(result.current.scale).toBe(1.5);
    });

    it('should accept function updater', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setScale(2.0);
      });

      act(() => {
        result.current.setScale((prev) => prev + 0.5);
      });

      expect(result.current.scale).toBe(2.5);
    });

    it('should handle zoom in/out operations', () => {
      const { result } = renderHook(() => useImageTransform());

      // Zoom in
      act(() => {
        result.current.setScale((prev) => Math.min(prev + 0.1, 3.0));
      });
      expect(result.current.scale).toBeCloseTo(1.1, 10);

      // Zoom out
      act(() => {
        result.current.setScale((prev) => Math.max(prev - 0.2, 0.1));
      });
      expect(result.current.scale).toBeCloseTo(0.9, 10);
    });
  });

  describe('setPosition', () => {
    it('should update position', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setPosition({ x: 100, y: 50 });
      });

      expect(result.current.position).toEqual({ x: 100, y: 50 });
    });

    it('should accept function updater', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setPosition({ x: 50, y: 50 });
      });

      act(() => {
        result.current.setPosition((prev) => ({
          x: prev.x + 10,
          y: prev.y - 5,
        }));
      });

      expect(result.current.position).toEqual({ x: 60, y: 45 });
    });

    it('should handle panning', () => {
      const { result } = renderHook(() => useImageTransform());

      // Simulate drag
      act(() => {
        result.current.setPosition((prev) => ({
          x: prev.x + 20,
          y: prev.y + 30,
        }));
      });

      expect(result.current.position).toEqual({ x: 20, y: 30 });
    });

    it('should handle negative positions', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setPosition({ x: -50, y: -100 });
      });

      expect(result.current.position).toEqual({ x: -50, y: -100 });
    });
  });

  describe('setTransform', () => {
    it('should update rotation', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setTransform({
          rotation: 90,
          flipHorizontal: false,
          flipVertical: false,
        });
      });

      expect(result.current.transform.rotation).toBe(90);
    });

    it('should update flip horizontal', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setTransform({
          rotation: 0,
          flipHorizontal: true,
          flipVertical: false,
        });
      });

      expect(result.current.transform.flipHorizontal).toBe(true);
      expect(result.current.transform.flipVertical).toBe(false);
    });

    it('should update flip vertical', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setTransform({
          rotation: 0,
          flipHorizontal: false,
          flipVertical: true,
        });
      });

      expect(result.current.transform.flipVertical).toBe(true);
      expect(result.current.transform.flipHorizontal).toBe(false);
    });

    it('should accept function updater', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setTransform({
          rotation: 90,
          flipHorizontal: false,
          flipVertical: false,
        });
      });

      act(() => {
        result.current.setTransform((prev) => ({
          ...prev,
          rotation: prev.rotation + 90,
        }));
      });

      expect(result.current.transform.rotation).toBe(180);
    });

    it('should handle rotation increments', () => {
      const { result } = renderHook(() => useImageTransform());

      // Rotate 90° four times = 360°
      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.setTransform((prev) => ({
            ...prev,
            rotation: (prev.rotation + 90) % 360,
          }));
        });
      }

      expect(result.current.transform.rotation).toBe(0);
    });

    it('should toggle flips independently', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setTransform((prev) => ({
          ...prev,
          flipHorizontal: !prev.flipHorizontal,
        }));
      });

      expect(result.current.transform.flipHorizontal).toBe(true);
      expect(result.current.transform.flipVertical).toBe(false);

      act(() => {
        result.current.setTransform((prev) => ({
          ...prev,
          flipVertical: !prev.flipVertical,
        }));
      });

      expect(result.current.transform.flipHorizontal).toBe(true);
      expect(result.current.transform.flipVertical).toBe(true);
    });
  });

  describe('resetTransform', () => {
    it('should reset all transform state to defaults', () => {
      const { result } = renderHook(() => useImageTransform());

      // Set non-default values
      act(() => {
        result.current.setScale(2.5);
        result.current.setPosition({ x: 100, y: 200 });
        result.current.setTransform({
          rotation: 180,
          flipHorizontal: true,
          flipVertical: true,
        });
      });

      // Verify changes
      expect(result.current.scale).toBe(2.5);
      expect(result.current.position).toEqual({ x: 100, y: 200 });
      expect(result.current.transform).toEqual({
        rotation: 180,
        flipHorizontal: true,
        flipVertical: true,
      });

      // Reset
      act(() => {
        result.current.resetTransform();
      });

      // Verify all reset
      expect(result.current.scale).toBe(1.0);
      expect(result.current.position).toEqual({ x: 0, y: 0 });
      expect(result.current.transform).toEqual({
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
      });
    });

    it('should maintain resetTransform reference stability', () => {
      const { result, rerender } = renderHook(() => useImageTransform());
      const firstReset = result.current.resetTransform;

      rerender();

      expect(result.current.resetTransform).toBe(firstReset);
    });
  });

  describe('state independence', () => {
    it('should update states independently', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setScale(1.5);
      });

      expect(result.current.scale).toBe(1.5);
      expect(result.current.position).toEqual({ x: 0, y: 0 });
      expect(result.current.transform.rotation).toBe(0);
    });
  });

  describe('typical usage workflow', () => {
    it('should handle complete transform workflow', () => {
      const { result } = renderHook(() => useImageTransform());

      // Zoom in
      act(() => {
        result.current.setScale(1.5);
      });

      // Pan image
      act(() => {
        result.current.setPosition({ x: 50, y: -30 });
      });

      // Rotate
      act(() => {
        result.current.setTransform({
          rotation: 90,
          flipHorizontal: false,
          flipVertical: false,
        });
      });

      // Flip horizontal
      act(() => {
        result.current.setTransform((prev) => ({
          ...prev,
          flipHorizontal: true,
        }));
      });

      expect(result.current.scale).toBe(1.5);
      expect(result.current.position).toEqual({ x: 50, y: -30 });
      expect(result.current.transform).toEqual({
        rotation: 90,
        flipHorizontal: true,
        flipVertical: false,
      });

      // Reset all
      act(() => {
        result.current.resetTransform();
      });

      expect(result.current.scale).toBe(1.0);
      expect(result.current.position).toEqual({ x: 0, y: 0 });
      expect(result.current.transform).toEqual({
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle extreme scale values', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setScale(0.1); // Min
      });
      expect(result.current.scale).toBe(0.1);

      act(() => {
        result.current.setScale(3.0); // Max
      });
      expect(result.current.scale).toBe(3.0);
    });

    it('should handle rotation overflow', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setTransform({
          rotation: 450, // > 360
          flipHorizontal: false,
          flipVertical: false,
        });
      });

      expect(result.current.transform.rotation).toBe(450);
    });

    it('should handle large position values', () => {
      const { result } = renderHook(() => useImageTransform());

      act(() => {
        result.current.setPosition({ x: 10000, y: -10000 });
      });

      expect(result.current.position).toEqual({ x: 10000, y: -10000 });
    });
  });
});
