'use client';

import React from 'react';
import EditButton from '@/components/atoms/EditButton';
import DeleteButton from '@/components/atoms/DeleteButton';
import SaveButton from '@/components/atoms/SaveButton';
import DownloadButton from '@/components/atoms/DownloadButton';

interface BottomRightControlsProps {
  /**
   * Edit handler
   */
  onEdit: () => void;
  /**
   * Whether edit panel is open
   */
  editActive?: boolean;
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
  onEdit,
  editActive = false,
  onDelete,
  onSave,
  onDownload,
}: BottomRightControlsProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
      <EditButton onClick={onEdit} active={editActive} />
      <div className="h-5 w-px bg-[rgba(139,92,246,0.2)]" />
      <SaveButton onClick={onSave} />
      <DownloadButton onClick={onDownload} />
      <div className="h-5 w-px bg-[rgba(139,92,246,0.2)]" />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

export default BottomRightControls;
