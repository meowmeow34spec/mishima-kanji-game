/**
 * Salon Mishima - Boss Duel Battle Engine
 * File: src/game/bossBattleEngine.ts
 */

import { BossKanjiPair, BossQuestion } from '../types/curriculum';
import { BossBattleState, BossRoundResult } from '../types/game';
import { getAllBossPairs, getBossPairById } from '../data/bossPairs';
import { getKoreanGloss } from '../data/koreanGlossary';
import { SoundType } from '../types/audio';

export const DEFAULT_PLAYER_HEARTS = 3;
export const DEFAULT_BOSS_BASE_ROUND_TIME = 8.0;
export const MIN_BOSS_ROUND_TIME = 3.6;
export const BOSS_TIME_DECAY_PER_ROUND = 0.4;

export type { BossBattleState, BossRoundResult };

/**
 * Crystal-clear Korean localization map for all canonical Boss Duel questions.
 * Preserves exact targetCharacter, options[].kanji, options[].reading, and correctAnswer!
 */
const BOSS_QUESTION_KO_MAP: Record<
  string,
  { promptKo: string; explanationKo: string }
> = {
  'q-boss-01-1': {
    promptKo: '【寺 (절 사)】의 알맞은 일본어 훈독(뜻읽기)을 고르세요!',
    explanationKo: '「寺(절 사)」의 훈독은 てら(테라)! 사람 인변(亻)이 붙은 「侍(모실 시)」가 さむらい(사무라이)입니다.',
  },
  'q-boss-01-2': {
    promptKo: '『금각사(きんかくじ)』의 마지막 글자(절 사)는 어느 한자일까요?',
    explanationKo: '금각사는 사찰(절)이므로 사람 인변이 없는 「寺(절 사)」가 정답입니다!',
  },
  'q-boss-01-3': {
    promptKo: '무사 「さむらい(사무라이)」를 나타내는 한자를 고르세요!',
    explanationKo: '주군을 곁에서 모시는 무사는 사람 인변(亻)이 붙은 「侍(모실 시)」입니다!',
  },
  'q-boss-02-1': {
    promptKo: '불이 두 개 겹쳐 타오르는 【炎 (불꽃 염)】의 일본어 훈독은?',
    explanationKo: '불(火)이 위아래로 겹친 「炎(불꽃 염)」은 ほのお(호노오·불꽃)라고 읽습니다!',
  },
  'q-boss-02-2': {
    promptKo: '불길이 치솟는 「염상(えんじょう)」에 쓰이는 한자를 고르세요!',
    explanationKo: '화염이 타오르는 염상에는 불꽃 「炎(불꽃 염)」을 씁니다! (炭은 숯 탄)',
  },
  'q-boss-03-1': {
    promptKo: '화려하게 피어나는 【華 (빛날 화)】의 일본어 음독을 고르세요!',
    explanationKo: '「화려(華麗)·화족(華族)」의 「華(빛날 화)」는 음독 カ(카)로 읽습니다!',
  },
  'q-boss-03-2': {
    promptKo: '「언엽(ことば·말)」이나 「단풍(こうよう)」에 쓰이는 잎사귀 한자는?',
    explanationKo: '나뭇잎과 말의 잎사귀에는 나무(木)가 들어간 「葉(잎 엽)」을 씁니다!',
  },
  'q-boss-04-1': {
    promptKo: '미시마의 걸작 『우국(憂国)』에 쓰인 【憂 (근심 우)】의 훈독은?',
    explanationKo: '사람 인변이 없는 「憂(근심 우)」는 나라를 근심하다(うれ・える)라는 뜻입니다!',
  },
  'q-boss-04-2': {
    promptKo: '무대에서 연기하는 「배우(はいゆう)」나 「우수(ゆうしゅう)」에 쓰이는 한자는?',
    explanationKo: '사람 인변(亻)이 붙은 「優(넉넉할 우·배우 우)」가 연기하는 배우와 다정함을 뜻합니다!',
  },
  'q-boss-05-1': {
    promptKo: '높은 누각을 뜻하는 【閣 (누각 각)】의 일본어 음독을 고르세요!',
    explanationKo: '금각·내각의 「閣(누각 각)」은 한국 음 "각" → 일본 음독 カク(카쿠)로 읽습니다!',
  },
  'q-boss-05-2': {
    promptKo: '『금각사(きんかくじ)』의 가운데 글자 「かく(누각 각)」를 고르세요!',
    explanationKo: '문(門) 안에 각각 각(各)이 들어간 「閣(누각 각)」이 정답입니다! (闊은 트일 활)',
  },
  'q-boss-06-1': {
    promptKo: '하늘로 솟는 영혼 【魂 (넋 혼)】의 일본어 훈독을 고르세요!',
    explanationKo: '구름(云)처럼 피어오르는 「魂(넋 혼)」의 훈독은 たましい(타마시이·영혼)입니다!',
  },
  'q-boss-06-2': {
    promptKo: '불굴의 정신 「야마토다마시이(大和魂)」에서 영혼을 뜻하는 한자는?',
    explanationKo: '정신과 영혼을 뜻하는 글자는 구름 운(云)이 붙은 「魂(넋 혼)」입니다! (魄은 넋 백)',
  },
  'q-boss-07-1': {
    promptKo: '칼날 끝에 점이 찍힌 【刃 (칼날 인)】의 일본어 훈독을 고르세요!',
    explanationKo: '칼(刀) 안쪽에 날카로운 점이 찍힌 「刃(칼날 인)」은 やいば(야이바·칼날)라고 읽습니다!',
  },
  'q-boss-07-2': {
    promptKo: '시퍼런 칼날 「백인(はくじん)」의 예리한 날 끝을 나타내는 한자는?',
    explanationKo: '벼려진 칼날의 점을 가진 「刃(칼날 인)」이 백인(白刃)의 한자입니다!',
  },
  'q-boss-07-3': {
    promptKo: '「할복(せっぷく·切腹)」의 첫 글자 「せつ(끊을 절)」를 고르세요!',
    explanationKo: '일곱 칠(七)과 칼 도(刀)가 합쳐져 베어 끊는 「切(끊을 절)」이 정답입니다!',
  },
  'q-boss-08-1': {
    promptKo: '눈 깜짝할 순간 【刹那(찰나)】에서 「刹(찰나 찰)」의 일본어 음독은?',
    explanationKo: '불교 용어 「찰나(刹那·せつな)」의 「刹」은 음독 セツ(세츠)로 읽습니다!',
  },
  'q-boss-08-2': {
    promptKo: '생사가 돌고 도는 「윤회(りんね)」의 두 번째 한자(돌 회)를 고르세요!',
    explanationKo: '불교 윤회(輪廻)의 전통 표기는 길게 걸을 인(廴) 받침이 붙은 「廻(돌 회)」입니다!',
  },
  'q-boss-08-3': {
    promptKo: '『분마』의 결말에 떠오르는 태양 【日輪(일륜)】에서 「輪(바퀴 륜)」의 음독은?',
    explanationKo: '태양의 둥근 원반을 뜻하는 「일륜(にちりん)」은 음독 リン(린)으로 읽습니다!',
  },
};

