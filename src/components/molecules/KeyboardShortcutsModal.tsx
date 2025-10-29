'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: 'File' | 'View' | 'Edit' | 'Navigation';
}

const shortcuts: Shortcut[] = [
  // File Operations
  { keys: ['Ctrl', 'O'], description: 'Open image', category: 'File' },
  { keys: ['Ctrl', 'S'], description: 'Download image', category: 'File' },
  { keys: ['Delete'], description: 'Close image', category: 'File' },
  { keys: ['Backspace'], description: 'Close image', category: 'File' },

  // View Controls
  { keys: ['+', '='], description: 'Zoom in', category: 'View' },
  { keys: ['-'], description: 'Zoom out', category: 'View' },
  { keys: ['0'], description: 'Fit to screen', category: 'View' },
  { keys: ['F'], description: 'Toggle fullscreen', category: 'View' },
  { keys: ['C'], description: 'Toggle canvas controls', category: 'View' },

  // Edit Operations
  { keys: ['E'], description: 'Toggle edit panel', category: 'Edit' },
  { keys: ['Esc'], description: 'Close edit panel/crop', category: 'Edit' },

  // Navigation
  {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    category: 'Navigation',
  },
];

const categoryOrder: Shortcut['category'][] = [
  'File',
  'View',
  'Edit',
  'Navigation',
];

/**
 * Modal displaying all available keyboard shortcuts
 */
export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<Shortcut['category'], Shortcut[]>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border border-purple-500/30 bg-black/90 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20">
              <Keyboard className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-white/60">
                Speed up your workflow with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {categoryOrder.map((category) => {
            const categoryShortcuts = groupedShortcuts[category];
            if (!categoryShortcuts) return null;

            return (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold text-purple-400">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 rounded-lg bg-white/5 p-3"
                    >
                      <span className="text-sm text-white/80">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-white/20 bg-white/10 px-2 text-xs font-semibold text-white">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-white/40">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-xs text-white/40">
            Shortcuts won&apos;t work when typing in text fields
          </p>
          <button
            onClick={onClose}
            className="rounded-lg border border-purple-500/40 bg-purple-600/20 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-purple-500/60 hover:bg-purple-600/30"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsModal;
