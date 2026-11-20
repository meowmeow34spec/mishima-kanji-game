/**
 * Salon Mishima 3D - 25-Second Storm Order Rush Overlay Over Live 3D Cafe
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
  const resolvedTimeLeft =
    timeLeft ?? rushState?.timeLeft ?? gameState.timeLeft ?? 25.0;
  const resolvedHits = hits ?? rushState?.hits ?? 0;
  const resolvedMisses = misses ?? rushState?.misses ?? 0;
  const resolvedCoins = earnedCoins ?? rushState?.earnedCoins ?? 0;
  const resolvedActive =
    isActive ?? rushState?.isActive ?? resolvedTimeLeft > 0;

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
        dispatch({
          type: 'RUSH_ANSWER',
          payload: { isCorrect, coinReward: 15 },
        });
      }

      if (currentPrompt === undefined) {
        const nextIdx = promptIndex + 1;
        setPromptIndex(nextIdx);
        setLocalPrompt(
          createNextRushPrompt(nextIdx + Math.floor(Math.random() * 10))
        );
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!resolvedActive || !activePrompt) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        document.querySelector('[role="dialog"]')
      ) {
        return;
      }
      const keyIdx = ['1', '2', '3', '4'].indexOf(e.key);
      if (keyIdx >= 0 && keyIdx < activePrompt.options.length) {
        e.preventDefault();
        handleSelect(activePrompt.options[keyIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [resolvedActive, activePrompt, handleSelect]);

  return (
    <div data-testid="rush-overlay" className="rush-screen-shell">
      {/* Subtle Adrenaline Edge Glow (3D Cafe Remains 100% Clear!) */}
      <div className="rush-overlay" aria-hidden="true" />

      {/* Top Rush Banner + Prompt Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <div className="rush-hud-banner">
          <Zap size={19} style={{ flexShrink: 0 }} />
          <span>25초 폭풍 주문 러시</span>
          <span
            data-testid="rush-timer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Timer size={17} style={{ flexShrink: 0 }} />
            {resolvedTimeLeft.toFixed(1)}s
          </span>
        </div>

        <div className="counter-order-card" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.45rem',
            }}
          >
            <span className="pill-badge pill-badge--work" data-testid="rush-hits">
              🎯 적중: {resolvedHits}회 · 오답: {resolvedMisses}회
            </span>
            <span className="pill-badge pill-badge--huneum" data-testid="rush-coins">
              <Coins size={15} />
              <span>보너스: +{resolvedCoins} 銭</span>
            </span>
          </div>

          {resolvedActive && activePrompt ? (
            <>
              <div className="blackboard-title">
                ⚡ 뜻과 훈음을 보고 알맞은 한자 블록을 즉시 선택하세요! (오답 시 -1.5초)
              </div>
              <div
                className="blackboard-prompt"
                style={{ fontSize: 'clamp(1.35rem, 3.2vw, 1.85rem)', marginTop: '0.2rem' }}
              >
                「{activePrompt.promptText}」
              </div>
              {activePrompt.hintKo && (
                <div
                  style={{
                    marginTop: '0.35rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#5c2d0c',
                  }}
                >
                  💡 {activePrompt.hintKo}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '0.5rem 0' }}>
              <h3
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#991b1b',
                  marginBottom: '0.4rem',
                }}
              >
                🔔 25초 폭풍 러시 종료!
              </h3>
              <p
                style={{
                  color: '#2c2520',
                  fontWeight: 800,
                  fontSize: '1rem',
                  marginBottom: '0.95rem',
                }}
              >
                총 {resolvedHits}건 서빙 성공! 획득 엽전: +{resolvedCoins} 銭
              </p>
              <button
                type="button"
                data-testid="btn-end-rush"
                className="btn-gold"
                onClick={handleEnd}
              >
                <span>🗺️ 챕터 맵으로 돌아가기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Open 3D Fever Counter Viewport */}
      <div className="counter-3d-viewport-spacer" aria-hidden="true" />

      {/* Bottom Kanji Block Hotbar */}
      {resolvedActive && activePrompt && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.55rem',
            width: '100%',
            pointerEvents: 'auto',
            zIndex: 20,
          }}
        >
          <div className="conveyor-rail">
            <div className="conveyor-track">
              {activePrompt.options.map((opt, idx) => (
                <button
                  key={`${opt}-${idx}`}
                  type="button"
                  data-testid={`rush-option-${opt}`}
                  data-hotkey={idx < 4 ? String(idx + 1) : undefined}
                  className="wooden-block conveyor-block"
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-end-rush"
            className="btn-lacquer"
            onClick={handleEnd}
          >
            <X size={16} />
            <span>러시 중단하고 나가기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RushOverlay;
