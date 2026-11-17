/**
 * Salon Mishima - Korean Kanji Glossary (한국어 훈음 · 뜻 · 작품명 사전)
 * File: src/data/koreanGlossary.ts
 *
 * Provides Korean hun-eum (훈음), concise Korean meanings, compound glosses,
 * and Korean literary work titles for all 80 Yukio Mishima curriculum kanji.
 */

export interface KoreanKanjiGloss {
  /** Traditional Korean hun-eum, e.g. '쇠 금' */
  huneum: string;
  /** Concise Korean meaning, e.g. '금, 황금' */
  meaningKo: string;
  /** Korean gloss for literaryCompounds[0], e.g. '금각 (황금 누각)' */
  primaryCompoundKo: string;
}

export const MISHIMA_WORK_TITLES_KO: Record<string, string> = {
  '金閣寺': '금각사',
  '潮騒': '조소 (파도 소리)',
  '仮面の告白': '가면의 고백',
  '豊饒の海': '풍요의 바다',
  '春の雪': '봄눈',
  '奔馬': '분마 (달리는 말)',
  '暁の寺': '새벽의 사원',
  '天人五衰': '천인오쇠',
  '憂国': '우국',
  '太陽と鉄': '태양과 철',
  '禁色': '금색 (금지된 색)',
  '鹿鳴館': '록명관',
};

