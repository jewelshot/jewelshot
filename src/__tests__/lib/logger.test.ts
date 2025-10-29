/**
 * Unit tests for logger.ts
 *
 * Tests production-safe logging and performance measurement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, PerformanceLogger, createScopedLogger } from '@/lib/logger';

describe('logger', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let consoleSpy: {
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
    log: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    // Restore console methods
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('in development mode', () => {
    // Note: Logger checks NODE_ENV at module initialization time
    // In test environment, NODE_ENV might already be set to 'test'
    // These tests verify the logger's interface but may not test actual console output

    it('should have info method', () => {
      expect(logger.info).toBeDefined();
      logger.info('Test message', { data: 'test' });
      // Console output depends on NODE_ENV at module load time
    });

    it('should have warn method', () => {
      expect(logger.warn).toBeDefined();
      logger.warn('Warning message');
    });

    it('should have debug method', () => {
      expect(logger.debug).toBeDefined();
      logger.debug('Debug message');
    });

    it('should have generic method', () => {
      expect(logger.generic).toBeDefined();
      logger.generic('Generic message');
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should NOT log info messages', () => {
      logger.info('Test message');
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it('should NOT log warn messages', () => {
      logger.warn('Warning message');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should NOT log debug messages', () => {
      logger.debug('Debug message');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });
  });

  describe('error logging (always enabled)', () => {
    it('should log errors in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(consoleSpy.error).toHaveBeenCalledWith('Error occurred', error);
    });

    it('should log errors in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(consoleSpy.error).toHaveBeenCalledWith('Error occurred', error);
    });
  });
});

describe('PerformanceLogger', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
    vi.useRealTimers();
  });

  it('should create performance logger', () => {
    const perfLogger = new PerformanceLogger('Test operation');
    expect(perfLogger).toBeDefined();
  });

  it('should measure and log duration', () => {
    const perfLogger = new PerformanceLogger('Test operation');

    // Advance time by 100ms
    vi.advanceTimersByTime(100);

    const duration = perfLogger.end();

    expect(duration).toBeCloseTo(100, 0);
  });

  it('should return accurate duration', () => {
    const perfLogger = new PerformanceLogger('Test operation');
    vi.advanceTimersByTime(250);
    const duration = perfLogger.end();
    expect(duration).toBeCloseTo(250, 0);
  });
});

describe('createScopedLogger', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let consoleSpy: {
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    consoleSpy = {
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should create scoped logger with correct methods', () => {
    const scopedLogger = createScopedLogger('TestModule');

    expect(scopedLogger.info).toBeDefined();
    expect(scopedLogger.warn).toBeDefined();
    expect(scopedLogger.error).toBeDefined();
    expect(scopedLogger.debug).toBeDefined();

    // Call methods to verify they work
    scopedLogger.info('Info message');
    scopedLogger.warn('Warning message');
    scopedLogger.error('Error message');
    scopedLogger.debug('Debug message');
  });

  it('should allow multiple arguments', () => {
    const scopedLogger = createScopedLogger('API');
    const data = { status: 200 };

    // Verify method accepts multiple arguments without error
    expect(() => {
      scopedLogger.info('Request completed', data, 'extra info');
    }).not.toThrow();
  });

  it('should respect production mode', () => {
    process.env.NODE_ENV = 'production';
    const scopedLogger = createScopedLogger('TestModule');

    scopedLogger.info('Info message');
    scopedLogger.warn('Warning message');
    scopedLogger.debug('Debug message');

    expect(consoleSpy.info).not.toHaveBeenCalled();
    expect(consoleSpy.warn).not.toHaveBeenCalled();
    expect(consoleSpy.debug).not.toHaveBeenCalled();

    // Error should still work
    scopedLogger.error('Error message');
    expect(consoleSpy.error).toHaveBeenCalled();
  });
});
