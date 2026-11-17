/**
 * Salon Mishima - Master Game State Machine & Coordinator
 * File: src/game/gameEngine.ts
 */

import {
  GameMode,
  TaskMode,
  ActiveOrder,
  ServingTraySlot,
  MatchingResult,
  MatchEvaluationResult,
  ComboState,
  RushSessionConfig,
  RushSessionState,
  RushState,
  RushPrompt,
  BossRoundResult,
  BossBattleState,
  GameState,
  GameAction,
} from '../types/game';
import {
  MishimaKanjiEntry,
  CurriculumTierNumber,
  BossKanjiPair,
} from '../types/curriculum';
import { PlayerProfile, ConfusionMatrix } from '../types/srs';
import { SoundType, BgmMode } from '../types/audio';

// Mechanics Modules Imports
import {
  calculateComboReward,
  isComboMilestone,
  getNextCombo,
  getComboFanfareTier,
} from './comboCalculator';
import {
  normalizeReading,
  toHiragana,
  evaluateBlockPick,
  evaluateTrayDrop,
  evaluateKeypadSubmission,
  handleBlockPick as matchingHandleBlockPick,
} from './matchingEngine';
import { generateOrder, SALON_CUSTOMERS } from './orderGenerator';
import {
  tickRushTimer,
  applyRushPenalty,
  startRushSession,
  recordRushHit,
  runRushSession,
  generateRushPrompt,
} from './rushController';
import {
  resolveBossRound,
  calculateBossRoundTime,
  initBossBattle,
  submitBossAnswer,
  withShuffledBossOptions,
} from './bossBattleEngine';

// Subsystem Integrations
import { playSound, startBgm, stopBgm, unlockAudio } from '../audio/soundSynthesizer';
import { speakKanji, cancelSpeech } from '../audio/speechSynthesizer';
import {
  loadProfile,
  saveProfile,
  recordReviewResult,
} from '../srs/storageManager';
import { getKanjiByTier, getAllKanji } from '../data/mishimaCurriculum';
import { getAllBossPairs } from '../data/bossPairs';

// ---------------------------------------------------------------------------
// Standalone Public Driver Exports
// ---------------------------------------------------------------------------

export {
  calculateComboReward,
  isComboMilestone,
  getNextCombo,
  getComboFanfareTier,
  normalizeReading,
  toHiragana,
  evaluateBlockPick,
  evaluateTrayDrop,
  evaluateKeypadSubmission,
  generateOrder,
  SALON_CUSTOMERS,
  tickRushTimer,
  applyRushPenalty,
  startRushSession,
  recordRushHit,
  runRushSession,
  generateRushPrompt,
  resolveBossRound,
  calculateBossRoundTime,
  initBossBattle,
  submitBossAnswer,
  cancelSpeech,
};

export type {
  GameMode,
  TaskMode,
  ActiveOrder,
  ServingTraySlot,
  MatchingResult,
  MatchEvaluationResult,
  ComboState,
  RushSessionConfig,
  RushSessionState,
  RushState,
  RushPrompt,
  BossRoundResult,
  BossBattleState,
  GameState,
  GameAction,
  MishimaKanjiEntry,
  CurriculumTierNumber,
  BossKanjiPair,
  PlayerProfile,
  ConfusionMatrix,
  SoundType,
  BgmMode,
};

/**
 * Validates a block pick against the active order.
 * Satisfies driver.handleBlockPick(order, pickedOption).
 */
export async function handleBlockPick(
  order: ActiveOrder,
  pickedOption: string
): Promise<{ success: boolean; result?: MatchEvaluationResult }> {
  return matchingHandleBlockPick(order, pickedOption);
}

// ---------------------------------------------------------------------------
// Initial Default Game State
// ---------------------------------------------------------------------------

function createInitialGameState(): GameState {
  let profile: PlayerProfile | null = null;
  try {
    profile = loadProfile();
  } catch {
    profile = null;
  }

  return {
    mode: 'title',
    activeOrder: null,
    score: 0,
    coins: profile?.coins || 0,
    combo: 0,
    hearts: 3,
    timeLeft: 25.0,
    isGameOver: false,
    isLevelComplete: false,
    currentTier: 1,
    currentStageId: null,
    stageOrderIndex: 0,
    stageTotalOrders: 6,
    rushState: null,
    bossState: null,
    traySlots: [],
    revealKanji: null,
    profile,
  };
}

