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

export interface KoreanTierMeta {
  tier: 1 | 2 | 3 | 4;
  nameKo: string;
  subtitleKo: string;
  themeKo: string;
}

export const TIER_METADATA_KO: Record<number, KoreanTierMeta> = {
  1: {
    tier: 1,
    nameKo: '금각의 불꽃과 탐미',
    subtitleKo: '『금각사』와 절대미의 미학 (20자)',
    themeKo: '절대적인 아름다움에 대한 집착, 거울 연못에 비친 환영, 그리고 불길 속의 영원한 완성.',
  },
  2: {
    tier: 2,
    nameKo: '파도 소리의 바다와 유현',
    subtitleKo: '『조소』·『봄눈』·『천인오쇠』 (20자)',
    themeKo: '우타지마 섬의 순수한 사랑과 거센 파도, 봄눈처럼 녹아내리는 귀족의 비련과 적막.',
  },
  3: {
    tier: 3,
    nameKo: '가면의 고백과 애증',
    subtitleKo: '『가면의 고백』·『금색』·『록명관』 (20자)',
    themeKo: '세상을 속이는 가면과 내면의 고백, 성 세바스찬의 화살, 화려한 무도회 뒤의 애증.',
  },
  4: {
    tier: 4,
    nameKo: '우국과 태양·분마',
    subtitleKo: '『우국』·『분마』·『태양과 철』 (20자)',
    themeKo: '대의를 향한 결연한 충절, 질주하는 준마, 강철로 단련한 육체와 윤회·찰나의 숙명.',
  },
};

export interface KoreanCustomerMeta {
  id: string;
  nameJa: string;
  nameKo: string;
  roleKo: string;
  workKo: string;
}

export const SALON_CUSTOMERS_KO: Record<string, KoreanCustomerMeta> = {
  uiko: { id: 'uiko', nameJa: '有為子', nameKo: '우이코', roleKo: '비운의 소녀', workKo: '금각사' },
  kashiwagi: { id: 'kashiwagi', nameJa: '柏木', nameKo: '가시와기', roleKo: '냉소적인 학우', workKo: '금각사' },
  mizoguchi: { id: 'mizoguchi', nameJa: '溝口', nameKo: '미조구치', roleKo: '젊은 수행승', workKo: '금각사' },
  shinji: { id: 'shinji', nameJa: '新治', nameKo: '신지', roleKo: '청년 어부', workKo: '조소' },
  hatsue: { id: 'hatsue', nameJa: '初江', nameKo: '하츠에', roleKo: '해녀 소녀', workKo: '조소' },
  kiyoaki: { id: 'kiyoaki', nameJa: '松枝清顕', nameKo: '마츠가에 키요아키', roleKo: '미모의 귀공자', workKo: '봄눈' },
  honda: { id: 'honda', nameJa: '本多繁邦', nameKo: '혼다 시게쿠니', roleKo: '관찰자·법조인', workKo: '풍요의 바다' },
  kageyama: { id: 'kageyama', nameJa: '影山朝子', nameKo: '카게야마 아사코', roleKo: '백작부인', workKo: '록명관' },
  asako: { id: 'asako', nameJa: '影山朝子', nameKo: '카게야마 아사코', roleKo: '백작부인', workKo: '록명관' },
};

/**
 * Extra comparison kanji appearing in Boss Duels (kept separate so KOREAN_KANJI_GLOSSARY stays exact 80 keys).
 */
