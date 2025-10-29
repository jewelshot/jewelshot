'use client';

import React, { useState } from 'react';
import AIPromptInput from '@/components/atoms/AIPromptInput';
import AIGenerateButton from '@/components/atoms/AIGenerateButton';
import AIToggleButton from '@/components/atoms/AIToggleButton';
import QuickPromptButton from '@/components/atoms/QuickPromptButton';
import jewelryPrompts from '@/data/jewelryPrompts.json';

interface AIEditControlProps {
  currentImageUrl: string;
  onImageEdited: (editedImageUrl: string) => void;
  onError?: (error: Error) => void;
  isEditing?: boolean;
  progress?: string;
  visible?: boolean;
}

export function AIEditControl({
  currentImageUrl,
  isEditing = false,
  visible = true,
}: AIEditControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Auto-collapse expanded area when AI starts processing
  const shouldShowExpanded = isExpanded && !isEditing;

  const handleGenerate = () => {
    if (isEditing) return;

    const event = new CustomEvent('ai-edit-generate', {
      detail: { prompt: prompt.trim() || '', imageUrl: currentImageUrl },
    });
    window.dispatchEvent(event);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isEditing) return;

    // Directly trigger generation without showing prompt in textarea
    const event = new CustomEvent('ai-edit-generate', {
      detail: { prompt: promptText, imageUrl: currentImageUrl },
    });
    window.dispatchEvent(event);
  };

  if (!visible) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Expanded Prompt Area */}
      <div
        className={`w-full max-w-xl origin-bottom transition-all duration-300 ease-out ${
          shouldShowExpanded
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="space-y-2">
          {/* Prompt Input */}
          <AIPromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            disabled={isEditing}
          />

          {/* Quick Prompt Buttons */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {jewelryPrompts.map((item) => (
              <QuickPromptButton
                key={item.id}
                label={item.label}
                icon={item.icon as 'sparkles' | 'square' | 'zap' | 'gem'}
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={isEditing}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Control Bar */}
      <div className="group relative">
        {/* Dark backdrop layer */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-black/50 backdrop-blur-2xl" />

        {/* Main container */}
        <div className="relative flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.85)] px-2 py-1.5 backdrop-blur-2xl transition-all duration-200 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(10,10,10,0.95)]">
          {/* Toggle Button */}
          <AIToggleButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isEditing}
          />

          {/* Divider */}
          <div className="h-5 w-px bg-[rgba(139,92,246,0.3)]" />

          {/* Generate Button */}
          <AIGenerateButton
            onClick={handleGenerate}
            disabled={isEditing}
            loading={isEditing}
          />
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default AIEditControl;
