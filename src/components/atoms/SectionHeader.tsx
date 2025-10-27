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
    <div className="mt-6 mb-2 flex items-center gap-2 px-3">
      <span className="h-px w-2 bg-[rgba(139,92,246,0.4)]" />
      <span className="text-[10px] font-bold tracking-[0.15em] text-[rgba(139,92,246,0.6)] uppercase">
        {title}
      </span>
    </div>
  );
}

export default SectionHeader;
