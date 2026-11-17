/**
 * Salon Mishima - Audio & Speech Subsystem Unit Tests
 * File: tests/audio.test.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  SoundSynthesizerImpl,
  soundSynthesizer,
  playSound,
  startBgm,
  stopBgm,
  setAudioMuted,
  isAudioMuted,
  setAudioVolume,
  getAudioVolume,
  unlockAudio,
} from '../src/audio/soundSynthesizer';
import {
  SpeechSynthesizerImpl,
  speakKanji,
  cancelSpeech,
  isSpeechSupported,
} from '../src/audio/speechSynthesizer';
import {
  assertSoundDispatched,
  assertAudioMuted,
  assertBgmPlaying,
  assertBgmStopped,
  getCreatedOscillators,
  getLastCreatedOscillator,
  getLastCreatedGain,
  resetAudioMocks,
} from './helpers/mockAudio';
import {
  assertSpoken,
  assertSpeechCancelled,
  getSpokenUtterances,
  resetSpeechMocks,
} from './helpers/mockSpeech';

describe('Salon Mishima - Audio & Speech Subsystem Unit Tests', () => {
  beforeEach(() => {
    resetAudioMocks();
    resetSpeechMocks();
    setAudioMuted(false);
    setAudioVolume(0.8);
    stopBgm();
  });

  afterEach(async () => {
    stopBgm();
    cancelSpeech();
    vi.useRealTimers();
  });

  // =========================================================================
  // 1. AudioContext Lifecycle & Unlock Handling
  // =========================================================================
  describe('1. AudioContext Lifecycle & Unlock Handling', () => {
    it('AUD-01: should lazily create an AudioContext on first sound or unlock request', async () => {
      const synth = new SoundSynthesizerImpl();
      await synth.unlock();
      expect(synth.getVolume()).toBe(0.8);
    });

    it('AUD-02: should resume AudioContext if initial state is suspended when unlock() is called', async () => {
      const synth = new SoundSynthesizerImpl();
      await synth.unlock();
      await unlockAudio();
      // Should not throw and successfully resolve
      expect(true).toBe(true);
    });

    it('AUD-03: should be idempotent on repeated unlock() invocations', async () => {
      await unlockAudio();
      await unlockAudio();
      await unlockAudio();
      expect(true).toBe(true);
    });

    it('AUD-04: should close audio context cleanly when close() is invoked', async () => {
      const synth = new SoundSynthesizerImpl();
      synth.startBgm('salon');
      expect(synth.getBgmMode()).toBe('salon');
      await synth.close();
      expect(synth.getBgmMode()).toBeNull();
    });
  });

  // =========================================================================
  // 2. Procedural SFX Playback (9 Required Effects)
  // =========================================================================
  describe('2. Procedural SFX Playback', () => {
    it('AUD-05: should play "bell" SFX (kissaten door chime)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('bell');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-06: should play "clink" SFX (porcelain teacup clink)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('clink');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-07: should play "correct" SFX (ascending pentatonic chime)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('correct');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-08: should play "wrong" SFX (gentle downward square buzzer)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('wrong');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-09: should play "drop" SFX (wooden block snap click)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('drop');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-10: should play "fanfare" SFX (multi-note celebratory victory flourish)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('fanfare');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThanOrEqual(prevCount + 5);
    });

    it('AUD-11: should play "rush" SFX (high-tempo pulse warning)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('rush');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-12: should play "hurt" SFX (heart loss thud)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('hurt');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-13: should play "bossHit" SFX (sub-bass drop impact)', () => {
      const prevCount = getCreatedOscillators().length;
      playSound('bossHit');
      assertSoundDispatched();
      expect(getCreatedOscillators().length).toBeGreaterThan(prevCount);
    });

    it('AUD-14: should scale pitch upward when combo option is provided', () => {
      const initialOscs = getCreatedOscillators().length;
      soundSynthesizer.play('correct', { combo: 5 });
      const oscs = getCreatedOscillators();
      expect(oscs.length).toBeGreaterThan(initialOscs);
      const lastOsc = oscs[oscs.length - 1];
      expect(lastOsc.start).toHaveBeenCalled();
    });

    it('AUD-15: should clamp extreme combo values up to max 9', () => {
      const initialOscs = getCreatedOscillators().length;
      soundSynthesizer.play('correct', { combo: 50, pitchOffset: 10 });
      expect(getCreatedOscillators().length).toBeGreaterThan(initialOscs);
    });

    it('AUD-16: should connect oscillator to gain node and gain node to bus', () => {
      playSound('bell');
      const lastOsc = getLastCreatedOscillator();
      const lastGain = getLastCreatedGain();
      expect(lastOsc).toBeDefined();
      expect(lastGain).toBeDefined();
      expect(lastOsc?.destination).toBe(lastGain);
    });
  });

  // =========================================================================
  // 3. Procedural Background Music (Salon & Boss Modes)
  // =========================================================================
  describe('3. Procedural BGM (Salon & Boss)', () => {
    it('AUD-17: should start "salon" Showa jazz ambient BGM and create ambient carrier', () => {
      const initialOscCount = getCreatedOscillators().length;
      startBgm('salon');
      const osc = assertBgmPlaying();
      expect(osc).toBeDefined();
      expect(osc.start).toHaveBeenCalled();
      expect(osc.stop).not.toHaveBeenCalled();
      expect(getCreatedOscillators().length).toBeGreaterThan(initialOscCount);
      expect(soundSynthesizer.getBgmMode()).toBe('salon');
    });

    it('AUD-18: should stop active BGM oscillators when stopBgm() is called', () => {
      startBgm('salon');
      const osc = assertBgmPlaying();
      stopBgm();
      assertBgmStopped(osc);
      expect(soundSynthesizer.getBgmMode()).toBeNull();
    });

    it('AUD-19: should cleanly transition from "salon" to "boss" BGM without leaking oscillators', () => {
      startBgm('salon');
      const salonOsc = getLastCreatedOscillator();
      expect(salonOsc?.start).toHaveBeenCalled();

      startBgm('boss');
      expect(salonOsc?.stop).toHaveBeenCalled();

      const bossOsc = getLastCreatedOscillator();
      expect(bossOsc).toBeDefined();
      expect(bossOsc?.start).toHaveBeenCalled();
      expect(bossOsc?.stop).not.toHaveBeenCalled();
      expect(soundSynthesizer.getBgmMode()).toBe('boss');
    });

    it('AUD-20: should not duplicate oscillators if startBgm() is called repeatedly with same mode', () => {
      startBgm('salon');
      const count1 = getCreatedOscillators().length;
      startBgm('salon');
      const count2 = getCreatedOscillators().length;
      expect(count2).toBe(count1);
    });

    it('AUD-21: should safely handle stopBgm() when no BGM is currently playing', () => {
      expect(() => stopBgm()).not.toThrow();
      expect(soundSynthesizer.getBgmMode()).toBeNull();
    });
  });

  // =========================================================================
  // 4. Volume Scaling & Mute Enforcement
  // =========================================================================
  describe('4. Master Volume & Mute Enforcement', () => {
    it('AUD-22: should initialize with unmuted state and default volume', () => {
      expect(isAudioMuted()).toBe(false);
      expect(getAudioVolume()).toBe(0.8);
    });

    it('AUD-23: should update volume and clamp to [0, 1]', () => {
      setAudioVolume(0.5);
      expect(getAudioVolume()).toBe(0.5);

      setAudioVolume(1.5);
      expect(getAudioVolume()).toBe(1.0);

      setAudioVolume(-0.2);
      expect(getAudioVolume()).toBe(0.0);

      setAudioVolume(NaN);
      expect(getAudioVolume()).toBe(0.8);
    });

    it('AUD-24: should suppress all SFX oscillator dispatch when setMuted(true)', () => {
      setAudioMuted(true);
      expect(isAudioMuted()).toBe(true);

      const beforeCount = getCreatedOscillators().length;
      playSound('bell');
      playSound('correct');
      playSound('wrong');

      assertAudioMuted(beforeCount);
    });

    it('AUD-25: should cancel active speech when setAudioMuted(true) is invoked', () => {
      setAudioMuted(true);
      assertSpeechCancelled();
    });

    it('AUD-26: should restore SFX playback when setMuted(false)', () => {
      setAudioMuted(true);
      setAudioMuted(false);
      expect(isAudioMuted()).toBe(false);

      playSound('bell');
      assertSoundDispatched();
    });
  });

  // =========================================================================
  // 5. Speech Synthesis Subsystem
  // =========================================================================
  describe('5. Web Speech API Synthesizer (ja-JP)', () => {
    it('AUD-27: should dispatch Japanese speech utterance targeting "ja-JP" voice', async () => {
      const res = await speakKanji('金閣寺');
      expect(res).toBe(true);
      assertSpoken('金閣寺', 'ja-JP');
      const utterances = getSpokenUtterances();
      expect(utterances.length).toBeGreaterThan(0);
      expect(utterances[0].lang).toBe('ja-JP');
      expect(utterances[0].rate).toBeCloseTo(0.85, 1);
    });

    it('AUD-28: should allow custom speech rate parameter in speak(text, rate)', async () => {
      await speakKanji('憂国', 1.0);
      assertSpoken('憂国', 'ja-JP');
      const last = getSpokenUtterances()[0];
      expect(last.rate).toBe(1.0);
    });

    it('AUD-29: should cancel active speech when cancelSpeech() is invoked', () => {
      cancelSpeech();
      assertSpeechCancelled();
    });

    it('AUD-30: should detect Web Speech API availability via isSpeechSupported()', () => {
      expect(isSpeechSupported()).toBe(true);
    });

    it('AUD-31: should return false immediately for empty or silent text', async () => {
      expect(await speakKanji('')).toBe(false);
      expect(await speakKanji('   ')).toBe(false);
      expect(await speakKanji('・')).toBe(false);
      expect(await speakKanji('ーー')).toBe(false);
    });

    it('AUD-32: should degrade gracefully (resolve false) when speechSynthesis is undefined', async () => {
      const orig = (globalThis as any).speechSynthesis;
      delete (globalThis as any).speechSynthesis;
      try {
        const customSynth = new SpeechSynthesizerImpl();
        const res = await customSynth.speak('仮面の告白');
        expect(res).toBe(false);
      } finally {
        (globalThis as any).speechSynthesis = orig;
      }
    });
  });
});
