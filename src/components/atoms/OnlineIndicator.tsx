import React from 'react';

interface OnlineIndicatorProps {
  /**
   * Whether the user is online
   */
  online: boolean;
}

export function OnlineIndicator({ online }: OnlineIndicatorProps) {
  if (!online) return null;

  return (
    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[rgba(10,10,10,1)] bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
  );
}

export default OnlineIndicator;
