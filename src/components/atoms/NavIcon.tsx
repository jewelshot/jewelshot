import React from 'react';

interface NavIconProps {
  /**
   * Lucide icon component
   */
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Whether the parent nav item is active
   */
  active?: boolean;
}

export function NavIcon({ icon: Icon, active = false }: NavIconProps) {
  return (
    <Icon
      className={`duration-400 h-[18px] w-[18px] transition-opacity ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
    />
  );
}

export default NavIcon;
