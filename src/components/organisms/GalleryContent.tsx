'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GalleryToolbar from '@/components/molecules/GalleryToolbar';
import GalleryGrid, { GalleryImage } from '@/components/molecules/GalleryGrid';
import { SortOption } from '@/components/atoms/SortButton';
import { getSavedImages, deleteImageFromGallery } from '@/lib/gallery-storage';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Gallery');

export function GalleryContent() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'ai-edited' | 'manual'
  >('all');
  const [sortValue, setSortValue] = useState<SortOption>('newest');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load images from localStorage
  useEffect(() => {
    const loadImages = () => {
      const saved = getSavedImages();
      setImages(saved);
    };

    loadImages();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jewelshot_gallery_images') {
        loadImages();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshKey]);

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    let filtered = images;

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((img) => img.type === activeFilter);
    }

    // Apply search
    if (searchValue) {
      filtered = filtered.filter((img) =>
        img.alt?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortValue) {
        case 'newest':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'oldest':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'name-asc':
          return (a.alt || '').localeCompare(b.alt || '');
        case 'name-desc':
          return (b.alt || '').localeCompare(a.alt || '');
        default:
          return 0;
      }
    });

    return sorted;
  }, [images, searchValue, activeFilter, sortValue]);

  const handleOpenInStudio = (image: GalleryImage) => {
    // Pass image URL via query param to studio page
    const params = new URLSearchParams({
      imageUrl: image.src,
      imageName: image.alt || 'gallery-image',
    });
    router.push(`/studio?${params.toString()}`);
  };

  const handleDownload = (image: GalleryImage) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `jewelshot-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (image: GalleryImage) => {
    if (confirm(`Are you sure you want to delete "${image.alt}"?`)) {
      try {
        deleteImageFromGallery(image.id);
        // Refresh the list
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        logger.error('Failed to delete image:', error);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  return (
    <div
      className="fixed z-10 flex h-full flex-col gap-6 overflow-y-auto p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: '260px',
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[rgba(196,181,253,1)]">
          Gallery
        </h1>
        <p className="mt-1 text-sm text-[rgba(196,181,253,0.6)]">
          Browse and manage your jewelry images
        </p>
      </div>

      {/* Toolbar */}
      <GalleryToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      {/* Grid */}
      <GalleryGrid
        images={filteredAndSortedImages}
        onOpenInStudio={handleOpenInStudio}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default GalleryContent;
