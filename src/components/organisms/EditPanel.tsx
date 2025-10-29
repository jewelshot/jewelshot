'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  GripVertical,
  Minus,
  RectangleHorizontal,
  Maximize2,
  Undo2,
  Redo2,
  RotateCcw,
} from 'lucide-react';
import TabList from '@/components/molecules/TabList';
import CropPanel from '@/components/molecules/CropPanel';
import TransformPanel from '@/components/molecules/TransformPanel';
import AdjustPanel from '@/components/molecules/AdjustPanel';
import ColorsPanel, { ColorFilters } from '@/components/molecules/ColorsPanel';
import FiltersPanel, {
  FilterEffects,
} from '@/components/molecules/FiltersPanel';

interface EditPanelProps {
  /**
   * Whether the panel is visible
   */
  isOpen: boolean;
  /**
   * Close handler
   */
  onClose: () => void;
  /**
   * Initial position (used only on first mount)
   */
  initialPosition?: { x: number; y: number };
  /**
   * Left sidebar open state (for auto-positioning)
   */
  leftOpen?: boolean;
  /**
   * Top bar open state (for auto-positioning)
   */
  topOpen?: boolean;
  /**
   * Active tab change handler (for lazy loading optimization)
   */
  onActiveTabChange?: (tabId: string) => void;
  /**
   * Crop ratio change handler
   */
  onCropRatioChange?: (ratio: number | null) => void;
  /**
   * Transform change handler
   */
  onTransformChange?: (transform: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  }) => void;
  /**
   * Adjust change handler
   */
  onAdjustChange?: (adjust: {
    brightness: number;
    contrast: number;
    exposure: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;
    clarity: number;
    sharpness: number;
    dehaze: number;
  }) => void;
  /**
   * Color change handler
   */
  onColorChange?: (colors: ColorFilters) => void;
  /**
   * Filter change handler
   */
  onFilterChange?: (filters: FilterEffects) => void;
  /**
   * Reset all edits handler
   */
  onResetAll?: () => void;
  /**
   * Current edit state (for undo/redo)
   */
  currentTransform?: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
  currentAdjust?: {
    brightness: number;
    contrast: number;
    exposure: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;
    clarity: number;
    sharpness: number;
    dehaze: number;
  };
  currentColors?: ColorFilters;
  currentFilters?: FilterEffects;
}

const tabs = [
  { id: 'crop', label: 'Crop' },
  { id: 'transform', label: 'Transform' },
  { id: 'adjust', label: 'Adjust' },
  { id: 'colors', label: 'Colors' },
  { id: 'filters', label: 'Filters' },
];

/**
 * EditPanel - Draggable edit tools panel
 */