const OPTION_MEANING_KO_MAP: Record<string, string> = {
  寺: '절 사 · 사찰',
  侍: '모실 시 · 사무라이',
  炎: '불꽃 염 · 화염',
  炭: '숯 탄 · 목탄',
  華: '빛날 화 · 화려함',
  葉: '잎 엽 · 나뭇잎',
  憂: '근심 우 · 슬픔',
  優: '넉넉할 우 · 다정함/배우',
  閣: '누각 각 · 전각',
  闊: '트일 활 · 넓음',
  魂: '넋 혼 · 영혼',
  魄: '넋 백 · 육혼',
  刃: '칼날 인 · 칼날',
  刀: '칼 도 · 일본도',
  切: '끊을 절 · 베다',
  力: '힘 력 · 힘',
  刹: '찰나 찰 · 순간',
  廻: '돌 회 · 윤회',
  回: '돌 회 · 회전',
  輪: '바퀴 륜 · 일륜/고리',
};

/**
 * Localizes a boss question into high-clarity Korean while keeping all option answer contracts intact.
 */
export function localizeBossQuestionKo(question: BossQuestion): BossQuestion {
  if (!question) return question;

  const koEntry = BOSS_QUESTION_KO_MAP[question.id];
  const targetGloss = getKoreanGloss(question.targetCharacter);

  const prompt = koEntry
    ? koEntry.promptKo
    : /[가-힣]/.test(question.prompt)
      ? question.prompt
      : targetGloss
        ? `【${question.targetCharacter} (${targetGloss.huneum})】 — ${question.prompt}`
        : question.prompt;

  const explanation = koEntry ? koEntry.explanationKo : question.explanation;

  const localizedOptions = Array.isArray(question.options)
    ? question.options.map((opt) => {
        if (!opt || typeof opt !== 'object') return opt;
        const koMeaning =
          OPTION_MEANING_KO_MAP[opt.kanji] ||
          getKoreanGloss(opt.kanji)?.huneum ||
          opt.meaning;
        return {
          ...opt,
          meaning: koMeaning,
        };
      })
    : question.options;

  return {
    ...question,
    prompt,
    explanation,
    options: localizedOptions,
  };
}

/**
 * Returns a shallow copy of a boss quiz question with Korean localization and randomized option order
 * so the correct choice is not pinned to index 0 on every round.
 */
export function withShuffledBossOptions(question: BossQuestion): BossQuestion {
  const localized = localizeBossQuestionKo(question);
  if (!localized || !Array.isArray(localized.options) || localized.options.length <= 1) {
    return localized;
  }
  const shuffled = [...localized.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    ...localized,
    options: shuffled,
  };
}