export const KOREAN_KANJI_GLOSSARY: Record<string, KoreanKanjiGloss> = {
  // Tier 1: 金閣の炎と耽美 (금각의 불꽃과 탐미)
  '金': { huneum: '쇠 금 · 성씨 김', meaningKo: '금, 황금, 쇠', primaryCompoundKo: '금각 (황금 누각)' },
  '閣': { huneum: '누각 각', meaningKo: '누각, 전각', primaryCompoundKo: '금각 (황금 누각)' },
  '寺': { huneum: '절 사', meaningKo: '절, 사찰', primaryCompoundKo: '금각사' },
  '美': { huneum: '아름다울 미', meaningKo: '아름다움, 미', primaryCompoundKo: '탐미 (아름다움에 탐닉함)' },
  '鏡': { huneum: '거울 경', meaningKo: '거울, 비침', primaryCompoundKo: '경호지 (거울 연못)' },
  '炎': { huneum: '불꽃 염', meaningKo: '불꽃, 화염', primaryCompoundKo: '화염 (타오르는 불길)' },
  '影': { huneum: '그림자 영', meaningKo: '그림자, 환영', primaryCompoundKo: '환영 (환상과 그림자)' },
  '僧': { huneum: '중 승', meaningKo: '승려, 스님', primaryCompoundKo: '학승 (수행하는 젊은 승려)' },
  '幻': { huneum: '헛보일 환', meaningKo: '환상, 환영', primaryCompoundKo: '환영 (아른거리는 환영)' },
  '滅': { huneum: '멸할 멸', meaningKo: '멸망, 소멸', primaryCompoundKo: '파멸' },
  '焼': { huneum: '사를 소', meaningKo: '불타다, 태우다', primaryCompoundKo: '소실 (불타 사라짐)' },
  '灰': { huneum: '재 회', meaningKo: '재, 잿더미', primaryCompoundKo: '회진 (재와 티끌)' },
  '鳳': { huneum: '봉황 봉', meaningKo: '수컷 봉황', primaryCompoundKo: '봉황' },
  '凰': { huneum: '봉황 황', meaningKo: '암컷 봉황', primaryCompoundKo: '봉황' },
  '池': { huneum: '못 지', meaningKo: '연못', primaryCompoundKo: '경호지 (금각사 앞 연못)' },
  '光': { huneum: '빛 광', meaningKo: '빛, 광채', primaryCompoundKo: '금광 (황금빛)' },
  '絶': { huneum: '끊을 절', meaningKo: '절대, 끊다', primaryCompoundKo: '절대' },
  '嫉': { huneum: '질투할 질', meaningKo: '샘내다, 질투', primaryCompoundKo: '질투' },
  '妬': { huneum: '투기할 투', meaningKo: '질투하다, 시기', primaryCompoundKo: '질투' },
  '生': { huneum: '날 생', meaningKo: '삶, 살아가다', primaryCompoundKo: '재생 (다시 살아남)' },

  // Tier 2: 潮騒の海と幽玄 (파도 소리의 바다와 유현)
  '潮': { huneum: '조수 조', meaningKo: '밀물, 조수, 파도', primaryCompoundKo: '조소 (파도 소리)' },
  '騒': { huneum: '떠들 소', meaningKo: '술렁이다, 파도 소리', primaryCompoundKo: '조소 (파도 소리)' },
  '海': { huneum: '바다 해', meaningKo: '바다, 대양', primaryCompoundKo: '풍요의 바다' },
  '豊': { huneum: '풍년 풍', meaningKo: '풍요롭다, 넉넉하다', primaryCompoundKo: '풍요' },
  '饒': { huneum: '넉넉할 요', meaningKo: '비옥하다, 풍성하다', primaryCompoundKo: '풍요' },
  '波': { huneum: '물결 파', meaningKo: '파도, 물결', primaryCompoundKo: '백파 (하얀 포말의 파도)' },
  '漁': { huneum: '고기 잡을 어', meaningKo: '고기잡이, 어업', primaryCompoundKo: '어부' },
  '島': { huneum: '섬 도', meaningKo: '섬', primaryCompoundKo: '우타지마 (노래섬)' },
  '舟': { huneum: '배 주', meaningKo: '작은 배, 조각배', primaryCompoundKo: '조각배 (작은 배)' },
  '嵐': { huneum: '폭풍 람', meaningKo: '폭풍우, 거센 바람', primaryCompoundKo: '모래폭풍' },
  '浜': { huneum: '물가 빈', meaningKo: '해변, 바닷가', primaryCompoundKo: '해변 (바닷가)' },
  '砂': { huneum: '모래 사', meaningKo: '모래', primaryCompoundKo: '백사 (하얀 모래)' },
  '篝': { huneum: '화톳불 구', meaningKo: '화톳불, 횃불 바구니', primaryCompoundKo: '화톳불 (밤을 밝히는 불)' },
  '潜': { huneum: '잠길 잠', meaningKo: '잠수하다, 숨다', primaryCompoundKo: '잠수' },
  '誓': { huneum: '맹세할 서', meaningKo: '맹세, 서약', primaryCompoundKo: '서약 (굳은 맹세)' },
  '春': { huneum: '봄 춘', meaningKo: '봄', primaryCompoundKo: '춘설 (봄눈)' },
  '雪': { huneum: '눈 설', meaningKo: '눈', primaryCompoundKo: '잔설 (녹지 않고 남은 눈)' },
  '衰': { huneum: '쇠할 쇠', meaningKo: '쇠퇴하다, 시들다', primaryCompoundKo: '천인오쇠 (천인의 다섯 가지 쇠락)' },
  '滝': { huneum: '폭포 륭(용)', meaningKo: '폭포', primaryCompoundKo: '폭포 아래' },
  '寂': { huneum: '고요할 적', meaningKo: '고요하다, 쓸쓸하다', primaryCompoundKo: '적막 (고요하고 쓸쓸함)' },

  // Tier 3: 仮面の告白と愛憎 (가면의 고백과 애증)
  '仮': { huneum: '거짓 가', meaningKo: '가면, 거짓, 임시', primaryCompoundKo: '가면' },
  '面': { huneum: '낯 면', meaningKo: '얼굴, 가면, 표면', primaryCompoundKo: '가면' },
  '告': { huneum: '고할 고', meaningKo: '고백하다, 알리다', primaryCompoundKo: '고백' },
  '白': { huneum: '흰 백', meaningKo: '희다, 순백, 털어놓다', primaryCompoundKo: '고백' },
  '禁': { huneum: '금할 금', meaningKo: '금지하다, 금기', primaryCompoundKo: '금색 (금지된 욕망의 빛)' },
  '色': { huneum: '빛 색', meaningKo: '빛깔, 관능', primaryCompoundKo: '금색 (금지된 색)' },
  '罪': { huneum: '죄 죄', meaningKo: '죄, 허물', primaryCompoundKo: '죄악' },
  '偽': { huneum: '거짓 위', meaningKo: '거짓, 위선', primaryCompoundKo: '위선' },
  '恥': { huneum: '부끄러울 치', meaningKo: '부끄러움, 수치', primaryCompoundKo: '수치심' },
  '劇': { huneum: '심할 극 · 연극 극', meaningKo: '연극, 희곡, 격렬함', primaryCompoundKo: '비극' },
  '演': { huneum: '펼 연', meaningKo: '연기하다, 공연하다', primaryCompoundKo: '연기' },
  '耽': { huneum: '즐길 탐', meaningKo: '탐닉하다, 깊이 빠지다', primaryCompoundKo: '탐미 (아름다움에 심취함)' },
  '矢': { huneum: '화살 시', meaningKo: '화살', primaryCompoundKo: '독화살' },
  '殉': { huneum: '따라죽을 순', meaningKo: '순교하다, 목숨을 바치다', primaryCompoundKo: '순교' },
  '射': { huneum: '쏠 사', meaningKo: '쏘다, 꿰뚫다, 비추다', primaryCompoundKo: '방사 (빛을 뿜어냄)' },
  '恍': { huneum: '황홀할 황', meaningKo: '황홀, 넋을 잃다', primaryCompoundKo: '황홀 (무아지경)' },
  '惚': { huneum: '황홀할 홀', meaningKo: '반하다, 황홀해하다', primaryCompoundKo: '황홀' },
  '鹿': { huneum: '사슴 록', meaningKo: '사슴', primaryCompoundKo: '록명관 (메이지 사교관)' },
  '鳴': { huneum: '울 명', meaningKo: '울다, 울려 퍼지다', primaryCompoundKo: '록명관' },
  '館': { huneum: '집 관', meaningKo: '회관, 저택, 관', primaryCompoundKo: '록명관' },

  // Tier 4: 憂国と太陽・奔馬 (우국과 태양·분마)
  '憂': { huneum: '근심 우', meaningKo: '근심하다, 슬퍼하다', primaryCompoundKo: '우국 (나라를 근심함)' },
  '国': { huneum: '나라 국', meaningKo: '나라, 조국', primaryCompoundKo: '우국' },
  '奔': { huneum: '달릴 분', meaningKo: '질주하다, 내달리다', primaryCompoundKo: '분마 (질주하는 말)' },
  '馬': { huneum: '말 마', meaningKo: '말, 준마', primaryCompoundKo: '분마 (질주하는 말)' },
  '暁': { huneum: '새벽 효', meaningKo: '새벽, 여명', primaryCompoundKo: '새벽의 사원' },
  '鉄': { huneum: '쇠 철', meaningKo: '철, 강철', primaryCompoundKo: '태양과 철' },
  '陽': { huneum: '볕 양', meaningKo: '태양, 햇빛', primaryCompoundKo: '태양' },
  '太': { huneum: '클 태', meaningKo: '크다, 거대하다', primaryCompoundKo: '태양' },
  '肉': { huneum: '고기 육', meaningKo: '육체, 살', primaryCompoundKo: '육체' },
  '筋': { huneum: '힘줄 근', meaningKo: '근육, 힘줄', primaryCompoundKo: '근육' },
  '魂': { huneum: '넋 혼', meaningKo: '영혼, 넋', primaryCompoundKo: '야마토 정신 (영혼)' },
  '刃': { huneum: '칼날 인', meaningKo: '칼날', primaryCompoundKo: '백인 (시퍼런 칼날)' },
  '腹': { huneum: '배 복', meaningKo: '배, 복부', primaryCompoundKo: '할복' },
  '切': { huneum: '끊을 절', meaningKo: '베다, 끊다, 간절하다', primaryCompoundKo: '할복' },
  '忠': { huneum: '충성 충', meaningKo: '충성, 충의', primaryCompoundKo: '충의' },
  '輪': { huneum: '바퀴 륜', meaningKo: '바퀴, 고리, 윤회', primaryCompoundKo: '윤회' },
  '廻': { huneum: '돌 회', meaningKo: '돌다, 순환하다', primaryCompoundKo: '윤회 (거듭 태어남)' },
  '刹': { huneum: '찰나 찰 · 절 찰', meaningKo: '찰나, 아주 짧은 순간', primaryCompoundKo: '찰나 (순간의 영원)' },
  '宿': { huneum: '잘 숙', meaningKo: '숙명, 머물다', primaryCompoundKo: '숙명 (타고난 운명)' },
  '命': { huneum: '목숨 명', meaningKo: '생명, 목숨, 운명', primaryCompoundKo: '숙명' },
};

export function getKoreanGloss(character: string): KoreanKanjiGloss | undefined {
  return KOREAN_KANJI_GLOSSARY[character];
}

export function getKoreanWorkTitle(japaneseWork: string): string {
  return MISHIMA_WORK_TITLES_KO[japaneseWork] || '';
}
