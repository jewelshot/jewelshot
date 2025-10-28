import { useState, useCallback } from 'react';
import {
  generateImage,
  type NanoBananaInput,
  type NanoBananaOutput,
} from '@/lib/ai/fal-client';

interface UseTextToImageOptions {
  onSuccess?: (result: NanoBananaOutput) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for text-to-image generation using Nano Banana
 *
 * @example
 * ```tsx
 * const { generate, isGenerating, progress, error } = useTextToImage({
 *   onSuccess: (result) => {
 *     setUploadedImage(result.images[0].url);
 *   }
 * });
 *
 * await generate({
 *   prompt: "A beautiful sunset",
 *   aspect_ratio: "16:9"
 * });
 * ```
 */
export function useTextToImage(options?: UseTextToImageOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<NanoBananaOutput | null>(null);

  const generate = useCallback(
    async (input: NanoBananaInput) => {
      setIsGenerating(true);
      setProgress('Initializing...');
      setError(null);
      setResult(null);

      try {
        const output = await generateImage(input, (update) => {
          if (update.status === 'IN_QUEUE') {
            setProgress('In queue...');
          } else if (update.status === 'IN_PROGRESS') {
            const latestLog = update.logs?.[update.logs.length - 1]?.message;
            if (latestLog) {
              setProgress(latestLog);
            } else {
              setProgress('Generating image...');
            }
          } else if (update.status === 'COMPLETED') {
            setProgress('Completed!');
          }
        });

        setResult(output);
        setProgress('Image generated successfully!');

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
