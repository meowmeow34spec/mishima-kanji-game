/**
 * Salon Mishima - Matching & Evaluation Engine
 * File: src/game/matchingEngine.ts
 */

import { ActiveOrder, MatchEvaluationResult, TaskMode } from '../types/game';
import { SoundType } from '../types/audio';

/**
 * Normalizes Japanese reading string:
 * - Strips okurigana delimiter dots ('・')
 * - Strips whitespace and dashes
 * - Trims string
 */
export function normalizeReading(reading: string): string {
  if (!reading || typeof reading !== 'string') return '';
  return reading.replace(/[・\s\-]/g, '').trim();
}

/**
 * Converts Katakana characters to Hiragana for uniform phoneme comparison.
 */
export function toHiragana(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/**
 * Determines expected compound characters for build mode orders.
 */
function getExpectedCompound(order: ActiveOrder): string {
  if (order.targetKanji && order.targetKanji.literaryCompounds && order.targetKanji.literaryCompounds.length > 0) {
    return order.targetKanji.literaryCompounds[0].compound;
  }
  return order.correctOption;
}

/**
 * Evaluates conveyor block selection against active order.
 */
export function evaluateBlockPick(
  order: ActiveOrder,
  pickedOption: string
): MatchEvaluationResult & { success: boolean } {
  const mode: TaskMode = order.mode || 'pick';

  if (mode === 'build') {
    const compound = getExpectedCompound(order);
    const slots = order.traySlots ? [...order.traySlots] : Array(compound.length).fill(null);
    const firstEmptyIndex = slots.findIndex((s) => s === null);

    if (firstEmptyIndex === -1) {
      // Tray already complete
      return {
        success: true,
        isCorrect: true,
        isOrderComplete: true,
        pickedOption,
        expectedOption: order.correctOption,
        audioCue: 'correct',
        scoreAwarded: 0,
        coinsAwarded: 0,
        nextCombo: 1,
        nextSlots: slots,
        revealKanji: order.targetKanji,
      };
    }

    const expectedChar = compound[firstEmptyIndex] || order.correctOption;
    const isCorrect = pickedOption === expectedChar;

    if (isCorrect) {
      slots[firstEmptyIndex] = pickedOption;
      const isComplete = slots.every((s) => s !== null);
      const audioCue: SoundType = isComplete ? 'fanfare' : 'clink';

      // Update the order in place so subsequent picks retain state if mutated
      if (order.traySlots) {
        order.traySlots[firstEmptyIndex] = pickedOption;
        const nextChar = compound[firstEmptyIndex + 1];
        if (nextChar) {
          order.correctOption = nextChar;
        }
      }

      return {
        success: true,
        isCorrect: true,
        isOrderComplete: isComplete,
        pickedOption,
        expectedOption: expectedChar,
        audioCue,
        scoreAwarded: isComplete ? 200 : 50,
        coinsAwarded: isComplete ? 100 : 25,
        nextCombo: 1,
        nextSlots: slots,
        revealKanji: isComplete ? order.targetKanji : undefined,
      };
    } else {
      return {
        success: false,
        isCorrect: false,
        isOrderComplete: false,
        pickedOption,
        expectedOption: expectedChar,
        audioCue: 'wrong',
        scoreAwarded: 0,
        coinsAwarded: 0,
        nextCombo: 0,
        nextSlots: slots,
        error: `Expected '${expectedChar}', picked '${pickedOption}'`,
      };
    }
  }

  // Pick or Recall mode
  const normalizedPicked = normalizeReading(toHiragana(pickedOption));
  const normalizedExpected = normalizeReading(toHiragana(order.correctOption));
  const isDirectMatch = pickedOption === order.correctOption;
  const isNormalizedMatch =
    normalizedPicked.length > 0 &&
    normalizedExpected.length > 0 &&
    normalizedPicked === normalizedExpected;

  const isCorrect = isDirectMatch || isNormalizedMatch;

  return {
    success: isCorrect,
    isCorrect,
    isOrderComplete: isCorrect,
    pickedOption,
    expectedOption: order.correctOption,
    audioCue: isCorrect ? 'correct' : 'wrong',
    scoreAwarded: isCorrect ? 100 : 0,
    coinsAwarded: isCorrect ? 50 : 0,
    nextCombo: isCorrect ? 1 : 0,
    revealKanji: isCorrect ? order.targetKanji : undefined,
    error: isCorrect ? undefined : `Option '${pickedOption}' does not match correct option '${order.correctOption}'`,
  };
}

/**
 * Evaluates placing a character block into a designated serving tray slot.
 */
export function evaluateTrayDrop(
  order: ActiveOrder,
  slotIndex: number,
  character: string
): MatchEvaluationResult & { success: boolean } {
  const compound = getExpectedCompound(order);
  const slots = order.traySlots ? [...order.traySlots] : Array(compound.length).fill(null);

  if (slotIndex < 0 || slotIndex >= compound.length) {
    return {
      success: false,
      isCorrect: false,
      isOrderComplete: false,
      pickedOption: character,
      expectedOption: '',
      audioCue: 'wrong',
      scoreAwarded: 0,
      coinsAwarded: 0,
      nextCombo: 0,
      nextSlots: slots,
      error: `Slot index ${slotIndex} out of bounds for compound length ${compound.length}`,
    };
  }

  // 1. Guard against already completed tray
  if (slots.every((s) => s !== null)) {
    return {
      success: true,
      isCorrect: true,
      isOrderComplete: true,
      pickedOption: character,
      expectedOption: compound[slotIndex] || '',
      audioCue: 'correct',
      scoreAwarded: 0,
      coinsAwarded: 0,
      nextCombo: 1,
      nextSlots: slots,
      revealKanji: order.targetKanji,
    };
  }

  // 2. Guard against out-of-order drop (skipping preceding slots)
  if (slotIndex > 0 && slots.slice(0, slotIndex).some((s) => s === null)) {
    return {
      success: false,
      isCorrect: false,
      isOrderComplete: false,
      pickedOption: character,
      expectedOption: compound[slots.findIndex((s) => s === null)] || '',
      audioCue: 'wrong',
      scoreAwarded: 0,
      coinsAwarded: 0,
      nextCombo: 0,
      nextSlots: slots,
      error: `Cannot fill slot ${slotIndex} before preceding slots are filled`,
    };
  }

  // 3. Guard against duplicate drop on already-filled slot
  if (slots[slotIndex] !== null) {
    return {
      success: false,
      isCorrect: false,
      isOrderComplete: false,
      pickedOption: character,
      expectedOption: compound[slotIndex],
      audioCue: 'wrong',
      scoreAwarded: 0,
      coinsAwarded: 0,
      nextCombo: 0,
      nextSlots: slots,
      error: `Slot ${slotIndex} is already filled with '${slots[slotIndex]}'`,
    };
  }

  const expectedChar = compound[slotIndex];
  const isCorrect = character === expectedChar;

  if (isCorrect) {
    slots[slotIndex] = character;
    if (order.traySlots) {
      order.traySlots[slotIndex] = character;
      const nextChar = compound[slotIndex + 1];
      if (nextChar) {
        order.correctOption = nextChar;
      }
    }
    const isComplete = slots.every((s) => s !== null);
    return {
      success: true,
      isCorrect: true,
      isOrderComplete: isComplete,
      pickedOption: character,
      expectedOption: expectedChar,
      audioCue: isComplete ? 'fanfare' : 'drop',
      scoreAwarded: isComplete ? 200 : 50,
      coinsAwarded: isComplete ? 100 : 25,
      nextCombo: 1,
      nextSlots: slots,
      revealKanji: isComplete ? order.targetKanji : undefined,
    };
  }

  return {
    success: false,
    isCorrect: false,
    isOrderComplete: false,
    pickedOption: character,
    expectedOption: expectedChar,
    audioCue: 'wrong',
    scoreAwarded: 0,
    coinsAwarded: 0,
    nextCombo: 0,
    nextSlots: slots,
    error: `Incorrect character '${character}' for slot ${slotIndex} (expected '${expectedChar}')`,
  };
}

/**
 * Evaluates manual keypad reading submission.
 */
export function evaluateKeypadSubmission(
  order: ActiveOrder,
  rawInput: string
): MatchEvaluationResult & { success: boolean } {
  const normalizedInput = normalizeReading(toHiragana(rawInput));
  const kanji = order.targetKanji;

  const validReadings: string[] = [];
  if (kanji && kanji.readings) {
    for (const r of kanji.readings.onyomi || []) {
      validReadings.push(normalizeReading(toHiragana(r)));
    }
    for (const r of kanji.readings.kunyomi || []) {
      validReadings.push(normalizeReading(toHiragana(r)));
    }
  }
  if (order.correctOption) {
    validReadings.push(normalizeReading(toHiragana(order.correctOption)));
  }

  const isCorrect = validReadings.includes(normalizedInput);

  return {
    success: isCorrect,
    isCorrect,
    isOrderComplete: isCorrect,
    pickedOption: rawInput,
    expectedOption: order.correctOption,
    audioCue: isCorrect ? 'correct' : 'wrong',
    scoreAwarded: isCorrect ? 150 : 0,
    coinsAwarded: isCorrect ? 75 : 0,
    nextCombo: isCorrect ? 1 : 0,
    revealKanji: isCorrect ? order.targetKanji : undefined,
    error: isCorrect ? undefined : `Input '${rawInput}' does not match readings for ${kanji?.character || 'target'}`,
  };
}

/**
 * Top-level block picking handler matching gameDriver.handleBlockPick contract.
 */
export async function handleBlockPick(
  order: ActiveOrder,
  pickedOption: string
): Promise<{ success: boolean; result?: MatchEvaluationResult }> {
  const evaluation = evaluateBlockPick(order, pickedOption);
  return {
    success: evaluation.isCorrect,
    result: evaluation,
  };
}
