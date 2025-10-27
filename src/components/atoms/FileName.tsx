import React from 'react';

interface FileNameProps {
  /**
   * Name of the file
   */
  name: string;
}

export function FileName({ name }: FileNameProps) {
  return (
    <div className="max-w-[200px] truncate text-sm font-medium text-white">
      {name}
    </div>
  );
}

export default FileName;
