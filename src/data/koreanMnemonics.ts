/**
 * Salon Mishima - 80-Kanji Korean Effortless Memorization & Cafe Dialogue Dataset
 * File: src/data/koreanMnemonics.ts
 *
 * Provides 100% coverage across all 80 Yukio Mishima literary kanji (Tiers 1–4):
 * - Crisp Korean 훈음 (huneum) & core meaning
 * - Korean 한자음 → Japanese On'yomi/Kun'yomi 1-second phonetic bridge (koreanSoundTip)
 * - Plain-Korean visual radical breakdown (radicalBreakdown)
 * - Vivid katakana-cafe-style shape-memory story (storyMnemonicKo) & emoji cue (visualPictogram)
 * - Natural Korean literary quote translation (quoteKo) & 1:1 compound meanings (compoundsKo)
 * - Lively 3D cafe customer order lines & happy/angry reactions in Korean
 */

import type { CurriculumTierNumber, MishimaKanjiEntry } from '../types/curriculum';
import { getKanjiByTier } from './mishimaCurriculum';

export interface KoreanMnemonicEntry {
  /** Curriculum entry ID (e.g. 'kinkaku-01-kin') */
  id: string;
  /** Target kanji glyph (e.g. '金') */
  character: string;
  /** Crisp Korean 훈음 (e.g. '쇠 금') */
  huneum: string;
  /** Concise Korean meaning summary (e.g. '금, 황금, 쇠, 돈') */
  meaningKo: string;
  /** Hangul reading pronunciation guide for beginners */
  readingGuideKo: string;
  /** 1-line phonetic bridge connecting Korean 한자음 to Japanese On'yomi/Kun'yomi */
  koreanSoundTip: string;
  /** Visual component/radical split in plain Korean */
  radicalBreakdown: string;
  /** Vivid, funny, unforgettable 1–2 sentence visual/shape story */
  storyMnemonicKo: string;
  /** Expressive emoji/symbol combo representing the visual story */
  visualPictogram: string;
  /** Natural, high-readability Korean translation of literaryQuote.originalJapanese */
  quoteKo: string;
  /** Array of Korean meanings matching each entry in literaryCompounds 1-to-1 */
  compoundsKo: string[];
  /** Korean name of the kanji's signature cafe menu item */
  cafeItemNameKo: string;
  /** Lively katakana-cafe-style Korean customer order speech line */
  cafeOrderSpeechKo: string;
  /** Joyful Korean reaction when served the right block */
  happyReactionKo: string;
  /** Comical Korean reaction when served the wrong block */
  angryReactionKo: string;
}

