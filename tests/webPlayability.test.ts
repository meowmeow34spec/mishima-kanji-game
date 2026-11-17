/**
 * Salon Mishima - Web Playability, Curriculum Reachability & UX Regression Suite
 * File: tests/webPlayability.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { getAllKanji } from '../src/data/mishimaCurriculum';
import { getAllBossPairs } from '../src/data/bossPairs';
import {
  KOREAN_KANJI_GLOSSARY,
  MISHIMA_WORK_TITLES_KO,
  getKoreanGloss,
  getKoreanWorkTitle,
} from '../src/data/koreanGlossary';
import { getDistractors } from '../src/srs/leitnerEngine';
import { generateOrder, SALON_CUSTOMERS } from '../src/game/orderGenerator';
import { initBossBattle } from '../src/game/bossBattleEngine';
import { GameEngine } from '../src/game/gameEngine';
import { SoundSynthesizerImpl } from '../src/audio/soundSynthesizer';
import { SalonMap } from '../src/components/SalonMap';
import { SalonCounter } from '../src/components/SalonCounter';
import { BossArena } from '../src/components/BossArena';
import { StudyCodexModal } from '../src/components/StudyCodexModal';
import { driver } from './helpers/gameDriver';
import type { CurriculumTierNumber } from '../src/types/curriculum';

describe('Web Playability & Full 80-Kanji / 8-Boss Reachability Regressions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('WEB-01: all 80 Mishima kanji are reachable across stages 1-4 of tiers 1-4', async () => {
    const engine = new GameEngine();
    const seenKanjiIds = new Set<string>();

    for (const tier of [1, 2, 3, 4] as CurriculumTierNumber[]) {
      for (const stageNum of [1, 2, 3, 4]) {
        await engine.selectStage(tier, `stage-${tier}-${stageNum}`);
        for (let orderIdx = 0; orderIdx < 5; orderIdx++) {
          const order = engine.getState().activeOrder;
          expect(order).not.toBeNull();
          seenKanjiIds.add(order!.targetKanji.id);

          // Complete active order (supports pick, recall, and multi-slot build)
          while (!engine.getState().revealKanji) {
            const current = engine.getState().activeOrder!;
            await engine.pickOption(current.correctOption);
          }
          await engine.dismissWordReveal();
        }
      }
    }

    expect(seenKanjiIds.size).toBe(80);
  });

  it('WEB-02: all 8 boss encounters (including secondary tier bosses and Grand Master Mishima) are reachable from SalonMap', async () => {
    const startedBossIds: string[] = [];
    await driver.renderApp(
      React.createElement(SalonMap, {
        unlockedTiers: [1, 2, 3, 4],
        completedStages: [],
        onStartBoss: (_tier, bossPairId) => {
          if (bossPairId) startedBossIds.push(bossPairId);
        },
      })
    );

    const bossBtnTestIds = [
      'stage-btn-stage-1-boss',
      'stage-btn-stage-1-boss-2',
      'stage-btn-stage-2-boss',
      'stage-btn-stage-3-boss',
      'stage-btn-stage-3-boss-2',
      'stage-btn-stage-4-boss',
      'stage-btn-stage-4-boss-2',
      'stage-btn-stage-special-boss',
    ];

    for (const testId of bossBtnTestIds) {
      const btn = document.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);
      expect(btn, `Expected boss button ${testId} on SalonMap`).not.toBeNull();
      expect(btn!.disabled).toBe(false);
      fireEvent.click(btn!);
    }

    const expectedAllBossIds = getAllBossPairs().map((b) => b.id);
    expect(startedBossIds.sort()).toEqual(expectedAllBossIds.sort());
  });

  it('WEB-03: build mode prompts with reading & meaning without leaking target compound kanji on blackboard or tray', async () => {
    const allKanji = getAllKanji();
    for (const kanji of allKanji) {
      const order = await generateOrder(kanji, 'build');
      const compound = kanji.literaryCompounds[0].compound;
      const reading = kanji.literaryCompounds[0].reading;
      expect(order.prompt).toContain(reading);
      expect(order.prompt).not.toContain(`「${compound}」`);
    }

    const sampleKanji = allKanji[2]; // 寺 -> 金閣寺 (きんかくじ)
    const buildOrder = await generateOrder(sampleKanji, 'build');
    await driver.renderApp(
      React.createElement(SalonCounter, {
        activeOrder: buildOrder,
      })
    );

    const trayTitle = document.querySelector('.tray-title')?.textContent || '';
    expect(trayTitle).toContain(sampleKanji.literaryCompounds[0].reading);
    expect(trayTitle).not.toContain(sampleKanji.literaryCompounds[0].compound);
  });

  it('WEB-04: getDistractors randomizes same-tier candidates instead of returning static first 3 kanji', () => {
    const allKanji = getAllKanji();
    const target = allKanji.find((k) => k.character === '池')!;
    const seen = new Set<string>();

    for (let i = 0; i < 25; i++) {
      const dist = getDistractors(target, allKanji, 3);
      for (const d of dist) {
        seen.add(d.character);
      }
    }

    // Tier 1 has 19 other kanji; randomized draws across 25 trials must surface well over 5 unique kanji
    expect(seen.size).toBeGreaterThan(5);
  });

  it('WEB-05: boss duel randomizes option button positions and gates mnemonic hint behind toggle button', async () => {
    const firstSlotReadings = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const state = initBossBattle('boss-01-ji-samurai');
      const firstOpt = state.currentQuestion.options[0];
      firstSlotReadings.add(typeof firstOpt === 'string' ? firstOpt : firstOpt.reading);
    }
    expect(firstSlotReadings.size).toBeGreaterThan(1);

    const engineState = initBossBattle('boss-01-ji-samurai');
    await driver.renderApp(
      React.createElement(BossArena, {
        bossName: engineState.bossPair.bossName,
        bossHp: engineState.bossHp,
        maxBossHp: engineState.maxBossHp,
        playerHearts: engineState.playerHearts,
        maxHearts: engineState.maxHearts,
        timeLeft: engineState.timeLeft,
        currentQuestion: engineState.currentQuestion,
        bossPair: engineState.bossPair,
        onAnswer: vi.fn(),
      })
    );

    expect(document.body.textContent).not.toContain(engineState.bossPair.mnemonicTip);
    const hintBtn = document.querySelector<HTMLButtonElement>('[data-testid="btn-boss-hint"]');
    expect(hintBtn).not.toBeNull();
    fireEvent.click(hintBtn!);
    expect(document.body.textContent).toContain(engineState.bossPair.mnemonicTip);
  });

  it('WEB-06: customer order generator cycles across all 8 literary patrons', async () => {
    const allKanji = getAllKanji();
    const seenCustomers = new Set<string>();
    for (let round = 0; round < 2; round++) {
      for (const k of allKanji) {
        const order = await generateOrder(k, 'pick');
        seenCustomers.add(order.customerName);
      }
    }
    expect(seenCustomers.size).toBe(SALON_CUSTOMERS.length);
  });

  it('WEB-07: Korean glossary covers all 80 kanji & Mishima works and supports Korean search in StudyCodexModal', async () => {
    const allKanji = getAllKanji();
    expect(Object.keys(KOREAN_KANJI_GLOSSARY).length).toBe(80);

    for (const k of allKanji) {
      const gloss = getKoreanGloss(k.character);
      expect(gloss, `Missing Korean gloss for ${k.character}`).toBeDefined();
      expect(gloss!.huneum.length).toBeGreaterThan(0);
      expect(gloss!.meaningKo.length).toBeGreaterThan(0);
      expect(gloss!.primaryCompoundKo.length).toBeGreaterThan(0);
      expect(getKoreanWorkTitle(k.primaryWork).length).toBeGreaterThan(0);
    }
    expect(Object.keys(MISHIMA_WORK_TITLES_KO).length).toBeGreaterThanOrEqual(12);

    await driver.renderApp(
      React.createElement(StudyCodexModal, {
        isOpen: true,
        kanjiList: allKanji,
        onClose: vi.fn(),
      })
    );

    const searchInput = document.querySelector<HTMLInputElement>('[data-testid="codex-search-input"]')!;
    fireEvent.change(searchInput, { target: { value: '금각사' } });
    const kinkakuCards = document.querySelectorAll('[data-testid^="codex-card-"]');
    expect(kinkakuCards.length).toBeGreaterThanOrEqual(15);

    fireEvent.change(searchInput, { target: { value: '불꽃' } });
    const flameCards = document.querySelectorAll('[data-testid^="codex-card-"]');
    expect(flameCards.length).toBeGreaterThanOrEqual(1);
    expect(flameCards[0].textContent).toContain('炎');
  });

  it('WEB-08: SoundSynthesizerImpl.unlock() resumes WebKit "interrupted" AudioContext state', async () => {
    const synth = new SoundSynthesizerImpl();
    await synth.unlock();
    const internalCtx = (synth as any).ctx;
    expect(internalCtx).toBeDefined();
    internalCtx.state = 'interrupted';
    internalCtx.resume = vi.fn().mockImplementation(async () => {
      internalCtx.state = 'running';
    });

    await synth.unlock();
    expect(internalCtx.resume).toHaveBeenCalledTimes(1);
  });
});
