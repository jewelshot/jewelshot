/**
 * BarToggleButton Component
 *
 * Generic toggle button for all bars (top, bottom, left, right).
 * Positions itself based on bar position and state.
 *
 * @example
 * ```tsx
 * <BarToggleButton
 *   position="left"
 *   isOpen={true}
 *   onClick={toggleSidebar}
 * />
 * ```
 */

'use client';

import React from 'react';

type BarPosition = 'top' | 'bottom' | 'left' | 'right';

interface BarToggleButtonProps {
  /**
   * Which bar this button controls
   */
  position: BarPosition;

  /**
   * Whether the bar is currently open
   */
  isOpen: boolean;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Custom offset (for positioning adjustments)
   */
  offset?: number;
}

export function BarToggleButton({
  position,
  isOpen,
  onClick,
  offset = 0,
}: BarToggleButtonProps) {
  // Position-specific styles
  const positionStyles = {
    left: {
      position: isOpen ? `left-[${260 + offset}px]` : 'left-0',
      size: 'h-8 w-3',
      rounded: isOpen ? 'rounded-l-md' : 'rounded-r-md',
      placement: 'top-1/2 -translate-y-1/2',
      icon: '›',
      iconRotation: isOpen ? 'rotate-180' : 'rotate-0',
    },
    right: {
      position: isOpen ? `right-[${320 + offset}px]` : 'right-0',
      size: 'h-8 w-3',
      rounded: isOpen ? 'rounded-r-md' : 'rounded-l-md',
      placement: 'top-1/2 -translate-y-1/2',
      icon: '‹',
      iconRotation: isOpen ? 'rotate-180' : 'rotate-0',
    },
    top: {
      position: isOpen ? `top-[${64 + offset}px]` : 'top-0',
      size: 'w-8 h-3',
      rounded: isOpen ? 'rounded-t-md' : 'rounded-b-md',
      placement: 'left-1/2 -translate-x-1/2',
      icon: '›',
      iconRotation: isOpen ? '-rotate-90' : 'rotate-90',
    },
    bottom: {
      position: isOpen ? `bottom-[${40 + offset}px]` : 'bottom-0',
      size: 'w-8 h-3',
      rounded: isOpen ? 'rounded-b-md' : 'rounded-t-md',
      placement: 'left-1/2 -translate-x-1/2',
      icon: '›',
      iconRotation: isOpen ? 'rotate-90' : '-rotate-90',
    },
  };

  const styles = positionStyles[position];

  return (
    <button
      onClick={onClick}
      className={`fixed z-[200] flex cursor-pointer items-center justify-center border border-[rgba(139,92,246,0.2)] bg-[rgba(17,17,17,0.8)] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:backdrop-blur-[10px] ${styles.size} ${styles.rounded} ${styles.placement} ${styles.position}`}
      aria-label={`${isOpen ? 'Close' : 'Open'} ${position} bar`}
      aria-expanded={isOpen}
    >
      <span
        className={`text-[8px] text-white/60 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${styles.iconRotation}`}
      >
        {styles.icon}
      </span>
    </button>
  );
}

export default BarToggleButton;
