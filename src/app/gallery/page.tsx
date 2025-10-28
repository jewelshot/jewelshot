/**
 * Gallery Page
 *
 * Browse and manage jewelry images with filtering and sorting.
 */

import AuroraBackground from '@/components/atoms/AuroraBackground';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarToggle from '@/components/atoms/SidebarToggle';
import GalleryContent from '@/components/organisms/GalleryContent';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';

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
