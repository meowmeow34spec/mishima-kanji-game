/**
 * Salon Mishima - Virtual Reading Keypad Recall Component
 * File: src/components/KeypadRecall.tsx
 */

import React from 'react';

export interface KeypadRecallProps {
  prompt: string;
  options: string[];
  onSelectReading: (reading: string) => void;
  disabled?: boolean;
}

export const KeypadRecall: React.FC<KeypadRecallProps> = ({
  prompt,
  options,
  onSelectReading,
  disabled = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
      }}
    >
      <p
        style={{
          color: 'var(--color-washi-dim)',
          fontSize: 'var(--font-size-sm)',
          letterSpacing: '0.1em',
        }}
      >
        {prompt || '正しい読みを選んでください'}
      </p>
      <div
        className="keypad-recall"
        data-testid="keypad-recall"
        role="group"
        aria-label="Reading Selection Keypad"
      >
        {options.map((reading, idx) => (
          <button
            key={`${reading}-${idx}`}
            type="button"
            data-testid={`keypad-option-${reading}`}
            className="keypad-key"
            disabled={disabled}
            onClick={() => onSelectReading(reading)}
          >
            {reading}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KeypadRecall;
