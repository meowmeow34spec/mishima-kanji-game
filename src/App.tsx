/**
 * Salon Mishima 3D - Root Application Component, Persistent 3D World & Beginner Onboarding Router
 * File: src/App.tsx
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Coffee,
  Flame,
  Coins,
  BookOpen,
  Settings,
  Volume2,
  VolumeX,
  Store,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  useGameState,
  useGameDispatch,
  deriveCameraMode3D,
  derivePatienceRatio,
  deriveCustomerAnimState,
  deriveQualityLevel3D,
  deriveUnlockedUpgrades,
  deriveStageKanjiLesson,
} from './hooks/useGameState';
import { getAllKanji } from './data/mishimaCurriculum';
import { getKoreanTierMeta } from './data/koreanGlossary';
import { parseStageId } from './data/koreanMnemonics';
import { generateRushPrompt } from './game/rushController';
import { SALON_CUSTOMERS } from './game/orderGenerator';
import { recordDailyLogin } from './srs/storageManager';
import {
  setAudioMuted,
  setAudioVolume,
  isAudioMuted,
  unlockAudio,
  suspendAudio,
} from './audio/soundSynthesizer';
import {
  setSpeechEnabled,
  cancelSpeech,
  speakKanji,
} from './audio/speechSynthesizer';
import type { CurriculumTierNumber, MishimaKanjiEntry } from './types/curriculum';
import type { RushPrompt } from './types/game';
import type {
  ActiveCustomer3D,
  KanjiBlock3DItem,
  SpeechBubbleAnchor2D,
} from './types/three3d';

import { SalonCanvas3D } from './components/SalonCanvas3D';
import { TitleScreen } from './components/TitleScreen';
import { SalonMap } from './components/SalonMap';
import { SalonCounter } from './components/SalonCounter';
import { WordRevealModal } from './components/WordRevealModal';
import { BossArena } from './components/BossArena';
import { RushOverlay } from './components/RushOverlay';
import { StudyCodexModal } from './components/StudyCodexModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { SettingsModal } from './components/SettingsModal';
import { CafeShopModal } from './components/CafeShopModal';
import { PreShiftLessonModal } from './components/PreShiftLessonModal';

interface PendingLessonStage {
  tier: CurriculumTierNumber;
  stageId: string;
  stageNum: 1 | 2 | 3 | 4;
}

function buildRushPromptAt(seedIndex: number): RushPrompt {
  const all = getAllKanji();
  const target = all[Math.abs(seedIndex) % all.length];
  return generateRushPrompt(target);
}

export const App: React.FC = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => isAudioMuted());
  const [speechAnchor, setSpeechAnchor] = useState<SpeechBubbleAnchor2D | null>(null);
  const [isCounterPaused, setCounterPaused] = useState(false);
  const [pendingLessonStage, setPendingLessonStage] =
    useState<PendingLessonStage | null>(null);
  const [activeLessonKanji, setActiveLessonKanji] =
    useState<MishimaKanjiEntry | null>(null);

  const [blockFlash, setBlockFlash] = useState<{
    label: string;
    isCorrect: boolean;
  } | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronized Rush prompt shared between 3D counter blocks and RushOverlay HUD
  const [rushPrompt, setRushPrompt] = useState<RushPrompt>(() =>
    buildRushPromptAt(0)
  );
  const rushTurnCount =
    (state.rushState?.hits ?? 0) + (state.rushState?.misses ?? 0);

  useEffect(() => {
    if (state.mode === 'rush') {
      setRushPrompt(
        buildRushPromptAt(rushTurnCount * 7 + (state.currentTier - 1) * 20)
      );
    }
  }, [state.mode, rushTurnCount, state.currentTier]);

  useEffect(() => {
    if (state.mode !== 'lesson') {
      setCounterPaused(false);
    }
  }, [state.mode]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
        flashTimerRef.current = null;
      }
    };
  }, []);

  const triggerBlockFlash = useCallback((label: string, isCorrect: boolean) => {
    setBlockFlash({ label, isCorrect });
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
    }
    flashTimerRef.current = setTimeout(() => {
      flashTimerRef.current = null;
      setBlockFlash(null);
    }, 420);
  }, []);

  // Initialize daily login streak & audio settings on mount
  useEffect(() => {
    try {
      const updated = recordDailyLogin();
      if (updated.audioSettings) {
        setAudioMuted(Boolean(updated.audioSettings.muted));
        setAudioVolume(updated.audioSettings.sfxVolume ?? 0.8);
        setMuted(Boolean(updated.audioSettings.muted));
      }
      setSpeechEnabled(updated.settings?.voiceEnabled ?? true);
      dispatch({ type: 'UPDATE_PROFILE', payload: updated });
    } catch {
      // Safe fallback in isolated environments
    }
  }, [dispatch]);

  // Unlock Web Audio on first user gesture & pause audio cleanly when tab is hidden
  useEffect(() => {
    let unlocked = false;
    const handleGesture = () => {
      if (!unlocked && !isAudioMuted()) {
        unlocked = true;
        unlockAudio().catch(() => {});
      }
    };
    const handleVisibilityChange = () => {
      if (typeof document === 'undefined') return;
      if (document.hidden) {
        cancelSpeech();
        suspendAudio().catch(() => {});
      } else if (unlocked && !isAudioMuted()) {
        unlockAudio().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Celebratory confetti on boss victory or stage completion
  useEffect(() => {
    if (state.bossState?.isDefeated || state.isLevelComplete) {
      try {
        const canUseCanvas =
          typeof document !== 'undefined' &&
          typeof document.createElement === 'function' &&
          Boolean(document.createElement('canvas')?.getContext?.('2d'));
        if (canUseCanvas) {
          confetti({
            particleCount: 55,
            spread: 70,
            origin: { y: 0.7 },
          });
        }
      } catch {
        // Canvas may be unavailable in jsdom or headless environments
      }
    }
  }, [state.bossState?.isDefeated, state.isLevelComplete]);

  const handleQuickMuteToggle = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
    if (state.profile) {
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          audioSettings: {
            muted: nextMuted,
            sfxVolume: state.profile.audioSettings?.sfxVolume ?? 0.8,
            bgmVolume: state.profile.audioSettings?.bgmVolume ?? 0.5,
          },
        },
      });
    }
  };

  // Opens the 1-minute Pre-Shift Beginner Lesson before entering the cafe shift
  const handleOpenStageLesson = useCallback(
    (tier: CurriculumTierNumber, stageId: string) => {
      if (stageId.includes('boss')) {
        setPendingLessonStage(null);
        setActiveLessonKanji(null);
        dispatch({ type: 'SELECT_STAGE', payload: { tier, stageId } });
        return;
      }
      const parsed = parseStageId(stageId, tier);
      const lessonItems = deriveStageKanjiLesson(parsed.tier, parsed.stageId);
      setPendingLessonStage(parsed);
      setActiveLessonKanji(lessonItems[0]?.kanji ?? null);
    },
    [dispatch]
  );

  // Completes or skips the Pre-Shift Lesson and launches the selected stage shift
  const handleLaunchStageAfterLesson = useCallback(
    (overrideTier?: CurriculumTierNumber, overrideStageId?: string) => {
      const targetTier =
        overrideTier ?? pendingLessonStage?.tier ?? state.currentTier;
      const targetStageId =
        overrideStageId ??
        pendingLessonStage?.stageId ??
        `stage-${targetTier}-1`;

      setPendingLessonStage(null);
      setActiveLessonKanji(null);
      setCounterPaused(false);
      dispatch({
        type: 'SELECT_STAGE',
        payload: { tier: targetTier, stageId: targetStageId },
      });
    },
    [pendingLessonStage, state.currentTier, dispatch]
  );

  const handleCloseLessonModal = useCallback(() => {
    setPendingLessonStage(null);
    setActiveLessonKanji(null);
  }, []);

  // Unified handler for picking an option from either 3D WebGL raycasting or Counter HUD/Hotkeys
  const handleCounterOptionPick = useCallback(
    (option: string) => {
      if (
        pendingLessonStage ||
        isCounterPaused ||
        state.revealKanji ||
        state.isGameOver ||
        state.isLevelComplete
      ) {
        return;
      }
      const order = state.activeOrder;
      if (!order) return;

      const isCorrect = option === order.correctOption;
      triggerBlockFlash(option, isCorrect);
      dispatch({ type: 'PICK_BLOCK', payload: { option } });
    },
    [
      pendingLessonStage,
      isCounterPaused,
      state.revealKanji,
      state.isGameOver,
      state.isLevelComplete,
      state.activeOrder,
      triggerBlockFlash,
      dispatch,
    ]
  );

  // Direct 3D block click/tap handler across Pre-Shift Study, Counter, Build, and 25s Rush modes
  const handle3DBlockPick = useCallback(
    (label: string) => {
      if (pendingLessonStage) {
        try {
          speakKanji(label);
        } catch {
          // Safe fallback
        }
        return;
      }

      if (state.mode === 'rush') {
        if (!state.rushState?.isActive) return;
        const isCorrect = label === rushPrompt.correctOption;
        triggerBlockFlash(label, isCorrect);
        dispatch({
          type: 'RUSH_ANSWER',
          payload: { isCorrect, coinReward: 15 },
        });
        return;
      }

      if (state.mode === 'lesson') {
        handleCounterOptionPick(label);
      }
    },
    [
      pendingLessonStage,
      state.mode,
      state.rushState?.isActive,
      rushPrompt.correctOption,
      triggerBlockFlash,
      dispatch,
      handleCounterOptionPick,
    ]
  );

  // Derive 3D Scene & Actor props from live game state + Pre-Shift Beginner Lesson showcase
  const cameraMode = pendingLessonStage ? 'counter' : deriveCameraMode3D(state);
  const effectiveTier = pendingLessonStage?.tier ?? state.currentTier;
  const patienceRatio = derivePatienceRatio(state);
  const customerAnim =
    pendingLessonStage || isCounterPaused
      ? 'idle'
      : deriveCustomerAnimState(state, patienceRatio);
  const qualityLevel = deriveQualityLevel3D(state);
  const unlockedUpgrades = useMemo(
    () => deriveUnlockedUpgrades(state),
    [state.unlockedUpgrades, state.profile?.unlockedUpgrades]
  );

  const pendingLessonItems = useMemo(
    () =>
      pendingLessonStage
        ? deriveStageKanjiLesson(
            pendingLessonStage.tier,
            pendingLessonStage.stageId
          )
        : [],
    [pendingLessonStage]
  );

  const activeCustomer3D = useMemo<ActiveCustomer3D | null>(() => {
    if (state.activeOrder) {
      return {
        id: state.activeOrder.customerId,
        name: state.activeOrder.customerName,
        avatar: state.activeOrder.customerAvatar,
      };
    }
    if (state.mode === 'rush') {
      const patron = SALON_CUSTOMERS[rushTurnCount % SALON_CUSTOMERS.length];
      return patron
        ? { id: patron.id, name: patron.name, avatar: patron.avatar }
        : null;
    }
    return null;
  }, [
    state.activeOrder?.customerId,
    state.activeOrder?.customerName,
    state.activeOrder?.customerAvatar,
    state.mode,
    rushTurnCount,
  ]);

  const blocks3D = useMemo<KanjiBlock3DItem[]>(() => {
    // Showcase the 5 study kanji on the 3D counter while PreShiftLessonModal is open!
    if (pendingLessonStage && pendingLessonItems.length > 0) {
      return pendingLessonItems.map((item, idx) => ({
        id: `lesson-preview-${item.id}-${idx}`,
        label: item.character,
        sublabel: String(idx + 1),
        isSelected: activeLessonKanji?.id === item.id,
        isCorrectFlash: activeLessonKanji?.id === item.id,
        isWrongFlash: false,
        slotIndex: -1,
      }));
    }

    if (state.mode === 'rush') {
      return rushPrompt.options.map((opt, idx) => ({
        id: `${rushPrompt.id}-rush-${idx}`,
        label: opt,
        sublabel: String(idx + 1),
        isSelected: false,
        isCorrectFlash: Boolean(
          blockFlash && blockFlash.label === opt && blockFlash.isCorrect
        ),
        isWrongFlash: Boolean(
          blockFlash && blockFlash.label === opt && !blockFlash.isCorrect
        ),
        slotIndex: -1,
      }));
    }

    if (state.mode === 'lesson' && state.activeOrder) {
      const placedSet = new Set(
        (state.traySlots || []).filter((s): s is string => Boolean(s))
      );
      return state.activeOrder.options.map((opt, idx) => {
        const trayIdx = (state.traySlots || []).indexOf(opt);
        const isCorrectFlash =
          Boolean(state.revealKanji && opt === state.activeOrder?.correctOption) ||
          Boolean(blockFlash && blockFlash.label === opt && blockFlash.isCorrect);
        const isWrongFlash = Boolean(
          blockFlash && blockFlash.label === opt && !blockFlash.isCorrect
        );

        return {
          id: `${state.activeOrder!.id}-opt-${idx}`,
          label: opt,
          sublabel: String(idx + 1),
          isSelected: placedSet.has(opt),
          isCorrectFlash,
          isWrongFlash,
          slotIndex: trayIdx,
        };
      });
    }

    return [];
  }, [
    pendingLessonStage,
    pendingLessonItems,
    activeLessonKanji?.id,
    state.mode,
    state.activeOrder,
    state.traySlots,
    state.revealKanji,
    rushPrompt,
    blockFlash,
  ]);

  const targetWordLength = useMemo(() => {
    if (state.activeOrder?.mode === 'build') {
      return (
        state.activeOrder.traySlots?.length ||
        state.activeOrder.targetKanji?.literaryCompounds?.[0]?.compound?.length ||
        2
      );
    }
    return 1;
  }, [state.activeOrder]);

  const tierMetaKo = getKoreanTierMeta(effectiveTier);
  const chalkboardTitle = pendingLessonStage
    ? `☕ ${pendingLessonStage.stageNum}교시 오픈 전 한자 과외`
    : state.mode === 'rush'
      ? '25초 폭풍 주문 러시'
      : state.mode === 'shop'
        ? '살롱 인테리어 상점'
        : tierMetaKo?.nameKo || '살롱 미시마 3D';
  const chalkboardSubtitle = pendingLessonStage
    ? `오늘의 한자: ${pendingLessonItems.map((i) => i.character).join(' · ')}`
    : state.mode === 'lesson'
      ? `주문 ${Math.min(state.stageOrderIndex + 1, state.stageTotalOrders)} / ${state.stageTotalOrders}`
      : state.mode === 'rush'
        ? `성공 ${state.rushState?.hits ?? 0}건 · 코인 보너스`
        : '미시마 유키오 문학 80한자 카페';

  const streak = state.profile?.streak ?? 1;
  const allKanji = getAllKanji();

  return (
    <div
      id="salon-mishima-app"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Persistent Full-Viewport Interactive 3D WebGL Kissaten World */}
      <SalonCanvas3D
        mode={cameraMode}
        tier={effectiveTier}
        activeCustomer={activeCustomer3D}
        customerAnim={customerAnim}
        patienceRatio={patienceRatio}
        blocks={blocks3D}
        onBlockPick={handle3DBlockPick}
        traySlots={state.traySlots}
        targetWordLength={targetWordLength}
        bossState={state.bossState}
        rushActive={state.mode === 'rush' && Boolean(state.rushState?.isActive)}
        feverActive={Boolean(state.feverActive)}
        unlockedUpgrades={unlockedUpgrades}
        particleEvent={state.particleEvent ?? null}
        qualityLevel={qualityLevel}
        onAnchorUpdate={setSpeechAnchor}
        taskMode={state.activeOrder?.mode}
        chalkboardTitle={chalkboardTitle}
        chalkboardSubtitle={chalkboardSubtitle}
      />

      {/* Persistent High-Contrast Top HUD */}
      <header className="salon-hud" data-testid="salon-hud">
        <div
          className="salon-hud-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setPendingLessonStage(null);
            setActiveLessonKanji(null);
            dispatch({ type: 'RETURN_TO_TITLE' });
          }}
        >
          <Coffee size={22} color="var(--color-gold-light)" style={{ flexShrink: 0 }} />
          <span className="salon-hud-title">
            살롱 미시마 3D <span className="salon-hud-subtitle">(サロン三島)</span>
          </span>
        </div>

        <div className="salon-hud-stats">
          <div className="stat-badge stat-badge--coins" data-testid="hud-coins">
            <Coins size={15} />
            <span>{state.coins} 銭</span>
          </div>

          <div className="stat-badge stat-badge--streak" data-testid="hud-streak">
            <Flame size={15} />
            <span>{streak} 일 연속</span>
          </div>

          <button
            type="button"
            className="btn-icon"
            data-testid="hud-btn-shop"
            aria-label="Open 3D Cafe Shop"
            title="3D 카페 인테리어 상점"
            onClick={() => {
              setPendingLessonStage(null);
              dispatch({
                type: state.mode === 'shop' ? 'CLOSE_SHOP' : 'OPEN_SHOP',
              });
            }}
          >
            <Store size={18} />
          </button>

          <button
            type="button"
            className="btn-icon"
            aria-label="Open Study Codex"
            title="미시마 80한자 도감 (Study Codex)"
            onClick={() => {
              setPendingLessonStage(null);
              dispatch({ type: 'OPEN_CODEX' });
            }}
          >
            <BookOpen size={18} />
          </button>

          <button
            type="button"
            className="btn-icon"
            aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            title={muted ? '소리 켜기' : '음소거'}
            onClick={handleQuickMuteToggle}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            type="button"
            className="btn-icon"
            aria-label="Open Settings"
            title="설정 및 3D 그래픽 품질"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Active Transparent Pointer-Through Mode Screen */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {state.mode === 'title' && !pendingLessonStage && (
          <TitleScreen
            onStartWithLesson={handleOpenStageLesson}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}

        {(state.mode === 'map' ||
          state.mode === 'codex' ||
          state.mode === 'review') &&
          !pendingLessonStage && (
            <SalonMap
              onRequestStageLesson={handleOpenStageLesson}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}

        {state.mode === 'lesson' && (
          <SalonCounter
            speechAnchor={speechAnchor}
            onPickOption={handleCounterOptionPick}
            onPauseChange={setCounterPaused}
          />
        )}

        {state.mode === 'boss' && <BossArena />}

        {state.mode === 'rush' && <RushOverlay currentPrompt={rushPrompt} />}
      </main>

      {/* Pre-Shift 1-Minute Beginner Kanji Lesson Modal ("먼저 배우고 익힌 뒤 출근!") */}
      <PreShiftLessonModal
        isOpen={Boolean(pendingLessonStage)}
        tier={pendingLessonStage?.tier ?? state.currentTier}
        stageNum={pendingLessonStage?.stageNum ?? 1}
        stageId={pendingLessonStage?.stageId ?? null}
        onStartShift={handleLaunchStageAfterLesson}
        onComplete={handleLaunchStageAfterLesson}
        onSkip={handleLaunchStageAfterLesson}
        onSkipLesson={handleLaunchStageAfterLesson}
        onClose={handleCloseLessonModal}
        onActiveKanjiChange={(kanji) => setActiveLessonKanji(kanji)}
      />

      {/* Global Overlays & Modals */}
      <CafeShopModal
        isOpen={state.mode === 'shop'}
        onClose={() => dispatch({ type: 'CLOSE_SHOP' })}
      />

      <WordRevealModal
        isOpen={Boolean(state.revealKanji)}
        kanji={state.revealKanji}
        onClose={() => dispatch({ type: 'DISMISS_REVEAL' })}
      />

      <StudyCodexModal
        isOpen={state.mode === 'codex'}
        kanjiList={allKanji}
        onClose={() => dispatch({ type: 'CLOSE_CODEX' })}
      />

      <DailyReviewModal
        isOpen={state.mode === 'review'}
        profile={state.profile}
        onClose={() => dispatch({ type: 'CLOSE_REVIEW' })}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMuted(isAudioMuted());
        }}
      />
    </div>
  );
};

export default App;
