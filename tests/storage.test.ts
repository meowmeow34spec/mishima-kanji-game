/**
 * Salon Mishima - LocalStorage Persistence Subsystem Unit Tests
 * File: tests/storage.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY,
  createDefaultProfile,
  loadProfile,
  saveProfile,
  recordReviewResult,
  recordDailyLogin,
  getCalendarDayDifference,
  clearProfile,
  hasProfile,
  getTodayDateString,
} from '../src/srs/storageManager';
import { setSimulateQuotaError } from './setup';

describe('Salon Mishima - LocalStorage Persistence & Profile Manager Unit Tests', () => {
  beforeEach(() => {
    clearProfile();
    setSimulateQuotaError(false);
  });

  // =========================================================================
  // 1. Initialization & Default Profile
  // =========================================================================
  describe('1. Default Profile Initialization', () => {
    it('STO-01: should initialize and return valid default profile when storage is empty', () => {
      const profile = loadProfile();
      expect(profile).toBeDefined();
      expect(profile.version).toBe(1);
      expect(profile.coins).toBe(100);
      expect(profile.streak).toBe(1);
    });

    it('STO-02: default profile should have unlockedTiers [1] and empty collections', () => {
      const profile = createDefaultProfile();
      expect(profile.unlockedTiers).toEqual([1]);
      expect(profile.completedStages).toEqual([]);
      expect(profile.cards).toEqual({});
      expect(profile.confusion).toEqual({});
    });

    it('STO-03: default profile should set lastLoginDate to current date in YYYY-MM-DD format', () => {
      const profile = createDefaultProfile();
      expect(profile.lastLoginDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(profile.lastLoginDate).toBe(getTodayDateString());
    });

    it('STO-04: default profile should initialize synchronized audioSettings and settings', () => {
      const profile = createDefaultProfile();
      expect(profile.audioSettings.muted).toBe(false);
      expect(profile.audioSettings.sfxVolume).toBe(0.8);
      expect(profile.audioSettings.bgmVolume).toBe(0.5);

      expect(profile.settings?.isMuted).toBe(false);
      expect(profile.settings?.sfxVolume).toBe(0.8);
      expect(profile.settings?.bgmVolume).toBe(0.5);
    });
  });

  // =========================================================================
  // 2. Round-Trip Serialization & Deserialization
  // =========================================================================
  describe('2. Serialization & Round-Trip Integrity', () => {
    it('STO-05: should save profile under exact localStorage key "mishima-cafe/v1"', () => {
      const profile = createDefaultProfile({ coins: 350 });
      saveProfile(profile);

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.coins).toBe(350);
    });

    it('STO-06: should restore saved profile with identical coins, streak, cards, stages, confusion', () => {
      const profile = createDefaultProfile({
        coins: 520,
        streak: 4,
        cards: {
          'kinkaku-01-kin': {
            id: 'kinkaku-01-kin',
            box: 3,
            nextDue: 1763337600000,
            totalReviews: 5,
            correctReviews: 4,
            lastReviewed: 1763300000000,
          },
        },
        unlockedTiers: [1, 2],
        completedStages: ['stage-1', 'stage-2'],
        confusion: { '寺': { '侍': 2 } },
      });
      saveProfile(profile);

      const loaded = loadProfile();
      expect(loaded.coins).toBe(520);
      expect(loaded.streak).toBe(4);
      expect(loaded.cards['kinkaku-01-kin'].box).toBe(3);
      expect(loaded.unlockedTiers).toEqual([1, 2]);
      expect(loaded.completedStages).toEqual(['stage-1', 'stage-2']);
      expect(loaded.confusion['寺']['侍']).toBe(2);
    });

    it('STO-07: should clear profile completely when clearProfile() is called', () => {
      saveProfile(createDefaultProfile());
      expect(hasProfile()).toBe(true);
      clearProfile();
      expect(hasProfile()).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('STO-08: should accurately report profile existence via hasProfile()', () => {
      expect(hasProfile()).toBe(false);
      saveProfile(createDefaultProfile());
      expect(hasProfile()).toBe(true);
    });
  });

  // =========================================================================
  // 3. Corrupted Data Self-Healing & Resilience
  // =========================================================================
  describe('3. Corrupted JSON Recovery & Fault Tolerance', () => {
    it('STO-09: should catch malformed JSON syntax error and fall back to default profile', () => {
      localStorage.setItem(STORAGE_KEY, '<<{CORRUPT_MALFORMED_JSON>>');
      const profile = loadProfile();
      expect(profile).toBeDefined();
      expect(typeof profile.coins).toBe('number');
      expect(profile.coins).toBe(100);
      expect(profile.unlockedTiers).toContain(1);
    });

    it('STO-10: should fall back to default profile when storage contains non-object JSON ("42", "true", "null")', () => {
      localStorage.setItem(STORAGE_KEY, '42');
      expect(loadProfile().unlockedTiers).toEqual([1]);

      localStorage.setItem(STORAGE_KEY, 'true');
      expect(loadProfile().unlockedTiers).toEqual([1]);

      localStorage.setItem(STORAGE_KEY, 'null');
      expect(loadProfile().unlockedTiers).toEqual([1]);
    });

    it('STO-11: should fall back to default profile when storage contains JSON array ("[]")', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
      const profile = loadProfile();
      expect(profile.unlockedTiers).toEqual([1]);
      expect(profile.cards).toEqual({});
    });

    it('STO-12: should heal corrupted storage: saving profile overwrites malformed data with valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'MALFORMED_JUNK');
      const profile = loadProfile();
      profile.coins = 200;
      saveProfile(profile);

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toContain('MALFORMED_JUNK');
      const reloaded = loadProfile();
      expect(reloaded.coins).toBe(200);
    });
  });

  // =========================================================================
  // 4. Partial / Legacy Profile Schema Reconciliation
  // =========================================================================
  describe('4. Legacy / Partial Profile Reconciliation', () => {
    it('STO-13: should merge partial profile (e.g. { coins: 350, streak: 4 }) with default values', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ coins: 350, streak: 4 }));
      const profile = loadProfile();

      expect(profile.coins).toBe(350);
      expect(profile.streak).toBe(4);
      expect(profile.cards).toEqual({});
      expect(profile.unlockedTiers).toEqual([1]);
      expect(profile.completedStages).toEqual([]);
      expect(profile.confusion).toEqual({});
      expect(profile.audioSettings.muted).toBe(false);
    });

    it('STO-14: should ensure unlockedTiers contains at least [1] if empty or omitted', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ coins: 100, unlockedTiers: [] }));
      const profile = loadProfile();
      expect(profile.unlockedTiers).toEqual([1]);
    });

    it('STO-15: should synchronize audioSettings and settings alias', () => {
      const profile = createDefaultProfile();
      profile.audioSettings.muted = true;
      profile.audioSettings.sfxVolume = 0.4;
      saveProfile(profile);

      const loaded = loadProfile();
      expect(loaded.audioSettings.muted).toBe(true);
      expect(loaded.settings?.isMuted).toBe(true);
      expect(loaded.settings?.sfxVolume).toBe(0.4);
    });
  });

  // =========================================================================
  // 5. Storage Quota Exceeded Resilience
  // =========================================================================
  describe('5. Storage Quota Exceeded Handling', () => {
    it('STO-16: should catch QuotaExceededError in saveProfile without throwing uncaught exception', () => {
      const profile = createDefaultProfile();
      setSimulateQuotaError(true);
      expect(() => saveProfile(profile)).not.toThrow();
      setSimulateQuotaError(false);
    });

    it('STO-17: should resume successful persistence when storage space becomes available', () => {
      const profile = createDefaultProfile({ coins: 999 });
      setSimulateQuotaError(true);
      saveProfile(profile);

      setSimulateQuotaError(false);
      saveProfile(profile);
      const reloaded = loadProfile();
      expect(reloaded.coins).toBe(999);
    });
  });

  // =========================================================================
  // 6. Calendar Day Streak Calculation
  // =========================================================================
  describe('6. Daily Login Streak Logic', () => {
    it('STO-18: should compute exact calendar day differences', () => {
      expect(getCalendarDayDifference('2026-11-16', '2026-11-16')).toBe(0);
      expect(getCalendarDayDifference('2026-11-15', '2026-11-16')).toBe(1);
      expect(getCalendarDayDifference('2026-11-14', '2026-11-16')).toBe(2);
      expect(getCalendarDayDifference('2026-10-31', '2026-11-01')).toBe(1);
      expect(getCalendarDayDifference('2026-12-31', '2027-01-01')).toBe(1);
    });

    it('STO-19: should increment streak by 1 on consecutive calendar day login (yesterday -> today)', () => {
      const profile = createDefaultProfile({
        streak: 2,
        lastLoginDate: '2026-11-15',
      });
      saveProfile(profile);

      const updated = recordDailyLogin('2026-11-16');
      expect(updated.streak).toBe(3);
      expect(updated.lastLoginDate).toBe('2026-11-16');

      const reloaded = loadProfile();
      expect(reloaded.streak).toBe(3);
    });

    it('STO-20: should preserve streak on multiple logins on the same calendar day', () => {
      const profile = createDefaultProfile({
        streak: 3,
        lastLoginDate: '2026-11-16',
      });
      saveProfile(profile);

      const updated = recordDailyLogin('2026-11-16');
      expect(updated.streak).toBe(3);
      expect(updated.lastLoginDate).toBe('2026-11-16');
    });

    it('STO-21: should reset streak to 1 on skipped day login (gap >= 2 days)', () => {
      const profile = createDefaultProfile({
        streak: 5,
        lastLoginDate: '2026-11-16',
      });
      saveProfile(profile);

      const updated = recordDailyLogin('2026-11-18');
      expect(updated.streak).toBe(1);
      expect(updated.lastLoginDate).toBe('2026-11-18');

      const reloaded = loadProfile();
      expect(reloaded.streak).toBe(1);
    });

    it('STO-22: should handle profile object passed to recordDailyLogin', () => {
      const profile = createDefaultProfile({
        streak: 1,
        lastLoginDate: '2026-11-15',
      });
      const updated = recordDailyLogin(profile, '2026-11-16');
      expect(updated.streak).toBe(2);
      expect(updated.lastLoginDate).toBe('2026-11-16');
    });
  });

  // =========================================================================
  // 7. recordReviewResult Integration
  // =========================================================================
  describe('7. recordReviewResult Integration', () => {
    it('STO-23: should promote card and persist profile to storage on correct review', () => {
      const now = 1700000000000;
      const profile = recordReviewResult('kinkaku-01-kin', true, undefined, now);
      expect(profile.cards['kinkaku-01-kin']).toBeDefined();
      expect(profile.cards['kinkaku-01-kin'].box).toBe(1);

      const reloaded = loadProfile();
      expect(reloaded.cards['kinkaku-01-kin'].box).toBe(1);
    });

    it('STO-24: should demote card to Box 1, log confusion, and persist on mistaken review', () => {
      const now = 1700000000000;
      const profile = recordReviewResult('kinkaku-03-ji', false, '侍', now);
      expect(profile.cards['kinkaku-03-ji'].box).toBe(1);
      expect(profile.confusion['kinkaku-03-ji']['侍']).toBe(1);

      const reloaded = loadProfile();
      expect(reloaded.cards['kinkaku-03-ji'].box).toBe(1);
      expect(reloaded.confusion['kinkaku-03-ji']['侍']).toBe(1);
    });
  });
});
