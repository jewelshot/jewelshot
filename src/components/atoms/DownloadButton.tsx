'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function DownloadButton({ onClick }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
      title="Download Image"
    >
      <Download className="h-3.5 w-3.5" />
    </button>
  );
}

export default DownloadButton;
