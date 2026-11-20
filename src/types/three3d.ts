/**
 * Salon Mishima 3D - Shared WebGL / Three.js Scene & Actor Contracts
 * File: src/types/three3d.ts
 */

import type { CurriculumTierNumber } from './curriculum';
import type { BossBattleState, TaskMode } from './game';

/**
 * Camera framing modes for CameraRig3D:
 * - 'title': Sweeping cozy panoramic orbit of the Showa kissaten
 * - 'map': Elevated diorama overview
 * - 'counter': Ergonomic barista over-the-counter POV framing customer + 3D kanji blocks
 * - 'build': Slight focus tilt toward the 3D lacquer serving tray + compound slots
 * - 'rush': Energetic closer FOV for 25-second rush orders
 * - 'boss': Dramatic low-angle duel framing across the counter
 * - 'shop': Showcase pan across counter & wall 3D interior upgrades
 */
export type CameraMode3D =
  | 'title'
  | 'map'
  | 'counter'
  | 'build'
  | 'rush'
  | 'boss'
  | 'shop';

/**
 * Procedural animation states for 3D Mishima literary cafe patrons.
 */
export type CustomerAnimState =
  | 'entering'
  | 'idle'
  | 'impatient'
  | 'happy'
  | 'angry'
  | 'leaving';

/**
 * Canonical 8 literary patron IDs (note: 'kageyama' and 'asako' both refer to 影山朝子).
 */
export type CustomerActorId =
  | 'uiko'
  | 'kashiwagi'
  | 'mizoguchi'
  | 'shinji'
  | 'hatsue'
  | 'kiyoaki'
  | 'honda'
  | 'kageyama'
  | 'asako';

/**
 * Lightweight customer descriptor passed to the 3D stage.
 */
export interface ActiveCustomer3D {
  id?: string;
  name: string;
  avatar: string;
  work?: string;
  role?: string;
}

/**
 * Interactive 3D Kanji / Kana block rendered on the cafe counter or serving tray.
 */
export interface KanjiBlock3DItem {
  /** Stable identifier per option slot (e.g. 'block-0-金') */
  id: string;
  /** Primary glyph or reading painted onto the high-DPI ivory block face */
  label: string;
  /** Optional secondary badge/hint (e.g. '[1]' or furigana/huneum cue) */
  sublabel?: string;
  /** True when placed into a build tray slot or currently active */
  isSelected: boolean;
  /** Triggers emerald/gold celebratory flash & serve slide */
  isCorrectFlash: boolean;
  /** Triggers vermilion wobble-recoil on mistake */
  isWrongFlash: boolean;
  /** >= 0 when seated in a serving tray slot, -1 when on the counter rail */
  slotIndex: number;
}

/**
 * Unlockable 3D cafe interior & gameplay buff upgrades.
 */
export type CafeUpgradeId =
  | 'siphon'
  | 'kinkaku'
  | 'velvet'
  | 'gramophone'
  | 'bookshelf'
  | 'wagashi';

/**
 * Pooled 3D particle effect categories.
 */
export type ParticleBurstKind =
  | 'coin'
  | 'sakura'
  | 'angry'
  | 'slash'
  | 'fever';

/**
 * Monotonically keyed particle burst trigger passed from game state into SalonCanvas3D.
 */
export interface ParticleBurstEvent {
  /** Unique trigger ID so repeated bursts of the same kind reliably fire */
  id: string | number;
  kind: ParticleBurstKind;
  /** Optional world-space [x, y, z] origin override */
  origin?: [number, number, number];
}

/**
 * Render quality preset for DPR cap, shadow map resolution, and particle density.
 */
export type QualityLevel3D = 'low' | 'medium' | 'high';

/**
 * Projected 2D viewport coordinates for anchoring crisp HTML speech bubbles above 3D actors.
 */
export interface SpeechBubbleAnchor2D {
  /** Pixel X relative to the canvas container */
  x: number;
  /** Pixel Y relative to the canvas container */
  y: number;
  /** Normalized X in [0..1] across viewport width */
  nx: number;
  /** Normalized Y in [0..1] across viewport height */
  ny: number;
  /** True when the 3D head anchor is in front of the camera */
  visible: boolean;
}

/**
 * Props contract for the persistent full-viewport `<SalonCanvas3D />` component.
 */
export interface SalonCanvas3DProps {
  mode: CameraMode3D;
  tier: CurriculumTierNumber;
  activeCustomer: ActiveCustomer3D | null;
  customerAnim: CustomerAnimState;
  /** Remaining customer patience normalized to [0..1] (1 = full calm, < 0.35 = impatient) */
  patienceRatio: number;
  blocks: KanjiBlock3DItem[];
  /** Invoked when a player clicks/taps a 3D block directly in WebGL (or fallback DOM) */
  onBlockPick: (label: string, index: number) => void;
  traySlots: (string | null)[];
  targetWordLength: number;
  bossState: BossBattleState | null;
  rushActive: boolean;
  feverActive: boolean;
  unlockedUpgrades: CafeUpgradeId[];
  particleEvent: ParticleBurstEvent | null;
  qualityLevel: QualityLevel3D;
  /** Optional callback receiving projected 2D screen coords for the customer's speech bubble */
  onAnchorUpdate?: (anchor: SpeechBubbleAnchor2D) => void;
  /** Optional active task mode ('pick' | 'recall' | 'build') for block/tray choreography */
  taskMode?: TaskMode;
  /** Optional chalkboard header text (e.g. current stage title in Korean/Japanese) */
  chalkboardTitle?: string;
  /** Optional chalkboard subtitle (e.g. '오늘의 새 한자 5개') */
  chalkboardSubtitle?: string;
}

/**
 * Resolves any customer name, avatar string, or ActiveCustomer3D object to a canonical actor ID.
 */
export function resolveCustomerActorId(
  customer: ActiveCustomer3D | string | null | undefined
): CustomerActorId {
  if (!customer) return 'mizoguchi';
  const raw =
    typeof customer === 'string'
      ? customer.toLowerCase()
      : `${customer.id ?? ''} ${customer.avatar ?? ''} ${customer.name ?? ''}`.toLowerCase();

  if (raw.includes('uiko') || raw.includes('有為子')) return 'uiko';
  if (raw.includes('kashiwagi') || raw.includes('柏木')) return 'kashiwagi';
  if (raw.includes('mizoguchi') || raw.includes('溝口')) return 'mizoguchi';
  if (raw.includes('shinji') || raw.includes('新治')) return 'shinji';
  if (raw.includes('hatsue') || raw.includes('初江')) return 'hatsue';
  if (raw.includes('kiyoaki') || raw.includes('清顕')) return 'kiyoaki';
  if (raw.includes('honda') || raw.includes('本多')) return 'honda';
  if (raw.includes('asako') || raw.includes('kageyama') || raw.includes('朝子')) {
    return 'kageyama';
  }
  return 'mizoguchi';
}
