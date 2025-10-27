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
    <div className="mt-auto flex items-center gap-3 rounded-xl border border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.5)] p-3 backdrop-blur-sm">
      {/* Avatar */}
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] text-lg font-bold text-white">
          {avatar}
        </div>
        {/* Online indicator */}
        {online && (
          <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[rgba(10,10,10,1)] bg-green-500" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">{name}</div>
        <div className="text-xs text-[rgba(139,92,246,0.8)]">{status}</div>
      </div>

      {/* Menu Button */}
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        aria-label="User menu"
      >
        <span className="text-lg">⋮</span>
      </button>
    </div>
  );
}

export default UserProfile;
