/**
 * Salon Mishima - LocalStorage Test Helper & Corruption Utilities
 * File: tests/helpers/mockStorage.ts
 */

import { PlayerProfile } from './contracts';
import { setSimulateQuotaError } from '../setup';

export const STORAGE_KEY = 'mishima-cafe/v1';

export function getStoredRaw(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function getStoredProfile(): PlayerProfile | null {
  const raw = getStoredRaw();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return null;
  }
}

export function setStoredProfile(profile: PlayerProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function corruptStorage(corruptStr: string): void {
  localStorage.setItem(STORAGE_KEY, corruptStr);
}

export function simulateQuotaExceeded(shouldThrow: boolean = true): void {
  setSimulateQuotaError(shouldThrow);
}

export function clearStorage(): void {
  localStorage.clear();
}

export function createDefaultTestProfile(
  overrides?: Partial<PlayerProfile>
): PlayerProfile {
  return {
    coins: 100,
    streak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    cards: {},
    unlockedTiers: [1],
    completedStages: [],
    confusion: {},
    settings: {
      isMuted: false,
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      voiceEnabled: true,
    },
    ...overrides,
  };
}
