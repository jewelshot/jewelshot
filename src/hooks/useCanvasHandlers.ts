/**
 * Canvas Event Handlers Hook
 *
 * Extracted from Canvas.tsx to reduce component size.
 * Contains all event handlers for file operations, zoom, actions, and UI controls.
 */

import { useCallback, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { createScopedLogger } from '@/lib/logger';
import { validateFile } from '@/lib/validators';
import { uploadRateLimiter, galleryRateLimiter } from '@/lib/rate-limiter';
import { saveImageToGallery } from '@/lib/gallery-storage';

const logger = createScopedLogger('CanvasHandlers');

interface UseCanvasHandlersProps {
  // Refs
  fileInputRef: RefObject<HTMLInputElement>;

  // Image state
  uploadedImage: string | null;
  fileName: string;
  originalImage: string | null;

  // Image state setters
  setUploadedImage: (image: string | null) => void;
  setFileName: (name: string) => void;
  setFileSize: (size: number) => void;
  setIsLoading: (loading: boolean) => void;
  setOriginalImage: (image: string | null) => void;
  resetImageState: () => void;

  // Transform state
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  resetTransform: () => void;
  resetFilters: () => void;

  // UI state
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  isCropMode: boolean;

  // Filters
  adjustFilters: Record<string, number>;
  colorFilters: Record<string, number>;
  filterEffects: Record<string, number>;
  transform: { rotation: number; flipX: boolean; flipY: boolean };

  // View mode
  viewMode: 'normal' | 'side-by-side';
  activeImage: 'left' | 'right';
  leftImageScale: number;
  rightImageScale: number;
  leftImagePosition: { x: number; y: number };
  rightImagePosition: { x: number; y: number };
  setLeftImageScale: (scale: number | ((prev: number) => number)) => void;
  setRightImageScale: (scale: number | ((prev: number) => number)) => void;
  setLeftImagePosition: (pos: { x: number; y: number }) => void;
  setRightImagePosition: (pos: { x: number; y: number }) => void;

  // Toast
  showToast: (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => void;
}

export function useCanvasHandlers(props: UseCanvasHandlersProps) {
  const {
    fileInputRef,
    uploadedImage,
    fileName,
    originalImage,
    setUploadedImage,
    setFileName,
    setFileSize,
    setIsLoading,
    setOriginalImage,
    resetImageState,
    scale,
    setScale,
    setPosition,
    resetTransform,
    resetFilters,
    isFullscreen,
    setIsFullscreen,
    isCropMode,
    adjustFilters,
    colorFilters,
    filterEffects,
    transform,
    viewMode,
    activeImage,
    leftImageScale,
    rightImageScale,
    leftImagePosition,
    rightImagePosition,
    setLeftImageScale,
    setRightImageScale,
    setLeftImagePosition,
    setRightImagePosition,
    showToast,
  } = props;

  const router = useRouter();

  // ============================================================================
  // FILE OPERATIONS
  // ============================================================================

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check rate limit
      const rateLimit = uploadRateLimiter.checkLimit();
      if (!rateLimit.allowed) {
        showToast(
          `Too many uploads. Please wait ${rateLimit.retryAfter} seconds.`,
          'warning'
        );
        return;
      }

      // Comprehensive file validation
      const validation = await validateFile(file, {
        maxSizeMB: 10,
        minSizeMB: 0.001,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxDimensions: { width: 8000, height: 8000 },
        minDimensions: { width: 100, height: 100 },
      });

      if (!validation.valid) {
        showToast(validation.error || 'Invalid file', 'error');
        return;
      }

      // Record successful upload
      uploadRateLimiter.recordRequest();

      setIsLoading(true);
      setFileName(file.name);
      setFileSize(file.size);

      const reader = new FileReader();

      // Success handler
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            setUploadedImage(result);
            // Save original image for crop reset functionality
            setOriginalImage(result);
            resetTransform();
            resetFilters(); // Reset filters for new image
          } else {
            throw new Error('Failed to read image file');
          }
        } catch (error) {
          logger.error('Error processing image:', error);
          showToast('Failed to load image. Please try again.', 'error');
          resetImageState();
        } finally {
          setIsLoading(false);
        }
      };

      // Error handler
      reader.onerror = () => {
        logger.error('FileReader error:', reader.error);
        showToast('Failed to read file. The file may be corrupted.', 'error');
        setIsLoading(false);
        resetImageState();
      };

      // Abort handler
      reader.onabort = () => {
        logger.debug('File reading was aborted');
        setIsLoading(false);
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        logger.error('Error reading file:', error);
        showToast('Failed to read file. Please try again.', 'error');
        setIsLoading(false);
        resetImageState();
      } finally {
        // Reset file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [
      showToast,
      setUploadedImage,
      setFileName,
      setFileSize,
      setIsLoading,
      resetTransform,
      resetFilters,
      resetImageState,
      fileInputRef,
      setOriginalImage,
    ]
  );

  const handleCloseImage = useCallback(() => {
    // Reset image state
    resetImageState();
    // Reset transform
    resetTransform();
    // Reset filters
    resetFilters();
    // Reset original image (for comparison)
    setOriginalImage(null);
    // Reset file input so new images can be uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Navigate to studio without query params
    router.replace('/studio', { scroll: false });
  }, [
    resetImageState,
    resetTransform,
    resetFilters,
    setOriginalImage,
    fileInputRef,
    router,
  ]);

  // ============================================================================
  // ZOOM CONTROLS
  // ============================================================================

  const handleZoomIn = useCallback(() => {
    if (viewMode === 'side-by-side') {
      if (activeImage === 'left') {
        setLeftImageScale((prev) => Math.min(prev + 0.1, 3.0));
      } else {
        setRightImageScale((prev) => Math.min(prev + 0.1, 3.0));
      }
    } else {
      setScale((prev) => Math.min(prev + 0.1, 3.0));
    }
  }, [viewMode, activeImage, setScale, setLeftImageScale, setRightImageScale]);

  const handleZoomOut = useCallback(() => {
    if (viewMode === 'side-by-side') {
      if (activeImage === 'left') {
        setLeftImageScale((prev) => Math.max(prev - 0.1, 0.1));
      } else {
        setRightImageScale((prev) => Math.max(prev - 0.1, 0.1));
      }
    } else {
      setScale((prev) => Math.max(prev - 0.1, 0.1));
    }
  }, [viewMode, activeImage, setScale, setLeftImageScale, setRightImageScale]);

  const handleFitScreen = useCallback(() => {
    if (viewMode === 'side-by-side') {
      // Fit both images in compare mode
      setLeftImageScale(1.0);
      setLeftImagePosition({ x: 0, y: 0 });
      setRightImageScale(1.0);
      setRightImagePosition({ x: 0, y: 0 });
    } else {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  }, [
    viewMode,
    setScale,
    setPosition,
    setLeftImageScale,
    setRightImageScale,
    setLeftImagePosition,
    setRightImagePosition,
  ]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const handleSave = useCallback(async () => {
    if (!uploadedImage) return;

    // Check rate limit
    const rateLimit = galleryRateLimiter.checkLimit();
    if (!rateLimit.allowed) {
      showToast(
        `Too many saves. Please wait ${rateLimit.retryAfter} seconds.`,
        'warning'
      );
      return;
    }

    try {
      // Save to gallery
      await Promise.resolve().then(() => {
        galleryRateLimiter.recordRequest();

        const savedImage = saveImageToGallery(
          uploadedImage,
          fileName || 'edited-image.jpg',
          originalImage ? 'ai-edited' : 'manual'
        );

        if (!savedImage) {
          throw new Error('Failed to save image');
        }

        // Dispatch custom event for gallery sync
        window.dispatchEvent(new Event('gallery-updated'));

        showToast('Image saved to gallery!', 'success');
      });
    } catch (error) {
      logger.error('Failed to save image:', error);
      showToast('Failed to save image to gallery', 'error');
    }
  }, [uploadedImage, fileName, originalImage, showToast]);

  const handleDownload = useCallback(async () => {
    if (!uploadedImage) return;

    try {
      // Create canvas to apply filters
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          showToast('Failed to create canvas context', 'error');
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply transformations and filters
        ctx.save();

        // Apply rotation and flip
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);

        if (transform.rotation !== 0) {
          ctx.rotate((transform.rotation * Math.PI) / 180);
        }

        ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);

        // Apply filters
        const filters = [];
        if (adjustFilters.brightness !== 0) {
          filters.push(`brightness(${100 + adjustFilters.brightness}%)`);
        }
        if (adjustFilters.contrast !== 0) {
          filters.push(`contrast(${100 + adjustFilters.contrast}%)`);
        }
        if (colorFilters.saturation !== 0) {
          filters.push(`saturate(${100 + colorFilters.saturation}%)`);
        }
        if (filters.length > 0) {
          ctx.filter = filters.join(' ');
        }

        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
        ctx.restore();

        // Download
        canvas.toBlob((blob) => {
          if (!blob) {
            showToast('Failed to create image blob', 'error');
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName || 'edited-image.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          showToast('Image downloaded successfully!', 'success');
        }, 'image/jpeg');
      };

      img.onerror = () => {
        showToast('Failed to load image for download', 'error');
      };

      img.src = uploadedImage;
    } catch (error) {
      logger.error('Download error:', error);
      showToast('Failed to download image', 'error');
    }
  }, [
    uploadedImage,
    fileName,
    transform,
    adjustFilters,
    colorFilters,
    filterEffects,
    showToast,
  ]);

  const handleDelete = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to delete this image? This action cannot be undone.'
      )
    ) {
      handleCloseImage();
      showToast('Image deleted', 'info');
    }
  }, [handleCloseImage, showToast]);

  // ============================================================================
  // UI CONTROLS
  // ============================================================================

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      logger.error('Fullscreen error:', error);
      showToast('Failed to toggle fullscreen', 'error');
    }
  }, [setIsFullscreen, showToast]);

  return {
    // File operations
    handleUploadClick,
    handleFileChange,
    handleCloseImage,

    // Zoom controls
    handleZoomIn,
    handleZoomOut,
    handleFitScreen,

    // Actions
    handleSave,
    handleDownload,
    handleDelete,

    // UI controls
    toggleFullscreen,
  };
}
