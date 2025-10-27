'use client';

import React, { useRef } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { Camera, Upload } from 'lucide-react';

export function Canvas() {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCanvasClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // TODO: Handle file upload
    }
  };

  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;
  const topPos = topOpen ? 64 : 0;
  const bottomPos = bottomOpen ? 40 : 0;

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
        onClick={handleCanvasClick}
        className="fixed z-10 cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{
          left: `${leftPos}px`,
          right: `${rightPos}px`,
          top: `${topPos}px`,
          bottom: `${bottomPos}px`,
        }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="space-y-6 text-center">
            <Camera className="mx-auto h-16 w-16 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              Welcome to Jewelshot Studio
            </h2>
            <p className="text-white/60">Upload an image to start editing</p>
            <button className="inline-flex items-center gap-2 rounded-xl border border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(99,102,241,0.1)] px-6 py-3 font-semibold text-white transition-all hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
              <Upload className="h-5 w-5" />
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Canvas;
