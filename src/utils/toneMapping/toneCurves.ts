/**
 * Parametric Tone Curves
 * Professional tone mapping curves for selective adjustments
 */

/**
 * Smooth parametric curve for highlights/shadows adjustment
 * Uses a sigmoid-like function with configurable range and feather
 *
 * @param luminance - Input luminance (0-1)
 * @param range - Tonal range to affect ('highlights' or 'shadows')
 * @param center - Center point of the range (0-1)
 * @param feather - Smoothness of transition (0.1-1.0)
 * @returns Weight/mask value (0-1)
 */
export function calculateTonalMask(
  luminance: number,
  range: 'highlights' | 'shadows',
  center: number = 0.7,
  feather: number = 0.3
): number {
  if (range === 'highlights') {
    // Highlights: affect bright areas (luminance > center)
    // Smooth S-curve transition
    const distance = (luminance - center) / feather;
    return 1 / (1 + Math.exp(-distance * 5));
  } else {
    // Shadows: affect dark areas (luminance < center)
    // Inverted S-curve
    const distance = (center - luminance) / feather;
    return 1 / (1 + Math.exp(-distance * 5));
  }
}

/**
 * Photoshop-style parametric curve
 * Smooth curve with configurable midpoint and contrast
 *
 * @param x - Input value (0-1)
 * @param midpoint - Curve center (0-1), default 0.5
 * @param contrast - Curve steepness (0-2), default 1
 * @returns Mapped value (0-1)
 */
export function parametricCurve(
  x: number,
  midpoint: number = 0.5,
  contrast: number = 1
): number {
  // Clamp input
  x = Math.max(0, Math.min(1, x));

  // Adjust for midpoint
  const adjusted = x - midpoint;

  // Apply contrast with smooth curve
  const curved = adjusted * contrast;

  // Sigmoid function for smooth S-curve
  const result = 1 / (1 + Math.exp(-curved * 6));

  return result;
}

/**
 * Gaussian weight function for smooth falloff
 * Used for natural transitions in tonal ranges
 *
 * @param x - Input value (0-1)
 * @param center - Peak position (0-1)
 * @param width - Width of the bell curve (0.1-1.0)
 * @returns Weight value (0-1)
 */
export function gaussianWeight(
  x: number,
  center: number,
  width: number
): number {
  const sigma = width / 2.355; // Convert FWHM to sigma
  const distance = x - center;
  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

/**
 * Calculate adjustment multiplier based on tonal range
 * Professional approach: smooth, feathered adjustments
 *
 * @param luminance - Pixel luminance (0-1)
 * @param adjustment - Adjustment strength (-1 to +1)
 * @param range - Target tonal range
 * @param feather - Transition smoothness (0-1), default 0.3
 * @returns Adjustment multiplier (0.5-2.0 typically)
 */
export function calculateAdjustmentMultiplier(
  luminance: number,
  adjustment: number,
  range: 'highlights' | 'shadows',
  feather: number = 0.3
): number {
  // Define tonal range centers
  const highlightCenter = 0.75; // Affect top 25% of tones primarily
  const shadowCenter = 0.25; // Affect bottom 25% of tones primarily

  const center = range === 'highlights' ? highlightCenter : shadowCenter;

  // Calculate mask weight (how much this pixel is affected)
  const mask = calculateTonalMask(luminance, range, center, feather);

  // Convert adjustment (-1 to +1) to multiplier
  // Positive: brighten (1.0 to 2.0)
  // Negative: darken (1.0 to 0.5)
  const multiplier = adjustment > 0 ? 1 + adjustment : 1 + adjustment * 0.5;

  // Blend multiplier based on mask
  // Unaffected areas get multiplier of 1.0 (no change)
  return 1 + (multiplier - 1) * mask;
}

/**
 * Advanced tone mapping with color preservation
 * Adjusts luminance while maintaining chrominance
 *
 * @param originalLuminance - Original luminance (0-1)
 * @param adjustment - Adjustment strength (-1 to +1)
 * @param range - Target tonal range
 * @param feather - Transition smoothness
 * @returns New luminance value (0-1)
 */
export function applySelectiveToneAdjustment(
  originalLuminance: number,
  adjustment: number,
  range: 'highlights' | 'shadows',
  feather: number = 0.3
): number {
  const multiplier = calculateAdjustmentMultiplier(
    originalLuminance,
    adjustment,
    range,
    feather
  );

  const newLuminance = originalLuminance * multiplier;

  // Clamp to valid range with soft knee near extremes
  // Prevents hard clipping for more natural results
  if (newLuminance > 0.95) {
    // Soft compress highlights
    const excess = newLuminance - 0.95;
    return 0.95 + excess * 0.3;
  } else if (newLuminance < 0.05) {
    // Soft compress shadows
    const deficit = 0.05 - newLuminance;
    return 0.05 - deficit * 0.3;
  }

  return newLuminance;
}

/**
 * Dual-range tone adjustment (highlights AND shadows simultaneously)
 * Professional workflow support
 *
 * @param luminance - Original luminance (0-1)
 * @param highlightAdjust - Highlight adjustment (-1 to +1)
 * @param shadowAdjust - Shadow adjustment (-1 to +1)
 * @param feather - Transition smoothness
 * @returns New luminance value (0-1)
 */
export function applyDualToneAdjustment(
  luminance: number,
  highlightAdjust: number,
  shadowAdjust: number,
  feather: number = 0.3
): number {
  let adjustedLuminance = luminance;

  // Apply highlight adjustment if non-zero
  if (highlightAdjust !== 0) {
    adjustedLuminance = applySelectiveToneAdjustment(
      adjustedLuminance,
      highlightAdjust,
      'highlights',
      feather
    );
  }

  // Apply shadow adjustment if non-zero
  if (shadowAdjust !== 0) {
    adjustedLuminance = applySelectiveToneAdjustment(
      adjustedLuminance,
      shadowAdjust,
      'shadows',
      feather
    );
  }

  return Math.max(0, Math.min(1, adjustedLuminance));
}
