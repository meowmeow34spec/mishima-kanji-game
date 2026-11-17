/**
 * Salon Mishima - Audio & Salon Settings Modal
 * File: src/components/SettingsModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, X } from 'lucide-react';
import {
  isAudioMuted,
  setAudioMuted,
  getAudioVolume,
  setAudioVolume,
  playSound,
  unlockAudio,
} from '../audio/soundSynthesizer';
import { setSpeechEnabled, isSpeechEnabled } from '../audio/speechSynthesizer';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  const [muted, setMuted] = useState<boolean>(() => isAudioMuted());
  const [volume, setVolume] = useState<number>(() => getAudioVolume());
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(
    () => gameState.profile?.settings?.voiceEnabled ?? isSpeechEnabled()
  );

  useEffect(() => {
    if (isOpen) {
      setMuted(isAudioMuted());
      setVolume(getAudioVolume());
      setVoiceEnabled(gameState.profile?.settings?.voiceEnabled ?? isSpeechEnabled());
    }
  }, [isOpen, gameState.profile?.settings?.voiceEnabled]);

  if (!isOpen) {
    return null;
  }

  const persistAudioSettings = (nextMuted: boolean, nextVol: number, nextVoice: boolean) => {
    if (gameState.profile) {
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          audioSettings: {
            muted: nextMuted,
            sfxVolume: nextVol,
            bgmVolume: nextVol * 0.6,
          },
          settings: {
            isMuted: nextMuted,
            sfxVolume: nextVol,
            bgmVolume: nextVol * 0.6,
            voiceEnabled: nextVoice,
          },
        },
      });
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
    persistAudioSettings(nextMuted, volume, voiceEnabled);
  };

  const handleVolumeChange = (nextVol: number) => {
    setVolume(nextVol);
    setAudioVolume(nextVol);
    persistAudioSettings(muted, nextVol, voiceEnabled);
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    setSpeechEnabled(nextVoice);
    persistAudioSettings(muted, volume, nextVoice);
  };

  const handleTestBell = () => {
    try {
      unlockAudio().catch(() => {});
      playSound('bell');
    } catch {
      // Safe fallback
    }
  };

  return (
    <div
      className="word-reveal-modal"
      data-testid="settings-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Salon Settings"
    >
      <div className="reveal-parchment-card" style={{ maxWidth: '460px', textAlign: 'left' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            paddingBottom: '0.75rem',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-ink)' }}>
            サロン設定 (Settings)
          </h2>
          <button
            type="button"
            data-testid="btn-close-settings"
            className="btn-lacquer"
            style={{ padding: '0.35rem 0.7rem' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Mute Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>消音設定 (Master Mute)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-secondary)' }}>
                効果音・BGM・音声朗読を一括消音
              </div>
            </div>
            <button
              type="button"
              data-testid="toggle-mute"
              className={muted ? 'btn-crimson' : 'btn-lacquer'}
              onClick={handleToggleMute}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{muted ? '消音中 (Muted)' : '音声有効 (On)'}</span>
            </button>
          </div>

          {/* Master Volume Slider */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
                fontWeight: 700,
              }}
            >
              <label htmlFor="volume-slider">主音量 (Master Volume)</label>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              id="volume-slider"
              data-testid="volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-crimson)' }}
            />
          </div>

          {/* Japanese Speech Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>日本語朗読 (Japanese TTS)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-secondary)' }}>
                Web Speech APIによる漢字・熟語の発音
              </div>
            </div>
            <button
              type="button"
              data-testid="toggle-voice"
              className={voiceEnabled ? 'btn-gold' : 'btn-lacquer'}
              style={{ padding: '0.45rem 1rem' }}
              onClick={handleToggleVoice}
            >
              {voiceEnabled ? '有効 (ON)' : '無効 (OFF)'}
            </button>
          </div>

          {/* Test Sound Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(0,0,0,0.1)',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              data-testid="btn-test-audio"
              className="btn-lacquer"
              onClick={handleTestBell}
            >
              <Bell size={16} />
              <span>呼び鈴を試聴 (Test Bell)</span>
            </button>

            <button
              type="button"
              className="btn-gold"
              onClick={onClose}
            >
              <span>完了</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