export const BOSS_EXTRA_KANJI_GLOSSARY_KO: Record<string, KoreanKanjiGloss> = {
  '侍': { huneum: '모실 시', meaningKo: '무사, 사무라이, 모시다', primaryCompoundKo: '무사 (사무라이)' },
  '炭': { huneum: '숯 탄', meaningKo: '숯, 목탄', primaryCompoundKo: '목탄 (나무 숯)' },
  '華': { huneum: '빛날 화', meaningKo: '화려함, 꽃', primaryCompoundKo: '화려 (눈부시게 고움)' },
  '葉': { huneum: '잎 엽', meaningKo: '나뭇잎, 언어(고토바)', primaryCompoundKo: '단풍잎 (홍엽)' },
  '優': { huneum: '넉넉할 우', meaningKo: '다정하다, 뛰어나다, 배우', primaryCompoundKo: '배우·우수' },
  '闊': { huneum: '트일 활', meaningKo: '넓고 트이다, 활달하다', primaryCompoundKo: '활달 (막힘없이 넓음)' },
  '魄': { huneum: '넋 백', meaningKo: '육체의 혼백', primaryCompoundKo: '혼백 (하늘의 혼과 땅의 백)' },
  '刀': { huneum: '칼 도', meaningKo: '칼, 일본도', primaryCompoundKo: '일본도 (카타나)' },
  '力': { huneum: '힘 력', meaningKo: '힘, 기력', primaryCompoundKo: '근력 (힘줄의 힘)' },
  '回': { huneum: '돌 회', meaningKo: '돌다, 회전하다', primaryCompoundKo: '회전' },
};

export interface KoreanBossPairMeta {
  id: string;
  titleKo: string;
  bossNameKo: string;
  bossTitleKo: string;
  distinctionKo: string;
  mnemonicTipKo: string;
}

