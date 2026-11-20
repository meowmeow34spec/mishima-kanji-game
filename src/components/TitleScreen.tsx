/**
 * Salon Mishima 3D - Korean-First High-Contrast Title Screen Over Live 3D Kissaten
 * File: src/components/TitleScreen.tsx
 */

import React from 'react';
import {
  Coffee,
  BookOpen,
  Calendar,
  Settings,
  Zap,
  Flame,
  Coins,
  Store,
} from 'lucide-react';
import type { CurriculumTierNumber } from '../types/curriculum';
import type { PlayerProfile } from '../types/srs';
import { useGameState, useGameDispatch } from '../hooks/useGameState';
import { gameEngine } from '../game/gameEngine';
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
  onQuickPlay?: () => void;
  onOpenShop?: () => void;
  onOpenCodex?: () => void;
  onOpenReview?: () => void;
  onOpenSettings?: () => void;
}

function pickRecommendedQuickStage(profile?: PlayerProfile | null): {
  tier: CurriculumTierNumber;
  stageId: string;
} {
  const unlocked = profile?.unlockedTiers?.length ? profile.unlockedTiers : [1];
  const completed = new Set(profile?.completedStages ?? []);

  for (const rawTier of [1, 2, 3, 4] as CurriculumTierNumber[]) {
    if (!unlocked.includes(rawTier)) continue;
    for (const s of [1, 2, 3, 4]) {
      const stageId = `stage-${rawTier}-${s}`;
      if (!completed.has(stageId)) {
        return { tier: rawTier, stageId };
      }
    }
  }
  const highestTier = (Math.min(4, Math.max(1, ...unlocked)) || 1) as CurriculumTierNumber;
  return { tier: highestTier, stageId: `stage-${highestTier}-1` };
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  stats,
  onStartShift,
  onQuickPlay,
  onOpenShop,
  onOpenCodex,
  onOpenReview,
  onOpenSettings,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  const resolvedProfile = profile ?? gameState.profile;
  const resolvedCoins =
    stats?.coins ?? resolvedProfile?.coins ?? gameState.coins ?? 0;
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

  const handleQuickPlay = () => {
    if (onQuickPlay) {
      onQuickPlay();
      return;
    }
    const rec = pickRecommendedQuickStage(resolvedProfile);
    dispatch({ type: 'QUICK_PLAY', payload: rec });
    if (gameEngine.getState().mode === 'title') {
      dispatch({ type: 'SELECT_STAGE', payload: rec });
    }
  };

  const handleOpenShop = () => {
    if (onOpenShop) {
      onOpenShop();
    } else {
      dispatch({ type: 'OPEN_SHOP' });
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
      {/* Top Compact Signboard Plaque */}
      <div className="title-hero-plaque">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Coffee size={24} color="#ffe57f" aria-hidden="true" />
          <h1 className="title-main-banner kanji-serif" data-testid="title-banner">
            サロン三島 · 살롱 미시마 3D
          </h1>
        </div>
        <p className="title-subtitle">
          미시마 유키오 명작 80한자 3D 카페 서빙 게임 (Salon Mishima)
        </p>
      </div>

      {/* Open Center Window so the 3D Cafe Interior & Counter Shine Unobstructed! */}
      <div className="title-3d-window" aria-hidden="true" />

      {/* Bottom High-Contrast Warm Ivory Welcome & Quick-Start Card */}
      <div className="title-shift-card">
        <p className="title-tagline-ko">
          커피와 화과자를 손님에게 서빙하다 보면 『금각사』『조소』『가면의 고백』『우국』 필수 한자 80자가 1초 연상법으로 저절로 외워집니다!
        </p>

        <div className="title-cta-row">
          <button
            type="button"
            data-testid="btn-quick-play"
            className="btn-emerald"
            style={{ width: '100%', fontSize: '1.02rem', padding: '0.75rem 1rem' }}
            onClick={handleQuickPlay}
          >
            <Zap size={18} />
            <span>바로 카운터 출근</span>
          </button>

          <button
            type="button"
            data-testid="btn-start-shift"
            className="btn-gold btn-start-shift"
            style={{ width: '100%', fontSize: '1.02rem', padding: '0.75rem 1rem' }}
            onClick={handleStart}
          >
            <Coffee size={18} />
            <span>영업 시작 (맵 선택)</span>
          </button>
        </div>

        <div className="title-secondary-row">
          <button
            type="button"
            data-testid="btn-open-shop"
            className="btn-ivory"
            onClick={handleOpenShop}
          >
            <Store size={15} color="#92400e" />
            <span>3D 카페 상점</span>
          </button>

          <button
            type="button"
            data-testid="btn-daily-review"
            className="btn-ivory"
            onClick={handleReview}
          >
            <Calendar size={15} color="#991b1b" />
            <span>오늘의 복습</span>
            {dueCount > 0 && (
              <span
                style={{
                  backgroundColor: '#991b1b',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.08rem 0.45rem',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                }}
              >
                {dueCount}
              </span>
            )}
          </button>

          <button
            type="button"
            data-testid="btn-open-codex"
            className="btn-ivory"
            onClick={handleCodex}
          >
            <BookOpen size={15} color="#047857" />
            <span>미시마 80한자 도감</span>
          </button>

          {onOpenSettings && (
            <button
              type="button"
              data-testid="btn-open-settings"
              className="btn-ivory"
              onClick={onOpenSettings}
            >
              <Settings size={15} />
              <span>설정</span>
            </button>
          )}
        </div>

        <div className="title-mastery-stats">
          <div
            data-testid="stats-coins"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Coins size={15} color="#b45309" />
            <span>보유 엽전: {resolvedCoins} 銭</span>
          </div>
          <div
            data-testid="stats-streak"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Flame size={15} color="#b91c1c" />
            <span>{resolvedStreak}일 연속 출근</span>
          </div>
          <div data-testid="stats-mastery">
            학습 한자: {learnedCount} / {totalKanji}자
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
