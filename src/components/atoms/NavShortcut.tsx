import React from 'react';

interface NavShortcutProps {
  /**
   * Keyboard shortcut text
   */
  shortcut: string;
}

export function NavShortcut({ shortcut }: NavShortcutProps) {
  return (
    <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
      {shortcut}
    </span>
  );
}

export default NavShortcut;
