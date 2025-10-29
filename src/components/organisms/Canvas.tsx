'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageState } from '@/hooks/useImageState';
import { useImageTransform } from '@/hooks/useImageTransform';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useCanvasUI } from '@/hooks/useCanvasUI';
import { useToast } from '@/hooks/useToast';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useImageEdit } from '@/hooks/useImageEdit';
import { createScopedLogger } from '@/lib/logger';
import { validateFile } from '@/lib/validators';
import { uploadRateLimiter } from '@/lib/rate-limiter';
import Toast from '@/components/atoms/Toast';

const logger = createScopedLogger('Canvas');
import AIEditControl from '@/components/molecules/AIEditControl';
import ZoomControls from '@/components/molecules/ZoomControls';
import ActionControls from '@/components/molecules/ActionControls';
import TopLeftControls from '@/components/molecules/TopLeftControls';
import BackgroundSelector from '@/components/molecules/BackgroundSelector';
import BottomRightControls from '@/components/molecules/BottomRightControls';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingState from '@/components/atoms/LoadingState';
import ImageViewer from '@/components/molecules/ImageViewer';
import EditPanel from '@/components/organisms/EditPanel';
import CropModal from '@/components/organisms/CropModal';
import UIToggleButton from '@/components/atoms/UIToggleButton';
import ViewModeSelector from '@/components/atoms/ViewModeSelector';
import KeyboardShortcutsModal from '@/components/molecules/KeyboardShortcutsModal';

