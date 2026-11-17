/**
 * Salon Mishima - Salon Floor Plan & Chapter Stage Selection Map
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
} from 'lucide-react';
import type { CurriculumTierNumber } from '../types/curriculum';
import type { PlayerProfile } from '../types/srs';
import { TIER_METADATA, getKanjiByTier } from '../data/mishimaCurriculum';
import { getBossPairsByTier, getBossPairById } from '../data/bossPairs';
import { getDueKanji } from '../srs/leitnerEngine';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface SalonMapProps {
  unlockedTiers?: number[];
  completedStages?: string[];
  profile?: PlayerProfile | null;
  onSelectStage?: (tier: CurriculumTierNumber, stageId: string) => void;
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

const TIER_SUBTITLES_KO: Record<CurriculumTierNumber, string> = {
  1: '금각의 불꽃과 탐미 · 『금각사』 20자',
  2: '조소의 바다와 유현 · 『조소』『봄눈』『천인오쇠』 20자',
  3: '가면의 고백과 애증 · 『가면의 고백』『금색』『록명관』 20자',
  4: '우국과 태양·분마 · 『우국』『분마』『태양과 철』 20자',
};

export const SalonMap: React.FC<SalonMapProps> = ({
  unlockedTiers,
  completedStages,
  profile,
  onSelectStage,
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
        <h2 className="map-header-title">文豪サロン案内図 (Salon Floor Plan)</h2>
        <p style={{ color: 'var(--color-washi-dim)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          三島文学の四つの階層を巡り、80字の漢字を極めよ · 미시마 유키오 문학 한자 80자 완전 정복
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            data-testid="btn-back-title"
            className="btn-lacquer"
            onClick={handleBackTitle}
          >
            <ArrowLeft size={16} />
            <span>表へ戻る</span>
          </button>

          <button
            type="button"
            data-testid="btn-daily-review"
            className="btn-lacquer"
            onClick={handleOpenReview}
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
            onClick={handleOpenCodex}
          >
            <BookOpen size={16} />
            <span>三島漢字録 (Codex)</span>
          </button>

          <button
            type="button"
            data-testid="btn-start-rush"
            className="btn-gold"
            onClick={handleStartRush}
          >
            <Zap size={16} />
            <span>猛火注文 (25s Rush Mode)</span>
          </button>

          <button
            type="button"
            data-testid="btn-boss-arena"
            className="btn-crimson"
            onClick={handleBossArena}
          >
            <Swords size={16} />
            <span>決闘 (Boss Duel)</span>
          </button>

          {onOpenSettings && (
            <button
              type="button"
              data-testid="btn-open-settings"
              className="btn-icon"
              aria-label="Settings"
              onClick={onOpenSettings}
            >
              <Settings size={18} />
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
              label: `第${tierNum}幕・壱`,
              sub: '基礎給仕 (1–5字)',
              preview: tierKanji[0]?.character || '金',
              isBoss: false,
            },
            {
              id: `stage-${tierNum}-2`,
              label: `第${tierNum}幕・弐`,
              sub: '読解応対 (6–10字)',
              preview: tierKanji[5]?.character || '閣',
              isBoss: false,
            },
            {
              id: `stage-${tierNum}-3`,
              label: `第${tierNum}幕・参`,
              sub: '熟語調合 (11–15字)',
              preview: tierKanji[10]?.character || '寺',
              isBoss: false,
            },
            {
              id: `stage-${tierNum}-4`,
              label: `第${tierNum}幕・肆`,
              sub: '奥義完遂 (16–20字)',
              preview: tierKanji[15]?.character || '光',
              isBoss: false,
            },
            ...tierBosses.map((boss, bIdx) => ({
              id: bIdx === 0 ? `stage-${tierNum}-boss` : `stage-${tierNum}-boss-${bIdx + 1}`,
              label: bIdx === 0 ? `第${tierNum}幕・決闘` : `第${tierNum}幕・決闘弐`,
              sub: `${boss.characterA} vs ${boss.characterB}`,
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
                    <span>第{tierNum}階層：{meta.name}</span>
                    {!isUnlocked && <Lock size={16} color="var(--color-ink-muted)" />}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-washi-dim)' }}>
                    {meta.subtitle}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginTop: '0.15rem' }}>
                    {TIER_SUBTITLES_KO[tierNum]}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: isUnlocked ? 'var(--color-gold-light)' : 'var(--color-ink-muted)',
                    border: '1px solid var(--color-gold-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.2rem 0.75rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isUnlocked ? '開放済 (Unlocked)' : '未開放 (Locked)'}
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
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {stage.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-washi-dim)' }}>
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
                    <Crown size={18} color="var(--color-gold-light)" />
                    <span>最終試練：{grandBoss.title}</span>
                    {!isGrandUnlocked && <Lock size={16} color="var(--color-ink-muted)" />}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-washi-dim)' }}>
                    {grandBoss.subtitle} · 최종 보스: 환영 문호 미시마 유키오
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: isGrandUnlocked ? 'var(--color-gold-light)' : 'var(--color-ink-muted)',
                    border: '1px solid var(--color-gold-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.2rem 0.75rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isGrandUnlocked ? '挑戦可能 (Ready)' : '第4階層で開放'}
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
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    最終決闘・幻影文豪
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-washi-dim)' }}>
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
