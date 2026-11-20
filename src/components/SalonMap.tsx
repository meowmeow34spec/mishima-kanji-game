/**
 * Salon Mishima 3D - Korean-First Chapter Map & Quick-Play Hub
 * File: src/components/SalonMap.tsx
 */

import React from 'react';
import {
  Lock,
  Swords,
  Zap,
  BookOpen,
  Calendar,
  ArrowLeft,
  Settings,
  Crown,
  Store,
  Coffee,
} from 'lucide-react';
import type { CurriculumTierNumber } from '../types/curriculum';
import type { PlayerProfile } from '../types/srs';
import { TIER_METADATA, getKanjiByTier } from '../data/mishimaCurriculum';
import { getBossPairsByTier, getBossPairById } from '../data/bossPairs';
import { getDueKanji } from '../srs/leitnerEngine';
import { gameEngine } from '../game/gameEngine';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface SalonMapProps {
  unlockedTiers?: number[];
  completedStages?: string[];
  profile?: PlayerProfile | null;
  onSelectStage?: (tier: CurriculumTierNumber, stageId: string) => void;
  onQuickPlay?: () => void;
  onOpenShop?: () => void;
  onStartBoss?: (tier: CurriculumTierNumber, bossPairId?: string) => void;
  onOpenBoss?: (tier?: CurriculumTierNumber) => void;
  onStartRush?: () => void;
  onOpenCodex?: () => void;
  onOpenReview?: () => void;
  onOpenSettings?: () => void;
  onBackToTitle?: () => void;
}

const TIER_ACCENTS: Record<CurriculumTierNumber, string> = {
  1: 'var(--tier-1-color)',
  2: 'var(--tier-2-color)',
  3: 'var(--tier-3-color)',
  4: 'var(--tier-4-color)',
};

const TIER_TITLES_KO: Record<CurriculumTierNumber, string> = {
  1: '제1막 · 금각의 불꽃과 탐미',
  2: '제2막 · 파도 소리의 바다와 유현',
  3: '제3막 · 가면의 고백과 애증',
  4: '제4막 · 우국과 태양·분마',
};

const TIER_SUBTITLES_KO: Record<CurriculumTierNumber, string> = {
  1: '『금각사』 필수 한자 20자 · 황금 누각과 불꽃의 미학',
  2: '『조소』『봄눈』『천인오쇠』 필수 한자 20자 · 바다와 순수의 서약',
  3: '『가면의 고백』『금색』『록명관』 필수 한자 20자 · 가면 뒤의 진실',
  4: '『우국』『분마』『태양과 철』 필수 한자 20자 · 태양과 강철의 결의',
};

