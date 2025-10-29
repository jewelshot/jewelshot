/**
 * Production-safe logger utility
 *
 * Logs messages only in development environment.
 * In production, logs are suppressed to reduce console noise.
 *
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.info('User uploaded image');
 * logger.warn('Image size exceeds recommended limit');
 * logger.error('Failed to process image', error);
 * logger.debug('Filter values:', { brightness: 1.2 });
 * ```
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Safe console wrapper that respects environment
 */
class Logger {
  private log(level: LogLevel, ...args: unknown[]) {
    if (isDevelopment) {
      console[level](...args);
    }
  }

  /**
   * General logging (development only)
   */
  info(...args: unknown[]) {
    this.log('info', ...args);
  }

  /**
   * Warning messages (development only)
   */
  warn(...args: unknown[]) {
    this.log('warn', ...args);
  }

  /**
   * Error messages (always logged, but can be sent to error tracking)
   */
  error(...args: unknown[]) {
    // Always log errors, even in production

    console.error(...args);

    // TODO: Send to error tracking service (Sentry, etc.)
    // if (!isDevelopment) {
    //   sendToErrorTracking(args);
    // }
  }

  /**
   * Debug messages (development only)
   */
  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }

  /**
   * Generic log (development only)
   */
  generic(...args: unknown[]) {
    this.log('log', ...args);
  }
}

export const logger = new Logger();

/**
 * Performance measurement utility
 */
export class PerformanceLogger {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
    logger.debug(`⏱️ [${label}] Started`);
  }

  end() {
    const duration = performance.now() - this.startTime;
    logger.debug(`⏱️ [${this.label}] Completed in ${duration.toFixed(2)}ms`);
    return duration;
  }
}

/**
 * Create a scoped logger for specific modules
 */
export function createScopedLogger(scope: string) {
  return {
    info: (...args: unknown[]) => logger.info(`[${scope}]`, ...args),
    warn: (...args: unknown[]) => logger.warn(`[${scope}]`, ...args),
    error: (...args: unknown[]) => logger.error(`[${scope}]`, ...args),
    debug: (...args: unknown[]) => logger.debug(`[${scope}]`, ...args),
  };
}