/**
 * Resolves a single round in a boss duel.
 * - Correct answer decrements Boss HP by 1.
 * - Incorrect answer decrements Player hearts by 1.
 * Satisfies driver.resolveBossRound(currentBossHp, currentHearts, isCorrect).
 */
export function resolveBossRound(
  currentBossHp: number,
  currentHearts: number,
  isCorrect: boolean
): BossRoundResult {
  const newBossHp = isCorrect ? Math.max(0, currentBossHp - 1) : currentBossHp;
  const newHearts = isCorrect ? currentHearts : Math.max(0, currentHearts - 1);
  const isDefeated = newBossHp <= 0;
  const isPlayerDefeated = newHearts <= 0;

  return {
    bossHp: newBossHp,
    hearts: newHearts,
    isDefeated,
    isPlayerDefeated,
  };
}

/**
 * Calculates accelerating round timer for boss questions.
 * Decrements by decayStep (0.4s) per round down to minTime (3.6s).
 */
export function calculateBossRoundTime(
  baseTime: number = DEFAULT_BOSS_BASE_ROUND_TIME,
  roundIndex: number = 0,
  minTime: number = MIN_BOSS_ROUND_TIME,
  decayStep: number = BOSS_TIME_DECAY_PER_ROUND
): number {
  const time = baseTime - roundIndex * decayStep;
  return Math.max(minTime, Math.round(time * 10) / 10);
}

/**
 * Initializes a new boss duel battle state.
 * Supports optional initialHearts override (e.g. 4 hearts when 'wagashi' upgrade is unlocked).
 */
export function initBossBattle(
  pairOrId?: BossKanjiPair | string,
  initialHearts: number = DEFAULT_PLAYER_HEARTS
): BossBattleState {
  let pair: BossKanjiPair | undefined;

  if (typeof pairOrId === 'object' && pairOrId !== null) {
    pair = pairOrId;
  } else if (typeof pairOrId === 'string') {
    pair = getBossPairById(pairOrId);
  }

  if (!pair) {
    const allPairs = getAllBossPairs();
    pair = allPairs[0];
  }

  const resolvedHearts =
    typeof initialHearts === 'number' && initialHearts > 0
      ? Math.floor(initialHearts)
      : DEFAULT_PLAYER_HEARTS;

  const initialHp = pair?.bossHp || 10;
  const initialTime = pair?.timeLimitSeconds || DEFAULT_BOSS_BASE_ROUND_TIME;
  const baseQuestion = pair?.questions?.[0] || {
    id: 'fallback-q0',
    type: 'glyph_to_sound' as const,
    prompt: `${pair?.characterA} vs ${pair?.characterB} — 알맞은 답을 고르세요!`,
    targetCharacter: pair?.characterA || '寺',
    options: [],
    correctAnswer: pair?.characterA || '寺',
    explanation: '혼동하기 쉬운 한자 구별 문제입니다.',
  };
  const currentQuestion = withShuffledBossOptions(baseQuestion);

  return {
    bossPair: pair,
    currentQuestionIndex: 0,
    currentQuestion,
    bossHp: initialHp,
    maxBossHp: initialHp,
    playerHearts: resolvedHearts,
    maxHearts: resolvedHearts,
    timeLeft: initialTime,
    isDefeated: false,
    isPlayerDefeated: false,
    isActive: true,
  };
}

/**
 * Submits player answer for current boss question, evaluating HP/hearts and sound cues.
 */
export function submitBossAnswer(
  state: BossBattleState,
  selectedAnswer: string
): {
  newState: BossBattleState;
  result: BossRoundResult;
  isCorrect: boolean;
  audioCue: SoundType;
} {
  const currentQ = state.currentQuestion;
  const isCorrect = selectedAnswer === currentQ.correctAnswer;
  const result = resolveBossRound(state.bossHp, state.playerHearts, isCorrect);

  let audioCue: SoundType = 'wrong';
  if (isCorrect) {
    audioCue = result.isDefeated ? 'fanfare' : 'bossHit';
  } else {
    audioCue = result.isPlayerDefeated ? 'hurt' : 'wrong';
  }

  const nextIndex = (state.currentQuestionIndex + 1) % (state.bossPair.questions.length || 1);
  const nextQuestion = withShuffledBossOptions(
    state.bossPair.questions[nextIndex] || state.currentQuestion
  );
  const nextTime = calculateBossRoundTime(
    state.bossPair.timeLimitSeconds || DEFAULT_BOSS_BASE_ROUND_TIME,
    nextIndex
  );

  const newState: BossBattleState = {
    ...state,
    bossHp: result.bossHp,
    playerHearts: result.hearts,
    isDefeated: result.isDefeated,
    isPlayerDefeated: result.isPlayerDefeated,
    isActive: !result.isDefeated && !result.isPlayerDefeated,
    currentQuestionIndex: nextIndex,
    currentQuestion: nextQuestion,
    timeLeft: nextTime,
  };

  return {
    newState,
    result,
    isCorrect,
    audioCue,
  };
}
