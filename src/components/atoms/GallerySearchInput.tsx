'use client';

import React from 'react';

interface GallerySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function GallerySearchInput({
  value,
  onChange,
  placeholder = 'Search images...',
}: GallerySearchInputProps) {
  return (
    <div className="relative">
      {/* Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-4 w-4 text-[rgba(196,181,253,0.5)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] py-2 pl-10 pr-4 text-sm text-[rgba(196,181,253,1)] placeholder-[rgba(196,181,253,0.4)] backdrop-blur-[16px] transition-all duration-200 focus:border-[rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.2)]"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[rgba(196,181,253,0.5)] transition-colors hover:text-[rgba(196,181,253,0.8)]"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default GallerySearchInput;
