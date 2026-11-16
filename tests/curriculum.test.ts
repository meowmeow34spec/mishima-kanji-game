/**
 * Salon Mishima - Yukio Mishima Literary Kanji Curriculum Integrity Test Suite
 * File: tests/curriculum.test.ts
 *
 * Verifies:
 * 1. Dataset Inventory & Tier Balance (80 kanji total, exactly 20 per tier)
 * 2. Semantic ID Formatting & Sequential Uniqueness
 * 3. Character Glyph Integrity & Uniqueness (single CJK characters, stroke counts, JLPT, Joyo grades)
 * 4. Literary Compounds Inscription & Furigana Readings
 * 5. Literary Excerpt Inscription & Mishima Oeuvre Attribution
 * 6. Phonetic Readings Orthography (Katakana for On'yomi, Hiragana for Kun'yomi, okurigana delimiter '・')
 * 7. Salon Mishima Cafe Order Item & Gameplay Metadata
 * 8. Query Helper Functions Behavior & Graceful Edge Case Handling
 * 9. Confusing Kanji Boss Pairs Integrity & Duel Challenge Verification
 */

import { describe, it, expect } from 'vitest';
import {
  MISHIMA_KANJI_CURRICULUM,
  TIER_METADATA,
  CURRICULUM_DATASET,
  getAllKanji,
  getKanjiByTier,
  getKanjiById,
  getKanjiByCharacter,
  getTierMeta,
  getKanjiByWork,
} from '../src/data/mishimaCurriculum';
import {
  BOSS_PAIRS,
  getAllBossPairs,
  getBossPairById,
  getBossPairsByTier,
} from '../src/data/bossPairs';
import type {
  CurriculumTierNumber,
} from '../src/types/curriculum';

// Canonical literary works in Mishima's corpus
const CANONICAL_MISHIMA_WORKS = [
  '金閣寺',
  '潮騒',
  '仮面の告白',
  '豊饒の海',
  '春の雪',
  '奔馬',
  '暁の寺',
  '天人五衰',
  '憂国',
  '太陽と鉄',
  '禁色',
  '鹿鳴館',
];

