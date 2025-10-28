'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useImageSharpening } from '@/hooks/useImageSharpening';
import { useSelectiveTone } from '@/hooks/useSelectiveTone';

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
}: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Processing pipeline (order matters):
  // 1. Selective tone adjustment (highlights & shadows)
  const { processedSrc: toneMappedSrc } = useSelectiveTone({
    originalSrc: src,
    highlights: adjustFilters.highlights || 0,
    shadows: adjustFilters.shadows || 0,
    enabled:
      (adjustFilters.highlights || 0) !== 0 ||
      (adjustFilters.shadows || 0) !== 0,
  });

  // 2. Sharpening (applied after tone mapping)
  const { processedSrc: finalProcessedSrc } = useImageSharpening({
    originalSrc: toneMappedSrc,
    sharpness: adjustFilters.sharpness || 0,
    enabled: (adjustFilters.sharpness || 0) !== 0,
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

    // Clarity: Mid-tone contrast enhancement (micro-contrast)
    // Increases local contrast in mid-tones without affecting shadows/highlights aggressively
    // -100 → Soften/Flatten mid-tones, 0 → Normal, +100 → Crisp/Enhanced mid-tones
    if (adjustFilters.clarity !== undefined && adjustFilters.clarity !== 0) {
      // Scale factor for smooth transitions
      const scaleFactor = Math.abs(adjustFilters.clarity) / 100;

      if (adjustFilters.clarity < 0) {
        // NEGATIVE: Reduce clarity (dreamy, soft look)
        // Strategy: Reduce contrast and slightly increase brightness for softness

        // Moderate contrast reduction (1.0 to 0.70)
        // At -50: 0.85, At -100: 0.70
        const contrastReduction = 1 - scaleFactor * 0.3;
        filters.push(`contrast(${contrastReduction.toFixed(3)})`);

        // Slight brightness increase for soft glow (1.0 to 1.10)
        // At -50: 1.05, At -100: 1.10
        const brightnessIncrease = 1 + scaleFactor * 0.1;
        filters.push(`brightness(${brightnessIncrease.toFixed(3)})`);

        // Subtle saturation reduction for muted effect
        // At -50: 0.95, At -100: 0.90
        if (Math.abs(adjustFilters.clarity) > 30) {
          const saturationReduction = 1 - scaleFactor * 0.1;
          filters.push(`saturate(${saturationReduction.toFixed(3)})`);
        }
      } else {
        // POSITIVE: Increase clarity (crisp, detailed look)
        // Strategy: Increase contrast in mid-tones, slight brightness reduction

        // Strong contrast increase for mid-tone pop (1.0 to 1.50)
        // At +50: 1.25, At +100: 1.50
        const contrastIncrease = 1 + scaleFactor * 0.5;
        filters.push(`contrast(${contrastIncrease.toFixed(3)})`);

        // Very slight brightness reduction to prevent over-brightness (1.0 to 0.95)
        // At +50: 0.975, At +100: 0.95
        const brightnessReduction = 1 - scaleFactor * 0.05;
        filters.push(`brightness(${brightnessReduction.toFixed(3)})`);

        // Saturation boost for enhanced color separation in mid-tones
        // At +50: 1.075, At +100: 1.15
        if (adjustFilters.clarity > 30) {
          const saturationBoost = 1 + scaleFactor * 0.15;
          filters.push(`saturate(${saturationBoost.toFixed(3)})`);
        }
      }
    }

    // Sharpness: Now handled by professional Unsharp Mask algorithm via Canvas API
    // No CSS filter needed - processed image is used instead

    // Dehaze: Atmospheric haze removal (clarity + contrast + exposure)
    // Removes fog, mist, and atmospheric perspective effects
    // -100 → Add haze/fog, 0 → Normal, +100 → Remove haze/enhance clarity
    if (adjustFilters.dehaze !== undefined && adjustFilters.dehaze !== 0) {
      // Scale factor for smooth transitions
      const scaleFactor = Math.abs(adjustFilters.dehaze) / 100;

      if (adjustFilters.dehaze < 0) {
        // NEGATIVE: Add haze/fog effect (dreamy, atmospheric)
        // Strategy: Reduce contrast, increase brightness, desaturate

        // Strong contrast reduction for hazy look (1.0 to 0.60)
        // At -50: 0.80, At -100: 0.60
        const contrastReduction = 1 - scaleFactor * 0.4;
        filters.push(`contrast(${contrastReduction.toFixed(3)})`);

        // Brightness increase for foggy glow (1.0 to 1.25)
        // At -50: 1.125, At -100: 1.25
        const brightnessIncrease = 1 + scaleFactor * 0.25;
        filters.push(`brightness(${brightnessIncrease.toFixed(3)})`);

        // Strong desaturation for washed-out hazy effect (1.0 to 0.60)
        // At -50: 0.80, At -100: 0.60
        const saturationReduction = 1 - scaleFactor * 0.4;
        filters.push(`saturate(${saturationReduction.toFixed(3)})`);
      } else {
        // POSITIVE: Remove haze (crisp, clear, vibrant)
        // Strategy: Increase contrast, reduce brightness, boost saturation

        // Very strong contrast increase for haze cutting (1.0 to 1.70)
        // At +50: 1.35, At +100: 1.70
        const contrastIncrease = 1 + scaleFactor * 0.7;
        filters.push(`contrast(${contrastIncrease.toFixed(3)})`);

        // Slight brightness reduction to counter contrast boost (1.0 to 0.88)
        // At +50: 0.94, At +100: 0.88
        const brightnessReduction = 1 - scaleFactor * 0.12;
        filters.push(`brightness(${brightnessReduction.toFixed(3)})`);

        // Strong saturation boost for color recovery (1.0 to 1.35)
        // At +50: 1.175, At +100: 1.35
        const saturationBoost = 1 + scaleFactor * 0.35;
        filters.push(`saturate(${saturationBoost.toFixed(3)})`);

        // Subtle exposure adjustment for depth perception
        // At +50: 1.05, At +100: 1.10
        if (adjustFilters.dehaze > 40) {
          const exposureBoost = 1 + scaleFactor * 0.1;
          filters.push(`brightness(${exposureBoost.toFixed(3)})`);
        }
      }
    }

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
