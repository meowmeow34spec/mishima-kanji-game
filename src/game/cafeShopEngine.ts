/**
 * Salon Mishima 3D - Cafe Interior Upgrade Shop & Gameplay Buff Engine
 * File: src/game/cafeShopEngine.ts
 */

import type { CafeUpgradeId } from '../types/three3d';
import type { PlayerProfile } from '../types/srs';
import { loadProfile, saveProfile } from '../srs/storageManager';

export type { CafeUpgradeId };

export const BASE_CUSTOMER_PATIENCE_SECONDS = 20.0;
export const VELVET_PATIENCE_BONUS_SECONDS = 5.0;
export const BASE_MAX_HEARTS = 3;
export const WAGASHI_BONUS_HEARTS = 1;
export const BASE_FEVER_COMBO_THRESHOLD = 5;
export const GRAMOPHONE_FEVER_COMBO_THRESHOLD = 4;
export const FEVER_COIN_MULTIPLIER = 2.0;
export const SIPHON_TIP_MULTIPLIER = 1.25;
export const FAST_SERVE_THRESHOLD_SECONDS = 5.0;
export const FAST_SERVE_SPEED_TIP_COINS = 10;

export const CAFE_UPGRADE_IDS: readonly CafeUpgradeId[] = [
  'siphon',
  'velvet',
  'kinkaku',
  'gramophone',
  'bookshelf',
  'wagashi',
] as const;

export interface CafeUpgradeDefinition {
  id: CafeUpgradeId;
  /** Korean primary display title */
  name: string;
  nameKo: string;
  nameJa: string;
  /** Coin cost in 銭 */
  cost: number;
  /** Alias of cost for UI/test ergonomics */
  price: number;
  icon: string;
  /** Korean description combining 3D cafe visual & gameplay perk */
  description: string;
  descriptionKo: string;
  /** Short Korean gameplay buff badge text */
  effectKo: string;
  /** Short Korean 3D visual prop summary */
  visualKo: string;
}

