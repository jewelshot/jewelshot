/**
 * Home Page - Testing Aurora Background + Sidebar
 * Step 1: Aurora animations ✅
 * Step 2: Sidebar with glassmorphism ✅
 */

import AuroraBackground from '@/components/atoms/AuroraBackground';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarToggle from '@/components/atoms/SidebarToggle';

export default function Home() {
  return (
    <div className="relative h-screen w-screen">
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Sidebar Toggle */}
      <SidebarToggle />

      {/* Main Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="space-y-6 text-center">
          <h1 className="text-6xl font-bold text-white">Jewelshot Studio</h1>
          <p className="text-xl text-white/70">Step 2: Sidebar Component ✨</p>
          <div className="text-sm text-white/50">
            Click the toggle button on the left to open sidebar!
          </div>
        </div>
      </div>
    </div>
  );
}
