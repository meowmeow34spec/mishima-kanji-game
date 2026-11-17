/**
 * Salon Mishima - Web Speech API Test Helper & Assertions
 * File: tests/helpers/mockSpeech.ts
 */

import { expect } from 'vitest';
import {
  spokenUtterances,
  mockSpeechSynthesis,
  MockSpeechSynthesisUtterance,
  getActiveUtterance,
} from '../setup';

export function getSpokenUtterances(): MockSpeechSynthesisUtterance[] {
  return spokenUtterances;
}

export function getLastSpokenUtterance(): MockSpeechSynthesisUtterance | undefined {
  return spokenUtterances[spokenUtterances.length - 1];
}

export function getLastSpokenText(): string | undefined {
  const last = getLastSpokenUtterance();
  return last?.text;
}

export function getActiveUtteranceInstance(): MockSpeechSynthesisUtterance | null {
  return getActiveUtterance();
}

export function assertSpoken(expectedText: string, expectedLang: string = 'ja-JP'): void {
  expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  const match = spokenUtterances.find(
    (u) => u.text === expectedText && (!expectedLang || u.lang === expectedLang)
  );
  expect(match).toBeDefined();
  expect(match?.text).toBe(expectedText);
  if (expectedLang) {
    expect(match?.lang).toBe(expectedLang);
  }
}

export function assertSpeechCancelled(): void {
  expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  expect(mockSpeechSynthesis.speaking).toBe(false);
  expect(getActiveUtterance()).toBeNull();
}

export function assertSpeechActive(): void {
  expect(mockSpeechSynthesis.speaking).toBe(true);
}

export function assertSpeechPaused(): void {
  expect(mockSpeechSynthesis.paused).toBe(true);
}

export function resetSpeechMocks(): void {
  spokenUtterances.length = 0;
  mockSpeechSynthesis.cancel();
}