export const KOREAN_MNEMONIC_LIST: KoreanMnemonicEntry[] = [
  // ==========================================================================
  // TIER 1: 金閣の炎と耽美 (금각의 불꽃과 탐미 — 『금각사』 20자)
  // ==========================================================================
  {
    id: 'kinkaku-01-kin',
    character: '金',
    huneum: '쇠 금',
    meaningKo: '황금, 쇠, 돈',
    readingGuideKo: '음독 キン(킨)·コン(콘) / 훈독 かね(카네)',
    koreanSoundTip: "한국 음 '금/김' → 일본 음독 キン(킨)! 받침 ㅁ→ㄴ 법칙! 돈(かね·카네)은 쓰면 '가네~'로 1초 암기!",
    radicalBreakdown: '亼(모을 집 지붕) + 土(흙 토) + 丷(반짝이는 금알갱이 두 개)',
    storyMnemonicKo: '지붕(人) 덮인 땅속(土)에 반짝이는 황금 알갱이 두 개(丷)가 콕콕 박혀 빛나는 금괴 모양이에요!',
    visualPictogram: '🏔️✨🪙',
    quoteKo: '「어릴 적부터 아버지는 내게 자주 금각에 대해 이야기하곤 하셨다.」',
    compoundsKo: ['금각 (황금빛 누각)', '황금 (순금)', '금박 (얇게 펴 바른 금종이)'],
    cafeItemNameKo: '금박 말차 파르페',
    cafeOrderSpeechKo: '「금박 말차 파르페(金)」 하나 내어주시오! 황금빛으로 반짝이는 걸로!',
    happyReactionKo: '오오, 눈부신 황금빛 풍미가 일품이군! 고맙소!',
    angryReactionKo: '어허, 이건 황금(金)이 아니라 엉뚱한 한자잖소! 내 금박 내놔요 ㅋㅋ',
  },
  {
    id: 'kinkaku-02-kaku',
    character: '閣',
    huneum: '누각 각',
    meaningKo: '누각, 높은 전각, 내각',
    readingGuideKo: '음독 カク(카쿠)',
    koreanSoundTip: "한국 음 '각' → 일본 음독 カク(카쿠)! 받침 ㄱ→쿠(ク) 법칙 그대로 '각 → 카쿠'!",
    radicalBreakdown: '門(문 문) + 各(각각 각)',
    storyMnemonicKo: '거대한 대문(門) 안으로 층마다 각각(各) 화려한 방이 솟아 있는 3층 금각사 누각이에요!',
    visualPictogram: '🚪🏯✨',
    quoteKo: '「금각의 전경은 연못의 푸른 수면 위에 산들바람에 일렁이는 누각의 그림자를 드리우고 있었다.」',
    compoundsKo: ['금각 (황금 누각)', '누각 (다층으로 높게 지은 전각)'],
    cafeItemNameKo: '누각 모나카',
    cafeOrderSpeechKo: '바삭한 3층 「누각 모나카(閣)」 하나 주시겠소? 수면에 비친 누각처럼 우아하게!',
    happyReactionKo: '겹겹이 쌓인 모나카가 꼭 금각의 누각 같구려! 최고요!',
    angryReactionKo: '문(門) 안에 각각(各)이 있어야 누각(閣)이지! 다른 건물을 지어왔잖소 ㅋㅋ',
  },
  {
    id: 'kinkaku-03-ji',
    character: '寺',
    huneum: '절 사',
    meaningKo: '절, 불교 사찰',
    readingGuideKo: '음독 ジ(지) / 훈독 てら(테라)',
    koreanSoundTip: "한국 '금각사(寺)' → 킨카쿠지(ジ)! 훈독 てら(테라)는 '절 마당 테라스에서 명상!'으로 외우면 끝!",
    radicalBreakdown: '土(흙 토) + 寸(마디 촌·법도)',
    storyMnemonicKo: '신성한 땅(土) 위에 법도와 규율(寸)을 반듯하게 세워 지은 고요한 산속 사찰이에요! (사람 亻이 붙으면 사무라이 侍!)',
    visualPictogram: '⛰️⛩️🔔',
    quoteKo: '「녹원사의 산문을 들어서자, 그 절의 고요함이 나를 감쌌다.」',
    compoundsKo: ['금각사 (교토의 황금 사찰)', '사원 (불교 사찰)', '선사 (참선하는 절)'],
    cafeItemNameKo: '선사 센차(녹차)',
    cafeOrderSpeechKo: '잡념이 싹 씻겨 내려가는 「선사 센차(寺)」 한 잔 정갈하게 우려주시오!',
    happyReactionKo: '고즈넉한 산사의 정적이 찻잔 속에 그대로 담겼군. 훌륭하오!',
    angryReactionKo: '스님 계신 절(寺)을 시켰는데 엉뚱한 패를 내밀다니, 목탁 맞고 싶소?! ㅋㅋ',
  },
  {
    id: 'kinkaku-04-bi',
    character: '美',
    huneum: '아름다울 미',
    meaningKo: '아름다움, 미학, 고움',
    readingGuideKo: '음독 ビ(비)·ミ(미) / 훈독 うつく・しい(우츠쿠시이)',
    koreanSoundTip: "한국 음 '미' → 일본 음독 ビ(비)·ミ(미)! ㅁ↔ㅂ 쌍둥이 자음('미인=비인')으로 단번에 연결!",
    radicalBreakdown: '羊(양 양) + 大(클 대)',
    storyMnemonicKo: '복스럽고 포동포동하게 큰(大) 흰 양(羊)이 꽃장식을 한 모습! 고대인들이 꼽은 최고의 아름다움이에요!',
    visualPictogram: '🐑🌸👑',
    quoteKo: '「아름다움이란 것은 어쩌면 이토록 냉혹한 힘을 지니고 있는 것일까.」',
    compoundsKo: ['탐미 (아름다움에 깊이 빠짐)', '절대미 (완전무결한 아름다움)', '미의식 (아름다움을 느끼는 감각)'],
    cafeItemNameKo: '탐미 호박양갱',
    cafeOrderSpeechKo: '투명하게 빛나는 「탐미 호박양갱(美)」 하나 주시오! 보기만 해도 숨 막히게 아름다운 걸로!',
    happyReactionKo: '아아, 이 영롱한 빛깔! 그야말로 절대적인 아름다움(美)이로군!',
    angryReactionKo: '이건 미(美)의 기준에 한참 못 미치오! 내 심미안이 울고 있소 ㅋㅋ',
  },
  {
    id: 'kinkaku-05-kyo',
    character: '鏡',
    huneum: '거울 경',
    meaningKo: '거울, 수면의 비침',
    readingGuideKo: '음독 キョウ(쿄우) / 훈독 かがみ(카가미)',
    koreanSoundTip: "한국 음 '경' → 일본 음독 キョウ(쿄우)! 받침 ㅇ→장음 우(ウ)! 거울(かがみ·카가미) 보며 '각(카가) 잡는 미(미)모'!",
    radicalBreakdown: '金(쇠 금) + 立(설 립) + 日(해 일) + 儿(어진사람 인)',
    storyMnemonicKo: '매끈하게 닦은 청동 쇠(金) 앞에 사람(儿)이 똑바로 서니(立) 햇살(日)처럼 얼굴이 선명히 비치는 거울이에요!',
    visualPictogram: '🪙🪞✨',
    quoteKo: '「경호지 수면에 비친 금각은 실물보다도 한층 더 허구처럼 아름다웠다.」',
    compoundsKo: ['경호지 (금각사를 비추는 거울 연못)', '명경 (맑고 깨끗한 거울)', '물거울 (잔잔한 수면에 비친 그림자)'],
    cafeItemNameKo: '거울면 칡국수(구즈키리)',
    cafeOrderSpeechKo: '얼굴이 비칠 만큼 투명한 「거울면 칡국수(鏡)」 한 그릇 시원하게 내어주시오!',
    happyReactionKo: '물거울처럼 맑고 탱글탱글하군! 실물보다 더 황홀한 맛이야!',
    angryReactionKo: '거울(鏡)을 달랬더니 웬 흐리멍덩한 글자를 주시오! 눈 좀 닦으시오 ㅋㅋ',
  },
  {
    id: 'kinkaku-06-en',
    character: '炎',
    huneum: '불꽃 염',
    meaningKo: '불꽃, 타오르는 화염',
    readingGuideKo: '음독 エン(엔) / 훈독 ほのお(호노오)',
    koreanSoundTip: "한국 음 '염' → 일본 음독 エン(엔)!('염→엔' ㅁ→ㄴ 법칙) 훈독 ほのお(호노오)는 불꽃에 데어 '호오~ 노오!'",
    radicalBreakdown: '火(불 화) + 火(불 화) 2단 적층!',
    storyMnemonicKo: '장작불(火) 위에 또 불꽃(火)이 2층으로 솟구쳐 밤하늘까지 활활 타오르는 맹렬한 화염 모양이에요!',
    visualPictogram: '🔥🏯🔥',
    quoteKo: '「밤하늘로 치솟아 오르는 화염 속에, 금각의 뼈대가 검게 떠올랐다.」',
    compoundsKo: ['화염 (맹렬히 타오르는 불길)', '염상 (불길이 치솟아 다 타버림)', '정염 (불꽃처럼 타오르는 정념)'],
    cafeItemNameKo: '홍염 호지차',
    cafeOrderSpeechKo: '붉은 불꽃 향기가 피어오르는 뜨거운 「홍염 호지차(炎)」 한 잔 내어주시오!',
    happyReactionKo: '크으~ 불길처럼 깊고 구수한 향이 가슴까지 뜨겁게 달구는군!',
    angryReactionKo: '불(火)이 두 개 겹쳐야 불꽃 염(炎)이지! 불씨 다 꺼졌잖소 ㅋㅋ',
  },
  {
    id: 'kinkaku-07-ei',
    character: '影',
    huneum: '그림자 영',
    meaningKo: '그림자, 실루엣, 자취',
    readingGuideKo: '음독 エイ(에이) / 훈독 かげ(카게)',
    koreanSoundTip: "한국 음 '영(영화·촬영)' → 일본 음독 エイ(에이)! 훈독 かげ(카게)는 '가게(かげ) 처마 밑 그늘 그림자'!",
    radicalBreakdown: '日(해 일) + 京(서울 경·높은 누각) + 彡(터럭 삼·빗금 그림자 3개)',
    storyMnemonicKo: '해(日)가 높은 수도의 누각(京)을 비추자, 옆으로 스윽스윽 검은 빗금 세 줄(彡) 그림자가 길게 드리워졌어요!',
    visualPictogram: '☀️🏯👤',
    quoteKo: '「내 마음에 낙인처럼 박힌 아름다움의 그림자는 결코 사라지지 않았다.」',
    compoundsKo: ['환영 (환상 속의 그림자)', '모습·자취 (마음에 남은 얼굴 그림자)', '암영 (어두운 그림자, 그늘)'],
    cafeItemNameKo: '그림자 흑임자 양갱',
    cafeOrderSpeechKo: '짙은 그림자처럼 새까맣고 고소한 「그림자 흑임자 양갱(影)」 한 조각 부탁하오!',
    happyReactionKo: '입안에 감도는 진한 흑임자의 여운… 절대 잊히지 않을 그림자 맛이군!',
    angryReactionKo: '빗금 세 개(彡) 달린 그림자(影)는 어디 가고 엉뚱한 걸 내미시오! ㅋㅋ',
  },
  {
    id: 'kinkaku-08-so',
    character: '僧',
    huneum: '중 승',
    meaningKo: '승려, 스님',
    readingGuideKo: '음독 ソウ(소우)',
    koreanSoundTip: "한국 음 '승(승려·고승)' → 일본 음독 ソウ(소우)! 받침 ㅇ→장음 우(ウ) 법칙으로 '승 → 소우'!",
    radicalBreakdown: '亻(사람 인) + 曾(일찍 증·겹쳐 모으다)',
    storyMnemonicKo: '속세를 떠나 수행을 겹겹이 쌓아 올린(曾) 사람(亻), 가사를 입고 합장한 스님의 모습이에요!',
    visualPictogram: '🧑‍🦲📿🍵',
    quoteKo: '「말더듬이 학승이었던 나는 말의 세계로부터 추방당해 있었다.」',
    compoundsKo: ['학승 (학문을 닦는 젊은 수행승)', '승려 (불교의 출가 수행자)', '고승 (덕이 높은 큰스님)'],
    cafeItemNameKo: '운수 박차(연한 말차)',
    cafeOrderSpeechKo: '수행승의 고독한 마음을 달래줄 「운수 박차(僧)」 한 사발 정성껏 격불해 주시오!',
    happyReactionKo: '씁쓸하면서도 맑은 말차 향에 묵은 번뇌가 스르르 녹는구려. 나무아미타불!',
    angryReactionKo: '사람(亻) 변의 스님 승(僧)이 아니잖소! 수행이 아직 부족하구려 ㅋㅋ',
  },
  {
    id: 'kinkaku-09-gen',
    character: '幻',
    huneum: '헛보일 환',
    meaningKo: '환상, 환영, 신기루',
    readingGuideKo: '음독 ゲン(겐) / 훈독 まぼろし(마보로시)',
    koreanSoundTip: "한국 음 '환(환상·몽환)' → 일본 음독 ゲン(겐)! 훈독 まぼろし(마보로시)는 '마법(마보)으로 보시(로시)는 환영'!",
    radicalBreakdown: '幺(작을 요·실타래 고리) + 𠃌(뒤집힌 고리)',
    storyMnemonicKo: '마술사가 얇은 실고리(幺)를 허공에서 휙 뒤집어(𠃌) 눈앞에 아른거리게 만든 신기루 환영이에요! 단 4획!',
    visualPictogram: '🪄🌀✨',
    quoteKo: '「나를 끝없이 거부하는 현실보다도, 금각의 환영 쪽이 훨씬 더 확실했다.」',
    compoundsKo: ['환영 (눈앞에 아른거리는 환상)', '환멸 (환상이 깨져 실망함)', '몽환 (꿈과 환상)'],
    cafeItemNameKo: '환영 낙안(설탕 다식)',
    cafeOrderSpeechKo: '입에 넣자마자 신기루처럼 사르르 녹는 「환영 낙안(幻)」 하나 내어주시오!',
    happyReactionKo: '혀끝에서 꿈결처럼 사라지는 단맛… 현실보다 달콤한 환영이로군!',
    angryReactionKo: '눈속임 마술에 당했나?! 이건 환영 환(幻) 자가 아니잖소 ㅋㅋ',
  },
  {
    id: 'kinkaku-10-metsu',
    character: '滅',
    huneum: '멸할 멸',
    meaningKo: '멸망하다, 꺼지다, 소멸',
    readingGuideKo: '음독 メツ(메츠) / 훈독 ほろ・びる(호로비루)',
    koreanSoundTip: "한국 음 '멸(파멸·불멸)' → 일본 음독 メツ(메츠)! 받침 ㄹ→츠(ツ) 만능 법칙('멸→메츠')으로 1초 클리어!",
    radicalBreakdown: '氵(물 수) + 戌(개 술·창) + 火(불 화)',
    storyMnemonicKo: '활활 타는 불(火)에 물(氵)을 확 끼얹고 창(戌)으로 덮어버려 완전히 불씨를 꺼뜨려 파멸시키는 모습이에요!',
    visualPictogram: '🌊🗡️🕯️',
    quoteKo: '「아름다움이 멸망하는 바로 그 순간에야말로, 영원한 완성이 있는 것 아닐까.」',
    compoundsKo: ['파멸 (파괴되어 멸망함)', '불멸 (영원히 사라지지 않음)', '생멸 (생겨남과 사라짐)'],
    cafeItemNameKo: '멸자빛 단팥죽(시루코)',
    cafeOrderSpeechKo: '검붉은 보랏빛으로 끓여낸 「멸자빛 단팥죽(滅)」 한 그릇 달콤하게 내어주시오!',
    happyReactionKo: '파멸의 순간처럼 황홀하고 진한 단팥 맛이군! 여한이 없소!',
    angryReactionKo: '물(氵)로 불(火)을 끄는 멸(滅) 자를 찾아야지, 가계가 파멸하겠소 ㅋㅋ',
  },
  {
    id: 'kinkaku-11-sho',
    character: '焼',
    huneum: '사를 소',
    meaningKo: '불타다, 굽다, 태우다',
    readingGuideKo: '음독 ショウ(쇼우) / 훈독 や・く(야쿠)',
    koreanSoundTip: "한국 음 '소(전소·소실)' → 일본 음독 ショウ(쇼우)! 훈독 やく(야쿠)는 일본 꼬치구이 '야키토리·타코야키'의 바로 그 굽다!",
    radicalBreakdown: '火(불 화) + 尭(높을 요 신자체: 十 + 廾 + 兀)',
    storyMnemonicKo: '장작불(火) 위에 석쇠 선반(十+廾)을 높이 다리(兀)로 받쳐 놓고 당고를 노릇노릇 굽는 모양이에요!',
    visualPictogram: '🔥🍡♨️',
    quoteKo: '「타오르는 불길 속에서, 나는 모든 것을 남김없이 불태워 버릴 결의를 굳혔다.」',
    compoundsKo: ['소실 (불에 타서 사라짐)', '전소 (건물 전체가 다 타버림)', '연소 (불길이 옆으로 번져 탐)'],
    cafeItemNameKo: '숯불구이 당고',
    cafeOrderSpeechKo: '숯불 향이 솔솔 나는 노릇노릇한 「숯불구이 당고(焼)」 한 꼬치 구워주시오!',
    happyReactionKo: '겉은 바삭, 속은 쫀득! 완벽하게 구워낸 최고의 당고구려!',
    angryReactionKo: '어허, 당고가 안 익었잖소! 불 화(火) 변의 사를 소(焼)를 가져오시오 ㅋㅋ',
  },
  {
    id: 'kinkaku-12-kai',
    character: '灰',
    huneum: '재 회',
    meaningKo: '재, 잿더미',
    readingGuideKo: '음독 カイ(카이) / 훈독 はい(하이)',
    koreanSoundTip: "한국 음 '회(회색)' → 일본 음독 カイ(카이)! ㅎ→ㅋ 법칙! 훈독 はい(하이)는 재가 날리며 '하이~ 안녕!'",
    radicalBreakdown: '厂(기슭 엄·손으로 덮는 지붕) + 火(불 화)',
    storyMnemonicKo: '타던 모닥불(火)이 다 꺼져 그 위를 손바닥(厂)으로 만져볼 수 있을 만큼 차갑게 식어버린 하얀 잿더미예요!',
    visualPictogram: '🤚💨⚱️',
    quoteKo: '「일찍이 찬란히 빛나던 누각은, 이윽고 차가운 잿더미로 돌아갔다.」',
    compoundsKo: ['회진 (재와 티끌, 완전히 불타 사라짐)', '강회 (하늘에서 흩날려 내리는 재)', '사회 (불기가 다 꺼진 차가운 재)'],
    cafeItemNameKo: '콩고물 흑당 고사리떡(와라비모치)',
    cafeOrderSpeechKo: '고운 콩고물을 하얀 재처럼 소복이 뿌린 「콩고물 와라비모치(灰)」 한 접시 주시오!',
    happyReactionKo: '차가운 잿빛 콩고물 속에 달콤한 흑당이 숨어 있었군! 기막힌 반전이오!',
    angryReactionKo: '지붕(厂) 아래 불(火)이 식은 재 회(灰) 자가 아니잖소! 콜록콜록 ㅋㅋ',
  },
  {
    id: 'kinkaku-13-ho',
    character: '鳳',
    huneum: '봉황 봉',
    meaningKo: '수컷 봉황',
    readingGuideKo: '음독 ホウ(호우)',
    koreanSoundTip: "한국 음 '봉(봉황)' → 일본 음독 ホウ(호우)! 초성 ㅂ→ㅎ(ホ) + 받침 ㅇ→장음 우(ウ) = '봉 → 호우'!",
    radicalBreakdown: '几(안석 궤·큰 날개 망토) + 一(하늘 일) + 鳥(새 조)',
    storyMnemonicKo: '커다란 바람 날개 망토(几) 안에 하늘의 으뜸(一) 표식을 달고 금각사 지붕 꼭대기에 앉은 수컷 황금새(鳥) 봉황이에요!',
    visualPictogram: '🦅👑🏯',
    quoteKo: '「지붕 꼭대기에 선 금빛 봉황은 시간을 초월해 하늘을 응시하고 있었다.」',
    compoundsKo: ['봉황 (전설 속 상서로운 부부 새)', '봉관 (봉황 장식을 얹은 화려한 관)'],
    cafeItemNameKo: '봉황 밤킨톤(황금 다식)',
    cafeOrderSpeechKo: '금각사 지붕 위 수컷 봉황처럼 고귀한 「봉황 밤킨톤(鳳)」 하나 내어주시오!',
    happyReactionKo: '입안에서 황금 날개가 펼쳐지는 듯 고아하고 달콤하군! 상서로운 맛이오!',
    angryReactionKo: '안에 새 조(鳥)가 들어간 수컷 봉황 봉(鳳)을 줘야지, 짝퉁 새를 주면 어쩌오 ㅋㅋ',
  },
  {
    id: 'kinkaku-14-o',
    character: '凰',
    huneum: '봉황 황',
    meaningKo: '암컷 봉황',
    readingGuideKo: '음독 オウ(오우)',
    koreanSoundTip: "한국 음 '황(봉황·황제)' → 일본 음독 オウ(오우)! 안에 든 '임금 왕(皇=オウ)' 소리 그대로 읽으면 정답!",
    radicalBreakdown: '几(큰 날개 테두리) + 皇(임금 황: 白+王)',
    storyMnemonicKo: '거대한 날개(几) 품 안에 눈부신 백옥 왕관(白+王=皇)을 쓴 여왕 새, 암컷 봉황이에요! (새鳥 대신 임금皇이 쏙!)',
    visualPictogram: '🕊️💎👑',
    quoteKo: '「봉황의 날갯짓은 얼어붙어, 밤의 별빛만을 온몸에 받고 있었다.」',
    compoundsKo: ['봉황 (전설의 영험한 새, 수컷 봉과 암컷 황)', '황익 (찬란하게 펼쳐진 봉황의 날개)'],
    cafeItemNameKo: '황금새 네리키리(화과자)',
    cafeOrderSpeechKo: '별빛 머금은 암컷 봉황을 빚은 「황금새 네리키리(凰)」 하나 정교하게 내어주시오!',
    happyReactionKo: '왕관(皇)을 품은 자태만큼이나 우아한 앙금 맛이로군! 감탄했소!',
    angryReactionKo: '날개(几) 속의 임금 황(皇)을 확인하시오! 봉황 짝이 안 맞잖소 ㅋㅋ',
  },
  {
    id: 'kinkaku-15-chi',
    character: '池',
    huneum: '못 지',
    meaningKo: '연못, 호수',
    readingGuideKo: '음독 チ(치) / 훈독 いけ(이케)',
    koreanSoundTip: "한국 음 '지(경호지·전지)' → 일본 음독 チ(치)! ㅈ→ㅊ 법칙! 훈독 いけ(이케)는 연못의 비단잉어 보고 '어머 이케(이렇게) 예뻐!'",
    radicalBreakdown: '氵(물 수) + 也(어조사 야·구불구불 감싸다)',
    storyMnemonicKo: '맑은 물(氵)이 정원 바위 둘레를 구불구불(也) 고요하게 감싸 안아 고여 있는 금각사 앞 연못이에요!',
    visualPictogram: '💧🪷🐟',
    quoteKo: '「나는 연못가에 우두커니 서서 잔물결을 바라보고 있었다.」',
    compoundsKo: ['경호지 (금각사가 비치는 거울 연못)', '지반 (연못가, 호숫가)', '고지 (오래된 고요한 연못)'],
    cafeItemNameKo: '연못 교쿠로(옥로차)',
    cafeOrderSpeechKo: '비취빛 연못처럼 깊고 감칠맛 나는 「연못 교쿠로(池)」 한 잔 우려주시오!',
    happyReactionKo: '연잎 이슬을 마시는 듯 감칠맛이 입안에 잔물결처럼 번지는군!',
    angryReactionKo: '물(氵)도 없는 곳에서 무슨 연못(池)을 찾소! 목마르단 말이오 ㅋㅋ',
  },
  {
    id: 'kinkaku-16-ko',
    character: '光',
    huneum: '빛 광',
    meaningKo: '빛, 광채, 찬란함',
    readingGuideKo: '음독 コウ(코우) / 훈독 ひかり(히카리)·ひか・る(히카루)',
    koreanSoundTip: "한국 음 '광(영광·일광)' → 일본 음독 コウ(코우)! 초성 ㄱ→ㅋ + 받침 ㅇ→장음 우! 훈독 '히카리(빛)'는 초유명 단어!",
    radicalBreakdown: '⺌(불꽃 광채 세 줄기) + 一(지평선) + 儿(받치는 사람 다리)',
    storyMnemonicKo: '사람(儿) 머리 위로 세 줄기 눈부신 스포트라이트 불빛(⺌)이 번쩍 솟아 사방을 환히 비추는 모양이에요!',
    visualPictogram: '✨🌟🌅',
    quoteKo: '「해 질 녘 햇빛을 받아, 금박은 찬란한 광채를 뿜어냈다.」',
    compoundsKo: ['금광 (찬란한 황금빛)', '영광 (빛나는 명예)', '광휘 (눈부시게 빛나는 광채)'],
    cafeItemNameKo: '황금빛 카스텔라',
    cafeOrderSpeechKo: '석양빛처럼 노랗고 폭신하게 구운 「황금빛 카스텔라(光)」 한 조각 주시오!',
    happyReactionKo: '입안에서 황금빛 광채가 퍼지듯 촉촉하고 달콤하구려! 브라보!',
    angryReactionKo: '이건 빛 광(光)이 아니라 암흑이잖소! 내 눈부신 카스텔라 어딨소 ㅋㅋ',
  },
  {
    id: 'kinkaku-17-zetsu',
    character: '絶',
    huneum: '끊을 절',
    meaningKo: '절대, 끊다, 단절하다',
    readingGuideKo: '음독 ゼツ(제츠) / 훈독 た・える(타에루)·た・つ(타츠)',
    koreanSoundTip: "한국 음 '절(절대·절망)' → 일본 음독 ゼツ(제츠)! ㅈ→ㅈ(ゼ) + 받침 ㄹ→츠(ツ) 공식 그대로 '절대 = 젯타이'!",
    radicalBreakdown: '糸(실 사) + 色(빛 색·칼날로 굽혀 자른 조각)',
    storyMnemonicKo: '고운 색깔(色)의 비단실(糸)을 단칼에 싹둑 끊어내어 세상과 완전히 단절된 절대적인 경지를 뜻해요!',
    visualPictogram: '🧵✂️⚡',
    quoteKo: '「나는 절대적인 아름다움과 이 세상의 추악함 사이에서 갈기갈기 찢겨 있었다.」',
    compoundsKo: ['절대 (비교를 초월한 완전한 경지)', '절망 (희망이 완전히 끊어짐)', '거절 (단호히 물리쳐 끊음)'],
    cafeItemNameKo: '절대 순미 식혜(아마자케)',
    cafeOrderSpeechKo: '불순물 하나 없이 순수한 「절대 순미 아마자케(絶)」 한 잔 시원하게 주시오!',
    happyReactionKo: '세속의 탁함을 단번에 끊어내는 절대적인 순백의 단맛이로군!',
    angryReactionKo: '실(糸)에 색(色)이 붙은 끊을 절(絶)을 달랬지, 이건 절대(絶対) 아니오 ㅋㅋ',
  },
  {
    id: 'kinkaku-18-shitsu',
    character: '嫉',
    huneum: '질투할 질',
    meaningKo: '샘내다, 질투하다',
    readingGuideKo: '음독 シツ(시츠) / 훈독 ねた・む(네타무)',
    koreanSoundTip: "한국 음 '질(질투·질시)' → 일본 음독 シツ(시츠)! 받침 ㄹ→츠(ツ)! 훈독 ねたむ(네타무)는 '남 잘되면 속이 네~ 타무(타들어감)!'",
    radicalBreakdown: '女(여자 여) + 疾(병 질: 疒병들 녁 + 矢화살 시)',
    storyMnemonicKo: '화살(矢)에 맞은 듯 가슴앓이 병(疾)이 날 만큼 남의 행복을 보며 콕콕 앓는 질투의 마음이에요!',
    visualPictogram: '💘🏹😒',
    quoteKo: '「나는 그들의 건강하고 밝은 세계에 대해 어두운 질투를 품고 있었다.」',
    compoundsKo: ['질투 (남이 잘되는 것을 샘내고 미워함)', '질시 (샘내어 흘겨봄)'],
    cafeItemNameKo: '질투 유자 소다',
    cafeOrderSpeechKo: '질투처럼 톡 쏘고 새콤달콤한 「질투 유자 소다(嫉)」 한 잔 시원하게 타 주시오!',
    happyReactionKo: '크하~ 찌릿하고 상큼한 유자 탄산에 속앓이가 뻥 뚫리는구려!',
    angryReactionKo: '화살 병(疾)이 든 질투할 질(嫉)이 아니잖소! 옆 테이블 음료가 더 맛있어 보이네 ㅋㅋ',
  },
  {
    id: 'kinkaku-19-to',
    character: '妬',
    huneum: '투기할 투',
    meaningKo: '질투하다, 시기하다, 원망',
    readingGuideKo: '음독 ト(토) / 훈독 ねた・む(네타무)',
    koreanSoundTip: "한국 음 '투(질투)' → 일본 음독 ト(토)! '질투 = 싯토(しっと)' 단어 통째로 외우면 嫉(시츠)+妬(토) 두 글자 동시 정복!",
    radicalBreakdown: '女(여자 여) + 石(돌 석)',
    storyMnemonicKo: '마음속에 무거운 돌덩이(石)가 쿵 얹힌 것처럼 꽁하고 딱딱하게 굳어버린 시기와 투기의 감정이에요!',
    visualPictogram: '🪨😤🍏',
    quoteKo: '「질투의 독이 나의 말더듬는 혀를 한층 더 무겁게 얽어매었다.」',
    compoundsKo: ['질투 (남을 시기하고 샘냄)', '시투 (의심하며 심술궂게 시기함)'],
    cafeItemNameKo: '청매실 샤베트',
    cafeOrderSpeechKo: '풋매실처럼 시큼하고 차가운 「청매실 샤베트(妬)」 한 스쿱 깔끔하게 내어주시오!',
    happyReactionKo: '얼음처럼 차갑고 상쾌한 매실 향이 마음속 돌덩이(石)까지 녹여주는군!',
    angryReactionKo: '돌 석(石) 붙은 투기할 투(妬) 대신 뭘 준 거요! 진짜 삐뚤어질 테다 ㅋㅋ',
  },
  {
    id: 'kinkaku-20-sei',
    character: '生',
    huneum: '날 생',
    meaningKo: '살다, 생명, 태어나다, 날것',
    readingGuideKo: '음독 セイ(세이)·ショウ(쇼우) / 훈독 い・きる(이키루)·なま(나마)',
    koreanSoundTip: "한국 음 '생(생명·인생)' → 일본 음독 セイ(세이)! 훈독 なま(나마)는 '나마비루(생맥주)', いきる(이키루)는 '살아가다'!",
    radicalBreakdown: '丿(돋아나는 싹) + 土(대지 흙 토)',
    storyMnemonicKo: '기름진 대지(土)를 뚫고 파릇파릇한 새싹 줄기(丿+一)가 힘차게 솟아오르는 생명력 넘치는 모양이에요!',
    visualPictogram: '🌱🌍☀️',
    quoteKo: '「한바탕 큰일을 끝마치고 담배 한 대 피우는 사람이 흔히 그렇듯, 살아야겠다고 나는 생각했다.」',
    compoundsKo: ['재생 (다시 살아남, 부활)', '생존 (살아서 존재함)', '사생 (죽음과 삶)'],
    cafeItemNameKo: '연명 팔보차',
    cafeOrderSpeechKo: '삶의 기운이 펄펄 솟아나는 따뜻한 「연명 팔보차(生)」 한 주전자 내어주시오!',
    happyReactionKo: '후우, 여덟 가지 약재와 꽃향이 온몸에 생기를 불어넣는군! 살아야겠소!',
    angryReactionKo: '새싹 돋는 날 생(生) 자도 못 알아보시다니, 생맥주(生) 한 번도 안 시켜봤소?! ㅋㅋ',
  },

  // ==========================================================================
  // TIER 2: 潮騒の海と幽玄 (파도 소리의 바다와 유현 — 『조소』·『풍요의 바다』 20자)
  // ==========================================================================
  {
    id: 'shiosai-21-cho',
    character: '潮',
    huneum: '조수 조',
    meaningKo: '밀물, 조수, 바닷물',
    readingGuideKo: '음독 チョウ(쵸우) / 훈독 しお(시오)',
    koreanSoundTip: "한국 음 '조(조류·만조)' → 일본 음독 チョウ(쵸우)! 훈독 しお(시오)는 '시오라멘(소금 라멘)'의 바로 그 소금·바닷물!",
    radicalBreakdown: '氵(물 수) + 朝(아침 조)',
    storyMnemonicKo: '아침(朝) 해와 달의 인력을 따라 바닷물(氵)이 철썩철썩 해변으로 밀려 들어오는 밀물 조수예요!',
    visualPictogram: '🌊🌅🐚',
    quoteKo: '「멀리서 울려오는 파도 소리가 밤의 해변을 고요히 흔들고 있었다.」',
    compoundsKo: ['조소 (밀려오는 파도가 술렁이는 소리)', '구로시오 (일본 남쪽을 흐르는 검은 해류)', '조풍 (짭조름한 바닷바람)'],
    cafeItemNameKo: '파도소리 소금양갱',
    cafeOrderSpeechKo: '이세 바다 소금이 콕콕 박힌 단짠단짠 「파도소리 소금양갱(潮)」 하나 주시오!',
    happyReactionKo: '은은한 바다 소금기가 단팥의 단맛을 확 살려주는군! 파도 소리가 들리는 듯하오!',
    angryReactionKo: '물(氵)에 아침(朝)이 합쳐져야 밀물 조(潮)지! 맹탕을 주면 어떡하오 ㅋㅋ',
  },
  {
    id: 'shiosai-22-so',
    character: '騒',
    huneum: '떠들 소',
    meaningKo: '술렁이다, 소란스럽다, 파도 소리',
    readingGuideKo: '음독 ソウ(소우) / 훈독 さわ・ぐ(사와구)',
    koreanSoundTip: "한국 음 '소(소란·소동)' → 일본 음독 ソウ(소우)! 훈독 さわぐ(사와구)는 시끄럽게 떠들면 '사와! 구만(그만) 떠들어!'",
    radicalBreakdown: '馬(말 마) + 又(손 우) + 虫(벌레 충)',
    storyMnemonicKo: '말(馬) 등에 벌레(虫)가 달라붙어 손(又)으로 쫓느라 히히힝 발을 구르며 요란하게 술렁이는 모습이에요!',
    visualPictogram: '🐎🐝🔊',
    quoteKo: '「갯바위 내음과 파도 소리 사이로, 두 사람의 젊은 숨결이 포개어졌다.」',
    compoundsKo: ['조소 (술렁이는 파도 소리)', '훤소 (시끌벅적한 소음과 소란)', '물소 (뒤숭숭하고 어수선함)'],
    cafeItemNameKo: '갯바위 사이다',
    cafeOrderSpeechKo: '파도 거품처럼 보글보글 톡 쏘는 「갯바위 사이다(騒)」 시원하게 한 병 따 주시오!',
    happyReactionKo: '캬아! 입안에서 탄산이 파도 소리처럼 신나게 터지는군! 속이 다 시원하오!',
    angryReactionKo: '말(馬)이 발 구르는 떠들 소(騒) 자가 아니잖소! 손님들 소란 피우기 전에 얼른 바꾸시오 ㅋㅋ',
  },
  {
    id: 'shiosai-23-kai',
    character: '海',
    huneum: '바다 해',
    meaningKo: '바다, 대양',
    readingGuideKo: '음독 カイ(카이) / 훈독 うみ(우미)',
    koreanSoundTip: "한국 음 '해(심해·해변)' → 일본 음독 カイ(카이)! ㅎ→ㅋ 법칙('해→카이')! 훈독 うみ(우미)는 '우미(바다)가 우미(어미) 품처럼 넓다!'",
    radicalBreakdown: '氵(물 수) + 毎(매양 매·어머니 모母 변형)',
    storyMnemonicKo: '모든 생명을 품어 기르는 어머니(毎)처럼 날마다 끝없이 출렁이는 거대한 물(氵), 푸른 바다예요!',
    visualPictogram: '🌊🐳🏝️',
    quoteKo: '「이백 단의 돌계단을 올라 뒤돌아보면, 태고 그대로의 이세 바다가 한눈에 내려다보인다.」',
    compoundsKo: ['풍요의 바다 (미시마 최후의 4부작 대하소설)', '해원 (드넓게 펼쳐진 바다 벌판)', '심해 (빛이 닿지 않는 깊은 바다)'],
    cafeItemNameKo: '이세 바다 심벽차(푸른 블렌드티)',
    cafeOrderSpeechKo: '태고의 바다빛을 그대로 담은 푸른 「이세 바다 심벽차(海)」 한 잔 부탁하오!',
    happyReactionKo: '찻잔 속에 깊고 푸른 대양이 펼쳐지는군! 가슴이 확 트이는 맛이오!',
    angryReactionKo: '물(氵) 옆에 매양 매(毎)가 있어야 바다 해(海)지! 산으로 배가 가겠소 ㅋㅋ',
  },
  {
    id: 'shiosai-24-ho',
    character: '豊',
    huneum: '풍년 풍',
    meaningKo: '풍요롭다, 넉넉하다, 풍년',
    readingGuideKo: '음독 ホウ(호우) / 훈독 ゆた・か(유타카)',
    koreanSoundTip: "한국 음 '풍(풍부·풍작)' → 일본 음독 ホウ(호우)! ㅍ→ㅎ(ホ) + ㅇ→우(ウ) = '풍 → 호우'! 훈독은 '유타카(넉넉함)'!",
    radicalBreakdown: '曲(굽을 곡·곡식 다발 바구니) + 豆(콩 두·제기 그릇)',
    storyMnemonicKo: '높은 제사 그릇(豆) 위로 잘 익은 곡식 이삭(曲)이 수북하게 산처럼 쌓인 풍년 잔치상 모양이에요!',
    visualPictogram: '🌾🥣🌕',
    quoteKo: '「달빛에 비친 사막은 풍요의 바다라는 이름에 걸맞은 죽음의 정적을 머금고 있었다.」',
    compoundsKo: ['풍요 (넉넉하고 비옥함)', '풍부 (모자람 없이 넉넉함)', '풍작 (농사가 아주 잘된 풍년)'],
    cafeItemNameKo: '풍요 꿀고구마 단팥죽(젠자이)',
    cafeOrderSpeechKo: '달콤한 꿀고구마가 듬뿍 들어간 「풍요 꿀고구마 젠자이(豊)」 한 사발 푸짐하게 주시오!',
    happyReactionKo: '그릇이 넘치도록 풍성하고 달콤하군! 마음까지 부자가 된 기분이오!',
    angryReactionKo: '제기(豆) 위에 곡식(曲) 쌓인 풍년 풍(豊)을 달랬더니 흉년을 내왔잖소 ㅋㅋ',
  },
  {
    id: 'shiosai-25-jo',
    character: '饒',
    huneum: '넉넉할 요',
    meaningKo: '비옥하다, 풍성하다, 수다스럽다',
    readingGuideKo: '음독 ジョウ(죠우)·ニョウ(뇨우) / 훈독 ゆた・か(유타카)',
    koreanSoundTip: "한국 '풍요(豊饒)' → 일본 '호우죠우(ほうじょう)'! '요 → 죠우(ジョウ)'로 짝꿍 단어 통째로 기억하면 끝!",
    radicalBreakdown: '飠(밥 식) + 堯(높을 요: 흙土 세 개 + 兀)',
    storyMnemonicKo: '맛있는 먹을거리(飠)가 흙더미 세 개(垚)를 높이 쌓아 올린 것처럼(堯) 차고 넘치게 풍성한 모습이에요!',
    visualPictogram: '🍱⛰️✨',
    quoteKo: '「허무의 한가운데에서만 진정한 풍요가 존재하는 것인지도 몰랐다.」',
    compoundsKo: ['풍요 (만물이 넉넉하고 기름짐)', '요설 (말이 넘쳐흐르듯 수다스러움, 다변)'],
    cafeItemNameKo: '풍요 말차 만주',
    cafeOrderSpeechKo: '진한 말차 앙금이 꽉 들어찬 「풍요 말차 만주(饒)」 하나 따뜻하게 내어주시오!',
    happyReactionKo: '한입 베어 물자 진한 말차 향이 차고 넘치는군! 진정한 풍요(豊饒)의 맛이오!',
    angryReactionKo: '밥 식(飠) 변에 높을 요(堯)가 붙은 넉넉할 요(饒) 자요! 속 빈 만주는 사양이오 ㅋㅋ',
  },
  {
    id: 'shiosai-26-ha',
    character: '波',
    huneum: '물결 파',
    meaningKo: '파도, 물결',
    readingGuideKo: '음독 ハ(하) / 훈독 なみ(나미)',
    koreanSoundTip: "한국 음 '파(파도·전파)' → 일본 음독 ハ(하)! ㅍ→ㅎ(ハ) 법칙! 훈독 なみ(나미)는 '쓰나미(津波)'와 원피스 항해사 '나미'!",
    radicalBreakdown: '氵(물 수) + 皮(가죽 피)',
    storyMnemonicKo: '바람이 불 때마다 바다 수면의 물(氵) 껍질·가죽(皮)이 주름지며 철썩철썩 밀려오는 하얀 파도예요!',
    visualPictogram: '🌊🏄‍♂️💨',
    quoteKo: '「거칠게 날뛰는 파도 따위 아랑곳하지 않고, 신지는 바다로 몸을 던졌다.」',
    compoundsKo: ['백파 (하얀 거품을 일으키며 부서지는 파도)', '파도 (거세게 몰아치는 큰 물결)', '잔물결 (바람에 잘게 이는 물결)'],
    cafeItemNameKo: '백파 낙안(파도 무늬 다식)',
    cafeOrderSpeechKo: '하얗게 부서지는 파도 모양 「백파 낙안(波)」 한 접시 멋지게 담아주시오!',
    happyReactionKo: '파도 거품처럼 입안에서 사르르 부서지는 품격 있는 단맛이로군!',
    angryReactionKo: '물(氵)의 가죽(皮)이 물결 파(波)인데, 다른 글자에 휩쓸려 가셨소?! ㅋㅋ',
  },
  {
    id: 'shiosai-27-gyo',
    character: '漁',
    huneum: '고기 잡을 어',
    meaningKo: '고기잡이, 어업',
    readingGuideKo: '음독 ギョ(교)·リョウ(료우)',
    koreanSoundTip: "한국 음 '어(어부·어선)' → 일본 음독 ギョ(교)/リョウ(료우)! '인어=닝교, 금붕어=킨교'처럼 물고기 어 계열은 무조건 ギョ!",
    radicalBreakdown: '氵(물 수) + 魚(물고기 어)',
    storyMnemonicKo: '푸른 바닷물(氵) 속으로 그물을 던져 싱싱한 물고기(魚)를 건져 올리는 씩씩한 어부의 고기잡이예요! (물氵 없으면 그냥 물고기 魚!)',
    visualPictogram: '🌊🐟🎣',
    quoteKo: '「젊은 어부의 다부진 팔뚝은 바닷바람과 햇볕에 그을려 적동색으로 빛나고 있었다.」',
    compoundsKo: ['어부 (고기잡이를 생업으로 하는 사람)', '어선 (고기잡이 배)', '어화 (밤바다 고기잡이 배가 밝히는 집어등 불빛)'],
    cafeItemNameKo: '어화 호지차 라떼',
    cafeOrderSpeechKo: '밤바다 고기잡이 불빛처럼 포근한 「어화 호지차 라떼(漁)」 한 잔 거품 풍성하게 주시오!',
    happyReactionKo: '바닷바람 맞고 들어와 마시니 구수한 우유 거품이 몸을 사르르 녹여주는군!',
    angryReactionKo: '물(氵)에서 물고기(魚) 잡는 고기 잡을 어(漁)를 달랬더니 빈 그물만 주시오 ㅋㅋ',
  },
  {
    id: 'shiosai-28-to',
    character: '島',
    huneum: '섬 도',
    meaningKo: '섬',
    readingGuideKo: '음독 トウ(토우) / 훈독 しま(시마)',
    koreanSoundTip: "한국 음 '도(열도·고도)' → 일본 음독 トウ(토우)! ㄷ→ㅌ 법칙! 훈독 しま(시마)는 주인공 '미시마(三島 = 세 개의 섬)'의 바로 그 시마!",
    radicalBreakdown: '鳥(새 조, 발 점 생략) + 山(메 산)',
    storyMnemonicKo: '망망대해 한가운데 바위산(山)이 솟아 있어 바닷새(鳥)가 날아와 날개를 쉬어 가는 외딴 섬 모양이에요!',
    visualPictogram: '🏝️⛰️🕊️',
    quoteKo: '「우타지마는 인구 천사백 명, 둘레가 일 리도 채 안 되는 작은 섬이다.」',
    compoundsKo: ['우타지마 (『조소』의 무대인 노래섬)', '고도 (바다 한가운데 외롭게 떨어진 섬)', '도민 (섬에 사는 주민들)'],
    cafeItemNameKo: '우타지마 감귤 젤리',
    cafeOrderSpeechKo: '섬 해풍 맞고 자란 귤로 만든 상큼한 「우타지마 감귤 젤리(島)」 하나 주시겠어요?',
    happyReactionKo: '우타지마의 햇살과 바닷바람이 입안 가득 상큼하게 퍼지네요! 최고예요!',
    angryReactionKo: '새(鳥)가 앉은 산(山), 섬 도(島) 자가 아니잖아요! 배 잘못 타셨어요 ㅋㅋ',
  },
  {
    id: 'shiosai-29-shu',
    character: '舟',
    huneum: '배 주',
    meaningKo: '작은 배, 조각배',
    readingGuideKo: '음독 シュウ(슈우) / 훈독 ふね(후네)·ふな-(후나)',
    koreanSoundTip: "한국 음 '주(고주·방주)' → 일본 음독 シュウ(슈우)! ㅈ→ㅅ(シュ) 법칙! 훈독 ふね(후네)는 돛단배에 바람을 '후~네!' 불어 보내기!",
    radicalBreakdown: '舟(배 주 제부수: 뾰족한 뱃머리 丿 + 긴 선체 + 노·칸막이 점 두 개)',
    storyMnemonicKo: '위에서 내려다본 날렵한 통나무 조각배 모양 그대로! 가운데 가로줄은 뱃전이고 점 두 개는 노와 좌석이에요!',
    visualPictogram: '🛶🌊🎋',
    quoteKo: '「물결 사이에 흔들리는 한 척의 조각배처럼, 운명은 아직 정해지지 않았다.」',
    compoundsKo: ['조각배 (물결에 흔들리는 작은 배)', '고주 (넓은 바다에 홀로 떠 있는 외로운 배)', '댓잎배 (대나무 잎으로 접어 띄운 장난감 배)'],
    cafeItemNameKo: '댓잎배 쑥떡(쿠사모치)',
    cafeOrderSpeechKo: '푸른 댓잎을 조각배처럼 감싼 향긋한 「댓잎배 쑥떡(舟)」 하나 싸 주시오!',
    happyReactionKo: '은은한 댓잎 향과 쫄깃한 쑥떡의 조화가 일품이군! 순항할 맛이오!',
    angryReactionKo: '날렵한 조각배 주(舟)를 시켰는데 엉뚱한 판자를 띄워 보내면 가라앉잖소 ㅋㅋ',
  },
  {
    id: 'shiosai-30-ran',
    character: '嵐',
    huneum: '폭풍 람',
    meaningKo: '폭풍우, 거센 산바람',
    readingGuideKo: '음독 ラン(란) / 훈독 あらし(아라시)',
    koreanSoundTip: "한국 음 '람' → 일본 음독 ラン(란)! 받침 ㅁ→ㄴ 법칙! 훈독 あらし(아라시)는 전설의 국민 아이돌 그룹 '아라시(嵐)' 바로 그 한자!",
    radicalBreakdown: '山(메 산) + 風(바람 풍)',
    storyMnemonicKo: '높은 산(山) 꼭대기에서 거센 바람(風)이 휘몰아치며 비구름을 쏟아내는 맹렬한 폭풍우예요!',
    visualPictogram: '⛰️🌪️⚡',
    quoteKo: '「폭풍우 치던 밤, 관측탑의 어둠 속에서 두 사람의 만남은 운명이 되었다.」',
    compoundsKo: ['모래폭풍 (거세게 휘몰아치는 모래바람)', '춘람 (봄꽃을 흔드는 거센 봄 폭풍)', '람설 (휘몰아치는 눈보라 폭풍설)'],
    cafeItemNameKo: '폭풍의 밤 생강차',
    cafeOrderSpeechKo: '밖은 비바람 폭풍우요! 몸속까지 뜨끈하게 데워줄 「폭풍의 밤 생강차(嵐)」 한 잔 주시오!',
    happyReactionKo: '크으~ 알싸하고 뜨거운 생강 기운에 폭풍우에 언 몸이 단번에 녹는구려!',
    angryReactionKo: '산(山) 아래 바람(風)이 부는 폭풍 람(嵐)이 아니잖소! 추워서 오들오들 떨리오 ㅋㅋ',
  },
  {
    id: 'shiosai-31-hin',
    character: '浜',
    huneum: '물가 빈',
    meaningKo: '해변, 바닷가, 모래사장',
    readingGuideKo: '음독 ヒン(힌) / 훈독 はま(하마)',
    koreanSoundTip: "한국 음 '빈(해빈)' → 일본 음독 ヒン(힌)! ㅂ→ㅎ(ヒ) 법칙! 훈독 はま(하마)는 '요코하마(横浜 = 옆으로 펼쳐진 해변)'의 하마!",
    radicalBreakdown: '氵(물 수) + 兵(병사 병: 언덕 丘 + 두 다리 ハ)',
    storyMnemonicKo: '바닷물(氵)과 완만한 모래 언덕(丘)이 나란히 맞닿아 두 발(ハ)로 맨발 산책하기 좋은 바닷가 해변이에요!',
    visualPictogram: '🏖️👣🐚',
    quoteKo: '「하츠에는 하얀 입김을 내쉬며 아무도 없는 아침 해변을 걸었다.」',
    compoundsKo: ['해변 (파도가 밀려오는 바닷가)', '해빈 (바닷가 모래사장)', '시라하마 (눈부시게 하얀 모래 해변)'],
    cafeItemNameKo: '해변 진주 사탕과자',
    cafeOrderSpeechKo: '아침 해변의 조개 진주처럼 영롱한 「해변 진주 사탕과자(浜)」 하나 주시겠어요?',
    happyReactionKo: '어머, 바닷가 진주알처럼 예쁘고 달콤해요! 소중히 아껴 먹을게요!',
    angryReactionKo: '물(氵) 옆에 병(兵)이 서 있는 해변 빈(浜) 자가 아니에요! 길을 잃었나 봐요 ㅋㅋ',
  },
  {
    id: 'shiosai-32-sa',
    character: '砂',
    huneum: '모래 사',
    meaningKo: '모래, 백사장',
    readingGuideKo: '음독 サ(사)·シャ(샤) / 훈독 すな(스나)',
    koreanSoundTip: "한국 음 '사(사막·백사장)' → 일본 음독 サ(사) 완전 동일! 훈독 すな(스나)는 모래알이 발가락 사이로 '스나(스르르 나)가네!'",
    radicalBreakdown: '石(돌 석) + 少(적을 소·작다)',
    storyMnemonicKo: '단단한 바위 돌(石)이 파도에 천년만년 부서져 아주 작고 잘게(少) 쪼개진 고운 모래알이에요! 원리 그대로죠!',
    visualPictogram: '🪨⏳🏖️',
    quoteKo: '「깨끗한 백사장 위에 두 사람의 젖은 발자국이 새겨졌다.」',
    compoundsKo: ['백사 (눈처럼 깨끗하고 하얀 모래)', '모래사장 (모래가 펼쳐진 바닷가)', '사막 (모래만 끝없이 펼쳐진 메마른 땅)'],
    cafeItemNameKo: '백사장 인절미(키나코모치)',
    cafeOrderSpeechKo: '하얀 모래사장처럼 고소한 콩고물 듬뿍 묻힌 「백사장 인절미(砂)」 한 접시 주세요!',
    happyReactionKo: '고운 모래처럼 보드라운 콩고물에 쫄깃한 떡이라니! 입안이 행복해요!',
    angryReactionKo: '돌(石)이 작아진(少) 모래 사(砂)를 달랬더니 큰 바윗덩이를 주시면 이 나가요 ㅋㅋ',
  },
  {
    id: 'shiosai-33-ko',
    character: '篝',
    huneum: '화톳불 구',
    meaningKo: '화톳불, 밤바다 횃불 바구니',
    readingGuideKo: '음독 コウ(코우) / 훈독 かがり(카가리)',
    koreanSoundTip: "한국 음 '구' → 일본 음독 コウ(코우)! ㄱ→ㅋ 법칙! 핵심 명대사 단어 '篝火 = かがりび(카가리비: 화톳불)'로 외우면 명장면 완성!",
    radicalBreakdown: '⺮(대나무 죽) + 冓(얽을 구·격자로 짠 철망 바구니)',
    storyMnemonicKo: '대나무(⺮)와 철사를 격자무늬로 촘촘히 얽어 짜서(冓) 그 안에 장작불을 활활 피워 올리는 밤바다 화톳불 바구니예요!',
    visualPictogram: '🎋🧺🔥',
    quoteKo: '「그 불을 뛰어넘어 와. 저 화톳불을 뛰어넘어 온다면……」',
    compoundsKo: ['화톳불 (밤을 밝히며 타오르는 장작불 바구니)', '화톳불 배 (밤바다 불을 밝혀 고기 잡는 배)', '밤화톳불 (어두운 해안을 밝히는 밤의 횃불)'],
    cafeItemNameKo: '화톳불 구운 사과',
    cafeOrderSpeechKo: '『그 불을 뛰어넘어 와!』 뜨거운 불길로 구워낸 「화톳불 구운 사과(篝)」 하나 내어주시오!',
    happyReactionKo: '오오! 화톳불의 열기와 계피 향이 사과 속살까지 달콤하게 배어들었군!',
    angryReactionKo: '대나무(⺮) 바구니(冓) 화톳불 구(篝)를 넘어야 사랑이 이뤄지지! 엉뚱한 불을 짚었소 ㅋㅋ',
  },
  {
    id: 'shiosai-34-sen',
    character: '潜',
    huneum: '잠길 잠',
    meaningKo: '잠수하다, 물속에 잠기다, 숨다',
    readingGuideKo: '음독 セン(센) / 훈독 もぐ・る(모구루)·ひそ・む(히소무)',
    koreanSoundTip: "한국 음 '잠(잠수·잠복)' → 일본 음독 セン(센)! 받침 ㅁ→ㄴ 법칙! 훈독 もぐる(모구루)는 물속으로 '몸 구르며(모구루) 풍덩 잠수!'",
    radicalBreakdown: '氵(물 수) + 替(바꿀 체: 夫두 사람 + 日해·수면 아래)',
    storyMnemonicKo: '해녀 두 사람(夫+夫)이 햇살(日) 비치는 깊은 바닷물(氵) 속으로 숨을 참고 풍덩 잠수해 전복을 따는 모습이에요!',
    visualPictogram: '🤿🌊🐚',
    quoteKo: '「섬 처녀들은 깊이 물속으로 잠수하여 전복을 찾아 해저를 헤엄쳤다.」',
    compoundsKo: ['잠수 (물속 깊이 들어감)', '잠복 (몰래 몸을 숨기고 기다림)', '잠입 (몰래 스며들어 감)'],
    cafeItemNameKo: '심해 잠수 냉옥로차',
    cafeOrderSpeechKo: '깊은 바닷속으로 잠수한 듯 청량하게 냉침한 「심해 잠수 냉옥로차(潜)」 한 잔 주시오!',
    happyReactionKo: '차갑고 깊은 감칠맛이 온몸 구석구석 스며드는군! 숨이 탁 트이오!',
    angryReactionKo: '물(氵)속 깊이 잠길 잠(潜) 자가 아니잖소! 수면 위에서 허우적대지 마시오 ㅋㅋ',
  },
  {
    id: 'shiosai-35-sei',
    character: '誓',
    huneum: '맹세할 서',
    meaningKo: '맹세하다, 서약하다',
    readingGuideKo: '음독 セイ(세이) / 훈독 ちか・う(치카우)',
    koreanSoundTip: "한국 음 '서(서약·선서)' → 일본 음독 セイ(세이)! ㅅ→ㅅ(セ) 그대로! 훈독 ちかう(치카우)는 새끼손가락 걸고 '변치 말자 치카우!'",
    radicalBreakdown: '折(꺾을 절: 손手 + 도끼斤) + 言(말씀 언)',
    storyMnemonicKo: '만약 약속을 어기면 손에 든 화살을 도끼로 두 동강 꺾겠다(折)고 신 앞에서 엄숙히 말(言)로 다짐하는 굳은 맹세예요!',
    visualPictogram: '🤙⛩️💬',
    quoteKo: '「야시로 신사의 신전에서, 두 사람은 평생의 사랑을 남몰래 맹세했다.」',
    compoundsKo: ['서약 (굳게 다짐하여 약속함)', '맹세 (신이나 양심 앞에 굳게 약속함)', '기서 (신불에게 빌며 굳게 맹세함)'],
    cafeItemNameKo: '신전 맹세 전병(센베이)',
    cafeOrderSpeechKo: '두 사람처럼 변치 않을 약속을 담아 바삭한 「신전 맹세 센베이(誓)」 한 쌍 주시오!',
    happyReactionKo: '바삭! 소리까지 정갈하군! 이 고소한 맛, 평생 잊지 않기로 맹세하겠소!',
    angryReactionKo: '꺾을 절(折) 아래 말씀 언(言)이 있어야 맹세할 서(誓)지! 약속을 어기다니 ㅋㅋ',
  },
  {
    id: 'shiosai-36-shun',
    character: '春',
    huneum: '봄 춘',
    meaningKo: '봄, 청춘',
    readingGuideKo: '음독 シュン(슌) / 훈독 はる(하루)',
    koreanSoundTip: "한국 음 '춘(청춘·춘설)' → 일본 음독 シュン(슌)! 받침 ㄴ→ン(ㄴ) 법칙! 훈독 はる(하루)는 '봄날 하루가 참 따뜻하네!'",
    radicalBreakdown: '三人(세 겹의 풀싹 줄기) + 日(따스한 봄 햇살 일)',
    storyMnemonicKo: '따스한 봄 햇살(日)이 비치자 언 땅을 뚫고 세 겹의 파릇한 새싹(𡗗)이 일제히 기지개를 켜며 피어나는 봄이에요!',
    visualPictogram: '🌸☀️🌱',
    quoteKo: '「봄눈은 엷은 먹빛 하늘에서 흩날려 내려와, 순식간에 손바닥 위에서 녹아 사라졌다.」',
    compoundsKo: ['춘설 (봄날에 내리는 눈)', '봄눈 (미시마 『풍요의 바다』 제1권 제목)', '청춘 (만물이 푸르른 인생의 젊은 봄날)'],
    cafeItemNameKo: '봄눈 벚꽃떡(사쿠라모치)',
    cafeOrderSpeechKo: '은은한 벚잎 향기가 감도는 분홍빛 「봄눈 사쿠라모치(春)」 하나 내어주시겠소?',
    happyReactionKo: '손바닥 위 봄눈처럼 부드럽고 향긋하군… 아련한 봄날의 맛이오!',
    angryReactionKo: '아래에 따스한 해(日)가 받치는 봄 춘(春) 자를 줘야지, 아직 한겨울이오?! ㅋㅋ',
  },
  {
    id: 'shiosai-37-setsu',
    character: '雪',
    huneum: '눈 설',
    meaningKo: '눈, 백설',
    readingGuideKo: '음독 セツ(세츠) / 훈독 ゆき(유키)',
    koreanSoundTip: "한국 음 '설(폭설·설국)' → 일본 음독 セツ(세츠)! ㅅ→セ + 받침 ㄹ→ツ 공식! 훈독 ゆき(유키)는 일본 영화·노래 단골 단어 '유키(눈)'!",
    radicalBreakdown: '雨(비 우) + ヨ(비질할 혜·빗자루 손 모양)',
    storyMnemonicKo: '하늘에서 내리는 빗방울(雨)이 추위에 얼어붙어 마당에서 빗자루(ヨ)로 쓸어 모을 수 있게 쌓이는 하얀 눈이에요!',
    visualPictogram: '❄️🌨️🧹',
    quoteKo: '「내리는 눈소리마저 들릴 듯한, 귀족 저택의 깊은 정적이었다.」',
    compoundsKo: ['잔설 (봄이 와도 녹지 않고 남아 있는 눈)', '눈보라 (거센 바람과 함께 휘몰아치는 눈)', '백설 (티 없이 새하얀 눈)'],
    cafeItemNameKo: '담설갱(봄눈 거품 양갱)',
    cafeOrderSpeechKo: '입에 닿자마자 첫눈처럼 사르르 녹는 새하얀 「담설갱(雪)」 한 조각 부탁하오!',
    happyReactionKo: '사락사락 눈 내리는 정원이 눈앞에 그려지는 듯 담백하고 우아하군!',
    angryReactionKo: '비 우(雨) 아래 빗자루(ヨ)가 달린 눈 설(雪)이 아니잖소! 비 맞고 가란 말이오 ㅋㅋ',
  },
  {
    id: 'shiosai-38-sui',
    character: '衰',
    huneum: '쇠할 쇠',
    meaningKo: '쇠퇴하다, 시들다, 기운이 다하다',
    readingGuideKo: '음독 スイ(스이) / 훈독 おとろ・える(오토로에루)',
    koreanSoundTip: "한국 음 '쇠(쇠퇴·쇠약)' → 일본 음독 スイ(스이)! '쇠 → 스이' 소리 쌍둥이! 훈독 おとろえる는 기력이 떨어져 '오~ 도로 에루(애를) 먹네!'",
    radicalBreakdown: '衣(옷 의 위아래 분리: 亠 + 𧘇) + 口(입 구) + 一(가운데 꿰맨 줄)',
    storyMnemonicKo: '화려하던 천인의 옷(衣) 한가운데가 해지고 구멍(口)에 지푸라기 줄(一)이 덧대어질 만큼 시들고 쇠약해진 모습이에요!',
    visualPictogram: '🥀👘⏳',
    quoteKo: '「머리 위의 화관은 시들고 겨드랑이에서 땀이 흘러나오니, 이야말로 천인오쇠의 징조였다.」',
    compoundsKo: ['천인오쇠 (하늘의 천인이 수명이 다할 때 나타나는 다섯 가지 쇠락 징조)', '쇠퇴 (기세나 힘이 꺾여 기움)', '쇠약 (몸이나 기운이 약해짐)'],
    cafeItemNameKo: '오쇠 시든꽃 허브차',
    cafeOrderSpeechKo: '덧없는 화관의 향기를 머금은 은은한 「오쇠 꽃차(衰)」 한 잔 따뜻하게 우려주시오!',
    happyReactionKo: '지고 난 꽃잎에서 오히려 이토록 깊은 향기가 우러나다니… 덧없어 더 아름답군!',
    angryReactionKo: '옷(衣) 한가운데가 해진 쇠할 쇠(衰) 자가 아니잖소! 내 기력부터 쇠약해지겠소 ㅋㅋ',
  },
  {
    id: 'shiosai-39-taki',
    character: '滝',
    huneum: '폭포 륭(용)',
    meaningKo: '폭포, 급류',
    readingGuideKo: '음독 ロウ(로우) / 훈독 たき(타키)',
    koreanSoundTip: "훈독 たき(타키)가 압도적 핵심! 절벽에서 물줄기가 바위를 '탁! 키!(타키)' 치며 쏟아지는 폭포! (『너의 이름은』 주인공 '타키(瀧/滝)' 바로 그 글자!)",
    radicalBreakdown: '氵(물 수) + 竜(용 룡 신자체: 立 + 電 아랫부분)',
    storyMnemonicKo: '절벽 위에서 거대한 승천하는 용(竜)처럼 하얀 물기둥(氵)이 콸콸 쏟아져 내리는 장엄한 폭포예요!',
    visualPictogram: '🌊🐉🏞️',
    quoteKo: '「다시 만나자. 꼭 만날 거야. 폭포 아래에서.」',
    compoundsKo: ['폭포 아래 (『봄눈』의 키요아키가 환생을 기약한 약속의 장소)', '용소 (폭포수가 떨어져 패인 깊은 웅덩이)', '급류 (폭포처럼 세차게 흐르는 산강)'],
    cafeItemNameKo: '폭포 물보라 냉침차',
    cafeOrderSpeechKo: '『폭포 아래서 다시 만나자!』 물보라처럼 청량한 「폭포 냉침차(滝)」 한 잔 주시오!',
    happyReactionKo: '시원한 폭포수를 머리부터 뒤집어쓴 듯 정신이 번쩍 들 만큼 맑은 차로군!',
    angryReactionKo: '물(氵) 옆에 용(竜)이 꿈틀대는 폭포(滝)를 달랬더니 웬 고인 물을 주시오 ㅋㅋ',
  },
  {
    id: 'shiosai-40-jaku',
    character: '寂',
    huneum: '고요할 적',
    meaningKo: '고요하다, 쓸쓸하다, 적막',
    readingGuideKo: '음독 ジャク(쟈쿠)·セキ(세키) / 훈독 さび・しい(사비시이)',
    koreanSoundTip: "한국 음 '적(정적·적막)' → 일본 음독 ジャク(쟈쿠)/セキ(세키)! 받침 ㄱ→쿠/키! 훈독 さびしい(사비시이: 쓸쓸하다)는 일본 감성 필수어!",
    radicalBreakdown: '宀(집 면) + 叔(아재비 숙: 上 + 小 + 又)',
    storyMnemonicKo: '깊은 산사 지붕(宀) 아래 아주 작은(小) 소리마저 손(又)으로 거두어 아무것도 남지 않은 절대 정적의 상태예요!',
    visualPictogram: '🏯🍂🤫',
    quoteKo: '「그 밖에는 아무런 소리 하나 없이 적막하기 그지없다. 이 정원에는 아무것도 없다.」',
    compoundsKo: ['적막 (아무 소리 없이 고요하고 쓸쓸함)', '적정 (번뇌가 사라진 고요한 평온)', '적료 (마음이 텅 빈 듯 쓸쓸하고 고요함)'],
    cafeItemNameKo: '적정 가레산스이(모래정원) 다식',
    cafeOrderSpeechKo: '한여름 매미 소리마저 멎은 듯 고요한 「적정 모래정원 다식(寂)」 하나 내어주시오!',
    happyReactionKo: '텅 빈 정원의 고요함이 혀끝에 감도는군… 모든 기억이 평화로이 녹아내리오.',
    angryReactionKo: '갓머리(宀) 아래 고요할 적(寂)이 아니잖소! 가게가 너무 시끌벅적하구려 ㅋㅋ',
  },

  // ==========================================================================
  // TIER 3: 仮面の告白と愛憎 (가면의 고백과 애증 — 『가면의 고백』·『금색』·『록명관』 20자)
  // ==========================================================================
  {
    id: 'kamen-41-ka',
    character: '仮',
    huneum: '거짓 가',
    meaningKo: '가면, 임시, 거짓',
    readingGuideKo: '음독 カ(카)·ケ(케) / 훈독 かり(카리)',
    koreanSoundTip: "한국 음 '가(가면·가설)' → 일본 음독 カ(카)! ㄱ→ㅋ 법칙! 훈독 かり(카리)는 '잠시 빌려 쓴 임시(카리) 가면'!",
    radicalBreakdown: '亻(사람 인) + 反(돌이킬 반: 厂절벽 덮개 + 又손)',
    storyMnemonicKo: '사람(亻)이 손(又)으로 원래 얼굴을 반대로(反) 가리고 뒤집어쓴 연극용 임시 가면이에요!',
    visualPictogram: '🎭🙈✨',
    quoteKo: '「나는 가면을 쓰고, 그것을 진짜 민낯이라고 사람들에게 믿게 만들었다.」',
    compoundsKo: ['가면 (얼굴을 감추기 위해 쓰는 탈, 페르소나)', '가상 (실체가 아닌 겉모습의 환영)'],
    cafeItemNameKo: '가면무도회 다크 쇼콜라',
    cafeOrderSpeechKo: '가면 뒤의 비밀처럼 쌉싸름한 「가면무도회 쇼콜라(仮)」 한 조각 내어주시오!',
    happyReactionKo: '달콤함 뒤에 숨은 진한 카카오의 쓴맛… 완벽한 가면의 맛이로군!',
    angryReactionKo: '사람(亻) 옆에 반(反)이 붙은 거짓 가(仮) 자요! 가면이 벗겨지겠소 ㅋㅋ',
  },
  {
    id: 'kamen-42-men',
    character: '面',
    huneum: '낯 면',
    meaningKo: '얼굴, 가면, 표면',
    readingGuideKo: '음독 メン(멘) / 훈독 おも(오모)·つら(츠라)',
    koreanSoundTip: "한국 음 '면(가면·대면)' → 일본 음독 メン(멘) 소리 거의 동일! 검도 머리 보호대 '멘(面)'도 바로 이 얼굴 한자!",
    radicalBreakdown: '面(낯 면 제부수: 이마 一 + 얼굴 윤곽 囗 + 코·눈동자 눈금)',
    storyMnemonicKo: '이마(一) 아래 네모난 얼굴 테두리 안에 콧대와 눈망울이 또렷이 그려진 정면 얼굴 모양 그대로예요!',
    visualPictogram: '😊🪞🎭',
    quoteKo: '「거울에 비친 내 얼굴은 어느새 가면 그 자체가 되어 있었다.」',
    compoundsKo: ['가면 (얼굴에 쓰는 탈)', '모습·자취 (마음속에 떠오르는 얼굴 모습)', '대면 (서로 얼굴을 마주 봄)'],
    cafeItemNameKo: '민낯 마주보기 네리키리',
    cafeOrderSpeechKo: '매끄러운 얼굴처럼 정성껏 빚은 「민낯 네리키리(面)」 하나 마주 보며 맛봅시다!',
    happyReactionKo: '가면을 벗고 마주한 것처럼 진실하고 고운 단팥 맛이구려!',
    angryReactionKo: '네모난 얼굴 윤곽의 낯 면(面) 자도 못 알아보시오? 체면 안 서게스리 ㅋㅋ',
  },
  {
    id: 'kamen-43-koku',
    character: '告',
    huneum: '고할 고',
    meaningKo: '고백하다, 알리다, 선고하다',
    readingGuideKo: '음독 コク(코쿠) / 훈독 つ・げる(츠게루)',
    koreanSoundTip: "한국 음 '고(고백·경고)' → 일본 음독 コク(코쿠)! '고백 = 코쿠하쿠(こくはく)'는 드라마·애니 고백 장면에 100% 나오는 단어!",
    radicalBreakdown: '牛(소 우, 아래 꼬리 생략) + 口(입 구)',
    storyMnemonicKo: '신에게 귀한 제물 소(牛)를 바치며 입(口)을 열어 마음속 깊은 비밀을 엄숙히 털어놓는 고백이에요!',
    visualPictogram: '💌🗣️🕯️',
    quoteKo: '「이 수기는 누구에게도 털어놓을 수 없는 나의 진실한 고백이다.」',
    compoundsKo: ['고백 (마음속 진실을 숨김없이 털어놓음)', '예고 (미리 알림)', '선고 (엄숙하게 판결이나 결정을 알림)'],
    cafeItemNameKo: '은밀한 고백 핸드드립 커피',
    cafeOrderSpeechKo: '비밀을 털어놓는 밤에 어울리는 진한 「고백 커피(告)」 한 잔 조용히 내려주시오!',
    happyReactionKo: '깊게 볶은 원두의 묵직한 향기가 진심 어린 고백처럼 가슴에 스미는군!',
    angryReactionKo: '소(牛) 아래 입(口)이 달린 고할 고(告) 자요! 엉뚱한 사람한테 고백할 뻔했잖소 ㅋㅋ',
  },
  {
    id: 'kamen-44-haku',
    character: '白',
    huneum: '흰 백',
    meaningKo: '희다, 순백, 솔직히 밝히다',
    readingGuideKo: '음독 ハク(하쿠)·ビャク(뱌쿠) / 훈독 しろ・い(시로이)',
    koreanSoundTip: "한국 음 '백(고백·순백)' → 일본 음독 ハク(하쿠)! ㅂ→ㅎ(ハ) + 받침 ㄱ→쿠(ク)! 훈독 しろい(시로이)는 강아지 '흰둥이(시로)'!",
    radicalBreakdown: '丿(빛살 한 줄기) + 日(해 일)',
    storyMnemonicKo: '아침 해(日) 위로 첫 빛줄기(丿)가 삐죽 솟아올라 온 세상이 하얗게 밝아지는 눈부신 순백의 빛이에요!',
    visualPictogram: '🤍🕯️❄️',
    quoteKo: '「백자 같은 육체 위로 선명한 붉은 피가 방울져 떨어졌다.」',
    compoundsKo: ['고백 (마음을 하얗고 깨끗하게 다 털어놓음)', '순백 (티끌 하나 없이 새하얌)', '결백 (아무런 죄나 허물 없이 깨끗함)'],
    cafeItemNameKo: '순백 눈꽃 우유푸딩',
    cafeOrderSpeechKo: '백자처럼 매끈하고 새하얀 「순백 눈꽃 우유푸딩(白)」 위에 베리 소스를 얹어주시오!',
    happyReactionKo: '티 없이 하얗고 보드라운 우유 푸딩이 입안에서 사르르 녹는군!',
    angryReactionKo: '해(日) 위에 삐침(丿) 하나 얹은 흰 백(白) 자잖소! 해 일(日)이랑 헷갈리지 마시오 ㅋㅋ',
  },
  {
    id: 'kamen-45-kin',
    character: '禁',
    huneum: '금할 금',
    meaningKo: '금지하다, 금기',
    readingGuideKo: '음독 キン(킨)',
    koreanSoundTip: "한국 음 '금(금지·출입금지)' → 일본 음독 キン(킨)! 쇠 금(金=キン)과 발음 100% 동일! 받침 ㅁ→ㄴ 법칙!",
    radicalBreakdown: '林(수풀 림: 木+木) + 示(보일 시·신성한 제단)',
    storyMnemonicKo: '신성한 제단(示)을 울창한 나무 숲(林)이 가로막아 "함부로 들어오지 마시오!" 하고 출입을 금지한 금단의 숲이에요!',
    visualPictogram: '🌲⛩️🚫',
    quoteKo: '「슌스케는 청년의 미모를 이용해 금색의 동산으로 여인들을 유혹해 끌어들였다.」',
    compoundsKo: ['금색 (금지된 빛깔, 금기시된 관능적 욕망)', '금단 (건드려서는 안 되는 금기)', '엄금 (엄격하게 금지함)'],
    cafeItemNameKo: '금단의 자색고구마 몽블랑',
    cafeOrderSpeechKo: '한 번 맛보면 멈출 수 없는 매혹적인 「금단의 자색 몽블랑(禁)」 하나 몰래 주시오!',
    happyReactionKo: '크으, 금지된 맛이라 그런지 더욱 달콤하고 치명적이군! 비밀로 해주겠소!',
    angryReactionKo: '숲(林) 아래 제단(示)이 있는 금할 금(禁) 자요! 영업 정지(禁) 당하기 싫으면 잘 보시오 ㅋㅋ',
  },
  {
    id: 'kamen-46-shiki',
    character: '色',
    huneum: '빛 색',
    meaningKo: '색깔, 빛깔, 관능',
    readingGuideKo: '음독 ショク(쇼쿠)·シキ(시키) / 훈독 いろ(이로)',
    koreanSoundTip: "한국 음 '색(색채·경치)' → 일본 음독 ショク(쇼쿠)·シキ(시키)! 받침 ㄱ→쿠/키! 훈독 いろ(이로)는 '이로운 일곱 빛깔 색!'",
    radicalBreakdown: '⺈(구부린 사람) + 巴(꼬리 파·밀착한 모양)',
    storyMnemonicKo: '감정이 북받쳐 몸을 숙인 사람 얼굴에 홍조와 다채로운 표정 빛깔이 확 피어오르는 모양이에요!',
    visualPictogram: '🌈🎨💎',
    quoteKo: '「청년의 냉철한 눈동자에는 온갖 욕망의 빛깔이 비쳤다가 사라졌다.」',
    compoundsKo: ['금색 (금지된 욕망의 색)', '색정 (관능적인 사랑과 욕정)', '경치 (눈앞에 펼쳐진 아름다운 풍경 빛깔)'],
    cafeItemNameKo: '일곱빛깔 보석 코하쿠토(호박당)',
    cafeOrderSpeechKo: '만화경처럼 영롱하게 반짝이는 「일곱빛깔 코하쿠토(色)」 한 접시 내어주시오!',
    happyReactionKo: '바삭 깨물면 무지개색 젤리가 반짝이는군! 눈과 혀가 동시에 황홀하오!',
    angryReactionKo: '고운 빛 색(色) 자를 시켰는데 웬 칙칙한 한자를 가져오셨소 ㅋㅋ',
  },
  {
    id: 'kamen-47-zai',
    character: '罪',
    huneum: '죄 죄',
    meaningKo: '죄, 허물, 죄책감',
    readingGuideKo: '음독 ザイ(자이) / 훈독 つみ(츠미)',
    koreanSoundTip: "한국 음 '죄(범죄·사죄)' → 일본 음독 ザイ(자이)! ㅈ→ㅈ(ザ) 그대로! 훈독 つみ(츠미)는 달콤한 디저트 훔쳐 먹고 '죄책감에 가슴이 츠미(저미)네!'",
    radicalBreakdown: '罒(그물 망) + 非(아닐 비)',
    storyMnemonicKo: '옳지 않은 나쁜 일(非)을 저지르다 법의 촘촘한 그물망(罒)에 딱 걸려든 죄와 허물을 뜻해요!',
    visualPictogram: '🕸️⚖️🍫',
    quoteKo: '「어린 시절의 나는 내가 태어날 때부터 죄를 짊어지고 있다고 느끼고 있었다.」',
    compoundsKo: ['죄악 (도리에 어긋나는 죄와 악행)', '원죄 (인간이 날 때부터 지닌 근원적 죄)', '죄업 (나쁜 업보가 되는 죄)'],
    cafeItemNameKo: '원죄 다크 카카오 트러플',
    cafeOrderSpeechKo: '다이어트 중이지만 죄책감마저 달콤한 「원죄 카카오 트러플(罪)」 하나 주시오!',
    happyReactionKo: '아아, 유죄라도 좋소! 이 진한 생초콜릿 맛은 용서받을 수 없을 만큼 맛있군!',
    angryReactionKo: '그물(罒) 아래 아닐 비(非)가 든 죄 죄(罪) 자요! 오주문이야말로 중죄요 ㅋㅋ',
  },
  {
    id: 'kamen-48-gi',
    character: '偽',
    huneum: '거짓 위',
    meaningKo: '거짓, 가짜, 위선',
    readingGuideKo: '음독 ギ(기) / 훈독 いつわ・る(이츠와루)·にせ(니세)',
    koreanSoundTip: "한국 음 '위(위선·허위)' → 일본 음독 ギ(기)! 훈독 にせ(니세)는 한국에서도 통하는 일본어 '니세모노(가짜·짝퉁)'의 니세!",
    radicalBreakdown: '亻(사람 인) + 為(할 위: 손으로 꾸며 만들다)',
    storyMnemonicKo: '자연스러운 진심이 아니라 사람(亻)이 인위적으로 꾸며 만든(為) 가짜 표정과 거짓말이에요!',
    visualPictogram: '🤥🎭🍰',
    quoteKo: '「내 생활의 모든 것은 거짓이었으며, 나는 거짓 감정을 끊임없이 연기했다.」',
    compoundsKo: ['위선 (겉으로만 착한 척 꾸미는 거짓 선행)', '허위 (진실이 아닌 거짓)', '가짜 (진짜를 흉내 내 만든 모조품)'],
    cafeItemNameKo: '거짓의 금박 오페라 케이크',
    cafeOrderSpeechKo: '화려한 무대 장식 같은 「금박 오페라 케이크(偽)」 한 조각 주시오! 맛만큼은 진짜로!',
    happyReactionKo: '이름은 거짓(偽)이지만 겹겹이 쌓인 커피 버터크림 맛은 100% 진짜 명품이군!',
    angryReactionKo: '사람(亻)이 꾸민(為) 거짓 위(偽) 자를 달랬더니 진짜로 짝퉁 한자를 내오다니 ㅋㅋ',
  },
  {
    id: 'kamen-49-chi',
    character: '恥',
    huneum: '부끄러울 치',
    meaningKo: '부끄러움, 수치심, 수줍음',
    readingGuideKo: '음독 チ(치) / 훈독 は・ずかしい(하즈카시이)·はじ(하지)',
    koreanSoundTip: "한국 음 '치(수치·후안무치)' → 일본 음독 チ(치) 100% 똑같음! 훈독 はずかしい(하즈카시이: 부끄러워~)도 일상 초빈출!",
    radicalBreakdown: '耳(귀 미) + 心(마음 심)',
    storyMnemonicKo: '마음(心)이 너무 부끄러우면 귓불(耳)까지 새빨갛게 달아오르는 모습! 귀(耳)+마음(心)=부끄러울 치(恥), 천재적인 글자죠!',
    visualPictogram: '👂💓😳',
    quoteKo: '「성 세바스찬의 그림을 보았을 때, 격렬한 수치심과 환희가 나를 꿰뚫었다.」',
    compoundsKo: ['수치 (부끄럽고 창피한 마음)', '치욕 (부끄럽고 욕된 일)', '치부 (남에게 감추고 싶은 부끄러운 비밀)'],
    cafeItemNameKo: '홍조 띤 사과 파이',
    cafeOrderSpeechKo: '부끄러워 빨개진 볼처럼 잘 익은 「홍조 띤 사과 파이(恥)」 한 조각 따끈하게 주시오!',
    happyReactionKo: '새콤달콤한 사과 필링에 내 귓불까지 행복하게 달아오르는군!',
    angryReactionKo: '귀(耳) 옆에 마음(心)이 빨개지는 부끄러울 치(恥) 자요! 틀리니까 부끄럽지 않소?! ㅋㅋ',
  },
  {
    id: 'kamen-50-geki',
    character: '劇',
    huneum: '연극 극',
    meaningKo: '연극, 희곡, 격렬함',
    readingGuideKo: '음독 ゲキ(게키)',
    koreanSoundTip: "한국 음 '극(비극·연극·극장)' → 일본 음독 ゲキ(게키)! ㄱ→ㄱ(ゲ) + 받침 ㄱ→키(キ) 공식 그대로 '비극 = 히게키'!",
    radicalBreakdown: '虍(범 호 머리) + 豕(멧돼지 시) + 刂(선칼 도)',
    storyMnemonicKo: '호랑이(虍)와 멧돼지(豕)가 칼날(刂)처럼 맞붙어 싸우는 것처럼 손에 땀을 쥐게 하는 격렬한 무대 연극이에요!',
    visualPictogram: '🎬🎟️🌹',
    quoteKo: '「내 인생은 관객 없는 극장에서 상연되는 비극에 지나지 않았다.」',
    compoundsKo: ['비극 (슬프고 비참한 결말의 연극)', '극약 (효력이 매우 격렬하고 강한 약)', '극장 (연극이나 공연을 올리는 무대 건물)'],
    cafeItemNameKo: '비극의 진홍 크랜베리 타르트',
    cafeOrderSpeechKo: '벨벳 커튼처럼 새빨간 「비극의 크랜베리 타르트(劇)」 한 조각 드라마틱하게 주시오!',
    happyReactionKo: '강렬한 새콤함이 혀끝에서 한 편의 대작 연극을 펼치는군! 기립박수요!',
    angryReactionKo: '오른쪽에 선칼(刂)이 선 연극 극(劇) 자가 아니잖소! NG요, 다시 찍읍시다 ㅋㅋ',
  },
  {
    id: 'kamen-51-en',
    character: '演',
    huneum: '펼 연',
    meaningKo: '연기하다, 공연하다, 펼치다',
    readingGuideKo: '음독 エン(엔)',
    koreanSoundTip: "한국 음 '연(연기·공연·연출)' → 일본 음독 エン(엔)! '연 → 엔'은 100% 대응 법칙('연기 = 엔기, 공연 = 코우엔')!",
    radicalBreakdown: '氵(물 수) + 寅(동방 인: 지붕 宀 아래 화살을 길게 펴다)',
    storyMnemonicKo: '지붕 있는 무대(宀) 위에서 배우가 물 흐르듯(氵) 몸짓과 감정을 널리 펼쳐 보이는(寅) 명연기예요!',
    visualPictogram: '🎭🌟🍵',
    quoteKo: '「나는 타인이 기대하는 그대로의 『정상적인 소년』을 완벽하게 연기해 보였다.」',
    compoundsKo: ['연기 (배우가 배역의 인물처럼 표현함)', '연극 (무대 위에서 펼쳐 보이는 극)', '공연 (관객 앞에서 연극이나 음악을 선보임)'],
    cafeItemNameKo: '무대 뒤편의 얼그레이 홍차',
    cafeOrderSpeechKo: '완벽한 연기를 마친 배우의 휴식 같은 향긋한 「무대 뒤편 홍차(演)」 한 잔 주시오!',
    happyReactionKo: '베르가못 향이 긴장을 사르르 풀어주는군. 오늘의 주연상은 당신이오!',
    angryReactionKo: '물(氵) 흐르듯 펼치는 펼 연(演) 자를 잊으셨소? 대본 다시 보고 오시오 ㅋㅋ',
  },
  {
    id: 'kamen-52-tan',
    character: '耽',
    huneum: '즐길 탐',
    meaningKo: '탐닉하다, 깊이 빠져들다',
    readingGuideKo: '음독 タン(탄) / 훈독 ふけ・る(후케루)',
    koreanSoundTip: "한국 음 '탐(탐미·탐독)' → 일본 음독 タン(탄)! 받침 ㅁ→ㄴ 법칙으로 '탐미 = 탄비(たんび)' 1초 완성!",
    radicalBreakdown: '耳(귀 미) + 冘(머뭇거릴 유: 덮개 冖 아래 빠져든 사람 儿)',
    storyMnemonicKo: '귀(耳)가 축 늘어지고 머리 위로 이불(冖)을 뒤집어쓴 채 오직 아름다운 예술과 책 속에만 푹 빠져 탐닉하는 모습이에요!',
    visualPictogram: '🍷📖✨',
    quoteKo: '「노작가 히노키 슌스케는 아름다움에의 탐닉이야말로 정신의 복수라고 믿었다.」',
    compoundsKo: ['탐미 (오직 아름다움을 최고 가치로 삼아 깊이 빠짐)', '탐닉 (어떤 일에 정신없이 깊이 빠져듦)', '탐독 (책의 재미에 푹 빠져 열중해 읽음)'],
    cafeItemNameKo: '탐닉의 적포도주 양갱',
    cafeOrderSpeechKo: '루비빛 와인을 머금어 황홀하게 빠져드는 「탐닉의 적포도주 양갱(耽)」 하나 주시오!',
    happyReactionKo: '은은한 포도주 향기에 정신이 아찔할 만큼 탐미적인 맛이로군!',
    angryReactionKo: '귀(耳) 변의 즐길 탐(耽) 자가 아니잖소! 흥이 다 깨져버렸구려 ㅋㅋ',
  },
  {
    id: 'kamen-53-shi',
    character: '矢',
    huneum: '화살 시',
    meaningKo: '화살',
    readingGuideKo: '음독 シ(시) / 훈독 や(야)',
    koreanSoundTip: "한국 음 '시(궁시·효시)' → 일본 음독 シ(시) 완전 일치! 훈독 や(야)는 과녁 향해 활 쏘며 '야! 명중!'",
    radicalBreakdown: '𠂉(뾰족한 화살촉) + 大(화살대와 양쪽 깃털)',
    storyMnemonicKo: '위쪽은 뾰족한 금속 화살촉(𠂉), 아래쪽은 곧은 대나무 화살대와 양옆으로 벌어진 깃털(大) 모양 그대로 그린 상형문자예요!',
    visualPictogram: '🏹🎯⚡',
    quoteKo: '「성 세바스찬의 탄탄하게 긴장된 가슴을 무참한 화살이 깊이 꿰뚫고 있었다.」',
    compoundsKo: ['독화살 (독을 바른 치명적인 화살)', '사시 (활시위를 당겨 화살을 쏨)', '궁시 (활과 화살)'],
    cafeItemNameKo: '은화살 시나몬 추로스',
    cafeOrderSpeechKo: '화살처럼 길고 바삭하게 튀겨낸 「은화살 시나몬 추로스(矢)」 하나 설탕 솔솔 뿌려 주시오!',
    happyReactionKo: '바삭! 내 취향 과녁 한가운데를 정확히 명중시킨 계피 향이로군!',
    angryReactionKo: '화살촉 달린 화살 시(矢) 자요! 과녁 밖으로 한참 빗나갔잖소 ㅋㅋ',
  },
  {
    id: 'kamen-54-jun',
    character: '殉',
    huneum: '따라죽을 순',
    meaningKo: '순교하다, 신념에 목숨을 바치다',
    readingGuideKo: '음독 ジュン(쥰)',
    koreanSoundTip: "한국 음 '순(순교·순직)' → 일본 음독 ジュン(쥰)! '순수=쥰스이, 순교=쥰쿄우'처럼 '순 → 쥰'으로 외우면 100점!",
    radicalBreakdown: '歹(죽을 사 변·부서진 뼈) + 旬(열흘 순·시간을 다 채우다)',
    storyMnemonicKo: '마지막 순간(旬)까지 신념을 굽히지 않고 기꺼이 목숨과 뼈(歹)를 바쳐 거룩하게 산화하는 순교자의 모습이에요!',
    visualPictogram: '🕊️🌹✝️',
    quoteKo: '「고통 속에서 하늘을 우러러보는 젊은 순교자의 모습에 나는 영혼을 빼앗겼다.」',
    compoundsKo: ['순교 (종교적 신앙과 진리를 위해 목숨을 바침)', '순사 (주군이나 반려자의 뒤를 따라 죽음)', '순난 (나라나 대의의 재난에 목숨을 바침)'],
    cafeItemNameKo: '순교자의 버터 사브레',
    cafeOrderSpeechKo: '군더더기 없이 순수하고 고소한 「순교자의 사브레 쿠키(殉)」 한 접시 부탁하오!',
    happyReactionKo: '소박하면서도 깊은 버터 풍미가 영혼까지 정화해 주는군!',
    angryReactionKo: '왼쪽에 뼈 알(歹) 변이 붙은 순교할 순(殉) 자요! 엉뚱한 글자를 바치다니 ㅋㅋ',
  },
  {
    id: 'kamen-55-sha',
    character: '射',
    huneum: '쏠 사',
    meaningKo: '쏘다, 꿰뚫다, 빛이 비치다',
    readingGuideKo: '음독 シャ(샤) / 훈독 い・る(이루)·さ・す(사스)',
    koreanSoundTip: "한국 음 '사(발사·방사·사격)' → 일본 음독 シャ(샤)! '사 → 샤'(사진=샤신, 감사=칸샤) 법칙 그대로 적용!",
    radicalBreakdown: '身(몸 신·팽팽히 당긴 활몸) + 寸(마디 촌·시위를 잡은 손)',
    storyMnemonicKo: '활처럼 팽팽하게 휜 몸체(身)에서 손가락(寸)을 탁 놓아 과녁을 향해 화살이나 빛줄기를 쉭 쏘아 보내는 동작이에요!',
    visualPictogram: '🏹💥☕',
    quoteKo: '「냉혹한 화살이 육체를 꿰뚫는 순간, 그곳에 아름다움의 정점이 나타난다.」',
    compoundsKo: ['방사 (사방으로 빛이나 열을 뿜어 쏨)', '쏘아 맞히다 (과녁이나 사랑을 명중시켜 얻음)', '조사 (빛을 한곳에 집중해 내리쬠)'],
    cafeItemNameKo: '한 발의 화살 에스프레소',
    cafeOrderSpeechKo: '심장을 꿰뚫듯 강렬하게 추출한 「한 발의 에스프레소 샷(射)」 한 잔 내어주시오!',
    happyReactionKo: '크으! 짜릿한 카페인 한 발이 졸음을 단숨에 꿰뚫어 버리는군!',
    angryReactionKo: '몸 신(身) 옆에 손 마디 촌(寸)이 붙어야 쏠 사(射)지! 헛방 쏘셨소 ㅋㅋ',
  },
  {
    id: 'kamen-56-ko',
    character: '恍',
    huneum: '황홀할 황',
    meaningKo: '황홀하다, 무아지경에 빠지다',
    readingGuideKo: '음독 コウ(코우)',
    koreanSoundTip: "한국 음 '황(황홀)' → 일본 음독 コウ(코우)! 오른쪽에 들어 있는 '빛 광(光 = コウ)' 발음 그대로 읽으면 1초 암기!",
    radicalBreakdown: '忄(마음 심) + 光(빛 광)',
    storyMnemonicKo: '마음(忄)속에 눈부신 스포트라이트 빛(光)이 번쩍 터진 것처럼 넋을 잃고 무아지경에 빠진 황홀함이에요!',
    visualPictogram: '💖✨🤩',
    quoteKo: '「죽음의 통각과 관능이 교차할 때, 청년은 황홀의 경지에 도달했다.」',
    compoundsKo: ['황홀 (마음을 빼앗겨 무아지경에 빠짐)', '황연 (문득 넋을 잃고 황홀해진 모양)', '황홀경 (꿈결처럼 황홀한 최고의 경지)'],
    cafeItemNameKo: '황홀 바닐라 수플레',
    cafeOrderSpeechKo: '구름처럼 부풀어 입안에서 황홀하게 녹는 「황홀 바닐라 수플레(恍)」 하나 구워주시오!',
    happyReactionKo: '아아~ 따끈하고 폭신한 달콤함에 마음이 빛(光)처럼 황홀해지는군!',
    angryReactionKo: '마음(忄) 옆에 빛 광(光)이 반짝이는 황홀할 황(恍) 자요! 김 다 빠졌잖소 ㅋㅋ',
  },
  {
    id: 'kamen-57-kotsu',
    character: '惚',
    huneum: '황홀할 홀',
    meaningKo: '반하다, 넋을 잃다, 황홀해하다',
    readingGuideKo: '음독 コツ(코츠) / 훈독 ほ・れる(호레루)',
    koreanSoundTip: "한국 음 '홀(황홀)' → 일본 음독 コツ(코츠)! ㅎ→ㅋ + 받침 ㄹ→츠(ツ) 공식! 훈독 ほれる(호레루)는 '첫눈에 홀~딱 반하다!'",
    radicalBreakdown: '忄(마음 심) + 忽(소홀히 할 홀: 勿말 물 + 心마음 심)',
    storyMnemonicKo: '너무 아름다운 것을 봐서 왼쪽 마음(忄)도 아래쪽 마음(心)도 통제 불능(勿)으로 뿅 반해버린 상태예요! (마음이 두 개나!)',
    visualPictogram: '😍💘🌹',
    quoteKo: '「황홀한 미소를 띤 채, 그림 속의 성자는 숨을 거두려 하고 있었다.」',
    compoundsKo: ['황홀 (넋을 잃을 만큼 매혹되어 빠짐)', '자뻑·도취 (자기 자신에게 스스로 홀딱 반함)'],
    cafeItemNameKo: '사랑에 반한 로즈힙 티',
    cafeOrderSpeechKo: '첫눈에 반할 만큼 루비빛으로 붉은 「로즈힙 허브티(惚)」 한 잔 우아하게 우려주시오!',
    happyReactionKo: '새콤하고 향기로운 장미열매 향에 그만 홀딱 반해버렸구려!',
    angryReactionKo: '마음이 두 개(忄+心)나 든 반할 홀(惚) 자를 줘야지, 내 마음을 몰라주네 ㅋㅋ',
  },
  {
    id: 'kamen-58-roku',
    character: '鹿',
    huneum: '사슴 록',
    meaningKo: '사슴',
    readingGuideKo: '음독 ロク(로쿠) / 훈독 しか(시카)',
    koreanSoundTip: "한국 음 '록(녹용·록명관)' → 일본 음독 ロク(로쿠)! 받침 ㄱ→쿠(ク)! 훈독 しか(시카)는 나라 공원의 유명한 사슴 '시카'!",
    radicalBreakdown: '广(사슴 머리와 뿔) + 格子(얼룩무늬 몸통) + 比(날쌘 네 다리)',
    storyMnemonicKo: '머리 위 멋진 가지 뿔(亠)과 긴 목(广), 네 개의 날렵한 다리(比)를 가진 우아한 사슴을 옆에서 그린 상형문자예요!',
    visualPictogram: '🦌🌿🏛️',
    quoteKo: '「록명관의 화려한 야회에 시대의 빛과 그림자가 교차하고 있었다.」',
    compoundsKo: ['록명관 (메이지 시대 귀족 사교 무도회장)', '사슴고기 (고급 사냥 요리 재료인 녹육)'],
    cafeItemNameKo: '록명관 로열 밀크티',
    cafeOrderSpeechKo: '화려한 무도회장의 밤처럼 부드럽고 진한 「록명관 로열 밀크티(鹿)」 한 잔 주시겠어요?',
    happyReactionKo: '어머, 실크 드레스처럼 매끄럽고 고소한 밀크티네요! 품격이 넘쳐요!',
    angryReactionKo: '뿔 달린 사슴 록(鹿) 자가 아니잖아요! 무도회 파트너를 잘못 찾으셨군요 ㅋㅋ',
  },
  {
    id: 'kamen-59-mei',
    character: '鳴',
    huneum: '울 명',
    meaningKo: '울다, 소리가 울려 퍼지다',
    readingGuideKo: '음독 メイ(메이) / 훈독 な・く(나쿠)·な・る(나루)',
    koreanSoundTip: "한국 음 '명(비명·공명)' → 일본 음독 メイ(메이)! 받침 ㅇ→이(イ)! 훈독 なく(나쿠: 새·사슴이 울다) / なる(나루: 종이 울리다)!",
    radicalBreakdown: '口(입 구) + 鳥(새 조)',
    storyMnemonicKo: '예쁜 새(鳥)가 부리 입(口)을 짝 벌리고 "짹짹! 삐리릭~" 맑은 목소리로 노래하며 울려 퍼지는 모양이에요!',
    visualPictogram: '🐦🎵🔔',
    quoteKo: '「왈츠 선율의 그늘에서, 파멸을 알리는 총성이 관내에 울려 퍼졌다.」',
    compoundsKo: ['록명관 (사슴이 평화롭게 우는 연회장이라는 뜻의 사교관)', '공명 (소리와 마음이 함께 울림)', '비명 (슬프거나 놀라 지르는 날카로운 외침)'],
    cafeItemNameKo: '방울소리 마카롱',
    cafeOrderSpeechKo: '은방울 소리처럼 경쾌하고 달콤한 「방울소리 마카롱(鳴)」 하나 예쁘게 담아주세요!',
    happyReactionKo: '바삭하고 쫀득한 꼬끄가 입안에서 왈츠 선율처럼 울려 퍼지네요!',
    angryReactionKo: '새(鳥)가 입(口)으로 노래하는 울 명(鳴) 자예요! 그냥 새(鳥)만 주시면 소리 안 나요 ㅋㅋ',
  },
  {
    id: 'kamen-60-kan',
    character: '館',
    huneum: '집 관',
    meaningKo: '회관, 저택, 양관, 미술관',
    readingGuideKo: '음독 カン(칸) / 훈독 やかた(야카타)',
    koreanSoundTip: "한국 음 '관(도서관·미술관·영화관)' → 일본 음독 カン(칸)! '관 → 칸'(료칸=여관, 타이시칸=대사관) 1초 법칙!",
    radicalBreakdown: '飠(밥 식·만찬 대접) + 官(벼슬 관: 큰 지붕 宀 아래 여러 방 㠯)',
    storyMnemonicKo: '높은 지붕과 여러 방을 갖춘 대저택(官)에서 귀빈들에게 성대한 만찬 음식(飠)과 차를 대접하는 화려한 회관이에요!',
    visualPictogram: '🏛️🍽️🥂',
    quoteKo: '「문명개화의 상징인 이 저택에서 귀족들의 음모가 소용돌이치고 있었다.」',
    compoundsKo: ['록명관 (서양식 벽돌로 지은 메이지 귀족 사교 회관)', '양관 (서양식 건축 양식의 저택)', '관내 (회관이나 건물의 내부)'],
    cafeItemNameKo: '귀빈관 클로티드 크림 스콘',
    cafeOrderSpeechKo: '서양식 양관의 애프터눈 티에 어울리는 「귀빈관 스콘(館)」에 잼 듬뿍 곁들여 주세요!',
    happyReactionKo: '따끈하게 구운 스콘과 고소한 크림이라니! 귀빈 대접이 따로 없군요!',
    angryReactionKo: '음식(飠) 대접하는 큰 건물(官), 집 관(館) 자가 아니잖아요! 문전박대인가요 ㅋㅋ',
  },

  // ==========================================================================
  // TIER 4: 憂国と太陽・奔馬 (우국과 태양·분마 — 『우국』·『분마』·『태양과 철』 20자)
  // ==========================================================================
  {
    id: 'yukoku-61-yu',
    character: '憂',
    huneum: '근심 우',
    meaningKo: '근심하다, 슬퍼하다, 시름',
    readingGuideKo: '음독 ユウ(유우) / 훈독 うれ・える(우레에루)·う・い(우이)',
    koreanSoundTip: "한국 음 '우(우국·우울·기우)' → 일본 음독 ユウ(유우)! '우 → 유우' 법칙! (사람 亻이 붙으면 '배우·우수'의 넉넉할 우 優!)",
    radicalBreakdown: '頁(머리 혈 변형: 百+冖) + 心(마음 심) + 夂(천천히 걸을 쇠)',
    storyMnemonicKo: '머리(百)를 무겁게 숙이고 가슴 한복판의 마음(心)을 앓으며 터벅터벅 무거운 발걸음(夂)을 옮기는 깊은 근심이에요!',
    visualPictogram: '😔💭☕',
    quoteKo: '「우국의 정에 사로잡힌 청년 장교는 대의를 위해 목숨을 바칠 결의를 굳혔다.」',
    compoundsKo: ['우국 (나라의 앞날을 깊이 근심함)', '우려 (앞일을 걱정하고 근심함)', '기우 (하늘이 무너질까 걱정한다는 쓸데없는 근심)'],
    cafeItemNameKo: '우국 다크로스트 커피',
    cafeOrderSpeechKo: '깊은 시름을 달래줄 묵직하고 쌉싸름한 「우국 다크로스트 커피(憂)」 한 잔 내려주시오!',
    happyReactionKo: '묵직한 바디감과 쌉싸름한 끝맛이 마음속 깊은 근심까지 가라앉혀 주는군!',
    angryReactionKo: '가슴 한복판에 마음 심(心)이 든 근심 우(憂) 자요! 사람 亻 붙은 優랑 헷갈리지 마시오 ㅋㅋ',
  },
  {
    id: 'yukoku-62-koku',
    character: '国',
    huneum: '나라 국',
    meaningKo: '나라, 조국, 국가',
    readingGuideKo: '음독 コク(코쿠) / 훈독 くに(쿠니)',
    koreanSoundTip: "한국 음 '국(한국·조국·국가)' → 일본 음독 コク(코쿠)! ㄱ→ㅋ + 받침 ㄱ→쿠(ク) 공식('한국 = 칸코쿠')! 훈독은 '쿠니(나라)'!",
    radicalBreakdown: '囗(큰입 구·국경 성벽) + 玉(구슬 옥·왕실 보배)',
    storyMnemonicKo: '튼튼한 사방 국경 성벽(囗) 한가운데 나라의 보배 구슬(玉)을 소중하게 지켜 품고 있는 나라 모양이에요! (일본 신자체는 속이 玉!)',
    visualPictogram: '🏯💎🗾',
    quoteKo: '「나라의 위급함에 직면하여 아군끼리 총을 겨누는 사태를 피하고자, 중위는 자결을 택했다.」',
    compoundsKo: ['우국 (나라를 진심으로 근심하고 사랑함)', '황국 (천황이 다스리는 나라)', '조국 (조상 대대로 살아온 나의 나라)'],
    cafeItemNameKo: '황국 국화차',
    cafeOrderSpeechKo: '기품 있는 국화꽃이 활짝 피어나는 맑은 「황국 국화차(国)」 한 잔 정갈하게 우려주시오!',
    happyReactionKo: '그윽한 국화 향기가 온 방 안에 기품 있게 퍼지는군! 태평성대의 맛이오!',
    angryReactionKo: '네모 성벽(囗) 안에 구슬 옥(玉)이 들어간 나라 국(国) 자요! 국경을 잘못 넘으셨소 ㅋㅋ',
  },
  {
    id: 'yukoku-63-hon',
    character: '奔',
    huneum: '달릴 분',
    meaningKo: '질주하다, 거침없이 내달리다',
    readingGuideKo: '음독 ホン(혼)',
    koreanSoundTip: "한국 음 '분(분마·분주·자유분방)' → 일본 음독 ホン(혼)! ㅂ→ㅎ(ホ) + 받침 ㄴ→ン(ㄴ) = '분 → 혼'!",
    radicalBreakdown: '大(팔다리 크게 벌린 사람 대) + 卉(풀 훼: 十 세 개 = 거센 발걸음·풀밭)',
    storyMnemonicKo: '두 팔을 크게 벌린(大) 주자가 열 십(十) 자 발자국을 세 개나 연속으로 찍으며 풀밭 위를 전력 질주하는 모양이에요!',
    visualPictogram: '🏃‍♂️💨⚡',
    quoteKo: '「이누마 이사오의 순수한 광기는 황야를 질주하는 야생마처럼 멈출 길이 없었다.」',
    compoundsKo: ['분마 (거침없이 내달리는 준마)', '분방 (얽매임 없이 자유롭고 거침없음)', '질분 (바람처럼 맹렬히 내달림)'],
    cafeItemNameKo: '분마 흑당 까눌레',
    cafeOrderSpeechKo: '거침없이 질주하는 에너지 충전용! 겉바속촉 「분마 흑당 까눌레(奔)」 하나 주시오!',
    happyReactionKo: '바삭한 캐러멜 껍질과 쫀득한 속살! 황야를 달리는 듯 힘이 불끈 솟는군!',
    angryReactionKo: '크게(大) 발을 내딛는(卉) 달릴 분(奔) 자요! 엉뚱한 데로 폭주하시면 어쩌오 ㅋㅋ',
  },
  {
    id: 'yukoku-64-ba',
    character: '馬',
    huneum: '말 마',
    meaningKo: '말, 준마',
    readingGuideKo: '음독 バ(바) / 훈독 うま(우마)',
    koreanSoundTip: "한국 음 '마(분마·백마·마차)' → 일본 음독 バ(바)! ㅁ↔ㅂ 쌍둥이 법칙! 훈독 うま(우마)는 맛있는 음식 먹고 '우마(이)! 말처럼 힘나네!'",
    radicalBreakdown: '馬(말 마 제부수: 흩날리는 갈기 三 + 긴 등허리 ㄱ + 네 다리 점 灬)',
    storyMnemonicKo: '바람에 휘날리는 멋진 갈기(三)와 네 개의 튼튼한 말발굽(灬)으로 대지를 박차고 달리는 말을 옆에서 그린 상형문자예요!',
    visualPictogram: '🐎🌪️🤍',
    quoteKo: '「달리는 말의 울음소리처럼, 젊은이들의 뜻은 어둠을 가르고 나아갔다.」',
    compoundsKo: ['분마 (전속력으로 내달리는 말)', '신마 (신사에 바쳐진 신성한 말)', '백마 (눈처럼 새하얀 준마)'],
    cafeItemNameKo: '백마 앙금 화과자(네리키리)',
    cafeOrderSpeechKo: '기품 있게 달리는 하얀 준마 모양 「백마 네리키리(馬)」 하나 정성껏 내어주시오!',
    happyReactionKo: '우마이(美味い)! 백마처럼 기품 있고 고운 백앙금이 입에서 살살 녹는군!',
    angryReactionKo: '아래에 네 다리 점 네 개(灬) 달린 말 마(馬) 자도 못 찾으시다니, 낙마하셨소?! ㅋㅋ',
  },
  {
    id: 'yukoku-65-gyo',
    character: '暁',
    huneum: '새벽 효',
    meaningKo: '새벽, 여명, 동틀 녘',
    readingGuideKo: '음독 ギョウ(교우) / 훈독 あかつき(아카츠키)',
    koreanSoundTip: "훈독 あかつき(아카츠키)는 나루토 '아카츠키(새벽)' 조직으로 전 세계 유명! 한국 음 '효' → 음독 ギョウ(교우)!",
    radicalBreakdown: '日(해 일) + 尭(높을 요 신자체: 十 + 廾 + 兀)',
    storyMnemonicKo: '어둠을 뚫고 지평선 위로 해(日)가 높이(尭) 솟아오르며 하늘을 붉은 황금빛으로 물들이는 새벽녘이에요! (불火 대신 해日!)',
    visualPictogram: '🌅🛕✨',
    quoteKo: '「새벽의 사원 첨탑이 동트는 빛을 받아 금빛으로 빛나기 시작했다.」',
    compoundsKo: ['새벽의 사원 (방콕 왓 아룬을 배경으로 한 『풍요의 바다』 제3권)', '효광 (새벽녘 비치는 여명의 빛)', '효성 (새벽하늘에 홀로 빛나는 샛별)'],
    cafeItemNameKo: '새벽빛 스파이스 차이티',
    cafeOrderSpeechKo: '방콕의 황금빛 여명처럼 향신료 향이 퍼지는 뜨거운 「새벽빛 차이티(暁)」 한 잔 주시오!',
    happyReactionKo: '시나몬과 카다몸 향기가 새벽 햇살처럼 온몸을 따스하게 깨우는군!',
    angryReactionKo: '왼쪽에 해 일(日)이 떠야 새벽 효(暁)지! 불 화(火) 붙은 焼(구울 소)랑 헷갈렸구려 ㅋㅋ',
  },
  {
    id: 'yukoku-66-tetsu',
    character: '鉄',
    huneum: '쇠 철',
    meaningKo: '철, 강철, 무쇠',
    readingGuideKo: '음독 テツ(테츠) / 훈독 くろがね(쿠로가네)',
    koreanSoundTip: "한국 음 '철(지하철·강철·철권)' → 일본 음독 テツ(테츠)! ㅊ→ㅌ(テ) + 받침 ㄹ→츠(ツ) 공식 그대로('지하철 = 치카테츠')!",
    radicalBreakdown: '金(쇠 금) + 失(잃을 실)',
    storyMnemonicKo: '일본 신자체는 쇠 금(金) 옆에 잃을 실(失)! 녹스는 걸 잃어버릴(失) 만큼 단련한 강인한 무쇠 강철, 보디빌딩 바벨이에요!',
    visualPictogram: '🏋️‍♂️⚙️🖤',
    quoteKo: '「차가운 철의 무게를 통해서만 나의 육체는 확고한 실재를 회복했다.」',
    compoundsKo: ['태양과 철 (미시마의 육체 단련과 문학 철학을 담은 에세이)', '강철 (매우 단단하게 제련한 철)', '철권 (무쇠처럼 단단한 주먹)'],
    cafeItemNameKo: '무쇠주전자 농차(진한 말차)',
    cafeOrderSpeechKo: '남부철기 무쇠 솥에서 끓인 물로 진하게 개어낸 「무쇠 농차(鉄)」 한 사발 내어주시오!',
    happyReactionKo: '묵직한 철기의 기운이 고스란히 담긴 진한 말차! 정신이 강철처럼 단단해지는군!',
    angryReactionKo: '쇠 금(金) 옆에 잃을 실(失)이 붙은 쇠 철(鉄) 자요! 바벨 무게가 부족하오 ㅋㅋ',
  },
  {
    id: 'yukoku-67-yo',
    character: '陽',
    huneum: '볕 양',
    meaningKo: '태양, 햇볕, 양지',
    readingGuideKo: '음독 ヨウ(요우) / 훈독 ひ(히)',
    koreanSoundTip: "한국 음 '양(태양)' → 일본 음독 ヨウ(요우)! '태양 = 타이요우(たいよう)' 세트로 외우면 太+陽 두 글자 한 방에 암기!",
    radicalBreakdown: '阝(언덕 부) + 昜(볕 양: 해 日 + 지평선 一 + 내리쬐는 햇살 勿)',
    storyMnemonicKo: '높은 언덕(阝) 지평선(一) 위로 해(日)가 떠올라 눈부신 빛줄기 세 가닥(勿)을 대지에 좌악 쏟아내는 따가운 태양빛이에요!',
    visualPictogram: '☀️🏔️🍊',
    quoteKo: '「태양의 가차 없는 빛이 푸른 하늘 아래 다부진 육체를 환히 비추어 냈다.」',
    compoundsKo: ['태양 (하늘에서 만물을 비추는 해)', '양광 (따스하고 눈부신 햇빛)', '조양 (아침에 힘차게 떠오르는 해)'],
    cafeItemNameKo: '일륜 금귤 타르트',
    cafeOrderSpeechKo: '한낮의 태양처럼 노랗고 상큼하게 빛나는 「일륜 금귤 타르트(陽)」 한 조각 주시오!',
    happyReactionKo: '입안 가득 터지는 새콤달콤한 금귤 과즙이 꼭 눈부신 태양빛 같구려!',
    angryReactionKo: '언덕(阝) 위로 해(日)와 빛살(勿)이 뻗는 볕 양(陽) 자요! 그늘에서 헤매지 마시오 ㅋㅋ',
  },
  {
    id: 'yukoku-68-tai',
    character: '太',
    huneum: '클 태',
    meaningKo: '크다, 거대하다, 굵다',
    readingGuideKo: '음독 タイ(타이)·タ(타) / 훈독 ふと・い(후토이)',
    koreanSoundTip: "한국 음 '태(태양·태고·태평양)' → 일본 음독 タイ(타이)! 훈독 ふとい(후토이: 굵다)는 굵은 김밥 '후토마키(太巻)'의 바로 그 태!",
    radicalBreakdown: '大(클 대) + 丶(더 큰 핵심 점 하나)',
    storyMnemonicKo: '두 팔 벌린 클 대(大) 아래에 굵직한 점(丶)을 하나 더 콕 찍어 "큰 것보다 한 차원 더 거대하고 굵다!"를 뜻하는 글자예요!',
    visualPictogram: '🌞🪵💪',
    quoteKo: '「태양과 죽음이라는 두 가지 절대적인 존재가 내 안에서 하나로 결합되었다.」',
    compoundsKo: ['태양 (우주에서 가장 거대한 빛의 근원인 해)', '태고 (아득히 먼 옛날)', '통나무 (껍질째 굵직하게 자른 둥근 나무)'],
    cafeItemNameKo: '태고의 호박빛 꿀술(미드 음료)',
    cafeOrderSpeechKo: '태고의 전사들이 마셨던 황금빛 「태고의 꿀차 엘릭서(太)」 큼지막한 잔에 주시오!',
    happyReactionKo: '크으, 통 크게 따른 진한 벌꿀 향이 가슴속까지 묵직하게 차오르는군!',
    angryReactionKo: '클 대(大) 아래 점(丶) 하나 찍힌 클 태(太) 자요! 점 하나 빼먹으면 안 되오 ㅋㅋ',
  },
  {
    id: 'yukoku-69-niku',
    character: '肉',
    huneum: '고기 육',
    meaningKo: '육체, 살코기, 몸',
    readingGuideKo: '음독 ニク(니쿠)',
    koreanSoundTip: "한국 음 '육(육체·근육)' → 일본 음독 ニク(니쿠)! 일본식 불고기 '야키니쿠(焼肉)'의 니쿠가 바로 이 고기 육(肉)!",
    radicalBreakdown: '冂(고깃덩이 테두리) + 人 + 人(결이 살아있는 근육·살코기 무늬)',
    storyMnemonicKo: '두툼한 정육 고깃덩이(冂) 단면에 촘촘한 마블링과 근육 결 두 겹(人+人)이 선명하게 박힌 탄탄한 육체 모양이에요!',
    visualPictogram: '🥩💪🏛️',
    quoteKo: '「곰곰이 어린 시절을 되돌아보면, 내게 있어 말의 기억은 육체의 기억보다 훨씬 더 먼 곳까지 거슬러 올라간다.」',
    compoundsKo: ['육체 (살과 뼈로 이루어진 사람의 몸)', '근육 (힘을 내는 탄탄한 힘줄과 살)', '골육 (뼈와 살, 피를 나눈 가까운 혈육)'],
    cafeItemNameKo: '단련 검은콩 양갱',
    cafeOrderSpeechKo: '단단히 단련된 육체를 위해 굵은 검은콩이 꽉 찬 「단련 검은콩 양갱(肉)」 하나 주시오!',
    happyReactionKo: '알차게 씹히는 검은콩 식감이 근육처럼 탄탄하군! 최고의 영양 간식이오!',
    angryReactionKo: '테두리 안에 결 두 개(人人) 든 고기 육(肉) 자요! 야키니쿠도 못 드셔보셨소?! ㅋㅋ',
  },
  {
    id: 'yukoku-70-kin',
    character: '筋',
    huneum: '힘줄 근',
    meaningKo: '근육, 힘줄, 줄기',
    readingGuideKo: '음독 キン(킨) / 훈독 すじ(스지)',
    koreanSoundTip: "한국 음 '근(근육·근력)' → 일본 음독 キン(킨)!('근육 = 킨니쿠') 훈독 すじ(스지)는 한국 어묵탕 집에서도 파는 '소 힘줄 스지'!",
    radicalBreakdown: '⺮(대나무 죽) + 月(육달월·살코기 육肉) + 力(힘 력)',
    storyMnemonicKo: '대나무(⺮) 마디처럼 곧게 뻗은 몸의 살코기(月) 속에서 폭발적인 힘(力)을 만들어내는 탄탄한 근육과 힘줄이에요!',
    visualPictogram: '🎋💪⚡',
    quoteKo: '「철을 들어 올림으로써 단련된 근육은 정신의 갑옷이 되었다.」',
    compoundsKo: ['근육 (뼈에 붙어 운동과 힘을 담당하는 조직)', '근골 (힘줄과 뼈대, 다부진 체격)', '근력 (근육이 발휘하는 물리적 힘)'],
    cafeItemNameKo: '강건 프로틴 식혜(아마자케)',
    cafeOrderSpeechKo: '오늘도 득근 완료! 근육 회복을 돕는 든든한 「강건 프로틴 아마자케(筋)」 한 잔 주시오!',
    happyReactionKo: '달콤하고 진한 발효 곡물 단백질이 근육 갑옷에 쫙 흡수되는 기분이군!',
    angryReactionKo: '대나무(⺮) 아래 살(月)과 힘(力)이 합쳐진 힘줄 근(筋) 자요! 근손실 나겠소 ㅋㅋ',
  },
  {
    id: 'yukoku-71-kon',
    character: '魂',
    huneum: '넋 혼',
    meaningKo: '영혼, 넋, 정신',
    readingGuideKo: '음독 コン(콘) / 훈독 たましい(타마시이)',
    koreanSoundTip: "한국 음 '혼(영혼·투혼)' → 일본 음독 コン(콘)! ㅎ→ㅋ(コ) + 받침 ㄴ→ン = '혼 → 콘'! 훈독 '타마시이(영혼)'도 애니 명대사 단골!",
    radicalBreakdown: '云(구름 운) + 鬼(귀신·신령 귀)',
    storyMnemonicKo: '육체를 떠나 뭉게구름(云)처럼 하늘 높이 피어올라 날아가는 순수한 신령(鬼), 뜨거운 영혼이에요! (흰 백白이 붙으면 땅에 남는 백魄!)',
    visualPictogram: '☁️🔥✨',
    quoteKo: '「육체의 멸망과 함께, 순수한 영혼은 하늘로 솟구쳐 오르는 것이다.」',
    compoundsKo: ['야마토 정신 (일본 고유의 강인한 정신과 혼)', '영혼 (육체에 깃든 정신적 본체)', '투혼 (굴하지 않고 끝까지 싸우는 정신)'],
    cafeItemNameKo: '영혼매듭 고헤이모치(된장구이 떡)',
    cafeOrderSpeechKo: '영혼까지 든든하게 채워줄 구수한 호두된장 「고헤이모치(魂)」 한 꼬치 구워주시오!',
    happyReactionKo: '불향 입은 고소한 된장 소스에 영혼(魂)까지 치유되는 맛이로군!',
    angryReactionKo: '구름 운(云) 옆에 귀신 귀(鬼)가 붙은 넋 혼(魂) 자요! 혼이 어디로 가출했소 ㅋㅋ',
  },
  {
    id: 'yukoku-72-jin',
    character: '刃',
    huneum: '칼날 인',
    meaningKo: '칼날, 서슬 퍼런 예리한 날',
    readingGuideKo: '음독 ジン(진) / 훈독 やいば(야이바)·は(하)',
    koreanSoundTip: "초인기 애니 『귀멸의 칼날(鬼滅の刃 = 키메츠노 야이바)』의 바로 그 '야이바(刃)'! 음독은 한국 '인(백인)' → ジン(진)!",
    radicalBreakdown: '刀(칼 도) + 丶(가장 날카로운 칼날 끝의 불꽃 점)',
    storyMnemonicKo: '휘어진 일본도 칼(刀) 안쪽 날 부분에 반짝! 빛나는 점(丶) 하나를 찍어 "여기가 베어지는 서슬 퍼런 칼날이다!"라고 표시한 3획 글자예요!',
    visualPictogram: '⚔️✨🌙',
    quoteKo: '「예리하게 벼려진 시퍼런 칼날이 맑은 달빛을 반사하여 창백하게 빛났다.」',
    compoundsKo: ['백인 (칼집에서 뽑아 서슬 퍼렇게 빛나는 칼날)', '흉인 (자객이 휘두르는 흉포한 칼날)', '날붙이 (칼이나 가위처럼 날이 선 연장)'],
    cafeItemNameKo: '백인 각절편(모치)',
    cafeOrderSpeechKo: '명검의 칼날처럼 반듯하고 정갈하게 썰어낸 「백인 각절편(刃)」 한 접시 내어주시오!',
    happyReactionKo: '칼각이 살아있는 쫄깃한 흰 떡! 군더더기 없이 깔끔하고 담백하군!',
    angryReactionKo: '칼 도(刀) 안에 점(丶) 하나가 박혀야 칼날 인(刃)이지! 그냥 칼(刀)이랑 구별하시오 ㅋㅋ',
  },
  {
    id: 'yukoku-73-fuku',
    character: '腹',
    huneum: '배 복',
    meaningKo: '배, 복부, 배짱',
    readingGuideKo: '음독 フク(후쿠) / 훈독 はら(하라)',
    koreanSoundTip: "한국 음 '복(복부·공복·할복)' → 일본 음독 フク(후쿠)! ㅂ→ㅎ(フ) + ㄱ→쿠(ク)! 훈독 はら(하라)는 배고플 때 '하라 헤리(배고파)!'",
    radicalBreakdown: '月(육달월·몸의 살) + 复(겹칠 복: 𠂉 + 日 + 夂)',
    storyMnemonicKo: '우리 몸(月) 한가운데 오장육부가 겹겹이(复) 차곡차곡 들어차 있는 든든한 배와 단전(배짱)이에요!',
    visualPictogram: '🥋🍡🔥',
    quoteKo: '「정확히 칼을 배에 꽂아 넣은 순간, 일륜은 눈꺼풀 뒤에서 찬란하게 떠올랐다.」',
    compoundsKo: ['할복 (무사가 명예를 지키기 위해 스스로 배를 가름)', '할복 자결 (배를 갈라 목숨을 끊음)', '복배 (배와 등, 앞뒤 양면)'],
    cafeItemNameKo: '각오의 진한 흑임자 경단',
    cafeOrderSpeechKo: '배를 든든하게 채워 흔들림 없는 배짱을 만들어줄 「흑임자 경단(腹)」 한 접시 주시오!',
    happyReactionKo: '속이 꽉 찬 경단 덕분에 뱃속(腹)이 든든하군! 이제 어떤 시련도 두렵지 않소!',
    angryReactionKo: '몸(月) 옆에 겹칠 복(复)이 붙은 배 복(腹) 자요! 배고파서 현기증 난단 말이오 ㅋㅋ',
  },
  {
    id: 'yukoku-74-setsu',
    character: '切',
    huneum: '끊을 절',
    meaningKo: '베다, 자르다, 간절하다',
    readingGuideKo: '음독 セツ(세츠)·サイ(사이) / 훈독 き・る(키루)',
    koreanSoundTip: "한국 음 '절(친절·절실)' → 일본 음독 セツ(세츠)!('친절 = 신세츠') 훈독 きる(키루)는 칼로 싹둑 '키루(자르다)'!",
    radicalBreakdown: '七(일곱 칠·가로지른 선) + 刀(칼 도)',
    storyMnemonicKo: '날카로운 칼(刀)로 일곱 번(七)이든 단박에 싹둑! 베어 자르는 모양이에요! 너무 가까이 베면 간절하고 절실(切実)하다는 뜻까지!',
    visualPictogram: '🔪🍡✨',
    quoteKo: '「중위는 훌륭하게 할복을 완수했고, 아내 또한 미소 지으며 남편의 뒤를 따랐다.」',
    compoundsKo: ['할복 (무사도의 예법에 따라 배를 가름)', '절실 (마음에 닿을 만큼 간절하고 시급함)', '친절 (정성을 다해 자상하게 대함)'],
    cafeItemNameKo: '셋푸쿠 모나카(팥앙금 듬뿍 모나카)',
    cafeOrderSpeechKo: '배가 터질 듯 팥앙금을 듬뿍 채운 도쿄 신바시 명물 「할복 모나카(切)」 하나 주시오!',
    happyReactionKo: '바삭한 모나카 배를 가르니 달콤한 통팥과 구운 떡이 쏟아지는군! 명불허전이오!',
    angryReactionKo: '일곱 칠(七) 옆에 칼 도(刀)가 붙은 끊을 절(切) 자요! 엉뚱한 데를 베면 큰일 나오 ㅋㅋ',
  },
  {
    id: 'yukoku-75-chu',
    character: '忠',
    huneum: '충성 충',
    meaningKo: '충성, 충의, 한결같은 진심',
    readingGuideKo: '음독 チュウ(츄우)',
    koreanSoundTip: "한국 음 '충(충성·충의)' → 일본 음독 チュウ(츄우)! ㅊ→ㅊ(チュ) + 받침 ㅇ→장음 우(ウ) 공식 그대로 '충 = 츄우'!",
    radicalBreakdown: '中(가운데 중) + 心(마음 심)',
    storyMnemonicKo: '마음(心)이 이리저리 흔들리지 않고 정중앙 한가운데(中)를 올곧게 지키는 일편단심 충성심이에요! 글자 뜻 그대로 1초 암기!',
    visualPictogram: '🎯❤️🍵',
    quoteKo: '「지극한 정성으로 충의를 다하는 것이야말로 무사도의 지고한 미덕이었다.」',
    compoundsKo: ['충의 (진심을 다해 의리와 충성을 지킴)', '충성 (거짓 없는 참마음으로 대의를 섬김)', '충절 (끝까지 변치 않는 충성스러운 절개)'],
    cafeItemNameKo: '지성충의 우지 녹차',
    cafeOrderSpeechKo: '한 점 흐림 없이 맑고 정직하게 우려낸 「지성충의 우지 녹차(忠)」 한 잔 부탁하오!',
    happyReactionKo: '중심을 꽉 잡아주는 깔끔하고 깊은 녹차 맛이군! 내 단골 충성을 바치겠소!',
    angryReactionKo: '가운데 중(中) 아래 마음 심(心)이 받치는 충성 충(忠) 자도 모르시다니 섭섭하오 ㅋㅋ',
  },
  {
    id: 'yukoku-76-rin',
    character: '輪',
    huneum: '바퀴 륜',
    meaningKo: '바퀴, 둥근 고리, 윤회',
    readingGuideKo: '음독 リン(린) / 훈독 わ(와)',
    koreanSoundTip: "한국 음 '륜/윤(차륜·오륜기·윤회)' → 일본 음독 リン(린)! 훈독 わ(와)는 둥근 고리 모양 보고 '와~ 동그랗다!'",
    radicalBreakdown: '車(수레 거) + 侖(둥글게 엮을 륜: 人 + 一 + 冊바퀴살)',
    storyMnemonicKo: '수레(車) 옆에 촘촘한 바퀴살(冊)을 둥글게 엮어(侖) 끝없이 굴러가는 둥근 바퀴와 태양의 원반이에요!',
    visualPictogram: '☸️🌞🍩',
    quoteKo: '「정확히 칼을 배에 꽂아 넣은 순간, 일륜은 눈꺼풀 뒤에서 찬란하게 떠올랐다.」',
    compoundsKo: ['윤회 (수레바퀴처럼 생사가 끝없이 되풀이됨)', '일륜 (둥근 수레바퀴처럼 빛나는 태양 원반)', '차륜 (수레나 자동차의 바퀴)'],
    cafeItemNameKo: '일륜 황금 바움쿠헨',
    cafeOrderSpeechKo: '겹겹이 둥근 나이테 고리가 빛나는 「일륜 황금 바움쿠헨(輪)」 한 조각 내어주시오!',
    happyReactionKo: '황금빛 바퀴처럼 겹겹이 구워낸 버터 풍미가 입안에서 찬란하게 도는군!',
    angryReactionKo: '수레 차(車) 변이 달린 바퀴 륜(輪) 자요! 바퀴 빠진 수레를 주면 어떡하오 ㅋㅋ',
  },
  {
    id: 'yukoku-77-kai',
    character: '廻',
    huneum: '돌 회',
    meaningKo: '돌다, 순환하다, 윤회하다',
    readingGuideKo: '음독 カイ(카이) / 훈독 まわ・る(마와루)',
    koreanSoundTip: "한국 음 '회(회전·순회)' → 일본 음독 カイ(카이)! ㅎ→ㅋ 법칙! (주의: 불교어 '윤회(輪廻)'에서는 연음되어 りんね·린네로 읽음!)",
    radicalBreakdown: '廴(길게 걸을 인·돌아가는 길) + 回(돌 회: 큰 네모 안에 작은 네모 소용돌이)',
    storyMnemonicKo: '빙글빙글 도는 소용돌이(回)가 긴 여정 길(廴)을 타고 네 번의 생애를 거쳐 끝없이 순환하는 윤회의 고리예요!',
    visualPictogram: '🌀♾️🍰',
    quoteKo: '「윤회의 고리에서 해방되기를 갈구하면서도, 영혼은 끝없이 돌고 돈다.」',
    compoundsKo: ['윤회 (죽은 뒤 영혼이 다시 태어나며 생사를 거듭함)', '순회 (여러 곳을 차례로 돌아다님)', '회전 (축을 중심으로 빙글빙글 돎)'],
    cafeItemNameKo: '윤회 소용돌이 말차 롤케이크',
    cafeOrderSpeechKo: '나선형 크림이 아름답게 말려 들어간 「윤회 소용돌이 롤케이크(廻)」 한 조각 주시오!',
    happyReactionKo: '부드러운 시트와 생크림의 소용돌이! 다음 생에 태어나도 또 먹고 싶은 맛이군!',
    angryReactionKo: '돌 회(回) 받침에 길게 걸을 인(廴)이 감싼 돌 회(廻) 자요! 빙글빙글 헤매지 마시오 ㅋㅋ',
  },
  {
    id: 'yukoku-78-setsu',
    character: '刹',
    huneum: '찰나 찰',
    meaningKo: '찰나, 눈 깜짝할 짧은 순간, 사찰',
    readingGuideKo: '음독 セツ(세츠)·サツ(사츠)',
    koreanSoundTip: "한국 음 '찰(찰나·사찰)' → 일본 음독 セツ(세츠)/サツ(사츠)! 받침 ㄹ→츠(ツ) 만능 공식으로 '찰나 = 세츠나(せつな)' 단번에 완성!",
    radicalBreakdown: '杀(벨 살 변형: 乂 + 木) + 刂(선칼 도)',
    storyMnemonicKo: '예리한 칼날(刂)이 나무(木)를 번개처럼 스쳐 X자(乂)로 베어내는 눈 깜짝할 0.01초의 불꽃 같은 찰나예요!',
    visualPictogram: '⚡✨🍧',
    quoteKo: '「영원이란 격렬하게 타오르는 찰나의 불꽃 속에야말로 존재한다.」',
    compoundsKo: ['찰나 (눈 깜짝할 사이의 지극히 짧은 순간)', '찰나미 (한순간 불꽃처럼 타오르고 스러지는 아름다움)'],
    cafeItemNameKo: '찰나 눈꽃 빙과(소르베)',
    cafeOrderSpeechKo: '혀에 닿는 찰나 눈꽃처럼 황홀하게 녹는 「찰나 유자 소르베(刹)」 한 잔 내어주시오!',
    happyReactionKo: '사르르 녹는 단 1초의 찰나 속에 영원한 상큼함이 응축되어 있군! 예술이오!',
    angryReactionKo: '오른쪽에 선칼 도(刂)가 날카롭게 선 찰나 찰(刹) 자요! 순간의 타이밍을 놓쳤구려 ㅋㅋ',
  },
  {
    id: 'yukoku-79-shuku',
    character: '宿',
    huneum: '잘 숙',
    meaningKo: '숙명, 깃들다, 머물다, 숙소',
    readingGuideKo: '음독 シュク(슈쿠) / 훈독 やど(야도)·やど・る(야도루)',
    koreanSoundTip: "한국 음 '숙(숙박·숙명·기숙사)' → 일본 음독 シュク(슈쿠)! 도쿄 명소 '신주쿠(新宿)'의 주쿠/슈쿠가 바로 이 글자!",
    radicalBreakdown: '宀(집 면) + 亻(사람 인) + 百(일백 백·수많은 자리)',
    storyMnemonicKo: '한 지붕(宀) 아래 백 명(百)의 나그네 사람(亻)이 밤하늘 별자리처럼 깃들어 잠드는 여관이자 타고난 별자리 숙명이에요!',
    visualPictogram: '🌌🏠☕',
    quoteKo: '「사람은 누구나 자신이 타고난 숙명에서 벗어날 수 없다.」',
    compoundsKo: ['숙명 (태어날 때부터 정해져 피할 수 없는 운명)', '숙아 (오랫동안 몸에 깃들어 낫지 않는 고질병)', '숙박 (여관이나 숙소에서 묵어 잠)'],
    cafeItemNameKo: '숙명의 더블 에스프레소',
    cafeOrderSpeechKo: '피할 수 없는 운명처럼 깊고 진하게 내린 「숙명의 더블 에스프레소(宿)」 한 잔 주시오!',
    happyReactionKo: '묵직한 크레마와 깊은 여운… 내 영혼에 깃든 숙명의 커피를 드디어 만났군!',
    angryReactionKo: '지붕(宀) 아래 사람(亻)과 백(百)이 머무는 잘 숙(宿) 자요! 번지수 잘못 찾으셨소 ㅋㅋ',
  },
  {
    id: 'yukoku-80-mei',
    character: '命',
    huneum: '목숨 명',
    meaningKo: '생명, 목숨, 운명, 사명',
    readingGuideKo: '음독 メイ(메이)·ミョウ(묘우) / 훈독 いのち(이노치)',
    koreanSoundTip: "한국 음 '명(생명·운명·사명)' → 일본 음독 メイ(메이)! 받침 ㅇ→이(イ)! 훈독 いのち(이노치: 목숨·생명)는 감동 명대사 1순위 단어!",
    radicalBreakdown: '亼(모을 집·하늘의 지붕) + 口(입 구·하늘의 말씀) + 卩(병부 절·무릎 꿇은 사람)',
    storyMnemonicKo: '하늘 지붕(亼) 아래 내려진 신성한 말씀(口)을 무릎 꿇고(卩) 가슴에 받든 인간의 고귀한 목숨과 사명이에요!',
    visualPictogram: '🌟🫖🔥',
    quoteKo: '「자신의 목숨을 바침으로써만 아름다움은 완성되는 것이다.」',
    compoundsKo: ['숙명 (날 때부터 정해진 피할 수 없는 운명)', '운명 (인간을 이끄는 초월적인 힘과 길)', '사명 (목숨을 걸고 완수해야 할 맡은 임무)'],
    cafeItemNameKo: '생명의 한 방울 최고급 옥로차',
    cafeOrderSpeechKo: '마지막 한 방울까지 혼을 담아 우려낸 「생명의 물방울 옥로차(命)」 한 잔 내어주시오!',
    happyReactionKo: '한 방울에 응축된 경이로운 감칠맛! 미시마 80한자의 대미를 장식할 최고의 한 잔이오!',
    angryReactionKo: '입 구(口)와 마디 절(卩)이 나란히 선 목숨 명(命) 자요! 마지막까지 긴장 늦추지 마시오 ㅋㅋ',
  },
];

