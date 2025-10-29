/**
 * Unit tests for rate-limiter.ts
 *
 * Tests rate limiting logic, localStorage persistence, and statistics
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RateLimiter, formatWaitTime } from '@/lib/rate-limiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    beforeEach(() => {
      limiter = new RateLimiter({ maxRequests: 3, windowMs: 60000 });
    });

    it('should allow requests under the limit', () => {
      expect(limiter.canMakeRequest()).toBe(true);
      limiter.recordRequest();
      expect(limiter.canMakeRequest()).toBe(true);
      limiter.recordRequest();
      expect(limiter.canMakeRequest()).toBe(true);
    });

    it('should block requests over the limit', () => {
      limiter.recordRequest();
      limiter.recordRequest();
      limiter.recordRequest();
      expect(limiter.canMakeRequest()).toBe(false);
    });

    it('should return correct remaining requests', () => {
      expect(limiter.getRemainingRequests()).toBe(3);
      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(2);
      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(1);
      limiter.recordRequest();
      expect(limiter.getRemainingRequests()).toBe(0);
    });

    it('should reset after window expires', () => {
      limiter.recordRequest();
      limiter.recordRequest();
      limiter.recordRequest();
      expect(limiter.canMakeRequest()).toBe(false);

      // Advance time by 61 seconds (past the 60s window)
      vi.advanceTimersByTime(61000);

      expect(limiter.canMakeRequest()).toBe(true);
      expect(limiter.getRemainingRequests()).toBe(3);
    });

    it('should calculate time until reset correctly', () => {
      limiter.recordRequest();
      const timeUntilReset = limiter.getTimeUntilReset();
      expect(timeUntilReset).toBeLessThanOrEqual(60000);
      expect(timeUntilReset).toBeGreaterThanOrEqual(0);
    });
  });

  describe('checkLimit', () => {
    beforeEach(() => {
      limiter = new RateLimiter({ maxRequests: 2, windowMs: 30000 });
    });

    it('should return detailed limit information when allowed', () => {
      const result = limiter.checkLimit();
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
      expect(result.resetIn).toBe(0);
      expect(result.retryAfter).toBeUndefined();
    });

    it('should return retry information when blocked', () => {
      limiter.recordRequest();
      limiter.recordRequest();

      const result = limiter.checkLimit();
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.resetIn).toBeGreaterThan(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });

  describe('attemptRequest', () => {
    beforeEach(() => {
      limiter = new RateLimiter({ maxRequests: 2, windowMs: 30000 });
    });

    it('should execute action when under limit', async () => {
      const mockAction = vi.fn().mockResolvedValue('success');
      const result = await limiter.attemptRequest(mockAction);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('success');
      }
      expect(mockAction).toHaveBeenCalledOnce();
    });

    it('should block action when over limit', async () => {
      const mockAction = vi.fn().mockResolvedValue('success');

      await limiter.attemptRequest(mockAction);
      await limiter.attemptRequest(mockAction);

      const result = await limiter.attemptRequest(mockAction);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Rate limit exceeded');
        expect(result.retryAfter).toBeGreaterThan(0);
      }
      expect(mockAction).toHaveBeenCalledTimes(2); // Not called the third time
    });

    it('should not count failed requests against limit', async () => {
      const mockAction = vi.fn().mockRejectedValue(new Error('API error'));

      try {
        await limiter.attemptRequest(mockAction);
      } catch {
        // Expected to fail
      }

      // Should still have all requests available
      expect(limiter.getRemainingRequests()).toBe(2);
    });
  });

  describe('getStats', () => {
    beforeEach(() => {
      limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
    });

    it('should track total requests', () => {
      limiter.recordRequest();
      limiter.recordRequest();

      const stats = limiter.getStats();
      expect(stats.totalRequests).toBe(2);
    });

    it('should track blocked requests', async () => {
      const mockAction = vi.fn().mockResolvedValue('ok');

      // Fill up the limit
      for (let i = 0; i < 5; i++) {
        await limiter.attemptRequest(mockAction);
      }

      // Try to exceed
      await limiter.attemptRequest(mockAction);
      await limiter.attemptRequest(mockAction);

      const stats = limiter.getStats();
      expect(stats.blockedRequests).toBe(2);
    });

    it('should calculate remaining correctly', () => {
      limiter.recordRequest();
      limiter.recordRequest();

      const stats = limiter.getStats();
      expect(stats.remaining).toBe(3);
    });

    it('should provide reset timestamp', () => {
      limiter.recordRequest();
      const stats = limiter.getStats();
      expect(stats.resetAt).toBeInstanceOf(Date);
      expect(stats.resetAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('localStorage persistence', () => {
    it('should save rate limit data to localStorage', () => {
      const persistedLimiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        storageKey: 'test_rate_limit',
      });

      persistedLimiter.recordRequest();
      persistedLimiter.recordRequest();

      const stored = localStorage.getItem('test_rate_limit');
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored!);
      expect(data.timestamps).toHaveLength(2);
      expect(data.totalRequests).toBe(2);
    });

    it('should load rate limit data from localStorage', () => {
      // Save some data
      const limiter1 = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        storageKey: 'test_rate_limit',
      });
      limiter1.recordRequest();
      limiter1.recordRequest();

      // Create new instance (simulates page refresh)
      const limiter2 = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        storageKey: 'test_rate_limit',
      });

      expect(limiter2.getRemainingRequests()).toBe(1);
      expect(limiter2.getStats().totalRequests).toBe(2);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('test_rate_limit', 'invalid json');

      const limiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        storageKey: 'test_rate_limit',
      });

      // Should start fresh
      expect(limiter.getRemainingRequests()).toBe(3);
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      limiter = new RateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        storageKey: 'test_rate_limit',
      });
    });

    it('should clear all rate limit data', () => {
      limiter.recordRequest();
      limiter.recordRequest();

      limiter.reset();

      expect(limiter.getRemainingRequests()).toBe(3);
      expect(limiter.getStats().totalRequests).toBe(0);
      expect(limiter.getStats().blockedRequests).toBe(0);
    });

    it('should clear localStorage data', () => {
      limiter.recordRequest();
      limiter.reset();

      const stored = localStorage.getItem('test_rate_limit');
      const data = JSON.parse(stored!);
      expect(data.timestamps).toHaveLength(0);
      expect(data.totalRequests).toBe(0);
    });
  });
});

describe('formatWaitTime', () => {
  it('should format seconds correctly', () => {
    expect(formatWaitTime(1)).toBe('1 second');
    expect(formatWaitTime(30)).toBe('30 seconds');
    expect(formatWaitTime(59)).toBe('59 seconds');
  });

  it('should format minutes correctly', () => {
    expect(formatWaitTime(60)).toBe('1 minute');
    expect(formatWaitTime(120)).toBe('2 minutes');
    expect(formatWaitTime(90)).toBe('2 minutes'); // Rounds up
  });
});
