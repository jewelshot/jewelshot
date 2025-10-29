/**
 * ============================================================================
 * USE IMAGE EDIT HOOK - CLEAN IMPLEMENTATION
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import { editImage, type EditInput, type FalOutput } from '@/lib/ai/fal-client';
import { aiRateLimiter } from '@/lib/rate-limiter';

interface UseImageEditOptions {
  onSuccess?: (result: FalOutput) => void;
  onError?: (error: Error) => void;
}

export function useImageEdit(options?: UseImageEditOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<FalOutput | null>(null);

  const edit = useCallback(
    async (input: EditInput) => {
      // Rate limit check
      if (!aiRateLimiter.canMakeRequest()) {
        const waitTime = Math.ceil(aiRateLimiter.getTimeUntilReset() / 1000);
        const error = new Error(
          `Rate limit exceeded. Please wait ${waitTime}s.`
        );
        setError(error);
        options?.onError?.(error);
        throw error;
      }

      setIsEditing(true);
      setProgress('Initializing...');
      setError(null);
      setResult(null);

      try {
        aiRateLimiter.recordRequest();

        const output = await editImage(input, (status, message) => {
          setProgress(message || status);
        });

        setResult(output);
        setProgress('Edit complete!');
        options?.onSuccess?.(output);

        return output;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setProgress('');
        options?.onError?.(error);
        throw error;
      } finally {
        setIsEditing(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsEditing(false);
    setProgress('');
    setError(null);
    setResult(null);
  }, []);

  return {
    edit,
    reset,
    isEditing,
    progress,
    error,
    result,
  };
}
