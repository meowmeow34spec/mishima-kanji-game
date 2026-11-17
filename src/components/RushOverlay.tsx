/**
 * Salon Mishima - 25-Second Rush Mode Overlay Component
 * File: src/components/RushOverlay.tsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Timer, Coins, X } from 'lucide-react';
import type { RushPrompt } from '../types/game';
import { getAllKanji } from '../data/mishimaCurriculum';
import { generateRushPrompt } from '../game/rushController';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface RushOverlayProps {
  timeLeft?: number;
  hits?: number;
  misses?: number;
  earnedCoins?: number;
  currentPrompt?: RushPrompt | null;
  onAnswer?: (isCorrect: boolean) => void;
  onEndRush?: () => void;
  isActive?: boolean;
}

function createNextRushPrompt(index: number): RushPrompt {
  const all = getAllKanji();
  const kanji = all[index % all.length];
  return generateRushPrompt(kanji);
}

export const RushOverlay: React.FC<RushOverlayProps> = ({
  timeLeft,
  hits,
  misses,
  earnedCoins,
  currentPrompt,
  onAnswer,
  onEndRush,
  isActive,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const rushState = gameState.rushState;

  const isStandalone = onAnswer !== undefined;
  const resolvedTimeLeft = timeLeft ?? rushState?.timeLeft ?? gameState.timeLeft ?? 25.0;
  const resolvedHits = hits ?? rushState?.hits ?? 0;
  const resolvedMisses = misses ?? rushState?.misses ?? 0;
  const resolvedCoins = earnedCoins ?? rushState?.earnedCoins ?? 0;
  const resolvedActive = isActive ?? rushState?.isActive ?? resolvedTimeLeft > 0;

  const [promptIndex, setPromptIndex] = useState(0);
  const [localPrompt, setLocalPrompt] = useState<RushPrompt>(() =>
    createNextRushPrompt(Math.floor(Math.random() * 20))
  );

  const activePrompt = currentPrompt !== undefined ? currentPrompt : localPrompt;

  useEffect(() => {
    if (isStandalone || !resolvedActive) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_RUSH', payload: { deltaSeconds: 0.1 } });
    }, 100);
    return () => clearInterval(interval);
  }, [isStandalone, resolvedActive, dispatch]);

  const handleSelect = useCallback(
    (option: string) => {
      if (!resolvedActive || !activePrompt) return;
      const isCorrect = option === activePrompt.correctOption;

      if (onAnswer) {
        onAnswer(isCorrect);
      } else {
        dispatch({ type: 'RUSH_ANSWER', payload: { isCorrect, coinReward: 15 } });
      }

      if (currentPrompt === undefined) {
        const nextIdx = promptIndex + 1;
        setPromptIndex(nextIdx);
        setLocalPrompt(createNextRushPrompt(nextIdx + Math.floor(Math.random() * 10)));
      }
    },
    [resolvedActive, activePrompt, onAnswer, dispatch, currentPrompt, promptIndex]
  );

  const handleEnd = () => {
    if (onEndRush) {
      onEndRush();
    } else {
      dispatch({ type: 'END_RUSH' });
    }
  };

  return (
    <div
      data-testid="rush-overlay"
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem 2rem',
        width: '100%',
      }}
    >
      {/* Pulsing Crimson Vignette Border */}
      <div className="rush-overlay" aria-hidden="true" />

      {/* Top Rush HUD */}
      <div className="rush-hud-banner">
        <Zap size={22} />
        <span>猛火注文 RUSH</span>
        <span data-testid="rush-timer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Timer size={20} />
          {resolvedTimeLeft.toFixed(1)}s
        </span>
      </div>

      {/* Main Rush Card */}
      <div
        className="blackboard-order"
        style={{
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 90,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span className="stat-badge" data-testid="rush-hits">
            的中: {resolvedHits} 回 ／ 誤答: {resolvedMisses} 回
          </span>
          <span className="stat-badge stat-badge--coins" data-testid="rush-coins">
            <Coins size={14} />
            <span>獲得: {resolvedCoins} 銭</span>
          </span>
        </div>

        {resolvedActive && activePrompt ? (
          <>
            <div>
              <div className="blackboard-title">
                即断給仕 — 意味に合う漢字を選べ！（誤答 -1.5秒）
              </div>
              <div className="blackboard-prompt" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
                「{activePrompt.promptText}」
              </div>
            </div>

            <div className="conveyor-rail">
              <div className="conveyor-track">
                {activePrompt.options.map((opt, idx) => (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    data-testid={`rush-option-${opt}`}
                    className="wooden-block conveyor-block"
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '1rem 0' }}>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-gold-light)', marginBottom: '0.75rem' }}>
              猛火注文 終了！
            </h3>
            <p style={{ color: 'var(--color-washi-dim)', marginBottom: '1.25rem' }}>
              的中数: {resolvedHits} 件 ／ 獲得報酬: {resolvedCoins} 銭
            </p>
            <button
              type="button"
              data-testid="btn-end-rush"
              className="btn-gold"
              onClick={handleEnd}
            >
              <span>帳場へ戻る</span>
            </button>
          </div>
        )}

        {resolvedActive && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              data-testid="btn-end-rush"
              className="btn-lacquer"
              onClick={handleEnd}
            >
              <X size={16} />
              <span>中断して戻る</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RushOverlay;
