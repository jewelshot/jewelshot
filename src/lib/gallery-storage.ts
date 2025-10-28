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
  const newImage: SavedImage = {
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    src,
    alt,
    createdAt: new Date(),
    type,
  };

  const existing = getSavedImages();
  const updated = [newImage, ...existing]; // Add to beginning

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newImage;
  } catch (error) {
    console.error('Failed to save image to gallery:', error);
    throw new Error('Failed to save image. Storage might be full.');
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
