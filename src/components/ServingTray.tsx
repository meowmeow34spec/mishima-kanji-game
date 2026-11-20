/**
 * Salon Mishima 3D - Sleek Multi-Slot Serving Tray with WEB-03-Safe Slot Huneum Hints
 * File: src/components/ServingTray.tsx
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { formatReadingWithHangul } from '../data/koreanMnemonics';

export interface ServingTrayProps {
  slots: (string | null)[];
  capacity?: number;
  orderKanji?: string;
  /** Korean 훈음 per slot (e.g. ['쇠 금', '누각 각', '절 사']) — zero raw kanji glyphs! */
  slotHints?: string[];
  onPlaceSlot?: (slotIndex: number, character: string) => void;
  onSlotClick?: (slotIndex: number) => void;
  onClearSlot?: () => void;
}

export const ServingTray: React.FC<ServingTrayProps> = ({
  slots,
  capacity,
  orderKanji = '',
  slotHints = [],
  onSlotClick,
  onClearSlot,
}) => {
  const resolvedCapacity = capacity ?? Math.max(slots.length, 2);
  const normalizedSlots = Array.from(
    { length: resolvedCapacity },
    (_, idx) => slots[idx] ?? null
  );

  const formattedReading = orderKanji ? formatReadingWithHangul(orderKanji) : '';

  return (
    <div
      className="serving-tray"
      data-testid="serving-tray"
      role="region"
      aria-label="숙어 조립 서빙 트레이"
    >
      <span className="tray-title">
        🍵 서빙 트레이 {formattedReading ? `「${formattedReading}」` : ''}
      </span>

      <div className="tray-slots-row">
        {normalizedSlots.map((placedChar, idx) => {
          const isFilled = placedChar !== null && placedChar !== '';
          const slotHuneum = slotHints[idx] || '';
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
                  ? `트레이 ${idx + 1}번 칸: ${placedChar}`
                  : `비어 있는 트레이 ${idx + 1}번 칸${slotHuneum ? ` (${slotHuneum})` : ''}`
              }
            >
              {isFilled ? (
                <span data-testid={`tray-block-${placedChar}`}>{placedChar}</span>
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    color: '#451a03',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {slotHuneum ? `${idx + 1}칸: ${slotHuneum}` : `${idx + 1}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {onClearSlot && normalizedSlots.some((s) => s !== null) && (
        <button
          type="button"
          data-testid="btn-clear-tray"
          className="btn-ivory"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.875rem' }}
          onClick={onClearSlot}
        >
          <RotateCcw size={13} />
          <span>비우기</span>
        </button>
      )}
    </div>
  );
};

export default ServingTray;
