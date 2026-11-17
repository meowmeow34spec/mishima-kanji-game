/**
 * Salon Mishima - SRS Leitner Engine Unit Tests
 * File: tests/srs.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  LEITNER_INTERVALS_DAYS,
  createInitialCard,
  promoteCard,
  demoteCard,
  getDueKanji,
  calculateWeaknessScore,
  getWeakestKanji,
  recordConfusion,
  getDistractors,
} from '../src/srs/leitnerEngine';
import { CardProgress, ConfusionMatrix } from '../src/types/srs';

const MS_PER_DAY = 86_400_000;

describe('Salon Mishima - 7-Box Leitner SRS Engine Unit Tests', () => {
  // =========================================================================
  // 1. Leitner Intervals & Initialization
  // =========================================================================
  describe('1. Leitner Intervals & Initialization', () => {
    it('SRS-01: should define exact 7 Leitner intervals: [0, 1, 2, 4, 7, 14, 30] days', () => {
      expect(LEITNER_INTERVALS_DAYS).toEqual([0, 1, 2, 4, 7, 14, 30]);
      expect(LEITNER_INTERVALS_DAYS.length).toBe(7);
    });

    it('SRS-02: should create an unreviewed initial card in Box 0 with nextDue 0', () => {
      const card = createInitialCard('kinkaku-01-kin');
      expect(card.id).toBe('kinkaku-01-kin');
      expect(card.box).toBe(0);
      expect(card.nextDue).toBe(0);
      expect(card.totalReviews).toBe(0);
      expect(card.correctReviews).toBe(0);
      expect(card.lastReviewed).toBe(0);
    });

    it('SRS-03: should calculate interval in milliseconds accurately (days * 86,400,000)', () => {
      expect(LEITNER_INTERVALS_DAYS[1] * MS_PER_DAY).toBe(86_400_000);
      expect(LEITNER_INTERVALS_DAYS[2] * MS_PER_DAY).toBe(172_800_000);
      expect(LEITNER_INTERVALS_DAYS[6] * MS_PER_DAY).toBe(2_592_000_000);
    });
  });

  // =========================================================================
  // 2. Leitner Box Promotion Mechanics
  // =========================================================================
  describe('2. Leitner Box Promotion on Correct Review', () => {
    it('SRS-04: should promote Box 0 to Box 1 with 1-day interval (nextDue = now + 1d)', () => {
      const now = 1700000000000;
      const initial = createInitialCard('test-card');
      const promoted = promoteCard(initial, now);

      expect(promoted.box).toBe(1);
      expect(promoted.nextDue).toBe(now + 1 * MS_PER_DAY);
      expect(promoted.totalReviews).toBe(1);
      expect(promoted.correctReviews).toBe(1);
      expect(promoted.lastReviewed).toBe(now);
    });

    it('SRS-05: should promote card incrementally through Boxes 1 to 6 with exact intervals', () => {
      const now = 1700000000000;
      let card: CardProgress = {
        id: 'test',
        box: 1,
        nextDue: now,
        totalReviews: 1,
        correctReviews: 1,
      };

      // Box 1 -> Box 2 (interval: 2 days)
      card = promoteCard(card, now);
      expect(card.box).toBe(2);
      expect(card.nextDue).toBe(now + 2 * MS_PER_DAY);

      // Box 2 -> Box 3 (interval: 4 days)
      card = promoteCard(card, now);
      expect(card.box).toBe(3);
      expect(card.nextDue).toBe(now + 4 * MS_PER_DAY);

      // Box 3 -> Box 4 (interval: 7 days)
      card = promoteCard(card, now);
      expect(card.box).toBe(4);
      expect(card.nextDue).toBe(now + 7 * MS_PER_DAY);

      // Box 4 -> Box 5 (interval: 14 days)
      card = promoteCard(card, now);
      expect(card.box).toBe(5);
      expect(card.nextDue).toBe(now + 14 * MS_PER_DAY);

      // Box 5 -> Box 6 (interval: 30 days)
      card = promoteCard(card, now);
      expect(card.box).toBe(6);
      expect(card.nextDue).toBe(now + 30 * MS_PER_DAY);
    });

    it('SRS-06: should cap promotion at Box 6 (Box 6 card remains in Box 6 with 30-day interval)', () => {
      const now = 1700000000000;
      const mastered: CardProgress = {
        id: 'mastered',
        box: 6,
        nextDue: now,
        totalReviews: 10,
        correctReviews: 10,
      };
      const promoted = promoteCard(mastered, now);
      expect(promoted.box).toBe(6);
      expect(promoted.nextDue).toBe(now + 30 * MS_PER_DAY);
      expect(promoted.totalReviews).toBe(11);
      expect(promoted.correctReviews).toBe(11);
    });

    it('SRS-07: should return a new immutable CardProgress object without mutating input', () => {
      const initial: CardProgress = {
        id: 'immutable-test',
        box: 1,
        nextDue: 1000,
        totalReviews: 1,
        correctReviews: 1,
      };
      const copy = { ...initial };
      const promoted = promoteCard(initial, 2000);

      expect(initial).toEqual(copy);
      expect(promoted).not.toBe(initial);
    });
  });

  // =========================================================================
  // 3. Leitner Box Demotion Mechanics
  // =========================================================================
  describe('3. Leitner Box Demotion on Mistake', () => {
    it('SRS-08: should demote higher box cards (Box 6, 5, 4, 3, 2) directly to Box 1 with 1-day interval', () => {
      const now = 1700000000000;
      for (const startBox of [2, 3, 4, 5, 6]) {
        const card: CardProgress = {
          id: `card-box-${startBox}`,
          box: startBox,
          nextDue: now,
          totalReviews: 5,
          correctReviews: 4,
        };
        const demoted = demoteCard(card, now);
        expect(demoted.box).toBe(1);
        expect(demoted.nextDue).toBe(now + 1 * MS_PER_DAY);
        expect(demoted.totalReviews).toBe(6);
        expect(demoted.correctReviews).toBe(4);
        expect(demoted.lastReviewed).toBe(now);
      }
    });

    it('SRS-09: should keep Box 1 cards in Box 1 upon mistake (resets nextDue to now + 1d)', () => {
      const now = 1700000000000;
      const card: CardProgress = {
        id: 'box-1-card',
        box: 1,
        nextDue: now - 5000,
        totalReviews: 2,
        correctReviews: 1,
      };
      const demoted = demoteCard(card, now);
      expect(demoted.box).toBe(1);
      expect(demoted.nextDue).toBe(now + 1 * MS_PER_DAY);
    });

    it('SRS-10: should return a new immutable CardProgress object on demotion', () => {
      const initial: CardProgress = {
        id: 'demote-immutable',
        box: 3,
        nextDue: 1000,
        totalReviews: 3,
        correctReviews: 3,
      };
      const copy = { ...initial };
      const demoted = demoteCard(initial, 2000);

      expect(initial).toEqual(copy);
      expect(demoted).not.toBe(initial);
    });
  });

  // =========================================================================
  // 4. Due Kanji Filtering & Scheduling
  // =========================================================================
  describe('4. Due Cards Filtering & Scheduling', () => {
    it('SRS-11: should filter cards where nextDue <= now and box > 0', () => {
      const now = 1700000000000;
      const cards: Record<string, CardProgress> = {
        unreviewed: { id: 'unreviewed', box: 0, nextDue: 0, totalReviews: 0, correctReviews: 0 },
        dueBox1: { id: 'dueBox1', box: 1, nextDue: now - 10000, totalReviews: 1, correctReviews: 1 },
        dueBox2: { id: 'dueBox2', box: 2, nextDue: now, totalReviews: 2, correctReviews: 2 },
        futureBox3: { id: 'futureBox3', box: 3, nextDue: now + 50000, totalReviews: 3, correctReviews: 3 },
      };

      const due = getDueKanji(cards, now);
      expect(due.length).toBe(2);
      expect(due.map((c) => c.id)).toEqual(['dueBox1', 'dueBox2']);
    });

    it('SRS-12: should prioritize lower box cards in due cards order', () => {
      const now = 1700000000000;
      const cards: CardProgress[] = [
        { id: 'box3', box: 3, nextDue: now - 1000, totalReviews: 5, correctReviews: 5 },
        { id: 'box1', box: 1, nextDue: now - 500, totalReviews: 2, correctReviews: 1 },
        { id: 'box2', box: 2, nextDue: now - 800, totalReviews: 3, correctReviews: 2 },
      ];

      const due = getDueKanji(cards, now);
      expect(due.map((c) => c.id)).toEqual(['box1', 'box2', 'box3']);
    });

    it('SRS-13: should return an empty array if no cards are due', () => {
      const now = 1700000000000;
      const cards: CardProgress[] = [
        { id: 'future1', box: 2, nextDue: now + 10000, totalReviews: 2, correctReviews: 2 },
        { id: 'unreviewed', box: 0, nextDue: 0, totalReviews: 0, correctReviews: 0 },
      ];
      expect(getDueKanji(cards, now)).toEqual([]);
    });
  });

  // =========================================================================
  // 5. Confusion Matrix & Weakness Ranking
  // =========================================================================
  describe('5. Confusion Matrix & Weakness Ranking', () => {
    it('SRS-14: should log mistaken option in confusion matrix: confusion[targetId][mistakeId] = 1', () => {
      let conf: ConfusionMatrix = {};
      conf = recordConfusion(conf, '寺', '侍');

      expect(conf['寺']).toBeDefined();
      expect(conf['寺']['侍']).toBe(1);
    });

    it('SRS-15: should increment count on repeated mistakes for the same pair', () => {
      let conf: ConfusionMatrix = {};
      conf = recordConfusion(conf, '寺', '侍');
      conf = recordConfusion(conf, '寺', '侍');
      conf = recordConfusion(conf, '寺', '侍');

      expect(conf['寺']['侍']).toBe(3);
    });

    it('SRS-16: should track multiple distinct mistaken options for a single target kanji', () => {
      let conf: ConfusionMatrix = {};
      conf = recordConfusion(conf, '寺', '侍');
      conf = recordConfusion(conf, '寺', '待');

      expect(conf['寺']['侍']).toBe(1);
      expect(conf['寺']['待']).toBe(1);
    });

    it('SRS-17: should ignore self-confusion (targetId === mistakeId)', () => {
      let conf: ConfusionMatrix = {};
      conf = recordConfusion(conf, '金', '金');
      expect(conf['金']).toBeUndefined();
    });

    it('SRS-18: should calculate weakness score incorporating error rate, box level, and days overdue', () => {
      const now = 1700000000000;
      const weakCard: CardProgress = {
        id: 'weak',
        box: 1,
        nextDue: now - 2 * MS_PER_DAY,
        totalReviews: 4,
        correctReviews: 1, // 75% error rate
      };
      const strongCard: CardProgress = {
        id: 'strong',
        box: 6,
        nextDue: now + 20 * MS_PER_DAY,
        totalReviews: 10,
        correctReviews: 10, // 0% error rate
      };

      const weakScore = calculateWeaknessScore(weakCard, now);
      const strongScore = calculateWeaknessScore(strongCard, now);
      expect(weakScore).toBeGreaterThan(strongScore);
    });

    it('SRS-19: should rank weakest kanji cards descending by weakness score', () => {
      const now = 1700000000000;
      const cards: Record<string, CardProgress> = {
        cardA: { id: 'cardA', box: 5, nextDue: now + 100000, totalReviews: 5, correctReviews: 5 },
        cardB: { id: 'cardB', box: 1, nextDue: now - 10000, totalReviews: 5, correctReviews: 1 },
        cardC: { id: 'cardC', box: 2, nextDue: now, totalReviews: 4, correctReviews: 3 },
      };

      const weakest = getWeakestKanji(cards, 2, now);
      expect(weakest.length).toBe(2);
      expect(weakest[0].id).toBe('cardB');
    });

    it('SRS-20: should generate distractors prioritizing confusion matrix options', () => {
      const confusion: ConfusionMatrix = {
        '寺': { '侍': 5, '待': 2 },
      };
      const pool = ['寺', '侍', '待', '持', '詩', '時'];
      const distractors = getDistractors('寺', pool, 3, confusion);

      expect(distractors).toHaveLength(3);
      expect(distractors).not.toContain('寺');
      expect(distractors[0]).toBe('侍');
      expect(distractors[1]).toBe('待');
    });

    it('SRS-21: should generate distractors using entry objects with tier prioritization', () => {
      const pool = [
        { id: 'k1', character: '寺', tier: 1 },
        { id: 'k2', character: '侍', tier: 1 },
        { id: 'k3', character: '待', tier: 1 },
        { id: 'k4', character: '潮', tier: 2 },
        { id: 'k5', character: '騒', tier: 2 },
      ];
      const distractors = getDistractors({ id: 'k1', character: '寺', tier: 1 }, pool, 2);
      expect(distractors).toHaveLength(2);
      expect(distractors.map((d) => d.id)).not.toContain('k1');
    });

    it('SRS-22: should return strictly unique distractors without duplicates when pool contains duplicate strings', () => {
      // Pool with identical items
      const dupPool = ['侍', '侍', '侍', '寺'];
      const distractors1 = getDistractors('寺', dupPool, 3);
      expect(distractors1).toHaveLength(1);
      expect(distractors1[0]).toBe('侍');

      // Pool with multiple duplicate candidates
      const dupPool2 = ['侍', '侍', '待', '待', '持', '持', '寺'];
      const distractors2 = getDistractors('寺', dupPool2, 3);
      expect(distractors2).toHaveLength(3);
      expect(new Set(distractors2).size).toBe(3);
      expect(distractors2).not.toContain('寺');
    });

    it('SRS-23: should return strictly unique distractors without duplicates when pool contains duplicate objects or same characters', () => {
      const poolWithDuplicateChars = [
        { id: 'obj-samurai-1', character: '侍', tier: 1 },
        { id: 'obj-samurai-2', character: '侍', tier: 1 },
        { id: 'obj-wait-1', character: '待', tier: 1 },
        { id: 'obj-wait-2', character: '待', tier: 1 },
        { id: 'obj-hold-1', character: '持', tier: 1 },
      ];
      const distractors = getDistractors({ id: 'obj-temple', character: '寺', tier: 1 }, poolWithDuplicateChars, 3);
      expect(distractors).toHaveLength(3);
      const chars = distractors.map((d) => d.character);
      expect(new Set(chars).size).toBe(3);
      expect(chars).not.toContain('寺');
    });

    it('SRS-24: should never leak target kanji into distractors when target is provided as ID string and pool has raw characters or confusion', () => {
      const pool = ['金', '侍', '寺', '待'];
      const conf = recordConfusion({}, 'kinkaku-01-kin', '金');
      const distractors = getDistractors('kinkaku-01-kin', pool, 3, conf);

      expect(distractors).toHaveLength(3);
      expect(distractors).not.toContain('金');
      expect(distractors).not.toContain('kinkaku-01-kin');

      // Also ensure forced confusion cannot inject the target character
      const forcedConf: ConfusionMatrix = {
        'kinkaku-01-kin': { '金': 99, '侍': 5 },
      };
      const distractorsForced = getDistractors('kinkaku-01-kin', pool, 3, forcedConf);
      expect(distractorsForced).not.toContain('金');
      expect(distractorsForced).not.toContain('kinkaku-01-kin');
      expect(distractorsForced).toContain('侍');
    });

    it('SRS-25: should reject self-confusion in recordConfusion across format and character equivalence', () => {
      let conf: ConfusionMatrix = {};
      // ID string vs raw character
      conf = recordConfusion(conf, 'kinkaku-01-kin', '金');
      expect(conf['kinkaku-01-kin']).toBeUndefined();

      // Raw character vs ID string
      conf = recordConfusion(conf, '金', 'kinkaku-01-kin');
      expect(conf['金']).toBeUndefined();

      // Identical ID
      conf = recordConfusion(conf, 'kinkaku-01-kin', 'kinkaku-01-kin');
      expect(conf['kinkaku-01-kin']).toBeUndefined();

      // Valid distinct pair should still be recorded
      conf = recordConfusion(conf, 'kinkaku-01-kin', '侍');
      expect(conf['kinkaku-01-kin']).toBeDefined();
      expect(conf['kinkaku-01-kin']['侍']).toBe(1);
    });
  });
});