export function EditPanel({
  isOpen,
  onClose,
  initialPosition = { x: 100, y: 100 },
  leftOpen = false,
  topOpen = false,
  onActiveTabChange,
  onCropRatioChange,
  onTransformChange,
  onAdjustChange,
  onColorChange,
  onFilterChange,
  onResetAll,
}: EditPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [activeTab, setActiveTab] = useState('crop');
  const [userDragged, setUserDragged] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBarMode, setIsBarMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Notify parent when active tab changes (for lazy loading optimization)
  useEffect(() => {
    onActiveTabChange?.(activeTab);
  }, [activeTab, onActiveTabChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setUserDragged(true); // Mark that user has manually positioned the panel
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.stopPropagation();
    e.preventDefault();
  };

  // Reset position to file name bar alignment when panel opens
  useEffect(() => {
    if (isOpen) {
      const x = leftOpen ? 276 : 16;
      const y = topOpen ? 80 + 48 + 12 : 16 + 48 + 12;

      setPosition({ x, y });

      setUserDragged(false); // Reset drag state on open
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only reset on open, not on sidebar toggle

  // Update position when sidebars toggle (only if user hasn't dragged)
  useEffect(() => {
    if (isOpen && !userDragged) {
      const x = leftOpen ? 276 : 16;
      const y = topOpen ? 80 + 48 + 12 : 16 + 48 + 12;

      setPosition({ x, y });
    }
  }, [leftOpen, topOpen, isOpen, userDragged]);

  // Handle closing animation
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setIsAnimating(true);

      // Opening animation duration
      const openTimer = setTimeout(() => {
        setIsAnimating(false);
        setHasAnimated(true); // Mark that opening animation has finished
      }, 500);

      return () => clearTimeout(openTimer);
    } else if (!isOpen && shouldRender) {
      // Start closing animation
      setIsClosing(true);
      setIsAnimating(true);
      setHasAnimated(false); // Reset so next opening animation works

      // Wait for animation to complete before unmounting
      const closeTimer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        setIsAnimating(false);
        setUserDragged(false);
      }, 400); // Match animation duration

      return () => clearTimeout(closeTimer);
    }
  }, [isOpen, shouldRender]);

  // Global mouse move and up handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Don't render if not needed (wait for animation to complete)
  if (!shouldRender) return null;

  // Only apply animation class when actually animating
  // After opening animation completes, remove class so closing animation can work fresh
  const animationClass = isClosing
    ? 'animate-slide-out'
    : hasAnimated
      ? '' // No class after opening animation completes
      : 'animate-slide-in'; // Only during opening

  return (
    <>
      <div
        className={`fixed z-50 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[16px] ${
          isMinimized ? 'w-auto' : isBarMode ? 'w-auto' : 'w-96'
        } ${animationClass}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition:
            isDragging || isAnimating
              ? 'none'
              : 'left 800ms cubic-bezier(0.4, 0.0, 0.2, 1), top 800ms cubic-bezier(0.4, 0.0, 0.2, 1), width 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Draggable Header */}
        <div
          onMouseDown={handleMouseDown}
          className={`flex select-none items-center justify-between ${
            isMinimized ? 'rounded-lg' : 'rounded-t-lg'
          } ${
            !isMinimized ? 'border-b border-[rgba(139,92,246,0.2)]' : ''
          } bg-[rgba(139,92,246,0.05)] px-4 py-3 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div className="pointer-events-none flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-white/50" />
            <h3 className="text-sm font-medium text-white">Edit Tools</h3>
          </div>

          {/* History Controls (Undo/Redo/Reset) */}
          <div className="pointer-events-auto flex items-center gap-1">
            {/* Reset All Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  onResetAll &&
                  window.confirm('Reset all edits? This cannot be undone.')
                ) {
                  onResetAll();
                }
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Reset All"
              title="Reset All Edits"
              disabled={!onResetAll}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Undo Button - Disabled for now, will be implemented with history */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement undo
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Undo"
              title="Undo (Coming Soon)"
              disabled={true}
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>

            {/* Redo Button - Disabled for now, will be implemented with history */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement redo
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Redo"
              title="Redo (Coming Soon)"
              disabled={true}
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="pointer-events-auto flex items-center gap-1">
            {/* Bar Mode Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBarMode(!isBarMode);
                if (isMinimized) setIsMinimized(false); // Exit minimize when entering bar mode
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white"
              aria-label={isBarMode ? 'Expand Panel' : 'Bar Mode'}
              title={isBarMode ? 'Expand Panel' : 'Bar Mode'}
            >
              {isBarMode ? (
                <Maximize2 className="h-3.5 w-3.5" />
              ) : (
                <RectangleHorizontal className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Minimize Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
                if (isBarMode) setIsBarMode(false); // Exit bar mode when minimizing
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white"
              aria-label={isMinimized ? 'Restore' : 'Minimize'}
              title={isMinimized ? 'Restore' : 'Minimize'}
            >
              {isMinimized ? (
                <Maximize2 className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white"
              aria-label="Close"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Panel Content - Hidden when minimized */}
        {!isMinimized && (
          <div className="space-y-4 p-4">
            {/* Tabs */}
            <TabList
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content - Hidden in bar mode */}
            {!isBarMode && (
              <div className="max-h-[500px] overflow-y-auto">
                {activeTab === 'crop' && (
                  <CropPanel
                    onCropRatioChange={onCropRatioChange || (() => {})}
                  />
                )}

                {activeTab === 'transform' && (
                  <TransformPanel onTransformChange={onTransformChange} />
                )}

                {activeTab === 'adjust' && (
                  <AdjustPanel
                    onAdjustChange={(adjust) => {
                      if (onAdjustChange) {
                        onAdjustChange({
                          brightness: adjust.brightness,
                          contrast: adjust.contrast,
                          exposure: adjust.exposure,
                          highlights: adjust.highlights,
                          shadows: adjust.shadows,
                          whites: adjust.whites,
                          blacks: adjust.blacks,
                          clarity: adjust.clarity,
                          sharpness: adjust.sharpness,
                          dehaze: adjust.dehaze,
                        });
                      }
                    }}
                  />
                )}

                {activeTab === 'colors' && (
                  <ColorsPanel onColorChange={onColorChange} />
                )}

                {activeTab === 'filters' && (
                  <FiltersPanel onFilterChange={onFilterChange} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Memoize to prevent re-renders during parent Canvas updates
export default React.memo(EditPanel);
