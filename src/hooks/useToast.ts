import { useState, useCallback } from 'react';
import { ToastType } from '@/components/atoms/Toast';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

/**
 * Custom hook for managing toast notifications
 *
 * @example
 * ```tsx
 * const { showToast, toastState, hideToast } = useToast();
 *
 * // Show error toast
 * showToast('Failed to upload file', 'error');
 *
 * // Show success toast
 * showToast('File uploaded successfully!', 'success');
 * ```
 */
export function useToast() {
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToastState({
      message,
      type,
      visible: true,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return {
    showToast,
    hideToast,
    toastState,
  };
}
