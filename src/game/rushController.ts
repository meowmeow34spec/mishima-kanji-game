/**
 * Salon Mishima - Rush Mode Controller
 * File: src/game/rushController.ts
 */

import { MishimaKanjiEntry } from '../types/curriculum';
import { RushSessionConfig, RushSessionState, RushPrompt } from '../types/game';
import { getAllKanji } from '../data/mishimaCurriculum';
import { getKoreanGloss } from '../data/koreanGlossary';
import * as KoreanMnemonicsMod from '../data/koreanMnemonics';
import { getDistractors } from '../srs/leitnerEngine';

export const DEFAULT_RUSH_DURATION_SECONDS = 25.0;
export const DEFAULT_MISTAKE_PENALTY_SECONDS = 1.5;
export const DEFAULT_RUSH_COIN_REWARD = 15;

export type { RushSessionConfig, RushSessionState, RushPrompt };

function lookupMnemonic(charOrId: string): KoreanMnemonicsMod.KoreanMnemonicEntry | undefined {
  const mod = KoreanMnemonicsMod as Record<string, any>;
  if (typeof mod.getKoreanMnemonic === 'function') {
    return mod.getKoreanMnemonic(charOrId);
  }
  if (Array.isArray(mod.KOREAN_MNEMONIC_LIST)) {
    return mod.KOREAN_MNEMONIC_LIST.find(
      (entry: any) => entry.character === charOrId || entry.id === charOrId
    );
  }
  return undefined;
}

/**
 * Decrements the rush countdown timer by deltaSeconds, clamped strictly to >= 0.0s.
 */
export function tickRushTimer(
  currentTime: number,
  deltaSeconds: number = 1.0
): number {
  const remaining = currentTime - deltaSeconds;
  return remaining <= 0 ? 0.0 : Math.round(remaining * 100) / 100;
}

/**
 * Applies mistake penalty (default -1.5s), strictly clamping underflow to 0.0s.
 */
export function applyRushPenalty(
  currentTime: number,
  penalty: number = DEFAULT_MISTAKE_PENALTY_SECONDS
): number {
  const remaining = currentTime - penalty;
  return remaining <= 0 ? 0.0 : Math.round(remaining * 100) / 100;
}

/**
 * Initializes a new rush session state.
 */
export function startRushSession(
  initialTime: number = DEFAULT_RUSH_DURATION_SECONDS
): RushSessionState {
  return {
    initialTime,
    timeLeft: initialTime,
    hits: 0,
    misses: 0,
    earnedCoins: 0,
    isActive: initialTime > 0,
    combo: 0,
    maxCombo: 0,
  };
}

/**
 * Records a hit or mistake in an active rush session and updates timer and rewards.
 */
export function recordRushHit(
  session: RushSessionState,
  isCorrect: boolean,
  timeDeducted: number = 0,
  coinReward: number = DEFAULT_RUSH_COIN_REWARD
): RushSessionState {
  if (!session.isActive) return session;

  let newTimeLeft = session.timeLeft - timeDeducted;
  if (!isCorrect) {
    newTimeLeft -= DEFAULT_MISTAKE_PENALTY_SECONDS;
  }
  newTimeLeft = newTimeLeft <= 0 ? 0.0 : Math.round(newTimeLeft * 100) / 100;

  const currentCombo = session.combo || 0;
  const currentMaxCombo = session.maxCombo || 0;
  const newCombo = isCorrect ? currentCombo + 1 : 0;
  const newMaxCombo = Math.max(currentMaxCombo, newCombo);

  return {
    ...session,
    timeLeft: newTimeLeft,
    hits: isCorrect ? session.hits + 1 : session.hits,
    misses: isCorrect ? session.misses : session.misses + 1,
    earnedCoins: session.earnedCoins + (isCorrect ? coinReward : 0),
    isActive: newTimeLeft > 0,
    combo: newCombo,
    maxCombo: newMaxCombo,
  };
}

/**
 * Executes or simulates a complete rush session.
 */
export async function runRushSession(
  config: RushSessionConfig
): Promise<RushSessionState> {
  const initialTime = config.initialTime ?? DEFAULT_RUSH_DURATION_SECONDS;
  const step = config.secondsPerHit ?? 1.0;
  const reward = config.coinRewardPerHit ?? DEFAULT_RUSH_COIN_REWARD;

  let session = startRushSession(initialTime);
  for (let r = 0; r < config.correctHits; r++) {
    session = recordRushHit(session, true, step, reward);
  }

  return session;
}

/**
 * Generates a rapid-fire Korean-first rush prompt for quick 3D block picking.
 */
export function generateRushPrompt(
  kanji: MishimaKanjiEntry,
  customDistractors?: string[]
): RushPrompt {
  const correctOption = kanji.character;
  const allKanji = getAllKanji();

  let distractors: string[] = [];
  if (customDistractors && customDistractors.length >= 3) {
    distractors = customDistractors.filter((c) => c !== correctOption).slice(0, 3);
  } else {
    distractors = getDistractors(kanji, allKanji, 3)
      .map((k) => k.character)
      .filter((c) => c !== correctOption)
      .slice(0, 3);
  }

  const options = [correctOption, ...distractors].slice(0, 4);
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const baseMeaning = kanji.meanings?.[0] || (kanji as any).meaning || '';
  const mne = lookupMnemonic(kanji.character) || lookupMnemonic(kanji.id);
  const koGloss = getKoreanGloss(kanji.character);

  const huneum = mne?.huneum || koGloss?.huneum || '';
  const meaningKo = mne?.meaningKo || koGloss?.meaningKo || baseMeaning;
  const primaryOnyomi = kanji.readings?.onyomi?.[0] || '';

  const promptText = huneum
    ? `${huneum} (${meaningKo})${primaryOnyomi ? ` · 음독 ${primaryOnyomi}` : ''}`
    : meaningKo;

  const hintKo = mne
    ? `${mne.visualPictogram} ${mne.radicalBreakdown}`
    : huneum || undefined;

  return {
    id: `rush-prompt-${kanji.id}-${Date.now()}`,
    kanji,
    promptText,
    options,
    correctOption,
    huneumKo: huneum || undefined,
    hintKo,
  };
}
