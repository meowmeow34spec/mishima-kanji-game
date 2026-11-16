/**
 * Salon Mishima - E2E Testing Interface Contracts & Types
 * File: tests/helpers/contracts.ts
 */

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type JoyoGrade = 1 | 2 | 3 | 4 | 5 | 6 | 'S' | 'Jinmeiyo' | 'Hyogai';

export type CurriculumTierNumber = 1 | 2 | 3 | 4;

export interface LiteraryCompound {
  compound: string;
  reading: string;
  meaning: string;
  sourceWork?: string;
}

export interface LiteraryQuote {
  originalJapanese: string;
  englishTranslation: string;
  sourceWork: string;
  contextNote: string;
}

export interface CafeOrderItem {
  itemName: string;
  flavorProfile: string;
  dialogueLine: string;
}

export interface MishimaKanjiEntry {
  id: string;
  character: string;
  strokeCount: number;
  grade: JoyoGrade;
  jlptLevel: JLPTLevel;
  tier: CurriculumTierNumber;
  tierName: string;
  onyomi: string[];
  kunyomi: string[];
  readings?: {
    onyomi: string[];
    kunyomi: string[];
  };
  meanings: string[];
  primaryWork: string;
  primaryWorkEnglish?: string;
  allRelatedWorks?: string[];
  literaryCompounds: LiteraryCompound[];
  literaryQuote: LiteraryQuote;
  cafeOrderItem: CafeOrderItem;
  gameplayTags?: string[];
}

export interface CardProgress {
  id: string;
  box: number;
  nextDue: number;
  totalReviews: number;
  correctReviews: number;
  lastReviewed?: number;
}

export interface PlayerProfile {
  coins: number;
  streak: number;
  lastLoginDate: string;
  cards: Record<string, CardProgress>;
  unlockedTiers: number[];
  completedStages: string[];
  confusion: Record<string, Record<string, number>>;
  settings?: {
    isMuted?: boolean;
    bgmVolume?: number;
    sfxVolume?: number;
    voiceEnabled?: boolean;
  };
}

export type GameMode = 'title' | 'map' | 'lesson' | 'boss' | 'rush' | 'codex' | 'review';

export interface ActiveOrder {
  id: string;
  customerName: string;
  customerAvatar: string;
  dialogue: string;
  targetKanji: MishimaKanjiEntry;
  mode: 'pick' | 'recall' | 'build';
  traySlots?: (string | null)[];
  prompt: string;
  options: string[];
  correctOption: string;
}

export interface GameState {
  mode: GameMode;
  activeOrder: ActiveOrder | null;
  score: number;
  coins: number;
  combo: number;
  hearts: number;
  timeLeft: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
}

export type SoundType =
  | 'bell'
  | 'clink'
  | 'correct'
  | 'wrong'
  | 'drop'
  | 'fanfare'
  | 'rush'
  | 'hurt'
  | 'bossHit';

export type BgmMode = 'salon' | 'boss';

export interface BossChoiceOption {
  kanji: string;
  reading: string;
  meaning: string;
  isCorrect: boolean;
}

export interface BossQuestion {
  id: string;
  type: 'glyph_to_sound' | 'sound_to_glyph' | 'meaning_to_glyph';
  prompt: string;
  targetCharacter: string;
  options: BossChoiceOption[];
  correctAnswer: string;
  explanation: string;
}

export interface BossKanjiPair {
  id: string;
  title: string;
  subtitle: string;
  tier: CurriculumTierNumber | 'special';
  characterA: string;
  characterB: string;
  additionalCharacters?: string[];
  meanings: Record<string, string>;
  readings: Record<string, { onyomi: string[]; kunyomi: string[] }>;
  distinctionNotes: string;
  mnemonicTip: string;
  bossName: string;
  bossTitle: string;
  bossHp: number;
  timeLimitSeconds: number;
  questions: BossQuestion[];
}
