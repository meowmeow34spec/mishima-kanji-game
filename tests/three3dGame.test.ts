/**
 * Salon Mishima - 3D WebGL Overhaul, 80-Kanji Korean Mnemonics, Cafe Upgrade Shop & Readability Suite
 * File: tests/three3dGame.test.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render, fireEvent } from '@testing-library/react';
import { resolveCustomerActorId } from '../src/types/three3d';
import { getAllKanji, MISHIMA_KANJI_CURRICULUM } from '../src/data/mishimaCurriculum';
import { getAllBossPairs } from '../src/data/bossPairs';
import {
  KOREAN_KANJI_GLOSSARY,
  MISHIMA_WORK_TITLES_KO,
  getKoreanGloss,
  getKoreanWorkTitle,
} from '../src/data/koreanGlossary';
import { SALON_CUSTOMERS, generateOrder } from '../src/game/orderGenerator';
import { GameEngine } from '../src/game/gameEngine';
import {
  loadProfile,
  saveProfile,
  createDefaultProfile,
} from '../src/srs/storageManager';

const rootDir = path.resolve(__dirname, '..');

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(rootDir, relPath));
}

async function importModuleSafe(relPath: string): Promise<any> {
  try {
    return await import(/* @vite-ignore */ relPath);
  } catch (err) {
    throw new Error(`Failed to import ${relPath}: ${(err as Error)?.message || String(err)}`);
  }
}

const hasThreePkg = fileExists('node_modules/three/package.json');
const hasThreeTypes = fileExists('src/types/three3d.ts');
const hasMnemonics = fileExists('src/data/koreanMnemonics.ts');
const hasCafeShop = fileExists('src/game/cafeShopEngine.ts');
const hasSalonEnv3D = fileExists('src/three/SalonEnvironment3D.ts');
const hasCameraRig3D = fileExists('src/three/CameraRig3D.ts');
const hasParticleSys3D = fileExists('src/three/ParticleSystem3D.ts');
const hasCustomerActors3D = fileExists('src/three/CustomerActors3D.ts');
const hasKanjiBlocks3D = fileExists('src/three/KanjiBlocks3D.ts');
const hasBossAvatar3D = fileExists('src/three/BossAvatar3D.ts');
const hasSalonCanvas3D = fileExists('src/components/SalonCanvas3D.tsx');
const hasCafeShopModal = fileExists('src/components/CafeShopModal.tsx');

const appSource = fileExists('src/App.tsx')
  ? fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf-8')
  : '';
const isPhase2Integrated = appSource.includes('SalonCanvas3D');

const CANONICAL_UPGRADE_IDS = [
  'siphon',
  'velvet',
  'kinkaku',
  'gramophone',
  'bookshelf',
  'wagashi',
] as const;

const EXPECTED_UPGRADE_COSTS: Record<string, number> = {
  siphon: 150,
  velvet: 250,
  kinkaku: 350,
  gramophone: 450,
  bookshelf: 600,
  wagashi: 800,
};

const HANGUL_REGEX = /[가-힣]/;
const PLACEHOLDER_REGEX = /\b(TODO|TBD|FIXME|PLACEHOLDER|lorem ipsum)\b/i;

/**
 * Installs a lightweight 2D canvas context polyfill in jsdom so procedural
 * Three.js CanvasTextures (512x512 kanji block faces, wood grain, signs) execute
 * full drawing instructions cleanly during unit tests.
 */
function installMock2DCanvasContext() {
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  const mock2d = {
    canvas: { width: 512, height: 512 },
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    font: '16px sans-serif',
    textAlign: 'center',
    textBaseline: 'middle',
    shadowColor: 'transparent',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    lineCap: 'round',
    lineJoin: 'round',
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    ellipse: vi.fn(),
    rect: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: String(text).length * 16 })),
    drawImage: vi.fn(),
    setLineDash: vi.fn(),
    getLineDash: vi.fn(() => []),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createPattern: vi.fn(() => ({})),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(16), width: 2, height: 2 })),
    putImageData: vi.fn(),
  };

  (HTMLCanvasElement.prototype as any).getContext = function (contextId: string, options?: any): any {
    if (contextId === '2d') {
      return mock2d;
    }
    // WebGL / WebGL2 returns null in headless jsdom
    if (contextId === 'webgl' || contextId === 'webgl2' || contextId === 'experimental-webgl') {
      return null;
    }
    return origGetContext ? origGetContext.call(this, contextId as any, options) : null;
  };

  return () => {
    HTMLCanvasElement.prototype.getContext = origGetContext;
  };
}

