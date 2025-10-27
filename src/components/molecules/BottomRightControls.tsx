'use client';

import React from 'react';
import DeleteButton from '@/components/atoms/DeleteButton';
import SaveButton from '@/components/atoms/SaveButton';
import DownloadButton from '@/components/atoms/DownloadButton';

interface BottomRightControlsProps {
  /**
   * Delete handler
   */
  onDelete: () => void;
  /**
   * Save handler
   */
  onSave: () => void;
  /**
   * Download handler
   */
  onDownload: () => void;
}

export function BottomRightControls({
  onDelete,
  onSave,
  onDownload,
}: BottomRightControlsProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-2 backdrop-blur-[16px]">
      <SaveButton onClick={onSave} />
      <DownloadButton onClick={onDownload} />
      <div className="h-6 w-px bg-[rgba(139,92,246,0.2)]" />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

export default BottomRightControls;
