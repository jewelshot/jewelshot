/**
 * NavigationItem Component
 *
 * A single navigation item for the sidebar menu.
 * Features hover effects, active state, badges, and keyboard shortcuts.
 *
 * @example
 * ```tsx
 * <NavigationItem
 *   icon="🏠"
 *   label="Home"
 *   href="/home"
 *   active={false}
 *   badge={{ variant: 'new' }}
 *   shortcut="⌘H"
 * />
 * ```
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Badge from './Badge';

interface BadgeConfig {
  variant: 'new' | 'pro' | 'count' | 'dot';
  count?: number;
  color?: 'green' | 'blue' | 'red' | 'orange';
}

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
   * Badge configuration
   */
  badge?: BadgeConfig;

  /**
   * Keyboard shortcut display
   */
  shortcut?: string;

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
  badge,
  shortcut,
  animationDelay = 0,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={`duration-400 relative flex animate-[fadeInSlide_500ms_ease-out_forwards] items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 text-[13px] font-medium opacity-0 transition-all ease-in-out ${
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
        <div className="absolute -left-px top-1/2 h-[60%] w-[2px] -translate-y-1/2 rounded-r-sm bg-gradient-to-b from-[#8b5cf6] to-[#6366f1]" />
      )}

      {/* Icon */}
      <span
        className={`duration-400 flex w-5 items-center justify-center text-base transition-opacity ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'} `}
      >
        {icon}
      </span>

      {/* Label */}
      <span className="flex-1">{label}</span>

      {/* Badge */}
      {badge && (
        <Badge
          variant={badge.variant}
          count={badge.count}
          color={badge.color}
        />
      )}

      {/* Keyboard Shortcut */}
      {shortcut && (
        <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
          {shortcut}
        </span>
      )}
    </Link>
  );
}

export default NavigationItem;
