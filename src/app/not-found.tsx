/**
 * 404 Not Found Page
 *
 * Minimal and elegant 404 page with subtle animations.
 * Designed to match the app's sophisticated aesthetic.
 */

'use client';

import { useRouter } from 'next/navigation';
import AuroraBackground from '@/components/atoms/AuroraBackground';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <AuroraBackground />

      {/* Main Container - Fixed height to prevent layout shift */}
      <div className="fixed inset-0 z-10 flex items-center justify-center p-6">
        <div className="flex w-full max-w-lg flex-col items-center gap-10 text-center">
          {/* 404 Number - Elegant and minimal */}
          <div
            className="relative"
            style={{
              opacity: 0,
              animation:
                'gentleFadeIn 1200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div
              className="text-[100px] font-light leading-none tracking-wider text-white/90"
              style={{
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              404
            </div>

            {/* Subtle underline */}
            <div
              className="mx-auto mt-4 h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
              style={{
                opacity: 0,
                animation:
                  'gentleFadeIn 1200ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards',
              }}
            />
          </div>

          {/* Text Content */}
          <div
            className="flex flex-col gap-3"
            style={{
              opacity: 0,
              animation:
                'gentleFadeIn 1200ms cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards',
            }}
          >
            <h1 className="text-xl font-normal text-white/95">
              Page Not Found
            </h1>
            <p className="text-sm font-light leading-relaxed text-white/50">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>

          {/* Actions - Minimal buttons */}
          <div
            className="flex items-center gap-4"
            style={{
              opacity: 0,
              animation:
                'gentleFadeIn 1200ms cubic-bezier(0.16, 1, 0.3, 1) 600ms forwards',
            }}
          >
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-normal text-white/80 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </span>
            </button>

            {/* Home Button */}
            <button
              onClick={() => router.push('/studio')}
              className="group relative overflow-hidden rounded-lg border border-purple-500/20 bg-purple-500/10 px-5 py-2.5 text-[13px] font-normal text-white backdrop-blur-sm transition-all duration-500 hover:border-purple-500/30 hover:bg-purple-500/20"
            >
              <span className="flex items-center gap-2">
                Home
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Animations - Smooth and subtle */}
      <style jsx>{`
        @keyframes gentleFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
