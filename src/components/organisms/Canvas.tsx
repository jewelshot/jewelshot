'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
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
  const { leftOpen, rightOpen, topOpen, bottomOpen, toggleAll } =
    useSidebarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [background, setBackground] = useState<
    'none' | 'black' | 'gray' | 'white' | 'alpha'
  >('none');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [cropRatio, setCropRatio] = useState<number | null>(null);
  const [isCropMode, setIsCropMode] = useState(false);
  const [transform, setTransform] = useState({
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });
  const [adjustFilters, setAdjustFilters] = useState({
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
  });
  const [colorFilters, setColorFilters] = useState({
    temperature: 0,
    tint: 0,
    saturation: 0,
    vibrance: 0,
  });
  const [filterEffects, setFilterEffects] = useState({
    vignetteAmount: 0,
    vignetteSize: 50,
    vignetteFeather: 50,
    grainAmount: 0,
    grainSize: 50,
    fadeAmount: 0,
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
        setScale(1.0);
        setPosition({ x: 0, y: 0 });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseImage = () => {
    setUploadedImage(null);
    setFileName('');
    setFileSize(0);
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    setTransform({ rotation: 0, flipHorizontal: false, flipVertical: false });
    setAdjustFilters({
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
    });
    setColorFilters({
      temperature: 0,
      tint: 0,
      saturation: 0,
      vibrance: 0,
    });
    setFilterEffects({
      vignetteAmount: 0,
      vignetteSize: 50,
      vignetteFeather: 50,
      grainAmount: 0,
      grainSize: 50,
      fadeAmount: 0,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const handleCropRatioChange = (ratio: number | null) => {
    setCropRatio(ratio);
    setIsCropMode(true);
  };

  const handleCropApply = (croppedImage: string) => {
    setUploadedImage(croppedImage);
    setIsCropMode(false);
    setCropRatio(null);
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };

  const handleCropCancel = () => {
    setIsCropMode(false);
    setCropRatio(null);
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
              initialPosition={{ x: 100, y: 100 }}
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
