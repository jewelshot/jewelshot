/**
 * Custom hook for managing image upload state
 *
 * Manages the core state for uploaded images including:
 * - Image source/data
 * - File metadata (name, size)
 * - Loading state
 *
 * @example
 * ```tsx
 * const {
 *   uploadedImage,
 *   setUploadedImage,
 *   fileName,
 *   fileSize,
 *   isLoading,
 *   setIsLoading,
 *   resetImageState
 * } = useImageState();
 * ```
 */

import { useState, useCallback } from 'react';

interface ImageState {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
  fileSize: number;
  setFileSize: (size: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  /**
   * Reset all image state to initial values
   */
  resetImageState: () => void;
}

export function useImageState(): ImageState {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Reset all state to initial values
   * Useful when closing/deleting an image
   */
  const resetImageState = useCallback(() => {
    setUploadedImage(null);
    setFileName('');
    setFileSize(0);
    setIsLoading(false);
  }, []);

  return {
    uploadedImage,
    setUploadedImage,
    fileName,
    setFileName,
    fileSize,
    setFileSize,
    isLoading,
    setIsLoading,
    resetImageState,
  };
}
