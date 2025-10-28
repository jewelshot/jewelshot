import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useImageFilters } from '@/hooks/useImageFilters';

describe('useImageFilters', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useImageFilters());

      expect(result.current.adjustFilters).toEqual({
        brightness: 0,
        contrast: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        clarity: 0,
        sharpness: 0,
        dehaze: 0,
      });

      expect(result.current.colorFilters).toEqual({
        temperature: 0,
        tint: 0,
        saturation: 0,
        vibrance: 0,
      });

      expect(result.current.filterEffects).toEqual({
        vignetteAmount: 0,
        vignetteSize: 50,
        vignetteFeather: 50,
        grainAmount: 0,
        grainSize: 50,
        fadeAmount: 0,
      });
    });
  });

  describe('adjustFilters', () => {
    it('should update brightness', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setAdjustFilters({
          ...result.current.adjustFilters,
          brightness: 50,
        });
      });

      expect(result.current.adjustFilters.brightness).toBe(50);
    });

    it('should update multiple adjust values', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setAdjustFilters({
          ...result.current.adjustFilters,
          brightness: 20,
          contrast: 30,
          exposure: -10,
        });
      });

      expect(result.current.adjustFilters.brightness).toBe(20);
      expect(result.current.adjustFilters.contrast).toBe(30);
      expect(result.current.adjustFilters.exposure).toBe(-10);
    });

    it('should accept function updater', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setAdjustFilters((prev) => ({
          ...prev,
          clarity: 50,
        }));
      });

      expect(result.current.adjustFilters.clarity).toBe(50);
    });

    it('should handle extreme values', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setAdjustFilters({
          brightness: -100,
          contrast: 100,
          exposure: -100,
          highlights: 100,
          shadows: -100,
          whites: 100,
          blacks: -100,
          clarity: 100,
          sharpness: 100,
          dehaze: 100,
        });
      });

      expect(result.current.adjustFilters.brightness).toBe(-100);
      expect(result.current.adjustFilters.clarity).toBe(100);
    });
  });

  describe('colorFilters', () => {
    it('should update temperature', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setColorFilters({
          ...result.current.colorFilters,
          temperature: 30,
        });
      });

      expect(result.current.colorFilters.temperature).toBe(30);
    });

    it('should update all color values', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setColorFilters({
          temperature: 20,
          tint: -15,
          saturation: 40,
          vibrance: 35,
        });
      });

      expect(result.current.colorFilters).toEqual({
        temperature: 20,
        tint: -15,
        saturation: 40,
        vibrance: 35,
      });
    });

    it('should accept function updater', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setColorFilters((prev) => ({
          ...prev,
          saturation: 50,
        }));
      });

      expect(result.current.colorFilters.saturation).toBe(50);
    });
  });

  describe('filterEffects', () => {
    it('should update vignette values', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setFilterEffects({
          ...result.current.filterEffects,
          vignetteAmount: 70,
          vignetteSize: 60,
          vignetteFeather: 40,
        });
      });

      expect(result.current.filterEffects.vignetteAmount).toBe(70);
      expect(result.current.filterEffects.vignetteSize).toBe(60);
      expect(result.current.filterEffects.vignetteFeather).toBe(40);
    });

    it('should update grain values', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setFilterEffects({
          ...result.current.filterEffects,
          grainAmount: 50,
          grainSize: 75,
        });
      });

      expect(result.current.filterEffects.grainAmount).toBe(50);
      expect(result.current.filterEffects.grainSize).toBe(75);
    });

    it('should update fade amount', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setFilterEffects({
          ...result.current.filterEffects,
          fadeAmount: 60,
        });
      });

      expect(result.current.filterEffects.fadeAmount).toBe(60);
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to defaults', () => {
      const { result } = renderHook(() => useImageFilters());

      // Set non-default values
      act(() => {
        result.current.setAdjustFilters({
          brightness: 50,
          contrast: 30,
          exposure: -20,
          highlights: 40,
          shadows: -30,
          whites: 20,
          blacks: -15,
          clarity: 60,
          sharpness: 70,
          dehaze: 50,
        });

        result.current.setColorFilters({
          temperature: 30,
          tint: -20,
          saturation: 40,
          vibrance: 35,
        });

        result.current.setFilterEffects({
          vignetteAmount: 70,
          vignetteSize: 60,
          vignetteFeather: 40,
          grainAmount: 50,
          grainSize: 75,
          fadeAmount: 30,
        });
      });

      // Verify values are set
      expect(result.current.adjustFilters.brightness).toBe(50);
      expect(result.current.colorFilters.temperature).toBe(30);
      expect(result.current.filterEffects.vignetteAmount).toBe(70);

      // Reset all
      act(() => {
        result.current.resetFilters();
      });

      // Verify all reset to defaults
      expect(result.current.adjustFilters).toEqual({
        brightness: 0,
        contrast: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        clarity: 0,
        sharpness: 0,
        dehaze: 0,
      });

      expect(result.current.colorFilters).toEqual({
        temperature: 0,
        tint: 0,
        saturation: 0,
        vibrance: 0,
      });

      expect(result.current.filterEffects).toEqual({
        vignetteAmount: 0,
        vignetteSize: 50,
        vignetteFeather: 50,
        grainAmount: 0,
        grainSize: 50,
        fadeAmount: 0,
      });
    });

    it('should maintain resetFilters reference stability', () => {
      const { result, rerender } = renderHook(() => useImageFilters());
      const firstReset = result.current.resetFilters;

      rerender();

      expect(result.current.resetFilters).toBe(firstReset);
    });
  });

  describe('state independence', () => {
    it('should update filter groups independently', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setAdjustFilters({
          ...result.current.adjustFilters,
          brightness: 50,
        });
      });

      expect(result.current.adjustFilters.brightness).toBe(50);
      expect(result.current.colorFilters.temperature).toBe(0);
      expect(result.current.filterEffects.vignetteAmount).toBe(0);
    });
  });

  describe('typical usage workflow', () => {
    it('should handle complete editing workflow', () => {
      const { result } = renderHook(() => useImageFilters());

      // Adjust basic properties
      act(() => {
        result.current.setAdjustFilters({
          ...result.current.adjustFilters,
          brightness: 20,
          contrast: 15,
          exposure: 10,
        });
      });

      // Adjust colors
      act(() => {
        result.current.setColorFilters({
          ...result.current.colorFilters,
          temperature: 25,
          saturation: 30,
        });
      });

      // Add effects
      act(() => {
        result.current.setFilterEffects({
          ...result.current.filterEffects,
          vignetteAmount: 40,
          grainAmount: 20,
        });
      });

      expect(result.current.adjustFilters.brightness).toBe(20);
      expect(result.current.colorFilters.temperature).toBe(25);
      expect(result.current.filterEffects.vignetteAmount).toBe(40);

      // Reset everything
      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.adjustFilters.brightness).toBe(0);
      expect(result.current.colorFilters.temperature).toBe(0);
      expect(result.current.filterEffects.vignetteAmount).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle setting same value multiple times', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        result.current.setAdjustFilters({
          ...result.current.adjustFilters,
          brightness: 50,
        });
        result.current.setAdjustFilters({
          ...result.current.adjustFilters,
          brightness: 50,
        });
      });

      expect(result.current.adjustFilters.brightness).toBe(50);
    });

    it('should handle rapid filter changes', () => {
      const { result } = renderHook(() => useImageFilters());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.setAdjustFilters({
            ...result.current.adjustFilters,
            brightness: i,
          });
        }
      });

      expect(result.current.adjustFilters.brightness).toBe(99);
    });
  });
});
