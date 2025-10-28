/**
 * 404 Not Found Page
 *
 * Animated and stylish 404 page with glassmorphic design
 * matching the app's purple/dark theme.
 */

'use client';

import { useRouter } from 'next/navigation';
import AuroraBackground from '@/components/atoms/AuroraBackground';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <AuroraBackground />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-6">
        {/* Main Card */}
        <div
          className="relative flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-black/40 px-12 py-16 text-center shadow-2xl backdrop-blur-xl"
          style={{
            animation: 'fadeInScale 600ms ease-out',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Animated 404 */}
          <div className="relative">
            <div
              className="text-[120px] font-bold leading-none tracking-tight"
              style={{
                background:
                  'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              404
            </div>

            {/* Glow effect */}
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-3">
            <h1
              className="text-2xl font-semibold text-white"
              style={{
                animation: 'fadeInUp 600ms ease-out 200ms backwards',
              }}
            >
              Page Not Found
            </h1>
            <p
              className="max-w-md text-sm text-white/60"
              style={{
                animation: 'fadeInUp 600ms ease-out 300ms backwards',
              }}
            >
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col gap-3 sm:flex-row"
            style={{
              animation: 'fadeInUp 600ms ease-out 400ms backwards',
            }}
          >
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </span>
            </button>

            {/* Home Button */}
            <button
              onClick={() => router.push('/studio')}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Home
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>

              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </>
  );
}
