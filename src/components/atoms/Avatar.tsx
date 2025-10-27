import React from 'react';

interface AvatarProps {
  /**
   * Avatar letter or image URL
   */
  content: string;
  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-11 w-11 text-base',
  lg: 'h-16 w-16 text-2xl',
};

export function Avatar({ content, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] font-bold text-white shadow-lg ${sizeClasses[size]}`}
    >
      {content}
    </div>
  );
}

export default Avatar;