export const CAFE_UPGRADES: readonly CafeUpgradeDefinition[] = [
  {
    id: 'siphon',
    name: '황금 사이폰 추출기',
    nameKo: '황금 사이폰 추출기',
    nameJa: '黄金サイフォン抽出器',
    cost: 150,
    price: 150,
    icon: '☕',
    description:
      '카운터 위에 보글거리는 황금 유리 사이폰 추출기를 설치합니다. 모든 주문 완료 시 코인 팁 보상이 +25% 증가합니다!',
    descriptionKo:
      '카운터 위에 보글거리는 황금 유리 사이폰 추출기를 설치합니다. 모든 주문 완료 시 코인 팁 보상이 +25% 증가합니다!',
    effectKo: '모든 주문 코인 보상 +25%',
    visualKo: '카운터 위 황금빛 사이폰 커피 추출기 배치',
  },
  {
    id: 'velvet',
    name: '벨벳 카운터 좌석',
    nameKo: '벨벳 카운터 좌석',
    nameJa: '深紅ベルベット座席',
    cost: 250,
    price: 250,
    icon: '🛋️',
    description:
      '푹신한 진홍빛 벨벳 카운터 스툴을 놓아 손님이 더욱 여유롭게 기다립니다. 손님 인내심 타이머가 +5초 늘어납니다!',
    descriptionKo:
      '푹신한 진홍빛 벨벳 카운터 스툴을 놓아 손님이 더욱 여유롭게 기다립니다. 손님 인내심 타이머가 +5초 늘어납니다!',
    effectKo: '손님 인내심 타이머 +5초 여유',
    visualKo: '카운터 앞 고급 진홍색 벨벳 좌석 배치',
  },
  {
    id: 'kinkaku',
    name: '금각사 봉황 장식',
    nameKo: '금각사 봉황 장식',
    nameJa: '金閣寺の鳳凰飾り',
    cost: 350,
    price: 350,
    icon: '🏯',
    description:
      '카운터 모서리에 찬란한 금각사 봉황 조각상을 장식합니다. 스테이지마다 첫 실수 1회를 막아 하트와 콤보를 지켜줍니다!',
    descriptionKo:
      '카운터 모서리에 찬란한 금각사 봉황 조각상을 장식합니다. 스테이지마다 첫 실수 1회를 막아 하트와 콤보를 지켜줍니다!',
    effectKo: '스테이지당 실수 방어막 1회 (하트·콤보 보호)',
    visualKo: '카운터 코너 황금 봉황 미니어처 장식 추가',
  },
  {
    id: 'gramophone',
    name: '쇼와 재즈 축음기',
    nameKo: '쇼와 재즈 축음기',
    nameJa: '昭和ジャズ蓄音機',
    cost: 450,
    price: 450,
    icon: '🎺',
    description:
      '황동 나팔관 빈티지 축음기에서 경쾌한 재즈가 울려 퍼집니다. 피버 타임이 5콤보 대신 4콤보에 발동하며 코인을 2배로 획득합니다!',
    descriptionKo:
      '황동 나팔관 빈티지 축음기에서 경쾌한 재즈가 울려 퍼집니다. 피버 타임이 5콤보 대신 4콤보에 발동하며 코인을 2배로 획득합니다!',
    effectKo: '4콤보부터 피버 타임 발동 & 코인 2배',
    visualKo: '황동 나팔관 축음기와 회전하는 LP 레코드 추가',
  },
  {
    id: 'bookshelf',
    name: '미시마 초판본 서가',
    nameKo: '미시마 초판본 서가',
    nameJa: '三島初版本の本棚',
    cost: 600,
    price: 600,
    icon: '📚',
    description:
      '살롱 벽면에 은은한 조명이 비추는 미시마 유키오 초판본 서가를 설치합니다. 5초 이내 빠른 서빙 시 라이트너 암기 상자가 +1 추가 승급됩니다!',
    descriptionKo:
      '살롱 벽면에 은은한 조명이 비추는 미시마 유키오 초판본 서가를 설치합니다. 5초 이내 빠른 서빙 시 라이트너 암기 상자가 +1 추가 승급됩니다!',
    effectKo: '5초 이내 쾌속 서빙 시 암기 상자 +1 추가 승급',
    visualKo: '벽면 조명 미시마 문학 초판본 원목 서가 설치',
  },
  {
    id: 'wagashi',
    name: '특선 화과자 진열장',
    nameKo: '특선 화과자 진열장',
    nameJa: '特選和菓子ショーケース',
    cost: 800,
    price: 800,
    icon: '🍡',
    description:
      '사계절 전통 화과자가 빛나는 3단 유리 진열장을 들입니다. 최대 하트가 +1 증가하여 모든 스테이지와 보스전을 하트 4개로 시작합니다!',
    descriptionKo:
      '사계절 전통 화과자가 빛나는 3단 유리 진열장을 들입니다. 최대 하트가 +1 증가하여 모든 스테이지와 보스전을 하트 4개로 시작합니다!',
    effectKo: '최대 하트 +1 (스테이지·보스전 4하트 시작)',
    visualKo: '카운터 3단 특선 화과자 유리 진열장 배치',
  },
] as const;

export const SHOP_UPGRADES = CAFE_UPGRADES;

export const CAFE_UPGRADE_MAP: Record<CafeUpgradeId, CafeUpgradeDefinition> = {
  siphon: CAFE_UPGRADES[0],
  velvet: CAFE_UPGRADES[1],
  kinkaku: CAFE_UPGRADES[2],
  gramophone: CAFE_UPGRADES[3],
  bookshelf: CAFE_UPGRADES[4],
  wagashi: CAFE_UPGRADES[5],
};

export interface CafeGameplayBuffs {
  unlockedUpgrades: CafeUpgradeId[];
  tipMultiplier: number;
  patienceBonusSeconds: number;
  maxPatienceSeconds: number;
  stageShieldCount: number;
  feverComboThreshold: number;
  feverCoinMultiplier: number;
  fastServeSrsBoost: number;
  maxHearts: number;
  bonusHearts: number;
}

