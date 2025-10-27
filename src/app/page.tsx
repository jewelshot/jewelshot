/**
 * Home Page - Testing Aurora Background
 * Step 1: Verify aurora animations work correctly
 */

import AuroraBackground from '@/components/atoms/AuroraBackground';

export default function Home() {
  return (
    <div className="relative w-screen h-screen">
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Test Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-white">
            Jewelshot Studio
          </h1>
          <p className="text-xl text-white/70">
            Step 1: Aurora Background ✨
          </p>
          <div className="text-sm text-white/50">
            If you see animated gradient blobs, Step 1 is complete!
          </div>
        </div>
      </div>
    </div>
  );
}
