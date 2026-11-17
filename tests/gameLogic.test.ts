/**
 * Salon Mishima - Game Logic, Mechanics & State Machine Unit Tests
 * File: tests/gameLogic.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateComboReward,
  isComboMilestone,
  getNextCombo,
  getComboFanfareTier,
  DEFAULT_BASE_COIN_AWARD,
  DEFAULT_COMBO_MULTIPLIER,
} from '../src/game/comboCalculator';
import {
  normalizeReading,
  toHiragana,
  evaluateBlockPick,
  evaluateTrayDrop,
  evaluateKeypadSubmission,
  handleBlockPick,
} from '../src/game/matchingEngine';
import {
  generateOrder,
  SALON_CUSTOMERS,
} from '../src/game/orderGenerator';
import {
  tickRushTimer,
  applyRushPenalty,
  startRushSession,
  recordRushHit,
  runRushSession,
  generateRushPrompt,
  DEFAULT_RUSH_DURATION_SECONDS,
  DEFAULT_MISTAKE_PENALTY_SECONDS,
} from '../src/game/rushController';
import {
  resolveBossRound,
  calculateBossRoundTime,
  initBossBattle,
  submitBossAnswer,
  DEFAULT_PLAYER_HEARTS,
  MIN_BOSS_ROUND_TIME,
} from '../src/game/bossBattleEngine';
import {
  GameEngine,
  gameEngine,
} from '../src/game/gameEngine';
import { getAllKanji, getKanjiById } from '../src/data/mishimaCurriculum';
import { getAllBossPairs, getBossPairById } from '../src/data/bossPairs';

describe('Salon Mishima: Game Logic & State Machine Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // =========================================================================
  // 1. Combo Calculator Tests
  // =========================================================================
  describe('1. Combo Calculator (comboCalculator.ts)', () => {
    it('GL-COM-01: should return 0 for combo count <= 0 or invalid inputs', () => {
      expect(calculateComboReward(0)).toBe(0);
      expect(calculateComboReward(-1)).toBe(0);
      expect(calculateComboReward(NaN)).toBe(0);
      expect(calculateComboReward(Infinity)).toBe(0);
    });

    it('GL-COM-02: should calculate progressive rewards for combo 1, 2, 3 with base 50 and mult 10', () => {
      expect(calculateComboReward(1, 50, 10)).toBe(50);
      expect(calculateComboReward(2, 50, 10)).toBe(60);
      expect(calculateComboReward(3, 50, 10)).toBe(70);
      expect(calculateComboReward(4, 50, 10)).toBe(80);
    });

    it('GL-COM-03: should cap multiplier bonus at 10 steps (combo >= 11 yields 150)', () => {
      expect(calculateComboReward(11, 50, 10)).toBe(150);
      expect(calculateComboReward(12, 50, 10)).toBe(150);
      expect(calculateComboReward(50, 50, 10)).toBe(150);
      expect(calculateComboReward(100, 50, 10)).toBe(150);
    });

    it('GL-COM-04: should support custom base award and multiplier', () => {
      expect(DEFAULT_BASE_COIN_AWARD).toBe(50);
      expect(DEFAULT_COMBO_MULTIPLIER).toBe(10);
      expect(calculateComboReward(1, 100, 25)).toBe(100);
      expect(calculateComboReward(2, 100, 25)).toBe(125);
      expect(calculateComboReward(11, 100, 25)).toBe(350); // 100 + 10 * 25 = 350
    });

    it('GL-COM-05: should correctly identify combo fanfare milestones (3, 5, 10, 15, 20...)', () => {
      expect(isComboMilestone(1)).toBe(false);
      expect(isComboMilestone(2)).toBe(false);
      expect(isComboMilestone(3)).toBe(true);
      expect(isComboMilestone(4)).toBe(false);
      expect(isComboMilestone(5)).toBe(true);
      expect(isComboMilestone(7)).toBe(false);
      expect(isComboMilestone(10)).toBe(true);
      expect(isComboMilestone(15)).toBe(true);
      expect(isComboMilestone(20)).toBe(true);
      expect(isComboMilestone(25)).toBe(true);
    });

    it('GL-COM-06: should determine next combo streak accurately', () => {
      expect(getNextCombo(0, true)).toBe(1);
      expect(getNextCombo(5, true)).toBe(6);
      expect(getNextCombo(5, false)).toBe(0);
      expect(getNextCombo(-2, true)).toBe(1);
    });

    it('GL-COM-07: should assign appropriate celebratory fanfare tiers', () => {
      expect(getComboFanfareTier(2)).toBeNull();
      expect(getComboFanfareTier(3)).toBe('bronze');
      expect(getComboFanfareTier(5)).toBe('silver');
      expect(getComboFanfareTier(10)).toBe('gold');
      expect(getComboFanfareTier(20)).toBe('platinum');
      expect(getComboFanfareTier(50)).toBe('platinum');
    });
  });

  // =========================================================================
  // 2. Matching Engine & Normalization Tests
  // =========================================================================
  describe('2. Matching Engine (matchingEngine.ts)', () => {
    it('GL-MAT-01: should normalize readings by stripping okurigana dots and whitespace', () => {
      expect(normalizeReading('きん・じる')).toBe('きんじる');
      expect(normalizeReading(' うつく・しい ')).toBe('うつくしい');
      expect(normalizeReading('カク')).toBe('カク');
      expect(normalizeReading('')).toBe('');
    });

    it('GL-MAT-02: should convert Katakana phonemes to Hiragana', () => {
      expect(toHiragana('キン')).toBe('きん');
      expect(toHiragana('ショウサイ')).toBe('しょうさい');
      expect(toHiragana('しおさい')).toBe('しおさい');
    });

    it('GL-MAT-03: should evaluate pick mode correctly and return MatchEvaluationResult', async () => {
      const kanji = getAllKanji()[0];
      const order = await generateOrder(kanji, 'pick');

      const correctResult = evaluateBlockPick(order, order.correctOption);
      expect(correctResult.success).toBe(true);
      expect(correctResult.isCorrect).toBe(true);
      expect(correctResult.isOrderComplete).toBe(true);
      expect(correctResult.audioCue).toBe('correct');
      expect(correctResult.scoreAwarded).toBe(100);

      const wrongOption = order.options.find((o) => o !== order.correctOption) || 'wrong';
      const wrongResult = evaluateBlockPick(order, wrongOption);
      expect(wrongResult.success).toBe(false);
      expect(wrongResult.isCorrect).toBe(false);
      expect(wrongResult.audioCue).toBe('wrong');
      expect(wrongResult.scoreAwarded).toBe(0);
    });

    it('GL-MAT-04: should evaluate multi-slot serving tray assembly sequentially', async () => {
      const kanjiCho = getKanjiById('shiosai-21-cho');
      expect(kanjiCho).toBeDefined();

      const order = await generateOrder(kanjiCho!, 'build');
      expect(order.traySlots).toBeDefined();
      expect(order.traySlots?.length).toBeGreaterThanOrEqual(2);

      // First character pick: '潮'
      const pick1 = evaluateBlockPick(order, '潮');
      expect(pick1.success).toBe(true);
      expect(pick1.isCorrect).toBe(true);
      expect(pick1.isOrderComplete).toBe(false);
      expect(pick1.audioCue).toBe('clink');

      // Second character pick: '騒'
      const pick2 = evaluateBlockPick(order, '騒');
      expect(pick2.success).toBe(true);
      expect(pick2.isCorrect).toBe(true);
      expect(pick2.isOrderComplete).toBe(true);
      expect(pick2.audioCue).toBe('fanfare');
    });

    it('GL-MAT-05: should evaluate direct tray slot placement via evaluateTrayDrop', async () => {
      const kanji = getAllKanji()[0];
      const order = await generateOrder(kanji, 'build');
      const compound = kanji.literaryCompounds?.[0]?.compound || `${kanji.character}美`;

      const slot0Result = evaluateTrayDrop(order, 0, compound[0]);
      expect(slot0Result.success).toBe(true);
      expect(slot0Result.expectedOption).toBe(compound[0]);

      const invalidSlot = evaluateTrayDrop(order, 99, 'X');
      expect(invalidSlot.success).toBe(false);
      expect(invalidSlot.error).toContain('out of bounds');
    });

    it('GL-MAT-06: should evaluate keypad reading input with okurigana and case flexibility', async () => {
      const kanjiKin = getKanjiById('kinkaku-01-kin');
      expect(kanjiKin).toBeDefined();

      const order = await generateOrder(kanjiKin!, 'pick');
      const evalHiragana = evaluateKeypadSubmission(order, 'きん');
      expect(evalHiragana.success).toBe(true);

      const evalKatakana = evaluateKeypadSubmission(order, 'キン');
      expect(evalKatakana.success).toBe(true);

      const evalWrong = evaluateKeypadSubmission(order, 'デタラメ');
      expect(evalWrong.success).toBe(false);
    });

    it('GL-MAT-07: handleBlockPick top-level wrapper should return success boolean', async () => {
      const kanji = getAllKanji()[0];
      const order = await generateOrder(kanji, 'pick');

      const res = await handleBlockPick(order, order.correctOption);
      expect(res.success).toBe(true);
      expect(res.result?.isCorrect).toBe(true);
    });

    it('GL-MAT-08: should reject out-of-order drop in evaluateTrayDrop when preceding slots are empty', async () => {
      const kanji = getKanjiById('shiosai-21-cho')!; // Compound: '潮騒'
      const order = await generateOrder(kanji, 'build');
      order.traySlots = [null, null];

      // Attempt to drop into slot 1 when slot 0 is empty
      const res = evaluateTrayDrop(order, 1, '騒');
      expect(res.success).toBe(false);
      expect(res.isCorrect).toBe(false);
      expect(res.audioCue).toBe('wrong');
      expect(res.scoreAwarded).toBe(0);
      expect(res.coinsAwarded).toBe(0);
      expect(res.nextCombo).toBe(0);
      expect(res.error).toBe('Cannot fill slot 1 before preceding slots are filled');
      expect(res.nextSlots).toEqual([null, null]);
    });

    it('GL-MAT-09: should reject duplicate drop in evaluateTrayDrop when target slot is already filled', async () => {
      const kanji = getKanjiById('shiosai-21-cho')!; // Compound: '潮騒'
      const order = await generateOrder(kanji, 'build');
      order.traySlots = [null, null];

      // First drop into slot 0 succeeds
      const first = evaluateTrayDrop(order, 0, '潮');
      expect(first.success).toBe(true);
      expect(first.isCorrect).toBe(true);
      expect(first.scoreAwarded).toBe(50);
      expect(first.coinsAwarded).toBe(25);
      expect(order.traySlots[0]).toBe('潮');

      // Duplicate drop into slot 0 should be rejected
      const dup = evaluateTrayDrop(order, 0, '潮');
      expect(dup.success).toBe(false);
      expect(dup.isCorrect).toBe(false);
      expect(dup.audioCue).toBe('wrong');
      expect(dup.scoreAwarded).toBe(0);
      expect(dup.coinsAwarded).toBe(0);
      expect(dup.nextCombo).toBe(0);
      expect(dup.error).toBe("Slot 0 is already filled with '潮'");
      expect(dup.nextSlots).toEqual(['潮', null]);
    });

    it('GL-MAT-10: should award 0 score and 0 coins when dropping into already completed tray in evaluateTrayDrop', async () => {
      const kanji = getKanjiById('shiosai-21-cho')!; // Compound: '潮騒'
      const order = await generateOrder(kanji, 'build');
      order.traySlots = [null, null];

      // Fill slot 0
      const s0 = evaluateTrayDrop(order, 0, '潮');
      expect(s0.success).toBe(true);
      expect(s0.scoreAwarded).toBe(50);

      // Fill slot 1 (completes tray)
      const s1 = evaluateTrayDrop(order, 1, '騒');
      expect(s1.success).toBe(true);
      expect(s1.isOrderComplete).toBe(true);
      expect(s1.scoreAwarded).toBe(200);
      expect(s1.coinsAwarded).toBe(100);
      expect(s1.audioCue).toBe('fanfare');

      // Subsequent drop on completed tray should award 0 score and 0 coins
      const postComplete = evaluateTrayDrop(order, 0, '潮');
      expect(postComplete.success).toBe(true);
      expect(postComplete.isCorrect).toBe(true);
      expect(postComplete.isOrderComplete).toBe(true);
      expect(postComplete.scoreAwarded).toBe(0);
      expect(postComplete.coinsAwarded).toBe(0);
      expect(postComplete.audioCue).toBe('correct');
      expect(postComplete.nextSlots).toEqual(['潮', '騒']);
    });
  });

  // =========================================================================
  // 3. Customer Order Generator Tests
  // =========================================================================
  describe('3. Customer Order Generator (orderGenerator.ts)', () => {
    it('GL-ORD-01: should generate pick mode order with 4 options containing correctOption', async () => {
      const kanji = getAllKanji()[0];
      const order = await generateOrder(kanji, 'pick');

      expect(order.id).toBeDefined();
      expect(order.mode).toBe('pick');
      expect(order.options.length).toBe(4);
      expect(order.options).toContain(order.correctOption);
      expect(order.correctOption).toBe(kanji.character);
      expect(order.customerName).toBeDefined();
      expect(order.dialogue.length).toBeGreaterThan(0);
    });

    it('GL-ORD-02: should generate recall mode order with reading options', async () => {
      const kanji = getAllKanji()[1];
      const order = await generateOrder(kanji, 'recall');

      expect(order.mode).toBe('recall');
      expect(order.options.length).toBe(4);
      expect(order.options).toContain(order.correctOption);
      expect(order.traySlots).toBeUndefined();
    });

    it('GL-ORD-03: should generate build mode order with traySlots array', async () => {
      const kanji = getAllKanji()[2];
      const order = await generateOrder(kanji, 'build');

      expect(order.mode).toBe('build');
      expect(Array.isArray(order.traySlots)).toBe(true);
      expect(order.traySlots?.every((s) => s === null)).toBe(true);
      expect(order.options).toContain(order.correctOption);
    });

    it('GL-ORD-04: should incorporate custom distractors when supplied', async () => {
      const kanji = getAllKanji()[0];
      const customDistractors = ['甲', '乙', '丙'];
      const order = await generateOrder(kanji, 'pick', customDistractors);

      expect(order.options).toContain('甲');
      expect(order.options).toContain(order.correctOption);
    });

    it('GL-ORD-05: should select customers from SALON_CUSTOMERS pool with literary authenticity', async () => {
      const names = SALON_CUSTOMERS.map((c) => c.name);
      expect(names).toContain('有為子');
      expect(names).toContain('新治');
      expect(names).toContain('松枝清顕');
    });
  });

  // =========================================================================
  // 4. Rush Mode Controller Tests
  // =========================================================================
  describe('4. Rush Controller (rushController.ts)', () => {
    it('GL-RSH-01: tickRushTimer decrements timer by deltaSeconds', () => {
      expect(tickRushTimer(25.0, 1.0)).toBe(24.0);
      expect(tickRushTimer(10.5, 0.5)).toBe(10.0);
      expect(tickRushTimer(0.5, 1.0)).toBe(0.0);
    });

    it('GL-RSH-02: applyRushPenalty applies -1.5s penalty strictly clamped to 0.0s', () => {
      expect(applyRushPenalty(24.0, 1.5)).toBe(22.5);
      expect(applyRushPenalty(1.5, 1.5)).toBe(0.0);
      expect(applyRushPenalty(0.4, 1.5)).toBe(0.0);
      expect(applyRushPenalty(0.0, 1.5)).toBe(0.0);
    });

    it('GL-RSH-03: startRushSession initializes state properly', () => {
      expect(DEFAULT_RUSH_DURATION_SECONDS).toBe(25.0);
      expect(DEFAULT_MISTAKE_PENALTY_SECONDS).toBe(1.5);
      const session = startRushSession(25.0);
      expect(session.initialTime).toBe(25.0);
      expect(session.timeLeft).toBe(25.0);
      expect(session.hits).toBe(0);
      expect(session.misses).toBe(0);
      expect(session.earnedCoins).toBe(0);
      expect(session.isActive).toBe(true);
    });

    it('GL-RSH-04: recordRushHit updates hits, misses, combo and earned coins', () => {
      let session = startRushSession(25.0);
      session = recordRushHit(session, true, 1.0, 15);
      expect(session.hits).toBe(1);
      expect(session.combo).toBe(1);
      expect(session.timeLeft).toBe(24.0);
      expect(session.earnedCoins).toBe(15);

      session = recordRushHit(session, false, 0.0);
      expect(session.misses).toBe(1);
      expect(session.combo).toBe(0);
      expect(session.timeLeft).toBe(22.5); // 24.0 - 1.5 penalty
    });

    it('GL-RSH-05: runRushSession simulated session matches exact driver contract', async () => {
      const session = await runRushSession({
        initialTime: 25.0,
        correctHits: 10,
        secondsPerHit: 1.0,
        coinRewardPerHit: 15,
      });

      expect(session.hits).toBe(10);
      expect(session.timeLeft).toBe(15.0);
      expect(session.earnedCoins).toBe(150);
      expect(session.isActive).toBe(true);
    });

    it('GL-RSH-06: generateRushPrompt creates rapid prompt with 4 options', () => {
      const kanji = getAllKanji()[0];
      const prompt = generateRushPrompt(kanji);

      expect(prompt.id).toBeDefined();
      expect(prompt.options.length).toBe(4);
      expect(prompt.options).toContain(prompt.correctOption);
      expect(prompt.correctOption).toBe(kanji.character);
    });
  });

  // =========================================================================
  // 5. Boss Battle Engine Tests
  // =========================================================================
  describe('5. Boss Battle Engine (bossBattleEngine.ts)', () => {
    it('GL-BOS-01: resolveBossRound correctly handles hits and errors', () => {
      // Correct answer: Boss HP 10 -> 9, Hearts stay 3
      const r1 = resolveBossRound(10, 3, true);
      expect(r1.bossHp).toBe(9);
      expect(r1.hearts).toBe(3);
      expect(r1.isDefeated).toBe(false);
      expect(r1.isPlayerDefeated).toBe(false);

      // Incorrect answer: Boss HP stays 9, Hearts 3 -> 2
      const r2 = resolveBossRound(9, 3, false);
      expect(r2.bossHp).toBe(9);
      expect(r2.hearts).toBe(2);
      expect(r2.isPlayerDefeated).toBe(false);
    });

    it('GL-BOS-02: resolveBossRound detects Boss defeat at bossHp <= 0', () => {
      const r = resolveBossRound(1, 3, true);
      expect(r.bossHp).toBe(0);
      expect(r.isDefeated).toBe(true);
      expect(r.isPlayerDefeated).toBe(false);
    });

    it('GL-BOS-03: resolveBossRound detects Player defeat at hearts <= 0', () => {
      const r = resolveBossRound(5, 1, false);
      expect(r.hearts).toBe(0);
      expect(r.isPlayerDefeated).toBe(true);
      expect(r.isDefeated).toBe(false);
    });

    it('GL-BOS-04: calculateBossRoundTime accelerates down to minimum 3.6s', () => {
      expect(calculateBossRoundTime(8.0, 0)).toBe(8.0);
      expect(calculateBossRoundTime(8.0, 1)).toBe(7.6);
      expect(calculateBossRoundTime(8.0, 5)).toBe(6.0);
      expect(calculateBossRoundTime(8.0, 20)).toBe(MIN_BOSS_ROUND_TIME);
    });

    it('GL-BOS-05: initBossBattle loads boss pair from dataset', () => {
      expect(getAllBossPairs().length).toBe(8);
      expect(getBossPairById('boss-01-ji-samurai')?.characterA).toBe('寺');
      const state = initBossBattle('boss-01-ji-samurai');
      expect(state.bossPair.characterA).toBe('寺');
      expect(state.bossPair.characterB).toBe('侍');
      expect(state.bossHp).toBe(10);
      expect(state.playerHearts).toBe(DEFAULT_PLAYER_HEARTS);
      expect(state.isActive).toBe(true);
    });

    it('GL-BOS-06: submitBossAnswer updates state, resolves questions, and assigns sound cues', () => {
      const state = initBossBattle('boss-01-ji-samurai');
      const correctAns = state.currentQuestion.correctAnswer;

      const { newState, result, isCorrect, audioCue } = submitBossAnswer(state, correctAns);
      expect(isCorrect).toBe(true);
      expect(result.bossHp).toBe(9);
      expect(newState.bossHp).toBe(9);
      expect(audioCue).toBe('bossHit');

      const wrongAns = 'INVALID_WRONG_ANSWER';
      const wrongTurn = submitBossAnswer(newState, wrongAns);
      expect(wrongTurn.isCorrect).toBe(false);
      expect(wrongTurn.result.hearts).toBe(2);
      expect(wrongTurn.audioCue).toBe('wrong');
    });
  });

  // =========================================================================
  // 6. Master Game Engine & State Machine Coordinator Tests
  // =========================================================================
  describe('6. Master Game Engine Coordinator (gameEngine.ts)', () => {
    it('GL-ENG-01: should initialize with valid default state in title mode', () => {
      expect(gameEngine).toBeInstanceOf(GameEngine);
      const engine = new GameEngine();
      const state = engine.getState();

      expect(state.mode).toBe('title');
      expect(state.score).toBe(0);
      expect(state.combo).toBe(0);
      expect(state.hearts).toBe(3);
      expect(state.isGameOver).toBe(false);
      expect(state.isLevelComplete).toBe(false);
      expect(state.currentTier).toBe(1);
    });

    it('GL-ENG-02: subscribe should notify listener on state changes and return unsubscribe function', () => {
      const engine = new GameEngine();
      let notificationCount = 0;
      let lastState = engine.getState();

      const unsubscribe = engine.subscribe((s) => {
        notificationCount++;
        lastState = s;
      });

      expect(notificationCount).toBe(1); // Immediate initial sync

      engine.dispatch({ type: 'START_SHIFT' });
      expect(notificationCount).toBe(2);
      expect(lastState.mode).toBe('map');

      unsubscribe();
      engine.dispatch({ type: 'RETURN_TO_TITLE' });
      expect(notificationCount).toBe(2); // Listener unsubscribed
    });

    it('GL-ENG-03: dispatch should process full lesson flow (START_SHIFT -> SELECT_STAGE -> PICK_BLOCK)', async () => {
      const engine = new GameEngine();
      engine.startShift();
      expect(engine.getState().mode).toBe('map');

      await engine.selectStage(1, 'stage-1-1');
      const stateAfterStage = engine.getState();
      expect(stateAfterStage.mode).toBe('lesson');
      expect(stateAfterStage.activeOrder).toBeDefined();

      const order = stateAfterStage.activeOrder!;
      const pickRes = await engine.pickOption(order.correctOption);

      expect(pickRes.success).toBe(true);
      expect(engine.getState().combo).toBe(1);
      expect(engine.getState().score).toBeGreaterThan(0);
      expect(engine.getState().coins).toBeGreaterThanOrEqual(50);
    });

    it('GL-ENG-04: mistake during lesson should reset combo and deduct player heart', async () => {
      const engine = new GameEngine();
      await engine.selectStage(1, 'stage-1-1');

      const order = engine.getState().activeOrder!;
      const wrongOption = order.options.find((o) => o !== order.correctOption) || 'wrong';

      const pickRes = await engine.pickOption(wrongOption);
      expect(pickRes.success).toBe(false);
      expect(engine.getState().combo).toBe(0);
      expect(engine.getState().hearts).toBe(2);
    });

    it('GL-ENG-05: rush mode flow (startRush -> tickRush -> handleRushAnswer -> endRush)', () => {
      const engine = new GameEngine();
      const initialCoins = engine.getState().coins;
      engine.startRush(25.0);

      expect(engine.getState().mode).toBe('rush');
      expect(engine.getState().rushState?.timeLeft).toBe(25.0);

      engine.tickRush(1.0);
      expect(engine.getState().rushState?.timeLeft).toBe(24.0);

      engine.handleRushAnswer(true, 15);
      expect(engine.getState().rushState?.hits).toBe(1);
      expect(engine.getState().coins).toBe(initialCoins + 15);

      engine.endRush();
      expect(engine.getState().mode).toBe('map');
    });

    it('GL-ENG-06: boss battle duel flow (startBoss -> handleBossAnswer -> victory)', () => {
      const engine = new GameEngine();
      engine.startBoss('boss-01-ji-samurai');

      expect(engine.getState().mode).toBe('boss');
      expect(engine.getState().bossState?.bossHp).toBe(10);

      // Answer rounds until boss is defeated
      while (engine.getState().bossState && !engine.getState().bossState?.isDefeated) {
        const correctAns = engine.getState().bossState!.currentQuestion.correctAnswer;
        engine.handleBossAnswer(correctAns);
      }

      expect(engine.getState().bossState?.isDefeated).toBe(true);
      expect(engine.getState().coins).toBeGreaterThanOrEqual(500);
    });

    it('GL-ENG-07: mode transitions (codex, review, map, title)', () => {
      const engine = new GameEngine();
      engine.openCodex();
      expect(engine.getState().mode).toBe('codex');

      engine.closeCodex();
      expect(engine.getState().mode).toBe('map');

      engine.openReview();
      expect(engine.getState().mode).toBe('review');

      engine.closeReview();
      expect(engine.getState().mode).toBe('map');

      engine.returnToTitle();
      expect(engine.getState().mode).toBe('title');
    });
  });
});