export interface PurchaseUpgradeResult {
  success: boolean;
  profile: PlayerProfile;
  upgrade?: CafeUpgradeDefinition;
  cost: number;
  remainingCoins: number;
  unlockedUpgrades: CafeUpgradeId[];
  reason?: 'invalid_upgrade' | 'already_owned' | 'insufficient_coins';
  error?: string;
}

export interface OrderPayoutBreakdown {
  totalCoins: number;
  baseCoins: number;
  speedTipCoins: number;
  siphonBonusCoins: number;
  feverBonusCoins: number;
  isFastServe: boolean;
  feverApplied: boolean;
  tipLabelKo: string | null;
}

/**
 * Returns all 6 cafe interior upgrades in shop display order.
 */
export function getAllCafeUpgrades(): CafeUpgradeDefinition[] {
  return [...CAFE_UPGRADES];
}

export const getCafeUpgrades = getAllCafeUpgrades;

/**
 * Type guard checking whether a string is one of the 6 canonical CafeUpgradeIds.
 */
export function isValidCafeUpgradeId(id: unknown): id is CafeUpgradeId {
  return typeof id === 'string' && (CAFE_UPGRADE_IDS as readonly string[]).includes(id);
}

/**
 * Looks up a cafe upgrade definition by ID.
 */
export function getCafeUpgradeById(id: string): CafeUpgradeDefinition | undefined {
  if (!isValidCafeUpgradeId(id)) return undefined;
  return CAFE_UPGRADE_MAP[id];
}

/**
 * Normalizes an arbitrary string array into deduplicated valid CafeUpgradeIds.
 */
