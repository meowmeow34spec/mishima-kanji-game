/**
 * Salon Mishima - SRS & Persistence Type Definitions
 * File: src/types/srs.ts
 */

export const STORAGE_KEY = 'mishima-cafe/v1';

export const LEITNER_INTERVALS_DAYS = [0, 1, 2, 4, 7, 14, 30] as const;
export type LeitnerBoxIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CardProgress {
  /** Target kanji identifier (e.g. 'kinkaku-01-kin') */
  id: string;
  /** Current Leitner box: 0 (unreviewed) to 6 (mastered) */
  box: number;
  /** Scheduled due timestamp in epoch milliseconds */
  nextDue: number;
  /** Total cumulative reviews */
  totalReviews: number;
  /** Total successful reviews */
  correctReviews: number;
  /** Timestamp in epoch milliseconds of last review */
  lastReviewed?: number;
}

/** Mapping of targetKanjiId -> mistakenOption/glyph -> error frequency count */
export type ConfusionMatrix = Record<string, Record<string, number>>;

export interface AudioSettings {
  muted: boolean;
  sfxVolume: number;
  bgmVolume: number;
}

export interface PlayerProfileSettings {
  isMuted?: boolean;
  bgmVolume?: number;
  sfxVolume?: number;
  voiceEnabled?: boolean;
}

export interface PlayerProfile {
  version: 1;
  coins: number;
  streak: number;
  /** Last login date in ISO calendar format: 'YYYY-MM-DD' */
  lastLoginDate: string;
  cards: Record<string, CardProgress>;
  unlockedTiers: number[];
  completedStages: string[];
  confusion: ConfusionMatrix;
  audioSettings: AudioSettings;
  settings?: PlayerProfileSettings;
}

export interface ReviewResult {
  card: CardProgress;
  promoted: boolean;
  previousBox: number;
  newBox: number;
  intervalDays: number;
}
