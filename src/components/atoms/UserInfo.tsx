import React from 'react';

interface UserInfoProps {
  /**
   * User's display name
   */
  name: string;
  /**
   * User status or role
   */
  status: string;
}

export function UserInfo({ name, status }: UserInfoProps) {
  return (
    <div className="flex-1">
      <div className="text-[13px] font-semibold text-white">{name}</div>
      <div className="text-[11px] text-[rgba(139,92,246,0.7)]">{status}</div>
    </div>
  );
}

export default UserInfo;