export function normalizeUnlockedUpgrades(
  profileOrUpgrades?: PlayerProfile | readonly string[] | null
): CafeUpgradeId[] {
  const rawList = Array.isArray(profileOrUpgrades)
    ? profileOrUpgrades
    : profileOrUpgrades && typeof profileOrUpgrades === 'object'
      ? (profileOrUpgrades as PlayerProfile).unlockedUpgrades || []
      : [];

  const seen = new Set<CafeUpgradeId>();
  const result: CafeUpgradeId[] = [];
  for (const id of rawList) {
    if (isValidCafeUpgradeId(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

/**
 * Returns true if the player has unlocked the specified upgrade.
 */
export function hasCafeUpgrade(
  profileOrUpgrades: PlayerProfile | readonly string[] | null | undefined,
  upgradeId: CafeUpgradeId
): boolean {
  return normalizeUnlockedUpgrades(profileOrUpgrades).includes(upgradeId);
}

export const isUpgradeUnlocked = hasCafeUpgrade;

/**
 * Checks whether the player can currently purchase the target upgrade
 * (valid upgrade, not yet owned, and enough coins).
 */
export function canAffordCafeUpgrade(
  profileOrCoins: PlayerProfile | number,
  upgradeId: CafeUpgradeId | string,
  unlockedUpgrades?: readonly string[]
): boolean {
  const upgrade = getCafeUpgradeById(upgradeId);
  if (!upgrade) return false;

  const coins =
    typeof profileOrCoins === 'number'
      ? profileOrCoins
      : typeof profileOrCoins?.coins === 'number'
        ? profileOrCoins.coins
        : 0;

  const owned =
    typeof profileOrCoins === 'object' && profileOrCoins !== null
      ? normalizeUnlockedUpgrades(profileOrCoins)
      : normalizeUnlockedUpgrades(unlockedUpgrades);

  if (owned.includes(upgrade.id)) return false;
  return coins >= upgrade.cost;
}

/**
 * Computes aggregated gameplay buffs from the player's unlocked cafe upgrades.
 */
export function getCafeGameplayBuffs(
  profileOrUpgrades?: PlayerProfile | readonly string[] | null
): CafeGameplayBuffs {
  const unlocked = normalizeUnlockedUpgrades(profileOrUpgrades);
  const hasSiphon = unlocked.includes('siphon');
  const hasVelvet = unlocked.includes('velvet');
  const hasKinkaku = unlocked.includes('kinkaku');
  const hasGramophone = unlocked.includes('gramophone');
  const hasBookshelf = unlocked.includes('bookshelf');
  const hasWagashi = unlocked.includes('wagashi');

  const patienceBonusSeconds = hasVelvet ? VELVET_PATIENCE_BONUS_SECONDS : 0;
  const bonusHearts = hasWagashi ? WAGASHI_BONUS_HEARTS : 0;

  return {
    unlockedUpgrades: unlocked,
    tipMultiplier: hasSiphon ? SIPHON_TIP_MULTIPLIER : 1.0,
    patienceBonusSeconds,
    maxPatienceSeconds: BASE_CUSTOMER_PATIENCE_SECONDS + patienceBonusSeconds,
    stageShieldCount: hasKinkaku ? 1 : 0,
    feverComboThreshold: hasGramophone
      ? GRAMOPHONE_FEVER_COMBO_THRESHOLD
      : BASE_FEVER_COMBO_THRESHOLD,
    feverCoinMultiplier: FEVER_COIN_MULTIPLIER,
    fastServeSrsBoost: hasBookshelf ? 1 : 0,
    maxHearts: BASE_MAX_HEARTS + bonusHearts,
    bonusHearts,
  };
}

export const computeCafeBuffs = getCafeGameplayBuffs;

/**
 * Purchases a 3D cafe upgrade, deducting coins, unlocking the prop/perk, and persisting to LocalStorage.
 * Supports both `(upgradeId, profile?)` and `(profile, upgradeId)` call signatures.
 */
export function purchaseCafeUpgrade(
  upgradeId: CafeUpgradeId | string,
  currentProfile?: PlayerProfile
): PurchaseUpgradeResult;
export function purchaseCafeUpgrade(
  currentProfile: PlayerProfile,
  upgradeId: CafeUpgradeId | string
): PurchaseUpgradeResult;
export function purchaseCafeUpgrade(
  arg1: CafeUpgradeId | string | PlayerProfile,
  arg2?: PlayerProfile | CafeUpgradeId | string
): PurchaseUpgradeResult {
  let targetId: string;
  let sourceProfile: PlayerProfile;

  if (typeof arg1 === 'string') {
    targetId = arg1;
    sourceProfile =
      arg2 && typeof arg2 === 'object' ? (arg2 as PlayerProfile) : loadProfile();
  } else {
    sourceProfile = arg1 || loadProfile();
    targetId = typeof arg2 === 'string' ? arg2 : '';
  }

  const currentOwned = normalizeUnlockedUpgrades(sourceProfile);
  const currentCoins = typeof sourceProfile.coins === 'number' ? sourceProfile.coins : 0;

  const upgrade = getCafeUpgradeById(targetId);
  if (!upgrade) {
    const unchanged: PlayerProfile = {
      ...sourceProfile,
      unlockedUpgrades: [...currentOwned],
    };
    return {
      success: false,
      profile: unchanged,
      cost: 0,
      remainingCoins: currentCoins,
      unlockedUpgrades: currentOwned,
      reason: 'invalid_upgrade',
      error: `존재하지 않는 카페 업그레이드입니다: ${String(targetId)}`,
    };
  }

  if (currentOwned.includes(upgrade.id)) {
    const unchanged: PlayerProfile = {
      ...sourceProfile,
      unlockedUpgrades: [...currentOwned],
    };
    return {
      success: false,
      profile: unchanged,
      upgrade,
      cost: upgrade.cost,
      remainingCoins: currentCoins,
      unlockedUpgrades: currentOwned,
      reason: 'already_owned',
      error: `이미 보유 중인 인테리어입니다: ${upgrade.nameKo}`,
    };
  }

  if (currentCoins < upgrade.cost) {
    const unchanged: PlayerProfile = {
      ...sourceProfile,
      unlockedUpgrades: [...currentOwned],
    };
    return {
      success: false,
      profile: unchanged,
      upgrade,
      cost: upgrade.cost,
      remainingCoins: currentCoins,
      unlockedUpgrades: currentOwned,
      reason: 'insufficient_coins',
      error: `엽전(銭)이 부족합니다! 필요: ${upgrade.cost} 銭 / 보유: ${currentCoins} 銭`,
    };
  }

  const nextUnlocked: CafeUpgradeId[] = [...currentOwned, upgrade.id];
  const updatedProfile: PlayerProfile = {
    ...sourceProfile,
    coins: currentCoins - upgrade.cost,
    unlockedUpgrades: nextUnlocked,
  };

  saveProfile(updatedProfile);

  return {
    success: true,
    profile: updatedProfile,
    upgrade,
    cost: upgrade.cost,
    remainingCoins: updatedProfile.coins,
    unlockedUpgrades: nextUnlocked,
  };
}

export const purchaseUpgrade = purchaseCafeUpgrade;
export const buyCafeUpgrade = purchaseCafeUpgrade;
export const buyUpgrade = purchaseCafeUpgrade;

/**
 * Calculates coin payout for an order incorporating speed tip bonus, siphon +25% tip perk, and 2x Fever multiplier.
 */
export function calculateOrderCoinPayout(params: {
  baseCoins: number;
  unlockedUpgrades?: readonly string[] | PlayerProfile | null;
  feverActive?: boolean;
  elapsedSeconds?: number;
  awardSpeedTip?: boolean;
}): OrderPayoutBreakdown {
  const {
    baseCoins,
    unlockedUpgrades,
    feverActive = false,
    elapsedSeconds = 0,
    awardSpeedTip = true,
  } = params;

  if (baseCoins <= 0) {
    return {
      totalCoins: 0,
      baseCoins: 0,
      speedTipCoins: 0,
      siphonBonusCoins: 0,
      feverBonusCoins: 0,
      isFastServe: false,
      feverApplied: false,
      tipLabelKo: null,
    };
  }

  const buffs = getCafeGameplayBuffs(unlockedUpgrades);
  const isFastServe =
    awardSpeedTip &&
    Number.isFinite(elapsedSeconds) &&
    elapsedSeconds >= 0 &&
    elapsedSeconds <= FAST_SERVE_THRESHOLD_SECONDS;

  const speedTipCoins = isFastServe ? FAST_SERVE_SPEED_TIP_COINS : 0;
  const subtotal = baseCoins + speedTipCoins;
  const afterSiphon = Math.round(subtotal * buffs.tipMultiplier);
  const siphonBonusCoins = Math.max(0, afterSiphon - subtotal);

  const finalTotal = feverActive
    ? Math.round(afterSiphon * buffs.feverCoinMultiplier)
    : afterSiphon;
  const feverBonusCoins = Math.max(0, finalTotal - afterSiphon);

  let tipLabelKo: string | null = null;
  if (feverActive && isFastServe) {
    tipLabelKo = '🔥 피버 2배 + ⚡ 빠른 서빙 팁!';
  } else if (feverActive) {
    tipLabelKo = '🔥 쇼와 재즈 피버 타임 2배 보너스!';
  } else if (isFastServe) {
    tipLabelKo = `⚡ 빠른 서빙 팁! (+${speedTipCoins + siphonBonusCoins} 銭)`;
  } else if (siphonBonusCoins > 0) {
    tipLabelKo = `☕ 사이폰 향미 팁! (+${siphonBonusCoins} 銭)`;
  }

  return {
    totalCoins: finalTotal,
    baseCoins,
    speedTipCoins,
    siphonBonusCoins,
    feverBonusCoins,
    isFastServe,
    feverApplied: feverActive,
    tipLabelKo,
  };
}
