/**
 * Badge Component
 *
 * Flexible badge for displaying status, counts, or labels.
 * Supports different variants: NEW, PRO, count, dot.
 *
 * @example
 * ```tsx
 * <Badge variant="new" />
 * <Badge variant="pro" />
 * <Badge variant="count" count={24} />
 * <Badge variant="dot" color="green" />
 * ```
 */

'use client';

import React from 'react';

type BadgeVariant = 'new' | 'pro' | 'count' | 'dot';

interface BadgeProps {
  /**
   * Badge variant type
   */
  variant: BadgeVariant;

  /**
   * Count number (for count variant)
   */
  count?: number;

  /**
   * Dot color (for dot variant)
   */
  color?: 'green' | 'blue' | 'red' | 'orange';
}

export function Badge({ variant, count, color = 'green' }: BadgeProps) {
  // NEW Badge
  if (variant === 'new') {
    return (
      <span className="rounded-full bg-[#6366f1] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        NEW
      </span>
    );
  }

  // PRO Badge
  if (variant === 'pro') {
    return (
      <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        PRO
      </span>
    );
  }

  // Count Badge
  if (variant === 'count' && count !== undefined) {
    return (
      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6366f1]/30 px-1.5 text-[10px] font-semibold text-[#c7d2fe]">
        {count}
      </span>
    );
  }

  // Dot Badge
  if (variant === 'dot') {
    const colorClasses = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
    };

    return (
      <span
        className={`h-2 w-2 rounded-full ${colorClasses[color]} shadow-[0_0_8px_currentColor]`}
      />
    );
  }

  return null;
}

export default Badge;
