/**
 * NavigationItem Component (Molecule)
 *
 * A single navigation item for the sidebar menu.
 * Orchestrates NavIcon, NavLabel, ActiveIndicator, Badge, and NavShortcut atoms.
 * Features hover effects, active state, badges, and keyboard shortcuts.
 *
 * @example
 * ```tsx
 * <NavigationItem
 *   icon={Home}
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
import Badge from '@/components/atoms/Badge';
import NavIcon from '@/components/atoms/NavIcon';
import NavLabel from '@/components/atoms/NavLabel';
import ActiveIndicator from '@/components/atoms/ActiveIndicator';
import NavShortcut from '@/components/atoms/NavShortcut';

interface BadgeConfig {
  variant: 'new' | 'pro' | 'count' | 'dot';
  count?: number;
  color?: 'green' | 'blue' | 'red' | 'orange';
}

interface NavigationItemProps {
  /**
   * Icon to display (Lucide icon component)
   */
  icon: React.ComponentType<{ className?: string }>;

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
  icon: Icon,
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
      <ActiveIndicator active={active} />

      {/* Icon */}
      <NavIcon icon={Icon} active={active} />

      {/* Label */}
      <NavLabel>{label}</NavLabel>

      {/* Badge */}
      {badge && (
        <Badge
          variant={badge.variant}
          count={badge.count}
          color={badge.color}
        />
      )}

      {/* Keyboard Shortcut */}
      {shortcut && <NavShortcut shortcut={shortcut} />}
    </Link>
  );
}

export default NavigationItem;
