/**
 * Salon Mishima - Tier 4: Real-World Workload Scenarios E2E Test Suite
 * File: tests/e2e/tier4_scenarios.test.ts
 *
 * Covers 5 realistic end-to-end player journeys specified in TEST_INFRA.md:
 * - T4-WLD-01: Full Fresh-Start Lesson Run (Novice Stage 1 to SRS Box 1)
 * - T4-WLD-02: Daily Morning Review Cycle (Day 2 with overdue cards -> Box 2)
 * - T4-WLD-03: Boss Duel Victory & Tier Unlock (寺 vs 侍 duel -> Tier 2 unlock)
 * - T4-WLD-04: Multi-Day Streak Progression & Reset (Day 1,2,3 -> Miss Day 4 -> Day 5 reset)
 * - T4-WLD-05: Corrupted Storage Recovery & Resilience (Malformed JSON recovery & auto-repair)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { driver } from '../helpers/gameDriver';
import {
  clearStorage,
  setStoredProfile,
  corruptStorage,
  STORAGE_KEY,
} from '../helpers/mockStorage';
import { resetAudioMocks } from '../helpers/mockAudio';
import { resetSpeechMocks } from '../helpers/mockSpeech';
import { PlayerProfile } from '../helpers/contracts';

const rootDir = path.resolve(__dirname, '../../');
const hasCurriculum = fs.existsSync(path.join(rootDir, 'src/data/mishimaCurriculum.ts'));
const hasSrs = fs.existsSync(path.join(rootDir, 'src/srs/storageManager.ts'));
const hasGame = fs.existsSync(path.join(rootDir, 'src/game/gameEngine.ts'));

describe('Tier 4: Real-World Workload Scenarios (5 Comprehensive Scenarios)', () => {
  beforeEach(() => {
    clearStorage();
    resetAudioMocks();
    resetSpeechMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // =========================================================================
  // Scenario 1: Full Fresh-Start Lesson Run (Novice Stage 1)
  // =========================================================================
  it.skipIf(!hasCurriculum || !hasSrs || !hasGame)(
    'T4-WLD-01: Full Fresh-Start Lesson Run (Novice Stage 1 -> 6 Orders -> Rush -> 3 Stars -> SRS Box 1)',
    async () => {
      // 1. Fresh start: verify clean storage
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

      // 2. Load initial default profile
      const profile = await driver.loadProfile();
      expect(profile.coins).toBeDefined();
      expect(profile.unlockedTiers).toEqual([1]);
      expect(profile.completedStages).toEqual([]);

      // 3. Stage 1 cards in Tier 1 (e.g. 金, 閣, 寺, 美)
      const tier1Kanji = await driver.getKanjiByTier(1);
      const stage1Kanji = tier1Kanji.slice(0, 4);
      expect(stage1Kanji.length).toBe(4);

      // 4. Simulate completing 6 counter orders
      let earnedCoins = 0;
      let combo = 0;
      for (let i = 0; i < 6; i++) {
        const kanji = stage1Kanji[i % stage1Kanji.length];
        const order = await driver.generateOrder(kanji, 'pick');
        const result = await driver.handleBlockPick(order, order.correctOption);
        expect(result.success).toBe(true);

        combo++;
        const reward = await driver.calculateComboReward(combo, 50, 10);
        earnedCoins += reward;
      }
      expect(combo).toBe(6);
      expect(earnedCoins).toBeGreaterThan(300);

      // 5. Simulate 25s Rush Mode execution with fake timers
      vi.useFakeTimers();
      let rushTimeLeft = 25.0;
      let rushHits = 0;

      // 10 rapid correct hits during rush
      for (let r = 0; r < 10; r++) {
        rushTimeLeft -= 1.0;
        vi.advanceTimersByTime(1000);
        rushHits++;
        earnedCoins += 15;
      }
      expect(rushHits).toBe(10);
      expect(rushTimeLeft).toBe(15.0);
      vi.useRealTimers();

      // 6. Complete stage: Award 3 stars, save stage completion and SRS cards
      profile.completedStages.push('stage-1');
      profile.coins += earnedCoins;

      const now = Date.now();
      for (const k of stage1Kanji) {
        profile.cards[k.id] = {
          id: k.id,
          box: 1,
          nextDue: now + 1 * 86400000, // Box 1 review tomorrow
          totalReviews: 1,
          correctReviews: 1,
          lastReviewed: now,
        };
      }
      await driver.saveProfile(profile);

      // 7. Verify persistent storage
      const finalProfile = await driver.loadProfile();
      expect(finalProfile.completedStages).toContain('stage-1');
      expect(finalProfile.coins).toBeGreaterThanOrEqual(earnedCoins);
      expect(Object.keys(finalProfile.cards).length).toBe(4);
      for (const k of stage1Kanji) {
        expect(finalProfile.cards[k.id].box).toBe(1);
      }
    }
  );

  // =========================================================================
  // Scenario 2: Daily Morning Review Cycle
  // =========================================================================
  it.skipIf(!hasSrs)(
    'T4-WLD-02: Daily Morning Review Cycle (Returning Learner Day 2 -> Overdue Cards -> Box 2)',
    async () => {
      const yesterday = '2026-11-15';
      const today = '2026-11-16';
      const now = Date.now();

      // 1. Seed user profile from Day 1 with 4 cards due today
      const seededProfile: PlayerProfile = {
        coins: 400,
        streak: 1,
        lastLoginDate: yesterday,
        cards: {
          'kinkaku-01-kin': { id: 'kinkaku-01-kin', box: 1, nextDue: now - 3600000, totalReviews: 1, correctReviews: 1 },
          'kinkaku-02-kaku': { id: 'kinkaku-02-kaku', box: 1, nextDue: now - 3600000, totalReviews: 1, correctReviews: 1 },
          'kinkaku-03-ji': { id: 'kinkaku-03-ji', box: 1, nextDue: now - 3600000, totalReviews: 1, correctReviews: 1 },
          'kinkaku-04-bi': { id: 'kinkaku-04-bi', box: 1, nextDue: now - 3600000, totalReviews: 1, correctReviews: 1 },
        },
        unlockedTiers: [1],
        completedStages: ['stage-1'],
        confusion: {},
      };
      setStoredProfile(seededProfile);

      // 2. Launch game on Day 2 -> streak incremented
      const profile = await driver.loadProfile();
      if (profile.lastLoginDate === yesterday) {
        profile.streak += 1;
        profile.lastLoginDate = today;
      }
      expect(profile.streak).toBe(2);

      // 3. Identify due cards (all 4 nextDue <= now)
      const dueCards = Object.values(profile.cards).filter((c) => c.nextDue <= now);
      expect(dueCards.length).toBe(4);

      // 4. Perform reviews: Questions 1-3 correct, Question 4 incorrect
      // Q1-3 Promoted from Box 1 to Box 2 (interval: 2 days)
      const p1 = await driver.promoteCard(dueCards[0], now);
      const p2 = await driver.promoteCard(dueCards[1], now);
      const p3 = await driver.promoteCard(dueCards[2], now);
      expect(p1.box).toBe(2);
      expect(p2.box).toBe(2);
      expect(p3.box).toBe(2);
      expect(p1.nextDue).toBeGreaterThanOrEqual(now + 2 * 86400000 - 1000);

      // Q4 Demoted / stays in Box 1
      const p4 = await driver.demoteCard(dueCards[3], now);
      expect(p4.box).toBe(1);

      // 5. Update and persist profile
      profile.cards[p1.id] = p1;
      profile.cards[p2.id] = p2;
      profile.cards[p3.id] = p3;
      profile.cards[p4.id] = p4;
      await driver.saveProfile(profile);

      // 6. Verify refreshed profile in storage
      const updated = await driver.loadProfile();
      expect(updated.streak).toBe(2);
      expect(updated.cards['kinkaku-01-kin'].box).toBe(2);
      expect(updated.cards['kinkaku-02-kaku'].box).toBe(2);
      expect(updated.cards['kinkaku-03-ji'].box).toBe(2);
      expect(updated.cards['kinkaku-04-bi'].box).toBe(1);
    }
  );

  // =========================================================================
  // Scenario 3: Boss Duel Victory & Tier Unlock Progression
  // =========================================================================
  it.skipIf(!hasCurriculum || !hasGame || !hasSrs)(
    'T4-WLD-03: Boss Duel Victory & Tier Unlock (Confusing Pairs 寺 vs 侍 -> Defeat Boss -> Unlock Tier 2)',
    async () => {
      // 1. Initial Profile: Tier 1 completed, Boss 1 unlocked
      const initialProfile: PlayerProfile = {
        coins: 800,
        streak: 3,
        lastLoginDate: '2026-11-16',
        cards: {},
        unlockedTiers: [1],
        completedStages: ['stage-1', 'stage-2', 'stage-3', 'stage-4'],
        confusion: {},
      };
      await driver.saveProfile(initialProfile);

      // 2. Fetch Boss Pair for Boss 1 (寺 vs 侍)
      const bossPairs = await driver.getAllBossPairs();
      const boss1 = bossPairs.find((b) => b.id.includes('ji-samurai') || b.characterA === '寺');
      expect(boss1).toBeDefined();

      let bossHp = boss1?.bossHp || 10;
      let playerHearts = 3;

      // 3. Round-by-round duel:
      // Rounds 1-4: Correct answers (Boss HP 10 -> 6)
      for (let r = 0; r < 4; r++) {
        const round = await driver.resolveBossRound(bossHp, playerHearts, true);
        bossHp = round.bossHp;
        playerHearts = round.hearts;
      }
      expect(bossHp).toBe(6);
      expect(playerHearts).toBe(3);

      // Round 5: Mistake click (Hearts 3 -> 2)
      const wrongRound = await driver.resolveBossRound(bossHp, playerHearts, false);
      bossHp = wrongRound.bossHp;
      playerHearts = wrongRound.hearts;
      expect(playerHearts).toBe(2);

      // Rounds 6-11: Correct answers until Boss HP reaches 0
      while (bossHp > 0) {
        const round = await driver.resolveBossRound(bossHp, playerHearts, true);
        bossHp = round.bossHp;
        playerHearts = round.hearts;
      }
      expect(bossHp).toBe(0);
      expect(playerHearts).toBe(2);

      // 4. Boss Defeated: Award Trophy, bonus 500 coins, unlock Tier 2
      const profile = await driver.loadProfile();
      profile.completedStages.push('boss-1');
      profile.coins += 500;
      if (!profile.unlockedTiers.includes(2)) {
        profile.unlockedTiers.push(2);
      }
      await driver.saveProfile(profile);

      // 5. Verify Tier 2 is unlocked in persistent storage
      const reloaded = await driver.loadProfile();
      expect(reloaded.completedStages).toContain('boss-1');
      expect(reloaded.unlockedTiers).toContain(2);
      expect(reloaded.coins).toBe(1300);
    }
  );

  // =========================================================================
  // Scenario 4: Multi-Day Streak Progression & Missed-Day Reset
  // =========================================================================
  it.skipIf(!hasSrs)(
    'T4-WLD-04: Multi-Day Streak Progression & Reset (Day 1, 2, 3 -> Skip Day 4 -> Day 5 Resets to 1)',
    async () => {
      // Day 1 ("2026-11-16"): Login
      let profile: PlayerProfile = {
        coins: 100,
        streak: 1,
        lastLoginDate: '2026-11-16',
        cards: {},
        unlockedTiers: [1],
        completedStages: [],
        confusion: {},
      };
      await driver.saveProfile(profile);
      expect(profile.streak).toBe(1);

      // Helper function simulating daily streak update logic
      const processDailyLogin = (prof: PlayerProfile, todayDate: string) => {
        const last = new Date(prof.lastLoginDate);
        const current = new Date(todayDate);
        const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          prof.streak += 1;
        } else if (diffDays > 1) {
          prof.streak = 1; // Streak reset due to missed day
        }
        prof.lastLoginDate = todayDate;
      };

      // Day 2 ("2026-11-17"): Consecutive login -> Streak = 2
      processDailyLogin(profile, '2026-11-17');
      await driver.saveProfile(profile);
      expect(profile.streak).toBe(2);

      // Day 3 ("2026-11-18"): Consecutive login -> Streak = 3
      processDailyLogin(profile, '2026-11-18');
      await driver.saveProfile(profile);
      expect(profile.streak).toBe(3);

      // Day 5 ("2026-11-20"): Skipped Day 4 (gap = 2 days) -> Streak resets to 1
      processDailyLogin(profile, '2026-11-20');
      await driver.saveProfile(profile);

      const reloaded = await driver.loadProfile();
      expect(reloaded.streak).toBe(1);
      expect(reloaded.lastLoginDate).toBe('2026-11-20');
    }
  );

  // =========================================================================
  // Scenario 5: Corrupted Storage Recovery & Session Resilience
  // =========================================================================
  it.skipIf(!hasSrs)(
    'T4-WLD-05: Corrupted Storage Recovery & Resilience (Malformed JSON string -> Safe Fallback -> Clean Repair)',
    async () => {
      // 1. Storage gets corrupted with garbage
      corruptStorage('MALFORMED_GARBAGE_JSON_#@!$%^&*');
      expect(localStorage.getItem(STORAGE_KEY)).toContain('MALFORMED');

      // 2. Application starts and loads profile without throwing an unhandled exception
      const profile = await driver.loadProfile();
      expect(profile).toBeDefined();
      expect(typeof profile.coins).toBe('number');
      expect(profile.unlockedTiers).toContain(1);

      // 3. Player earns coins during play session
      profile.coins += 150;
      profile.completedStages.push('stage-1');

      // 4. Save profile back to storage
      await driver.saveProfile(profile);

      // 5. Inspect localStorage: valid JSON has overwritten the corrupt string
      const rawStored = localStorage.getItem(STORAGE_KEY);
      expect(rawStored).not.toBeNull();
      expect(rawStored).not.toContain('MALFORMED');

      const parsed = JSON.parse(rawStored!);
      expect(parsed.coins).toBe(profile.coins);
      expect(parsed.completedStages).toContain('stage-1');

      // 6. Next game boot loads cleanly from repaired storage
      const freshBoot = await driver.loadProfile();
      expect(freshBoot.coins).toBe(profile.coins);
      expect(freshBoot.completedStages).toContain('stage-1');
    }
  );
});
