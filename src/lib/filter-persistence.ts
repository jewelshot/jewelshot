/**
 * Filter State Persistence
 *
 * Saves and restores image filter settings to/from localStorage
 */

export interface FilterState {
  adjust: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    highlights?: number;
    shadows?: number;
    exposure?: number;
    warmth?: number;
    tint?: number;
    sharpness?: number;
    clarity?: number;
    dehaze?: number;
  };
  color: {
    hue?: number;
    vibrance?: number;
  };
  effects: {
    vignetteAmount?: number;
    vignetteSize?: number;
    vignetteFeather?: number;
    grainAmount?: number;
    grainSize?: number;
  };
}

const STORAGE_KEY = 'jewelshot_last_filters';

/**
 * Load last used filters from localStorage
 */
export function loadLastFilters(): FilterState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as FilterState;
    return parsed;
  } catch (error) {
    console.error('Failed to load last filters:', error);
    return null;
  }
}

/**
 * Save current filters to localStorage
 */
export function saveFilters(filters: FilterState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
}

/**
 * Clear saved filters
 */
export function clearSavedFilters(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear filters:', error);
  }
}

/**
 * Check if there are saved filters
 */
export function hasSavedFilters(): boolean {
  if (typeof window === 'undefined') return false;

  return localStorage.getItem(STORAGE_KEY) !== null;
}
