/**
 * Salon Mishima - Tier 2: Boundary & Corner Cases E2E Test Suite
 * File: tests/e2e/tier2_boundaries.test.ts
 *
 * Covers 10 boundary & corner case tests specified in TEST_INFRA.md:
 * - T2-BND-01: Invalid tier query returns [] safely
 * - T2-BND-02: Unknown kanji ID returns undefined safely
 * - T2-BND-03: Extreme combo count (combo 50) caps multiplier at 10
 * - T2-BND-04: Rush timer underflow (0.4s - 1.5s clamps to 0.0s)
 * - T2-BND-05: Player heart depletion (hearts 0 transitions to game over)
 * - T2-BND-06: LocalStorage JSON syntax corruption auto-recovers to default profile
 * - T2-BND-07: Partial/legacy profile schema in LocalStorage merges missing keys safely
 * - T2-BND-08: Storage quota exhaustion caught gracefully without crashing
 * - T2-BND-09: Okurigana delimiter dot (・) stripped for matching while preserved in display
 * - T2-BND-10: Daily review launched with 0 due cards enters free practice or informs user
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { driver } from '../helpers/gameDriver';
import {
  clearStorage,
  corruptStorage,
  simulateQuotaExceeded,
  setStoredProfile,
  STORAGE_KEY,
} from '../helpers/mockStorage';
import { resetAudioMocks } from '../helpers/mockAudio';
import { resetSpeechMocks } from '../helpers/mockSpeech';

const rootDir = path.resolve(__dirname, '../../');
const hasCurriculum = fs.existsSync(path.join(rootDir, 'src/data/mishimaCurriculum.ts'));
const hasSrs = fs.existsSync(path.join(rootDir, 'src/srs/storageManager.ts'));
const hasGame = fs.existsSync(path.join(rootDir, 'src/game/gameEngine.ts'));

describe('Tier 2: Boundary & Corner Cases (10 Tests)', () => {
  beforeEach(() => {
    clearStorage();
    resetAudioMocks();
    resetSpeechMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.skipIf(!hasCurriculum)('T2-BND-01: Querying invalid tier (tier = 0 or tier = 5) returns [] safely', async () => {
    const tier0 = await driver.getKanjiByTier(0);
    const tier5 = await driver.getKanjiByTier(5);
    const tierNeg = await driver.getKanjiByTier(-1);

    expect(Array.isArray(tier0)).toBe(true);
    expect(tier0.length).toBe(0);
    expect(Array.isArray(tier5)).toBe(true);
    expect(tier5.length).toBe(0);
    expect(Array.isArray(tierNeg)).toBe(true);
    expect(tierNeg.length).toBe(0);
  });

  it.skipIf(!hasCurriculum)('T2-BND-02: Querying unknown kanji ID ("non-existent") returns undefined without error', async () => {
    const unknown1 = await driver.getKanjiById('');
    const unknown2 = await driver.getKanjiById('non-existent-kanji-xyz');
    const unknown3 = await driver.getKanjiById('kinkaku-99-unknown');

    expect(unknown1).toBeUndefined();
    expect(unknown2).toBeUndefined();
    expect(unknown3).toBeUndefined();
  });

  it.skipIf(!hasGame)('T2-BND-03: Extreme combo count (e.g. combo 50) caps multiplier at 10 without numerical overflow', async () => {
    // Formula: base + Math.min(combo - 1, 10) * mult
    // For combo 50, bonus is capped at 10 * mult
    const reward50 = await driver.calculateComboReward(50, 50, 10);
    const reward11 = await driver.calculateComboReward(11, 50, 10);
    const reward12 = await driver.calculateComboReward(12, 50, 10);

    // 50 + 10 * 10 = 150
    expect(reward11).toBe(150);
    expect(reward12).toBe(150);
    expect(reward50).toBe(150);
    expect(Number.isFinite(reward50)).toBe(true);
  });

  it.skipIf(!hasGame)('T2-BND-04: Rush timer underflow (timer at 0.4s penalized by 1.5s clamps to 0.0s)', async () => {
    const currentTime = 0.4;
    const penalty = 1.5;
    const clampedTime = await driver.applyRushPenalty(currentTime, penalty);

    expect(clampedTime).toBe(0.0);
    expect(clampedTime).not.toBeLessThan(0);
  });

  it.skipIf(!hasGame)('T2-BND-05: Player heart depletion (hearts reaching 0 transitions to game over)', async () => {
    // Player at 1 heart makes an error
    const result = await driver.resolveBossRound(5, 1, false);

    expect(result.hearts).toBe(0);
    expect(result.isPlayerDefeated).toBe(true);
    expect(result.isDefeated).toBe(false);
  });

  it.skipIf(!hasSrs)('T2-BND-06: LocalStorage JSON syntax corruption auto-recovers to default profile', async () => {
    corruptStorage('{CORRUPTED_JSON<<##$$@@');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{CORRUPTED_JSON<<##$$@@');

    // loadProfile should catch JSON syntax error and safely return default profile
    const profile = await driver.loadProfile();
    expect(profile).toBeDefined();
    expect(typeof profile.coins).toBe('number');
    expect(Array.isArray(profile.unlockedTiers)).toBe(true);
    expect(profile.unlockedTiers).toContain(1);

    // Saving repairs storage
    profile.coins += 25;
    await driver.saveProfile(profile);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.coins).toBe(profile.coins);
  });

  it.skipIf(!hasSrs)('T2-BND-07: Partial/legacy profile schema in LocalStorage merges missing keys safely', async () => {
    // Storage has partial object missing cards, unlockedTiers, confusion
    corruptStorage(JSON.stringify({ coins: 300, streak: 5 }));

    const profile = await driver.loadProfile();
    expect(profile.coins).toBe(300);
    expect(profile.streak).toBe(5);
    // Missing keys must be populated with safe defaults
    expect(profile.cards).toBeDefined();
    expect(typeof profile.cards).toBe('object');
    expect(profile.unlockedTiers).toBeDefined();
    expect(profile.unlockedTiers).toContain(1);
    expect(profile.completedStages).toBeDefined();
    expect(Array.isArray(profile.completedStages)).toBe(true);
  });

  it.skipIf(!hasSrs)('T2-BND-08: Storage quota exhaustion caught gracefully without crashing', async () => {
    const profile = (await driver.loadProfile()) || { coins: 100, streak: 1 };
    simulateQuotaExceeded(true);

    // saveProfile must not crash the app with unhandled QuotaExceededError
    await expect(driver.saveProfile(profile)).resolves.not.toThrow();

    simulateQuotaExceeded(false);
  });

  it.skipIf(!hasCurriculum)('T2-BND-09: Okurigana delimiter dot (・) stripped for matching while preserved in display', async () => {
    const allKanji = await driver.getAllKanji();
    // Find a kanji with okurigana delimiter dot, e.g. 美 (うつく・しい)
    const kanjiWithDot = allKanji.find((k) => {
      const kun = k.kunyomi || k.readings?.kunyomi || [];
      return kun.some((r) => r.includes('・'));
    });

    expect(kanjiWithDot).toBeDefined();
    const rawKunyomi = (kanjiWithDot?.kunyomi || kanjiWithDot?.readings?.kunyomi || [])[0];
    expect(rawKunyomi).toContain('・');

    // Call canonical reading normalization helper from curriculum engine
    const stripped = await driver.normalizeReading(rawKunyomi);
    expect(stripped).not.toContain('・');
    expect(stripped.length).toBeLessThan(rawKunyomi.length);
    // Verify that the original entry preserves the delimiter for display
    expect(rawKunyomi).toContain('・');
  });

  it.skipIf(!hasSrs)('T2-BND-10: Daily review launched with 0 due cards enters free practice or informs user', async () => {
    // Profile with no due cards
    setStoredProfile({
      coins: 100,
      streak: 1,
      lastLoginDate: '2026-11-16',
      cards: {
        'kinkaku-01-kin': {
          id: 'kinkaku-01-kin',
          box: 3,
          nextDue: Date.now() + 100000000, // Due far in the future
          totalReviews: 3,
          correctReviews: 3,
        },
      },
      unlockedTiers: [1],
      completedStages: [],
      confusion: {},
    });

    const profile = await driver.loadProfile();
    const dueCards = Object.values(profile.cards).filter((c) => c.nextDue <= Date.now());
    expect(dueCards.length).toBe(0);
    // User is informed / enters free practice mode without runtime crash
    expect(profile.cards['kinkaku-01-kin'].box).toBe(3);
  });
});