/**
 * O(1) lookup map keyed by Kanji character ('金', '閣', ..., '命' — 80 keys).
 */
export const KOREAN_MNEMONICS: Record<string, KoreanMnemonicEntry> = Object.fromEntries(
  KOREAN_MNEMONIC_LIST.map((entry) => [entry.character, entry])
);

/**
 * O(1) lookup map keyed by curriculum entry ID ('kinkaku-01-kin', ..., 'yukoku-80-mei' — 80 keys).
 */
export const KOREAN_MNEMONICS_BY_ID: Record<string, KoreanMnemonicEntry> = Object.fromEntries(
  KOREAN_MNEMONIC_LIST.map((entry) => [entry.id, entry])
);

/**
 * Retrieves the complete Korean mnemonic & cafe dialogue entry by Kanji glyph OR curriculum ID.
 */
export function getKoreanMnemonic(charOrId: string): KoreanMnemonicEntry | undefined {
  if (!charOrId) return undefined;
  const key = charOrId.trim();
  return KOREAN_MNEMONICS[key] || KOREAN_MNEMONICS_BY_ID[key];
}

/**
 * Builds a concise, high-impact first-sight scaffolding hint in Korean
 * (for unseen box === 0 kanji or when the player clicks the 💡 연상 힌트 pill).
 */
