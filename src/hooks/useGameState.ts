/**
 * Salon Mishima 3D - React 19 useSyncExternalStore Hook & 3D State Selectors
 * File: src/hooks/useGameState.ts
 */

import { useSyncExternalStore, useCallback, useMemo, useRef } from 'react';
import { gameEngine } from '../game/gameEngine';
import { normalizeUnlockedUpgrades } from '../game/cafeShopEngine';
import { getKoreanMnemonic, getFirstSightHintKo } from '../data/koreanMnemonics';
import type { GameState, GameAction, ActiveOrder } from '../types/game';
import type { CurriculumTierNumber } from '../types/curriculum';
import type {
  CameraMode3D,
  CustomerAnimState,
  CafeUpgradeId,
  QualityLevel3D,
} from '../types/three3d';

/**
 * Derives the active 3D camera rig mode from the current game state.
 */
export function deriveCameraMode3D(state: GameState): CameraMode3D {
  switch (state.mode) {
    case 'title':
      return 'title';
    case 'shop':
      return 'shop';
    case 'boss':
      return 'boss';
    case 'rush':
      return 'rush';
    case 'lesson':
      return state.activeOrder?.mode === 'build' ? 'build' : 'counter';
    case 'map':
    case 'codex':
    case 'review':
    default:
      return 'map';
  }
}

/**
 * Computes normalized [0..1] customer patience ratio from game state.
 */
export function derivePatienceRatio(state: GameState): number {
  const maxP = state.maxPatienceSeconds ?? 20;
  const curP = state.patienceSeconds ?? maxP;
  if (!Number.isFinite(maxP) || maxP <= 0) return 1;
  return Math.max(0, Math.min(1, curP / maxP));
}

/**
 * Resolves the 3D patron procedural animation state, promoting 'idle' to
 * 'impatient' when customer patience drops below 35%.
 */
export function deriveCustomerAnimState(
  state: GameState,
  patienceRatio: number = derivePatienceRatio(state)
): CustomerAnimState {
  const explicit = state.customerAnim;
  if (
    explicit === 'happy' ||
    explicit === 'angry' ||
    explicit === 'entering' ||
    explicit === 'leaving'
  ) {
    return explicit;
  }
  if (state.mode === 'lesson' && patienceRatio < 0.35) {
    return 'impatient';
  }
  return explicit ?? 'idle';
}

/**
 * Resolves the player's saved 3D WebGL quality preset ('high' default).
 */
export function deriveQualityLevel3D(state: GameState): QualityLevel3D {
  const saved = state.profile?.settings?.qualityLevel;
  if (saved === 'low' || saved === 'medium' || saved === 'high') {
    return saved;
  }
  return 'high';
}

/**
 * Resolves normalized unlocked 3D cafe interior upgrade IDs.
 */
export function deriveUnlockedUpgrades(state: GameState): CafeUpgradeId[] {
  return normalizeUnlockedUpgrades(
    state.unlockedUpgrades ?? state.profile?.unlockedUpgrades ?? []
  );
}

/**
 * Extracts first-sight Korean mnemonic hint data for effortless memorization.
 */
export function deriveFirstSightMnemonicHint(order: ActiveOrder | null | undefined) {
  if (!order?.targetKanji) {
    return {
      isNewKanji: false,
      hintSummaryKo: '',
      mnemonic: undefined,
    };
  }
  const mnemonic = getKoreanMnemonic(order.targetKanji.character);
  const isNewKanji = Boolean(order.isNewKanji ?? (order.srsBox ?? 0) === 0);
  const hintSummaryKo =
    order.hintSummaryKo || getFirstSightHintKo(order.targetKanji.character);

  return {
    isNewKanji,
    hintSummaryKo,
    mnemonic,
  };
}

/**
 * Subscribes to the master GameEngine singleton state.
 * Supports optional selector for fine-grained re-renders.
 */
export function useGameState(): GameState;
export function useGameState<T>(selector: (state: GameState) => T): T;
export function useGameState<T = GameState>(selector?: (state: GameState) => T): T {
  const lastStateRef = useRef<GameState>(gameEngine.getState());
  const lastSelectedRef = useRef<T>(
    selector ? selector(lastStateRef.current) : (lastStateRef.current as unknown as T)
  );

  const getSnapshot = useCallback(() => {
    const currentState = gameEngine.getState();
    if (!selector) return currentState as unknown as T;

    if (currentState !== lastStateRef.current) {
      lastStateRef.current = currentState;
      lastSelectedRef.current = selector(currentState);
    }
    return lastSelectedRef.current;
  }, [selector]);

  return useSyncExternalStore(gameEngine.subscribe, getSnapshot);
}

/**
 * Returns the stable dispatch method from GameEngine.
 */
export function useGameDispatch(): (action: GameAction) => void {
  return useCallback((action: GameAction) => {
    gameEngine.dispatch(action);
  }, []);
}

/**
 * Convenience action creators for 3D cafe shop upgrades, quality toggles,
 * quick-play counter entry, and tactile 3D block interactions.
 */
export function useSalon3DActions() {
  const dispatch = useGameDispatch();

  return useMemo(
    () => ({
      openShop: () => dispatch({ type: 'OPEN_SHOP' }),
      closeShop: () => dispatch({ type: 'CLOSE_SHOP' }),
      purchaseUpgrade: (upgradeId: CafeUpgradeId | string) =>
        dispatch({ type: 'PURCHASE_UPGRADE', payload: { upgradeId } }),
      quickPlay: (tier?: CurriculumTierNumber, stageId?: string) =>
        dispatch({ type: 'QUICK_PLAY', payload: { tier, stageId } }),
      pickBlock: (option: string) =>
        dispatch({ type: 'PICK_BLOCK', payload: { option } }),
      placeTraySlot: (slotIndex: number, character: string) =>
        dispatch({ type: 'PLACE_TRAY_SLOT', payload: { slotIndex, character } }),
      clearTray: () => dispatch({ type: 'CLEAR_TRAY' }),
      tickPatience: (deltaSeconds = 0.25) =>
        dispatch({ type: 'TICK_PATIENCE', payload: { deltaSeconds } }),
      setQualityLevel: (qualityLevel: QualityLevel3D) => {
        const current = gameEngine.getState().profile;
        if (!current) return;
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: {
            settings: {
              ...current.settings,
              qualityLevel,
            },
          },
        });
      },
    }),
    [dispatch]
  );
}

export default useGameState;
