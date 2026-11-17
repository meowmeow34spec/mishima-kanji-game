/**
 * Salon Mishima - Cafe Counter Gameplay Screen
 * File: src/components/SalonCounter.tsx
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Coins, Flame, RotateCcw } from 'lucide-react';
import type { ActiveOrder } from '../types/game';
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
  onReturnToMap,
  onExit,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [lastPicked, setLastPicked] = useState<{
    option: string;
    isCorrect: boolean;
  } | null>(null);
  const pickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pickTimerRef.current) {
        clearTimeout(pickTimerRef.current);
        pickTimerRef.current = null;
      }
    };
  }, []);

  const resolvedOrder = activeOrder !== undefined ? activeOrder : gameState.activeOrder;
  const resolvedScore = score ?? gameState.score;
  const resolvedCoins = coins ?? gameState.coins;
  const resolvedCombo = combo ?? gameState.combo;
  const resolvedHearts = hearts ?? gameState.hearts;
  const resolvedOrderIndex = stageOrderIndex ?? gameState.stageOrderIndex;
  const resolvedTotalOrders = stageTotalOrders ?? gameState.stageTotalOrders;
  const resolvedGameOver = isGameOver ?? gameState.isGameOver;
  const resolvedTraySlots =
    traySlots ??
    (activeOrder !== undefined ? activeOrder?.traySlots : gameState.traySlots) ??
    [];

  const isInputDisabled =
    Boolean(activeOrder === undefined && gameState.revealKanji) || resolvedGameOver;

  const handlePick = (option: string) => {
    if (isInputDisabled || !resolvedOrder) return;

    const isCorrect =
      resolvedOrder.mode === 'build'
        ? option === resolvedOrder.correctOption
        : option === resolvedOrder.correctOption;
    setLastPicked({ option, isCorrect });
    if (pickTimerRef.current) {
      clearTimeout(pickTimerRef.current);
    }
    pickTimerRef.current = setTimeout(() => {
      pickTimerRef.current = null;
      setLastPicked(null);
    }, 450);

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
        stageId: gameState.currentStageId || `stage-${gameState.currentTier}-1`,
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
        <div className="blackboard-order" style={{ textAlign: 'center' }}>
          <p className="blackboard-prompt">お客様をお迎えしています…</p>
          <button
            type="button"
            data-testid="btn-return-map"
            className="btn-lacquer"
            style={{ marginTop: '1rem' }}
            onClick={handleReturn}
          >
            <ArrowLeft size={16} />
            <span>帳場へ戻る</span>
          </button>
        </div>
      </div>
    );
  }

  const orderCompoundReading =
    resolvedOrder.targetKanji?.literaryCompounds?.[0]?.reading || '';

  return (
    <div className="salon-counter" data-testid="salon-counter">
      {/* Status Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <button
          type="button"
          data-testid="btn-return-map"
          className="btn-lacquer"
          onClick={handleReturn}
        >
          <ArrowLeft size={16} />
          <span>帳場へ戻る</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="stat-badge" data-testid="score-counter">
            得点: {resolvedScore}
          </span>
          <span className="stat-badge stat-badge--coins" data-testid="coins-counter">
            <Coins size={14} />
            <span>{resolvedCoins} 銭</span>
          </span>
          <span className="stat-badge stat-badge--streak" data-testid="combo-counter">
            <Flame size={14} />
            <span>{resolvedCombo} Combo</span>
          </span>
          <span className="hearts-display" data-testid="hearts-display" aria-label={`Hearts: ${resolvedHearts}`}>
            {heartDisplay}
          </span>
        </div>
      </div>

      {/* Blackboard Order Display */}
      <div className="blackboard-order" data-testid="order-blackboard">
        <div className="blackboard-title">
          本日のお品書き —{' '}
          {resolvedOrder.targetKanji?.cafeOrderItem?.itemName || '特製珈琲'}（
          {Math.min(resolvedOrderIndex + 1, resolvedTotalOrders)} /{' '}
          {resolvedTotalOrders}）
        </div>
        <div className="blackboard-prompt">{resolvedOrder.prompt}</div>
      </div>

      {/* Customer Dialogue */}
      <div className="customer-section">
        <div className="patron-avatar" title={resolvedOrder.customerName}>
          {resolvedOrder.customerName.slice(0, 1)}
        </div>
        <div style={{ flex: 1 }}>
          <div
            data-testid="customer-name"
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-gold-light)',
              marginBottom: '0.35rem',
              fontWeight: 700,
            }}
          >
            {resolvedOrder.customerName}
          </div>
          <div className="customer-speech-bubble" data-testid="customer-dialogue">
            {resolvedOrder.dialogue}
          </div>
        </div>
      </div>

      {/* Interaction Area */}
      {resolvedOrder.mode === 'build' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
        </div>
      )}

      {resolvedOrder.mode === 'recall' && (
        <KeypadRecall
          prompt="正しい読みの鍵盤をお選びください · 알맞은 읽기를 선택하세요"
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

      {/* Game Over Overlay */}
      {resolvedGameOver && (
        <div className="word-reveal-modal" data-testid="counter-gameover-modal">
          <div className="reveal-parchment-card">
            <div className="reveal-header-badge">閉店 — SHIFT ENDED</div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              体力が尽きました
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-ink-secondary)' }}>
              最終得点: {resolvedScore} 点 ／ 獲得銭: {resolvedCoins} 銭
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                type="button"
                className="btn-gold"
                onClick={handleRetry}
              >
                <RotateCcw size={16} />
                <span>もう一度挑戦</span>
              </button>
              <button
                type="button"
                className="btn-lacquer"
                onClick={handleReturn}
              >
                <span>帳場へ戻る</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonCounter;
