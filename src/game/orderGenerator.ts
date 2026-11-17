/**
 * Salon Mishima - Customer Order Generator
 * File: src/game/orderGenerator.ts
 */

import { ActiveOrder, TaskMode } from '../types/game';
import { MishimaKanjiEntry } from '../types/curriculum';
import { getAllKanji } from '../data/mishimaCurriculum';
import { getDistractors } from '../srs/leitnerEngine';
import { ConfusionMatrix } from '../types/srs';

export interface SalonCustomer {
  id: string;
  name: string;
  avatar: string;
  work: string;
  role: string;
}

export const SALON_CUSTOMERS: SalonCustomer[] = [
  { id: 'uiko', name: '有為子', avatar: 'avatar-uiko', work: '金閣寺', role: '薄幸の少女' },
  { id: 'kashiwagi', name: '柏木', avatar: 'avatar-kashiwagi', work: '金閣寺', role: '内翻足の学友' },
  { id: 'mizoguchi', name: '溝口', avatar: 'avatar-mizoguchi', work: '金閣寺', role: '徒弟僧' },
  { id: 'shinji', name: '新治', avatar: 'avatar-shinji', work: '潮騒', role: '青年漁師' },
  { id: 'hatsue', name: '初江', avatar: 'avatar-hatsue', work: '潮騒', role: '富豪の娘' },
  { id: 'kiyoaki', name: '松枝清顕', avatar: 'avatar-kiyoaki', work: '春の雪', role: '美貌の貴公子' },
  { id: 'honda', name: '本多繁邦', avatar: 'avatar-honda', work: '豊饒の海', role: '観察者・法曹' },
  { id: 'kageyama', name: '影山朝子', avatar: 'avatar-kageyama', work: '鹿鳴館', role: '伯爵夫人' },
];

/**
 * Shuffles an array in place with Fisher-Yates.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

let orderCounter = 0;

/**
 * Generates an authentic literary salon customer order.
 */
export async function generateOrder(
  kanji: MishimaKanjiEntry,
  mode: TaskMode = 'pick',
  customDistractors?: string[],
  confusionMatrix: ConfusionMatrix = {}
): Promise<ActiveOrder> {
  orderCounter++;
  const orderId = `order-${Date.now()}-${orderCounter}`;

  // Select customer matched to tier or cycle through customers
  const customerIndex = (kanji.tier ? (kanji.tier - 1) * 2 : 0) % SALON_CUSTOMERS.length;
  const customer = SALON_CUSTOMERS[customerIndex] || SALON_CUSTOMERS[0];

  const meaning = kanji.meanings?.[0] || (kanji as any).meaning || '';

  const dialogue =
    kanji.cafeOrderItem?.dialogueLine ||
    `「『${meaning}』の美を宿した一品をいただけますか。」`;

  let prompt = '';
  let correctOption = '';
  let options: string[] = [];
  let traySlots: (string | null)[] | undefined = undefined;

  const allKanji = getAllKanji();

  if (mode === 'build') {
    // Multi-slot serving tray compound assembly
    const compoundObj =
      kanji.literaryCompounds && kanji.literaryCompounds.length > 0
        ? kanji.literaryCompounds[0]
        : { compound: `${kanji.character}美`, reading: 'び', meaning };

    const compound = compoundObj.compound;
    traySlots = Array(compound.length).fill(null);
    correctOption = compound[0] || kanji.character;
    prompt = `熟語「${compound}」（${compoundObj.meaning}）を完成させてください`;

    // Candidate options: characters from the compound + distractors
    const compoundChars = compound.split('');
    const neededDistractors = Math.max(0, 4 - compoundChars.length);

    let extraChars: string[] = [];
    if (customDistractors && customDistractors.length >= neededDistractors) {
      extraChars = customDistractors.slice(0, neededDistractors);
    } else {
      const distKanji = getDistractors(kanji, allKanji, 4, confusionMatrix);
      extraChars = distKanji
        .map((k) => k.character)
        .filter((ch) => !compoundChars.includes(ch))
        .slice(0, neededDistractors);
    }

    const rawOptions = Array.from(new Set([...compoundChars, ...extraChars]));
    while (rawOptions.length < 4) {
      const fallback = allKanji[rawOptions.length % allKanji.length]?.character || '文';
      if (!rawOptions.includes(fallback)) {
        rawOptions.push(fallback);
      }
    }
    options = shuffle(rawOptions.slice(0, 4));
    if (!options.includes(correctOption)) {
      options[0] = correctOption;
      options = shuffle(options);
    }
  } else if (mode === 'recall') {
    // Reading recall mode
    correctOption =
      (kanji.readings.onyomi && kanji.readings.onyomi[0]) ||
      (kanji.readings.kunyomi && kanji.readings.kunyomi[0]) ||
      kanji.character;

    prompt = `漢字「${kanji.character}」（${meaning}）の読みをお選びください`;

    let distractorReadings: string[] = [];
    if (customDistractors && customDistractors.length >= 3) {
      distractorReadings = customDistractors.slice(0, 3);
    } else {
      const distKanji = getDistractors(kanji, allKanji, 5, confusionMatrix);
      for (const dk of distKanji) {
        const reading =
          (dk.readings.onyomi && dk.readings.onyomi[0]) ||
          (dk.readings.kunyomi && dk.readings.kunyomi[0]);
        if (reading && reading !== correctOption && !distractorReadings.includes(reading)) {
          distractorReadings.push(reading);
        }
        if (distractorReadings.length >= 3) break;
      }
    }

    const rawOptions = Array.from(new Set([correctOption, ...distractorReadings]));
    while (rawOptions.length < 4) {
      const fallbackReading = allKanji[rawOptions.length % allKanji.length]?.readings?.onyomi?.[0] || 'ショウ';
      if (!rawOptions.includes(fallbackReading)) {
        rawOptions.push(fallbackReading);
      }
    }
    options = shuffle(rawOptions.slice(0, 4));
    if (!options.includes(correctOption)) {
      options[0] = correctOption;
      options = shuffle(options);
    }
  } else {
    // 'pick' mode: Conveyor rail target identification
    correctOption = kanji.character;
    prompt = `「${meaning}」の漢字をお選びください`;

    let distractorChars: string[] = [];
    if (customDistractors && customDistractors.length >= 3) {
      distractorChars = customDistractors
        .filter((c) => c !== correctOption)
        .slice(0, 3);
    } else {
      const distKanji = getDistractors(kanji, allKanji, 4, confusionMatrix);
      distractorChars = distKanji
        .map((k) => k.character)
        .filter((c) => c !== correctOption)
        .slice(0, 3);
    }

    const rawOptions = Array.from(new Set([correctOption, ...distractorChars]));
    while (rawOptions.length < 4) {
      const fallback = allKanji[rawOptions.length % allKanji.length]?.character || '金';
      if (!rawOptions.includes(fallback)) {
        rawOptions.push(fallback);
      }
    }
    options = shuffle(rawOptions.slice(0, 4));
    if (!options.includes(correctOption)) {
      options[0] = correctOption;
      options = shuffle(options);
    }
  }

  return {
    id: orderId,
    customerName: customer.name,
    customerAvatar: customer.avatar,
    dialogue,
    targetKanji: kanji,
    mode,
    traySlots,
    prompt,
    options,
    correctOption,
  };
}
