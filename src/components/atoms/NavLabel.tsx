import React from 'react';

interface NavLabelProps {
  /**
   * Label text
   */
  children: string;
}

export function NavLabel({ children }: NavLabelProps) {
  return <span className="flex-1">{children}</span>;
}

export default NavLabel;
