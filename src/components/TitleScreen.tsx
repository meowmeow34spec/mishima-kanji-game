/**
 * Salon Mishima 3D - Beginner-First Korean Title Screen Over Live 3D Kissaten
 * File: src/components/TitleScreen.tsx
 */

import React from 'react';
import {
  Coffee,
  BookOpen,
  Calendar,
  Settings,
  Flame,
  Coins,
  Store,
  GraduationCap,
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
  /** Invoked to open the 1-minute Pre-Shift Beginner Lesson for the recommended stage */
  onStartWithLesson?: (tier: CurriculumTierNumber, stageId: string) => void;
  onQuickPlay?: () => void;
  onOpenShop?: () => void;
  onOpenCodex?: () => void;
  onOpenReview?: () => void;
  onOpenSettings?: () => void;
}

export function pickRecommendedQuickStage(profile?: PlayerProfile | null): {
  tier: CurriculumTierNumber;
  stageId: string;
  stageNum: 1 | 2 | 3 | 4;
} {
  const unlocked = profile?.unlockedTiers?.length ? profile.unlockedTiers : [1];
  const completed = new Set(profile?.completedStages ?? []);

  for (const rawTier of [1, 2, 3, 4] as CurriculumTierNumber[]) {
    if (!unlocked.includes(rawTier)) continue;
    for (const s of [1, 2, 3, 4] as const) {
      const stageId = `stage-${rawTier}-${s}`;
      if (!completed.has(stageId)) {
        return { tier: rawTier, stageId, stageNum: s };
      }
    }
  }
  const highestTier = (Math.min(4, Math.max(1, ...unlocked)) || 1) as CurriculumTierNumber;
  return { tier: highestTier, stageId: `stage-${highestTier}-1`, stageNum: 1 };
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  profile,
  stats,
  onStartShift,
  onStartWithLesson,
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
  const recommended = pickRecommendedQuickStage(resolvedProfile);

  const handleStart = () => {
    if (onStartShift) {
      onStartShift();
    } else {
      dispatch({ type: 'START_SHIFT' });
    }
  };

  const handleBeginnerLessonStart = () => {
    if (onStartWithLesson) {
      onStartWithLesson(recommended.tier, recommended.stageId);
      return;
    }
    if (onQuickPlay) {
      onQuickPlay();
      return;
    }
    dispatch({
      type: 'QUICK_PLAY',
      payload: { tier: recommended.tier, stageId: recommended.stageId },
    });
    if (gameEngine.getState().mode === 'title') {
      dispatch({
        type: 'SELECT_STAGE',
        payload: { tier: recommended.tier, stageId: recommended.stageId },
      });
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
          한자를 하나도 몰라도 OK! 5글자씩 먼저 배우고 서빙하는 3D 한자 카페 (Salon Mishima)
        </p>
      </div>

      {/* Open Center Window so the 3D Cafe Interior & Counter Shine Unobstructed! */}
      <div className="title-3d-window" aria-hidden="true" />

      {/* Bottom High-Contrast Warm Ivory Beginner Onboarding Card */}
      <div className="title-shift-card">
        <p className="title-tagline-ko">
          오픈 전 마스터의 <strong>1분 그림·소리 과외</strong>로 오늘의 한자 5개(한글 발음 완비!)를 먼저 익힌 뒤 여유롭게 서빙을 시작해보세요!
        </p>

        {/* Primary Hero CTA: Learn 5 Kanji First -> Start Shift! */}
        <button
          type="button"
          data-testid="btn-quick-play"
          className="btn-emerald"
          style={{ width: '100%', fontSize: '1.02rem', padding: '0.78rem 1rem' }}
          onClick={handleBeginnerLessonStart}
        >
          <GraduationCap size={20} />
          <span>
            {recommended.stageNum}교시: 한자 5개 먼저 배우고 출근하기 (한자 몰라도 OK!)
          </span>
        </button>

        <div className="title-secondary-row">
          <button
            type="button"
            data-testid="btn-start-shift"
            className="btn-gold btn-start-shift"
            onClick={handleStart}
          >
            <Coffee size={16} />
            <span>스테이지 고르기</span>
          </button>

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
            <span>80한자 도감</span>
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
