/**
 * UserProfile Component (Molecule)
 *
 * User profile display at the bottom of sidebar.
 * Orchestrates Avatar, OnlineIndicator, UserInfo, and MenuButton atoms.
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
import Avatar from '@/components/atoms/Avatar';
import OnlineIndicator from '@/components/atoms/OnlineIndicator';
import UserInfo from '@/components/atoms/UserInfo';
import MenuButton from '@/components/atoms/MenuButton';

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
      {/* Avatar with Online Indicator */}
      <div className="relative">
        <Avatar content={avatar} size="md" />
        <OnlineIndicator online={online} />
      </div>

      {/* User Info */}
      <UserInfo name={name} status={status} />

      {/* Menu Button */}
      <MenuButton />
    </div>
  );
}

export default UserProfile;
