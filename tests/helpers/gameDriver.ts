/**
 * Salon Mishima - High-Level Opaque-Box Player Action Driver
 * File: tests/helpers/gameDriver.ts
 */

import type { ReactElement } from 'react';
import {
  MishimaKanjiEntry,
  PlayerProfile,
  ActiveOrder,
  CardProgress,
  BossKanjiPair,
  SoundType,
  BgmMode,
  CurriculumTierNumber,
} from './contracts';
import { getStoredProfile } from './mockStorage';

let testingLibraryCache: any = null;
async function getTestingLibrary(): Promise<any> {
  if (!testingLibraryCache) {
    try {
      testingLibraryCache = await import(/* @vite-ignore */ '@testing-library/react' as any);
    } catch {
      testingLibraryCache = null;
    }
  }
  return testingLibraryCache;
}

/**
 * GameDriver provides an opaque-box abstraction layer for all user-level interactions
 * and interface contracts defined in PROJECT.md.
 */
export class GameDriver {
  // -------------------------------------------------------------------------
  // 1. Dynamic Module Resolution from src/
  // -------------------------------------------------------------------------

  private async importModuleSafe(path: string): Promise<any> {
    try {
      return await import(/* @vite-ignore */ path);
    } catch {
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // 2. Curriculum & Data Public Contracts
  // -------------------------------------------------------------------------

  async getAllKanji(): Promise<MishimaKanjiEntry[]> {
    const mod = await this.importModuleSafe('../../src/data/mishimaCurriculum');
    if (mod && typeof mod.getAllKanji === 'function') {
      return mod.getAllKanji();
    }
    throw new Error('getAllKanji implementation not available in src/data/mishimaCurriculum');
  }

  async getKanjiByTier(tier: CurriculumTierNumber | number): Promise<MishimaKanjiEntry[]> {
    const mod = await this.importModuleSafe('../../src/data/mishimaCurriculum');
    if (mod && typeof mod.getKanjiByTier === 'function') {
      return mod.getKanjiByTier(tier);
    }
    throw new Error('getKanjiByTier implementation not available in src/data/mishimaCurriculum');
  }

  async getKanjiById(id: string): Promise<MishimaKanjiEntry | undefined> {
    const mod = await this.importModuleSafe('../../src/data/mishimaCurriculum');
    if (mod && typeof mod.getKanjiById === 'function') {
      return mod.getKanjiById(id);
    }
    throw new Error('getKanjiById implementation not available in src/data/mishimaCurriculum');
  }

  async getAllBossPairs(): Promise<BossKanjiPair[]> {
    const mod = await this.importModuleSafe('../../src/data/bossPairs');
    if (mod && typeof mod.getAllBossPairs === 'function') {
      return mod.getAllBossPairs();
    }
    throw new Error('getAllBossPairs implementation not available in src/data/bossPairs');
  }

  // -------------------------------------------------------------------------
  // 3. SRS & Storage Contracts
  // -------------------------------------------------------------------------

  async loadProfile(): Promise<PlayerProfile> {
    const mod = await this.importModuleSafe('../../src/srs/storageManager');
    if (mod && typeof mod.loadProfile === 'function') {
      return mod.loadProfile();
    }
    throw new Error('loadProfile implementation not available in src/srs/storageManager');
  }

  async saveProfile(profile: PlayerProfile): Promise<void> {
    const mod = await this.importModuleSafe('../../src/srs/storageManager');
    if (mod && typeof mod.saveProfile === 'function') {
      return mod.saveProfile(profile);
    }
    throw new Error('saveProfile implementation not available in src/srs/storageManager');
  }

  async recordReviewResult(
    kanjiId: string,
    correct: boolean,
    mistakenOption?: string
  ): Promise<PlayerProfile> {
    const mod = await this.importModuleSafe('../../src/srs/storageManager');
    if (mod && typeof mod.recordReviewResult === 'function') {
      return mod.recordReviewResult(kanjiId, correct, mistakenOption);
    }
    throw new Error('recordReviewResult implementation not available in src/srs/storageManager');
  }

  async promoteCard(card: CardProgress, now?: number): Promise<CardProgress> {
    const mod = await this.importModuleSafe('../../src/srs/leitnerEngine');
    if (mod && typeof mod.promoteCard === 'function') {
      return mod.promoteCard(card, now);
    }
    throw new Error('promoteCard implementation not available in src/srs/leitnerEngine');
  }

  async demoteCard(card: CardProgress, now?: number): Promise<CardProgress> {
    const mod = await this.importModuleSafe('../../src/srs/leitnerEngine');
    if (mod && typeof mod.demoteCard === 'function') {
      return mod.demoteCard(card, now);
    }
    throw new Error('demoteCard implementation not available in src/srs/leitnerEngine');
  }

  // -------------------------------------------------------------------------
  // 4. Audio & Speech Contracts
  // -------------------------------------------------------------------------

  async playSound(type: SoundType): Promise<void> {
    const mod = await this.importModuleSafe('../../src/audio/soundSynthesizer');
    if (mod && typeof mod.playSound === 'function') {
      return mod.playSound(type);
    }
    throw new Error('playSound implementation not available in src/audio/soundSynthesizer');
  }

  async startBgm(mode: BgmMode): Promise<void> {
    const mod = await this.importModuleSafe('../../src/audio/soundSynthesizer');
    if (mod && typeof mod.startBgm === 'function') {
      return mod.startBgm(mode);
    }
    throw new Error('startBgm implementation not available in src/audio/soundSynthesizer');
  }

  async stopBgm(): Promise<void> {
    const mod = await this.importModuleSafe('../../src/audio/soundSynthesizer');
    if (mod && typeof mod.stopBgm === 'function') {
      return mod.stopBgm();
    }
    throw new Error('stopBgm implementation not available in src/audio/soundSynthesizer');
  }

  async setAudioMuted(isMuted: boolean): Promise<void> {
    const mod = await this.importModuleSafe('../../src/audio/soundSynthesizer');
    if (mod && typeof mod.setAudioMuted === 'function') {
      return mod.setAudioMuted(isMuted);
    }
    const profile = getStoredProfile();
    if (profile) {
      if (!profile.settings) profile.settings = {};
      profile.settings.isMuted = isMuted;
      localStorage.setItem('mishima-cafe/v1', JSON.stringify(profile));
    }
  }

  async speakKanji(text: string): Promise<boolean | void> {
    const mod = await this.importModuleSafe('../../src/audio/speechSynthesizer');
    if (mod && typeof mod.speakKanji === 'function') {
      return mod.speakKanji(text);
    }
    throw new Error('speakKanji implementation not available in src/audio/speechSynthesizer');
  }

  // -------------------------------------------------------------------------
  // 5. Game Mechanics Contracts
  // -------------------------------------------------------------------------

  async generateOrder(
    kanji: MishimaKanjiEntry,
    mode: 'pick' | 'recall' | 'build',
    distractors?: string[]
  ): Promise<ActiveOrder> {
    const mod = await this.importModuleSafe('../../src/game/orderGenerator');
    if (mod && typeof mod.generateOrder === 'function') {
      return mod.generateOrder(kanji, mode, distractors);
    }
    throw new Error('generateOrder implementation not available in src/game/orderGenerator');
  }

  async handleBlockPick(
    order: ActiveOrder,
    pickedOption: string
  ): Promise<{ success: boolean }> {
    const mod = await this.importModuleSafe('../../src/game/gameEngine');
    if (mod && typeof mod.handleBlockPick === 'function') {
      return mod.handleBlockPick(order, pickedOption);
    }
    throw new Error('handleBlockPick implementation not available in src/game/gameEngine');
  }

  async calculateComboReward(
    combo: number,
    baseAward: number = 50,
    multiplier: number = 10
  ): Promise<number> {
    const mod = await this.importModuleSafe('../../src/game/comboCalculator');
    if (mod && typeof mod.calculateComboReward === 'function') {
      return mod.calculateComboReward(combo, baseAward, multiplier);
    }
    throw new Error('calculateComboReward implementation not available in src/game/comboCalculator');
  }

  async resolveBossRound(
    currentBossHp: number,
    currentHearts: number,
    isCorrect: boolean
  ): Promise<{
    bossHp: number;
    hearts: number;
    isDefeated: boolean;
    isPlayerDefeated: boolean;
  }> {
    const mod = await this.importModuleSafe('../../src/game/bossBattleEngine');
    if (mod && typeof mod.resolveBossRound === 'function') {
      return mod.resolveBossRound(currentBossHp, currentHearts, isCorrect);
    }
    throw new Error('resolveBossRound implementation not available in src/game/bossBattleEngine');
  }

  // -------------------------------------------------------------------------
  // 6. UI & DOM Interaction Surface
  // -------------------------------------------------------------------------

  async renderApp(element?: ReactElement) {
    if (!element) throw new Error('No React element provided to renderApp');
    const tl = await getTestingLibrary();
    if (tl && typeof tl.render === 'function') {
      return tl.render(element);
    }
    throw new Error('@testing-library/react not available in this environment');
  }

  async startShift(): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const btn =
        tl.screen.queryByTestId('btn-start-shift') ||
        tl.screen.queryByText(/営業開始/i) ||
        tl.screen.queryByRole('button', { name: /start|営業開始/i });
      if (btn) {
        tl.fireEvent.click(btn);
      }
    }
  }

