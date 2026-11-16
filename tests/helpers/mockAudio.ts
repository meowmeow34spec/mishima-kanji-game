/**
 * Salon Mishima - Web Audio API Test Helper & Assertions
 * File: tests/helpers/mockAudio.ts
 */

import { expect } from 'vitest';
import {
  activeAudioContexts,
  activeOscillators,
  activeGains,
  MockAudioContext,
  MockOscillatorNode,
  MockGainNode,
} from '../setup';

export function getAudioContextInstances(): MockAudioContext[] {
  return activeAudioContexts;
}

export function getCreatedOscillators(): MockOscillatorNode[] {
  return activeOscillators;
}

export function getCreatedGains(): MockGainNode[] {
  return activeGains;
}

export function getLastCreatedOscillator(): MockOscillatorNode | undefined {
  return activeOscillators[activeOscillators.length - 1];
}

export function getLastCreatedGain(): MockGainNode | undefined {
  return activeGains[activeGains.length - 1];
}

export function resetAudioMocks(): void {
  activeAudioContexts.length = 0;
  activeOscillators.length = 0;
  activeGains.length = 0;
}

export function assertSoundDispatched(): void {
  expect(activeOscillators.length).toBeGreaterThan(0);
  const lastOsc = getLastCreatedOscillator();
  expect(lastOsc).toBeDefined();
  expect(lastOsc?.start).toHaveBeenCalled();
}

export function assertAudioMuted(initialOscCount: number = 0): void {
  expect(activeOscillators.length).toBe(initialOscCount);
}
