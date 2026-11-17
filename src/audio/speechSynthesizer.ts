/**
 * Salon Mishima - Web Speech API Japanese Speech Synthesizer
 * File: src/audio/speechSynthesizer.ts
 */

import { SpeechSynthesizer } from '../types/audio';
import { isAudioMuted } from './soundSynthesizer';

const PREFERRED_VOICES_REGEX = /Google|Kyoko|O-ren|Otoya|Haruka|Ayumi|Nanami|Sayaka|Ichiro/i;
const SILENT_TEXT_REGEX = /^[・\sーッ]*$/;

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis != null) {
    return window.speechSynthesis;
  }
  if (typeof globalThis !== 'undefined' && 'speechSynthesis' in globalThis && (globalThis as any).speechSynthesis != null) {
    return (globalThis as any).speechSynthesis;
  }
  return null;
}

function getSpeechSynthesisUtteranceClass(): typeof SpeechSynthesisUtterance | null {
  if (typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window && (window as any).SpeechSynthesisUtterance != null) {
    return (window as any).SpeechSynthesisUtterance;
  }
  if (typeof globalThis !== 'undefined' && 'SpeechSynthesisUtterance' in globalThis && (globalThis as any).SpeechSynthesisUtterance != null) {
    return (globalThis as any).SpeechSynthesisUtterance;
  }
  return null;
}

export class SpeechSynthesizerImpl implements SpeechSynthesizer {
  private activeVoice: SpeechSynthesisVoice | null = null;
  private isListeningToVoices: boolean = false;
  private enabled: boolean = true;

  constructor() {
    this.refreshVoices();
    const synth = getSpeechSynthesis();
    if (synth && !this.isListeningToVoices && typeof synth.addEventListener === 'function') {
      try {
        synth.addEventListener('voiceschanged', () => this.refreshVoices());
        this.isListeningToVoices = true;
      } catch {
        // Safe ignore
      }
    }
  }

  private refreshVoices(): void {
    const synth = getSpeechSynthesis();
    if (!synth || typeof synth.getVoices !== 'function') return;

    try {
      const voices = synth.getVoices();
      if (!Array.isArray(voices) || voices.length === 0) {
        this.activeVoice = null;
        return;
      }
      const jaVoices = voices.filter((v) => v && v.lang && /^ja([-_]|$)/i.test(v.lang));
      if (jaVoices.length === 0) {
        this.activeVoice = null;
        return;
      }
      this.activeVoice = jaVoices.find((v) => PREFERRED_VOICES_REGEX.test(v.name)) ?? jaVoices[0] ?? null;
    } catch {
      this.activeVoice = null;
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.cancel();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isSupported(): boolean {
    const synth = getSpeechSynthesis();
    const UtteranceClass = getSpeechSynthesisUtteranceClass();
    return synth != null && UtteranceClass != null;
  }

  public cancel(): void {
    const synth = getSpeechSynthesis();
    if (synth && typeof synth.cancel === 'function') {
      try {
        synth.cancel();
      } catch {
        // Safe ignore
      }
    }
  }

  public async speak(text: string, rate: number = 0.85): Promise<boolean> {
    if (!this.enabled || isAudioMuted()) {
      return false;
    }
    if (!this.isSupported() || !text || typeof text !== 'string' || SILENT_TEXT_REGEX.test(text)) {
      return false;
    }

    const synth = getSpeechSynthesis();
    const UtteranceClass = getSpeechSynthesisUtteranceClass();
    if (!synth || !UtteranceClass) {
      return false;
    }

    if (!this.activeVoice) {
      this.refreshVoices();
    }

    return new Promise<boolean>((resolve) => {
      try {
        this.cancel();

        const utterance = new UtteranceClass(text);
        utterance.lang = 'ja-JP';
        if (this.activeVoice) {
          utterance.voice = this.activeVoice;
        }
        utterance.rate = typeof rate === 'number' && !isNaN(rate) ? rate : 0.85;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;

        let settled = false;
        const handleEnd = () => {
          if (!settled) {
            settled = true;
            resolve(true);
          }
        };

        const handleError = () => {
          if (!settled) {
            settled = true;
            resolve(false);
          }
        };

        utterance.onend = handleEnd;
        utterance.onerror = handleError;

        if (typeof utterance.addEventListener === 'function') {
          utterance.addEventListener('end', handleEnd);
          utterance.addEventListener('error', handleError);
        }

        synth.speak(utterance);
      } catch {
        resolve(false);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Singleton & Standalone Driver Exports
// ---------------------------------------------------------------------------

export const speechSynthesizer = new SpeechSynthesizerImpl();

export function speakKanji(text: string, rate?: number): Promise<boolean> {
  return speechSynthesizer.speak(text, rate);
}

export function cancelSpeech(): void {
  speechSynthesizer.cancel();
}

export function isSpeechSupported(): boolean {
  return speechSynthesizer.isSupported();
}

export function setSpeechEnabled(enabled: boolean): void {
  speechSynthesizer.setEnabled(enabled);
}

export function isSpeechEnabled(): boolean {
  return speechSynthesizer.isEnabled();
}

export default speechSynthesizer;
