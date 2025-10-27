'use client';

import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
      title="Save Image"
    >
      <Save className="h-4 w-4" />
    </button>
  );
}

export default SaveButton;
