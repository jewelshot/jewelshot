/**
 * Studio Page
 *
 * Main studio workspace with complete layout.
 * Includes TopBar, Sidebar, Canvas, RightSidebar, and BottomBar.
 */

import AuroraBackground from '@/components/atoms/AuroraBackground';
import StudioLayout from '@/components/templates/StudioLayout';

export default function StudioPage() {
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Studio Layout */}
      <StudioLayout showRightSidebar={true}>
        {/* Canvas Area - Empty State */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="space-y-6 text-center">
            <div className="text-6xl">📸</div>
            <h2 className="text-2xl font-bold text-white">
              Welcome to Jewelshot Studio
            </h2>
            <p className="text-white/60">Upload an image to start editing</p>
            <button className="rounded-xl border border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(99,102,241,0.1)] px-6 py-3 font-semibold text-white transition-all hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
              📁 Upload Image
            </button>
          </div>
        </div>
      </StudioLayout>
    </>
  );
}
