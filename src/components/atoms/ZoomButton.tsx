'use client';

import React from 'react';

interface ZoomButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  disabled?: boolean;
}

export function ZoomButton({
  onClick,
  icon,
  title,
  disabled = false,
}: ZoomButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      title={title}
    >
      {icon}
    </button>
  );
}

export default ZoomButton;
