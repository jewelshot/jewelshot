import React from 'react';

interface FileSizeProps {
  /**
   * Size of the file in bytes
   */
  sizeInBytes: number;
}

/**
 * Formats bytes to human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
}

export function FileSize({ sizeInBytes }: FileSizeProps) {
  return (
    <div className="text-sm text-white/60">{formatBytes(sizeInBytes)}</div>
  );
}

export default FileSize;