export function getFirstSightHintKo(charOrId: string): string {
  const entry = getKoreanMnemonic(charOrId);
  if (!entry) return '';
  return `${entry.visualPictogram} [${entry.huneum}] ${entry.radicalBreakdown} — ${entry.storyMnemonicKo}`;
}

// ============================================================================
// Phase 3 Beginner Onboarding Helpers:
// 1) Accurate Hiragana/Katakana -> Hangul pronunciation bridge
// 2) WEB-03-safe compound slot Korean 훈음 lookup (zero kanji glyph leakage!)
// 3) 5-kanji Stage Pre-Shift Lesson builder
// ============================================================================

const YOON_DIGRAPH_TO_HANGUL: Record<string, string> = {
  きゃ: '캬', きゅ: '큐', きょ: '쿄',
  ぎゃ: '갸', ぎゅ: '규', ぎょ: '교',
  しゃ: '샤', しゅ: '슈', しょ: '쇼',
  じゃ: '쟈', じゅ: '쥬', じょ: '죠',
  ぢゃ: '쟈', ぢゅ: '쥬', ぢょ: '죠',
  ちゃ: '챠', ちゅ: '츄', ちょ: '쵸',
  にゃ: '냐', にゅ: '뉴', にょ: '뇨',
  ひゃ: '햐', ひゅ: '휴', ひょ: '효',
  びゃ: '뱌', びゅ: '뷰', びょ: '뵤',
  ぴゃ: '퍄', ぴゅ: '퓨', ぴょ: '표',
  みゃ: '먀', みゅ: '뮤', みょ: '묘',
  りゃ: '랴', りゅ: '류', りょ: '료',
  ふぁ: '파', ふぃ: '피', ふぇ: '페', ふぉ: '포',
  てぃ: '티', でぃ: '디', しぇ: '셰', ちぇ: '체', じぇ: '제',
  うぃ: '위', うぇ: '웨', うぉ: '워',
};