export const SalonMap: React.FC<SalonMapProps> = ({
  unlockedTiers,
  completedStages,
  profile,
  onSelectStage,
  onQuickPlay,
  onOpenShop,
  onStartBoss,
  onOpenBoss,
  onStartRush,
  onOpenCodex,
  onOpenReview,
  onOpenSettings,
  onBackToTitle,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  const resolvedProfile = profile ?? gameState.profile;
  const resolvedUnlockedTiers =
    unlockedTiers ?? resolvedProfile?.unlockedTiers ?? [1];
  const resolvedCompletedStages =
    completedStages ?? resolvedProfile?.completedStages ?? [];
  const dueCount = getDueKanji(resolvedProfile?.cards ?? {}).length;

  const findNextStage = (): { tier: CurriculumTierNumber; stageId: string } => {
    for (const rawTier of [1, 2, 3, 4] as CurriculumTierNumber[]) {
      if (!resolvedUnlockedTiers.includes(rawTier)) continue;
      for (const s of [1, 2, 3, 4]) {
        const sid = `stage-${rawTier}-${s}`;
        if (!resolvedCompletedStages.includes(sid)) {
          return { tier: rawTier, stageId: sid };
        }
      }
    }
    const highest = (Math.min(4, Math.max(1, ...resolvedUnlockedTiers)) || 1) as CurriculumTierNumber;
    return { tier: highest, stageId: `stage-${highest}-1` };
  };

  const handleQuickPlay = () => {
    if (onQuickPlay) {
      onQuickPlay();
      return;
    }
    const next = findNextStage();
    if (onSelectStage) {
      onSelectStage(next.tier, next.stageId);
      return;
    }
    dispatch({ type: 'QUICK_PLAY', payload: next });
    if (gameEngine.getState().mode !== 'lesson') {
      dispatch({ type: 'SELECT_STAGE', payload: next });
    }
  };

  const handleOpenShop = () => {
    if (onOpenShop) {
      onOpenShop();
    } else {
      dispatch({ type: 'OPEN_SHOP' });
    }
  };

  const handleStageSelect = (
    tier: CurriculumTierNumber,
    stageId: string,
    bossPairId?: string
  ) => {
    if (stageId.includes('boss')) {
      if (onStartBoss) {
        onStartBoss(tier, bossPairId);
      } else if (onOpenBoss) {
        onOpenBoss(tier);
      } else {
        dispatch({ type: 'START_BOSS', payload: { tier, bossPairId } });
      }
      return;
    }

    if (onSelectStage) {
      onSelectStage(tier, stageId);
    } else {
      dispatch({ type: 'SELECT_STAGE', payload: { tier, stageId } });
    }
  };

  const handleBossArena = () => {
    const highestTier = (Math.max(...resolvedUnlockedTiers, 1) <= 4
      ? Math.max(...resolvedUnlockedTiers, 1)
      : 1) as CurriculumTierNumber;
    if (
      resolvedUnlockedTiers.includes(4) &&
      resolvedCompletedStages.includes('stage-4-boss') &&
      resolvedCompletedStages.includes('stage-4-boss-2') &&
      !resolvedCompletedStages.includes('stage-special-boss')
    ) {
      dispatch({
        type: 'START_BOSS',
        payload: { tier: 4, bossPairId: 'boss-08-mishima-grand' },
      });
      return;
    }
    if (onStartBoss) {
      onStartBoss(highestTier);
    } else if (onOpenBoss) {
      onOpenBoss(highestTier);
    } else {
      dispatch({ type: 'START_BOSS', payload: { tier: highestTier } });
    }
  };

  const handleStartRush = () => {
    if (onStartRush) {
      onStartRush();
    } else {
      dispatch({ type: 'START_RUSH', payload: { initialTime: 25.0 } });
    }
  };

  const handleOpenCodex = () => {
    if (onOpenCodex) {
      onOpenCodex();
    } else {
      dispatch({ type: 'OPEN_CODEX' });
    }
  };

  const handleOpenReview = () => {
    if (onOpenReview) {
      onOpenReview();
    } else {
      dispatch({ type: 'OPEN_REVIEW' });
    }
  };

  const handleBackTitle = () => {
    if (onBackToTitle) {
      onBackToTitle();
    } else {
      dispatch({ type: 'RETURN_TO_TITLE' });
    }
  };

  return (
    <div className="salon-map" data-testid="salon-map">
      <div className="map-header">
        <h2 className="map-header-title">
          살롱 미시마 3D 문학 챕터 맵 (サロン案内図)
        </h2>
        <p className="map-header-subtitle">
          원하는 챕터를 골라 손님에게 한자를 대접하거나, 상점에서 3D 카페 인테리어를 꾸며보세요!
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            data-testid="btn-back-title"
            className="btn-ivory"
            onClick={handleBackTitle}
          >
            <ArrowLeft size={15} />
            <span>타이틀로</span>
          </button>

          <button
            type="button"
            data-testid="btn-quick-play"
            className="btn-emerald"
            onClick={handleQuickPlay}
          >
            <Coffee size={15} />
            <span>바로 카운터 출근</span>
          </button>

          <button
            type="button"
            data-testid="btn-open-shop"
            className="btn-gold"
            onClick={handleOpenShop}
          >
            <Store size={15} />
            <span>3D 카페 인테리어 상점</span>
          </button>

          <button
            type="button"
            data-testid="btn-start-rush"
            className="btn-gold"
            onClick={handleStartRush}
          >
            <Zap size={15} />
            <span>25초 폭풍 주문 러시</span>
          </button>

          <button
            type="button"
            data-testid="btn-boss-arena"
            className="btn-crimson"
            onClick={handleBossArena}
          >
            <Swords size={15} />
            <span>헷갈리는 한자 보스전</span>
          </button>

          <button
            type="button"
            data-testid="btn-daily-review"
            className="btn-ivory"
            onClick={handleOpenReview}
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
            onClick={handleOpenCodex}
          >
            <BookOpen size={15} color="#047857" />
            <span>미시마 80한자 도감</span>
          </button>

          {onOpenSettings && (
            <button
              type="button"
              data-testid="btn-open-settings"
              className="btn-ivory"
              aria-label="설정 열기"
              onClick={onOpenSettings}
            >
              <Settings size={15} />
              <span>설정</span>
            </button>
          )}
        </div>
      </div>

      <div className="map-tier-container">
        {TIER_METADATA.map((meta) => {
          const tierNum = meta.tier as CurriculumTierNumber;
          const isUnlocked = resolvedUnlockedTiers.includes(tierNum);
          const tierKanji = getKanjiByTier(tierNum);
          const tierBosses = getBossPairsByTier(tierNum);

          const stageConfigs: {
            id: string;
            label: string;
            sub: string;
            preview: string;
            isBoss: boolean;
            bossPairId?: string;
          }[] = [
            {
              id: `stage-${tierNum}-1`,
              label: `제${tierNum}막 · 1장`,
              sub: '기초 서빙 (1~5번)',
              preview: tierKanji[0]?.character || '金',
              isBoss: false,
            },
            {
              id: `stage-${tierNum}-2`,
              label: `제${tierNum}막 · 2장`,
              sub: '발음 응대 (6~10번)',
              preview: tierKanji[5]?.character || '閣',
              isBoss: false,
            },
            {
              id: `stage-${tierNum}-3`,
              label: `제${tierNum}막 · 3장`,
              sub: '숙어 조립 (11~15번)',
              preview: tierKanji[10]?.character || '寺',
              isBoss: false,
            },
            {
              id: `stage-${tierNum}-4`,
              label: `제${tierNum}막 · 4장`,
              sub: '완전 정복 (16~20번)',
              preview: tierKanji[15]?.character || '光',
              isBoss: false,
            },
            ...tierBosses.map((boss, bIdx) => ({
              id: bIdx === 0 ? `stage-${tierNum}-boss` : `stage-${tierNum}-boss-${bIdx + 1}`,
              label: bIdx === 0 ? `제${tierNum}막 · 보스 결투` : `제${tierNum}막 · 보스 결투 II`,
              sub: `헷갈리는 한자: ${boss.characterA} vs ${boss.characterB}`,
              preview: '⚔️',
              isBoss: true,
              bossPairId: boss.id,
            })),
          ];

          return (
            <section
              key={tierNum}
              data-testid={`tier-card-${tierNum}`}
              className="tier-section"
              style={{ '--tier-accent-color': TIER_ACCENTS[tierNum] } as React.CSSProperties}
            >
              <div className="tier-section-header">
                <div>
                  <h3 className="tier-section-title">
                    <span>{TIER_TITLES_KO[tierNum]}</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#453b32' }}>
                      ({meta.name})
                    </span>
                    {!isUnlocked && <Lock size={16} color="#574c42" />}
                  </h3>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2c2520', marginTop: '0.15rem' }}>
                    {TIER_SUBTITLES_KO[tierNum]}
                  </p>
                </div>
                <span
                  className={isUnlocked ? 'pill-badge pill-badge--kunyomi' : 'pill-badge pill-badge--work'}
                  style={{ flexShrink: 0, fontSize: '0.875rem' }}
                >
                  {isUnlocked ? '입장 가능' : '이전 보스 격파 필요'}
                </span>
              </div>

              <div className="stage-grid">
                {stageConfigs.map((stage) => {
                  const isCompleted =
                    resolvedCompletedStages.includes(stage.id) ||
                    Boolean(
                      stage.bossPairId &&
                        resolvedCompletedStages.includes(`boss-${stage.bossPairId}`)
                    );
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      data-testid={`stage-btn-${stage.id}`}
                      disabled={!isUnlocked}
                      onClick={() =>
                        handleStageSelect(tierNum, stage.id, stage.bossPairId)
                      }
                      className={`stage-btn ${stage.isBoss ? 'stage-btn--boss' : ''} ${
                        !isUnlocked ? 'stage-btn--locked' : ''
                      }`.trim()}
                    >
                      <span className="stage-kanji-preview">{stage.preview}</span>
                      <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#141210' }}>
                        {stage.label}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2c2520' }}>
                        {stage.sub}
                      </span>
                      <span
                        className="stage-stars"
                        data-testid={`stage-stars-${stage.id}`}
                      >
                        {isCompleted ? '⭐⭐⭐' : isUnlocked ? '☆☆☆' : '🔒'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Grand Master Final Examination (8th Boss Encounter) */}
        {(() => {
          const grandBoss = getBossPairById('boss-08-mishima-grand');
          if (!grandBoss) return null;
          const isGrandUnlocked = resolvedUnlockedTiers.includes(4);
          const isGrandCompleted =
            resolvedCompletedStages.includes('stage-special-boss') ||
            resolvedCompletedStages.includes(`boss-${grandBoss.id}`);

          return (
            <section
              data-testid="tier-card-special"
              className="tier-section"
              style={{ '--tier-accent-color': 'var(--color-crimson-bright)' } as React.CSSProperties}
            >
              <div className="tier-section-header">
                <div>
                  <h3 className="tier-section-title">
                    <Crown size={19} color="#b45309" />
                    <span>최종 시련 · 환영 문호 미시마 결투 ({grandBoss.title})</span>
                    {!isGrandUnlocked && <Lock size={16} color="#574c42" />}
                  </h3>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2c2520', marginTop: '0.15rem' }}>
                    『풍요의 바다』 윤회·찰나·숙명 총결산 그랜드 보스전
                  </p>
                </div>
                <span
                  className={isGrandUnlocked ? 'pill-badge pill-badge--onyomi' : 'pill-badge pill-badge--work'}
                  style={{ flexShrink: 0, fontSize: '0.875rem' }}
                >
                  {isGrandUnlocked ? '도전 가능' : '제4막 해금 시 개방'}
                </span>
              </div>

              <div className="stage-grid">
                <button
                  type="button"
                  data-testid="stage-btn-stage-special-boss"
                  disabled={!isGrandUnlocked}
                  onClick={() =>
                    handleStageSelect(4, 'stage-special-boss', grandBoss.id)
                  }
                  className={`stage-btn stage-btn--boss ${
                    !isGrandUnlocked ? 'stage-btn--locked' : ''
                  }`.trim()}
                >
                  <span className="stage-kanji-preview">👑</span>
                  <span style={{ fontWeight: 900, fontSize: '0.95rem', color: '#450a0a' }}>
                    최종 결투 · 환영 문호
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#7f1d1d' }}>
                    輪 · 廻 · 刹 · 宿 · 命
                  </span>
                  <span
                    className="stage-stars"
                    data-testid="stage-stars-stage-special-boss"
                  >
                    {isGrandCompleted ? '⭐⭐⭐' : isGrandUnlocked ? '☆☆☆' : '🔒'}
                  </span>
                </button>
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
};

export default SalonMap;
