/**
 * Salon Mishima 3D - High-Contrast Reading Recall Keycaps
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
    <div className="keypad-recall-wrap">
      <p className="keypad-prompt-label">
        {prompt || '🎹 알맞은 일본어 발음을 눌러 서빙하세요 (숫자키 1~4)'}
      </p>
      <div
        className="keypad-recall"
        data-testid="keypad-recall"
        role="group"
        aria-label="일본어 발음 선택 키패드"
      >
        {options.map((reading, idx) => (
          <button
            key={`${reading}-${idx}`}
            type="button"
            data-testid={`keypad-option-${reading}`}
            data-hotkey={idx < 4 ? String(idx + 1) : undefined}
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