const HIRAGANA_TO_HANGUL: Record<string, string> = {
  あ: '아', い: '이', う: '우', え: '에', お: '오',
  か: '카', き: '키', く: '쿠', け: '케', こ: '코',
  が: '가', ぎ: '기', ぐ: '구', げ: '게', ご: '고',
  さ: '사', し: '시', す: '스', せ: '세', そ: '소',
  ざ: '자', じ: '지', ず: '즈', ぜ: '제', ぞ: '조',
  た: '타', ち: '치', つ: '츠', て: '테', と: '토',
  だ: '다', ぢ: '지', づ: '즈', で: '데', ど: '도',
  な: '나', に: '니', ぬ: '누', ね: '네', の: '노',
  は: '하', ひ: '히', ふ: '후', へ: '헤', ほ: '호',
  ば: '바', び: '비', ぶ: '부', べ: '베', ぼ: '보',
  ぱ: '파', ぴ: '피', ぷ: '푸', ぺ: '페', ぽ: '포',
  ま: '마', み: '미', む: '무', め: '메', も: '모',
  や: '야', ゆ: '유', よ: '요',
  ら: '라', り: '리', る: '루', れ: '레', ろ: '로',
  わ: '와', ゐ: '이', ゑ: '에', を: '오',
  ぁ: '아', ぃ: '이', ぅ: '우', ぇ: '에', ぉ: '오',
  ゃ: '야', ゅ: '유', ょ: '요', ゎ: '와', ゔ: '부',
};

