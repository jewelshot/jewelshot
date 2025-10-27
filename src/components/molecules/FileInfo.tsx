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
    <div className="flex flex-col gap-1">
      <FileName name={fileName} />
      <FileSize sizeInBytes={fileSizeInBytes} />
    </div>
  );
}

export default FileInfo;
