import React from 'react';
import { Camera, Upload } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="space-y-6 text-center">
        <Camera className="mx-auto h-16 w-16 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">
          Welcome to Jewelshot Studio
        </h2>
        <p className="text-white/60">Upload an image to start editing</p>
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(99,102,241,0.1)] px-6 py-3 font-semibold text-white transition-all hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
        >
          <Upload className="h-5 w-5" />
          Upload Image
        </button>
      </div>
    </div>
  );
}

export default EmptyState;
