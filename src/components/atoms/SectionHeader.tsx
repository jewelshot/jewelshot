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
    <div className="mb-2 mt-6 flex items-center gap-2">
      <span className="h-px w-2 bg-[rgba(139,92,246,0.4)]" />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgba(139,92,246,0.6)]">
        {title}
      </span>
    </div>
  );
}

export default SectionHeader;
