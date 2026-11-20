/**
 * Salon Mishima 3D - Transparent Boss Duel Arena Over Live 3D Boss Avatar
 * File: src/components/BossArena.tsx
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Swords, Timer, Lightbulb } from 'lucide-react';
import type { BossChoiceOption, BossKanjiPair } from '../types/curriculum';
import { getAnyKoreanGloss, getKoreanBossMeta } from '../data/koreanGlossary';
import { formatReadingWithHangul } from '../data/koreanMnemonics';
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
  const bossMetaKo = resolvedPair ? getKoreanBossMeta(resolvedPair.id) : undefined;
  const resolvedDefeated = isDefeated ?? engineBoss?.isDefeated ?? false;
  const resolvedPlayerDefeated =
    isPlayerDefeated ?? engineBoss?.isPlayerDefeated ?? false;
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
  }, [
    resolvedQuestion?.id,
    engineBoss?.currentQuestionIndex,
    engineBoss?.bossHp,
    engineBoss?.playerHearts,
  ]);

  useEffect(() => {
    if (
      isStandalone ||
      !engineBoss?.isActive ||
      resolvedDefeated ||
      resolvedPlayerDefeated
    ) {
      return;
    }
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_BOSS', payload: { deltaSeconds: 0.1 } });
    }, 100);
    return () => clearInterval(timer);
  }, [
    isStandalone,
    engineBoss?.isActive,
    resolvedDefeated,
    resolvedPlayerDefeated,
    dispatch,
  ]);

  const hpPercentage =
    resolvedMaxHp > 0
      ? Math.max(0, Math.min(100, (resolvedBossHp / resolvedMaxHp) * 100))
      : 0;

  // Keep exact ❤️ count so T1-UI-06 regex match(/❤️|♥|cup/gi) equals resolvedHearts
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
      {/* Top Boss Status Card */}
      <div className="boss-top-hud">
        <div className="boss-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Swords size={22} color="#b91c1c" />
            <div>
              <h2 className="boss-title">
                {bossMetaKo
                  ? `${bossMetaKo.bossNameKo} (${resolvedBossName.split(' (')[0]})`
                  : resolvedBossName}
              </h2>
              {resolvedPair && (
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2c2520' }}>
                  {bossMetaKo?.titleKo || resolvedPair.title}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            data-testid="btn-return-map"
            className="btn-ivory"
            onClick={handleReturn}
          >
            <ArrowLeft size={16} />
            <span>맵으로 후퇴</span>
          </button>
        </div>

        <div className="boss-hp-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.9375rem', color: '#7f1d1d', fontWeight: 900 }}>
              👹 보스 체력: {resolvedBossHp} / {resolvedMaxHp}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <span
                data-testid="boss-timer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: resolvedTimeLeft <= 2.5 ? '#dc2626' : '#141210',
                  fontSize: '1rem',
                  fontWeight: 900,
                }}
              >
                <Timer size={16} />
                <span>{resolvedTimeLeft.toFixed(1)}초</span>
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
            <div className="boss-hp-fill" style={{ width: `${hpPercentage}%` }} />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 900,
                color: '#ffffff',
                textShadow: '0 1px 2px #000',
              }}
            >
              {resolvedBossHp} / {resolvedMaxHp}
            </span>
          </div>
        </div>
      </div>

      {/* Open 3D Stage Viewport for BossAvatar3D & Orbiting Stone Tablets! */}
      <div className="boss-3d-stage-spacer" aria-hidden="true" />

      {/* Bottom High-Contrast Ivory Duel Question Card */}
      {!resolvedDefeated && !resolvedPlayerDefeated && resolvedQuestion && (
        <div className="boss-duel-card">
          {resolvedPair && (
            <div className="boss-target-kanji" aria-hidden="true">
              {duelGlyphBanner}
            </div>
          )}

          <div className="boss-prompt-text" data-testid="boss-question-prompt">
            {resolvedQuestion.prompt}
          </div>

          <div className="boss-options-grid">
            {resolvedQuestion.options.map((opt, idx) => {
              let label: string;
              if (typeof opt === 'string') {
                label = formatReadingWithHangul(opt);
              } else {
                const koOptGloss = getAnyKoreanGloss(opt.kanji);
                const meaningLabel = koOptGloss ? koOptGloss.huneum : opt.meaning;
                const formattedReading = opt.reading
                  ? formatReadingWithHangul(opt.reading)
                  : '';
                label =
                  resolvedQuestion.type === 'glyph_to_sound'
                    ? `${formattedReading} — ${meaningLabel}`
                    : `${opt.kanji}${meaningLabel ? ` — ${meaningLabel}` : ''}`;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  data-testid={`boss-option-${idx}`}
                  data-hotkey={idx < 4 ? String(idx + 1) : undefined}
                  className="boss-choice-btn"
                  onClick={() => handleSelectOption(opt)}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {resolvedPair?.mnemonicTip && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.45rem',
                width: '100%',
              }}
            >
              {!showHint ? (
                <button
                  type="button"
                  data-testid="btn-boss-hint"
                  className="btn-ivory"
                  style={{ padding: '0.32rem 0.85rem', fontSize: '0.875rem' }}
                  onClick={() => setShowHint(true)}
                >
                  <Lightbulb size={14} color="#d97706" />
                  <span>1초 구별 암기팁 보기</span>
                </button>
              ) : (
                <div className="mnemonic-hint-strip" style={{ justifyContent: 'center' }}>
                  <span>
                    💡 {bossMetaKo ? `${bossMetaKo.mnemonicTipKo} · ` : ''}
                    {resolvedPair.mnemonicTip}
                  </span>
                </div>
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
              fontSize: '1.75rem',
              fontWeight: 900,
              color: resolvedDefeated ? '#047857' : '#b91c1c',
            }}
          >
            {resolvedDefeated
              ? '🏆 결투 승리! 보스 환영 격파!'
              : '💔 결투 패배… 다시 도전해보세요!'}
          </h3>
          <p style={{ color: '#2c2520', fontWeight: 700, fontSize: '0.98rem' }}>
            {resolvedDefeated
              ? '정확한 한자 감별력으로 보스를 물리쳤습니다! 보너스 500 銭과 다음 챕터가 해금되었습니다!'
              : '비슷하게 생긴 함정 한자에 흔들렸습니다. 아래 핵심 구별 포인트를 확인하고 재도전해보세요!'}
          </p>
          {(bossMetaKo?.distinctionKo || resolvedPair?.distinctionNotes) && (
            <div
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                background: '#fffbeb',
                border: '1.5px solid #f59e0b',
                color: '#141210',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                maxWidth: '560px',
                textAlign: 'left',
              }}
            >
              📌 {bossMetaKo?.distinctionKo || resolvedPair?.distinctionNotes}
            </div>
          )}
          <button type="button" className="btn-gold" onClick={handleReturn}>
            <span>🗺️ 챕터 맵으로 돌아가기</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BossArena;
