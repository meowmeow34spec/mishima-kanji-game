/**
 * Salon Mishima - Yukio Mishima Literary Kanji Curriculum
 * Type Definitions & Schema Contracts
 * File: src/types/curriculum.ts
 */

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type JoyoGrade = 1 | 2 | 3 | 4 | 5 | 6 | 'S' | 'Jinmeiyo' | 'Hyogai';

export type CurriculumTierNumber = 1 | 2 | 3 | 4;

export interface LiteraryCompound {
  /** The compound word containing the target kanji glyph (e.g. 金閣, 潮騒, 憂国) */
  compound: string;
  /** Furigana reading in Hiragana (e.g. きんかく, しおさい, ゆうこく) */
  reading: string;
  /** English translation / definition */
  meaning: string;
  /** Specific literary work source if applicable (e.g. 金閣寺) */
  sourceWork?: string;
}

export interface LiteraryQuote {
  /** Verbatim excerpt sentence from Mishima's literary text containing the target kanji */
  originalJapanese: string;
  /** English literary translation */
  englishTranslation: string;
  /** Title of the source novel / work (e.g. 金閣寺, 潮騒, 豊饒の海) */
  sourceWork: string;
  /** Contextual or thematic explanation of the passage */
  contextNote: string;
}

export interface CafeOrderItem {
  /** Thematic cafe menu item name (e.g. 金箔抹茶パフェ, 潮騒塩羊羹) */
  itemName: string;
  /** Sensory and flavor profile descriptor (e.g. 'Bittersweet, Golden, Resplendent') */
  flavorProfile: string;
  /** Spoken dialogue line when customer orders this kanji's item */
  dialogueLine: string;
}

export interface MishimaKanjiEntry {
  /** Unique semantic identifier: e.g. 'kinkaku-01-kin' */
  id: string;
  /** Single target Kanji glyph */
  character: string;
  /** Traditional stroke count */
  strokeCount: number;
  /** Joyo Grade or character classification */
  grade: JoyoGrade;
  /** Approximate JLPT level */
  jlptLevel: JLPTLevel;
  /** Progressive curriculum tier (1 to 4) */
  tier: CurriculumTierNumber;
  /** Descriptive Japanese/English name of the tier */
  tierName: string;
  /** On'yomi in Katakana (e.g. ["キン", "コン"]) */
  onyomi: string[];
  /** Kun'yomi in Hiragana with optional okurigana separator '・' (e.g. ["かね", "かな-"]) */
  kunyomi: string[];
  /** Standardized readings container matching schema validation */
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  /** Core English meanings / definitions */
  meanings: string[];
  /** Primary Mishima literary work associated with this kanji */
  primaryWork: string;
  /** English title of primary work */
  primaryWorkEnglish: string;
  /** Related works in Mishima's corpus where this kanji features prominently */
  allRelatedWorks: string[];
  /** 2-3 literary compounds featuring the target glyph */
  literaryCompounds: LiteraryCompound[];
  /** Authentic literary quote demonstrating the kanji in literary context */
  literaryQuote: LiteraryQuote;
  /** "Salon Mishima" cafe order item binding for serving mechanics */
  cafeOrderItem: CafeOrderItem;
  /** Tags for filtering and quiz category generation */
  gameplayTags: string[];
}

export interface CurriculumTierMeta {
  tier: CurriculumTierNumber;
  name: string;
  subtitle: string;
  themeDescription: string;
  primaryWorks: string[];
  kanjiCount: number;
}

export interface MishimaCurriculumDataset {
  version: string;
  lastUpdated: string;
  authorNote: string;
  totalKanjiCount: number;
  tiers: CurriculumTierMeta[];
  kanjiList: MishimaKanjiEntry[];
}

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
