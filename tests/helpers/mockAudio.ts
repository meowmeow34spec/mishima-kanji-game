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

export function getLastCreatedGainValue(): number | undefined {
  const gainNode = getLastCreatedGain();
  return gainNode?.gain.value;
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

export function assertGainRamped(gain: MockGainNode, targetValue: number): void {
  const isScheduled =
    gain.gain.linearRampToValueAtTime.mock.calls.some((args) => args[0] === targetValue) ||
    gain.gain.exponentialRampToValueAtTime.mock.calls.some((args) => args[0] === targetValue);
  expect(isScheduled).toBe(true);
}

/**
 * Asserts that a BGM track is actively playing by checking that an oscillator
 * was created, started, and has not yet been stopped.
 */
export function assertBgmPlaying(): MockOscillatorNode {
  const oscs = getCreatedOscillators();
  expect(oscs.length).toBeGreaterThan(0);
  const lastOsc = oscs[oscs.length - 1];
  expect(lastOsc).toBeDefined();
  expect(lastOsc.start).toHaveBeenCalled();
  expect(lastOsc.stop).not.toHaveBeenCalled();
  return lastOsc;
}

/**
 * Asserts that the currently active BGM oscillator was stopped.
 */
export function assertBgmStopped(osc?: MockOscillatorNode): void {
  const targetOsc = osc || getLastCreatedOscillator();
  expect(targetOsc).toBeDefined();
  expect(targetOsc?.stop).toHaveBeenCalled();
}