const KANA_CHAR_REGEX = /[\u3040-\u309F\u30A0-\u30FF]/;

function normalizeKatakanaToHiragana(input: string): string {
  let out = '';
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    // Katakana ァ(0x30A1)..ヶ(0x30F6) -> Hiragana ぁ(0x3041)..ゖ(0x3096)
    if (code >= 0x30a1 && code <= 0x30f6) {
      out += String.fromCharCode(code - 0x60);
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Attaches a Korean final consonant (종성 받침: 4 = 'ㄴ' for ん/ン, 19 = 'ㅅ' for っ/ッ)
 * onto the preceding open Hangul syllable if possible.
 */
function attachBatchimToLastSyllable(syllables: string[], jongIndex: number, fallback: string): void {
  if (syllables.length === 0) {
    syllables.push(fallback);
    return;
  }
  const last = syllables[syllables.length - 1];
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const offset = code - 0xac00;
    const existingJong = offset % 28;
    if (existingJong === 0) {
      syllables[syllables.length - 1] = String.fromCharCode(code + jongIndex);
      return;
    }
  }
  syllables.push(fallback);
}

/**
 * Extends a Katakana chōonpu ('ー') using the vowel of the preceding Hangul syllable.
 */
function resolveChoonpuVowel(syllables: string[]): string {
  if (syllables.length === 0) return '';
  const last = syllables[syllables.length - 1];
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return '';
  const jung = Math.floor((code - 0xac00) / 28) % 21;
  // Jungseong indices: 0:ㅏ, 2:ㅑ, 4:ㅓ, 5:ㅔ, 6:ㅕ, 7:ㅖ, 8:ㅗ, 12:ㅛ, 13:ㅜ, 17:ㅠ, 18:ㅡ, 20:ㅣ
  if (jung === 0 || jung === 2 || jung === 9) return '아';
  if (jung === 5 || jung === 7 || jung === 1 || jung === 3 || jung === 4 || jung === 6) return '에';
  if (jung === 8 || jung === 12) return '오';
  if (jung === 13 || jung === 17) return '우';
  if (jung === 18) return '으';
  if (jung === 20) return '이';
  return '아';
}

function convertSingleKanaSegmentToHangul(segment: string): string {
  const cleaned = segment.replace(/[・\-\s]/g, '').trim();
  if (!cleaned) return '';
  const hira = normalizeKatakanaToHiragana(cleaned);
  const chars = Array.from(hira);
  const syllables: string[] = [];

  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    const next = chars[i + 1] || '';

    if (next) {
      const pair = ch + next;
      const yoon = YOON_DIGRAPH_TO_HANGUL[pair];
      if (yoon) {
        syllables.push(yoon);
        i += 2;
        continue;
      }
    }

    if (ch === 'ん') {
      // Attach 받침 ㄴ (jongseong index 4)
      attachBatchimToLastSyllable(syllables, 4, '은');
      i += 1;
      continue;
    }

    if (ch === 'っ') {
      // Attach 받침 ㅅ (jongseong index 19)
      attachBatchimToLastSyllable(syllables, 19, '읏');
      i += 1;
      continue;
    }

    if (ch === 'ー') {
      const ext = resolveChoonpuVowel(syllables);
      if (ext) syllables.push(ext);
      i += 1;
      continue;
    }

    const mapped = HIRAGANA_TO_HANGUL[ch];
    if (mapped) {
      syllables.push(mapped);
    } else if (!KANA_CHAR_REGEX.test(ch)) {
      syllables.push(ch);
    }
    i += 1;
  }

  return syllables.join('');
}

