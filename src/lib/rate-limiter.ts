/**
 * Enhanced Rate Limiter Utility
 *
 * Prevents API abuse by limiting request frequency with:
 * - Per-user rate limiting (localStorage)
 * - Multiple rate limit tiers
 * - Usage tracking and statistics
 * - User-friendly error messages
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('RateLimiter');

interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
  storageKey?: string; // localStorage key for persistence
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
  retryAfter?: number; // seconds to wait (if blocked)
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  remaining: number;
  resetAt: Date;
}

export class RateLimiter {
  private timestamps: number[] = [];
  private config: RateLimitConfig;
  private totalRequests = 0;
  private blockedRequests = 0;

  constructor(config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }) {
    this.config = config;
    this.loadFromStorage();
  }

  /**
   * Load rate limit data from localStorage
   */
  private loadFromStorage(): void {
    if (!this.config.storageKey || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.timestamps = data.timestamps || [];
        this.totalRequests = data.totalRequests || 0;
        this.blockedRequests = data.blockedRequests || 0;
      }
    } catch (error) {
      logger.warn('Failed to load rate limit data from storage:', error);
    }
  }

  /**
   * Save rate limit data to localStorage
   */
  private saveToStorage(): void {
    if (!this.config.storageKey || typeof window === 'undefined') return;

    try {
      const data = {
        timestamps: this.timestamps,
        totalRequests: this.totalRequests,
        blockedRequests: this.blockedRequests,
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      logger.warn('Failed to save rate limit data to storage:', error);
    }
  }

  /**
   * Clean expired timestamps
   */
  private cleanTimestamps(): void {
    const now = Date.now();
    const { windowMs } = this.config;
    this.timestamps = this.timestamps.filter((t) => now - t < windowMs);
  }

  /**
   * Check rate limit and return detailed result
   */
  checkLimit(): RateLimitResult {
    this.cleanTimestamps();

    const now = Date.now();
    const { maxRequests, windowMs } = this.config;
    const remaining = Math.max(0, maxRequests - this.timestamps.length);
    const allowed = remaining > 0;

    let resetIn = 0;
    let retryAfter: number | undefined;

    if (!allowed && this.timestamps.length > 0) {
      const oldestTimestamp = this.timestamps[0];
      resetIn = Math.max(0, windowMs - (now - oldestTimestamp));
      retryAfter = Math.ceil(resetIn / 1000); // Convert to seconds
    }

    return {
      allowed,
      remaining,
      resetIn,
      retryAfter,
    };
  }

  /**
   * Attempt to make a request (checks and records if allowed)
   */
  async attemptRequest<T>(
    action: () => Promise<T>
  ): Promise<
    | { success: true; data: T }
    | { success: false; error: string; retryAfter: number }
  > {
    const limit = this.checkLimit();

    if (!limit.allowed) {
      this.blockedRequests++;
      this.saveToStorage();

      logger.warn(
        `Rate limit exceeded. Retry after ${limit.retryAfter} seconds`
      );

      return {
        success: false,
        error: `Rate limit exceeded. Please wait ${limit.retryAfter} seconds.`,
        retryAfter: limit.retryAfter || 60,
      };
    }

    // Record request
    this.recordRequest();

    try {
      const data = await action();
      return { success: true, data };
    } catch (error) {
      // Don't count failed requests against the limit
      this.timestamps.pop();
      this.totalRequests--;
      this.saveToStorage();
      throw error;
    }
  }

  /**
   * Check if a new request can be made (legacy method)
   */
  canMakeRequest(): boolean {
    return this.checkLimit().allowed;
  }

  /**
   * Record a new request
   */
  recordRequest(): void {
    this.timestamps.push(Date.now());
    this.totalRequests++;
    this.saveToStorage();
  }

  /**
   * Get remaining requests in current window
   */
  getRemainingRequests(): number {
    return this.checkLimit().remaining;
  }

  /**
   * Get time until next request is available (in ms)
   */
  getTimeUntilReset(): number {
    return this.checkLimit().resetIn;
  }

  /**
   * Get usage statistics
   */
  getStats(): RateLimitStats {
    this.cleanTimestamps();
    const { maxRequests, windowMs } = this.config;
    const remaining = Math.max(0, maxRequests - this.timestamps.length);

    let resetAt = new Date();
    if (this.timestamps.length > 0) {
      const oldestTimestamp = this.timestamps[0];
      resetAt = new Date(oldestTimestamp + windowMs);
    }

    return {
      totalRequests: this.totalRequests,
      blockedRequests: this.blockedRequests,
      remaining,
      resetAt,
    };
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.timestamps = [];
    this.totalRequests = 0;
    this.blockedRequests = 0;
    this.saveToStorage();
  }
}

// ============================================================================
// PRECONFIGURED LIMITERS
// ============================================================================

/**
 * AI API rate limiter (5 requests per minute with localStorage persistence)
 */
export const aiRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60000, // 1 minute
  storageKey: 'jewelshot_ai_rate_limit',
});

/**
 * File upload rate limiter (10 uploads per minute)
 */
export const uploadRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  storageKey: 'jewelshot_upload_rate_limit',
});

/**
 * Gallery save rate limiter (20 saves per minute)
 */
export const galleryRateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60000, // 1 minute
  storageKey: 'jewelshot_gallery_rate_limit',
});

/**
 * Format time duration for user display
 */
export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
