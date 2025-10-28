'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageState } from '@/hooks/useImageState';
import { useImageTransform } from '@/hooks/useImageTransform';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useCanvasUI } from '@/hooks/useCanvasUI';
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

export function Canvas() {
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setFileName(file.name);
      setFileSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        resetTransform(); // Reset scale, position, transform
        setIsEditPanelOpen(false); // Close EditPanel when new image is loaded
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseImage = () => {
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
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleFitScreen = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };

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

  const handleSave = () => {
    // TODO: Implement save to database/storage
    console.log('Save image');
  };

  const handleDownload = () => {
    if (uploadedImage) {
      const link = document.createElement('a');
      link.href = uploadedImage;
      link.download = fileName || 'image.jpg';
      link.click();
    }
  };

  const handleToggleEditPanel = () => {
    setIsEditPanelOpen((prev) => !prev);
  };

  // Auto-collapse/restore bars when edit panel opens/closes
  useEffect(() => {
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
  }, [isEditPanelOpen]);

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
  }, []);

  const allBarsOpen = leftOpen && rightOpen && topOpen && bottomOpen;

  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;
  const topPos = topOpen ? 64 : 0;
  const bottomPos = bottomOpen ? 40 : 0;

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
            <ImageViewer
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
            />

            {/* Top Left Controls - File Info */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                top: topOpen ? '80px' : '16px',
                left: leftOpen ? '276px' : '16px',
              }}
            >
              <TopLeftControls
                fileName={fileName}
                fileSizeInBytes={fileSize}
                onClose={handleCloseImage}
                visible={!!uploadedImage}
              />
            </div>

            {/* Top Right Controls */}
            <div
              className="fixed z-20 flex items-center gap-2 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                top: topOpen ? '80px' : '16px',
                right: rightOpen ? '276px' : '16px',
              }}
            >
              <ZoomControls
                scale={scale}
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

            {/* Bottom Left Controls - Background Selector */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                bottom: bottomOpen ? '56px' : '16px',
                left: leftOpen ? '276px' : '16px',
              }}
            >
              <div className="rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-2 backdrop-blur-[16px]">
                <BackgroundSelector
                  background={background}
                  onBackgroundChange={setBackground}
                />
              </div>
            </div>

            {/* Bottom Right Controls */}
            <div
              className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                bottom: bottomOpen ? '56px' : '16px',
                right: rightOpen ? '276px' : '16px',
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

            {/* Edit Panel */}
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
      </div>
    </>
  );
}

export default Canvas;
