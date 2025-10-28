/**
 * Gallery Page
 *
 * Browse and manage jewelry images with filtering and sorting.
 * Uses dynamic imports for better code splitting.
 */

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';

// Dynamic imports for heavy components
const GalleryContent = dynamic(
  () => import('@/components/organisms/GalleryContent'),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading Gallery...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const Sidebar = dynamic(() => import('@/components/organisms/Sidebar'), {
  loading: () => null,
});
const SidebarToggle = dynamic(() => import('@/components/atoms/SidebarToggle'));

export default function GalleryPage() {
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Gallery Content - Wrapped in Error Boundary */}
      <ErrorBoundary>
        <GalleryContent />
      </ErrorBoundary>
    </>
  );
}
