/**
 * Unit tests for toast-manager.ts
 *
 * Tests global toast queue, promise wrapper, and notification management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toastManager, Toast } from '@/lib/toast-manager';

describe('ToastManager', () => {
  let receivedToasts: Toast[] = [];
  let unsubscribe: (() => void) | null = null;

  beforeEach(() => {
    receivedToasts = [];
    // Subscribe to toast updates
    unsubscribe = toastManager.subscribe((toasts) => {
      receivedToasts = toasts;
    });
    // Clear any existing toasts
    toastManager.dismissAll();
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    toastManager.dismissAll();
    vi.useRealTimers();
  });

  describe('basic toast operations', () => {
    it('should add success toast', () => {
      toastManager.success('Operation successful');

      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('success');
      expect(receivedToasts[0].message).toBe('Operation successful');
    });

    it('should add error toast', () => {
      toastManager.error('Operation failed');

      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('error');
      expect(receivedToasts[0].message).toBe('Operation failed');
    });

    it('should add warning toast', () => {
      toastManager.warning('Warning message');

      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('warning');
      expect(receivedToasts[0].message).toBe('Warning message');
    });

    it('should add info toast', () => {
      toastManager.info('Information');

      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('info');
      expect(receivedToasts[0].message).toBe('Information');
    });

    it('should add loading toast', () => {
      toastManager.loading('Processing...');

      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('loading');
      expect(receivedToasts[0].message).toBe('Processing...');
      expect(receivedToasts[0].duration).toBe(0); // Loading has no auto-dismiss
    });
  });

  describe('toast queue management', () => {
    it('should limit number of simultaneous toasts', () => {
      toastManager.info('Toast 1');
      toastManager.info('Toast 2');
      toastManager.info('Toast 3');
      toastManager.info('Toast 4'); // Should remove oldest

      expect(receivedToasts).toHaveLength(3);
      expect(receivedToasts.map((t) => t.message)).toEqual([
        'Toast 2',
        'Toast 3',
        'Toast 4',
      ]);
    });

    it('should auto-dismiss toasts after duration', () => {
      toastManager.success('Auto dismiss', { duration: 1000 });

      expect(receivedToasts).toHaveLength(1);

      // Advance time past duration
      vi.advanceTimersByTime(1100);

      expect(receivedToasts).toHaveLength(0);
    });

    it('should not auto-dismiss toasts with 0 duration', () => {
      toastManager.info('Persistent', { duration: 0 });

      expect(receivedToasts).toHaveLength(1);

      // Advance time significantly
      vi.advanceTimersByTime(10000);

      expect(receivedToasts).toHaveLength(1); // Still there
    });

    it('should dismiss specific toast by ID', () => {
      const id1 = toastManager.info('Toast 1');
      const id2 = toastManager.info('Toast 2');

      expect(receivedToasts).toHaveLength(2);

      toastManager.dismiss(id1);

      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].id).toBe(id2);
    });

    it('should dismiss all toasts', () => {
      toastManager.info('Toast 1');
      toastManager.info('Toast 2');
      toastManager.info('Toast 3');

      expect(receivedToasts).toHaveLength(3);

      toastManager.dismissAll();

      expect(receivedToasts).toHaveLength(0);
    });
  });

  describe('custom options', () => {
    it('should accept custom duration', () => {
      toastManager.success('Custom duration', { duration: 5000 });

      expect(receivedToasts[0].duration).toBe(5000);
    });

    it('should accept action button', () => {
      const mockAction = vi.fn();
      toastManager.info('With action', {
        action: { label: 'Undo', onClick: mockAction },
      });

      expect(receivedToasts[0].action).toBeDefined();
      expect(receivedToasts[0].action?.label).toBe('Undo');
      expect(receivedToasts[0].action?.onClick).toBe(mockAction);
    });
  });

  describe('promise wrapper', () => {
    it('should show loading then success', async () => {
      const mockPromise = new Promise((resolve) =>
        setTimeout(() => resolve('result'), 100)
      );

      const promiseWrapper = toastManager.promise(mockPromise, {
        loading: 'Processing...',
        success: 'Done!',
        error: 'Failed!',
      });

      // Should show loading toast immediately
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('loading');
      expect(receivedToasts[0].message).toBe('Processing...');

      // Advance time to resolve promise
      await vi.advanceTimersByTimeAsync(150);

      // Wait for promise to resolve
      const result = await promiseWrapper;
      expect(result).toBe('result');

      // Should show success toast
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('success');
      expect(receivedToasts[0].message).toBe('Done!');
    });

    it('should show loading then error on rejection', async () => {
      const mockPromise = Promise.reject(new Error('failed'));

      const promiseWrapper = toastManager
        .promise(mockPromise, {
          loading: 'Processing...',
          success: 'Done!',
          error: 'Failed!',
        })
        .catch(() => {
          // Handle rejection to prevent unhandled rejection
        });

      // Should show loading toast
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('loading');

      // Wait for promise to settle
      await promiseWrapper;

      // Advance time to allow toast updates
      await vi.advanceTimersByTimeAsync(10);

      // Should show error toast
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].type).toBe('error');
      expect(receivedToasts[0].message).toBe('Failed!');
    });

    it('should accept dynamic success message', async () => {
      const mockPromise = Promise.resolve({ count: 5 });

      await toastManager.promise(mockPromise, {
        loading: 'Uploading...',
        success: (data) => `Uploaded ${data.count} files`,
        error: 'Upload failed',
      });

      expect(receivedToasts[0].type).toBe('success');
      expect(receivedToasts[0].message).toBe('Uploaded 5 files');
    });

    it('should accept dynamic error message', async () => {
      const mockPromise = Promise.reject(new Error('Network timeout'));

      try {
        await toastManager.promise(mockPromise, {
          loading: 'Connecting...',
          success: 'Connected',
          error: (err: Error) => `Connection failed: ${err.message}`,
        });
      } catch {
        // Expected to fail
      }

      expect(receivedToasts[0].type).toBe('error');
      expect(receivedToasts[0].message).toBe(
        'Connection failed: Network timeout'
      );
    });
  });

  describe('subscriber notifications', () => {
    it('should notify all subscribers of changes', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsub1 = toastManager.subscribe(listener1);
      const unsub2 = toastManager.subscribe(listener2);

      toastManager.info('Test');

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();

      unsub1();
      unsub2();
    });

    it('should stop notifying after unsubscribe', () => {
      const listener = vi.fn();
      const unsub = toastManager.subscribe(listener);

      toastManager.info('Test 1');
      expect(listener).toHaveBeenCalledTimes(2); // Initial + 1 toast

      listener.mockClear();
      unsub();

      toastManager.info('Test 2');
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('toast properties', () => {
    it('should generate unique IDs', () => {
      const id1 = toastManager.info('Toast 1');
      const id2 = toastManager.info('Toast 2');

      expect(id1).not.toBe(id2);
    });

    it('should include creation timestamp', () => {
      const before = Date.now();
      toastManager.info('Test');
      const after = Date.now();

      const toast = receivedToasts[0];
      expect(toast.createdAt).toBeGreaterThanOrEqual(before);
      expect(toast.createdAt).toBeLessThanOrEqual(after);
    });

    it('should use default durations for each type', () => {
      toastManager.dismissAll();

      toastManager.success('Success');
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].duration).toBe(4000);

      toastManager.dismissAll();
      toastManager.error('Error');
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].duration).toBe(6000);

      toastManager.dismissAll();
      toastManager.warning('Warning');
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].duration).toBe(5000);

      toastManager.dismissAll();
      toastManager.info('Info');
      expect(receivedToasts).toHaveLength(1);
      expect(receivedToasts[0].duration).toBe(4000);
    });
  });
});
