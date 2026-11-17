/**
 * Salon Mishima - Boss Duel Arena Component (Confusing Kanji Confrontation)
 * File: src/components/BossArena.tsx
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Swords, Timer, Lightbulb } from 'lucide-react';
import type { BossChoiceOption, BossKanjiPair } from '../types/curriculum';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface BossArenaQuestion {
  id: string;
  type?: 'glyph_to_sound' | 'sound_to_glyph' | 'meaning_to_glyph';
  prompt: string;
  targetCharacter?: string;
  options: (string | BossChoiceOption)[];
  correctAnswer: string;
  explanation?: string;
}

export interface BossArenaProps {
  bossName?: string;
  bossHp?: number;
  maxBossHp?: number;
  playerHearts?: number;
  maxHearts?: number;
  timeLeft?: number;
  currentQuestion?: BossArenaQuestion | null;
  bossPair?: BossKanjiPair | null;
  isDefeated?: boolean;
  isPlayerDefeated?: boolean;
  onAnswer?: (answer: string) => void;
  onReturnToMap?: () => void;
  onExit?: () => void;
}

export const BossArena: React.FC<BossArenaProps> = ({
  bossName,
  bossHp,
  maxBossHp,
  playerHearts,
  maxHearts,
  timeLeft,
  currentQuestion,
  bossPair,
  isDefeated,
  isPlayerDefeated,
  onAnswer,
  onReturnToMap,
  onExit,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const engineBoss = gameState.bossState;

  const isStandalone = currentQuestion !== undefined;
  const resolvedBossName =
    bossName ?? engineBoss?.bossPair?.bossName ?? '金閣の幻影';
  const resolvedBossHp = bossHp ?? engineBoss?.bossHp ?? 10;
  const resolvedMaxHp = maxBossHp ?? engineBoss?.maxBossHp ?? 10;
  const resolvedHearts = playerHearts ?? engineBoss?.playerHearts ?? 3;
  const resolvedMaxHearts = maxHearts ?? engineBoss?.maxHearts ?? 3;
  const resolvedTimeLeft = timeLeft ?? engineBoss?.timeLeft ?? 6.0;
  const resolvedQuestion = currentQuestion ?? engineBoss?.currentQuestion ?? null;
  const resolvedPair = bossPair ?? engineBoss?.bossPair ?? null;
  const resolvedDefeated = isDefeated ?? engineBoss?.isDefeated ?? false;
  const resolvedPlayerDefeated =
    isPlayerDefeated ?? engineBoss?.isPlayerDefeated ?? false;
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
  }, [resolvedQuestion?.id, engineBoss?.currentQuestionIndex, engineBoss?.bossHp, engineBoss?.playerHearts]);

  useEffect(() => {
    if (isStandalone || !engineBoss?.isActive || resolvedDefeated || resolvedPlayerDefeated) {
      return;
    }
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_BOSS', payload: { deltaSeconds: 0.1 } });
    }, 100);
    return () => clearInterval(timer);
  }, [isStandalone, engineBoss?.isActive, resolvedDefeated, resolvedPlayerDefeated, dispatch]);

  const hpPercentage =
    resolvedMaxHp > 0
      ? Math.max(0, Math.min(100, (resolvedBossHp / resolvedMaxHp) * 100))
      : 0;

  const heartString = Array.from(
    { length: Math.max(0, resolvedHearts) },
    () => '❤️'
  ).join(' ');

  const handleSelectOption = (opt: string | BossChoiceOption) => {
    if (resolvedDefeated || resolvedPlayerDefeated) return;

    let answerValue: string;
    if (typeof opt === 'string') {
      answerValue = opt;
    } else if (resolvedQuestion?.type === 'glyph_to_sound') {
      answerValue = opt.reading || opt.kanji || opt.meaning || '';
    } else {
      answerValue = opt.kanji || opt.reading || opt.meaning || '';
    }

    if (onAnswer) {
      onAnswer(answerValue);
    } else {
      dispatch({ type: 'ANSWER_BOSS', payload: { answer: answerValue } });
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (resolvedDefeated || resolvedPlayerDefeated || !resolvedQuestion) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        document.querySelector('[role="dialog"]')
      ) {
        return;
      }
      const keyIdx = ['1', '2', '3', '4'].indexOf(e.key);
      if (keyIdx >= 0 && keyIdx < resolvedQuestion.options.length) {
        e.preventDefault();
        handleSelectOption(resolvedQuestion.options[keyIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const duelGlyphBanner = resolvedPair
    ? resolvedPair.additionalCharacters && resolvedPair.additionalCharacters.length > 0
      ? [
          resolvedPair.characterA,
          resolvedPair.characterB,
          ...resolvedPair.additionalCharacters,
        ].join(' · ')
      : `${resolvedPair.characterA} ⚔ ${resolvedPair.characterB}`
    : '';

  const handleReturn = () => {
    if (onReturnToMap) {
      onReturnToMap();
    } else if (onExit) {
      onExit();
    } else {
      dispatch({ type: 'RETURN_TO_MAP' });
    }
  };

  return (
    <div className="boss-arena" data-testid="boss-arena">
      <div className="boss-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Swords size={26} color="var(--color-crimson-bright)" />
          <div>
            <h2 className="boss-title">{resolvedBossName}</h2>
            {resolvedPair && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-washi-dim)' }}>
                {resolvedPair.title}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          data-testid="btn-return-map"
          className="btn-lacquer"
          onClick={handleReturn}
        >
          <ArrowLeft size={16} />
          <span>撤退する</span>
        </button>
      </div>

      {/* Boss HP Bar & Player Hearts */}
      <div className="boss-hp-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.9rem', color: '#ffccd5', fontWeight: 700 }}>
            幻影耐久値: {resolvedBossHp} / {resolvedMaxHp}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span
              data-testid="boss-timer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color:
                  resolvedTimeLeft <= 2.5
                    ? 'var(--color-crimson-bright)'
                    : 'var(--color-gold-light)',
                fontWeight: 700,
              }}
            >
              <Timer size={16} />
              <span>{resolvedTimeLeft.toFixed(1)} 秒</span>
            </span>

            <div
              className="hearts-display"
              data-testid="hearts-display"
              aria-label={`Player hearts ${resolvedHearts} of ${resolvedMaxHearts}`}
            >
              {heartString}
            </div>
          </div>
        </div>

        <div
          className="boss-hp-bar"
          data-testid="boss-hp-bar"
          role="progressbar"
          aria-valuenow={resolvedBossHp}
          aria-valuemin={0}
          aria-valuemax={resolvedMaxHp}
        >
          <div
            className="boss-hp-fill"
            style={{ width: `${hpPercentage}%` }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 1px 2px #000',
            }}
          >
            {resolvedBossHp} / {resolvedMaxHp}
          </span>
        </div>
      </div>

      {/* Duel Card */}
      {!resolvedDefeated && !resolvedPlayerDefeated && resolvedQuestion && (
        <div className="boss-duel-card">
          <div className="boss-prompt-text" data-testid="boss-question-prompt">
            {resolvedQuestion.prompt}
          </div>

          {resolvedPair && (
            <div className="boss-target-kanji" aria-hidden="true">
              {duelGlyphBanner}
            </div>
          )}

          <div className="boss-options-grid">
            {resolvedQuestion.options.map((opt, idx) => {
              const label =
                typeof opt === 'string'
                  ? opt
                  : resolvedQuestion.type === 'glyph_to_sound'
                    ? `${opt.reading} (${opt.meaning})`
                    : `${opt.kanji}${opt.meaning ? ` — ${opt.meaning}` : ''}`;

              return (
                <button
                  key={idx}
                  type="button"
                  data-testid={`boss-option-${idx}`}
                  className="boss-choice-btn"
                  onClick={() => handleSelectOption(opt)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {resolvedPair?.mnemonicTip && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {!showHint ? (
                <button
                  type="button"
                  data-testid="btn-boss-hint"
                  className="btn-lacquer"
                  style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                  onClick={() => setShowHint(true)}
                >
                  <Lightbulb size={14} />
                  <span>助言を見る (힌트 보기)</span>
                </button>
              ) : (
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-washi-dim)',
                    maxWidth: '520px',
                  }}
                >
                  助言: {resolvedPair.mnemonicTip}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Victory / Defeat Resolution */}
      {(resolvedDefeated || resolvedPlayerDefeated) && (
        <div className="boss-duel-card" data-testid="boss-result-panel">
          <h3
            style={{
              fontSize: '2rem',
              color: resolvedDefeated
                ? 'var(--color-gold-light)'
                : 'var(--color-crimson-bright)',
            }}
          >
            {resolvedDefeated ? '決闘勝利！ (Boss Vanquished)' : '敗北… (Defeated)'}
          </h3>
          <p style={{ color: 'var(--color-washi-dim)' }}>
            {resolvedDefeated
              ? '見事な識字力です！報酬 500 銭と次の階層が開放されました。'
              : '幻影に惑わされました。三島漢字録で類似漢字を確認し、再挑戦しましょう。'}
          </p>
          {resolvedPair?.distinctionNotes && (
            <p
              style={{
                fontSize: '0.9rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                maxWidth: '520px',
              }}
            >
              {resolvedPair.distinctionNotes}
            </p>
          )}
          <button
            type="button"
            className="btn-gold"
            onClick={handleReturn}
          >
            <span>帳場へ戻る</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BossArena;
