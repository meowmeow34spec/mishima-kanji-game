/**
 * Salon Mishima - Audio & Speech Subsystems Type Definitions
 * File: src/types/audio.ts
 */

export type SoundEffectType =
  | 'bell'
  | 'clink'
  | 'correct'
  | 'wrong'
  | 'drop'
  | 'fanfare'
  | 'rush'
  | 'hurt'
  | 'bossHit';

export type SoundType = SoundEffectType;

export type BgmMode = 'salon' | 'boss';

export interface PlaySoundOptions {
  combo?: number;
  pitchOffset?: number;
  volume?: number;
}

export interface ToneOptions {
  type?: OscillatorType;
  vol?: number;
  attack?: number;
  delay?: number;
  bus?: GainNode;
}

export interface NoiseOptions {
  type?: BiquadFilterType;
  q?: number;
  f0?: number;
  f1?: number;
  vol?: number;
  delay?: number;
  bus?: GainNode;
}

export interface AudioSettings {
  muted: boolean;
  sfxVolume: number;
  bgmVolume: number;
}

export interface SoundSynthesizer {
  play(type: SoundEffectType, options?: PlaySoundOptions): void;
  startBgm(mode: BgmMode): void;
  stopBgm(): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  unlock(): Promise<void>;
  getBgmMode?(): BgmMode | null;
  close?(): Promise<void>;
}

export interface SpeechSynthesizer {
  speak(text: string, rate?: number): Promise<boolean>;
  isSupported(): boolean;
  cancel(): void;
}
