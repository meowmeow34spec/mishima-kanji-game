/**
 * Salon Mishima - React 19 useSyncExternalStore Hook for Game State
 * File: src/hooks/useGameState.ts
 */

import { useSyncExternalStore, useCallback, useRef } from 'react';
import { gameEngine } from '../game/gameEngine';
import type { GameState, GameAction } from '../types/game';

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

export default useGameState;
