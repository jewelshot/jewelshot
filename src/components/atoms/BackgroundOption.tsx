import React from 'react';

interface BackgroundOptionProps {
  /**
   * Background type
   */
  type: 'black' | 'gray' | 'white' | 'alpha';
  /**
   * Display label
   */
  label: string;
  /**
   * Whether this option is active
   */
  active: boolean;
  /**
   * Click handler
   */
  onClick: () => void;
}

const bgStyles = {
  black: { background: '#000000' },
  gray: { background: '#808080' },
  white: { background: '#ffffff' },
  alpha: {
    backgroundImage:
      'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
    backgroundColor: '#ffffff',
  },
};

export function BackgroundOption({
  type,
  label,
  active,
  onClick,
}: BackgroundOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all ${
        active
          ? 'bg-[rgba(139,92,246,0.15)] text-white'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div
        className="h-5 w-5 rounded border border-white/20"
        style={bgStyles[type]}
      />
      <span>{label}</span>
    </button>
  );
}

export default BackgroundOption;
