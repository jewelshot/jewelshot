/**
 * Input Validation Utilities
 *
 * Comprehensive validation for file uploads, forms, and user inputs.
 * Provides detailed error messages for better UX.
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('Validators');

// ============================================================================
// FILE UPLOAD VALIDATION
// ============================================================================

export interface FileValidationOptions {
  maxSizeMB?: number;
  minSizeMB?: number;
  allowedTypes?: string[];
  maxDimensions?: { width: number; height: number };
  minDimensions?: { width: number; height: number };
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
  dimensions?: { width: number; height: number };
}

const DEFAULT_FILE_OPTIONS: FileValidationOptions = {
  maxSizeMB: 10,
  minSizeMB: 0.001, // 1KB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxDimensions: { width: 8000, height: 8000 },
  minDimensions: { width: 100, height: 100 },
};

/**
 * Validate file upload with comprehensive checks
 */
export async function validateFile(
  file: File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> {
  const opts = { ...DEFAULT_FILE_OPTIONS, ...options };

  // 1. File existence
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
    };
  }

  // 2. File type validation
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    const allowed = opts.allowedTypes
      .map((t) => t.split('/')[1].toUpperCase())
      .join(', ');
    return {
      valid: false,
      error: `Invalid file type. Please upload ${allowed} files only.`,
    };
  }

  // 3. File size validation
  const fileSizeMB = file.size / (1024 * 1024);

  if (opts.maxSizeMB && fileSizeMB > opts.maxSizeMB) {
    return {
      valid: false,
      error: `File is too large (${fileSizeMB.toFixed(2)}MB). Maximum size is ${opts.maxSizeMB}MB.`,
    };
  }

  if (opts.minSizeMB && fileSizeMB < opts.minSizeMB) {
    return {
      valid: false,
      error: `File is too small (${fileSizeMB.toFixed(2)}MB). Minimum size is ${opts.minSizeMB}MB.`,
    };
  }

  // 4. Image dimensions validation
  try {
    const dimensions = await getImageDimensions(file);

    if (opts.maxDimensions) {
      if (
        dimensions.width > opts.maxDimensions.width ||
        dimensions.height > opts.maxDimensions.height
      ) {
        return {
          valid: false,
          error: `Image is too large (${dimensions.width}×${dimensions.height}px). Maximum is ${opts.maxDimensions.width}×${opts.maxDimensions.height}px.`,
        };
      }
    }

    if (opts.minDimensions) {
      if (
        dimensions.width < opts.minDimensions.width ||
        dimensions.height < opts.minDimensions.height
      ) {
        return {
          valid: false,
          error: `Image is too small (${dimensions.width}×${dimensions.height}px). Minimum is ${opts.minDimensions.width}×${opts.minDimensions.height}px.`,
        };
      }
    }

    logger.debug(
      `File validated: ${file.name} (${fileSizeMB.toFixed(2)}MB, ${dimensions.width}×${dimensions.height}px)`
    );

    return {
      valid: true,
      file,
      dimensions,
    };
  } catch (error) {
    logger.error('Failed to validate image dimensions:', error);
    return {
      valid: false,
      error: 'Failed to read image. The file may be corrupted.',
    };
  }
}

/**
 * Get image dimensions from file
 */
function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

export interface PromptValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate AI prompt input
 */
export function validatePrompt(prompt: string): PromptValidationResult {
  // 1. Empty check
  if (!prompt || prompt.trim().length === 0) {
    return {
      valid: false,
      error: 'Prompt cannot be empty',
    };
  }

  // 2. Length check
  const trimmed = prompt.trim();
  if (trimmed.length < 3) {
    return {
      valid: false,
      error: 'Prompt is too short (minimum 3 characters)',
    };
  }

  if (trimmed.length > 500) {
    return {
      valid: false,
      error: 'Prompt is too long (maximum 500 characters)',
    };
  }

  // 3. Content validation (basic profanity/spam check)
  const suspicious = /(.)\1{10,}|https?:\/\//gi; // Repeated chars or URLs
  if (suspicious.test(trimmed)) {
    return {
      valid: false,
      error: 'Prompt contains suspicious content',
    };
  }

  // 4. Sanitize (remove excessive whitespace)
  const sanitized = trimmed.replace(/\s+/g, ' ');

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Validate numeric input (brightness, contrast, etc.)
 */
export function validateNumericInput(
  value: number,
  min: number,
  max: number,
  name = 'Value'
): { valid: boolean; error?: string } {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      valid: false,
      error: `${name} must be a number`,
    };
  }

  if (value < min || value > max) {
    return {
      valid: false,
      error: `${name} must be between ${min} and ${max}`,
    };
  }

  return { valid: true };
}

/**
 * Validate aspect ratio string
 */
export function validateAspectRatio(ratio: string): {
  valid: boolean;
  error?: string;
} {
  const validRatios = [
    '21:9',
    '16:9',
    '4:3',
    '3:2',
    '1:1',
    '2:3',
    '3:4',
    '4:5',
    '5:4',
    '9:16',
  ];

  if (!validRatios.includes(ratio)) {
    return {
      valid: false,
      error: `Invalid aspect ratio. Must be one of: ${validRatios.join(', ')}`,
    };
  }

  return { valid: true };
}

// ============================================================================
// URL VALIDATION
// ============================================================================

/**
 * Validate URL (for image sources)
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim().length === 0) {
    return {
      valid: false,
      error: 'URL cannot be empty',
    };
  }

  // Data URLs are valid
  if (url.startsWith('data:image/')) {
    return { valid: true };
  }

  // HTTP/HTTPS URLs
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        error: 'URL must use HTTP or HTTPS protocol',
      };
    }
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: 'Invalid URL format',
    };
  }
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

/**
 * Validate multiple fields at once
 */
export function validateFields(
  fields: Array<{
    name: string;
    validator: () => { valid: boolean; error?: string };
  }>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const result = field.validator();
    if (!result.valid && result.error) {
      errors[field.name] = result.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
