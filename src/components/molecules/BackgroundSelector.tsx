'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import BackgroundOption from '@/components/atoms/BackgroundOption';

type BackgroundType = 'none' | 'black' | 'gray' | 'white' | 'alpha';

interface BackgroundSelectorProps {
  /**
   * Current background type
   */
  background: BackgroundType;
  /**
   * Change handler
   */
  onBackgroundChange: (bg: BackgroundType) => void;
}

const backgrounds = [
  { type: 'none' as const, label: 'Default' },
  { type: 'black' as const, label: 'Black' },
  { type: 'gray' as const, label: '50% Gray' },
  { type: 'white' as const, label: 'White' },
  { type: 'alpha' as const, label: 'Alpha' },
];

export function BackgroundSelector({
  background,
  onBackgroundChange,
}: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/80 transition-all hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.15)] hover:text-white"
        title="Background"
      >
        <Palette className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-40 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.95)] p-2 shadow-lg backdrop-blur-[16px]">
          {backgrounds.map((bg) => (
            <BackgroundOption
              key={bg.type}
              type={bg.type}
              label={bg.label}
              active={background === bg.type}
              onClick={() => {
                onBackgroundChange(bg.type);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BackgroundSelector;
