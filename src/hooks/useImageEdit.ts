import { useState, useCallback } from 'react';
import {
  editImage,
  type NanoBananaEditInput,
  type NanoBananaOutput,
} from '@/lib/ai/fal-client';
import { aiRateLimiter } from '@/lib/rate-limiter';

interface UseImageEditOptions {
  onSuccess?: (result: NanoBananaOutput) => void;
  onError?: (error: Error) => void;
}

export function useImageEdit(options?: UseImageEditOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<NanoBananaOutput | null>(null);

  const edit = useCallback(
    async (input: NanoBananaEditInput) => {
      // Check rate limit
      if (!aiRateLimiter.canMakeRequest()) {
        const waitTime = Math.ceil(aiRateLimiter.getTimeUntilReset() / 1000);
        const error = new Error(
          `Rate limit exceeded. Please wait ${waitTime} seconds before trying again.`
        );
        setError(error);
        if (options?.onError) {
          options.onError(error);
        }
        throw error;
      }

      setIsEditing(true);
      setProgress('Initializing...');
      setError(null);
      setResult(null);

      try {
        // Record the request
        aiRateLimiter.recordRequest();
        const output = await editImage(input, (update) => {
          if (update.status === 'IN_QUEUE') {
            setProgress('In queue...');
          } else if (update.status === 'IN_PROGRESS') {
            const latestLog = update.logs?.[update.logs.length - 1]?.message;
            if (latestLog) {
              setProgress(latestLog);
            } else {
              setProgress('Editing image...');
            }
          } else if (update.status === 'COMPLETED') {
            setProgress('Completed!');
          }
        });

        setResult(output);
        setProgress('Image edited successfully!');

        if (options?.onSuccess) {
          options.onSuccess(output);
        }

        return output;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setProgress('');

        if (options?.onError) {
          options.onError(error);
        }

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
