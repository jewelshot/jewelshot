import React from 'react';
import FileName from '@/components/atoms/FileName';
import FileSize from '@/components/atoms/FileSize';

interface FileInfoProps {
  /**
   * Name of the file
   */
  fileName: string;
  /**
   * Size of the file in bytes
   */
  fileSizeInBytes: number;
}

export function FileInfo({ fileName, fileSizeInBytes }: FileInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <FileName name={fileName} />
      <div className="h-4 w-px bg-[rgba(139,92,246,0.2)]" />
      <FileSize sizeInBytes={fileSizeInBytes} />
    </div>
  );
}

export default FileInfo;
