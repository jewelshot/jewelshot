import React from 'react';

interface MenuButtonProps {
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

export function MenuButton({
  onClick,
  ariaLabel = 'User menu',
}: MenuButtonProps) {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className="text-base">⋮</span>
    </button>
  );
}

export default MenuButton;
