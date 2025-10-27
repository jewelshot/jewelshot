/**
 * UserProfile Component
 *
 * User profile display at the bottom of sidebar.
 * Shows avatar, name, status, and menu button.
 *
 * @example
 * ```tsx
 * <UserProfile
 *   name="Yasin"
 *   status="Premium User"
 *   avatar="Y"
 *   online={true}
 * />
 * ```
 */

'use client';

import React from 'react';

interface UserProfileProps {
  /**
   * User's display name
   */
  name: string;

  /**
   * User status or role
   */
  status: string;

  /**
   * Avatar letter or image URL
   */
  avatar: string;

  /**
   * Online status indicator
   * @default false
   */
  online?: boolean;
}

export function UserProfile({
  name,
  status,
  avatar,
  online = false,
}: UserProfileProps) {
  return (
    <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.6)] p-3.5 backdrop-blur-md">
      {/* Avatar */}
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] text-base font-bold text-white shadow-lg">
          {avatar}
        </div>
        {/* Online indicator */}
        {online && (
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[rgba(10,10,10,1)] bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-white">{name}</div>
        <div className="text-[11px] text-[rgba(139,92,246,0.7)]">{status}</div>
      </div>

      {/* Menu Button */}
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        aria-label="User menu"
      >
        <span className="text-base">⋮</span>
      </button>
    </div>
  );
}

export default UserProfile;
