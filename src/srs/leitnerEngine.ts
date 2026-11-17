/**
 * Salon Mishima - 7-Box Leitner Spaced Repetition Engine
 * File: src/srs/leitnerEngine.ts
 */

import {
  CardProgress,
  ConfusionMatrix,
  LEITNER_INTERVALS_DAYS,
} from '../types/srs';
import { MISHIMA_KANJI_CURRICULUM } from '../data/mishimaCurriculum';

export { LEITNER_INTERVALS_DAYS };

const MS_PER_DAY = 86_400_000;
const MAX_LEITNER_BOX = 6;

/**
 * Creates an unreviewed initial CardProgress object (Box 0, nextDue 0).
 */
export function createInitialCard(id: string): CardProgress {
  return {
    id,
    box: 0,
    nextDue: 0,
    totalReviews: 0,
    correctReviews: 0,
    lastReviewed: 0,
  };
}

/**
 * Promotes a card on successful review.
 * - Increments box up to Box 6.
 * - Sets nextDue to now + intervalDays * 86,400,000 ms.
 * - Increments totalReviews and correctReviews.
 */
export function promoteCard(card: CardProgress, now: number = Date.now()): CardProgress {
  const currentBox = typeof card.box === 'number' ? card.box : 0;
  const newBox = Math.min(MAX_LEITNER_BOX, currentBox + 1);
  const intervalDays = LEITNER_INTERVALS_DAYS[newBox] ?? 30;

  return {
    ...card,
    box: newBox,
    nextDue: now + intervalDays * MS_PER_DAY,
    totalReviews: (card.totalReviews || 0) + 1,
    correctReviews: (card.correctReviews || 0) + 1,
    lastReviewed: now,
  };
}

/**
 * Demotes a card on failed review.
 * - Resets box to Box 1 for next-day review.
 * - Sets nextDue to now + 1 * 86,400,000 ms.
 * - Increments totalReviews, retains correctReviews.
 */
export function demoteCard(card: CardProgress, now: number = Date.now()): CardProgress {
  return {
    ...card,
    box: 1,
    nextDue: now + 1 * MS_PER_DAY,
    totalReviews: (card.totalReviews || 0) + 1,
    correctReviews: card.correctReviews || 0,
    lastReviewed: now,
  };
}

/**
 * Filters and returns all cards with box > 0 where nextDue <= now.
 * Sorted primarily by box ascending (Box 1 before Box 2), secondarily by nextDue ascending.
 */
export function getDueKanji(
  cards: Record<string, CardProgress> | CardProgress[],
  now: number = Date.now()
): CardProgress[] {
  const list = Array.isArray(cards) ? cards : Object.values(cards);
  return list
    .filter((card) => card && card.box > 0 && card.nextDue <= now)
    .sort((a, b) => a.box - b.box || a.nextDue - b.nextDue);
}

/**
 * Computes weakness / urgency score for a card.
 * Higher score indicates greater weakness and priority for review.
 * Formula considers:
 * - Error rate: (total - correct) / total
 * - Box penalty: (6 - box) * 2
 * - Days overdue bonus: if due, 3 + min(daysOverdue, 7)
 */
export function calculateWeaknessScore(
  card: CardProgress,
  now: number = Date.now()
): number {
  if (!card) return 0;
  const total = Math.max(1, card.totalReviews || 0);
  const errors = Math.max(0, (card.totalReviews || 0) - (card.correctReviews || 0));
  const errorRate = errors / total;

  const currentBox = typeof card.box === 'number' ? card.box : 0;
  const boxPenalty = Math.max(0, MAX_LEITNER_BOX - currentBox) * 2;

  const isOverdue = currentBox > 0 && card.nextDue <= now;
  const daysOverdue = isOverdue ? Math.max(0, (now - card.nextDue) / MS_PER_DAY) : 0;
  const overdueBonus = isOverdue ? 3 + Math.min(daysOverdue, 7) : 0;

  return errorRate * 10 + boxPenalty + overdueBonus;
}

/**
 * Retrieves the weakest kanji cards sorted descending by weakness score.
 */
export function getWeakestKanji(
  cards: Record<string, CardProgress> | CardProgress[],
  limit: number = 10,
  now: number = Date.now()
): CardProgress[] {
  const list = Array.isArray(cards) ? cards : Object.values(cards);
  return [...list]
    .filter((card) => card && (card.box > 0 || card.totalReviews > 0))
    .sort((a, b) => calculateWeaknessScore(b, now) - calculateWeaknessScore(a, now))
    .slice(0, limit);
}

/**
 * Immutably logs a confusion entry between targetId and mistakeId.
 * Prevents recording confusion if targetId and mistakeId are identical or format/character equivalent.
 */
export function recordConfusion(
  confusion: ConfusionMatrix,
  targetId: string,
  mistakeId: string
): ConfusionMatrix {
  if (!targetId || !mistakeId || targetId === mistakeId) {
    return confusion;
  }

  // Check if target and mistake refer to the same kanji (ID vs character equivalence)
  const targetEntry = MISHIMA_KANJI_CURRICULUM.find(
    (k) => k.id === targetId || k.character === targetId
  );
  const mistakeEntry = MISHIMA_KANJI_CURRICULUM.find(
    (k) => k.id === mistakeId || k.character === mistakeId
  );

  const targetChar = targetEntry ? targetEntry.character : targetId;
  const mistakeChar = mistakeEntry ? mistakeEntry.character : mistakeId;
  const resolvedTargetId = targetEntry ? targetEntry.id : targetId;
  const resolvedMistakeId = mistakeEntry ? mistakeEntry.id : mistakeId;

  if (
    targetChar === mistakeChar ||
    resolvedTargetId === resolvedMistakeId ||
    targetId === mistakeChar ||
    mistakeId === targetChar
  ) {
    return confusion;
  }

  const next: ConfusionMatrix = { ...confusion };
  const targetMap = { ...(next[targetId] || {}) };
  targetMap[mistakeId] = (targetMap[mistakeId] || 0) + 1;
  next[targetId] = targetMap;
  return next;
}

