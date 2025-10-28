/**
 * Custom hook for managing image filter state
 *
 * Manages all image filter properties:
 * - Adjust filters (brightness, contrast, exposure, highlights, shadows, etc.)
 * - Color filters (temperature, tint, saturation, vibrance)
 * - Filter effects (vignette, grain, fade)
 *
 * @example
 * ```tsx
 * const {
 *   adjustFilters,
 *   setAdjustFilters,
 *   colorFilters,
 *   setColorFilters,
 *   filterEffects,
 *   setFilterEffects,
 *   resetFilters
 * } = useImageFilters();
 * ```
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { loadLastFilters, saveFilters } from '@/lib/filter-persistence';

/**
 * Adjust tab filters - Basic light, tone, clarity controls
 */
interface AdjustFilters {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  exposure: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  whites: number; // -100 to 100
  blacks: number; // -100 to 100
  clarity: number; // 0 to 100
  sharpness: number; // 0 to 100
  dehaze: number; // 0 to 100
}

/**
 * Colors tab filters - Temperature, tint, saturation
 */
interface ColorFilters {
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  saturation: number; // -100 to 100
  vibrance: number; // -100 to 100
}

/**
 * Filters tab effects - Vignette, grain, fade
 */
interface FilterEffects {
  vignetteAmount: number; // 0 to 100
  vignetteSize: number; // 0 to 100
  vignetteFeather: number; // 0 to 100
  grainAmount: number; // 0 to 100
  grainSize: number; // 0 to 100
  fadeAmount: number; // 0 to 100
}

interface ImageFiltersState {
  /**
   * Adjust tab filters
   */
  adjustFilters: AdjustFilters;
  setAdjustFilters: (
    filters: AdjustFilters | ((prev: AdjustFilters) => AdjustFilters)
  ) => void;

  /**
   * Colors tab filters
   */
  colorFilters: ColorFilters;
  setColorFilters: (
    filters: ColorFilters | ((prev: ColorFilters) => ColorFilters)
  ) => void;

  /**
   * Filters tab effects
   */
  filterEffects: FilterEffects;
  setFilterEffects: (
    effects: FilterEffects | ((prev: FilterEffects) => FilterEffects)
  ) => void;

  /**
   * Reset all filters to default values
   */
  resetFilters: () => void;
}

const DEFAULT_ADJUST_FILTERS: AdjustFilters = {
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
};

const DEFAULT_COLOR_FILTERS: ColorFilters = {
  temperature: 0,
  tint: 0,
  saturation: 0,
  vibrance: 0,
};

const DEFAULT_FILTER_EFFECTS: FilterEffects = {
  vignetteAmount: 0,
  vignetteSize: 50,
  vignetteFeather: 50,
  grainAmount: 0,
  grainSize: 50,
  fadeAmount: 0,
};

export function useImageFilters(): ImageFiltersState {
  // Load last saved filters on mount
  const [adjustFilters, setAdjustFilters] = useState<AdjustFilters>(() => {
    const saved = loadLastFilters();
    return saved?.adjust || DEFAULT_ADJUST_FILTERS;
  });
  const [colorFilters, setColorFilters] = useState<ColorFilters>(() => {
    const saved = loadLastFilters();
    return saved?.color || DEFAULT_COLOR_FILTERS;
  });
  const [filterEffects, setFilterEffects] = useState<FilterEffects>(() => {
    const saved = loadLastFilters();
    return saved?.effects || DEFAULT_FILTER_EFFECTS;
  });

  // Debounce save to avoid too many writes
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save filters to localStorage on change (debounced)
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveFilters({
        adjust: adjustFilters,
        color: colorFilters,
        effects: filterEffects,
      });
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [adjustFilters, colorFilters, filterEffects]);

  /**
   * Reset all filters to default values
   * Useful when loading new image or resetting all edits
   */
  const resetFilters = useCallback(() => {
    setAdjustFilters(DEFAULT_ADJUST_FILTERS);
    setColorFilters(DEFAULT_COLOR_FILTERS);
    setFilterEffects(DEFAULT_FILTER_EFFECTS);
  }, []);

  return {
    adjustFilters,
    setAdjustFilters,
    colorFilters,
    setColorFilters,
    filterEffects,
    setFilterEffects,
    resetFilters,
  };
}
