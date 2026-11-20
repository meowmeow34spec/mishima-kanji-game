/**
 * Salon Mishima - Customer Order Generator (Korean-First + Effortless First-Sight Scaffolding)
 * File: src/game/orderGenerator.ts
 */

import { ActiveOrder, TaskMode } from '../types/game';
import { MishimaKanjiEntry } from '../types/curriculum';
import { getAllKanji } from '../data/mishimaCurriculum';
import { getKoreanGloss, getKoreanWorkTitle } from '../data/koreanGlossary';
import * as KoreanMnemonicsMod from '../data/koreanMnemonics';
import { getDistractors } from '../srs/leitnerEngine';
import { CardProgress, ConfusionMatrix } from '../types/srs';

export interface SalonCustomer {
  id: string;
  name: string;
  nameKo?: string;
  avatar: string;
  work: string;
  workKo?: string;
  role: string;
  roleKo?: string;
}

export const SALON_CUSTOMERS: SalonCustomer[] = [
  {
    id: 'uiko',
    name: '有為子',
    nameKo: '우이코',
    avatar: 'avatar-uiko',
    work: '金閣寺',
    workKo: '금각사',
    role: '薄幸の少女',
    roleKo: '비운의 소녀',
  },
  {
    id: 'kashiwagi',
    name: '柏木',
    nameKo: '카시와기',
    avatar: 'avatar-kashiwagi',
    work: '金閣寺',
    workKo: '금각사',
    role: '内翻足の学友',
    roleKo: '냉소적인 학우',
  },
  {
    id: 'mizoguchi',
    name: '溝口',
    nameKo: '미조구치',
    avatar: 'avatar-mizoguchi',
    work: '金閣寺',
    workKo: '금각사',
    role: '徒弟僧',
    roleKo: '젊은 수행승',
  },
  {
    id: 'shinji',
    name: '新治',
    nameKo: '신지',
    avatar: 'avatar-shinji',
    work: '潮騒',
    workKo: '조소 (파도 소리)',
    role: '青年漁師',
    roleKo: '순박한 청년 어부',
  },
  {
    id: 'hatsue',
    name: '初江',
    nameKo: '하츠에',
    avatar: 'avatar-hatsue',
    work: '潮騒',
    workKo: '조소 (파도 소리)',
    role: '富豪の娘',
    roleKo: '해녀 소녀',
  },
  {
    id: 'kiyoaki',
    name: '松枝清顕',
    nameKo: '마츠가에 키요아키',
    avatar: 'avatar-kiyoaki',
    work: '春の雪',
    workKo: '봄눈',
    role: '美貌の貴公子',
    roleKo: '우아한 귀공자',
  },
  {
    id: 'honda',
    name: '本多繁邦',
    nameKo: '혼다 시게쿠니',
    avatar: 'avatar-honda',
    work: '豊饒の海',
    workKo: '풍요의 바다',
    role: '観察者・法曹',
    roleKo: '이성적인 관찰자·법조인',
  },
  {
    id: 'kageyama',
    name: '影山朝子',
    nameKo: '카게야마 아사코',
    avatar: 'avatar-kageyama',
    work: '鹿鳴館',
    workKo: '록명관',
    role: '伯爵夫人',
    roleKo: '록명관의 백작부인',
  },
];

function lookupMnemonic(charOrId: string): KoreanMnemonicsMod.KoreanMnemonicEntry | undefined {
  const mod = KoreanMnemonicsMod as Record<string, any>;
  if (typeof mod.getKoreanMnemonic === 'function') {
    return mod.getKoreanMnemonic(charOrId);
  }
  if (Array.isArray(mod.KOREAN_MNEMONIC_LIST)) {
    return mod.KOREAN_MNEMONIC_LIST.find(
      (entry: any) => entry.character === charOrId || entry.id === charOrId
    );
  }
  return undefined;
}

/**
 * Strips CJK kanji characters inside parentheses (e.g. "(金)") so Korean order speech
 * never spoils the target glyph during 'pick' or 'build' tasks.
 */
