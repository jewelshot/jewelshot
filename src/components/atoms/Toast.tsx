'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'border-green-500/40 bg-green-950/40 text-green-100',
  error: 'border-red-500/40 bg-red-950/40 text-red-100',
  warning: 'border-yellow-500/40 bg-yellow-950/40 text-yellow-100',
  info: 'border-blue-500/40 bg-blue-950/40 text-blue-100',
};

const iconColorMap = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

/**
 * Toast Notification Component
 *
 * Displays temporary notification messages with auto-dismiss
 *
 * @example
 * ```tsx
 * <Toast
 *   message="File uploaded successfully!"
 *   type="success"
 *   onClose={() => setShowToast(false)}
 * />
 * ```
 */
export function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}: ToastProps) {
  const Icon = iconMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`animate-in slide-in-from-top-2 fixed right-4 top-4 z-[9999] flex max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md ${colorMap[type]}`}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconColorMap[type]}`} />

      <p className="flex-1 text-sm font-medium">{message}</p>

      <button
        onClick={onClose}
        className="flex-shrink-0 rounded p-1 transition-colors hover:bg-white/10"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Toast;