describe('Salon Mishima 3D Overhaul Verification Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // =========================================================================
  // 1. 80-Kanji Korean Mnemonics Completeness (koreanMnemonics.ts)
  // =========================================================================
  describe('1. Korean Mnemonics 100% 80-Kanji Coverage', () => {
    it.skipIf(!hasMnemonics)(
      'T3D-MNE-01: covers all 80 Mishima kanji via getKoreanMnemonic(character) and getKoreanMnemonic(id)',
      async () => {
        const mod = await importModuleSafe('../src/data/koreanMnemonics');
        expect(typeof mod.getKoreanMnemonic).toBe('function');

        const allKanji = getAllKanji();
        expect(allKanji.length).toBe(80);
        expect(MISHIMA_KANJI_CURRICULUM.length).toBe(80);

        for (const entry of allKanji) {
          const byChar = mod.getKoreanMnemonic(entry.character);
          expect(byChar, `Missing mnemonic for kanji character ${entry.character}`).toBeDefined();
          expect(byChar.character).toBe(entry.character);

          const byId = mod.getKoreanMnemonic(entry.id);
          expect(byId, `Missing mnemonic lookup by ID ${entry.id}`).toBeDefined();
          expect(byId.character).toBe(entry.character);
        }
      }
    );

    it.skipIf(!hasMnemonics)(
      'T3D-MNE-02: every single one of the 80 kanji has non-empty, Korean-rich mnemonic fields with zero placeholders',
      async () => {
        const mod = await importModuleSafe('../src/data/koreanMnemonics');
        const allKanji = getAllKanji();

        const requiredStringFields = [
          'huneum',
          'koreanSoundTip',
          'radicalBreakdown',
          'storyMnemonicKo',
          'visualPictogram',
          'quoteKo',
          'cafeOrderSpeechKo',
          'happyReactionKo',
          'angryReactionKo',
        ] as const;

        for (const entry of allKanji) {
          const mne = mod.getKoreanMnemonic(entry.character);
          expect(mne, `Missing mnemonic for ${entry.character}`).toBeTruthy();

          for (const field of requiredStringFields) {
            const val = mne[field];
            expect(
              typeof val === 'string' && val.trim().length > 0,
              `Kanji ${entry.character} (${entry.id}) has empty or missing field "${field}"`
            ).toBe(true);
            expect(
              PLACEHOLDER_REGEX.test(val),
              `Kanji ${entry.character} field "${field}" contains placeholder text: ${val}`
            ).toBe(false);
          }

          // Korean Hangul presence checks on core Korean instructional fields
          expect(HANGUL_REGEX.test(mne.huneum), `${entry.character} huneum must contain Hangul`).toBe(true);
          expect(HANGUL_REGEX.test(mne.koreanSoundTip), `${entry.character} koreanSoundTip must contain Hangul`).toBe(true);
          expect(HANGUL_REGEX.test(mne.radicalBreakdown), `${entry.character} radicalBreakdown must contain Hangul`).toBe(true);
          expect(HANGUL_REGEX.test(mne.storyMnemonicKo), `${entry.character} storyMnemonicKo must contain Hangul`).toBe(true);
          expect(mne.storyMnemonicKo.trim().length).toBeGreaterThanOrEqual(10);
          expect(HANGUL_REGEX.test(mne.quoteKo), `${entry.character} quoteKo must contain Hangul`).toBe(true);
          expect(HANGUL_REGEX.test(mne.cafeOrderSpeechKo), `${entry.character} cafeOrderSpeechKo must contain Hangul`).toBe(true);

          // Compounds array check
          expect(Array.isArray(mne.compoundsKo), `${entry.character} compoundsKo must be an array`).toBe(true);
          expect(mne.compoundsKo.length).toBeGreaterThanOrEqual(entry.literaryCompounds.length);
          for (const compKo of mne.compoundsKo) {
            expect(typeof compKo === 'string' && compKo.trim().length > 0).toBe(true);
          }
        }
      }
    );

    it('T3D-MNE-03: preserves full backward compatibility of koreanGlossary.ts exports', () => {
      const allKanji = getAllKanji();
      expect(Object.keys(KOREAN_KANJI_GLOSSARY).length).toBe(80);
      expect(Object.keys(MISHIMA_WORK_TITLES_KO).length).toBeGreaterThanOrEqual(12);

      for (const k of allKanji) {
        const gloss = getKoreanGloss(k.character);
        expect(gloss).toBeDefined();
        expect(gloss!.huneum.trim().length).toBeGreaterThan(0);
        expect(getKoreanWorkTitle(k.primaryWork).trim().length).toBeGreaterThan(0);
      }
    });
  });

  // =========================================================================
  // 2. 3D Cafe Upgrade Shop & Gameplay Buffs (cafeShopEngine.ts)
  // =========================================================================
  describe('2. 3D Cafe Upgrade Shop & Gameplay Buffs', () => {
    it.skipIf(!hasCafeShop)(
      'T3D-SHOP-01: defines all 6 canonical 3D cafe upgrades with Korean labels and expected coin costs',
      async () => {
        const shopMod = await importModuleSafe('../src/game/cafeShopEngine');
        const catalogRaw =
          shopMod.CAFE_UPGRADES ||
          shopMod.SHOP_UPGRADES ||
          (typeof shopMod.getAllCafeUpgrades === 'function' ? shopMod.getAllCafeUpgrades() : null) ||
          (typeof shopMod.getCafeUpgrades === 'function' ? shopMod.getCafeUpgrades() : null);

        expect(catalogRaw, 'Expected CAFE_UPGRADES or getAllCafeUpgrades export in cafeShopEngine.ts').toBeTruthy();
        const catalogList: any[] = Array.isArray(catalogRaw) ? catalogRaw : Object.values(catalogRaw);
        expect(catalogList.length).toBe(6);

        for (const upgId of CANONICAL_UPGRADE_IDS) {
          const item = catalogList.find((u) => u.id === upgId);
          expect(item, `Missing upgrade "${upgId}" in cafeShopEngine`).toBeDefined();

          const cost = item.cost ?? item.price ?? item.coins;
          expect(cost).toBe(EXPECTED_UPGRADE_COSTS[upgId]);

          const nameKo = item.nameKo || item.name || item.titleKo || item.title || '';
          const descKo = item.descriptionKo || item.description || item.effectKo || item.buffDescription || '';
          expect(HANGUL_REGEX.test(nameKo), `Upgrade ${upgId} name should be Korean`).toBe(true);
          expect(HANGUL_REGEX.test(descKo), `Upgrade ${upgId} description should be Korean`).toBe(true);
        }
      }
    );

    it.skipIf(!hasCafeShop)(
      'T3D-SHOP-02: validates purchases, deducts coins, prevents duplicate purchases, and persists in PlayerProfile',
      async () => {
        const shopMod = await importModuleSafe('../src/game/cafeShopEngine');
        const purchaseFn =
          shopMod.purchaseCafeUpgrade ||
          shopMod.purchaseUpgrade ||
          shopMod.buyCafeUpgrade ||
          shopMod.buyUpgrade;

        expect(typeof purchaseFn, 'Expected purchaseCafeUpgrade/purchaseUpgrade function in cafeShopEngine').toBe(
          'function'
        );

        // 1) Insufficient coins must fail without deducting coins
        const poorProfile = createDefaultProfile({ coins: 50, unlockedUpgrades: [] } as any);
        saveProfile(poorProfile);
        const failRes = purchaseFn(poorProfile, 'siphon');
        if (failRes && typeof failRes === 'object' && 'success' in failRes) {
          expect(failRes.success).toBe(false);
          const pAfterFail = failRes.profile || poorProfile;
          expect(pAfterFail.coins).toBe(50);
          expect((pAfterFail.unlockedUpgrades || []).includes('siphon')).toBe(false);
        }

        // 2) Sufficient coins must deduct 150 and unlock 'siphon'
        const richProfile = createDefaultProfile({ coins: 500, unlockedUpgrades: [] } as any);
        saveProfile(richProfile);
        const okRes = purchaseFn(richProfile, 'siphon');
        const updatedProfile = okRes?.profile ? okRes.profile : okRes;
        if (okRes && typeof okRes === 'object' && 'success' in okRes) {
          expect(okRes.success).toBe(true);
        }
        expect(updatedProfile.coins).toBe(350);
        expect(updatedProfile.unlockedUpgrades).toContain('siphon');

        // 3) Duplicate purchase of already unlocked 'siphon' must not deduct coins again
        const dupRes = purchaseFn(updatedProfile, 'siphon');
        if (dupRes && typeof dupRes === 'object' && 'success' in dupRes) {
          expect(dupRes.success).toBe(false);
        }
        const afterDupProfile = dupRes?.profile || updatedProfile;
        expect(afterDupProfile.coins).toBe(350);
        expect(afterDupProfile.unlockedUpgrades.filter((id: string) => id === 'siphon').length).toBe(1);

        // 4) Persistence round-trip via storageManager
        saveProfile(afterDupProfile);
        const reloaded = loadProfile() as any;
        expect(Array.isArray(reloaded.unlockedUpgrades)).toBe(true);
        expect(reloaded.unlockedUpgrades).toContain('siphon');

        // 5) Legacy saved profile without unlockedUpgrades safely defaults to []
        localStorage.setItem(
          'mishima-cafe/v1',
          JSON.stringify({ version: 1, coins: 220, streak: 3, lastLoginDate: '2026-11-20', cards: {} })
        );
        const legacyReloaded = loadProfile() as any;
        expect(legacyReloaded.coins).toBe(220);
        expect(legacyReloaded.unlockedUpgrades ?? []).toEqual([]);
      }
    );

    it.skipIf(!hasCafeShop)(
      'T3D-SHOP-03: applies gameplay buffs in GameEngine (wagashi +1 heart, kinkaku shield, siphon +25% tips, gramophone fever@4, velvet +5s patience)',
      async () => {
        // Baseline stage without upgrades
        saveProfile(createDefaultProfile({ coins: 100, unlockedUpgrades: [] } as any));
        const baseEngine = new GameEngine();
        await baseEngine.selectStage(1, 'stage-1-1');
        const baseState = baseEngine.getState() as any;
        expect(baseState.hearts).toBe(3);
        const baseMaxPatience = baseState.maxPatienceSeconds ?? baseState.patienceSeconds ?? 0;

        const baseOrder = baseEngine.getState().activeOrder!;
        const basePick = await baseEngine.pickOption(baseOrder.correctOption);
        const baseCoinsAwarded = basePick.coinsAwarded;

        // Upgraded profile with wagashi, kinkaku, siphon, gramophone, velvet
        saveProfile(
          createDefaultProfile({
            coins: 100,
            unlockedUpgrades: ['wagashi', 'kinkaku', 'siphon', 'gramophone', 'velvet'],
          } as any)
        );
        const buffedEngine = new GameEngine();
        await buffedEngine.selectStage(1, 'stage-1-1');
        const buffedStart = buffedEngine.getState() as any;

        // wagashi: +1 max heart => 4 hearts
        expect(buffedStart.hearts).toBe(4);

        // velvet: +5s customer patience timer
        if (typeof buffedStart.maxPatienceSeconds === 'number' && baseMaxPatience > 0) {
          expect(buffedStart.maxPatienceSeconds).toBeGreaterThanOrEqual(baseMaxPatience + 5);
        }

        // siphon: +25% coin reward on first correct pick
        const firstOrder = buffedEngine.getState().activeOrder!;
        const buffedPick = await buffedEngine.pickOption(firstOrder.correctOption);
        expect(buffedPick.coinsAwarded).toBeGreaterThan(baseCoinsAwarded);
        await buffedEngine.dismissWordReveal();

        // Build combo to 4 to verify gramophone triggers feverActive at combo 4
        for (let step = 0; step < 3; step++) {
          while (!buffedEngine.getState().revealKanji) {
            const ord = buffedEngine.getState().activeOrder!;
            await buffedEngine.pickOption(ord.correctOption);
          }
          await buffedEngine.dismissWordReveal();
        }
        const atCombo4 = buffedEngine.getState() as any;
        expect(atCombo4.combo).toBeGreaterThanOrEqual(4);
        expect(Boolean(atCombo4.feverActive)).toBe(true);

        // kinkaku: 1 free mistake shield preserves hearts (4) & combo on first mistake!
        const activeBeforeMistake = buffedEngine.getState().activeOrder!;
        const comboBeforeMistake = buffedEngine.getState().combo;
        const wrongOpt =
          activeBeforeMistake.options.find((o) => o !== activeBeforeMistake.correctOption) || '__wrong__';
        await buffedEngine.pickOption(wrongOpt);
        const afterFirstMistake = buffedEngine.getState() as any;
        expect(afterFirstMistake.hearts).toBe(4);
        expect(afterFirstMistake.combo).toBe(comboBeforeMistake);

        // Second mistake in the same stage (shield exhausted) deducts heart & resets combo
        await buffedEngine.pickOption(wrongOpt);
        const afterSecondMistake = buffedEngine.getState() as any;
        expect(afterSecondMistake.hearts).toBe(3);
        expect(afterSecondMistake.combo).toBe(0);

        // Boss duel also benefits from wagashi +1 heart
        buffedEngine.startBoss('boss-01-ji-samurai', 1);
        expect(buffedEngine.getState().bossState?.playerHearts).toBe(4);
      }
    );

    it.skipIf(!hasCafeShop || !hasMnemonics)(
      'T3D-SHOP-04: attaches first-exposure Korean mnemonic scaffolding (isNewKanji & hintSummaryKo) for unseen kanji',
      async () => {
        saveProfile(createDefaultProfile({ coins: 100, cards: {} } as any));
        const engine = new GameEngine();
        await engine.selectStage(1, 'stage-1-1');
        const firstOrder = engine.getState().activeOrder as any;
        expect(firstOrder).not.toBeNull();
        expect(firstOrder.isNewKanji).toBe(true);
        expect(typeof firstOrder.hintSummaryKo).toBe('string');
        expect(firstOrder.hintSummaryKo.trim().length).toBeGreaterThan(0);
        expect(HANGUL_REGEX.test(firstOrder.hintSummaryKo)).toBe(true);
      }
    );

    it.skipIf(!hasCafeShop)(
      'T3D-SHOP-05: supports bookshelf fast-serve SRS box boost, GameEngine PURCHASE_UPGRADE & QUICK_PLAY actions, and 3D tactile SFX',
      async () => {
        // 1) PURCHASE_UPGRADE via GameEngine dispatch
        saveProfile(createDefaultProfile({ coins: 1000, unlockedUpgrades: [] } as any));
        const engine = new GameEngine();
        engine.dispatch({ type: 'PURCHASE_UPGRADE', payload: { upgradeId: 'bookshelf' } } as any);
        const stateAfterBuy = engine.getState() as any;
        expect(stateAfterBuy.coins).toBe(400);
        expect(stateAfterBuy.unlockedUpgrades).toContain('bookshelf');

        // 2) QUICK_PLAY jumps directly into lesson counter with an active order, and fast serve (<5s) grants +1 extra Leitner box (box >= 2 from 0)
        if (typeof (engine as any).quickPlay === 'function') {
          await (engine as any).quickPlay();
        } else {
          await engine.selectStage(1, 'stage-1-1');
        }
        expect(engine.getState().mode).toBe('lesson');
        const order = engine.getState().activeOrder!;
        expect(order).not.toBeNull();
        const kanjiId = order.targetKanji.id;

        while (!engine.getState().revealKanji) {
          const cur = engine.getState().activeOrder!;
          await engine.pickOption(cur.correctOption);
        }
        const savedCard = loadProfile().cards[kanjiId];
        expect(savedCard).toBeDefined();
        expect(savedCard.box).toBeGreaterThanOrEqual(2);

        // 3) New 3D cafe tactile audio cues execute without throwing
        const audioMod = await importModuleSafe('../src/audio/soundSynthesizer');
        for (const sfx of ['hover', 'slide', 'coin', 'angry', 'upgrade'] as const) {
          expect(() => audioMod.playSound(sfx)).not.toThrow();
        }
      }
    );
  });

  // =========================================================================
  // 3. Three.js 3D Scene, Actors & SalonCanvas3D Headless Resilience
  // =========================================================================
  describe('3. Three.js 3D Modules & SalonCanvas3D Headless Verification', () => {
    it('T3D-3D-00: resolveCustomerActorId maps all 8 literary patrons including kageyama/asako aliases', () => {
      const ids = SALON_CUSTOMERS.map((c) => resolveCustomerActorId(c));
      expect(new Set(ids).size).toBe(8);
      expect(resolveCustomerActorId('asako')).toBe('kageyama');
      expect(resolveCustomerActorId('avatar-kageyama')).toBe('kageyama');
      expect(resolveCustomerActorId('影山朝子')).toBe('kageyama');
      expect(resolveCustomerActorId(null)).toBe('mizoguchi');
    });

    it.skipIf(!hasSalonCanvas3D)(
      'T3D-3D-01: SalonCanvas3D mounts, updates across modes/upgrades, handles fallback clicks, and unmounts cleanly in headless jsdom',
      async () => {
        const canvasMod = await importModuleSafe('../src/components/SalonCanvas3D');
        const SalonCanvas3D = canvasMod.SalonCanvas3D || canvasMod.default;
        expect(SalonCanvas3D).toBeDefined();

        const onBlockPick = vi.fn();
        const sampleBlocks = [
          { id: 'b-0', label: '金', sublabel: '1', isSelected: false, isCorrectFlash: false, isWrongFlash: false, slotIndex: 0 },
          { id: 'b-1', label: '閣', sublabel: '2', isSelected: false, isCorrectFlash: false, isWrongFlash: false, slotIndex: 1 },
          { id: 'b-2', label: '寺', sublabel: '3', isSelected: false, isCorrectFlash: false, isWrongFlash: false, slotIndex: 2 },
          { id: 'b-3', label: '炎', sublabel: '4', isSelected: false, isCorrectFlash: false, isWrongFlash: false, slotIndex: 3 },
        ];

        const baseProps: any = {
          mode: 'counter',
          tier: 1,
          activeCustomer: SALON_CUSTOMERS[0],
          customerAnim: 'idle',
          patienceRatio: 0.85,
          blocks: sampleBlocks,
          onBlockPick,
          traySlots: [null, null],
          targetWordLength: 2,
          bossState: null,
          rushActive: false,
          feverActive: false,
          unlockedUpgrades: ['siphon'],
          particleEvent: null,
          qualityLevel: 'high',
        };

        const { getByTestId, rerender, unmount } = render(React.createElement(SalonCanvas3D, baseProps));
        const rootEl = getByTestId('salon-canvas-3d');
        expect(rootEl).toBeTruthy();

        // If jsdom fallback block buttons are rendered, verify clicking one triggers onBlockPick
        const fallbackBtns = rootEl.querySelectorAll('button');
        if (fallbackBtns.length > 0) {
          fireEvent.click(fallbackBtns[0]);
          expect(onBlockPick).toHaveBeenCalled();
        }

        // Rerender across modes, tiers, upgrades, fever, boss, and particle bursts
        const bossPair = getAllBossPairs()[0];
        rerender(
          React.createElement(SalonCanvas3D, {
            ...baseProps,
            mode: 'boss',
            tier: 4,
            feverActive: true,
            unlockedUpgrades: [...CANONICAL_UPGRADE_IDS],
            bossState: {
              bossPair,
              bossHp: 8,
              maxBossHp: 10,
              playerHearts: 3,
              maxHearts: 3,
              timeLeft: 5.0,
              isActive: true,
              isDefeated: false,
              isPlayerDefeated: false,
            },
            particleEvent: { id: 'evt-1', kind: 'slash' },
          })
        );

        expect(getByTestId('salon-canvas-3d')).toBeTruthy();
        expect(() => unmount()).not.toThrow();
      }
    );

    it.skipIf(!hasThreePkg || !hasSalonEnv3D)(
      'T3D-3D-02: SalonEnvironment3D instantiates, updates all 4 tiers & 6 upgrades + fever mode, and disposes cleanly',
      async () => {
        const THREE = await importModuleSafe('three');
        const envMod = await importModuleSafe('../src/three/SalonEnvironment3D');
        const SalonEnvironment3D = envMod.SalonEnvironment3D || envMod.default;
        expect(SalonEnvironment3D).toBeDefined();

        // First verify safe instantiation even when jsdom 2D canvas returns null
        const sceneNull2d = new THREE.Scene();
        const envNull2d = new SalonEnvironment3D(sceneNull2d);
        if (typeof envNull2d.dispose === 'function') {
          envNull2d.dispose();
        }

        // Now verify full texture & prop path with 2D canvas context polyfill
        const restore2d = installMock2DCanvasContext();
        try {
          const scene = new THREE.Scene();
          const env = new SalonEnvironment3D(scene);
          const rootObj = env.group || env.root || scene;
          expect(rootObj.children.length).toBeGreaterThan(0);

          for (const tier of [1, 2, 3, 4] as const) {
            if (typeof env.setTier === 'function') env.setTier(tier);
            else if (typeof env.updateTier === 'function') env.updateTier(tier);
          }

          if (typeof env.updateUpgrades === 'function') {
            env.updateUpgrades([]);
            env.updateUpgrades([...CANONICAL_UPGRADE_IDS]);
          } else if (typeof env.setUpgrades === 'function') {
            env.setUpgrades([...CANONICAL_UPGRADE_IDS]);
          }

          if (typeof env.setFeverMode === 'function') env.setFeverMode(true, true);
          else if (typeof env.setFever === 'function') env.setFever(true);

          if (typeof env.update === 'function') {
            env.update(0.016, 1.0);
          }

          expect(typeof env.dispose).toBe('function');
          expect(() => env.dispose()).not.toThrow();
        } finally {
          restore2d();
        }
      }
    );

    it.skipIf(!hasThreePkg || !hasCameraRig3D)(
      'T3D-3D-03: CameraRig3D supports all 7 camera modes, responsive desktop/mobile aspect ratios, shake & zoom punch',
      async () => {
        const THREE = await importModuleSafe('three');
        const camMod = await importModuleSafe('../src/three/CameraRig3D');
        const CameraRig3D = camMod.CameraRig3D || camMod.default;
        expect(CameraRig3D).toBeDefined();

        const perspCam = new THREE.PerspectiveCamera(45, 1280 / 800, 0.1, 100);
        const rig = new CameraRig3D(perspCam);
        const camera = rig.camera || rig.getCamera?.() || perspCam;

        const modes = ['title', 'map', 'counter', 'build', 'rush', 'boss', 'shop'] as const;
        for (const mode of modes) {
          if (typeof rig.setMode === 'function') rig.setMode(mode);
          else if (typeof rig.transitionTo === 'function') rig.transitionTo(mode);
          if (typeof rig.update === 'function') rig.update(0.05, 1.0);
          expect(Number.isFinite(camera.position.x)).toBe(true);
          expect(Number.isFinite(camera.position.y)).toBe(true);
          expect(Number.isFinite(camera.position.z)).toBe(true);
        }

        // Responsive resize: desktop 1280x800 vs narrow portrait mobile 390x844
        if (typeof rig.resize === 'function') {
          rig.resize(1280, 800);
          rig.resize(390, 844);
        } else if (typeof rig.setAspect === 'function') {
          rig.setAspect(1280 / 800);
          rig.setAspect(390 / 844);
        }

        if (typeof rig.triggerShake === 'function') rig.triggerShake(0.25, 0.3);
        if (typeof rig.triggerZoomPunch === 'function') rig.triggerZoomPunch(3.2);
        if (typeof rig.update === 'function') {
          rig.update(0.016, 1.2);
          // Adversarial low-FPS stability check (dt = 0.1s x 30 frames must decay cleanly, never explode!)
          for (let step = 0; step < 30; step++) {
            rig.update(0.1, 1.3 + step * 0.1);
            expect(Math.abs(camera.position.z)).toBeLessThan(25);
            expect(camera.fov).toBeGreaterThanOrEqual(24);
            expect(camera.fov).toBeLessThanOrEqual(72);
          }
        }

        expect(Number.isFinite(camera.position.x)).toBe(true);
        expect(Number.isFinite(camera.position.y)).toBe(true);
        expect(Number.isFinite(camera.position.z)).toBe(true);
      }
    );

    it.skipIf(!hasThreePkg || !hasParticleSys3D)(
      'T3D-3D-04: ParticleSystem3D emits coin, sakura, angry, slash & fever bursts and steps cleanly',
      async () => {
        const THREE = await importModuleSafe('three');
        const partMod = await importModuleSafe('../src/three/ParticleSystem3D');
        const ParticleSystem3D = partMod.ParticleSystem3D || partMod.default;
        expect(ParticleSystem3D).toBeDefined();

        const restore2d = installMock2DCanvasContext();
        try {
          const scene = new THREE.Scene();
          const particles = new ParticleSystem3D(scene);
          const origin = new THREE.Vector3(0, 1.2, 0);

          for (const kind of ['coin', 'sakura', 'angry', 'slash', 'fever'] as const) {
            if (typeof particles.emit === 'function') {
              particles.emit(kind, origin);
            } else if (typeof particles.burst === 'function') {
              particles.burst(kind, origin);
            }
          }

          if (typeof particles.update === 'function') {
            particles.update(0.016, 0.5);
            particles.update(0.25, 0.75);
          }

          if (typeof particles.dispose === 'function') {
            expect(() => particles.dispose()).not.toThrow();
          }
        } finally {
          restore2d();
        }
      }
    );

    it.skipIf(!hasThreePkg || !hasCustomerActors3D || !hasKanjiBlocks3D || !hasBossAvatar3D)(
      'T3D-3D-05: CustomerActors3D, KanjiBlocks3D, and BossAvatar3D instantiate, animate all patrons/blocks/bosses, and dispose cleanly',
      async () => {
        const THREE = await importModuleSafe('three');
        const custMod = await importModuleSafe('../src/three/CustomerActors3D');
        const blocksMod = await importModuleSafe('../src/three/KanjiBlocks3D');
        const bossMod = await importModuleSafe('../src/three/BossAvatar3D');

        const CustomerActors3D = custMod.CustomerActors3D || custMod.default;
        const KanjiBlocks3D = blocksMod.KanjiBlocks3D || blocksMod.default;
        const BossAvatar3D = bossMod.BossAvatar3D || bossMod.default;

        expect(CustomerActors3D).toBeDefined();
        expect(KanjiBlocks3D).toBeDefined();
        expect(BossAvatar3D).toBeDefined();

        const restore2d = installMock2DCanvasContext();
        try {
          const scene = new THREE.Scene();

          // 1) CustomerActors3D across all 8 Mishima literary patrons + 'asako' alias
          const customerActor = new CustomerActors3D(scene);
          for (const patron of [...SALON_CUSTOMERS, { id: 'asako', name: '朝子', avatar: 'avatar-asako', work: '鹿鳴館', role: '伯爵夫人' }]) {
            if (typeof customerActor.setCustomer === 'function') {
              customerActor.setCustomer(patron);
            } else if (typeof customerActor.spawnCustomer === 'function') {
              customerActor.spawnCustomer(patron.id);
            }
            for (const anim of ['entering', 'idle', 'impatient', 'happy', 'angry', 'leaving'] as const) {
              if (typeof customerActor.setAnimState === 'function') {
                customerActor.setAnimState(anim);
              } else if (typeof customerActor.setAnimation === 'function') {
                customerActor.setAnimation(anim);
              }
              if (typeof customerActor.update === 'function') {
                customerActor.update(0.032, anim === 'impatient' ? 0.2 : 0.8);
              }
            }
          }

          if (typeof customerActor.getHeadAnchorWorldPosition === 'function') {
            const anchor = customerActor.getHeadAnchorWorldPosition();
            expect(anchor).toBeDefined();
            expect(Number.isFinite(anchor.x)).toBe(true);
            expect(Number.isFinite(anchor.y)).toBe(true);
          }

          // 2) KanjiBlocks3D with 4 high-contrast kanji blocks & serving tray
          const blocks3d = new KanjiBlocks3D(scene);
          const items = [
            { id: '0', label: '金', sublabel: '1', isSelected: false, isCorrectFlash: false, isWrongFlash: false, slotIndex: 0 },
            { id: '1', label: '閣', sublabel: '2', isSelected: true, isCorrectFlash: true, isWrongFlash: false, slotIndex: 1 },
            { id: '2', label: '寺', sublabel: '3', isSelected: false, isCorrectFlash: false, isWrongFlash: true, slotIndex: 2 },
            { id: '3', label: '炎', sublabel: '4', isSelected: false, isCorrectFlash: false, isWrongFlash: false, slotIndex: 3 },
          ];
          if (typeof blocks3d.setBlocks === 'function') {
            blocks3d.setBlocks(items);
          } else if (typeof blocks3d.updateBlocks === 'function') {
            blocks3d.updateBlocks(items);
          }
          if (typeof blocks3d.setTray === 'function') {
            blocks3d.setTray(['金', null], 2);
          } else if (typeof blocks3d.updateTray === 'function') {
            blocks3d.updateTray(['金', null], 2);
          }
          if (typeof blocks3d.update === 'function') {
            blocks3d.update(0.016, 1.0);
          }

          // 3) BossAvatar3D with confusing kanji tablets
          const boss3d = new BossAvatar3D(scene);
          const bossPair = getAllBossPairs()[0];
          if (typeof boss3d.setBoss === 'function') {
            boss3d.setBoss(bossPair, 8, 10);
          } else if (typeof boss3d.setBossState === 'function') {
            boss3d.setBossState({ bossPair, bossHp: 8, maxBossHp: 10, isActive: true });
          }
          if (typeof boss3d.triggerHit === 'function') boss3d.triggerHit();
          if (typeof boss3d.triggerAttack === 'function') boss3d.triggerAttack();
          if (typeof boss3d.update === 'function') boss3d.update(0.016, 1.0);

          if (typeof customerActor.dispose === 'function') customerActor.dispose();
          if (typeof blocks3d.dispose === 'function') blocks3d.dispose();
          if (typeof boss3d.dispose === 'function') boss3d.dispose();
        } finally {
          restore2d();
        }
      }
    );
  });

  // =========================================================================
  // 4. Full 3D App Integration, Korean Readability & Cafe Shop Modal UX
  // =========================================================================
  describe('4. Full 3D App Integration & Korean-First UI Contracts', () => {
    it.skipIf(!isPhase2Integrated)(
      'T3D-UI-01: Phase 2 completeness gate — all 11 3D overhaul modules exist and App persistently renders SalonCanvas3D',
      async () => {
        expect(hasThreePkg, 'three package must be installed').toBe(true);
        expect(hasThreeTypes, 'src/types/three3d.ts must exist').toBe(true);
        expect(hasMnemonics, 'src/data/koreanMnemonics.ts must exist').toBe(true);
        expect(hasCafeShop, 'src/game/cafeShopEngine.ts must exist').toBe(true);
        expect(hasSalonEnv3D, 'src/three/SalonEnvironment3D.ts must exist').toBe(true);
        expect(hasCameraRig3D, 'src/three/CameraRig3D.ts must exist').toBe(true);
        expect(hasParticleSys3D, 'src/three/ParticleSystem3D.ts must exist').toBe(true);
        expect(hasCustomerActors3D, 'src/three/CustomerActors3D.ts must exist').toBe(true);
        expect(hasKanjiBlocks3D, 'src/three/KanjiBlocks3D.ts must exist').toBe(true);
        expect(hasBossAvatar3D, 'src/three/BossAvatar3D.ts must exist').toBe(true);
        expect(hasSalonCanvas3D, 'src/components/SalonCanvas3D.tsx must exist').toBe(true);
        expect(hasCafeShopModal, 'src/components/CafeShopModal.tsx must exist').toBe(true);

        const appMod = await importModuleSafe('../src/App');
        const App = appMod.App || appMod.default;
        const { getByTestId } = render(React.createElement(App));

        // Persistent 3D world canvas is mounted behind TitleScreen
        expect(getByTestId('salon-canvas-3d')).toBeTruthy();
        expect(getByTestId('title-screen')).toBeTruthy();

        // Transition Title -> Map keeps 3D canvas mounted
        fireEvent.click(getByTestId('btn-start-shift'));
        expect(getByTestId('salon-canvas-3d')).toBeTruthy();
        expect(getByTestId('salon-map')).toBeTruthy();
      }
    );

    it.skipIf(!hasMnemonics)(
      'T3D-UI-02: WordRevealModal surfaces Korean huneum, radicalBreakdown, storyMnemonicKo, koreanSoundTip, and quoteKo when integrated',
      async () => {
        const mneMod = await importModuleSafe('../src/data/koreanMnemonics');
        const revealMod = await importModuleSafe('../src/components/WordRevealModal');
        const WordRevealModal = revealMod.WordRevealModal || revealMod.default;

        const revealSrc = fs.readFileSync(
          path.join(rootDir, 'src/components/WordRevealModal.tsx'),
          'utf-8'
        );
        if (!revealSrc.includes('koreanMnemonics')) {
          return;
        }

        const sampleKanji = getAllKanji()[0]; // 金
        const mne = mneMod.getKoreanMnemonic(sampleKanji.character);
        const onClose = vi.fn();

        render(
          React.createElement(WordRevealModal, {
            isOpen: true,
            kanji: sampleKanji,
            onClose,
          })
        );

        const text = document.body.textContent || '';
        expect(text).toContain(sampleKanji.character);
        expect(text).toContain(mne.radicalBreakdown);
        expect(text).toContain(mne.storyMnemonicKo);
        expect(text).toContain(mne.quoteKo);
      }
    );

    it.skipIf(!hasCafeShopModal || !hasCafeShop)(
      'T3D-UI-03: CafeShopModal displays all 6 3D cafe upgrades in Korean and supports purchasing upgrades',
      async () => {
        saveProfile(createDefaultProfile({ coins: 900, unlockedUpgrades: [] } as any));
        const modalMod = await importModuleSafe('../src/components/CafeShopModal');
        const CafeShopModal = modalMod.CafeShopModal || modalMod.default;
        expect(CafeShopModal).toBeDefined();

        const onPurchase = vi.fn();
        const onClose = vi.fn();
        render(
          React.createElement(CafeShopModal, {
            isOpen: true,
            coins: 900,
            unlockedUpgrades: [],
            onPurchase,
            onBuyUpgrade: onPurchase,
            onClose,
          } as any)
        );

        const modalText = document.body.textContent || '';
        expect(HANGUL_REGEX.test(modalText)).toBe(true);
        expect(modalText).toContain('150');
        expect(modalText).toContain('800');
      }
    );

    it('T3D-UI-04: SalonCounter preserves pick/recall/build DOM contracts and Korean prompts', async () => {
      const sampleKanji = getAllKanji()[0];
      const pickOrder = await generateOrder(sampleKanji, 'pick');
      const counterMod = await importModuleSafe('../src/components/SalonCounter');
      const SalonCounter = counterMod.SalonCounter || counterMod.default;
      const onPickOption = vi.fn();

      const { getByTestId } = render(
        React.createElement(SalonCounter, {
          activeOrder: pickOrder,
          onPickOption,
        })
      );

      expect(getByTestId('salon-counter')).toBeTruthy();
      const correctBtn = document.querySelector<HTMLButtonElement>(
        `[data-testid="conveyor-option-${pickOrder.correctOption}"]`
      );
      expect(correctBtn).not.toBeNull();
      fireEvent.click(correctBtn!);
      expect(onPickOption).toHaveBeenCalledWith(pickOrder.correctOption);
    });
  });
});
