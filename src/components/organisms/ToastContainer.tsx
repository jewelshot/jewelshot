'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Info,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { toastManager, Toast, ToastType } from '@/lib/toast-manager';

const iconMap: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const colorMap: Record<ToastType, string> = {
  success: 'border-green-500/40 bg-green-950/20 text-green-100',
  error: 'border-red-500/40 bg-red-950/20 text-red-100',
  warning: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-100',
  info: 'border-purple-500/40 bg-purple-950/20 text-purple-100',
  loading: 'border-blue-500/40 bg-blue-950/20 text-blue-100',
};

const iconColorMap: Record<ToastType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-purple-400',
  loading: 'text-blue-400 animate-spin',
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = iconMap[toast.type];
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration === 0) return; // No progress for persistent toasts

    const startTime = Date.now();
    const endTime = toast.createdAt + toast.duration;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const percent = (remaining / toast.duration) * 100;

      if (percent <= 0) {
        clearInterval(interval);
        setProgress(0);
      } else {
        setProgress(percent);
      }
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [toast.createdAt, toast.duration]);

  return (
    <div
      className={`relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-2xl backdrop-blur-xl transition-all ${colorMap[toast.type]} animate-in slide-in-from-right-full duration-300`}
      role="alert"
    >
      {/* Progress bar (only for auto-dismissing toasts) */}
      {toast.duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-[16ms]"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Icon */}
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconColorMap[toast.type]}`} />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium leading-tight">{toast.message}</p>

        {/* Action button (if provided) */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              onDismiss(toast.id);
            }}
            className="text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 rounded p-1 transition-colors hover:bg-white/10"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Global Toast Container
 *
 * Displays queued toast notifications with animations.
 * Should be rendered once at the app root level.
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onDismiss={toastManager.dismiss.bind(toastManager)}
          />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