/**
 * Converts Japanese Hiragana/Katakana reading into accurate, beginner-friendly Korean Hangul.
 * Examples:
 * - 'キン' -> '킨'
 * - 'きんかくじ' -> '킨카쿠지'
 * - 'うつく・しい' -> '우츠쿠시이'
 * - 'ほのお' -> '호노오'
 * - 'せっぷく' -> '셋푸쿠'
 * - 'は / ヨウ' -> '하 / 요우'
 */
export function kanaToHangul(kana: string): string {
  if (!kana) return '';
  if (kana.includes('/')) {
    return kana
      .split('/')
      .map((part) => convertSingleKanaSegmentToHangul(part))
      .filter(Boolean)
      .join(' / ');
  }
  return convertSingleKanaSegmentToHangul(kana);
}

/**
 * Formats a Japanese Kana reading alongside its Korean Hangul pronunciation.
 * Examples:
 * - 'キン' -> 'キン (킨)'
 * - 'きんかくじ' -> 'きんかくじ (킨카쿠지)'
 * - 'うつく・しい' -> 'うつくしい (우츠쿠시이)'
 * - 'ほのお' -> 'ほのお (호노오)'
 * - 'は / ヨウ' -> 'は (하) / ヨウ (요우)'
 * Safe & idempotent: returns pure Kanji strings (e.g. '寺') or already-annotated strings unchanged.
 */