export function Canvas() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    leftOpen,
    rightOpen,
    topOpen,
    bottomOpen,
    toggleAll,
    openLeft,
    closeLeft,
    openRight,
    closeRight,
    openTop,
    closeTop,
    openBottom,
    closeBottom,
  } = useSidebarStore();

  // Image upload state (extracted to hook)
  const {
    uploadedImage,
    setUploadedImage,
    fileName,
    setFileName,
    fileSize,
    setFileSize,
    isLoading,
    setIsLoading,
    resetImageState,
  } = useImageState();

  // Image transformation state (extracted to hook)
  const {
    scale,
    setScale,
    position,
    setPosition,
    transform,
    setTransform,
    resetTransform,
  } = useImageTransform();

  // Image filters state (extracted to hook)
  const {
    adjustFilters,
    setAdjustFilters,
    colorFilters,
    setColorFilters,
    filterEffects,
    setFilterEffects,
    resetFilters,
  } = useImageFilters();

  // Canvas UI state (extracted to hook)
  const {
    isFullscreen,
    setIsFullscreen,
    background,
    setBackground,
    cropRatio,
    setCropRatio,
    isCropMode,
    setIsCropMode,
    resetCropState,
  } = useCanvasUI();

  // Canvas-specific UI state (not extracted)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [savedBarStates, setSavedBarStates] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  const [canvasControlsVisible, setCanvasControlsVisible] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Toast notifications
  const { showToast, hideToast, toastState } = useToast();

  // AI Image Edit & Comparison
  // Track AI image loading state
  const [isAIImageLoading, setIsAIImageLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'side-by-side'>('normal');

  // Independent states for side-by-side comparison
  const [leftImageScale, setLeftImageScale] = useState(1.0);
  const [leftImagePosition, setLeftImagePosition] = useState({ x: 0, y: 0 });
  const [rightImageScale, setRightImageScale] = useState(1.0);
  const [rightImagePosition, setRightImagePosition] = useState({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState<'left' | 'right'>('right'); // Which image is on top

  const {
    edit: editWithAI,
    isEditing: isAIEditing,
    progress: aiProgress,
  } = useImageEdit({
    onSuccess: (result) => {
      if (result.images && result.images.length > 0) {
        setIsAIImageLoading(true); // Start loading overlay
        setUploadedImage(result.images[0].url);
        showToast('Image edited successfully!', 'success');
      }
    },
    onError: (error) => {
      setIsAIImageLoading(false); // Clear loading state on error
      showToast(error.message || 'Failed to edit image', 'error');
    },
  });

  // Handle AI image load complete
  const handleAIImageLoad = useCallback(() => {
    setIsAIImageLoading(false);
  }, []);

  // Handle AI image load error
  const handleAIImageError = useCallback(() => {
    setIsAIImageLoading(false);
    showToast('Failed to load generated image', 'error');
  }, [showToast]);

  // Sync comparison states when switching view modes
  useEffect(() => {
    if (viewMode === 'side-by-side') {
      // Initialize side-by-side states with current values
      setLeftImageScale(scale);
      setLeftImagePosition(position);
      setRightImageScale(scale);
      setRightImagePosition(position);
      setActiveImage('right');
    } else {
      // Sync back to single state when switching to normal
      // Use right image state as the source (AI generated)
      setScale(rightImageScale);
      setPosition(rightImagePosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]); // Only run when viewMode changes

  // Update main zoom/position based on active image in compare mode
  useEffect(() => {
    if (viewMode === 'side-by-side') {
      if (activeImage === 'left') {
        setScale(leftImageScale);
        setPosition(leftImagePosition);
      } else {
        setScale(rightImageScale);
        setPosition(rightImagePosition);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeImage,
    leftImageScale,
    leftImagePosition,
    rightImageScale,
    rightImagePosition,
    viewMode,
  ]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
            resetTransform();
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
      }
    },
    [
      showToast,
      setUploadedImage,
      setFileName,
      setFileSize,
      setIsLoading,
      resetTransform,
      resetImageState,
    ]
  );

  const handleCloseImage = useCallback(() => {
    // Reset image state (uploadedImage, fileName, fileSize, isLoading)
    resetImageState();

    // Reset transformation state (scale, position, transform)
    resetTransform();

    // Reset all filters (adjust, color, effects)
    resetFilters();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditPanelOpen(false); // Close EditPanel when image is closed
  }, [resetImageState, resetTransform, resetFilters]);

  // Load image from gallery via query param
  useEffect(() => {
    const imageUrl = searchParams.get('imageUrl');
    const imageName = searchParams.get('imageName');

    if (imageUrl && !uploadedImage) {
      try {
        // Check if it's a base64 data URL (from localStorage gallery)
        if (imageUrl.startsWith('data:')) {
          // Direct base64 - no need to fetch
          setUploadedImage(imageUrl);
          setFileName(imageName || 'gallery-image.jpg');

          // Estimate file size from base64 length
          const base64Data = imageUrl.split(',')[1] || '';
          const estimatedSize = (base64Data.length * 3) / 4; // Base64 to bytes
          setFileSize(estimatedSize);

          // Reset transformations and filters for fresh start
          resetTransform();
          resetFilters();

          showToast('Image loaded from gallery!', 'success');

          // Clear query params
          router.replace('/studio', { scroll: false });
        } else {
          // External URL - fetch it
          setIsLoading(true);

          fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result) {
                  setUploadedImage(e.target.result as string);
                  setFileName(imageName || 'gallery-image.jpg');
                  setFileSize(blob.size);
                  setIsLoading(false);

                  // Reset transformations and filters for fresh start
                  resetTransform();
                  resetFilters();

                  showToast('Image loaded from gallery!', 'success');

                  // Clear query params
                  router.replace('/studio', { scroll: false });
                }
              };
              reader.onerror = () => {
                setIsLoading(false);
                showToast('Failed to load image from gallery', 'error');
                router.replace('/studio', { scroll: false });
              };
              reader.readAsDataURL(blob);
            })
            .catch(() => {
              setIsLoading(false);
              showToast('Failed to fetch image from gallery', 'error');
              router.replace('/studio', { scroll: false });
            });
        }
      } catch (error) {
        logger.error('Failed to load image from gallery:', error);
        showToast('Failed to load image from gallery', 'error');
        setIsLoading(false);
        router.replace('/studio', { scroll: false });
      }
    }
  }, [
    searchParams,
    uploadedImage,
    router,
    setIsLoading,
    setUploadedImage,
    setFileName,
    setFileSize,
    resetTransform,
    resetFilters,
    showToast,
  ]);

  const handleZoomIn = useCallback(() => {
    if (viewMode === 'side-by-side') {
      // Update the active image's zoom
      if (activeImage === 'left') {
        setLeftImageScale((prev) => Math.min(prev + 0.1, 3.0));
      } else {
        setRightImageScale((prev) => Math.min(prev + 0.1, 3.0));
      }
    } else {
      setScale((prev) => Math.min(prev + 0.1, 3.0));
    }
  }, [viewMode, activeImage, setScale]);

  const handleZoomOut = useCallback(() => {
    if (viewMode === 'side-by-side') {
      // Update the active image's zoom
      if (activeImage === 'left') {
        setLeftImageScale((prev) => Math.max(prev - 0.1, 0.1));
      } else {
        setRightImageScale((prev) => Math.max(prev - 0.1, 0.1));
      }
    } else {
      setScale((prev) => Math.max(prev - 0.1, 0.1));
    }
  }, [viewMode, activeImage, setScale]);

  const handleFitScreen = useCallback(() => {
    if (viewMode === 'side-by-side') {
      // Reset the active image's position and zoom
      if (activeImage === 'left') {
        setLeftImageScale(1.0);
        setLeftImagePosition({ x: 0, y: 0 });
      } else {
        setRightImageScale(1.0);
        setRightImagePosition({ x: 0, y: 0 });
      }
    } else {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  }, [viewMode, activeImage, setScale, setPosition]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
      handleCloseImage();
    }
  };

  const handleSave = useCallback(() => {
    if (!uploadedImage) return;

    try {
      // Import dynamically to avoid SSR issues
      import('@/lib/gallery-storage').then(({ saveImageToGallery }) => {
        // Determine if this is an AI-edited image
        const type = originalImage ? 'ai-edited' : 'manual';

        // Save to gallery
        saveImageToGallery(uploadedImage, fileName || 'edited-image', type);

        // Dispatch custom event to update sidebar count
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
      // Create a canvas to apply filters and transformations
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to image size
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Apply CSS filters to canvas context
        const filters: string[] = [];

        // Adjust filters
        if (adjustFilters.brightness !== 0) {
          filters.push(`brightness(${100 + adjustFilters.brightness}%)`);
        }
        if (adjustFilters.contrast !== 0) {
          filters.push(`contrast(${100 + adjustFilters.contrast}%)`);
        }
        if (adjustFilters.exposure !== 0) {
          filters.push(`brightness(${100 + adjustFilters.exposure * 1.5}%)`);
        }
        if (adjustFilters.sharpness !== 0) {
          filters.push(`contrast(${100 + adjustFilters.sharpness * 0.5}%)`);
        }

        // Color filters
        if (colorFilters.temperature !== 0) {
          const hue = colorFilters.temperature * 0.5;
          filters.push(`hue-rotate(${hue}deg)`);
        }
        if (colorFilters.tint !== 0) {
          filters.push(`saturate(${100 + colorFilters.tint}%)`);
        }

        // Effect filters
        if (filterEffects.blur > 0) {
          filters.push(`blur(${filterEffects.blur}px)`);
        }
        if (filterEffects.grayscale > 0) {
          filters.push(`grayscale(${filterEffects.grayscale}%)`);
        }
        if (filterEffects.sepia > 0) {
          filters.push(`sepia(${filterEffects.sepia}%)`);
        }
        if (filterEffects.invert > 0) {
          filters.push(`invert(${filterEffects.invert}%)`);
        }

        ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';

        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((transform.rotation * Math.PI) / 180);
        ctx.scale(
          transform.flipHorizontal ? -1 : 1,
          transform.flipVertical ? -1 : 1
        );
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Convert canvas to blob and download
        canvas.toBlob(
          (blob) => {
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Generate filename with timestamp
            const timestamp = new Date()
              .toISOString()
              .slice(0, 19)
              .replace(/:/g, '-');
            const baseName = fileName?.replace(/\.[^/.]+$/, '') || 'jewelshot';
            link.download = `${baseName}_edited_${timestamp}.jpg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

            showToast('Image downloaded successfully!', 'success');
          },
          'image/jpeg',
          0.95
        );
      };

      img.onerror = () => {
        showToast('Failed to download image', 'error');
      };

      img.src = uploadedImage;
    } catch (error) {
      logger.error('Download error:', error);
      showToast('Failed to download image', 'error');
    }
  }, [
    uploadedImage,
    fileName,
    adjustFilters,
    colorFilters,
    filterEffects,
    transform,
    showToast,
  ]);

  const handleToggleEditPanel = () => {
    setIsEditPanelOpen((prev) => !prev);
  };

  // Auto-collapse/restore bars when edit panel opens/closes
  useEffect(() => {
    // Only run this effect when image is uploaded (prevents flash during image change)
    if (!uploadedImage) return;

    if (isEditPanelOpen) {
      // Opening edit panel - save current bar states and collapse all
      setSavedBarStates({
        left: leftOpen,
        right: rightOpen,
        top: topOpen,
        bottom: bottomOpen,
      });

      // Collapse all bars
      closeLeft();
      closeRight();
      closeTop();
      closeBottom();

      // Push image to the right (EditPanel width 384px + smaller gap = 200px offset)
      setPosition((prev) => ({ ...prev, x: prev.x + 200 }));
    } else {
      // Edit panel closed - restore previous bar states (only if we have saved states)
      if (
        savedBarStates.left ||
        savedBarStates.right ||
        savedBarStates.top ||
        savedBarStates.bottom
      ) {
        if (savedBarStates.left) openLeft();
        else closeLeft();

        if (savedBarStates.right) openRight();
        else closeRight();

        if (savedBarStates.top) openTop();
        else closeTop();

        if (savedBarStates.bottom) openBottom();
        else closeBottom();
      }

      // Reset image to center position
      setPosition((prev) => ({ ...prev, x: 0 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPanelOpen, uploadedImage]);

  const handleCropRatioChange = (ratio: number | null) => {
    setCropRatio(ratio);
    setIsCropMode(true);
  };

  const handleCropApply = (croppedImage: string) => {
    setUploadedImage(croppedImage);
    resetCropState(); // Reset crop mode and ratio
    resetTransform(); // Reset scale, position, transform after crop
  };

  const handleCropCancel = () => {
    resetCropState(); // Reset crop mode and ratio
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    // Ctrl+O: Open file
    {
      key: 'o',
      ctrl: true,
      handler: () => {
        if (!isLoading) {
          handleUploadClick();
        }
      },
      preventDefault: true,
    },
    // Ctrl+S: Save/Download
    {
      key: 's',
      ctrl: true,
      handler: () => {
        if (uploadedImage) {
          handleDownload();
        }
      },
      preventDefault: true,
    },
    // + or =: Zoom in
    {
      key: '+',
      handler: () => {
        if (uploadedImage) {
          handleZoomIn();
        }
      },
    },
    {
      key: '=',
      handler: () => {
        if (uploadedImage) {
          handleZoomIn();
        }
      },
    },
    // -: Zoom out
    {
      key: '-',
      handler: () => {
        if (uploadedImage) {
          handleZoomOut();
        }
      },
    },
    // 0: Fit to screen
    {
      key: '0',
      handler: () => {
        if (uploadedImage) {
          handleFitScreen();
        }
      },
    },
    // Escape: Close edit panel or crop modal
    {
      key: 'Escape',
      handler: () => {
        if (isCropMode) {
          handleCropCancel();
        } else if (isEditPanelOpen) {
          setIsEditPanelOpen(false);
        }
      },
    },
    // Delete/Backspace: Close image
    {
      key: 'Delete',
      handler: () => {
        if (uploadedImage && !isCropMode) {
          handleCloseImage();
        }
      },
    },
    {
      key: 'Backspace',
      handler: () => {
        if (uploadedImage && !isCropMode) {
          handleCloseImage();
        }
      },
    },
    // F: Toggle fullscreen
    {
      key: 'f',
      handler: () => {
        if (uploadedImage) {
          toggleFullscreen();
        }
      },
    },
    // E: Toggle edit panel
    {
      key: 'e',
      handler: () => {
        if (uploadedImage && !isCropMode) {
          setIsEditPanelOpen((prev) => !prev);
        }
      },
    },
    // C: Toggle canvas controls
    {
      key: 'c',
      handler: () => {
        if (uploadedImage) {
          setCanvasControlsVisible((prev) => !prev);
        }
      },
    },
    // ?: Show keyboard shortcuts
    {
      key: '?',
      handler: () => {
        setShowKeyboardHelp(true);
      },
    },
  ]);

  // Listen for AI edit generation events from AIEditControl
  useEffect(() => {
    const handleAIEditGenerate = (event: CustomEvent) => {
      const { prompt, imageUrl } = event.detail;
      if (imageUrl) {
        // Save original image before AI editing
        setOriginalImage(imageUrl);

        editWithAI({
          prompt: prompt || 'enhance the image quality and lighting',
          image_url: imageUrl,
          num_images: 1,
          output_format: 'jpeg',
        });
      }
    };

    window.addEventListener(
      'ai-edit-generate',
      handleAIEditGenerate as EventListener
    );
    return () => {
      window.removeEventListener(
        'ai-edit-generate',
        handleAIEditGenerate as EventListener
      );
    };
  }, [editWithAI]);

  // Smooth zoom transition when view mode changes
  useEffect(() => {
    // Reset zoom to fit screen when switching view modes
    // This ensures smooth transition instead of jarring jump
    if (uploadedImage) {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  }, [viewMode, uploadedImage, setScale, setPosition]);

  const allBarsOpen = leftOpen && rightOpen && topOpen && bottomOpen;

  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;
  const topPos = topOpen ? 64 : 0;
  const bottomPos = bottomOpen ? 40 : 0;

  // Dynamic padding to prevent image overlap with controls
  const imagePadding = {
    top: canvasControlsVisible ? (topOpen ? 128 : 80) : 16,
    left: canvasControlsVisible ? (leftOpen ? 16 : 232) : 16,
    right: canvasControlsVisible ? (rightOpen ? 16 : 232) : 16,
    bottom: canvasControlsVisible ? (bottomOpen ? 96 : 80) : 16,
  };

  const backgroundStyles = {
    none: {},
    black: { backgroundColor: '#000000' },
    gray: { backgroundColor: '#808080' },
    white: { backgroundColor: '#ffffff' },
    alpha: {
      backgroundImage:
        'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
      backgroundSize: '16px 16px',
      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
      backgroundColor: '#ffffff',
    },
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className="fixed z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{
          left: `${leftPos}px`,
          right: `${rightPos}px`,
          top: `${topPos}px`,
          bottom: `${bottomPos}px`,
          ...backgroundStyles[background],
        }}
      >
        {!uploadedImage && !isLoading && (
          <EmptyState onUploadClick={handleUploadClick} />
        )}

        {isLoading && <LoadingState />}

        {uploadedImage && (
          <>
            {/* Image Viewer - Normal or Side by Side */}
            {viewMode === 'normal' ? (
              <div
                className="h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                style={{
                  paddingTop: `${imagePadding.top}px`,
                  paddingLeft: `${imagePadding.left}px`,
                  paddingRight: `${imagePadding.right}px`,
                  paddingBottom: `${imagePadding.bottom}px`,
                }}
              >
                <ImageViewer
                  key={uploadedImage}
                  src={uploadedImage}
                  alt="Uploaded"
                  scale={scale}
                  position={position}
                  onScaleChange={setScale}
                  onPositionChange={setPosition}
                  transform={transform}
                  adjustFilters={adjustFilters}
                  colorFilters={colorFilters}
                  filterEffects={filterEffects}
                  isAIProcessing={isAIEditing || isAIImageLoading}
                  aiProgress={aiProgress}
                  onImageLoad={handleAIImageLoad}
                  onImageError={handleAIImageError}
                  controlsVisible={canvasControlsVisible}
                />
              </div>
            ) : (
              /* Side by Side View */
              <div
                className="flex h-full w-full items-center justify-center gap-4 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                style={{
                  paddingTop: `${imagePadding.top}px`,
                  paddingLeft: `${imagePadding.left}px`,
                  paddingRight: `${imagePadding.right}px`,
                  paddingBottom: `${imagePadding.bottom}px`,
                }}
              >
                {/* Original Image */}
                {originalImage && (
                  <div
                    className="relative flex h-full w-1/2 flex-col items-center justify-center transition-all duration-200"
                    style={{
                      zIndex: activeImage === 'left' ? 10 : 5,
                      opacity: activeImage === 'left' ? 1 : 0.85,
                    }}
                  >
                    <div
                      className="relative h-full w-full cursor-pointer transition-all duration-200"
                      onClick={() => setActiveImage('left')}
                      title="Click to bring to front"
                      style={{
                        filter:
                          activeImage === 'left'
                            ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                            : 'none',
                      }}
                    >
                      <ImageViewer
                        key={originalImage}
                        src={originalImage}
                        alt="Original"
                        scale={leftImageScale}
                        position={leftImagePosition}
                        onScaleChange={setLeftImageScale}
                        onPositionChange={setLeftImagePosition}
                        transform={{
                          rotation: 0,
                          flipHorizontal: false,
                          flipVertical: false,
                        }}
                        adjustFilters={{
                          brightness: 0,
                          contrast: 0,
                          exposure: 0,
                          highlights: 0,
                          shadows: 0,
                          whites: 0,
                          blacks: 0,
                          clarity: 0,
                          sharpness: 0,
                          dehaze: 0,
                        }}
                        colorFilters={{ temperature: 0, tint: 0 }}
                        filterEffects={{
                          blur: 0,
                          grayscale: 0,
                          sepia: 0,
                          invert: 0,
                        }}
                        isAIProcessing={false}
                        aiProgress=""
                        onImageLoad={() => {}}
                        onImageError={() => {}}
                        controlsVisible={canvasControlsVisible}
                      />
                    </div>
                  </div>
                )}

                {/* AI Generated Image */}
                <div
                  className="relative flex h-full w-1/2 flex-col items-center justify-center transition-all duration-200"
                  style={{
                    zIndex: activeImage === 'right' ? 10 : 5,
                    opacity: activeImage === 'right' ? 1 : 0.85,
                  }}
                >
                  <div
                    className="relative h-full w-full cursor-pointer transition-all duration-200"
                    onClick={() => setActiveImage('right')}
                    title="Click to bring to front"
                    style={{
                      filter:
                        activeImage === 'right'
                          ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                          : 'none',
                    }}
                  >
                    <ImageViewer
                      key={uploadedImage}
                      src={uploadedImage}
                      alt="AI Generated"
                      scale={rightImageScale}
                      position={rightImagePosition}
                      onScaleChange={setRightImageScale}
                      onPositionChange={setRightImagePosition}
                      transform={transform}
                      adjustFilters={adjustFilters}
                      colorFilters={colorFilters}
                      filterEffects={filterEffects}
                      isAIProcessing={isAIEditing || isAIImageLoading}
                      aiProgress={aiProgress}
                      onImageLoad={handleAIImageLoad}
                      onImageError={handleAIImageError}
                      controlsVisible={canvasControlsVisible}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Top Left Controls - File Info */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                top: topOpen ? '80px' : '16px',
                left: leftOpen ? '276px' : '16px',
                opacity: canvasControlsVisible ? 1 : 0,
                transform: canvasControlsVisible
                  ? 'translateX(0)'
                  : 'translateX(-30px)',
                pointerEvents: canvasControlsVisible ? 'auto' : 'none',
              }}
            >
              <TopLeftControls
                fileName={fileName}
                fileSizeInBytes={fileSize}
                onClose={handleCloseImage}
                visible={!!uploadedImage}
              />
            </div>

            {/* Top Center Controls - View Mode Selector */}
            {originalImage && (
              <div
                className="fixed z-20 flex justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                style={{
                  top: topOpen ? '80px' : '16px',
                  left: leftOpen ? '130px' : '0px',
                  right: rightOpen ? '130px' : '0px',
                  opacity: canvasControlsVisible ? 1 : 0,
                  transform: canvasControlsVisible
                    ? 'translateY(0)'
                    : 'translateY(-20px)',
                  pointerEvents: canvasControlsVisible ? 'auto' : 'none',
                }}
              >
                <ViewModeSelector
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  disabled={isAIEditing || isAIImageLoading}
                />
              </div>
            )}

            {/* Top Right Controls */}
            <div
              className="fixed z-20 flex items-center gap-2 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                top: topOpen ? '80px' : '16px',
                right: rightOpen ? '276px' : '16px',
                opacity: canvasControlsVisible ? 1 : 0,
                transform: canvasControlsVisible
                  ? 'translateX(0)'
                  : 'translateX(30px)',
                pointerEvents: canvasControlsVisible ? 'auto' : 'none',
              }}
            >
              <ZoomControls
                scale={
                  viewMode === 'side-by-side'
                    ? activeImage === 'left'
                      ? leftImageScale
                      : rightImageScale
                    : scale
                }
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitScreen={handleFitScreen}
              />
              <ActionControls
                allBarsOpen={allBarsOpen}
                onToggleAllBars={toggleAll}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </div>

            {/* Bottom Left Controls - Background Selector & UI Toggle */}
            <div
              className="fixed z-30 flex items-center gap-2 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                bottom: bottomOpen ? '56px' : '16px',
                left: leftOpen ? '276px' : '16px',
              }}
            >
              <div
                className="transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                style={{
                  opacity: canvasControlsVisible ? 1 : 0,
                  transform: canvasControlsVisible
                    ? 'translateX(0) scale(1)'
                    : 'translateX(-20px) scale(0.95)',
                  pointerEvents: canvasControlsVisible ? 'auto' : 'none',
                }}
              >
                <div className="rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-2 backdrop-blur-[16px]">
                  <BackgroundSelector
                    background={background}
                    onBackgroundChange={setBackground}
                  />
                </div>
              </div>
              {/* UIToggleButton wrapper with explicit z-index and pointer events */}
              <div className="relative z-10">
                <UIToggleButton
                  controlsVisible={canvasControlsVisible}
                  onToggle={() =>
                    setCanvasControlsVisible(!canvasControlsVisible)
                  }
                />
              </div>
            </div>

            {/* Bottom Center - AI Edit Control */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                bottom: bottomOpen ? '56px' : '16px',
                left: leftOpen ? '130px' : '0px',
                right: rightOpen ? '130px' : '0px',
                display: 'flex',
                justifyContent: 'center',
                transform: canvasControlsVisible
                  ? 'translateY(0)'
                  : 'translateY(30px)',
                opacity: canvasControlsVisible ? 1 : 0,
                pointerEvents: canvasControlsVisible ? 'auto' : 'none',
              }}
            >
              <AIEditControl
                currentImageUrl={uploadedImage || ''}
                onImageEdited={(url) => setUploadedImage(url)}
                onError={(error) => showToast(error.message, 'error')}
                isEditing={isAIEditing}
                progress={aiProgress}
                visible={!!uploadedImage}
              />
            </div>

            {/* Bottom Right Controls */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                bottom: bottomOpen ? '56px' : '16px',
                right: rightOpen ? '276px' : '16px',
                opacity: canvasControlsVisible ? 1 : 0,
                transform: canvasControlsVisible
                  ? 'translateX(0) scale(1)'
                  : 'translateX(30px) scale(0.95)',
                pointerEvents: canvasControlsVisible ? 'auto' : 'none',
              }}
            >
              <BottomRightControls
                onEdit={handleToggleEditPanel}
                editActive={isEditPanelOpen}
                onDelete={handleDelete}
                onSave={handleSave}
                onDownload={handleDownload}
              />
            </div>

            {/* Edit Panel - Only render when explicitly opened by user */}
            {uploadedImage && !isLoading && isEditPanelOpen && (
              <EditPanel
                isOpen={isEditPanelOpen}
                onClose={() => setIsEditPanelOpen(false)}
                initialPosition={{
                  x: leftOpen ? 276 : 16,
                  y: topOpen ? 80 + 48 + 12 : 16 + 48 + 12, // top position + file bar height + gap
                }}
                leftOpen={leftOpen}
                topOpen={topOpen}
                onCropRatioChange={handleCropRatioChange}
                onTransformChange={(transformData) => {
                  setTransform({
                    rotation: transformData.rotation,
                    flipHorizontal: transformData.flipHorizontal,
                    flipVertical: transformData.flipVertical,
                  });
                }}
                onAdjustChange={(adjustData) => {
                  setAdjustFilters({
                    brightness: adjustData.brightness,
                    contrast: adjustData.contrast,
                    exposure: adjustData.exposure,
                    highlights: adjustData.highlights,
                    shadows: adjustData.shadows,
                    whites: adjustData.whites,
                    blacks: adjustData.blacks,
                    clarity: adjustData.clarity,
                    sharpness: adjustData.sharpness,
                    dehaze: adjustData.dehaze,
                  });
                }}
                onColorChange={(colorData) => {
                  setColorFilters({
                    temperature: colorData.temperature || 0,
                    tint: colorData.tint || 0,
                    saturation: colorData.saturation || 0,
                    vibrance: colorData.vibrance || 0,
                  });
                }}
                onFilterChange={(filterData) => {
                  setFilterEffects({
                    vignetteAmount: filterData.vignetteAmount || 0,
                    vignetteSize: filterData.vignetteSize || 50,
                    vignetteFeather: filterData.vignetteFeather || 50,
                    grainAmount: filterData.grainAmount || 0,
                    grainSize: filterData.grainSize || 50,
                    fadeAmount: filterData.fadeAmount || 0,
                  });
                }}
              />
            )}
          </>
        )}

        {/* Crop Modal */}
        {uploadedImage && isCropMode && (
          <CropModal
            isOpen={isCropMode}
            imageSrc={uploadedImage}
            aspectRatio={cropRatio}
            onApply={handleCropApply}
            onCancel={handleCropCancel}
          />
        )}

        {/* Toast Notifications */}
        {toastState.visible && (
          <Toast
            message={toastState.message}
            type={toastState.type}
            onClose={hideToast}
          />
        )}
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </>
  );
}

export default Canvas;
