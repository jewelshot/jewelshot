'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useImageSharpening } from '@/hooks/useImageSharpening';
import { useSelectiveTone } from '@/hooks/useSelectiveTone';
import { useClarity } from '@/hooks/useClarity';
import { useDehaze } from '@/hooks/useDehaze';
import { useVignette } from '@/hooks/useVignette';
import { useGrain } from '@/hooks/useGrain';

interface ImageViewerProps {
  src: string;
  alt: string;
  scale: number;
  position: { x: number; y: number };
  onScaleChange: React.Dispatch<React.SetStateAction<number>>;
  onPositionChange: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  transform?: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
  adjustFilters?: {
    brightness?: number;
    contrast?: number;
    exposure?: number;
    highlights?: number;
    shadows?: number;
    whites?: number;
    blacks?: number;
    clarity?: number;
    sharpness?: number;
    dehaze?: number;
  };
  colorFilters?: {
    temperature?: number;
    tint?: number;
    saturation?: number;
    vibrance?: number;
  };
  filterEffects?: {
    vignetteAmount?: number;
    vignetteSize?: number;
    vignetteFeather?: number;
    grainAmount?: number;
    grainSize?: number;
    fadeAmount?: number;
  };
}

export function ImageViewer({
  src,
  alt,
  scale,
  position,
  onScaleChange,
  onPositionChange,
  transform = { rotation: 0, flipHorizontal: false, flipVertical: false },
  adjustFilters = {},
  colorFilters = {},
  filterEffects = {},
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Processing pipeline (order matters):
  // 1. Dehaze (atmospheric correction first)
  const { processedSrc: dehazedSrc } = useDehaze({
    originalSrc: src,
    dehaze: adjustFilters.dehaze || 0,
    enabled: (adjustFilters.dehaze || 0) !== 0,
    highQuality: false, // Fast mode for real-time performance
  });

  // 2. Selective tone adjustment (highlights & shadows after dehaze)
  const { processedSrc: toneMappedSrc } = useSelectiveTone({
    originalSrc: dehazedSrc,
    highlights: adjustFilters.highlights || 0,
    shadows: adjustFilters.shadows || 0,
    enabled:
      (adjustFilters.highlights || 0) !== 0 ||
      (adjustFilters.shadows || 0) !== 0,
  });

  // 3. Clarity (local contrast enhancement after tone mapping)
  const { processedSrc: clarifiedSrc } = useClarity({
    originalSrc: toneMappedSrc,
    clarity: adjustFilters.clarity || 0,
    enabled: (adjustFilters.clarity || 0) !== 0,
    highQuality: false, // Fast mode for real-time performance
  });

  // 4. Sharpening (applied last for maximum detail)
  const { processedSrc: sharpenedSrc } = useImageSharpening({
    originalSrc: clarifiedSrc,
    sharpness: adjustFilters.sharpness || 0,
    enabled: (adjustFilters.sharpness || 0) !== 0,
  });

  // 5. Vignette (artistic effect after all adjustments)
  const { processedSrc: vignettedSrc } = useVignette({
    originalSrc: sharpenedSrc,
    amount: filterEffects.vignetteAmount || 0,
    size: filterEffects.vignetteSize || 50,
    feather: filterEffects.vignetteFeather || 50,
    enabled: (filterEffects.vignetteAmount || 0) !== 0,
  });

  // 6. Grain (film texture as final touch)
  const { processedSrc: finalProcessedSrc } = useGrain({
    originalSrc: vignettedSrc,
    amount: filterEffects.grainAmount || 0,
    size: filterEffects.grainSize || 50,
    enabled: (filterEffects.grainAmount || 0) > 0,
  });

  // Build CSS filter string from adjust values
  const buildFilterString = () => {
    const filters: string[] = [];

    // Brightness: Linear transformation
    // -100 → 0 (completely dark), 0 → 1 (normal), +100 → 2 (double brightness)
    if (
      adjustFilters.brightness !== undefined &&
      adjustFilters.brightness !== 0
    ) {
      const brightness = (adjustFilters.brightness + 100) / 100;
      filters.push(`brightness(${brightness.toFixed(3)})`);
    }

    // Contrast: Exponential curve for more natural feel
    // -100 → 0 (flat gray), 0 → 1 (normal), +100 → 2.5 (high contrast)
    if (adjustFilters.contrast !== undefined && adjustFilters.contrast !== 0) {
      let contrast: number;

      if (adjustFilters.contrast < 0) {
        // Negative: Smooth reduction (0 to 1)
        // At -100: 0 (completely flat)
        // At -50: 0.5 (half contrast)
        // At 0: 1 (normal)
        contrast = 1 + adjustFilters.contrast / 100;
      } else {
        // Positive: Exponential increase (1 to 2.5)
        // At 0: 1 (normal)
        // At 50: 1.5 (moderate boost)
        // At 100: 2.5 (strong boost)
        // Using power curve: 1 + (value^1.2 / 100) * 1.5
        const normalized = adjustFilters.contrast / 100; // 0 to 1
        contrast = 1 + Math.pow(normalized, 1.2) * 1.5;
      }

      filters.push(`contrast(${contrast.toFixed(3)})`);
    }

    // Exposure: Camera EV stops simulation
    // Mimics real camera exposure behavior with tonal preservation
    // -100 → -2 EV stops (underexposed), 0 → 0 EV (normal), +100 → +2 EV (overexposed)
    if (adjustFilters.exposure !== undefined && adjustFilters.exposure !== 0) {
      // Convert -100/+100 range to EV stops (-2 to +2)
      const evStops = (adjustFilters.exposure / 100) * 2;

      // Calculate exposure multiplier using 2^EV formula
      // Each stop doubles (positive) or halves (negative) the light
      const exposureMultiplier = Math.pow(2, evStops);

      // Apply as brightness filter
      filters.push(`brightness(${exposureMultiplier.toFixed(3)})`);

      // Add subtle contrast compensation for more natural look
      // High exposure: slightly reduce contrast to prevent blown highlights
      // Low exposure: slightly increase contrast to maintain shadow detail
      if (Math.abs(adjustFilters.exposure) > 30) {
        let contrastCompensation: number;

        if (adjustFilters.exposure > 0) {
          // Positive exposure: reduce contrast slightly (0.95 to 0.85)
          // At +50: 0.92, At +100: 0.85
          const factor = Math.min(adjustFilters.exposure / 100, 1);
          contrastCompensation = 1 - factor * 0.15;
        } else {
          // Negative exposure: increase contrast slightly (1.0 to 1.15)
          // At -50: 1.075, At -100: 1.15
          const factor = Math.min(Math.abs(adjustFilters.exposure) / 100, 1);
          contrastCompensation = 1 + factor * 0.15;
        }

        filters.push(`contrast(${contrastCompensation.toFixed(3)})`);
      }

      // Add subtle saturation preservation
      // Extreme exposure changes can wash out or over-saturate colors
      // This helps maintain natural color intensity
      if (Math.abs(adjustFilters.exposure) > 50) {
        let saturationCompensation: number;

        if (adjustFilters.exposure > 0) {
          // High exposure: slightly reduce saturation (0.95 to 0.90)
          const factor = Math.min((adjustFilters.exposure - 50) / 50, 1);
          saturationCompensation = 1 - factor * 0.1;
        } else {
          // Low exposure: slightly increase saturation (1.0 to 1.10)
          const factor = Math.min(
            (Math.abs(adjustFilters.exposure) - 50) / 50,
            1
          );
          saturationCompensation = 1 + factor * 0.1;
        }

        filters.push(`saturate(${saturationCompensation.toFixed(3)})`);
      }
    }

    // Highlights: Now handled by professional luminance-based algorithm via Canvas API
    // Uses parametric curves and color preservation for Photoshop-quality results

    // Shadows: Now handled by professional luminance-based algorithm via Canvas API
    // Uses parametric curves and color preservation for Photoshop-quality results

    // Whites: Extreme tonal adjustment for brightest areas (near-white tones)
    // More aggressive than highlights - targets the top 10% of tonal range
    // -100 → Strongly pull down whites (prevent clipping), 0 → Normal, +100 → Blow out whites
    if (adjustFilters.whites !== undefined && adjustFilters.whites !== 0) {
      // Scale factor for smooth transitions
      const scaleFactor = Math.abs(adjustFilters.whites) / 100;

      if (adjustFilters.whites < 0) {
        // NEGATIVE: Pull down/Compress whites (recover extreme highlights)
        // Strategy: Aggressive brightness reduction + strong contrast increase

        // Strong brightness reduction for whites (1.0 to 0.75)
        // At -50: 0.875, At -100: 0.75
        const brightnessReduction = 1 - scaleFactor * 0.25;
        filters.push(`brightness(${brightnessReduction.toFixed(3)})`);

        // Strong contrast increase to compress white point
        // At -50: 1.25, At -100: 1.50
        const contrastIncrease = 1 + scaleFactor * 0.5;
        filters.push(`contrast(${contrastIncrease.toFixed(3)})`);

        // Saturation boost to restore color in recovered whites
        // At -50: 1.075, At -100: 1.15
        if (Math.abs(adjustFilters.whites) > 20) {
          const saturationBoost = 1 + scaleFactor * 0.15;
          filters.push(`saturate(${saturationBoost.toFixed(3)})`);
        }
      } else {
        // POSITIVE: Push/Blow out whites (create bright, airy effect)
        // Strategy: Strong brightness increase + contrast reduction

        // Strong brightness increase for whites (1.0 to 1.40)
        // At +50: 1.20, At +100: 1.40
        const brightnessIncrease = 1 + scaleFactor * 0.4;
        filters.push(`brightness(${brightnessIncrease.toFixed(3)})`);

        // Contrast reduction to allow whites to bloom
        // At +50: 0.75, At +100: 0.50
        const contrastReduction = 1 - scaleFactor * 0.5;
        filters.push(`contrast(${contrastReduction.toFixed(3)})`);

        // Strong saturation reduction for blown-out white effect
        // At +50: 0.90, At +100: 0.80
        if (adjustFilters.whites > 20) {
          const saturationReduction = 1 - scaleFactor * 0.2;
          filters.push(`saturate(${saturationReduction.toFixed(3)})`);
        }
      }
    }

    // Blacks: Extreme tonal adjustment for darkest areas (near-black tones)
    // More aggressive than shadows - targets the bottom 10% of tonal range
    // -100 → Strongly lift blacks (prevent crushing), 0 → Normal, +100 → Crush blacks
    if (adjustFilters.blacks !== undefined && adjustFilters.blacks !== 0) {
      // Scale factor for smooth transitions
      const scaleFactor = Math.abs(adjustFilters.blacks) / 100;

      if (adjustFilters.blacks < 0) {
        // NEGATIVE: Lift/Open blacks (reveal extreme shadow detail)
        // Strategy: Strong brightness increase + aggressive contrast reduction

        // Strong brightness increase for blacks (1.0 to 1.45)
        // At -50: 1.225, At -100: 1.45
        const brightnessIncrease = 1 + scaleFactor * 0.45;
        filters.push(`brightness(${brightnessIncrease.toFixed(3)})`);

        // Aggressive contrast reduction to lift black point
        // At -50: 0.70, At -100: 0.40
        const contrastReduction = 1 - scaleFactor * 0.6;
        filters.push(`contrast(${contrastReduction.toFixed(3)})`);

        // Strong saturation boost to maintain color in lifted blacks
        // At -50: 1.10, At -100: 1.20
        if (Math.abs(adjustFilters.blacks) > 20) {
          const saturationBoost = 1 + scaleFactor * 0.2;
          filters.push(`saturate(${saturationBoost.toFixed(3)})`);
        }
      } else {
        // POSITIVE: Crush/Deepen blacks (create rich, deep blacks)
        // Strategy: Strong brightness reduction + strong contrast increase

        // Strong brightness reduction for blacks (1.0 to 0.70)
        // At +50: 0.85, At +100: 0.70
        const brightnessReduction = 1 - scaleFactor * 0.3;
        filters.push(`brightness(${brightnessReduction.toFixed(3)})`);

        // Strong contrast increase to crush black point
        // At +50: 1.30, At +100: 1.60
        const contrastIncrease = 1 + scaleFactor * 0.6;
        filters.push(`contrast(${contrastIncrease.toFixed(3)})`);

        // Strong saturation reduction for crushed black effect
        // At +50: 0.925, At +100: 0.85
        if (adjustFilters.blacks > 20) {
          const saturationReduction = 1 - scaleFactor * 0.15;
          filters.push(`saturate(${saturationReduction.toFixed(3)})`);
        }
      }
    }

    // Clarity: Now handled by professional multi-scale algorithm via Canvas API
    // Uses bilateral filtering and multi-scale decomposition with halo prevention

    // Sharpness: Now handled by professional Unsharp Mask algorithm via Canvas API
    // No CSS filter needed - processed image is used instead

    // Dehaze: Now handled by professional Dark Channel Prior algorithm via Canvas API
    // Uses atmospheric light estimation and transmission map calculation

    // ========================================
    // COLOR FILTERS (CSS-based for real-time performance)
    // ========================================

    // Temperature: Smooth Kelvin color temperature simulation
    // Unified algorithm for seamless transition across 0
    // -100 → Cool (Blue, ~3000K), 0 → Neutral (~5500K), +100 → Warm (Orange, ~10000K)
    if (
      colorFilters.temperature !== undefined &&
      colorFilters.temperature !== 0
    ) {
      const temp = colorFilters.temperature;
      const normalized = temp / 100; // -1 to +1

      // Unified sepia-based approach for smooth transition
      // Use sepia as base, then rotate hue in both directions
      const absIntensity = Math.abs(normalized);

      // Base sepia amount (same for both directions)
      // Gradual increase from 0 to 0.35 for natural color shift
      const sepiaAmount = absIntensity * 0.35;
      filters.push(`sepia(${sepiaAmount.toFixed(3)})`);

      // Hue rotation: smooth curve from blue (-) to orange (+)
      // -100: +190deg (cool blue), 0: 0deg (neutral), +100: -25deg (warm orange)
      let hueShift: number;
      if (temp < 0) {
        // Cool: Rotate towards blue (positive rotation)
        // Smooth curve: 0 → 190deg
        hueShift = absIntensity * 190;
      } else {
        // Warm: Rotate towards orange (negative rotation)
        // Smooth curve: 0 → -25deg
        hueShift = -(absIntensity * 25);
      }
      filters.push(`hue-rotate(${hueShift.toFixed(1)}deg)`);

      // Gentle saturation boost for vivid colors
      // Same for both directions for consistency
      const satBoost = 1 + absIntensity * 0.15;
      filters.push(`saturate(${satBoost.toFixed(3)})`);

      // Subtle brightness adjustment for warmth/coolness perception
      // Warm: slightly brighter, Cool: slightly darker
      const brightAdjust = 1 + normalized * 0.03;
      filters.push(`brightness(${brightAdjust.toFixed(3)})`);
    }

    // Tint: Green-Magenta color balance
    // Professional color grading control
    // -100 → Green tint, 0 → Neutral, +100 → Magenta/Pink tint
    if (colorFilters.tint !== undefined && colorFilters.tint !== 0) {
      const tint = colorFilters.tint;
      const intensity = Math.abs(tint) / 100; // 0 to 1

      if (tint < 0) {
        // NEGATIVE: Green tint (foliage, nature scenes)
        // Hue-rotate towards green spectrum
        // At -50: 40deg (yellow-green), At -100: 80deg (pure green)
        const hueShift = intensity * 80;
        filters.push(`hue-rotate(${hueShift.toFixed(1)}deg)`);

        // Boost saturation for vivid greens
        const satBoost = 1 + intensity * 0.12;
        filters.push(`saturate(${satBoost.toFixed(3)})`);
      } else {
        // POSITIVE: Magenta/Pink tint (skin tones, portraits)
        // Hue-rotate towards magenta
        // At +50: -30deg, At +100: -60deg (magenta)
        const hueShift = -(intensity * 60);
        filters.push(`hue-rotate(${hueShift.toFixed(1)}deg)`);

        // Boost saturation for rich magentas
        const satBoost = 1 + intensity * 0.12;
        filters.push(`saturate(${satBoost.toFixed(3)})`);
      }
    }

    // Saturation: Universal color intensity adjustment
    // Affects all colors equally (simple but effective)
    // -100 → Grayscale (B&W), 0 → Normal, +100 → Hyper-saturated
    if (
      colorFilters.saturation !== undefined &&
      colorFilters.saturation !== 0
    ) {
      // Linear mapping with slight curve for more control
      // At -100: 0 (grayscale), At 0: 1 (normal), At +100: 2.5 (vivid)
      let saturation: number;

      if (colorFilters.saturation < 0) {
        // Negative: Desaturate towards grayscale
        // Linear reduction: 1.0 to 0.0
        saturation = 1 + colorFilters.saturation / 100;
      } else {
        // Positive: Boost saturation with power curve
        // Smoother increase for natural look
        const normalized = colorFilters.saturation / 100; // 0 to 1
        saturation = 1 + Math.pow(normalized, 0.9) * 1.5;
      }

      filters.push(`saturate(${saturation.toFixed(3)})`);
    }

    // Vibrance: Smart saturation (preserves skin tones)
    // More sophisticated than saturation - protects already-saturated colors
    // -100 → Muted colors, 0 → Normal, +100 → Vibrant (without over-saturation)
    //
    // Algorithm approximation using CSS filters:
    // - Vibrance primarily affects muted colors (low saturation)
    // - Already vivid colors are protected from clipping
    // - Skin tones (reds/oranges) are preserved
    if (colorFilters.vibrance !== undefined && colorFilters.vibrance !== 0) {
      const vibrance = colorFilters.vibrance;
      const intensity = Math.abs(vibrance) / 100; // 0 to 1

      if (vibrance < 0) {
        // NEGATIVE: Reduce vibrance (muted, pastel look)
        // Strategy: Gentle saturation reduction + slight brightness increase
        const satReduction = 1 - intensity * 0.4; // Max -40% saturation
        filters.push(`saturate(${satReduction.toFixed(3)})`);

        // Slight brightness boost for soft, airy feel
        const brightBoost = 1 + intensity * 0.05;
        filters.push(`brightness(${brightBoost.toFixed(3)})`);
      } else {
        // POSITIVE: Boost vibrance (vivid but natural)
        // Strategy: Moderate saturation increase + contrast boost
        // More conservative than pure saturation to avoid clipping

        // Moderate saturation boost (max +80% vs saturation's +150%)
        const satBoost = 1 + intensity * 0.8;
        filters.push(`saturate(${satBoost.toFixed(3)})`);

        // Slight contrast increase for "pop" without harshness
        const contrastBoost = 1 + intensity * 0.08;
        filters.push(`contrast(${contrastBoost.toFixed(3)})`);

        // Protect highlights from blowing out
        // Slight brightness reduction at high vibrance
        if (vibrance > 50) {
          const brightReduction = 1 - (intensity - 0.5) * 0.05;
          filters.push(`brightness(${brightReduction.toFixed(3)})`);
        }
      }
    }

    // ========================================
    // FILTER EFFECTS
    // ========================================

    // Fade: Film fade effect (lifts blacks to gray)
    // Vintage, washed-out film look
    // 0 → No fade (pure blacks), 100 → Full fade (no pure blacks)
    if (
      filterEffects.fadeAmount !== undefined &&
      filterEffects.fadeAmount > 0
    ) {
      const fadeIntensity = filterEffects.fadeAmount / 100; // 0 to 1

      // Fade works by lifting black point while maintaining highlights
      // Strategy: Reduce contrast + increase brightness

      // Aggressive contrast reduction to lift blacks
      // At 50: 0.70 contrast, At 100: 0.40 contrast
      const contrastReduction = 1 - fadeIntensity * 0.6;
      filters.push(`contrast(${contrastReduction.toFixed(3)})`);

      // Moderate brightness increase to compensate
      // At 50: 1.08 brightness, At 100: 1.15 brightness
      const brightnessBoost = 1 + fadeIntensity * 0.15;
      filters.push(`brightness(${brightnessBoost.toFixed(3)})`);

      // Slight saturation reduction for washed-out film look
      // At 50: 0.92 saturation, At 100: 0.85 saturation
      const saturationReduction = 1 - fadeIntensity * 0.15;
      filters.push(`saturate(${saturationReduction.toFixed(3)})`);
    }

    // Vignette: Handled by Canvas API via useVignette hook
    // Creates radial gradient darkening/lightening from center to edges

    // Grain: Handled by Canvas API via useGrain hook
    // Adds realistic film grain texture with adjustable size and intensity

    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  // Mouse drag
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      onPositionChange({
        x: e.clientX - startPosRef.current.x,
        y: e.clientY - startPosRef.current.y,
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position, onPositionChange]);

  // Scroll/Touchpad zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      onScaleChange((prev) => Math.max(0.1, Math.min(3.0, prev + delta)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [onScaleChange]);

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center justify-center p-8"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalProcessedSrc}
        alt={alt}
        className="max-h-full max-w-full select-none object-contain shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${transform.rotation}deg) scaleX(${transform.flipHorizontal ? -1 : 1}) scaleY(${transform.flipVertical ? -1 : 1})`,
          filter: buildFilterString(),
          animation: 'scaleIn 700ms ease-in-out',
        }}
        draggable={false}
      />

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(${position.x}px, ${position.y}px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(${position.x}px, ${position.y}px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ImageViewer;
