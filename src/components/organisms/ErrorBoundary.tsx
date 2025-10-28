'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in child component tree,
 * logs errors, and displays fallback UI instead of crashing.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <Canvas />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, send to error tracking service (Sentry, etc.)
    // logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
          <div className="max-w-md space-y-6 rounded-xl border border-red-500/30 bg-red-950/20 p-8 text-center backdrop-blur-sm">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400" />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Oops! Something went wrong
              </h1>
              <p className="text-white/60">
                We&apos;re sorry, but the application encountered an unexpected
                error.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 rounded-lg bg-black/50 p-4 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-red-300">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-red-200">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-600/20 px-4 py-3 font-semibold text-white transition-all hover:border-purple-500/60 hover:bg-purple-600/30"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition-all hover:border-white/30 hover:bg-white/20"
              >
                Reload Page
              </button>
            </div>

            <p className="text-xs text-white/40">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
