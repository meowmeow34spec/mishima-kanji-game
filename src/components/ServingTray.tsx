/**
 * Salon Mishima - Multi-Slot Serving Tray Component
 * File: src/components/ServingTray.tsx
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';

export interface ServingTrayProps {
  slots: (string | null)[];
  capacity?: number;
  orderKanji?: string;
  onPlaceSlot?: (slotIndex: number, character: string) => void;
  onSlotClick?: (slotIndex: number) => void;
  onClearSlot?: () => void;
}

export const ServingTray: React.FC<ServingTrayProps> = ({
  slots,
  capacity,
  orderKanji = '',
  onSlotClick,
  onClearSlot,
}) => {
  const resolvedCapacity = capacity ?? Math.max(slots.length, 2);
  const normalizedSlots = Array.from(
    { length: resolvedCapacity },
    (_, idx) => slots[idx] ?? null
  );

  return (
    <div
      className="serving-tray"
      data-testid="serving-tray"
      role="region"
      aria-label="Serving Tray"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <span className="tray-title">
          給仕盆 {orderKanji ? `— 「${orderKanji}」` : ''}
        </span>
        {onClearSlot && normalizedSlots.some((s) => s !== null) && (
          <button
            type="button"
            data-testid="btn-clear-tray"
            className="btn-lacquer"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={onClearSlot}
          >
            <RotateCcw size={13} />
            <span>盆を空にする</span>
          </button>
        )}
      </div>

      <div className="tray-slots-row">
        {normalizedSlots.map((placedChar, idx) => {
          const isFilled = placedChar !== null && placedChar !== '';
          return (
            <div
              key={idx}
              data-testid={`tray-slot-${idx}`}
              className={
                isFilled
                  ? 'tray-slot tray-slot--filled'
                  : 'tray-slot tray-slot--empty empty-slot'
              }
              style={
                isFilled
                  ? undefined
                  : { border: '2px dashed var(--color-gold-burnished)' }
              }
              onClick={() => onSlotClick?.(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSlotClick?.(idx);
                }
              }}
              aria-label={
                isFilled
                  ? `Tray slot ${idx + 1}: ${placedChar}`
                  : `Empty tray slot ${idx + 1}`
              }
            >
              {isFilled ? (
                <span data-testid={`tray-block-${placedChar}`}>{placedChar}</span>
              ) : (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-gold)',
                    opacity: 0.55,
                  }}
                >
                  {idx + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServingTray;
