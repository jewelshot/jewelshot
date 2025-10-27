/**
 * SectionHeader Component
 *
 * Section header for sidebar navigation groups.
 * Displays uppercase section title with icon.
 *
 * @example
 * ```tsx
 * <SectionHeader title="TOOLS" />
 * <SectionHeader title="SETTINGS" />
 * ```
 */

'use client';

import React from 'react';

interface SectionHeaderProps {
  /**
   * Section title (will be displayed in uppercase)
   */
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mt-4 mb-2 flex items-center gap-2 px-2.5">
      <span className="h-px w-3 bg-[rgba(139,92,246,0.3)]" />
      <span className="text-[10px] font-bold tracking-[0.1em] text-[rgba(139,92,246,0.7)] uppercase">
        {title}
      </span>
    </div>
  );
}

export default SectionHeader;
