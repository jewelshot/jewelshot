/**
 * ============================================================================
 * USE TEXT TO IMAGE HOOK - CLEAN IMPLEMENTATION
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import {
  generateImage,
  type GenerateInput,
  type FalOutput,
} from '@/lib/ai/fal-client';

interface UseTextToImageOptions {
  onSuccess?: (result: FalOutput) => void;
  onError?: (error: Error) => void;
}

export function useTextToImage(options?: UseTextToImageOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<FalOutput | null>(null);

  const generate = useCallback(
    async (input: GenerateInput) => {
      setIsGenerating(true);
      setProgress('Initializing...');
      setError(null);
      setResult(null);

      try {
        const output = await generateImage(input, (status, message) => {
          setProgress(message || status);
        });

        setResult(output);
        setProgress('Generation complete!');
        options?.onSuccess?.(output);

        return output;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setProgress('');
        options?.onError?.(error);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress('');
    setError(null);
    setResult(null);
  }, []);

  return {
    generate,
    reset,
    isGenerating,
    progress,
    error,
    result,
  };
}
