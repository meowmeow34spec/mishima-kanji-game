/**
 * Salon Mishima - Title Screen Component
 * File: src/components/TitleScreen.tsx
 */

import React from 'react';
import { Coffee, BookOpen, Calendar, Settings, Sparkles, Flame, Coins } from 'lucide-react';
import type { PlayerProfile } from '../types/srs';
import { useGameState, useGameDispatch } from '../hooks/useGameState';
import { getDueKanji } from '../srs/leitnerEngine';
import { getAllKanji } from '../data/mishimaCurriculum';

export interface TitleScreenProps {
  profile?: PlayerProfile | null;
  stats?: {
    coins?: number;
    streak?: number;
    kanjiLearned?: number;
  };
  onStartShift?: () => void;
  onOpenCodex?: () => void;
  onOpenReview?: () => void;
  onOpenSettings?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  stats,
  onStartShift,
  onOpenCodex,
  onOpenReview,
  onOpenSettings,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  const resolvedProfile = profile ?? gameState.profile;
  const resolvedCoins = stats?.coins ?? resolvedProfile?.coins ?? gameState.coins ?? 0;
  const resolvedStreak = stats?.streak ?? resolvedProfile?.streak ?? 1;
  const cards = resolvedProfile?.cards ?? {};
  const learnedCount =
    stats?.kanjiLearned ??
    Object.values(cards).filter((c) => c.box > 0 || c.totalReviews > 0).length;
  const totalKanji = getAllKanji().length;
  const dueCount = getDueKanji(cards).length;

  const handleStart = () => {
    if (onStartShift) {
      onStartShift();
    } else {
      dispatch({ type: 'START_SHIFT' });
    }
  };

  const handleCodex = () => {
    if (onOpenCodex) {
      onOpenCodex();
    } else {
      dispatch({ type: 'OPEN_CODEX' });
    }
  };

  const handleReview = () => {
    if (onOpenReview) {
      onOpenReview();
    } else {
      dispatch({ type: 'OPEN_REVIEW' });
    }
  };

  return (
    <div className="title-screen" data-testid="title-screen">
      <div className="title-crest" aria-hidden="true">
        <Coffee size={44} color="var(--color-gold-light)" />
      </div>

      <h1 className="title-main-banner" data-testid="title-banner">
        サロン三島
      </h1>
      <p className="title-subtitle">
        SALON MISHIMA — Yukio Mishima Literary Kanji Learning Game
      </p>

      <div className="title-shift-card">
        <p
          style={{
            color: 'var(--color-washi-dim)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
          }}
        >
          昭和の純文学喫茶「サロン三島」へようこそ。
          <br />
          文豪の名作に息づく漢字の美と響きを、お客様へ給仕いたしましょう。
          <span
            style={{
              display: 'block',
              marginTop: '0.45rem',
              fontSize: '0.85rem',
              color: 'var(--color-gold)',
            }}
          >
            쇼와 시대 문학 찻집에서 미시마 유키오의 명작 한자 80자를 손님에게 대접하며 외워보세요.
          </span>
        </p>

        <button
          type="button"
          data-testid="btn-start-shift"
          className="btn-gold btn-start-shift"
          style={{ width: '100%', fontSize: '1.15rem', padding: '0.95rem 2rem' }}
          onClick={handleStart}
        >
          <Sparkles size={20} />
          <span>営業開始 (Start Shift)</span>
        </button>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <button
            type="button"
            data-testid="btn-daily-review"
            className="btn-lacquer"
            onClick={handleReview}
          >
            <Calendar size={16} />
            <span>朝の復習 (Daily Review)</span>
            {dueCount > 0 && (
              <span
                style={{
                  background: 'var(--color-crimson)',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {dueCount}
              </span>
            )}
          </button>

          <button
            type="button"
            data-testid="btn-open-codex"
            className="btn-lacquer"
            onClick={handleCodex}
          >
            <BookOpen size={16} />
            <span>三島漢字録 (Study Codex)</span>
          </button>

          {onOpenSettings && (
            <button
              type="button"
              data-testid="btn-open-settings"
              className="btn-lacquer"
              onClick={onOpenSettings}
            >
              <Settings size={16} />
              <span>設定 (Settings)</span>
            </button>
          )}
        </div>

        <div className="title-mastery-stats">
          <div data-testid="stats-coins" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Coins size={16} color="var(--color-gold)" />
            <span>{resolvedCoins} 銭</span>
          </div>
          <div data-testid="stats-streak" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Flame size={16} color="var(--color-crimson-bright)" />
            <span>{resolvedStreak} 日連続</span>
          </div>
          <div data-testid="stats-mastery">
            習得: {learnedCount} / {totalKanji} 字
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
