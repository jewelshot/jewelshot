import React from 'react';
import FileInfo from './FileInfo';
import CloseButton from '@/components/atoms/CloseButton';

interface TopLeftControlsProps {
  /**
   * Name of the file
   */
  fileName: string;
  /**
   * Size of the file in bytes
   */
  fileSizeInBytes: number;
  /**
   * Close image handler
   */
  onClose: () => void;
  /**
   * Whether the controls are visible
   */
  visible: boolean;
}

export function TopLeftControls({
  fileName,
  fileSizeInBytes,
  onClose,
  visible,
}: TopLeftControlsProps) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
      <FileInfo fileName={fileName} fileSizeInBytes={fileSizeInBytes} />
      <div className="h-5 w-px bg-[rgba(139,92,246,0.2)]" />
      <CloseButton onClick={onClose} ariaLabel="Close Image" />
    </div>
  );
}

export default TopLeftControls;
