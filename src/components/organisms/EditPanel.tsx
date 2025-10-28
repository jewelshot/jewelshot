'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';

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
}

/**
 * EditPanel - Draggable edit tools panel
 */
export function EditPanel({
  isOpen,
  onClose,
  initialPosition = { x: 100, y: 100 },
}: EditPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);

  // Drag functionality
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      setPosition((currentPos) => {
        startPosRef.current = {
          x: e.clientX - currentPos.x,
          y: e.clientY - currentPos.y,
        };
        return currentPos;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - startPosRef.current.x,
        y: e.clientY - startPosRef.current.y,
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 w-80 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[16px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Draggable Header */}
      <div
        ref={headerRef}
        className={`flex select-none items-center justify-between rounded-t-lg border-b border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] px-4 py-3 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="pointer-events-none flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-white/50" />
          <h3 className="text-sm font-medium text-white">Edit Tools</h3>
        </div>
        <button
          onClick={onClose}
          onMouseDown={(e) => e.stopPropagation()}
          className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Panel Content */}
      <div className="p-4">
        <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-white/20 text-sm text-white/50">
          Edit tools will be added here
        </div>
      </div>
    </div>
  );
}

export default EditPanel;