describe('Yukio Mishima Literary Kanji Curriculum Integrity', () => {
  // =========================================================================
  // 1. Dataset Inventory & Tier Distribution
  // =========================================================================
  describe('1. Inventory & Tier Balance', () => {
    it('should contain exactly 80 canonical kanji entries in total', () => {
      const allKanji = getAllKanji();
      expect(allKanji).toBeDefined();
      expect(allKanji).toHaveLength(80);
      expect(MISHIMA_KANJI_CURRICULUM).toHaveLength(80);
      expect(CURRICULUM_DATASET.kanjiList).toHaveLength(80);
      expect(CURRICULUM_DATASET.totalKanjiCount).toBe(80);
    });

    it('should define exactly 4 progressive tiers in metadata', () => {
      expect(TIER_METADATA).toHaveLength(4);
      expect(CURRICULUM_DATASET.tiers).toHaveLength(4);

      TIER_METADATA.forEach((meta, idx) => {
        const expectedTier = (idx + 1) as CurriculumTierNumber;
        expect(meta.tier).toBe(expectedTier);
        expect(meta.kanjiCount).toBe(20);
        expect(typeof meta.name).toBe('string');
        expect(meta.name.trim().length).toBeGreaterThanOrEqual(3);
        expect(typeof meta.subtitle).toBe('string');
        expect(meta.subtitle.trim().length).toBeGreaterThanOrEqual(5);
        expect(typeof meta.themeDescription).toBe('string');
        expect(meta.themeDescription.trim().length).toBeGreaterThanOrEqual(10);
        expect(Array.isArray(meta.primaryWorks)).toBe(true);
        expect(meta.primaryWorks.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should partition exactly 20 kanji into each of the 4 tiers', () => {
      const tierNumbers: CurriculumTierNumber[] = [1, 2, 3, 4];

      tierNumbers.forEach((tier) => {
        const kanjiInTier = getKanjiByTier(tier);
        expect(
          kanjiInTier,
          `Tier ${tier} must contain exactly 20 kanji entries`
        ).toHaveLength(20);

        kanjiInTier.forEach((entry) => {
          expect(entry.tier).toBe(tier);
          expect(typeof entry.tierName).toBe('string');
          expect(entry.tierName.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should ensure no overlap between tiers and 100% coverage across the 4 tiers', () => {
      const all = getAllKanji();
      const combined = [1, 2, 3, 4].flatMap((t) =>
        getKanjiByTier(t as CurriculumTierNumber)
      );

      expect(combined).toHaveLength(80);
      const combinedIds = new Set(combined.map((k) => k.id));
      expect(combinedIds.size).toBe(80);

      all.forEach((entry) => {
        expect(combinedIds.has(entry.id)).toBe(true);
      });
    });
  });

  // =========================================================================
  // 2. Semantic ID Formatting & Uniqueness
  // =========================================================================
  describe('2. Identifier Formatting & Uniqueness', () => {
    it('should have 80 unique, distinct semantic IDs', () => {
      const ids = getAllKanji().map((k) => k.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(80);
    });

    it('should adhere strictly to pattern ^[a-z0-9]+-\\d{2}-[a-z]+$ for every ID', () => {
      const idPattern = /^[a-z0-9]+-\d{2}-[a-z]+$/;

      getAllKanji().forEach((entry) => {
        expect(
          entry.id,
          `ID "${entry.id}" for kanji '${entry.character}' must match pattern /^[a-z0-9]+-\\d{2}-[a-z]+$/`
        ).toMatch(idPattern);
      });
    });

    it('should enforce sequential two-digit indices from 01 to 80', () => {
      getAllKanji().forEach((entry, idx) => {
        const expectedIndexStr = String(idx + 1).padStart(2, '0');
        expect(
          entry.id,
          `Entry index ${idx + 1} (${entry.character}) must contain sequence number -${expectedIndexStr}-`
        ).toContain(`-${expectedIndexStr}-`);
      });
    });

    it('should reflect canonical thematic work prefix per tier', () => {
      getAllKanji().forEach((entry) => {
        if (entry.tier === 1) {
          expect(entry.id.startsWith('kinkaku-')).toBe(true);
        } else if (entry.tier === 2) {
          expect(entry.id.startsWith('shiosai-')).toBe(true);
        } else if (entry.tier === 3) {
          expect(entry.id.startsWith('kamen-')).toBe(true);
        } else if (entry.tier === 4) {
          expect(entry.id.startsWith('yukoku-')).toBe(true);
        }
      });
    });
  });

  // =========================================================================
  // 3. Character Glyphs & Linguistic Attributes
  // =========================================================================
  describe('3. Character Glyphs & Linguistic Attributes', () => {
    it('should contain 80 unique, distinct kanji character glyphs', () => {
      const characters = getAllKanji().map((k) => k.character);
      const uniqueChars = new Set(characters);
      expect(uniqueChars.size).toBe(80);
    });

    it('should verify every glyph is a valid single CJK Unified Ideograph', () => {
      const cjkRegex = /^[\u4E00-\u9FAF\u3400-\u4DBF]$/;

      getAllKanji().forEach((entry) => {
        expect(
          entry.character.length,
          `Kanji '${entry.character}' (${entry.id}) must be exactly 1 character`
        ).toBe(1);
        expect(
          entry.character,
          `Glyph '${entry.character}' (${entry.id}) must be a valid CJK Unified Ideograph`
        ).toMatch(cjkRegex);
      });
    });

    it('should validate stroke counts are positive integers between 1 and 35', () => {
      getAllKanji().forEach((entry) => {
        expect(typeof entry.strokeCount).toBe('number');
        expect(Number.isInteger(entry.strokeCount)).toBe(true);
        expect(
          entry.strokeCount,
          `Kanji '${entry.character}' stroke count out of range: ${entry.strokeCount}`
        ).toBeGreaterThanOrEqual(1);
        expect(entry.strokeCount).toBeLessThanOrEqual(35);
      });
    });

    it('should validate Joyo/Jinmeiyo grade classifications and JLPT ratings', () => {
      const validGrades = [1, 2, 3, 4, 5, 6, 'S', 'Jinmeiyo', 'Hyogai'];
      const validJlpt = ['N5', 'N4', 'N3', 'N2', 'N1'];

      getAllKanji().forEach((entry) => {
        expect(
          validGrades,
          `Invalid grade '${entry.grade}' for kanji '${entry.character}'`
        ).toContain(entry.grade);
        expect(
          validJlpt,
          `Invalid JLPT '${entry.jlptLevel}' for kanji '${entry.character}'`
        ).toContain(entry.jlptLevel);
      });
    });

    it('should have at least one non-empty English meaning per entry', () => {
      getAllKanji().forEach((entry) => {
        expect(
          Array.isArray(entry.meanings),
          `Meanings for '${entry.character}' must be an array`
        ).toBe(true);
        expect(
          entry.meanings.length,
          `Kanji '${entry.character}' must have at least one meaning`
        ).toBeGreaterThanOrEqual(1);

        entry.meanings.forEach((meaning) => {
          expect(typeof meaning).toBe('string');
          expect(meaning.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  // =========================================================================
  // 4. Literary Compounds Inscription & Readings
  // =========================================================================
  describe('4. Literary Compounds Inscription & Readings', () => {
    it('should contain at least one literary compound per kanji', () => {
      getAllKanji().forEach((entry) => {
        expect(
          Array.isArray(entry.literaryCompounds),
          `literaryCompounds for '${entry.character}' must be an array`
        ).toBe(true);
        expect(
          entry.literaryCompounds.length,
          `Kanji '${entry.character}' (${entry.id}) has no literary compounds`
        ).toBeGreaterThanOrEqual(1);
      });
    });

    it('CRITICAL: must guarantee the target kanji glyph is inscribed in every literary compound', () => {
      getAllKanji().forEach((entry) => {
        entry.literaryCompounds.forEach((comp) => {
          expect(
            comp.compound,
            `Target glyph '${entry.character}' (${entry.id}) MUST be present in compound '${comp.compound}'`
          ).toContain(entry.character);
        });
      });
    });

    it('should validate compound readings are valid Hiragana', () => {
      const hiraganaRegex = /^[\u3040-\u309Fー]+$/;

      getAllKanji().forEach((entry) => {
        entry.literaryCompounds.forEach((comp) => {
          expect(
            comp.reading,
            `Compound reading "${comp.reading}" for "${comp.compound}" (${entry.character}) must be in Hiragana`
          ).toMatch(hiraganaRegex);

          expect(typeof comp.meaning).toBe('string');
          expect(comp.meaning.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  // =========================================================================
  // 5. Literary Quotes Inscription & Mishima Oeuvre Attribution
  // =========================================================================
  describe('5. Literary Quotes Inscription & Attribution', () => {
    it('should have a complete literaryQuote structure for every entry', () => {
      getAllKanji().forEach((entry) => {
        const quote = entry.literaryQuote;
        expect(quote, `Missing literaryQuote for ${entry.id}`).toBeDefined();

        expect(typeof quote.originalJapanese).toBe('string');
        expect(quote.originalJapanese.trim().length).toBeGreaterThanOrEqual(5);

        expect(typeof quote.englishTranslation).toBe('string');
        expect(quote.englishTranslation.trim().length).toBeGreaterThanOrEqual(5);

        expect(typeof quote.sourceWork).toBe('string');
        expect(quote.sourceWork.trim().length).toBeGreaterThanOrEqual(2);

        expect(typeof quote.contextNote).toBe('string');
        expect(quote.contextNote.trim().length).toBeGreaterThanOrEqual(2);
      });
    });

    it('CRITICAL: must guarantee the target kanji glyph is inscribed in literaryQuote.originalJapanese', () => {
      getAllKanji().forEach((entry) => {
        expect(
          entry.literaryQuote.originalJapanese,
          `Target glyph '${entry.character}' (${entry.id}) MUST be present in quote '${entry.literaryQuote.originalJapanese}'`
        ).toContain(entry.character);
      });
    });

    it('should attribute quotes and primaryWorks to canonical Mishima texts', () => {
      getAllKanji().forEach((entry) => {
        const quoteWorkMatches = CANONICAL_MISHIMA_WORKS.some((work) =>
          entry.literaryQuote.sourceWork.includes(work)
        );
        expect(
          quoteWorkMatches,
          `Quote sourceWork "${entry.literaryQuote.sourceWork}" for ${entry.id} not in canonical Mishima works`
        ).toBe(true);

        const primaryWorkMatches = CANONICAL_MISHIMA_WORKS.some((work) =>
          entry.primaryWork.includes(work)
        );
        expect(
          primaryWorkMatches,
          `primaryWork "${entry.primaryWork}" for ${entry.id} not in canonical Mishima works`
        ).toBe(true);

        expect(typeof entry.primaryWorkEnglish).toBe('string');
        expect(entry.primaryWorkEnglish.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // =========================================================================
  // 6. Phonetic Readings & Orthography (Onyomi & Kunyomi)
  // =========================================================================
  describe('6. Phonetic Readings & Orthography', () => {
    it('should have at least one valid reading (Onyomi or Kunyomi) per kanji', () => {
      getAllKanji().forEach((entry) => {
        const totalReadings =
          entry.onyomi.length + entry.kunyomi.length;
        expect(
          totalReadings,
          `Kanji '${entry.character}' (${entry.id}) must have at least one reading`
        ).toBeGreaterThan(0);
      });
    });

    it('should enforce that all Onyomi readings are written exclusively in Katakana', () => {
      const katakanaPattern = /^[\u30A0-\u30FF・\-]+$/;

      getAllKanji().forEach((entry) => {
        entry.onyomi.forEach((reading) => {
          expect(
            reading,
            `Onyomi "${reading}" for kanji '${entry.character}' must match Katakana regex`
          ).toMatch(katakanaPattern);
        });
      });
    });

    it('should enforce that all Kunyomi readings are written in Hiragana with optional okurigana delimiter', () => {
      const kunyomiPattern = /^[\u3040-\u309F・\-]+$/;

      getAllKanji().forEach((entry) => {
        entry.kunyomi.forEach((reading) => {
          expect(
            reading,
            `Kunyomi "${reading}" for kanji '${entry.character}' must match Hiragana regex`
          ).toMatch(kunyomiPattern);
        });
      });
    });

    it('should maintain synchronized flat and nested reading structures', () => {
      getAllKanji().forEach((entry) => {
        expect(entry.readings).toBeDefined();
        expect(entry.readings.onyomi).toEqual(entry.onyomi);
        expect(entry.readings.kunyomi).toEqual(entry.kunyomi);
      });
    });
  });

  // =========================================================================
  // 7. Salon Mishima Cafe Order Item & Gameplay Metadata
  // =========================================================================
  describe('7. Cafe Order Item & Gameplay Metadata', () => {
    it('should define a valid cafeOrderItem for every kanji', () => {
      getAllKanji().forEach((entry) => {
        const item = entry.cafeOrderItem;
        expect(item, `Missing cafeOrderItem for ${entry.id}`).toBeDefined();

        expect(typeof item.itemName).toBe('string');
        expect(item.itemName.trim().length).toBeGreaterThan(0);

        expect(typeof item.flavorProfile).toBe('string');
        expect(item.flavorProfile.trim().length).toBeGreaterThan(0);

        expect(typeof item.dialogueLine).toBe('string');
        expect(item.dialogueLine.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty gameplayTags for each kanji', () => {
      getAllKanji().forEach((entry) => {
        expect(Array.isArray(entry.gameplayTags)).toBe(true);
        expect(entry.gameplayTags.length).toBeGreaterThanOrEqual(1);

        entry.gameplayTags.forEach((tag) => {
          expect(typeof tag).toBe('string');
          expect(tag.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  // =========================================================================
  // 8. Query Helper Functions Behavior & Graceful Edge Cases
  // =========================================================================
  describe('8. Query Helper Functions Behavior', () => {
    it('getAllKanji() returns all 80 kanji in consistent sequence', () => {
      const all = getAllKanji();
      expect(all).toHaveLength(80);
      expect(all[0].id).toBe('kinkaku-01-kin');
      expect(all[0].character).toBe('金');
      expect(all[79].id).toBe('yukoku-80-mei');
      expect(all[79].character).toBe('命');
    });

    it('getKanjiByTier() returns correct 20 entries per tier', () => {
      const tier1 = getKanjiByTier(1);
      expect(tier1).toHaveLength(20);
      expect(tier1[0].id).toBe('kinkaku-01-kin');

      const tier2 = getKanjiByTier(2);
      expect(tier2).toHaveLength(20);
      expect(tier2[0].id).toBe('shiosai-21-cho');

      const tier3 = getKanjiByTier(3);
      expect(tier3).toHaveLength(20);
      expect(tier3[0].id).toBe('kamen-41-ka');

      const tier4 = getKanjiByTier(4);
      expect(tier4).toHaveLength(20);
      expect(tier4[0].id).toBe('yukoku-61-yu');
    });

    it('getKanjiByTier() gracefully returns empty array for invalid tiers', () => {
      expect(getKanjiByTier(0 as any)).toEqual([]);
      expect(getKanjiByTier(5 as any)).toEqual([]);
      expect(getKanjiByTier(-1 as any)).toEqual([]);
      expect(getKanjiByTier(99 as any)).toEqual([]);
      expect(getKanjiByTier(NaN as any)).toEqual([]);
    });

    it('getKanjiById() correctly retrieves kanji entries for valid IDs', () => {
      expect(getKanjiById('kinkaku-01-kin')?.character).toBe('金');
      expect(getKanjiById('shiosai-21-cho')?.character).toBe('潮');
      expect(getKanjiById('kamen-41-ka')?.character).toBe('仮');
      expect(getKanjiById('yukoku-61-yu')?.character).toBe('憂');
      expect(getKanjiById('yukoku-80-mei')?.character).toBe('命');
    });

    it('getKanjiById() gracefully returns undefined for non-existent IDs', () => {
      expect(getKanjiById('invalid-id')).toBeUndefined();
      expect(getKanjiById('')).toBeUndefined();
      expect(getKanjiById('kinkaku-99-nonexistent')).toBeUndefined();
    });

    it('getKanjiByCharacter() retrieves correct entry or returns undefined', () => {
      expect(getKanjiByCharacter('金')?.id).toBe('kinkaku-01-kin');
      expect(getKanjiByCharacter('潮')?.id).toBe('shiosai-21-cho');
      expect(getKanjiByCharacter('仮')?.id).toBe('kamen-41-ka');
      expect(getKanjiByCharacter('憂')?.id).toBe('yukoku-61-yu');
      expect(getKanjiByCharacter('命')?.id).toBe('yukoku-80-mei');

      expect(getKanjiByCharacter('漢')).toBeUndefined();
      expect(getKanjiByCharacter('')).toBeUndefined();
    });

    it('getTierMeta() retrieves metadata for valid tiers and undefined for invalid', () => {
      const meta1 = getTierMeta(1);
      expect(meta1).toBeDefined();
      expect(meta1?.tier).toBe(1);
      expect(meta1?.kanjiCount).toBe(20);

      const meta4 = getTierMeta(4);
      expect(meta4).toBeDefined();
      expect(meta4?.tier).toBe(4);

      expect(getTierMeta(0 as any)).toBeUndefined();
      expect(getTierMeta(5 as any)).toBeUndefined();
    });

    it('getKanjiByWork() filters kanji entries by primary and related works', () => {
      const kinkakuKanji = getKanjiByWork('金閣寺');
      expect(kinkakuKanji.length).toBeGreaterThanOrEqual(10);
      expect(kinkakuKanji.some((k) => k.character === '金')).toBe(true);

      const shiosaiKanji = getKanjiByWork('潮騒');
      expect(shiosaiKanji.length).toBeGreaterThanOrEqual(10);
      expect(shiosaiKanji.some((k) => k.character === '潮')).toBe(true);

      const nonExistent = getKanjiByWork('NonExistentNovel');
      expect(nonExistent).toEqual([]);
    });
  });

  // =========================================================================
  // 9. Confusing Kanji Boss Pairs Integrity
  // =========================================================================
  describe('9. Confusing Kanji Boss Pairs Integrity', () => {
    it('should export BOSS_PAIRS array containing 8 rich boss encounters', () => {
      expect(Array.isArray(BOSS_PAIRS)).toBe(true);
      expect(BOSS_PAIRS.length).toBe(8);
      expect(getAllBossPairs()).toHaveLength(8);
    });

    it('should ensure each boss encounter has unique IDs and valid titles', () => {
      const ids = BOSS_PAIRS.map((b) => b.id);
      expect(new Set(ids).size).toBe(BOSS_PAIRS.length);

      BOSS_PAIRS.forEach((boss) => {
        expect(typeof boss.id).toBe('string');
        expect(boss.id.startsWith('boss-')).toBe(true);

        expect(typeof boss.title).toBe('string');
        expect(boss.title.trim().length).toBeGreaterThan(0);

        expect(typeof boss.subtitle).toBe('string');
        expect(boss.subtitle.trim().length).toBeGreaterThan(0);

        expect(boss.bossHp).toBeGreaterThanOrEqual(8);
        expect(boss.timeLimitSeconds).toBeGreaterThanOrEqual(3.0);
      });
    });

    it('should verify characterA and characterB are distinct single CJK characters', () => {
      BOSS_PAIRS.forEach((boss) => {
        expect(boss.characterA.length).toBe(1);
        expect(boss.characterB.length).toBe(1);
        expect(boss.characterA).not.toBe(boss.characterB);

        if (boss.additionalCharacters) {
          expect(Array.isArray(boss.additionalCharacters)).toBe(true);
          boss.additionalCharacters.forEach((char) => {
            expect(char.length).toBe(1);
            expect(char).not.toBe(boss.characterA);
          });
        }
      });
    });

    it('should provide comprehensive distinctionNotes and mnemonicTips', () => {
      BOSS_PAIRS.forEach((boss) => {
        expect(typeof boss.distinctionNotes).toBe('string');
        expect(boss.distinctionNotes.trim().length).toBeGreaterThanOrEqual(15);

        expect(typeof boss.mnemonicTip).toBe('string');
        expect(boss.mnemonicTip.trim().length).toBeGreaterThanOrEqual(10);
      });
    });

    it('should contain dictionaries for meanings and readings for all characters involved', () => {
      BOSS_PAIRS.forEach((boss) => {
        const characters = [
          boss.characterA,
          boss.characterB,
          ...(boss.additionalCharacters || []),
        ];

        characters.forEach((char) => {
          expect(
            boss.meanings[char],
            `Boss ${boss.id} missing meaning for '${char}'`
          ).toBeDefined();
          expect(boss.meanings[char].trim().length).toBeGreaterThan(0);

          expect(
            boss.readings[char],
            `Boss ${boss.id} missing readings for '${char}'`
          ).toBeDefined();
          expect(
            boss.readings[char].onyomi.length +
              boss.readings[char].kunyomi.length
          ).toBeGreaterThan(0);
        });
      });
    });

    it('should contain pre-configured boss quiz questions with valid options and correct answers', () => {
      BOSS_PAIRS.forEach((boss) => {
        expect(Array.isArray(boss.questions)).toBe(true);
        expect(boss.questions.length).toBeGreaterThanOrEqual(2);

        boss.questions.forEach((q) => {
          expect(typeof q.id).toBe('string');
          expect(['glyph_to_sound', 'sound_to_glyph', 'meaning_to_glyph']).toContain(
            q.type
          );
          expect(typeof q.prompt).toBe('string');
          expect(q.prompt.trim().length).toBeGreaterThan(0);
          expect(q.options.length).toBeGreaterThanOrEqual(2);

          const correctOptions = q.options.filter((opt) => opt.isCorrect);
          expect(
            correctOptions.length,
            `Question ${q.id} in ${boss.id} must have exactly 1 correct option`
          ).toBe(1);

          expect(typeof q.correctAnswer).toBe('string');
          expect(q.correctAnswer.trim().length).toBeGreaterThan(0);

          expect(typeof q.explanation).toBe('string');
          expect(q.explanation.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should verify curriculum target characters in boss duels exist in 80-kanji curriculum', () => {
      const allKanjiSet = new Set(getAllKanji().map((k) => k.character));

      // Key curriculum boss targets that MUST exist in the 80 kanji curriculum:
      const curriculumBossTargets = ['寺', '炎', '憂', '閣', '魂', '刃', '輪'];

      curriculumBossTargets.forEach((targetChar) => {
        expect(
          allKanjiSet.has(targetChar),
          `Boss target kanji '${targetChar}' must be in the canonical 80-kanji dataset`
        ).toBe(true);
      });
    });

    it('getBossPairById() and getBossPairsByTier() helper functions return expected results', () => {
      const boss1 = getBossPairById('boss-01-ji-samurai');
      expect(boss1).toBeDefined();
      expect(boss1?.characterA).toBe('寺');
      expect(boss1?.characterB).toBe('侍');

      expect(getBossPairById('non-existent-boss')).toBeUndefined();

      const tier1Bosses = getBossPairsByTier(1);
      expect(tier1Bosses.length).toBeGreaterThanOrEqual(2);

      const specialBosses = getBossPairsByTier('special');
      expect(specialBosses.length).toBe(1);
      expect(specialBosses[0].id).toBe('boss-08-mishima-grand');
    });
  });
});
