/**
 * NavigationItem Component
 *
 * A single navigation item for the sidebar menu.
 * Features hover effects and active state.
 *
 * @example
 * ```tsx
 * <NavigationItem
 *   icon="🏠"
 *   label="Home"
 *   href="/home"
 *   active={false}
 * />
 * ```
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationItemProps {
  /**
   * Icon to display (emoji or component)
   */
  icon: React.ReactNode;

  /**
   * Text label for the nav item
   */
  label: string;

  /**
   * Navigation href
   */
  href: string;

  /**
   * Whether this item is currently active
   * @default false
   */
  active?: boolean;

  /**
   * Animation delay for stagger effect (in ms)
   * @default 0
   */
  animationDelay?: number;
}

export function NavigationItem({
  icon,
  label,
  href,
  active = false,
  animationDelay = 0,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={`relative flex animate-[fadeInSlide_500ms_ease-out_forwards] items-center gap-2 rounded-[7px] border border-transparent px-2.5 py-[7px] text-[12px] font-medium opacity-0 transition-all duration-400 ease-in-out ${
        active
          ? 'border-[rgba(139,92,246,0.4)] bg-gradient-to-br from-[rgba(139,92,246,0.15)] to-[rgba(99,102,241,0.1)] text-white shadow-[0_2px_8px_rgba(139,92,246,0.15)]'
          : 'text-white/65 hover:translate-x-[2px] hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white'
      } `}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute top-1/2 -left-px h-[60%] w-[2px] -translate-y-1/2 rounded-r-sm bg-gradient-to-b from-[#8b5cf6] to-[#6366f1]" />
      )}

      {/* Icon */}
      <span
        className={`flex w-[18px] items-center justify-center text-sm transition-opacity duration-400 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'} `}
      >
        {icon}
      </span>

      {/* Label */}
      <span>{label}</span>
    </Link>
  );
}

export default NavigationItem;
