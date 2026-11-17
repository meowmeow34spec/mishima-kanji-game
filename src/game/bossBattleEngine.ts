/**
 * Salon Mishima - Boss Duel Battle Engine
 * File: src/game/bossBattleEngine.ts
 */

import { BossKanjiPair, BossQuestion } from '../types/curriculum';
import { BossBattleState, BossRoundResult } from '../types/game';
import { getAllBossPairs, getBossPairById } from '../data/bossPairs';
import { SoundType } from '../types/audio';

export const DEFAULT_PLAYER_HEARTS = 3;
export const DEFAULT_BOSS_BASE_ROUND_TIME = 8.0;
export const MIN_BOSS_ROUND_TIME = 3.6;
export const BOSS_TIME_DECAY_PER_ROUND = 0.4;

export type { BossBattleState, BossRoundResult };

/**
 * Returns a shallow copy of a boss quiz question with randomized option order
 * so the correct choice is not pinned to index 0 on every round.
 */
export function withShuffledBossOptions(question: BossQuestion): BossQuestion {
  if (!question || !Array.isArray(question.options) || question.options.length <= 1) {
    return question;
  }
  const shuffled = [...question.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    ...question,
    options: shuffled,
  };
}

/**
 * Resolves a single round in a boss duel.
 * - Correct answer decrements Boss HP by 1.
 * - Incorrect answer decrements Player hearts by 1.
 * Satisfies driver.resolveBossRound(currentBossHp, currentHearts, isCorrect).
 */
export function resolveBossRound(
  currentBossHp: number,
  currentHearts: number,
  isCorrect: boolean
): BossRoundResult {
  const newBossHp = isCorrect ? Math.max(0, currentBossHp - 1) : currentBossHp;
  const newHearts = isCorrect ? currentHearts : Math.max(0, currentHearts - 1);
  const isDefeated = newBossHp <= 0;
  const isPlayerDefeated = newHearts <= 0;

  return {
    bossHp: newBossHp,
    hearts: newHearts,
    isDefeated,
    isPlayerDefeated,
  };
}

/**
 * Calculates accelerating round timer for boss questions.
 * Decrements by decayStep (0.4s) per round down to minTime (3.6s).
 */
export function calculateBossRoundTime(
  baseTime: number = DEFAULT_BOSS_BASE_ROUND_TIME,
  roundIndex: number = 0,
  minTime: number = MIN_BOSS_ROUND_TIME,
  decayStep: number = BOSS_TIME_DECAY_PER_ROUND
): number {
  const time = baseTime - roundIndex * decayStep;
  return Math.max(minTime, Math.round(time * 10) / 10);
}

/**
 * Initializes a new boss duel battle state.
 */
export function initBossBattle(
  pairOrId?: BossKanjiPair | string
): BossBattleState {
  let pair: BossKanjiPair | undefined;

  if (typeof pairOrId === 'object' && pairOrId !== null) {
    pair = pairOrId;
  } else if (typeof pairOrId === 'string') {
    pair = getBossPairById(pairOrId);
  }

  if (!pair) {
    const allPairs = getAllBossPairs();
    pair = allPairs[0];
  }

  const initialHp = pair?.bossHp || 10;
  const initialTime = pair?.timeLimitSeconds || DEFAULT_BOSS_BASE_ROUND_TIME;
  const baseQuestion = pair?.questions?.[0] || {
    id: 'fallback-q0',
    type: 'glyph_to_sound' as const,
    prompt: `${pair?.characterA} vs ${pair?.characterB}`,
    targetCharacter: pair?.characterA || '寺',
    options: [],
    correctAnswer: pair?.characterA || '寺',
    explanation: 'Confusing kanji distinction',
  };
  const currentQuestion = withShuffledBossOptions(baseQuestion);

  return {
    bossPair: pair,
    currentQuestionIndex: 0,
    currentQuestion,
    bossHp: initialHp,
    maxBossHp: initialHp,
    playerHearts: DEFAULT_PLAYER_HEARTS,
    maxHearts: DEFAULT_PLAYER_HEARTS,
    timeLeft: initialTime,
    isDefeated: false,
    isPlayerDefeated: false,
    isActive: true,
  };
}

/**
 * Submits player answer for current boss question, evaluating HP/hearts and sound cues.
 */
export function submitBossAnswer(
  state: BossBattleState,
  selectedAnswer: string
): {
  newState: BossBattleState;
  result: BossRoundResult;
  isCorrect: boolean;
  audioCue: SoundType;
} {
  const currentQ = state.currentQuestion;
  const isCorrect = selectedAnswer === currentQ.correctAnswer;
  const result = resolveBossRound(state.bossHp, state.playerHearts, isCorrect);

  let audioCue: SoundType = 'wrong';
  if (isCorrect) {
    audioCue = result.isDefeated ? 'fanfare' : 'bossHit';
  } else {
    audioCue = result.isPlayerDefeated ? 'hurt' : 'wrong';
  }

  const nextIndex = (state.currentQuestionIndex + 1) % (state.bossPair.questions.length || 1);
  const nextQuestion = withShuffledBossOptions(
    state.bossPair.questions[nextIndex] || state.currentQuestion
  );
  const nextTime = calculateBossRoundTime(
    state.bossPair.timeLimitSeconds || DEFAULT_BOSS_BASE_ROUND_TIME,
    nextIndex
  );

  const newState: BossBattleState = {
    ...state,
    bossHp: result.bossHp,
    playerHearts: result.hearts,
    isDefeated: result.isDefeated,
    isPlayerDefeated: result.isPlayerDefeated,
    isActive: !result.isDefeated && !result.isPlayerDefeated,
    currentQuestionIndex: nextIndex,
    currentQuestion: nextQuestion,
    timeLeft: nextTime,
  };

  return {
    newState,
    result,
    isCorrect,
    audioCue,
  };
}
