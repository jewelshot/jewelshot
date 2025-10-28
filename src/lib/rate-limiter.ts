/**
 * Rate Limiter Utility
 *
 * Prevents API abuse by limiting request frequency
 */

interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
}

export class RateLimiter {
  private timestamps: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }) {
    this.config = config;
  }

  /**
   * Check if a new request can be made
   */
  canMakeRequest(): boolean {
    const now = Date.now();
    const { maxRequests, windowMs } = this.config;

    // Remove timestamps outside the current window
    this.timestamps = this.timestamps.filter((t) => now - t < windowMs);

    // Check if under the limit
    return this.timestamps.length < maxRequests;
  }

  /**
   * Record a new request
   */
  recordRequest(): void {
    this.timestamps.push(Date.now());
  }

  /**
   * Get remaining requests in current window
   */
  getRemainingRequests(): number {
    const now = Date.now();
    const { maxRequests, windowMs } = this.config;

    this.timestamps = this.timestamps.filter((t) => now - t < windowMs);

    return Math.max(0, maxRequests - this.timestamps.length);
  }

  /**
   * Get time until next request is available (in ms)
   */
  getTimeUntilReset(): number {
    const now = Date.now();
    const { maxRequests, windowMs } = this.config;

    this.timestamps = this.timestamps.filter((t) => now - t < windowMs);

    if (this.timestamps.length < maxRequests) {
      return 0;
    }

    // Time until the oldest timestamp expires
    const oldestTimestamp = this.timestamps[0];
    return Math.max(0, windowMs - (now - oldestTimestamp));
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.timestamps = [];
  }
}

// Default AI API rate limiter (5 requests per minute)
export const aiRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60000,
});
