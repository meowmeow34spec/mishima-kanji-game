/**
 * Salon Mishima - Root Application Component & Mode Router
 * File: src/App.tsx
 */

import React, { useState, useEffect } from 'react';
import { Coffee, Flame, Coins, BookOpen, Settings, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameState, useGameDispatch } from './hooks/useGameState';
import { getAllKanji } from './data/mishimaCurriculum';
import { recordDailyLogin } from './srs/storageManager';
import { setAudioMuted, setAudioVolume, isAudioMuted } from './audio/soundSynthesizer';
import { setSpeechEnabled } from './audio/speechSynthesizer';

import { TitleScreen } from './components/TitleScreen';
import { SalonMap } from './components/SalonMap';
import { SalonCounter } from './components/SalonCounter';
import { WordRevealModal } from './components/WordRevealModal';
import { BossArena } from './components/BossArena';
import { RushOverlay } from './components/RushOverlay';
import { StudyCodexModal } from './components/StudyCodexModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => isAudioMuted());

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

  const streak = state.profile?.streak ?? 1;
  const allKanji = getAllKanji();

  return (
    <div id="salon-mishima-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Persistent Showa Top HUD */}
      <header className="salon-hud" data-testid="salon-hud">
        <div
          className="salon-hud-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => dispatch({ type: 'RETURN_TO_TITLE' })}
        >
          <Coffee size={22} color="var(--color-gold-light)" />
          <span className="salon-hud-title">サロン三島 (Salon Mishima)</span>
        </div>

        <div className="salon-hud-stats">
          <div className="stat-badge stat-badge--coins" data-testid="hud-coins">
            <Coins size={15} />
            <span>{state.coins} 銭</span>
          </div>

          <div className="stat-badge stat-badge--streak" data-testid="hud-streak">
            <Flame size={15} />
            <span>{streak} 日</span>
          </div>

          <button
            type="button"
            className="btn-icon"
            aria-label="Open Study Codex"
            title="三島漢字録 (Study Codex)"
            onClick={() => dispatch({ type: 'OPEN_CODEX' })}
          >
            <BookOpen size={18} />
          </button>

          <button
            type="button"
            className="btn-icon"
            aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            title={muted ? '消音解除' : '消音'}
            onClick={handleQuickMuteToggle}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            type="button"
            className="btn-icon"
            aria-label="Open Settings"
            title="設定 (Settings)"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Active Mode Screen */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {state.mode === 'title' && (
          <TitleScreen onOpenSettings={() => setSettingsOpen(true)} />
        )}

        {(state.mode === 'map' || state.mode === 'codex' || state.mode === 'review') && (
          <SalonMap onOpenSettings={() => setSettingsOpen(true)} />
        )}

        {state.mode === 'lesson' && <SalonCounter />}

        {state.mode === 'boss' && <BossArena />}

        {state.mode === 'rush' && <RushOverlay />}
      </main>

      {/* Global Overlays & Modals */}
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
