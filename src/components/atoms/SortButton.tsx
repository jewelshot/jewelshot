'use client';

import React, { useState, useRef, useEffect } from 'react';

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

interface SortButtonProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

export function SortButton({ value, onChange }: SortButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    sortOptions.find((opt) => opt.value === value)?.label || 'Sort';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] px-3 py-2 text-xs font-medium text-[rgba(196,181,253,1)] backdrop-blur-[16px] transition-all duration-200 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(10,10,10,0.9)]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        <span>{currentLabel}</span>
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.95)] shadow-xl backdrop-blur-[16px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                value === option.value
                  ? 'bg-[rgba(139,92,246,0.2)] text-[rgba(196,181,253,1)]'
                  : 'text-[rgba(196,181,253,0.7)] hover:bg-[rgba(139,92,246,0.1)] hover:text-[rgba(196,181,253,1)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortButton;
