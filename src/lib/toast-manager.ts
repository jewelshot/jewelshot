/**
 * Global Toast Manager
 *
 * Centralized toast notification system with queue support.
 * Replaces browser notifications with in-app toasts.
 *
 * @example
 * ```ts
 * import { toastManager } from '@/lib/toast-manager';
 *
 * toastManager.success('Image saved!');
 * toastManager.error('Failed to upload', { duration: 5000 });
 * toastManager.promise(
 *   uploadImage(),
 *   {
 *     loading: 'Uploading...',
 *     success: 'Upload complete!',
 *     error: 'Upload failed'
 *   }
 * );
 * ```
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions {
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  action?: ToastOptions['action'];
  createdAt: number;
}

type ToastListener = (toasts: Toast[]) => void;

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxToasts = 3; // Max simultaneous toasts

  /**
   * Subscribe to toast updates
   */
  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  /**
   * Add a new toast
   */
  private add(type: ToastType, message: string, options: ToastOptions = {}) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = {
      id,
      type,
      message,
      duration: options.duration ?? 4000,
      action: options.action,
      createdAt: Date.now(),
    };

    // Add to queue (limit max toasts)
    this.toasts = [...this.toasts, toast].slice(-this.maxToasts);
    this.notify();

    // Auto-dismiss if duration > 0
    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  /**
   * Dismiss a specific toast
   */
  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    this.toasts = [];
    this.notify();
  }

  /**
   * Show success toast
   */
  success(message: string, options?: ToastOptions) {
    return this.add('success', message, options);
  }

  /**
   * Show error toast
   */
  error(message: string, options?: ToastOptions) {
    return this.add('error', message, { duration: 6000, ...options });
  }

  /**
   * Show warning toast
   */
  warning(message: string, options?: ToastOptions) {
    return this.add('warning', message, { duration: 5000, ...options });
  }

  /**
   * Show info toast
   */
  info(message: string, options?: ToastOptions) {
    return this.add('info', message, options);
  }

  /**
   * Show loading toast (no auto-dismiss)
   */
  loading(message: string) {
    return this.add('loading', message, { duration: 0 });
  }

  /**
   * Promise-based toast (loading → success/error)
   */
  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ): Promise<T> {
    const loadingId = this.loading(messages.loading);

    try {
      const result = await promise;
      this.dismiss(loadingId);

      const successMsg =
        typeof messages.success === 'function'
          ? messages.success(result)
          : messages.success;
      this.success(successMsg);

      return result;
    } catch (error) {
      this.dismiss(loadingId);

      const errorMsg =
        typeof messages.error === 'function'
          ? messages.error(error)
          : messages.error;
      this.error(errorMsg);

      throw error;
    }
  }

  /**
   * Replace browser notifications with app toasts
   */
  replaceNotifications() {
    if (typeof window === 'undefined') return;

    // Override window.alert
    const originalAlert = window.alert;
    window.alert = (message) => {
      this.warning(String(message), { duration: 0 });
      // Still call original for accessibility
      if (process.env.NODE_ENV === 'development') {
        originalAlert(message);
      }
    };

    // Override window.confirm (show warning toast, but still return true)
    const originalConfirm = window.confirm;
    window.confirm = (message) => {
      const result = originalConfirm(message);
      if (!result) {
        this.info('Action cancelled');
      }
      return result;
    };
  }
}

// Singleton instance
export const toastManager = new ToastManager();

// Auto-replace notifications on import (only in browser)
if (typeof window !== 'undefined') {
  // Don't replace for now, as it might break existing functionality
  // toastManager.replaceNotifications();
}
