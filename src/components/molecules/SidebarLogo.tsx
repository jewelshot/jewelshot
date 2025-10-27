/**
 * SidebarLogo Component
 *
 * Premium logo display with icon and text.
 * Features hover animations and gradient effects.
 *
 * @example
 * ```tsx
 * <SidebarLogo />
 * ```
 */

'use client';

import React from 'react';

export function SidebarLogo() {
  return (
    <div className="relative mb-3 flex cursor-pointer items-center gap-2 overflow-hidden rounded-[10px] border border-[rgba(139,92,246,0.15)] bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(99,102,241,0.05)] px-2.5 py-2 transition-all duration-400 ease-in-out before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgba(139,92,246,0.15)] before:to-[rgba(99,102,241,0.1)] before:opacity-0 before:transition-opacity before:duration-400 hover:translate-y-[-1px] hover:border-[rgba(139,92,246,0.4)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.2)] hover:before:opacity-100">
      {/* Logo Icon */}
      <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-[7px] bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] text-base shadow-[0_2px_8px_rgba(139,92,246,0.3)] transition-all duration-400 ease-in-out group-hover:scale-[1.08] group-hover:rotate-[-5deg] group-hover:shadow-[0_4px_12px_rgba(139,92,246,0.5)]">
        💎
      </div>

      {/* Logo Text */}
      <div className="relative z-10 flex flex-col gap-[1px]">
        <span className="text-[13px] leading-[1.2] font-bold tracking-[-0.03em] text-white">
          Jewelshot
        </span>
        <span className="text-[8px] leading-none font-semibold tracking-[0.1em] text-[rgba(139,92,246,0.8)] uppercase">
          STUDIO
        </span>
      </div>
    </div>
  );
}

export default SidebarLogo;