export function formatReadingWithHangul(kana: string): string {
  if (!kana) return '';
  const trimmed = kana.trim();
  if (!trimmed) return '';
  // Already annotated with Hangul in parentheses
  if (/[\(（][가-힣\s·\/]+[\)）]/.test(trimmed)) {
    return trimmed;
  }
  // No Hiragana/Katakana present (e.g. pure Kanji option in Boss Duel)
  if (!KANA_CHAR_REGEX.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.includes('/')) {
    return trimmed
      .split('/')
      .map((part) => formatReadingWithHangul(part))
      .join(' / ');
  }
  const displayKana = trimmed.replace(/[・\-]/g, '').trim();
  const hangul = convertSingleKanaSegmentToHangul(displayKana);
  if (!hangul) return displayKana;
  return `${displayKana} (${hangul})`;
}

/**
 * Complete Korean 훈음 lookup for every auxiliary/partner Kanji appearing in any
 * literaryCompounds entry or Boss Duel pair across the entire Salon Mishima corpus.
 * Zero CJK/Kana characters appear in the values so WEB-03 never sees raw glyph leaks!
 */
const COMPOUND_AUX_HUNEUM_KO: Record<string, string> = {
  // Boss comparison kanji
  侍: '모실 시', 炭: '숯 탄', 華: '빛날 화', 葉: '잎 엽', 優: '넉넉할 우',
  闊: '트일 활', 魄: '넋 백', 刀: '칼 도', 力: '힘 력', 回: '돌 회',
  // All auxiliary kanji appearing across literaryCompounds in Tiers 1–4
  黄: '누를 황', 箔: '금박 박', 楼: '다락 루', 院: '집 원', 禅: '참선 선',
  対: '마주할 대', 意: '뜻 의', 識: '알 식', 湖: '호수 호', 明: '밝을 명',
  水: '물 수', 火: '불 화', 上: '위 상', 情: '뜻 정', 暗: '어두울 암',
  学: '배울 학', 侶: '짝 려', 高: '높을 고', 夢: '꿈 몽', 破: '깨뜨릴 파',
  不: '아닐 불', 失: '잃을 실', 全: '온전할 전', 延: '늘일 연', 燼: '깜부기불 진',
  降: '내릴 강', 死: '죽을 사', 冠: '갓 관', 翼: '날개 익', 畔: '물가 반',
  古: '예 고', 栄: '영화 영', 輝: '빛날 휘', 望: '바랄 망', 拒: '막을 거',
  視: '볼 시', 猜: '시기할 시', 再: '두 재', 存: '있을 존', 黒: '검을 흑',
  風: '바람 풍', 喧: '시끄러울 훤', 物: '만물 물', 原: '언덕 원', 深: '깊을 심',
  富: '부자 부', 作: '지을 작', 舌: '혀 설', 濤: '큰물결 도', 夫: '사내 부',
  船: '배 선', 歌: '노래 가', 孤: '외로울 고', 民: '백성 민', 小: '작을 소',
  笹: '조릿대 세', 辺: '가 변', 漠: '사막 막', 夜: '밤 야', 伏: '엎드릴 복',
  入: '들 입', 約: '맺을 약', 祈: '빌 기', 青: '푸를 청', 残: '남을 잔',
  吹: '불 취', 天: '하늘 천', 人: '사람 인', 五: '다섯 오', 退: '물러날 퇴',
  弱: '약할 약', 下: '아래 하', 壺: '항아리 호', 川: '내 천', 莫: '없을 막',
  静: '고요할 정', 寥: '쓸쓸할 료', 象: '모양 상', 予: '미리 예', 宣: '베풀 선',
  純: '순수할 순', 潔: '깨끗할 결', 断: '끊을 단', 厳: '엄할 엄', 景: '볕 경',
  悪: '악할 악', 業: '업 업', 善: '착할 선', 虚: '빌 허', 羞: '부끄러울 수',
  辱: '욕될 욕', 部: '떼 부', 悲: '슬플 비', 薬: '약 약', 場: '마당 장',
  技: '재주 기', 公: '공변될 공', 溺: '빠질 닉', 読: '읽을 독', 毒: '독 독',
  弓: '활 궁', 教: '가르칠 교', 難: '어려울 난', 放: '놓을 방', 止: '그칠 지',
  照: '비출 조', 然: '그럴 연', 境: '지경 경', 自: '스스로 자', 共: '함께 공',
  洋: '큰바다 양', 内: '안 내', 慮: '생각할 려', 杞: '구기자 기', 皇: '임금 황',
  祖: '조상 조', 疾: '빠를 질', 神: '귀신 신', 星: '별 성', 鋼: '강철 강',
  拳: '주먹 권', 朝: '아침 조', 丸: '둥글 환', 体: '몸 체', 骨: '뼈 골',
  大: '클 대', 和: '화할 화', 霊: '신령 령', 闘: '싸울 투', 凶: '흉할 흉',
  割: '가를 할', 背: '등 배', 実: '열매 실', 親: '친할 친', 義: '옳을 의',
  誠: '정성 성', 節: '마디 절', 日: '날 일', 車: '수레 거', 巡: '돌 순',
  転: '구를 전', 那: '어찌 나', 痾: '고질병 아', 泊: '머무를 박', 運: '운전할 운',
  使: '부릴 사', 穣: '풍년 양',
};

function sanitizeNoJapaneseGlyphs(label: string): string {
  return label
    .replace(/[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF々]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Returns Korean 훈음 per character slot of a compound word
 * (e.g. '金閣寺' -> ['쇠 금', '누각 각', '절 사']).
 * Guaranteed NEVER to include raw CJK kanji or Japanese kana characters so WEB-03 stays 100% green!
 */
export function getCompoundSlotHuneums(compound: string): string[] {
  if (!compound) return [];
  return Array.from(compound.trim()).map((ch) => {
    const mne = KOREAN_MNEMONICS[ch];
    if (mne?.huneum) {
      return sanitizeNoJapaneseGlyphs(mne.huneum);
    }
    const aux = COMPOUND_AUX_HUNEUM_KO[ch];
    if (aux) {
      return sanitizeNoJapaneseGlyphs(aux);
    }
    if (ch === 'の') {
      return '조사 의(노)';
    }
    if (ch === 'と') {
      return '조사 과(토)';
    }
    if (KANA_CHAR_REGEX.test(ch)) {
      return `가나 ${kanaToHangul(ch)}`;
    }
    return '한자 조각';
  });
}

export interface StageKanjiLessonItem {
  /** Full curriculum entry from mishimaCurriculum.ts */
  kanji: MishimaKanjiEntry;
  /** Full Korean mnemonic & cafe dialogue entry */
  mnemonic: KoreanMnemonicEntry;
  /** Convenience top-level shortcuts */
  id: string;
  character: string;
  huneum: string;
  meaningKo: string;
  primaryReading: string;
  primaryReadingHangul: string;
  primaryReadingFormatted: string;
  onyomiFormatted: string[];
  kunyomiFormatted: string[];
  /** Gentle, zero-stress master coaching tip for warm-up practice */
  warmTipKo: string;
}

/**
 * Parses a stage identifier (e.g. 'stage-1-2') or stage number into normalized { tier, stageNum, stageId }.
 */
export function parseStageId(
  stageIdOrNum?: string | number | null,
  fallbackTier: CurriculumTierNumber = 1
): { tier: CurriculumTierNumber; stageNum: 1 | 2 | 3 | 4; stageId: string } {
  let tier: CurriculumTierNumber =
    fallbackTier === 1 || fallbackTier === 2 || fallbackTier === 3 || fallbackTier === 4
      ? fallbackTier
      : 1;
  let stageNum: 1 | 2 | 3 | 4 = 1;

  if (typeof stageIdOrNum === 'number' && Number.isFinite(stageIdOrNum)) {
    const clamped = Math.max(1, Math.min(4, Math.floor(stageIdOrNum))) as 1 | 2 | 3 | 4;
    stageNum = clamped;
  } else if (typeof stageIdOrNum === 'string') {
    const match = stageIdOrNum.match(/stage-(\d+)-(\d+)/);
    if (match) {
      const parsedTier = Number(match[1]);
      const parsedStage = Number(match[2]);
      if (parsedTier >= 1 && parsedTier <= 4) {
        tier = parsedTier as CurriculumTierNumber;
      }
      if (parsedStage >= 1 && parsedStage <= 4) {
        stageNum = parsedStage as 1 | 2 | 3 | 4;
      }
    } else {
      const trailing = stageIdOrNum.match(/(\d+)$/);
      if (trailing) {
        const parsedStage = Number(trailing[1]);
        if (parsedStage >= 1 && parsedStage <= 4) {
          stageNum = parsedStage as 1 | 2 | 3 | 4;
        }
      }
    }
  }

  return {
    tier,
    stageNum,
    stageId: `stage-${tier}-${stageNum}`,
  };
}

/**
 * Resolves the player's next uncompleted regular stage (defaults to Stage 1-1: 金 閣 寺 美 鏡 for new players).
 */
export function getNextUncompletedStage(
  unlockedTiers: readonly number[] = [1],
  completedStages: readonly string[] = []
): { tier: CurriculumTierNumber; stageNum: 1 | 2 | 3 | 4; stageId: string } {
  const validTiers = ([1, 2, 3, 4] as CurriculumTierNumber[]).filter((t) =>
    unlockedTiers.includes(t)
  );
  const tiersToScan: CurriculumTierNumber[] = validTiers.length > 0 ? validTiers : [1];

  for (const tier of tiersToScan) {
    for (const stageNum of [1, 2, 3, 4] as const) {
      const stageId = `stage-${tier}-${stageNum}`;
      if (!completedStages.includes(stageId)) {
        return { tier, stageNum, stageId };
      }
    }
  }

  const lastTier = tiersToScan[tiersToScan.length - 1] || 1;
  return { tier: lastTier, stageNum: 1, stageId: `stage-${lastTier}-1` };
}

/**
 * Returns the exact 5 MishimaKanjiEntry + KoreanMnemonicEntry pairs for a given tier (1..4) and stage (1..4 or 'stage-X-Y').
 * Matches GameEngine's exact stage slicing (`offset = (stageNum - 1) * 5`, slice of 5).
 */
export function getStageKanjiList(
  tier: 1 | 2 | 3 | 4 | number,
  stageNum: 1 | 2 | 3 | 4 | number | string = 1
): StageKanjiLessonItem[] {
  const safeTier: CurriculumTierNumber =
    tier === 1 || tier === 2 || tier === 3 || tier === 4 ? tier : 1;
  const parsed = parseStageId(stageNum, safeTier);
  const effectiveTier = typeof stageNum === 'string' && stageNum.startsWith('stage-') ? parsed.tier : safeTier;
  const offset = (parsed.stageNum - 1) * 5;

  const tierKanji = getKanjiByTier(effectiveTier);
  const slice = tierKanji.slice(offset, offset + 5);

  return slice.map((kanji) => {
    const mnemonic =
      getKoreanMnemonic(kanji.character) ||
      getKoreanMnemonic(kanji.id) ||
      KOREAN_MNEMONIC_LIST[0];

    const onyomiRaw = kanji.onyomi?.length ? kanji.onyomi : kanji.readings?.onyomi || [];
    const kunyomiRaw = kanji.kunyomi?.length ? kanji.kunyomi : kanji.readings?.kunyomi || [];

    const primaryReadingRaw = onyomiRaw[0] || kunyomiRaw[0] || kanji.character;
    const primaryReading = primaryReadingRaw.replace(/[・\-]/g, '').trim();
    const primaryReadingHangul = kanaToHangul(primaryReadingRaw);
    const primaryReadingFormatted = formatReadingWithHangul(primaryReadingRaw);

    const onyomiFormatted = onyomiRaw.map((r) => formatReadingWithHangul(r));
    const kunyomiFormatted = kunyomiRaw.map((r) => formatReadingWithHangul(r));

    const warmTipKo = `괜찮아요! ${mnemonic.visualPictogram} ${mnemonic.radicalBreakdown} → '${mnemonic.huneum}(${kanji.character})' · 발음은 ${primaryReadingFormatted}이에요 😊 다시 눌러볼까요?`;

    return {
      kanji,
      mnemonic,
      id: kanji.id,
      character: kanji.character,
      huneum: mnemonic.huneum,
      meaningKo: mnemonic.meaningKo,
      primaryReading,
      primaryReadingHangul,
      primaryReadingFormatted,
      onyomiFormatted,
      kunyomiFormatted,
      warmTipKo,
    };
  });
}