  async selectTierStage(tierNumber: number, stageId?: string): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const target =
        (stageId && tl.screen.queryByTestId(`stage-btn-${stageId}`)) ||
        tl.screen.queryByTestId(`tier-card-${tierNumber}`) ||
        tl.screen.queryByText(new RegExp(`Tier ${tierNumber}|第${tierNumber}階層`, 'i'));
      if (target) {
        tl.fireEvent.click(target);
      }
    }
  }

  async selectConveyorOption(kanjiOrReading: string): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const option =
        tl.screen.queryByTestId(`conveyor-option-${kanjiOrReading}`) ||
        tl.screen.queryByText(kanjiOrReading);
      if (option) {
        tl.fireEvent.click(option);
      }
    }
  }

  async placeTraySlot(slotIndex: number, kanji: string): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const block =
        tl.screen.queryByTestId(`tray-block-${kanji}`) ||
        tl.screen.queryByTestId(`tray-slot-${slotIndex}`) ||
        tl.screen.queryByText(kanji);
      if (block) {
        tl.fireEvent.click(block);
      }
    }
  }

  async dismissWordReveal(): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const btn =
        tl.screen.queryByTestId('btn-modal-continue') ||
        tl.screen.queryByText(/次へ|進む|閉じる/i) ||
        tl.screen.queryByRole('button', { name: /continue|next|close/i });
      if (btn) {
        tl.fireEvent.click(btn);
      }
    }
  }

  async enterBossArena(): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const btn =
        tl.screen.queryByTestId('btn-boss-arena') ||
        tl.screen.queryByText(/ボス|決闘/i);
      if (btn) {
        tl.fireEvent.click(btn);
      }
    }
  }

  async openDailyReview(): Promise<void> {
    const tl = await getTestingLibrary();
    if (tl) {
      const btn =
        tl.screen.queryByTestId('btn-daily-review') ||
        tl.screen.queryByText(/復習|Morning Review/i);
      if (btn) {
        tl.fireEvent.click(btn);
      }
    }
  }

  async getVisibleScore(): Promise<number> {
    const tl = await getTestingLibrary();
    if (!tl) return 0;
    const elem = tl.screen.queryByTestId('score-counter');
    if (!elem || !elem.textContent) return 0;
    const match = elem.textContent.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async getVisibleHearts(): Promise<number> {
    const tl = await getTestingLibrary();
    if (!tl) return 0;
    const elem = tl.screen.queryByTestId('hearts-display');
    if (!elem || !elem.textContent) return 0;
    const hearts = elem.textContent.match(/❤️|♥/g);
    return hearts ? hearts.length : 0;
  }

  getStoredProfile(): PlayerProfile | null {
    return getStoredProfile();
  }
}

export const driver = new GameDriver();
