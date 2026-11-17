/**
 * Salon Mishima - Progressive Combo & Scoring Engine
 * File: src/game/comboCalculator.ts
 */

export const DEFAULT_BASE_COIN_AWARD = 50;
export const DEFAULT_COMBO_MULTIPLIER = 10;
export const MAX_COMBO_MULTIPLIER_STEPS = 10;

/**
 * Calculates progressive coin reward based on combo streak.
 * Formula: baseAward + Math.min(combo - 1, 10) * multiplier
 * Returns 0 if combo <= 0 (mistake reset).
 */
export function calculateComboReward(
  combo: number,
  baseAward: number = DEFAULT_BASE_COIN_AWARD,
  multiplier: number = DEFAULT_COMBO_MULTIPLIER
): number {
  if (combo <= 0 || !Number.isFinite(combo)) {
    return 0;
  }
  const bonusSteps = Math.min(
    Math.max(0, Math.floor(combo - 1)),
    MAX_COMBO_MULTIPLIER_STEPS
  );
  return baseAward + bonusSteps * multiplier;
}

/**
 * Checks if current combo reached a fanfare milestone (3, 5, 10, 15, 20, 25...).
 */
export function isComboMilestone(combo: number): boolean {
  if (combo < 3) return false;
  if (combo === 3 || combo === 5) return true;
  return combo >= 10 && combo % 5 === 0;
}

/**
 * Computes next combo value based on correctness.
 */
export function getNextCombo(currentCombo: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  return Math.max(0, currentCombo) + 1;
}

/**
 * Returns celebratory fanfare tier for UI animations.
 */
export function getComboFanfareTier(
  combo: number
): 'bronze' | 'silver' | 'gold' | 'platinum' | null {
  if (combo >= 20) return 'platinum';
  if (combo >= 10) return 'gold';
  if (combo >= 5) return 'silver';
  if (combo >= 3) return 'bronze';
  return null;
}
