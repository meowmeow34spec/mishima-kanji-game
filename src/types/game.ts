/**
 * Salon Mishima - Core Game Engine Types & State Machine Interfaces
 * File: src/types/game.ts
 */

import {
  MishimaKanjiEntry,
  CurriculumTierNumber,
  BossKanjiPair,
  BossQuestion,
} from './curriculum';
import { PlayerProfile } from './srs';
import { SoundType } from './audio';
import type {
  CafeUpgradeId,
  CustomerAnimState,
  ParticleBurstEvent,
} from './three3d';

export type GameMode =
  | 'title'
  | 'map'
  | 'lesson'
  | 'boss'
  | 'rush'
  | 'codex'
  | 'review'
  | 'shop';

export type TaskMode = 'pick' | 'recall' | 'build';

export interface CustomerOrder {
  id: string;
  customerId?: string;
  customerName: string;
  customerNameKo?: string;
  customerAvatar: string;
  dialogue: string;
  dialogueJa?: string;
  happyReactionKo?: string;
  angryReactionKo?: string;
  targetKanji: MishimaKanjiEntry;
  mode: TaskMode;
  traySlots?: (string | null)[];
  prompt: string;
  options: string[];
  correctOption: string;
  /** True when the target kanji has box === 0 (unseen first exposure) */
  isNewKanji?: boolean;
  /** Current Leitner box (0..6) of the target kanji */
  srsBox?: number;
  /** Concise Korean visual/radical/sound association cue for effortless first-sight learning */
  hintSummaryKo?: string;
  huneumKo?: string;
  meaningKo?: string;
  soundTipKo?: string;
  radicalBreakdownKo?: string;
  visualPictogram?: string;
}

export type ActiveOrder = CustomerOrder;

export interface ServingTraySlot {
  index: number;
  expectedCharacter: string;
  placedCharacter: string | null;
  isCorrect: boolean;
}

export interface MatchEvaluationResult {
  success: boolean;
  isCorrect: boolean;
  isOrderComplete: boolean;
  pickedOption: string;
  expectedOption: string;
  audioCue: SoundType;
  scoreAwarded: number;
  coinsAwarded: number;
  nextCombo: number;
  nextSlots?: (string | null)[];
  revealKanji?: MishimaKanjiEntry;
  error?: string;
}

export interface MatchingResult {
  success: boolean;
  isComplete: boolean;
  pickedOption: string;
  correctOption: string;
  scoreAwarded: number;
  coinsAwarded: number;
  currentCombo: number;
  error?: string;
  revealKanji?: MishimaKanjiEntry;
  audioCue?: SoundType | string;
  nextSlots?: (string | null)[];
  shieldUsed?: boolean;
  speedTipCoins?: number;
  tipLabelKo?: string | null;
}

export interface ComboState {
  combo: number;
  maxCombo: number;
  multiplier: number;
  lastAward: number;
}

export interface RushSessionConfig {
  initialTime?: number;
  correctHits: number;
  secondsPerHit?: number;
  coinRewardPerHit?: number;
}

export interface RushSessionState {
  initialTime: number;
  timeLeft: number;
  hits: number;
  misses: number;
  earnedCoins: number;
  isActive: boolean;
  combo?: number;
  maxCombo?: number;
}

export type RushState = RushSessionState;

export interface RushPrompt {
  id: string;
  kanji: MishimaKanjiEntry;
  promptText: string;
  options: string[];
  correctOption: string;
  huneumKo?: string;
  hintKo?: string;
}

export interface BossRoundResult {
  bossHp: number;
  hearts: number;
  isDefeated: boolean;
  isPlayerDefeated: boolean;
}

export interface BossBattleState {
  bossPair: BossKanjiPair;
  currentQuestionIndex: number;
  currentQuestion: BossQuestion;
  bossHp: number;
  maxBossHp: number;
  playerHearts: number;
  maxHearts: number;
  timeLeft: number;
  isDefeated: boolean;
  isPlayerDefeated: boolean;
  isActive: boolean;
}

export interface GameState {
  mode: GameMode;
  activeOrder: ActiveOrder | null;
  score: number;
  coins: number;
  combo: number;
  hearts: number;
  maxHearts?: number;
  timeLeft: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
  currentTier: CurriculumTierNumber;
  currentStageId: string | null;
  stageOrderIndex: number;
  stageTotalOrders: number;
  rushState: RushState | null;
  bossState: BossBattleState | null;
  traySlots: (string | null)[];
  revealKanji: MishimaKanjiEntry | null;
  profile: PlayerProfile | null;
  /** Customer patience countdown timer (seconds remaining) */
  patienceSeconds?: number;
  /** Maximum customer patience seconds for current stage (20s base, +5s with 'velvet') */
  maxPatienceSeconds?: number;
  /** True when combo >= feverComboThreshold (5 base, 4 with 'gramophone') */
  feverActive?: boolean;
  /** Combo threshold required for Fever Time */
  feverThreshold?: number;
  /** Remaining free mistake shields in current stage (1 with 'kinkaku', 0 otherwise) */
  shieldRemaining?: number;
  /** Unlocked 3D cafe interior upgrade IDs synced from profile */
  unlockedUpgrades?: CafeUpgradeId[];
  /** Latest Korean feedback / tip toast message (e.g. '⚡ 빠른 서빙 팁!', '🏯 봉황 수호 발동!') */
  lastFeedbackKo?: string | null;
  /** Latest 3D customer animation cue */
  customerAnim?: CustomerAnimState;
  /** Latest 3D particle burst trigger */
  particleEvent?: ParticleBurstEvent | null;
}

export type GameAction =
  | { type: 'START_SHIFT' }
  | { type: 'QUICK_PLAY'; payload?: { tier?: CurriculumTierNumber; stageId?: string } }
  | { type: 'SELECT_STAGE'; payload: { tier: CurriculumTierNumber; stageId: string } }
  | { type: 'SET_ORDER'; payload: ActiveOrder }
  | { type: 'PICK_BLOCK'; payload: { option: string } }
  | { type: 'PLACE_TRAY_SLOT'; payload: { slotIndex: number; character: string } }
  | { type: 'CLEAR_TRAY' }
  | { type: 'TICK_PATIENCE'; payload?: { deltaSeconds?: number } }
  | { type: 'DISMISS_REVEAL' }
  | { type: 'START_RUSH'; payload?: { initialTime?: number } }
  | { type: 'TICK_RUSH'; payload?: { deltaSeconds?: number } }
  | { type: 'RUSH_ANSWER'; payload: { isCorrect: boolean; coinReward?: number } }
  | { type: 'END_RUSH' }
  | { type: 'START_BOSS'; payload: { bossPairId?: string; tier?: CurriculumTierNumber } }
  | { type: 'ANSWER_BOSS'; payload: { answer: string } }
  | { type: 'TICK_BOSS'; payload?: { deltaSeconds?: number } }
  | { type: 'OPEN_CODEX' }
  | { type: 'CLOSE_CODEX' }
  | { type: 'OPEN_REVIEW' }
  | { type: 'CLOSE_REVIEW' }
  | { type: 'OPEN_SHOP' }
  | { type: 'CLOSE_SHOP' }
  | { type: 'PURCHASE_UPGRADE'; payload: { upgradeId: CafeUpgradeId | string } }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'RETURN_TO_TITLE' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<PlayerProfile> };
