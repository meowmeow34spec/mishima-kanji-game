/**
 * Salon Mishima 3D - Ultra-Compact High-Contrast Cafe Counter HUD Over Live 3D World
 * File: src/components/SalonCounter.tsx
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  Flame,
  RotateCcw,
  Lightbulb,
  Shield,
  Sparkles,
} from 'lucide-react';
import type { ActiveOrder } from '../types/game';
import type { SpeechBubbleAnchor2D } from '../types/three3d';
import { getKoreanCustomer } from '../data/koreanGlossary';
import { getKoreanMnemonic } from '../data/koreanMnemonics';
import { ConveyorRail } from './ConveyorRail';
import { ServingTray } from './ServingTray';
import { KeypadRecall } from './KeypadRecall';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface SalonCounterProps {
  activeOrder?: ActiveOrder | null;
  onPickOption?: (option: string) => void;
  onTrayDrop?: (slotIndex: number, character: string) => void;
  onClearTray?: () => void;
  traySlots?: (string | null)[];
  score?: number;
  coins?: number;
  combo?: number;
  hearts?: number;
  stageOrderIndex?: number;
  stageTotalOrders?: number;
  isGameOver?: boolean;
  speechAnchor?: SpeechBubbleAnchor2D | null;
  onReturnToMap?: () => void;
  onExit?: () => void;
}

export const SalonCounter: React.FC<SalonCounterProps> = ({
  activeOrder,
  onPickOption,
  onTrayDrop,
  onClearTray,
  traySlots,
  score,
  coins,
  combo,
  hearts,
  stageOrderIndex,
  stageTotalOrders,
  isGameOver,
  speechAnchor,
  onReturnToMap,
  onExit,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [lastPicked, setLastPicked] = useState<{
    option: string;
    isCorrect: boolean;
  } | null>(null);
  const [manualHintOpen, setManualHintOpen] = useState(false);
  const pickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pickTimerRef.current) {
        clearTimeout(pickTimerRef.current);
        pickTimerRef.current = null;
      }
    };
  }, []);

  const isStandalone = activeOrder !== undefined;
  const resolvedOrder = isStandalone ? activeOrder : gameState.activeOrder;
  const resolvedScore = score ?? gameState.score;
  const resolvedCoins = coins ?? gameState.coins;
  const resolvedCombo = combo ?? gameState.combo;
  const resolvedHearts = hearts ?? gameState.hearts;
  const resolvedOrderIndex = stageOrderIndex ?? gameState.stageOrderIndex;
  const resolvedTotalOrders = stageTotalOrders ?? gameState.stageTotalOrders;
  const resolvedGameOver = isGameOver ?? gameState.isGameOver;
  const resolvedTraySlots =
    traySlots ??
    (isStandalone ? activeOrder?.traySlots : gameState.traySlots) ??
    [];

  useEffect(() => {
    setManualHintOpen(false);
  }, [resolvedOrder?.id]);

  const isInputDisabled =
    Boolean(!isStandalone && gameState.revealKanji) || resolvedGameOver;

  // Live customer patience ticker during active Shift Counter play
  useEffect(() => {
    if (
      isStandalone ||
      isInputDisabled ||
      !resolvedOrder ||
      gameState.mode !== 'lesson'
    ) {
      return;
    }
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      dispatch({ type: 'TICK_PATIENCE', payload: { deltaSeconds: 0.25 } });
    }, 250);
    return () => clearInterval(interval);
  }, [isStandalone, isInputDisabled, resolvedOrder, gameState.mode, dispatch]);

  const handlePick = (option: string) => {
    if (isInputDisabled || !resolvedOrder) return;

    const isCorrect = option === resolvedOrder.correctOption;
    setLastPicked({ option, isCorrect });
    if (pickTimerRef.current) {
      clearTimeout(pickTimerRef.current);
    }
    pickTimerRef.current = setTimeout(() => {
      pickTimerRef.current = null;
      setLastPicked(null);
    }, 420);

    if (resolvedOrder.mode === 'build' && onTrayDrop) {
      const firstEmpty = resolvedTraySlots.findIndex((s) => s === null);
      const targetIdx = firstEmpty >= 0 ? firstEmpty : 0;
      onTrayDrop(targetIdx, option);
      return;
    }

    if (onPickOption) {
      onPickOption(option);
    } else {
      dispatch({ type: 'PICK_BLOCK', payload: { option } });
    }
  };

  const handleClearTray = () => {
    if (onClearTray) {
      onClearTray();
    } else {
      dispatch({ type: 'CLEAR_TRAY' });
    }
  };

  const handleReturn = () => {
    if (onReturnToMap) {
      onReturnToMap();
    } else if (onExit) {
      onExit();
    } else {
      dispatch({ type: 'RETURN_TO_MAP' });
    }
  };

  const handleRetry = () => {
    dispatch({
      type: 'SELECT_STAGE',
      payload: {
        tier: gameState.currentTier,
        stageId:
          gameState.currentStageId || `stage-${gameState.currentTier}-1`,
      },
    });
  };

  const heartDisplay = Array.from(
    { length: Math.max(0, resolvedHearts) },
    () => '❤️'
  ).join(' ');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isInputDisabled || !resolvedOrder) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        document.querySelector('[role="dialog"]')
      ) {
        return;
      }
      const keyIdx = ['1', '2', '3', '4'].indexOf(e.key);
      if (keyIdx >= 0 && keyIdx < resolvedOrder.options.length) {
        e.preventDefault();
        handlePick(resolvedOrder.options[keyIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!resolvedOrder) {
    return (
      <div className="salon-counter" data-testid="salon-counter">
        <div className="counter-order-card blackboard-order" style={{ textAlign: 'center' }}>
          <p className="blackboard-prompt">새 손님이 카운터로 걸어오고 있습니다…</p>
          <button
            type="button"
            data-testid="btn-return-map"
            className="btn-ivory"
            style={{ marginTop: '0.65rem' }}
            onClick={handleReturn}
          >
            <ArrowLeft size={15} />
            <span>맵으로</span>
          </button>
        </div>
      </div>
    );
  }

  const targetKanji = resolvedOrder.targetKanji;
  const mne = targetKanji ? getKoreanMnemonic(targetKanji.character) : undefined;
  const customerKo = getKoreanCustomer(
    resolvedOrder.customerId || resolvedOrder.customerName
  );
  const customerShortLabel = customerKo
    ? `${customerKo.nameKo} (${resolvedOrder.customerName})`
    : resolvedOrder.customerName;

  const orderCompoundReading =
    targetKanji?.literaryCompounds?.[0]?.reading || '';
  const onyomiFirst =
    targetKanji?.onyomi?.[0] || targetKanji?.readings?.onyomi?.[0] || '';
  const huneumText = resolvedOrder.huneumKo || mne?.huneum || '';
  const isFirstSightCompact =
    !manualHintOpen && Boolean(resolvedOrder.isNewKanji && resolvedOrder.mode !== 'build');

  const maxPatience = gameState.maxPatienceSeconds ?? 20;
  const curPatience = gameState.patienceSeconds ?? maxPatience;
  const patiencePct =
    maxPatience > 0
      ? Math.max(0, Math.min(100, (curPatience / maxPatience) * 100))
      : 100;
  const patienceColor =
    patiencePct > 55 ? '#16a34a' : patiencePct > 30 ? '#d97706' : '#dc2626';

  const bubbleTailX = speechAnchor?.visible
    ? `${Math.round(Math.min(80, Math.max(20, speechAnchor.nx * 100)))}%`
    : '50%';

  return (
    <div className="salon-counter" data-testid="salon-counter">
      {/* 1. ULTRA-COMPACT TOP ZONE (<= 155px desktop / <= 190px mobile so 3D Customer Shines!) */}
      <div className="counter-top-zone">
        <div className="counter-status-bar">
          <button
            type="button"
            data-testid="btn-return-map"
            className="btn-lacquer"
            style={{ padding: '0.28rem 0.65rem', fontSize: '0.875rem' }}
            onClick={handleReturn}
          >
            <ArrowLeft size={14} />
            <span>맵으로</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {gameState.feverActive && (
              <span className="pill-badge pill-badge--fever" data-testid="fever-badge">
                <Sparkles size={13} />
                <span>피버 2배</span>
              </span>
            )}

            {(gameState.shieldRemaining ?? 0) > 0 && (
              <span className="pill-badge pill-badge--huneum" data-testid="shield-badge">
                <Shield size={13} />
                <span>보호막</span>
              </span>
            )}

            <span className="stat-badge" data-testid="score-counter">
              {resolvedScore}점
            </span>
            <span className="stat-badge stat-badge--coins" data-testid="coins-counter">
              <Coins size={13} />
              <span>{resolvedCoins} 銭</span>
            </span>
            <span className="stat-badge stat-badge--streak" data-testid="combo-counter">
              <Flame size={13} />
              <span>{resolvedCombo}콤보</span>
            </span>
            <span
              className="hearts-display"
              data-testid="hearts-display"
              aria-label={`Hearts: ${resolvedHearts}`}
            >
              {heartDisplay}
            </span>
          </div>
        </div>

        {/* High-Contrast Warm Ivory Customer Speech Bubble */}
        <div
          className="counter-order-card blackboard-order"
          data-testid="order-blackboard"
          style={{ '--bubble-tail-x': bubbleTailX } as React.CSSProperties}
        >
          {/* Row 1: Patron + Progress + Crisp Reading/Huneum Pills + Hint Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.3rem 0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
              <div className="patron-avatar" title={resolvedOrder.customerName}>
                {resolvedOrder.customerName.slice(0, 1)}
              </div>
              <span
                data-testid="customer-name"
                style={{ fontSize: '0.875rem', color: '#78350f', fontWeight: 900 }}
              >
                {customerShortLabel}
              </span>
              <span className="blackboard-title">
                · 주문 {Math.min(resolvedOrderIndex + 1, resolvedTotalOrders)}/{resolvedTotalOrders}
              </span>
            </div>

            <div className="pill-row">
              {huneumText && (
                <span className="pill-badge pill-badge--huneum">{huneumText}</span>
              )}
              {resolvedOrder.mode === 'pick' && onyomiFirst && (
                <span className="pill-badge pill-badge--onyomi">음독 {onyomiFirst}</span>
              )}
              {mne && (
                <button
                  type="button"
                  data-testid="btn-mnemonic-hint"
                  className="btn-ivory"
                  style={{ padding: '0.16rem 0.55rem', fontSize: '0.875rem' }}
                  onClick={() => setManualHintOpen((v) => !v)}
                >
                  <Lightbulb size={13} color="#d97706" />
                  <span>{manualHintOpen ? '힌트 닫기' : '연상 힌트'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Order Prompt (+ Compact Kanji Badge in Recall Mode) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            {resolvedOrder.mode === 'recall' && targetKanji && (
              <span
                className="kanji-serif"
                style={{
                  fontSize: '1.95rem',
                  fontWeight: 900,
                  color: '#111111',
                  lineHeight: 1.05,
                  backgroundColor: '#fef3c7',
                  border: '2px solid #d97706',
                  borderRadius: '8px',
                  padding: '0.1rem 0.45rem',
                  flexShrink: 0,
                }}
              >
                {targetKanji.character}
              </span>
            )}
            <div className="blackboard-prompt" style={{ flex: 1, minWidth: 0 }}>
              {resolvedOrder.prompt}
            </div>
          </div>

          {/* Row 3: 1-Line Compact Customer Dialogue + First-Sight Chip */}
          <div className="customer-section">
            <div className="customer-speech-bubble" data-testid="customer-dialogue">
              {resolvedOrder.dialogue}
            </div>
            {isFirstSightCompact && mne && (
              <span
                data-testid="mnemonic-hint-pill"
                className="pill-badge pill-badge--work"
                style={{
                  maxWidth: '48%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem',
                }}
                title={`${mne.radicalBreakdown} — ${mne.koreanSoundTip}`}
              >
                {mne.visualPictogram} {mne.radicalBreakdown}
              </span>
            )}
          </div>

          {/* Expanded Mnemonic Hint when user clicks '연상 힌트' */}
          {manualHintOpen && mne && (
            <div className="mnemonic-hint-strip" data-testid="mnemonic-hint-pill">
              <span>{mne.visualPictogram}</span>
              <span>
                <strong>부수:</strong> {mne.radicalBreakdown}
              </span>
              <span>
                <strong>암기팁:</strong>{' '}
                {resolvedOrder.mode === 'recall'
                  ? mne.storyMnemonicKo
                  : mne.koreanSoundTip}
              </span>
            </div>
          )}

          {!isStandalone && (
            <div className="patience-bar-track" aria-hidden="true">
              <div
                className="patience-bar-fill"
                style={{ width: `${patiencePct}%`, backgroundColor: patienceColor }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. OPEN 3D STAGE WINDOW (3D Customer + 3D Counter Kanji Blocks!) */}
      <div className="counter-3d-viewport-spacer" aria-hidden="true" />

      {/* 3. SLEEK BOTTOM ACTION DOCK (Fits 100% Above y=844px on Mobile!) */}
      <div className="counter-bottom-dock">
        {resolvedOrder.mode === 'build' && (
          <>
            <ServingTray
              slots={resolvedTraySlots}
              capacity={resolvedTraySlots.length || 2}
              orderKanji={orderCompoundReading}
              onClearSlot={handleClearTray}
            />
            <ConveyorRail
              options={resolvedOrder.options}
              onSelectOption={handlePick}
              disabled={isInputDisabled}
              lastPicked={lastPicked}
            />
          </>
        )}

        {resolvedOrder.mode === 'recall' && (
          <KeypadRecall
            prompt="알맞은 일본어 발음을 선택해 서빙하세요 (숫자키 1~4)"
            options={resolvedOrder.options}
            onSelectReading={handlePick}
            disabled={isInputDisabled}
          />
        )}

        {resolvedOrder.mode === 'pick' && (
          <ConveyorRail
            options={resolvedOrder.options}
            onSelectOption={handlePick}
            disabled={isInputDisabled}
            lastPicked={lastPicked}
          />
        )}
      </div>

      {/* Shift Ended / Game Over Modal */}
      {resolvedGameOver && (
        <div className="word-reveal-modal" data-testid="counter-gameover-modal">
          <div className="reveal-parchment-card">
            <div className="reveal-header-badge">영업 종료 — SHIFT ENDED</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              하트가 모두 소진되었습니다
            </h3>
            <p
              style={{
                marginBottom: '1.15rem',
                color: '#2c2520',
                fontWeight: 700,
                fontSize: '0.98rem',
              }}
            >
              최종 점수: {resolvedScore}점 · 보유 엽전: {resolvedCoins} 銭
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn-gold" onClick={handleRetry}>
                <RotateCcw size={16} />
                <span>다시 출근하기</span>
              </button>
              <button type="button" className="btn-ivory" onClick={handleReturn}>
                <span>챕터 맵으로</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonCounter;
