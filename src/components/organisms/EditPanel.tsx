'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import TabList from '@/components/molecules/TabList';
import CropPanel from '@/components/molecules/CropPanel';
import TransformPanel from '@/components/molecules/TransformPanel';
import AdjustPanel from '@/components/molecules/AdjustPanel';

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
   * Initial position
   */
  initialPosition?: { x: number; y: number };
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
  onCropRatioChange,
  onTransformChange,
  onAdjustChange,
}: EditPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [activeTab, setActiveTab] = useState('crop');
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.stopPropagation();
    e.preventDefault();
  };

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 w-96 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[16px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={handleMouseDown}
        className={`flex select-none items-center justify-between rounded-t-lg border-b border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] px-4 py-3 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="pointer-events-none flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-white/50" />
          <h3 className="text-sm font-medium text-white">Edit Tools</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Panel Content */}
      <div className="space-y-4 p-4">
        {/* Tabs */}
        <TabList tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {activeTab === 'crop' && (
            <CropPanel onCropRatioChange={onCropRatioChange || (() => {})} />
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
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-white/20 text-xs text-white/50">
              Color tools coming soon
            </div>
          )}

          {activeTab === 'filters' && (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-white/20 text-xs text-white/50">
              Filter tools coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPanel;
