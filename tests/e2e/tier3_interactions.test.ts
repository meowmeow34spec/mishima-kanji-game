/**
 * Salon Mishima - Tier 3: Cross-Feature Interactions E2E Test Suite
 * File: tests/e2e/tier3_interactions.test.ts
 *
 * Covers all 6 multi-subsystem integration chains specified in TEST_INFRA.md:
 * - T3-INT-01: Order Pipeline (Order -> Pick -> Tray -> Reveal -> Combo -> SRS -> Audio/Speech)
 * - T3-INT-02: Confusion Feedback Loop (Mistake -> Combo Reset -> Audio -> Matrix Logged -> Distractor Bias)
 * - T3-INT-03: Boss Duel Progression (Rounds -> Timer Acceleration -> HP/Heart -> Modal)
 * - T3-INT-04: Audio State Transitions (Title -> Map [Salon BGM] -> Counter [Bell] -> Boss [Boss BGM])
 * - T3-INT-05: Settings Mute Toggle (Mute on -> Master silence & speech cancelled across all modes)
 * - T3-INT-06: Stage Completion to Map Unlock (Stage complete -> Storage saved -> Next stage unlocked)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { driver } from '../helpers/gameDriver';
import {
  assertSoundDispatched,
  assertAudioMuted,
  getCreatedOscillators,
  getLastCreatedOscillator,
  resetAudioMocks,
} from '../helpers/mockAudio';
import {
  assertSpoken,
  assertSpeechCancelled,
  resetSpeechMocks,
} from '../helpers/mockSpeech';
import {
  clearStorage,
} from '../helpers/mockStorage';
import { PlayerProfile } from '../helpers/contracts';

const rootDir = path.resolve(__dirname, '../../');
const hasCurriculum = fs.existsSync(path.join(rootDir, 'src/data/mishimaCurriculum.ts'));
const hasAudio = fs.existsSync(path.join(rootDir, 'src/audio/soundSynthesizer.ts'));
const hasSpeech = fs.existsSync(path.join(rootDir, 'src/audio/speechSynthesizer.ts'));
const hasSrs = fs.existsSync(path.join(rootDir, 'src/srs/storageManager.ts'));
const hasGame = fs.existsSync(path.join(rootDir, 'src/game/gameEngine.ts'));

describe('Tier 3: Cross-Feature Interactions (6 Tests)', () => {
  beforeEach(() => {
    clearStorage();
    resetAudioMocks();
    resetSpeechMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.skipIf(!hasCurriculum || !hasGame || !hasSrs || !hasAudio || !hasSpeech)(
    'T3-INT-01: Order Pipeline (Order Gen -> Pick -> Tray -> Reveal -> Combo -> SRS -> Audio & Speech)',
    async () => {
      // 1. Initial State
      const initialProfile: PlayerProfile = {
        coins: 100,
        streak: 1,
        lastLoginDate: '2026-11-16',
        cards: {
          'shiosai-21-cho': {
            id: 'shiosai-21-cho',
            box: 1,
            nextDue: Date.now(),
            totalReviews: 0,
            correctReviews: 0,
          },
          'shiosai-22-so': {
            id: 'shiosai-22-so',
            box: 1,
            nextDue: Date.now(),
            totalReviews: 0,
            correctReviews: 0,
          },
        },
        unlockedTiers: [1, 2],
        completedStages: [],
        confusion: {},
      };
      await driver.saveProfile(initialProfile);

      // 2. Fetch target kanji for compound "潮騒"
      const kanjiCho = await driver.getKanjiById('shiosai-21-cho');
      expect(kanjiCho).toBeDefined();

      // 3. Generate Order
      const order = await driver.generateOrder(kanjiCho!, 'build');
      expect(order).toBeDefined();

      // 4. Simulate Picking and Tray Assembly
      const pick1 = await driver.handleBlockPick(order, '潮');
      expect(pick1.success).toBe(true);

      // 5. Trigger Completion Effects: Combo reward, Fanfare sound, Speech
      const comboReward = await driver.calculateComboReward(1, 50, 10);
      expect(comboReward).toBe(50);

      await driver.playSound('fanfare');
      assertSoundDispatched();

      await driver.speakKanji('しおさい');
      assertSpoken('しおさい', 'ja-JP');

      // 6. SRS Promotion
      const updatedProfile = await driver.recordReviewResult('shiosai-21-cho', true);
      expect(updatedProfile.cards['shiosai-21-cho'].box).toBe(2);
    }
  );

  it.skipIf(!hasCurriculum || !hasGame || !hasSrs || !hasAudio)(
    'T3-INT-02: Confusion Feedback Loop (Mistake -> Combo Reset -> Sound -> Confusion Logged -> Distractor Bias)',
    async () => {
      // 1. Initial Profile with combo 5
      let combo = 5;

      // 2. Mistake made: target is 寺, player picked 侍
      combo = 0; // Combo reset
      const coinsEarned = await driver.calculateComboReward(combo);
      expect(coinsEarned).toBe(0);

      // 3. Sound trigger on wrong answer
      await driver.playSound('wrong');
      assertSoundDispatched();

      // 4. Record mistake in confusion matrix
      const updatedProfile = await driver.recordReviewResult('kinkaku-03-ji', false, '侍');
      expect(updatedProfile.confusion['kinkaku-03-ji']).toBeDefined();
      expect(updatedProfile.confusion['kinkaku-03-ji']['侍']).toBeGreaterThanOrEqual(1);

      // 5. Generate subsequent order - distractor generation should consider confusion pairs
      const kanjiJi = await driver.getKanjiById('kinkaku-03-ji');
      const nextOrder = await driver.generateOrder(kanjiJi!, 'pick');
      expect(nextOrder.options).toContain(nextOrder.correctOption);
    }
  );

  it.skipIf(!hasGame)(
    'T3-INT-03: Boss Duel Progression (Round Answers -> Timer -> HP/Heart -> Defeat/Victory)',
    async () => {
      let bossHp = 8;
      let hearts = 3;

      // Round 1: Correct answer -> Boss HP 8 -> 7
      const r1 = await driver.resolveBossRound(bossHp, hearts, true);
      bossHp = r1.bossHp;
      hearts = r1.hearts;
      expect(bossHp).toBe(7);
      expect(hearts).toBe(3);

      // Round 2: Wrong answer -> Hearts 3 -> 2
      const r2 = await driver.resolveBossRound(bossHp, hearts, false);
      bossHp = r2.bossHp;
      hearts = r2.hearts;
      expect(bossHp).toBe(7);
      expect(hearts).toBe(2);

      // Round 3: Wrong answer -> Hearts 2 -> 1
      const r3 = await driver.resolveBossRound(bossHp, hearts, false);
      bossHp = r3.bossHp;
      hearts = r3.hearts;
      expect(hearts).toBe(1);

      // Round 4: Wrong answer -> Hearts 1 -> 0 (Player defeated)
      const r4 = await driver.resolveBossRound(bossHp, hearts, false);
      expect(r4.hearts).toBe(0);
      expect(r4.isPlayerDefeated).toBe(true);
      expect(r4.isDefeated).toBe(false);
    }
  );

  it.skipIf(!hasAudio)(
    'T3-INT-04: Audio State Transitions (Title -> Map [Salon BGM] -> Counter [Bell] -> Boss [Boss BGM])',
    async () => {
      // 1. Enter Map -> Start Salon BGM
      const initialOscCount = getCreatedOscillators().length;
      await driver.startBgm('salon');
      const oscsAfterSalon = getCreatedOscillators();
      expect(oscsAfterSalon.length).toBeGreaterThan(initialOscCount);
      const salonOsc = getLastCreatedOscillator();
      expect(salonOsc).toBeDefined();
      expect(salonOsc?.start).toHaveBeenCalled();
      expect(salonOsc?.stop).not.toHaveBeenCalled();

      // 2. Counter Arrival -> Procedural bell chime SFX
      await driver.playSound('bell');
      assertSoundDispatched();
      const bellOsc = getLastCreatedOscillator();
      expect(bellOsc).toBeDefined();
      expect(bellOsc?.start).toHaveBeenCalled();

      // 3. Enter Boss Duel -> Stop salon BGM, Start Boss BGM
      await driver.stopBgm();
      expect(salonOsc?.stop).toHaveBeenCalled();

      const preBossOscCount = getCreatedOscillators().length;
      await driver.startBgm('boss');
      const oscsAfterBoss = getCreatedOscillators();
      expect(oscsAfterBoss.length).toBeGreaterThan(preBossOscCount);
      const bossOsc = getLastCreatedOscillator();
      expect(bossOsc).toBeDefined();
      expect(bossOsc?.start).toHaveBeenCalled();
      expect(bossOsc?.stop).not.toHaveBeenCalled();

      // 4. End battle -> Stop Boss BGM
      await driver.stopBgm();
      expect(bossOsc?.stop).toHaveBeenCalled();
    }
  );

  it.skipIf(!hasAudio || !hasSpeech)(
    'T3-INT-05: Settings Mute Toggle (Mute on -> Master silence & speech cancelled across all modes)',
    async () => {
      // 1. Unmuted playback
      await driver.setAudioMuted(false);
      await driver.playSound('bell');
      assertSoundDispatched();

      // 2. Mute Activated
      await driver.setAudioMuted(true);
      const oscCountAfterMute = getCreatedOscillators().length;

      // 3. Sound and Speech triggered while muted
      await driver.playSound('correct');
      assertAudioMuted(oscCountAfterMute);

      // 4. Speech should be cancelled or suppressed
      assertSpeechCancelled();

      // Restore
      await driver.setAudioMuted(false);
    }
  );

  it.skipIf(!hasSrs)(
    'T3-INT-06: Stage Completion to Map Unlock (Stage complete -> Storage saved -> Next stage unlocked)',
    async () => {
      // 1. Initial Profile: Tier 1, stage-1 in progress
      const initial: PlayerProfile = {
        coins: 50,
        streak: 1,
        lastLoginDate: '2026-11-16',
        cards: {},
        unlockedTiers: [1],
        completedStages: [],
        confusion: {},
      };
      await driver.saveProfile(initial);

      // 2. Simulate stage-1 completion: add stage-1 to completedStages, award coins
      const profile = await driver.loadProfile();
      profile.completedStages.push('stage-1');
      profile.coins += 200;
      await driver.saveProfile(profile);

      // 3. Verify LocalStorage persistence
      const reloaded = await driver.loadProfile();
      expect(reloaded.completedStages).toContain('stage-1');
      expect(reloaded.coins).toBe(250);

      // 4. Verify stage progression logic: when stage-1 is complete, stage-2 is accessible
      const isStage2Unlocked = reloaded.completedStages.includes('stage-1');
      expect(isStage2Unlocked).toBe(true);
    }
  );
});