function stripParentheticalKanji(text: string): string {
  return text
    .replace(/[\(（][\u4E00-\u9FFF\u3400-\u4DBF々・\s]+[\)）]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Strips any CJK kanji glyphs from Korean compound glosses so 'build' mode prompts
 * never leak target compound characters (satisfying WEB-03).
 */
function stripAllKanjiGlyphs(text: string): string {
  return text
    .replace(/[\u4E00-\u9FFF\u3400-\u4DBF々]/g, '')
    .replace(/[\(（]\s*[\)）]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

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
 * Generates an authentic literary salon customer order with crystal-clear Korean prompts
 * and effortless first-exposure visual/radical/sound scaffolding when srsBox === 0.
 */
export async function generateOrder(
  kanji: MishimaKanjiEntry,
  mode: TaskMode = 'pick',
  customDistractors?: string[],
  confusionMatrix: ConfusionMatrix = {},
  cardProgress?: CardProgress | null
): Promise<ActiveOrder> {
  orderCounter++;
  const orderId = `order-${Date.now()}-${orderCounter}`;

  // Select customer matched to novel work when available, cycling through all 8 patrons
  const workMatched = SALON_CUSTOMERS.filter(
    (c) => kanji.primaryWork && c.work === kanji.primaryWork
  );
  const customerPool = workMatched.length > 0 ? workMatched : SALON_CUSTOMERS;
  const customer =
    customerPool[(orderCounter - 1) % customerPool.length] || SALON_CUSTOMERS[0];

  const meaning = kanji.meanings?.[0] || (kanji as any).meaning || '';
  const koGloss = getKoreanGloss(kanji.character);
  const mne = lookupMnemonic(kanji.character) || lookupMnemonic(kanji.id);

  const huneumKo = mne?.huneum || koGloss?.huneum || '';
  const meaningKo = mne?.meaningKo || koGloss?.meaningKo || meaning;
  const primaryOnyomi = kanji.readings?.onyomi?.[0] || '';
  const primaryKunyomi = kanji.readings?.kunyomi?.[0] || '';
  const readingBadge = primaryOnyomi
    ? `음독 ${primaryOnyomi}`
    : primaryKunyomi
      ? `훈독 ${primaryKunyomi}`
      : '';

  const srsBox = typeof cardProgress?.box === 'number' ? cardProgress.box : 0;
  const isNewKanji = srsBox === 0;

  const dialogueJa =
    kanji.cafeOrderItem?.dialogueLine ||
    `「『${meaning}』の美を宿した一品をいただけますか。」`;

  const rawSpeechKo =
    mne?.cafeOrderSpeechKo ||
    `「${mne?.cafeItemNameKo || huneumKo || meaningKo}」 특선 메뉴 한 잔 부탁하오!`;

  const dialogue =
    mode === 'recall' ? rawSpeechKo : stripParentheticalKanji(rawSpeechKo);

  let prompt = '';
  let correctOption = '';
  let options: string[] = [];
  let traySlots: (string | null)[] | undefined = undefined;
  let hintSummaryKo = '';

  const allKanji = getAllKanji();

  if (mode === 'build') {
    // Multi-slot serving tray compound assembly (prompted by reading + Korean meaning without spoiling kanji!)
    const compoundObj =
      kanji.literaryCompounds && kanji.literaryCompounds.length > 0
        ? kanji.literaryCompounds[0]
        : { compound: `${kanji.character}美`, reading: 'び', meaning };

    const compound = compoundObj.compound;
    const compoundChars = Array.from(compound);
    traySlots = Array(compoundChars.length).fill(null);
    correctOption = compoundChars[0] || kanji.character;

    const rawCompKo =
      mne?.compoundsKo?.[0] || koGloss?.primaryCompoundKo || compoundObj.meaning;
    const cleanCompKo = stripAllKanjiGlyphs(rawCompKo) || compoundObj.meaning;

    prompt = `숙어 【${compoundObj.reading}】 (${cleanCompKo} · ${compoundChars.length}글자) — 3D 한자 블록을 순서대로 조립하세요!`;

    const charHints = compoundChars
      .map((ch, idx) => {
        const chMne = lookupMnemonic(ch);
        const chGloss = getKoreanGloss(ch);
        const label = chMne?.huneum || chGloss?.huneum || '한자';
        return `${idx + 1}번째 글자: [${label}]`;
      })
      .join(' → ');
    hintSummaryKo = `🧩 조립 힌트: ${charHints}`;

    // Candidate options: characters from the compound + distractors
    const targetOptionCount = Math.max(4, compoundChars.length);
    const neededDistractors = Math.max(0, targetOptionCount - compoundChars.length);

    let extraChars: string[] = [];
    if (customDistractors && customDistractors.length >= neededDistractors) {
      extraChars = customDistractors
        .filter((ch) => !compoundChars.includes(ch))
        .slice(0, neededDistractors);
    } else {
      const distKanji = getDistractors(kanji, allKanji, 4, confusionMatrix);
      extraChars = distKanji
        .map((k) => k.character)
        .filter((ch) => !compoundChars.includes(ch))
        .slice(0, neededDistractors);
    }

    const rawOptions = Array.from(new Set([...compoundChars, ...extraChars]));
    let fallbackIdx = 0;
    while (rawOptions.length < targetOptionCount && fallbackIdx < allKanji.length) {
      const fallback = allKanji[fallbackIdx % allKanji.length]?.character || '文';
      if (!rawOptions.includes(fallback)) {
        rawOptions.push(fallback);
      }
      fallbackIdx++;
    }
    options = shuffle(rawOptions.slice(0, targetOptionCount));
    if (!options.includes(correctOption)) {
      options[0] = correctOption;
      options = shuffle(options);
    }
  } else if (mode === 'recall') {
    // Reading recall mode: Huge Kanji + Korean 훈음 hint -> pick the Japanese reading!
    correctOption =
      (kanji.readings.onyomi && kanji.readings.onyomi[0]) ||
      (kanji.readings.kunyomi && kanji.readings.kunyomi[0]) ||
      kanji.character;

    const huneumDisplay = huneumKo ? `${huneumKo} · ${meaningKo}` : meaningKo;
    prompt = `한자 「${kanji.character}」 (${huneumDisplay}) — 알맞은 일본어 읽기를 고르세요!`;

    hintSummaryKo = mne?.koreanSoundTip
      ? `🔊 1초 발음 공식: ${mne.koreanSoundTip}`
      : `💡 훈음 [${huneumDisplay}]의 한자음을 떠올려 일본어 음독과 연결해 보세요!`;

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
    // 'pick' mode: Korean 훈음 + 뜻 + 음독 -> pick the right 3D Kanji block!
    correctOption = kanji.character;
    const huneumTag = huneumKo || meaningKo;
    prompt = `【${huneumTag}】 뜻: ${meaningKo}${readingBadge ? ` · ${readingBadge}` : ''} — 알맞은 3D 한자 블록을 골라 서빙하세요!`;

    hintSummaryKo = mne
      ? `${mne.visualPictogram} 모양 분해: ${mne.radicalBreakdown} — ${mne.storyMnemonicKo}`
      : `💡 훈음 [${huneumTag}] (${meaningKo})에 해당하는 한자 블록을 선택하세요!`;

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

  const workKo = customer.workKo || getKoreanWorkTitle(customer.work);
  const customerNameKo = customer.nameKo
    ? `${customer.nameKo}${workKo ? ` (『${workKo}』)` : ''}`
    : customer.name;

  return {
    id: orderId,
    customerId: customer.id,
    customerName: customer.name,
    customerNameKo,
    customerAvatar: customer.avatar,
    dialogue,
    dialogueJa,
    happyReactionKo: mne?.happyReactionKo || '훌륭한 풍미로군! 고맙소!',
    angryReactionKo: mne?.angryReactionKo || '어허, 내가 주문한 한자가 아니잖소! ㅋㅋ',
    targetKanji: kanji,
    mode,
    traySlots,
    prompt,
    options,
    correctOption,
    isNewKanji,
    srsBox,
    hintSummaryKo,
    huneumKo: huneumKo || undefined,
    meaningKo: meaningKo || undefined,
    soundTipKo: mne?.koreanSoundTip,
    radicalBreakdownKo: mne?.radicalBreakdown,
    visualPictogram: mne?.visualPictogram,
  };
}