/**
 * Generates distractors prioritizing historically confused options.
 * @param targetKanji Target kanji identifier string or entry object
 * @param pool Candidate pool of kanji entry objects or strings
 * @param count Desired number of distractors (default 3)
 * @param confusionMatrix Current confusion matrix
 */
export function getDistractors<T extends string | { id: string; character?: string; tier?: number }>(
  targetKanji: string | { id: string; character?: string; tier?: number },
  pool: T[],
  count: number = 3,
  confusionMatrix: ConfusionMatrix = {}
): T[] {
  if (count <= 0 || !pool || pool.length === 0) {
    return [];
  }

  const targetId = typeof targetKanji === 'string' ? targetKanji : targetKanji.id;
  let targetChar = typeof targetKanji === 'object' && targetKanji.character ? targetKanji.character : targetId;

  // Resolve target against curriculum to find its character or canonical ID
  const curriculumMatch = MISHIMA_KANJI_CURRICULUM.find(
    (k) => k.id === targetId || k.character === targetId
  );
  if (curriculumMatch) {
    targetChar = curriculumMatch.character;
  }

  const getItemId = (item: T): string => (typeof item === 'string' ? item : item.id);
  const getItemChar = (item: T): string => (typeof item === 'string' ? item : item.character || item.id);

  const selected: T[] = [];
  const selectedIds = new Set<string>([targetId, targetChar]);
  if (curriculumMatch) {
    selectedIds.add(curriculumMatch.id);
    selectedIds.add(curriculumMatch.character);
  }

  // Resolve target item in pool if target was passed as an ID or character
  const targetInPool = pool.find(
    (item) =>
      getItemId(item) === targetId ||
      getItemChar(item) === targetId ||
      getItemId(item) === targetChar ||
      getItemChar(item) === targetChar
  );
  if (targetInPool) {
    selectedIds.add(getItemId(targetInPool));
    selectedIds.add(getItemChar(targetInPool));
  }

  // Proactively exclude any pool items matching target ID or character
  for (const item of pool) {
    const id = getItemId(item);
    const char = getItemChar(item);
    if (
      id === targetId ||
      id === targetChar ||
      char === targetId ||
      char === targetChar ||
      (curriculumMatch &&
        (id === curriculumMatch.id ||
          id === curriculumMatch.character ||
          char === curriculumMatch.id ||
          char === curriculumMatch.character))
    ) {
      selectedIds.add(id);
      selectedIds.add(char);
    }
  }

  // 1. Prioritize confusion matrix mistaken options
  const targetConfusion =
    confusionMatrix[targetId] ||
    (curriculumMatch ? confusionMatrix[curriculumMatch.id] : undefined) ||
    (curriculumMatch ? confusionMatrix[curriculumMatch.character] : undefined) ||
    {};
  const sortedMistakes = Object.entries(targetConfusion)
    .sort(([, a], [, b]) => b - a)
    .map(([mistaken]) => mistaken);

  for (const mistaken of sortedMistakes) {
    if (selected.length >= count) break;
    if (selectedIds.has(mistaken)) continue;

    const match = pool.find((item) => {
      const id = getItemId(item);
      const char = getItemChar(item);
      return (id === mistaken || char === mistaken) && !selectedIds.has(id) && !selectedIds.has(char);
    });
    if (match) {
      const id = getItemId(match);
      const char = getItemChar(match);
      if (!selectedIds.has(id) && !selectedIds.has(char)) {
        selected.push(match);
        selectedIds.add(id);
        selectedIds.add(char);
      }
    }
  }

  // 2. Prioritize candidates from the same tier if available
  if (selected.length < count && typeof targetKanji === 'object' && 'tier' in targetKanji) {
    const targetTier = (targetKanji as any).tier;
    const sameTier = pool.filter((item) => {
      if (typeof item === 'object' && (item as any).tier === targetTier) {
        const id = getItemId(item);
        const char = getItemChar(item);
        return !selectedIds.has(id) && !selectedIds.has(char);
      }
      return false;
    });
    for (let i = sameTier.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sameTier[i], sameTier[j]] = [sameTier[j], sameTier[i]];
    }
    for (const item of sameTier) {
      if (selected.length >= count) break;
      const id = getItemId(item);
      const char = getItemChar(item);
      if (!selectedIds.has(id) && !selectedIds.has(char)) {
        selected.push(item);
        selectedIds.add(id);
        selectedIds.add(char);
      }
    }
  }

  // 3. Fallback: Fill remaining slots by randomly shuffling candidate pool
  const remaining = pool.filter((item) => {
    const id = getItemId(item);
    const char = getItemChar(item);
    return !selectedIds.has(id) && !selectedIds.has(char);
  });

  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  for (const item of remaining) {
    if (selected.length >= count) break;
    const id = getItemId(item);
    const char = getItemChar(item);
    if (!selectedIds.has(id) && !selectedIds.has(char)) {
      selected.push(item);
      selectedIds.add(id);
      selectedIds.add(char);
    }
  }

  return selected;
}