// ---------------------------------------------------------------------------
// GameEngine Master Coordinator Class
// ---------------------------------------------------------------------------

export class GameEngine {
  private state: GameState;
  private stateSnapshot: GameState;
  private listeners: Set<(state: GameState) => void> = new Set();
  private stageRequestToken: number = 0;

  constructor(initialState?: Partial<GameState>) {
    this.state = {
      ...createInitialGameState(),
      ...initialState,
    };
    this.stateSnapshot = { ...this.state };
  }

  public getState = (): GameState => {
    return this.stateSnapshot;
  };

  public subscribe = (listener: (state: GameState) => void): (() => void) => {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    this.stateSnapshot = { ...this.state };
    const currentState = this.stateSnapshot;
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch {
        // Guard against subscriber errors
      }
    });
  }

  public dispatch(action: GameAction): void {
    switch (action.type) {
      case 'START_SHIFT':
        this.startShift();
        break;
      case 'SELECT_STAGE':
        this.selectStage(action.payload.tier, action.payload.stageId);
        break;
      case 'SET_ORDER':
        this.state.activeOrder = {
          ...action.payload,
          traySlots: action.payload.traySlots ? [...action.payload.traySlots] : undefined,
        };
        this.state.traySlots = action.payload.traySlots ? [...action.payload.traySlots] : [];
        this.notify();
        break;
      case 'PICK_BLOCK':
        this.pickOption(action.payload.option);
        break;
      case 'PLACE_TRAY_SLOT':
        this.placeTraySlot(action.payload.slotIndex, action.payload.character);
        break;
      case 'CLEAR_TRAY':
        if (this.state.activeOrder?.traySlots) {
          const targetCompound =
            this.state.activeOrder.targetKanji?.literaryCompounds?.[0]?.compound || '';
          const resetCorrectOption =
            targetCompound[0] ||
            this.state.activeOrder.targetKanji?.character ||
            this.state.activeOrder.correctOption;
          const clearedSlots = this.state.activeOrder.traySlots.map(() => null);
          this.state.activeOrder = {
            ...this.state.activeOrder,
            traySlots: clearedSlots,
            correctOption: resetCorrectOption,
          };
          this.state.traySlots = [...clearedSlots];
          this.notify();
        }
        break;
      case 'DISMISS_REVEAL':
        this.dismissWordReveal();
        break;
      case 'START_RUSH':
        this.startRush(action.payload?.initialTime);
        break;
      case 'TICK_RUSH':
        this.tickRush(action.payload?.deltaSeconds);
        break;
      case 'RUSH_ANSWER':
        this.handleRushAnswer(action.payload.isCorrect, action.payload.coinReward);
        break;
      case 'END_RUSH':
        this.endRush();
        break;
      case 'START_BOSS':
        this.startBoss(action.payload.bossPairId, action.payload.tier);
        break;
      case 'ANSWER_BOSS':
        this.handleBossAnswer(action.payload.answer);
        break;
      case 'TICK_BOSS':
        this.tickBoss(action.payload?.deltaSeconds);
        break;
      case 'OPEN_CODEX':
        this.openCodex();
        break;
      case 'CLOSE_CODEX':
        this.closeCodex();
        break;
      case 'OPEN_REVIEW':
        this.openReview();
        break;
      case 'CLOSE_REVIEW':
        this.closeReview();
        break;
      case 'RETURN_TO_MAP':
        this.returnToMap();
        break;
      case 'RETURN_TO_TITLE':
        this.returnToTitle();
        break;
      case 'UPDATE_PROFILE':
        if (this.state.profile) {
          this.state.profile = { ...this.state.profile, ...action.payload };
          if (typeof action.payload.coins === 'number') {
            this.state.coins = action.payload.coins;
          }
          saveProfile(this.state.profile);
          this.notify();
        }
        break;
    }
  }

  // -------------------------------------------------------------------------
  // High-Level Orchestration Flow Methods
  // -------------------------------------------------------------------------

  private getStageOffset(stageId: string | null): number {
    if (!stageId) return 0;
    const match = stageId.match(/stage-\d+-(\d+)/);
    if (!match) return 0;
    const stageNum = Math.max(1, parseInt(match[1], 10));
    return (stageNum - 1) * 5;
  }

  private syncProfileCoins(): void {
    if (this.state.profile) {
      this.state.profile = {
        ...this.state.profile,
        coins: this.state.coins,
      };
      saveProfile(this.state.profile);
    }
  }

  public startShift(): void {
    this.stageRequestToken++;
    this.state.mode = 'map';
    this.state.isGameOver = false;
    this.state.isLevelComplete = false;
    this.state.bossState = null;
    try {
      unlockAudio().catch(() => {});
      startBgm('salon');
      playSound('bell');
    } catch {
      // Audio fallback
    }
    this.notify();
  }

  public async selectStage(
    tier: CurriculumTierNumber,
    stageId: string
  ): Promise<void> {
    if (stageId.includes('boss')) {
      this.state.currentTier = tier;
      this.state.currentStageId = stageId;
      this.state.score = 0;
      if (stageId === 'stage-special-boss') {
        this.startBoss('boss-08-mishima-grand', 4);
      } else if (stageId.endsWith('-boss-2')) {
        const tierBosses = getAllBossPairs().filter((p) => p.tier === tier);
        this.startBoss(tierBosses[1]?.id || tierBosses[0]?.id, tier);
      } else {
        const tierBosses = getAllBossPairs().filter((p) => p.tier === tier);
        this.startBoss(tierBosses[0]?.id, tier);
      }
      return;
    }

    const token = ++this.stageRequestToken;
    this.state.currentTier = tier;
    this.state.currentStageId = stageId;
    this.state.mode = 'lesson';
    this.state.score = 0;
    this.state.combo = 0;
    this.state.hearts = 3;
    this.state.stageOrderIndex = 0;
    this.state.isGameOver = false;
    this.state.isLevelComplete = false;
    this.state.revealKanji = null;
    this.state.bossState = null;
    this.state.activeOrder = null;
    this.state.traySlots = [];

    try {
      unlockAudio().catch(() => {});
      startBgm('salon');
      playSound('bell');
    } catch {
      // Audio fallback
    }

    const tierKanji = getKanjiByTier(tier);
    const offset = this.getStageOffset(stageId);
    const targetKanji =
      tierKanji[offset % Math.max(1, tierKanji.length)] ||
      tierKanji[0] ||
      getAllKanji()[0];
    if (targetKanji) {
      const order = await generateOrder(
        targetKanji,
        'pick',
        undefined,
        this.state.profile?.confusion || {}
      );
      if (token !== this.stageRequestToken || this.state.mode !== 'lesson') {
        return;
      }
      this.state.activeOrder = {
        ...order,
        traySlots: order.traySlots ? [...order.traySlots] : undefined,
      };
      this.state.traySlots = order.traySlots ? [...order.traySlots] : [];
    }

    this.notify();
  }

  public async selectTierStage(
    tierNumber: number,
    stageId?: string
  ): Promise<void> {
    const validTier = (tierNumber >= 1 && tierNumber <= 4 ? tierNumber : 1) as CurriculumTierNumber;
    return this.selectStage(validTier, stageId || `stage-${tierNumber}-1`);
  }

  public async handleBlockPick(
    order: ActiveOrder,
    pickedOption: string
  ): Promise<{ success: boolean; result?: MatchEvaluationResult }> {
    return handleBlockPick(order, pickedOption);
  }

  public async pickOption(option: string): Promise<MatchingResult> {
    if (
      !this.state.activeOrder ||
      this.state.revealKanji !== null ||
      this.state.isGameOver ||
      this.state.isLevelComplete
    ) {
      return {
        success: false,
        isComplete: false,
        pickedOption: option,
        correctOption: '',
        scoreAwarded: 0,
        coinsAwarded: 0,
        currentCombo: this.state.combo,
        error: !this.state.activeOrder ? 'No active order' : 'Order input locked',
      };
    }

    const order: ActiveOrder = {
      ...this.state.activeOrder,
      traySlots: this.state.activeOrder.traySlots
        ? [...this.state.activeOrder.traySlots]
        : undefined,
    };
    this.state.activeOrder = order;

    const evalResult = evaluateBlockPick(order, option);
    if (evalResult.nextSlots) {
      this.state.traySlots = [...evalResult.nextSlots];
    } else {
      this.state.traySlots = [...this.state.traySlots];
    }

    if (evalResult.isCorrect) {
      this.state.combo++;
      const reward = calculateComboReward(this.state.combo, 50, 10);
      this.state.coins += reward;
      this.state.score += evalResult.scoreAwarded;

      try {
        if (isComboMilestone(this.state.combo)) {
          playSound('fanfare');
        } else {
          playSound(evalResult.audioCue || 'correct');
        }
        if (evalResult.isOrderComplete) {
          const speechText =
            order.targetKanji?.literaryCompounds?.[0]?.reading ||
            order.targetKanji?.readings?.kunyomi?.[0] ||
            order.targetKanji?.character ||
            '';
          if (speechText) {
            speakKanji(normalizeReading(toHiragana(speechText)));
          }
        }
      } catch {
        // Audio/Speech fallback
      }

      try {
        if (order.targetKanji && evalResult.isOrderComplete) {
          const updated = recordReviewResult(order.targetKanji.id, true);
          updated.coins = this.state.coins;
          saveProfile(updated);
          this.state.profile = updated;
        } else {
          this.syncProfileCoins();
        }
      } catch {
        // Storage fallback
      }

      if (evalResult.isOrderComplete) {
        this.state.revealKanji = evalResult.revealKanji || order.targetKanji;
        this.state.stageOrderIndex++;
        if (this.state.stageOrderIndex >= this.state.stageTotalOrders) {
          this.state.isLevelComplete = true;
        }
      }

      this.notify();

      return {
        success: true,
        isComplete: evalResult.isOrderComplete,
        pickedOption: option,
        correctOption: order.correctOption,
        scoreAwarded: evalResult.scoreAwarded,
        coinsAwarded: reward,
        currentCombo: this.state.combo,
        revealKanji: this.state.revealKanji || undefined,
        audioCue: evalResult.audioCue,
      };
    } else {
      // Mistake
      this.state.combo = 0;
      this.state.hearts = Math.max(0, this.state.hearts - 1);
      if (this.state.hearts <= 0) {
        this.state.isGameOver = true;
      }

      try {
        playSound('wrong');
      } catch {
        // Audio fallback
      }

      try {
        if (order.targetKanji) {
          const updated = recordReviewResult(order.targetKanji.id, false, option);
          updated.coins = this.state.coins;
          saveProfile(updated);
          this.state.profile = updated;
        }
      } catch {
        // Storage fallback
      }

      this.notify();

      return {
        success: false,
        isComplete: false,
        pickedOption: option,
        correctOption: order.correctOption,
        scoreAwarded: 0,
        coinsAwarded: 0,
        currentCombo: 0,
        error: evalResult.error,
        audioCue: 'wrong',
      };
    }
  }

  public async placeTraySlot(
    slotIndex: number,
    character: string
  ): Promise<MatchingResult> {
    if (
      !this.state.activeOrder ||
      this.state.revealKanji !== null ||
      this.state.isGameOver ||
      this.state.isLevelComplete
    ) {
      return {
        success: false,
        isComplete: false,
        pickedOption: character,
        correctOption: '',
        scoreAwarded: 0,
        coinsAwarded: 0,
        currentCombo: this.state.combo,
        error: !this.state.activeOrder ? 'No active order' : 'Order input locked',
      };
    }

    const order: ActiveOrder = {
      ...this.state.activeOrder,
      traySlots: this.state.activeOrder.traySlots
        ? [...this.state.activeOrder.traySlots]
        : undefined,
    };
    this.state.activeOrder = order;

    const evalResult = evaluateTrayDrop(order, slotIndex, character);
    this.state.traySlots = evalResult.nextSlots
      ? [...evalResult.nextSlots]
      : [...this.state.traySlots];

    if (evalResult.isCorrect) {
      if (evalResult.scoreAwarded > 0) {
        this.state.combo++;
        this.state.score += evalResult.scoreAwarded;
        this.state.coins += evalResult.coinsAwarded;
      }

      try {
        playSound(evalResult.audioCue || 'drop');
        if (evalResult.isOrderComplete) {
          const compReading = order.targetKanji?.literaryCompounds?.[0]?.reading;
          if (compReading) {
            speakKanji(normalizeReading(toHiragana(compReading)));
          }
        }
      } catch {
        // Audio fallback
      }

      if (evalResult.isOrderComplete && !this.state.revealKanji) {
        try {
          if (order.targetKanji) {
            const updated = recordReviewResult(order.targetKanji.id, true);
            updated.coins = this.state.coins;
            saveProfile(updated);
            this.state.profile = updated;
          }
        } catch {
          // Storage fallback
        }
        this.state.revealKanji = evalResult.revealKanji || order.targetKanji;
        this.state.stageOrderIndex++;
        if (this.state.stageOrderIndex >= this.state.stageTotalOrders) {
          this.state.isLevelComplete = true;
        }
      }

      this.notify();
      return {
        success: true,
        isComplete: evalResult.isOrderComplete,
        pickedOption: character,
        correctOption: evalResult.expectedOption,
        scoreAwarded: evalResult.scoreAwarded,
        coinsAwarded: evalResult.coinsAwarded,
        currentCombo: this.state.combo,
        revealKanji: evalResult.revealKanji,
        audioCue: evalResult.audioCue,
      };
    } else {
      this.state.combo = 0;
      this.state.hearts = Math.max(0, this.state.hearts - 1);
      if (this.state.hearts <= 0) {
        this.state.isGameOver = true;
      }

      try {
        playSound('wrong');
      } catch {
        // Audio fallback
      }

      try {
        if (order.targetKanji) {
          const updated = recordReviewResult(order.targetKanji.id, false, character);
          updated.coins = this.state.coins;
          saveProfile(updated);
          this.state.profile = updated;
        }
      } catch {
        // Storage fallback
      }

      this.notify();
      return {
        success: false,
        isComplete: false,
        pickedOption: character,
        correctOption: evalResult.expectedOption,
        scoreAwarded: 0,
        coinsAwarded: 0,
        currentCombo: 0,
        error: evalResult.error,
        audioCue: 'wrong',
      };
    }
  }

  public async dismissWordReveal(): Promise<void> {
    this.state.revealKanji = null;

    if (this.state.isLevelComplete) {
      if (this.state.profile && this.state.currentStageId) {
        const completed = [...this.state.profile.completedStages];
        if (!completed.includes(this.state.currentStageId)) {
          completed.push(this.state.currentStageId);
        }
        this.state.profile = {
          ...this.state.profile,
          completedStages: completed,
          coins: this.state.coins,
        };
        saveProfile(this.state.profile);
      }
      this.state.mode = 'map';
    } else {
      const tierKanji = getKanjiByTier(this.state.currentTier);
      const offset = this.getStageOffset(this.state.currentStageId);
      const nextKanji =
        tierKanji[(offset + (this.state.stageOrderIndex % 5)) % Math.max(1, tierKanji.length)] ||
        tierKanji[0];
      if (nextKanji) {
        const token = ++this.stageRequestToken;
        const mod = this.state.stageOrderIndex % 3;
        const nextMode: TaskMode = mod === 1 ? 'recall' : mod === 2 ? 'build' : 'pick';
        const nextOrder = await generateOrder(
          nextKanji,
          nextMode,
          undefined,
          this.state.profile?.confusion || {}
        );
        if (token !== this.stageRequestToken || this.state.mode !== 'lesson') {
          return;
        }
        this.state.activeOrder = {
          ...nextOrder,
          traySlots: nextOrder.traySlots ? [...nextOrder.traySlots] : undefined,
        };
        this.state.traySlots = nextOrder.traySlots ? [...nextOrder.traySlots] : [];
      }
    }

    this.notify();
  }

  public startRush(initialTime: number = 25.0): void {
    this.state.mode = 'rush';
    this.state.rushState = startRushSession(initialTime);
    this.state.timeLeft = initialTime;
    try {
      unlockAudio().catch(() => {});
      playSound('rush');
    } catch {
      // Audio fallback
    }
    this.notify();
  }

  public tickRush(deltaSeconds: number = 1.0): void {
    if (!this.state.rushState || !this.state.rushState.isActive) return;
    const newTime = tickRushTimer(this.state.rushState.timeLeft, deltaSeconds);
    this.state.rushState = {
      ...this.state.rushState,
      timeLeft: newTime,
      isActive: newTime > 0,
    };
    this.state.timeLeft = newTime;
    if (newTime <= 0) {
      try {
        playSound('bell');
      } catch {
        // Audio fallback
      }
    }
    this.notify();
  }

  public handleRushAnswer(isCorrect: boolean, coinReward: number = 15): void {
    if (!this.state.rushState || !this.state.rushState.isActive) return;
    this.state.rushState = recordRushHit(this.state.rushState, isCorrect, 0, coinReward);
    this.state.timeLeft = this.state.rushState.timeLeft;
    this.state.coins += isCorrect ? coinReward : 0;
    this.syncProfileCoins();
    try {
      playSound(isCorrect ? 'correct' : 'wrong');
    } catch {
      // Audio fallback
    }
    this.notify();
  }

  public endRush(): void {
    if (this.state.rushState) {
      this.state.rushState = {
        ...this.state.rushState,
        isActive: false,
      };
    }
    this.state.mode = 'map';
    this.syncProfileCoins();
    try {
      playSound('fanfare');
    } catch {
      // Audio fallback
    }
    this.notify();
  }

  public startBoss(bossPairId?: string, tier?: CurriculumTierNumber): void {
    this.stageRequestToken++;
    let resolvedPairId = bossPairId;
    if (!resolvedPairId && tier) {
      const tierPairs = getAllBossPairs().filter((p) => p.tier === tier);
      const completed = this.state.profile?.completedStages || [];
      const uncompleted = tierPairs.find((p) => !completed.includes(`boss-${p.id}`));
      const chosen = uncompleted || tierPairs[0];
      if (chosen) {
        resolvedPairId = chosen.id;
      }
      this.state.currentTier = tier;
    } else if (tier) {
      this.state.currentTier = tier;
    }
    this.state.mode = 'boss';
    this.state.isGameOver = false;
    this.state.isLevelComplete = false;
    this.state.activeOrder = null;
    this.state.traySlots = [];
    const bossState = initBossBattle(resolvedPairId);
    if (!tier && typeof bossState.bossPair?.tier === 'number') {
      this.state.currentTier = bossState.bossPair.tier;
    }
    this.state.bossState = bossState;
    try {
      unlockAudio().catch(() => {});
      startBgm('boss');
    } catch {
      // Audio fallback
    }
    this.notify();
  }

  public tickBoss(deltaSeconds: number = 0.1): void {
    if (!this.state.bossState || !this.state.bossState.isActive) return;
    const nextTime = Math.max(0, Math.round((this.state.bossState.timeLeft - deltaSeconds) * 10) / 10);
    if (nextTime <= 0) {
      const res = resolveBossRound(this.state.bossState.bossHp, this.state.bossState.playerHearts, false);
      try {
        playSound(res.isPlayerDefeated ? 'hurt' : 'wrong');
      } catch {
        // Audio fallback
      }
      const questions = this.state.bossState.bossPair.questions;
      const nextIdx = (this.state.bossState.currentQuestionIndex + 1) % Math.max(1, questions.length);
      const nextQ = withShuffledBossOptions(
        questions[nextIdx] || this.state.bossState.currentQuestion
      );
      const resetTime = calculateBossRoundTime(
        this.state.bossState.bossPair.timeLimitSeconds || 8.0,
        nextIdx
      );
      this.state.bossState = {
        ...this.state.bossState,
        playerHearts: res.hearts,
        isPlayerDefeated: res.isPlayerDefeated,
        isActive: !res.isPlayerDefeated,
        currentQuestionIndex: nextIdx,
        currentQuestion: nextQ,
        timeLeft: resetTime,
      };
      if (res.isPlayerDefeated) {
        this.state.isGameOver = true;
      }
    } else {
      this.state.bossState = {
        ...this.state.bossState,
        timeLeft: nextTime,
      };
    }
    this.notify();
  }

  public handleBossAnswer(answer: string): BossRoundResult {
    if (
      !this.state.bossState ||
      !this.state.bossState.isActive ||
      this.state.bossState.isDefeated ||
      this.state.bossState.isPlayerDefeated
    ) {
      return {
        bossHp: this.state.bossState?.bossHp ?? 0,
        hearts: this.state.bossState?.playerHearts ?? 0,
        isDefeated: Boolean(this.state.bossState?.isDefeated),
        isPlayerDefeated: Boolean(this.state.bossState?.isPlayerDefeated),
      };
    }

    const { newState, result, audioCue } = submitBossAnswer(this.state.bossState, answer);
    this.state.bossState = newState;

    try {
      playSound(audioCue);
    } catch {
      // Audio fallback
    }

    if (result.isDefeated) {
      this.state.coins += 500;
      if (this.state.profile) {
        const completed = [...this.state.profile.completedStages];
        const bossStageId = `boss-${newState.bossPair.id}`;
        if (!completed.includes(bossStageId)) {
          completed.push(bossStageId);
        }
        if (newState.bossPair.tier === 'special') {
          if (!completed.includes('stage-special-boss')) {
            completed.push('stage-special-boss');
          }
        } else {
          const tierBosses = getAllBossPairs().filter((p) => p.tier === this.state.currentTier);
          const bossIndex = tierBosses.findIndex((p) => p.id === newState.bossPair.id);
          const tierBossId =
            bossIndex === 1
              ? `stage-${this.state.currentTier}-boss-2`
              : `stage-${this.state.currentTier}-boss`;
          if (!completed.includes(tierBossId)) {
            completed.push(tierBossId);
          }
        }
        const unlocked = [...this.state.profile.unlockedTiers];
        const nextTier = (this.state.currentTier + 1) as CurriculumTierNumber;
        if (nextTier <= 4 && !unlocked.includes(nextTier)) {
          unlocked.push(nextTier);
        }
        this.state.profile = {
          ...this.state.profile,
          coins: this.state.coins,
          completedStages: completed,
          unlockedTiers: unlocked,
        };
        saveProfile(this.state.profile);
      }
    } else if (result.isPlayerDefeated) {
      this.state.isGameOver = true;
    }

    this.notify();
    return result;
  }

  public openCodex(): void {
    this.state.mode = 'codex';
    this.notify();
  }

  public closeCodex(): void {
    this.state.mode = 'map';
    this.notify();
  }

  public openReview(): void {
    this.state.mode = 'review';
    this.notify();
  }

  public closeReview(): void {
    this.state.mode = 'map';
    this.notify();
  }

  public returnToMap(): void {
    this.stageRequestToken++;
    this.state.mode = 'map';
    this.state.isGameOver = false;
    this.state.isLevelComplete = false;
    this.state.revealKanji = null;
    this.state.bossState = null;
    this.state.activeOrder = null;
    this.state.traySlots = [];
    try {
      cancelSpeech();
      startBgm('salon');
    } catch {
      // Audio fallback
    }
    this.notify();
  }

  public returnToTitle(): void {
    this.stageRequestToken++;
    this.state.mode = 'title';
    this.state.score = 0;
    this.state.combo = 0;
    this.state.isGameOver = false;
    this.state.isLevelComplete = false;
    this.state.revealKanji = null;
    this.state.bossState = null;
    this.state.activeOrder = null;
    this.state.traySlots = [];
    try {
      cancelSpeech();
      stopBgm();
    } catch {
      // Audio fallback
    }
    this.notify();
  }
}

// ---------------------------------------------------------------------------
// Singleton Instances
// ---------------------------------------------------------------------------

export const gameEngine = new GameEngine();
export default gameEngine;
