'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GalleryToolbar from '@/components/molecules/GalleryToolbar';
import GalleryGrid, { GalleryImage } from '@/components/molecules/GalleryGrid';
import { SortOption } from '@/components/atoms/SortButton';

// Mock data for demonstration - in production, this would come from a database
const mockImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    alt: 'Diamond ring',
    createdAt: new Date('2024-10-28'),
    type: 'ai-edited',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
    alt: 'Gold necklace',
    createdAt: new Date('2024-10-27'),
    type: 'manual',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500',
    alt: 'Pearl earrings',
    createdAt: new Date('2024-10-26'),
    type: 'ai-edited',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    alt: 'Silver bracelet',
    createdAt: new Date('2024-10-25'),
    type: 'manual',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500',
    alt: 'Emerald ring',
    createdAt: new Date('2024-10-24'),
    type: 'ai-edited',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    alt: 'Ruby pendant',
    createdAt: new Date('2024-10-23'),
    type: 'ai-edited',
  },
];

export function GalleryContent() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'ai-edited' | 'manual'
  >('all');
  const [sortValue, setSortValue] = useState<SortOption>('newest');

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    let filtered = mockImages;

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
  }, [searchValue, activeFilter, sortValue]);

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
      // TODO: In production, make API call to delete image
      console.log('Delete image:', image.id);
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
