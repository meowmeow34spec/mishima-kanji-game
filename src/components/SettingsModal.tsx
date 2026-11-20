/**
 * Salon Mishima 3D - Korean-First Audio & 3D Graphics Quality Settings Modal
 * File: src/components/SettingsModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, X, Sparkles } from 'lucide-react';
import type { QualityLevel3D } from '../types/three3d';
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
  const [qualityLevel, setQualityLevel] = useState<QualityLevel3D>(
    () => gameState.profile?.settings?.qualityLevel ?? 'high'
  );

  useEffect(() => {
    if (isOpen) {
      setMuted(isAudioMuted());
      setVolume(getAudioVolume());
      setVoiceEnabled(gameState.profile?.settings?.voiceEnabled ?? isSpeechEnabled());
      setQualityLevel(gameState.profile?.settings?.qualityLevel ?? 'high');
    }
  }, [
    isOpen,
    gameState.profile?.settings?.voiceEnabled,
    gameState.profile?.settings?.qualityLevel,
  ]);

  if (!isOpen) {
    return null;
  }

  const persistSettings = (
    nextMuted: boolean,
    nextVol: number,
    nextVoice: boolean,
    nextQuality: QualityLevel3D
  ) => {
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
            qualityLevel: nextQuality,
          },
        },
      });
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
    persistSettings(nextMuted, volume, voiceEnabled, qualityLevel);
  };

  const handleVolumeChange = (nextVol: number) => {
    setVolume(nextVol);
    setAudioVolume(nextVol);
    persistSettings(muted, nextVol, voiceEnabled, qualityLevel);
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    setSpeechEnabled(nextVoice);
    persistSettings(muted, volume, nextVoice, qualityLevel);
  };

  const handleSelectQuality = (nextQuality: QualityLevel3D) => {
    setQualityLevel(nextQuality);
    persistSettings(muted, volume, voiceEnabled, nextQuality);
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
      aria-label="살롱 환경 설정"
    >
      <div className="reveal-parchment-card" style={{ maxWidth: '480px', textAlign: 'left' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '2px solid #e7dfd0',
            paddingBottom: '0.75rem',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#141210' }}>
            ⚙️ 살롱 환경 및 3D 설정
          </h2>
          <button
            type="button"
            data-testid="btn-close-settings"
            className="btn-ivory"
            style={{ padding: '0.35rem 0.7rem' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Mute Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#141210' }}>
                전체 소리 켜기 / 끄기
              </div>
              <div style={{ fontSize: '0.875rem', color: '#2c2520' }}>
                배경 재즈·효과음·발음 낭독 일괄 음소거
              </div>
            </div>
            <button
              type="button"
              data-testid="toggle-mute"
              className={muted ? 'btn-crimson' : 'btn-emerald'}
              style={{ padding: '0.5rem 0.95rem', fontSize: '0.9rem' }}
              onClick={handleToggleMute}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{muted ? '음소거됨' : '소리 켜짐'}</span>
            </button>
          </div>

          {/* Master Volume Slider */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
                fontWeight: 800,
                fontSize: '0.98rem',
                color: '#141210',
              }}
            >
              <label htmlFor="volume-slider">사운드 볼륨</label>
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
              style={{ width: '100%', accentColor: '#991b1b' }}
            />
          </div>

          {/* Japanese Speech Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#141210' }}>
                일본어 발음 자동 낭독 (TTS)
              </div>
              <div style={{ fontSize: '0.875rem', color: '#2c2520' }}>
                정답 서빙 시 한자·숙어 일본어 발음 재생
              </div>
            </div>
            <button
              type="button"
              data-testid="toggle-voice"
              className={voiceEnabled ? 'btn-gold' : 'btn-ivory'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}
              onClick={handleToggleVoice}
            >
              {voiceEnabled ? '켜짐 (ON)' : '꺼짐 (OFF)'}
            </button>
          </div>

          {/* 3D Quality Selector */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#141210',
                marginBottom: '0.45rem',
              }}
            >
              <Sparkles size={16} color="#b45309" />
              <span>3D 카페 그래픽 품질</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(
                [
                  { id: 'high', label: '고화질' },
                  { id: 'medium', label: '표준' },
                  { id: 'low', label: '절전' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  data-testid={`quality-${opt.id}`}
                  className={qualityLevel === opt.id ? 'btn-gold' : 'btn-ivory'}
                  style={{ padding: '0.45rem 0.5rem', fontSize: '0.9rem' }}
                  onClick={() => handleSelectQuality(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Sound & Close */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid #e7dfd0',
              paddingTop: '1rem',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              data-testid="btn-test-audio"
              className="btn-ivory"
              onClick={handleTestBell}
            >
              <Bell size={16} />
              <span>카운터 종소리 테스트</span>
            </button>

            <button
              type="button"
              className="btn-gold"
              onClick={onClose}
            >
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
