/**
 * Salon Mishima - LocalStorage Persistence Subsystem
 * File: src/srs/storageManager.ts
 */

import {
  PlayerProfile,
  STORAGE_KEY,
} from '../types/srs';
import {
  promoteCard,
  demoteCard,
  createInitialCard,
  recordConfusion,
} from './leitnerEngine';

export { STORAGE_KEY };

const MS_PER_DAY = 86_400_000;

function getLocalStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage != null) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage != null) {
    return (globalThis as any).localStorage;
  }
  return null;
}

/**
 * Returns today's calendar date string formatted as 'YYYY-MM-DD'.
 */
export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes calendar day difference between two 'YYYY-MM-DD' dates using UTC arithmetic.
 */
export function getCalendarDayDifference(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 999;
  const parts1 = dateStr1.split('-').map(Number);
  const parts2 = dateStr2.split('-').map(Number);
  if (parts1.length !== 3 || parts2.length !== 3 || parts1.some(isNaN) || parts2.some(isNaN)) {
    return 999;
  }
  const utc1 = Date.UTC(parts1[0], parts1[1] - 1, parts1[2]);
  const utc2 = Date.UTC(parts2[0], parts2[1] - 1, parts2[2]);
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Generates a clean default player profile.
 */
export function createDefaultProfile(overrides?: Partial<PlayerProfile>): PlayerProfile {
  return {
    version: 1,
    coins: 100,
    streak: 1,
    lastLoginDate: getTodayDateString(),
    cards: {},
    unlockedTiers: [1],
    completedStages: [],
    confusion: {},
    audioSettings: {
      muted: false,
      sfxVolume: 0.8,
      bgmVolume: 0.5,
    },
    settings: {
      isMuted: false,
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      voiceEnabled: true,
    },
    ...overrides,
  };
}

/**
 * Checks if a profile currently exists in LocalStorage.
 */
export function hasProfile(): boolean {
  const storage = getLocalStorage();
  if (!storage) return false;
  return storage.getItem(STORAGE_KEY) !== null;
}

/**
 * Resiliently loads the player profile from LocalStorage under key 'mishima-cafe/v1'.
 * Recovers safely from syntax corruption, non-object payloads, and partial legacy schemas.
 */
export function loadProfile(): PlayerProfile {
  const storage = getLocalStorage();
  if (!storage) {
    return createDefaultProfile();
  }

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultProfile();
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return createDefaultProfile();
    }

    const defaultProfile = createDefaultProfile();

    const merged: PlayerProfile = {
      version: 1,
      coins: typeof parsed.coins === 'number' && !isNaN(parsed.coins) ? parsed.coins : defaultProfile.coins,
      streak: typeof parsed.streak === 'number' && !isNaN(parsed.streak) ? parsed.streak : defaultProfile.streak,
      lastLoginDate:
        typeof parsed.lastLoginDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.lastLoginDate)
          ? parsed.lastLoginDate
          : defaultProfile.lastLoginDate,
      cards:
        typeof parsed.cards === 'object' && parsed.cards !== null && !Array.isArray(parsed.cards)
          ? parsed.cards
          : {},
      unlockedTiers:
        Array.isArray(parsed.unlockedTiers) && parsed.unlockedTiers.length > 0
          ? parsed.unlockedTiers
          : [1],
      completedStages:
        Array.isArray(parsed.completedStages)
          ? parsed.completedStages
          : [],
      confusion:
        typeof parsed.confusion === 'object' && parsed.confusion !== null && !Array.isArray(parsed.confusion)
          ? parsed.confusion
          : {},
      audioSettings: {
        muted:
          typeof parsed.audioSettings?.muted === 'boolean'
            ? parsed.audioSettings.muted
            : typeof parsed.settings?.isMuted === 'boolean'
              ? parsed.settings.isMuted
              : false,
        sfxVolume:
          typeof parsed.audioSettings?.sfxVolume === 'number'
            ? parsed.audioSettings.sfxVolume
            : typeof parsed.settings?.sfxVolume === 'number'
              ? parsed.settings.sfxVolume
              : 0.8,
        bgmVolume:
          typeof parsed.audioSettings?.bgmVolume === 'number'
            ? parsed.audioSettings.bgmVolume
            : typeof parsed.settings?.bgmVolume === 'number'
              ? parsed.settings.bgmVolume
              : 0.5,
      },
      settings: {
        isMuted:
          typeof parsed.settings?.isMuted === 'boolean'
            ? parsed.settings.isMuted
            : typeof parsed.audioSettings?.muted === 'boolean'
              ? parsed.audioSettings.muted
              : false,
        sfxVolume:
          typeof parsed.settings?.sfxVolume === 'number'
            ? parsed.settings.sfxVolume
            : typeof parsed.audioSettings?.sfxVolume === 'number'
              ? parsed.audioSettings.sfxVolume
              : 0.8,
        bgmVolume:
          typeof parsed.settings?.bgmVolume === 'number'
            ? parsed.settings.bgmVolume
            : typeof parsed.audioSettings?.bgmVolume === 'number'
              ? parsed.audioSettings.bgmVolume
              : 0.5,
        voiceEnabled:
          typeof parsed.settings?.voiceEnabled === 'boolean'
            ? parsed.settings.voiceEnabled
            : true,
      },
    };

    return merged;
  } catch {
    return createDefaultProfile();
  }
}

