/**
 * Salon Mishima 3D - Tactile High-Contrast Ivory Kanji Block Dock
 * File: src/components/ConveyorRail.tsx
 */

import React from 'react';

export interface ConveyorRailProps {
  options: string[];
  onSelectOption: (option: string) => void;
  disabled?: boolean;
  lastPicked?: { option: string; isCorrect: boolean } | null;
}

export const ConveyorRail: React.FC<ConveyorRailProps> = ({
  options,
  onSelectOption,
  disabled = false,
  lastPicked = null,
}) => {
  return (
    <div
      className="conveyor-rail"
      data-testid="conveyor-rail"
      role="region"
      aria-label="한자 블록 선택 트레이"
    >
      <div className="conveyor-track">
        {options.map((option, idx) => {
          const isLastPicked = lastPicked?.option === option;
          const feedbackClass = isLastPicked
            ? lastPicked.isCorrect
              ? 'wooden-block--correct'
              : 'wooden-block--wrong'
            : '';

          return (
            <button
              key={`${option}-${idx}`}
              type="button"
              data-testid={`conveyor-option-${option}`}
              data-hotkey={idx < 4 ? String(idx + 1) : undefined}
              className={`wooden-block conveyor-block ${feedbackClass}`.trim()}
              disabled={disabled}
              onClick={() => onSelectOption(option)}
              aria-label={`${idx + 1}번 한자 블록 ${option} 선택`}
            >
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConveyorRail;
