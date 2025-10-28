'use client';

import React from 'react';

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AIPromptInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Describe your edit... (optional)',
}: AIPromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="group relative">
      {/* Dark backdrop for better contrast */}
      <div className="absolute inset-0 rounded-lg bg-black/40 backdrop-blur-2xl" />

      {/* Input container */}
      <div className="relative overflow-hidden rounded-lg border border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl transition-all duration-200 group-focus-within:border-[rgba(139,92,246,0.4)] group-focus-within:bg-[rgba(10,10,10,0.95)]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={2}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent px-3 py-2.5 text-xs leading-relaxed text-white/90 placeholder-white/40 outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
          }}
        />

        {/* Keyboard hint */}
        {value && (
          <div className="absolute bottom-1.5 right-2 text-[9px] font-medium text-white/20 transition-all duration-200 group-focus-within:text-purple-400/40">
            <kbd className="rounded bg-white/5 px-1 py-0.5">⌘</kbd>
            <kbd className="rounded bg-white/5 px-1 py-0.5">↵</kbd>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIPromptInput;