/**
 * Persists the player profile to LocalStorage under key 'mishima-cafe/v1'.
 * Catches QuotaExceededError and security exceptions gracefully without throwing.
 */
export function saveProfile(profile: PlayerProfile): void {
  try {
    const storage = getLocalStorage();
    if (!storage) return;

    // Ensure audioSettings and settings remain synchronized
    if (profile.audioSettings && profile.settings) {
      profile.settings.isMuted = profile.audioSettings.muted;
      profile.settings.sfxVolume = profile.audioSettings.sfxVolume;
      profile.settings.bgmVolume = profile.audioSettings.bgmVolume;
    } else if (profile.audioSettings && !profile.settings) {
      profile.settings = {
        isMuted: profile.audioSettings.muted,
        sfxVolume: profile.audioSettings.sfxVolume,
        bgmVolume: profile.audioSettings.bgmVolume,
        voiceEnabled: true,
      };
    } else if (!profile.audioSettings && profile.settings) {
      profile.audioSettings = {
        muted: !!profile.settings.isMuted,
        sfxVolume: profile.settings.sfxVolume ?? 0.8,
        bgmVolume: profile.settings.bgmVolume ?? 0.5,
      };
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('LocalStorage save failed gracefully:', err);
  }
}

/**
 * Records a review result for a kanji card and persists the updated profile.
 * - On success: promotes the card.
 * - On failure: demotes the card to Box 1 and logs confusion pair if mistakenOption is given.
 */
export function recordReviewResult(
  kanjiId: string,
  correct: boolean,
  mistakenOption?: string,
  now: number = Date.now()
): PlayerProfile {
  const profile = loadProfile();

  const existingCard = profile.cards[kanjiId] || createInitialCard(kanjiId);
  const updatedCard = correct
    ? promoteCard(existingCard, now)
    : demoteCard(existingCard, now);

  profile.cards[kanjiId] = updatedCard;

  if (!correct && mistakenOption && mistakenOption !== kanjiId) {
    profile.confusion = recordConfusion(profile.confusion || {}, kanjiId, mistakenOption);
  }

  saveProfile(profile);
  return profile;
}

/**
 * Updates daily login streak based on calendar day difference.
 * - Same day: maintains current streak.
 * - Consecutive day (diff === 1): increments streak by 1.
 * - Skipped day (diff > 1): resets streak to 1.
 */
export function recordDailyLogin(
  targetDateOrProfile?: string | PlayerProfile,
  optionalDate?: string
): PlayerProfile {
  let profile: PlayerProfile;
  let targetDate: string;

  if (typeof targetDateOrProfile === 'object' && targetDateOrProfile !== null) {
    profile = targetDateOrProfile;
    targetDate = optionalDate || getTodayDateString();
  } else if (typeof targetDateOrProfile === 'string') {
    profile = loadProfile();
    targetDate = targetDateOrProfile;
  } else {
    profile = loadProfile();
    targetDate = getTodayDateString();
  }

  const lastDate = profile.lastLoginDate;
  if (!lastDate) {
    profile.streak = 1;
  } else {
    const diffDays = getCalendarDayDifference(lastDate, targetDate);
    if (diffDays === 1) {
      profile.streak = (profile.streak || 0) + 1;
    } else if (diffDays > 1) {
      profile.streak = 1;
    }
  }

  profile.lastLoginDate = targetDate;
  saveProfile(profile);
  return profile;
}

/**
 * Resets storage profile for testing or profile wiping.
 */
export function clearProfile(): void {
  try {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore clear errors
  }
}
