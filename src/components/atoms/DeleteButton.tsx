import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/20 hover:text-red-300"
      title="Delete Image"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export default DeleteButton;