export const BOSS_PAIRS_KO: Record<string, KoreanBossPairMeta> = {
  'boss-01-ji-samurai': {
    id: 'boss-01-ji-samurai',
    titleKo: '寺(절 사) vs 侍(모실 시): 산사와 무사의 시험',
    bossNameKo: '사찰·사무라이 환영',
    bossTitleKo: '제1계층 수호 보스',
    distinctionKo: '「寺(절 사)」는 땅(土)+법도(寸)만 있는 사찰(てら)이고, 왼쪽에 사람(亻)이 붙은 「侍(모실 시)」는 주군을 모시는 무사 사무라이(さむらい)입니다!',
    mnemonicTipKo: '사람(亻) 없으면 고요한 절(寺·테라), 사람(亻) 서 있으면 호위 무사(侍·사무라이)!',
  },
  'boss-02-en-tan': {
    id: 'boss-02-en-tan',
    titleKo: '炎(불꽃 염) vs 炭(숯 탄): 홍련의 화염과 검은 숯',
    bossNameKo: '업화탄수 (불꽃 야수)',
    bossTitleKo: '제1계층 열화의 주인',
    distinctionKo: '「炎(불꽃 염)」은 불(火) 두 개가 위아래로 솟구치는 화염(ほのお)이고, 「炭(숯 탄)」은 산(山) 기슭(厂) 아래서 나무를 구워 만든 검은 숯(すみ)입니다!',
    mnemonicTipKo: '불(火+火) 2단이면 치솟는 불꽃(炎·호노오), 산(山) 아래 구우면 까만 숯(炭·스미)!',
  },
  'boss-03-ka-yo': {
    id: 'boss-03-ka-yo',
    titleKo: '華(빛날 화) vs 葉(잎 엽): 만개한 꽃과 흩날리는 잎',
    bossNameKo: '화엽정령 (정원의 신기루)',
    bossTitleKo: '제2계층 정원 보스',
    distinctionKo: '「華(빛날 화)」는 꽃잎이 겹겹이 화려하게 핀 모습(カ·はな)이고, 아래에 나무(木)가 받치는 「葉(잎 엽)」은 나뭇잎(ヨウ·は)입니다!',
    mnemonicTipKo: '꽃잎이 대칭으로 빛나면 화려할 화(華·카), 아래 나무(木)가 있으면 나뭇잎 엽(葉·요우)!',
  },
  'boss-04-yu-yu': {
    id: 'boss-04-yu-yu',
    titleKo: '憂(근심 우) vs 優(넉넉할 우): 우국의 시름과 다정한 배우',
    bossNameKo: '우우(憂優)의 가면사',
    bossTitleKo: '제3계층 심리극의 주인',
    distinctionKo: '음독은 둘 다 ユウ(유우)! 사람(亻)이 없으면 가슴을 앓는 「憂(근심 우·うれえる)」, 사람(亻)이 붙으면 다정한 사람·배우인 「優(넉넉할 우·やさしい)」입니다!',
    mnemonicTipKo: '사람(亻) 없으면 홀로 앓는 근심(憂), 사람(亻)이 곁에 오면 다정하고 우수한 배우(優)!',
  },
  'boss-05-kaku-katsu': {
    id: 'boss-05-kaku-katsu',
    titleKo: '閣(누각 각) vs 闊(트일 활): 황금 누각과 광활한 공간',
    bossNameKo: '누각광활마',
    bossTitleKo: '제3계층 공간의 괴인',
    distinctionKo: '둘 다 문(門) 안이지만, 속이 「各(각각 각)」이면 층층이 솟은 금각 누각 「閣(カク)」, 물 흐르는 「活(살 활)」이면 탁 트인 「闊(カツ)」입니다!',
    mnemonicTipKo: '문(門) 안에 각(各)이 들면 금각사 누각(閣·카쿠), 물(氵) 흐르는 활(活)이면 활달(闊·카츠)!',
  },
  'boss-06-kon-haku': {
    id: 'boss-06-kon-haku',
    titleKo: '魂(넋 혼) vs 魄(넋 백): 승천하는 영혼과 대지의 혼백',
    bossNameKo: '혼백천마',
    bossTitleKo: '제4계층 사생관의 심판자',
    distinctionKo: '구름(云)이 붙은 「魂(넋 혼·コン·たましい)」은 하늘로 솟구치는 정신적 영혼이고, 흰 백(白)이 붙은 「魄(넋 백·ハク)」은 해골·대지에 남는 육체적 넋입니다!',
    mnemonicTipKo: '구름(云) 타고 하늘로 오르면 영혼 혼(魂·타마시이), 하얀 뼈(白)로 남으면 백(魄·하쿠)!',
  },
  'boss-07-blade-family': {
    id: 'boss-07-blade-family',
    titleKo: '사인(四刃)의 문: 刀 · 刃 · 切 · 力 완벽 구별',
    bossNameKo: '사면백인왕',
    bossTitleKo: '제4계층 발도의 무신',
    distinctionKo: '「刀(칼 도)」는 칼 몸체, 안에 점(丶)이 박힌 「刃(칼날 인·やいば)」은 베이는 칼날, 칠(七)이 붙은 「切(끊을 절·きる)」은 베어 자르기, 위로 삐져나온 「力(힘 력·ちから)」은 근육의 힘입니다!',
    mnemonicTipKo: '칼(刀)에 점 찍으면 칼날(刃·야이바), 칠(七) 붙으면 자를 절(切·키루), 삐죽 솟으면 힘 력(力)!',
  },
  'boss-08-mishima-grand': {
    id: 'boss-08-mishima-grand',
    titleKo: '문호 미시마 유키오의 최종 시험: 輪廻 · 刹那 · 宿命',
    bossNameKo: '환영문호 미시마',
    bossTitleKo: '살롱 미시마 최종 시험관',
    distinctionKo: '수레바퀴 「輪(リン)」과 길게 도는 「廻(カイ/ね)」가 만나 윤회(りんね)를 이루고, 칼날 스치는 「刹(セツ)」의 찰나 속에 타고난 「宿命(しゅくめい)」을 완성합니다!',
    mnemonicTipKo: '바퀴 륜(輪·린)+돌 회(廻)는 윤회(린네), 선칼(刂) 선 찰(刹·세츠)은 찰나, 지붕 백 명은 숙명(宿命)!',
  },
};

export function getAnyKoreanGloss(character: string): KoreanKanjiGloss | undefined {
  return KOREAN_KANJI_GLOSSARY[character] || BOSS_EXTRA_KANJI_GLOSSARY_KO[character];
}

export function getKoreanTierMeta(tier: number): KoreanTierMeta | undefined {
  return TIER_METADATA_KO[tier];
}

export function getKoreanCustomer(idOrName: string): KoreanCustomerMeta | undefined {
  if (!idOrName) return undefined;
  if (SALON_CUSTOMERS_KO[idOrName]) return SALON_CUSTOMERS_KO[idOrName];
  return Object.values(SALON_CUSTOMERS_KO).find(
    (c) => c.nameJa === idOrName || `avatar-${c.id}` === idOrName
  );
}

export function getKoreanBossMeta(bossId: string): KoreanBossPairMeta | undefined {
  return BOSS_PAIRS_KO[bossId];
}
