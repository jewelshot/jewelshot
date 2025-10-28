/**
 * Gallery Storage Utility
 *
 * Manages saving and retrieving images to/from localStorage
 * In production, this would be replaced with API calls to a database
 */

export interface SavedImage {
  id: string;
  src: string; // base64 data URL
  alt: string;
  createdAt: Date;
  type: 'ai-edited' | 'manual';
}

const STORAGE_KEY = 'jewelshot_gallery_images';
const MAX_IMAGES =
  parseInt(process.env.NEXT_PUBLIC_MAX_GALLERY_IMAGES || '100', 10) || 100;

/**
 * Get all saved images from localStorage
 */
export function getSavedImages(): SavedImage[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Array<
      Omit<SavedImage, 'createdAt'> & { createdAt: string }
    >;
    // Convert date strings back to Date objects
    return parsed.map((img) => ({
      ...img,
      createdAt: new Date(img.createdAt),
    }));
  } catch (error) {
    console.error('Failed to load gallery images:', error);
    return [];
  }
}

/**
 * Save a new image to gallery
 */
export function saveImageToGallery(
  src: string,
  alt: string,
  type: 'ai-edited' | 'manual' = 'manual'
): SavedImage {
  const existing = getSavedImages();

  // Check image limit
  if (existing.length >= MAX_IMAGES) {
    throw new Error(
      `Gallery limit reached (${MAX_IMAGES} images). Please delete some images first.`
    );
  }

  const newImage: SavedImage = {
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    src,
    alt,
    createdAt: new Date(),
    type,
  };

  const updated = [newImage, ...existing]; // Add to beginning

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newImage;
  } catch (error) {
    console.error('Failed to save image to gallery:', error);

    // Handle quota exceeded
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      throw new Error(
        'Storage quota exceeded. Please delete some images or use a smaller image size.'
      );
    }

    throw new Error('Failed to save image. Please try again.');
  }
}

/**
 * Delete an image from gallery
 */
export function deleteImageFromGallery(imageId: string): void {
  const existing = getSavedImages();
  const filtered = existing.filter((img) => img.id !== imageId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete image from gallery:', error);
    throw new Error('Failed to delete image.');
  }
}

/**
 * Clear all images from gallery
 */
export function clearGallery(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear gallery:', error);
  }
}

/**
 * Get gallery image count
 */
export function getGalleryImageCount(): number {
  return getSavedImages().length;
}
