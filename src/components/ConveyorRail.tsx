/**
 * Salon Mishima - 3D Mahogany Conveyor Rail & Wooden Kanji Blocks
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
      aria-label="Kanji Conveyor Rail"
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
              className={`wooden-block conveyor-block ${feedbackClass}`.trim()}
              disabled={disabled}
              onClick={() => onSelectOption(option)}
              aria-label={`Select block ${option}`}
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
