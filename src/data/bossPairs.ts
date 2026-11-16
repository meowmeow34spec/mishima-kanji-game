/**
 * Salon Mishima - Confusing Kanji Boss Pairs Dataset
 * File: src/data/bossPairs.ts
 */

import { BossKanjiPair, CurriculumTierNumber } from '../types/curriculum';

export const BOSS_PAIRS: BossKanjiPair[] = [
  {
    id: 'boss-01-ji-samurai',
    title: '寺 vs 侍: 禅刹と武士の試練',
    subtitle: 'Temple Sanctuary vs Serving Samurai',
    tier: 1,
    characterA: '寺',
    characterB: '侍',
    meanings: {
      寺: 'Buddhist temple, sanctuary',
      侍: 'Samurai, warrior, to serve/attend',
    },
    readings: {
      寺: { onyomi: ['ジ'], kunyomi: ['てら'] },
      侍: { onyomi: ['ジ'], kunyomi: ['さむらい', 'はべ・る'] },
    },
    distinctionNotes:
      '「寺」は土＋寸（土地を規律で守る寺院）。「侍」は人偏（亻）がつき、人に仕える武士（さむらい）を意味します。金閣寺の「寺」に人偏はありません。',
    mnemonicTip: '寺（てら）は祈りの場、人偏がつけば侍（さむらい）が守る。',
    bossName: '寺侍ファントム (Temple & Samurai Phantom)',
    bossTitle: '第一階層 守護幻影 (Tier 1 Guardian Phantom)',
    bossHp: 10,
    timeLimitSeconds: 6.0,
    questions: [
      {
        id: 'q-boss-01-1',
        type: 'glyph_to_sound',
        prompt: '【寺】の訓読みを選べ',
        targetCharacter: '寺',
        options: [
          { kanji: '寺', reading: 'てら', meaning: 'temple', isCorrect: true },
          { kanji: '侍', reading: 'さむらい', meaning: 'samurai', isCorrect: false },
        ],
        correctAnswer: 'てら',
        explanation: '「寺」の訓読みは「てら」。「さむらい」は人偏のついた「侍」です。',
      },
      {
        id: 'q-boss-01-2',
        type: 'meaning_to_glyph',
        prompt: '「金閣寺（きんかくじ）」の最後の文字は？',
        targetCharacter: '寺',
        options: [
          { kanji: '寺', reading: 'ジ', meaning: 'temple', isCorrect: true },
          { kanji: '侍', reading: 'ジ', meaning: 'samurai', isCorrect: false },
        ],
        correctAnswer: '寺',
        explanation: '金閣寺は寺院であるため「寺」が正解です。',
      },
      {
        id: 'q-boss-01-3',
        type: 'sound_to_glyph',
        prompt: '「さむらい」を表す文字を選べ',
        targetCharacter: '侍',
        options: [
          { kanji: '侍', reading: 'さむらい', meaning: 'samurai', isCorrect: true },
          { kanji: '寺', reading: 'てら', meaning: 'temple', isCorrect: false },
        ],
        correctAnswer: '侍',
        explanation: '人に仕える武士は人偏のつく「侍」です。',
      },
    ],
  },
  {
    id: 'boss-02-en-tan',
    title: '炎 vs 炭: 紅蓮の業火と黒炭',
    subtitle: 'Blazing Inferno vs Compressed Charcoal',
    tier: 1,
    characterA: '炎',
    characterB: '炭',
    meanings: {
      炎: 'Flame, blaze, burning passion',
      炭: 'Charcoal, carbon, embers',
    },
    readings: {
      炎: { onyomi: ['エン'], kunyomi: ['ほのお'] },
      炭: { onyomi: ['タン'], kunyomi: ['すみ'] },
    },
    distinctionNotes:
      '「炎」は火が二つ重なって燃え盛る様子。「炭」は山＋厂＋火で、山中で木を蒸し焼きにして作った木炭を意味します。金閣を包むのは二連の「炎」です。',
    mnemonicTip: '火が二つ重なれば猛烈な炎（ほのお）、山の下で燻せば炭（すみ）。',
    bossName: '業火炭獣 (Inferno & Charcoal Beast)',
    bossTitle: '第一階層 烈火の主 (Tier 1 Lord of Flames)',
    bossHp: 10,
    timeLimitSeconds: 5.5,
    questions: [
      {
        id: 'q-boss-02-1',
        type: 'glyph_to_sound',
        prompt: '【炎】の訓読みを選べ',
        targetCharacter: '炎',
        options: [
          { kanji: '炎', reading: 'ほのお', meaning: 'flame', isCorrect: true },
          { kanji: '炭', reading: 'すみ', meaning: 'charcoal', isCorrect: false },
        ],
        correctAnswer: 'ほのお',
        explanation: '火が重なる「炎」は「ほのお」と読みます。',
      },
      {
        id: 'q-boss-02-2',
        type: 'meaning_to_glyph',
        prompt: '「炎上（えんじょう）」に用いる燃えさかる文字は？',
        targetCharacter: '炎',
        options: [
          { kanji: '炎', reading: 'エン', meaning: 'flame', isCorrect: true },
          { kanji: '炭', reading: 'タン', meaning: 'charcoal', isCorrect: false },
        ],
        correctAnswer: '炎',
        explanation: '炎上は火炎が燃え上がることで「炎」を書きます。',
      },
    ],
  },
  {
    id: 'boss-03-ka-yo',
    title: '華 vs 葉: 咲き誇る美と散りゆく木の葉',
    subtitle: 'Floral Splendor vs Deciduous Leaf',
    tier: 2,
    characterA: '華',
    characterB: '葉',
    meanings: {
      華: 'Splendor, floral bloom, gorgeousness',
      葉: 'Leaf, foliage, blade of grass',
    },
    readings: {
      華: { onyomi: ['カ', 'ケ'], kunyomi: ['はな'] },
      葉: { onyomi: ['ヨウ'], kunyomi: ['は'] },
    },
    distinctionNotes:
      '「華」はくさかんむりに豪華な花弁が広がる象形。「葉」はくさかんむりに「枼」（木の上に広がる薄い平らな葉）。『春の雪』の貴族美は「華族」「華麗」の「華」です。',
    mnemonicTip: '華（はな）は輝く美、葉（は）は木に茂るみどり。',
    bossName: '華葉精霊 (Splendor & Foliage Spirit)',
    bossTitle: '第二階層 庭園の幻影 (Tier 2 Garden Mirage)',
    bossHp: 10,
    timeLimitSeconds: 5.5,
    questions: [
      {
        id: 'q-boss-03-1',
        type: 'glyph_to_sound',
        prompt: '【華】の音読みを選べ',
        targetCharacter: '華',
        options: [
          { kanji: '華', reading: 'カ', meaning: 'splendor', isCorrect: true },
          { kanji: '葉', reading: 'ヨウ', meaning: 'leaf', isCorrect: false },
        ],
        correctAnswer: 'カ',
        explanation: '「華麗」「華族」の「華」は「カ」と読みます。',
      },
      {
        id: 'q-boss-03-2',
        type: 'meaning_to_glyph',
        prompt: '「言葉（ことば）」や「紅葉（こうよう）」の文字は？',
        targetCharacter: '葉',
        options: [
          { kanji: '葉', reading: 'は / ヨウ', meaning: 'leaf', isCorrect: true },
          { kanji: '華', reading: 'はな / カ', meaning: 'splendor', isCorrect: false },
        ],
        correctAnswer: '葉',
        explanation: '木の葉や言の葉には木（枼）が含まれる「葉」を用います。',
      },
    ],
  },
  {
    id: 'boss-04-yu-yu',
    title: '憂 vs 優: 祖国への憂慮と演じる優しさ',
    subtitle: 'Patriotic Grief vs Elegant Excellence/Actor',
    tier: 3,
    characterA: '憂',
    characterB: '優',
    meanings: {
      憂: 'Grieve, sorrow, mourn for, anxiety',
      優: 'Gentle, superior, excellence, actor/perform',
    },
    readings: {
      憂: { onyomi: ['ユウ'], kunyomi: ['うれ・える', 'う・い'] },
      優: { onyomi: ['ユウ'], kunyomi: ['やさ・しい', 'すぐ・れる'] },
    },
    distinctionNotes:
      '「憂」は悲しみに顔を伏せ心を痛める姿。「優」は人偏（亻）がつき、舞台で演じる「俳優」や、人に寄り添う「優しさ」、卓越した「優秀」を表します。三島の傑作は『憂国』です。',
    mnemonicTip: '人偏がなければ胸ふさぐ憂（うれい）、人偏がつけば優（やさ）しい俳優。',
    bossName: '憂優の仮面士 (Duelist of Grief & Grace)',
    bossTitle: '第三階層 心理劇の主 (Tier 3 Psychological Duelist)',
    bossHp: 12,
    timeLimitSeconds: 5.0,
    questions: [
      {
        id: 'q-boss-04-1',
        type: 'glyph_to_sound',
        prompt: '三島作品『憂国』の【憂】の訓読みは？',
        targetCharacter: '憂',
        options: [
          { kanji: '憂', reading: 'うれ・える', meaning: 'grieve/lament', isCorrect: true },
          { kanji: '優', reading: 'やさ・しい', meaning: 'gentle', isCorrect: false },
        ],
        correctAnswer: 'うれ・える',
        explanation: '「憂」は国の行く末を憂える（うれえる）の意です。',
      },
      {
        id: 'q-boss-04-2',
        type: 'meaning_to_glyph',
        prompt: '「俳優（はいゆう）」や「優秀（ゆうしゅう）」に用いる字は？',
        targetCharacter: '優',
        options: [
          { kanji: '優', reading: 'ユウ', meaning: 'actor/excellent', isCorrect: true },
          { kanji: '憂', reading: 'ユウ', meaning: 'sorrow', isCorrect: false },
        ],
        correctAnswer: '優',
        explanation: '人偏のついた「優」は演じる人（俳優）や秀でた人を表します。',
      },
    ],
  },
  {
    id: 'boss-05-kaku-katsu',
    title: '閣 vs 闊: 堅牢な楼閣と広闊なる虚無',
    subtitle: 'Towering Pavilion vs Boundless Broadness',
    tier: 3,
    characterA: '閣',
    characterB: '闊',
    meanings: {
      閣: 'Pavilion, palace, tall tower, cabinet',
      闊: 'Spacious, wide, broad, distant',
    },
    readings: {
      閣: { onyomi: ['カク'], kunyomi: [] },
      闊: { onyomi: ['カツ'], kunyomi: [] },
    },
    distinctionNotes:
      '両方とも門構えですが、中は「各」と「活」。「閣」は各階を重ねた高い御殿（金閣・楼閣）。「闊」は水が流れる活を含み、広々として遮るものがないこと（広闊・闊達）。',
    mnemonicTip: '門の中に各階あれば金閣（カク）、門の中に水流活気あれば闊達（カツ）。',
    bossName: '楼閣広闊魔 (Pavilion of Vast Emptiness)',
    bossTitle: '第三階層 空間の怪人 (Tier 3 Spatial Phantom)',
    bossHp: 12,
    timeLimitSeconds: 5.0,
    questions: [
      {
        id: 'q-boss-05-1',
        type: 'glyph_to_sound',
        prompt: '【閣】の音読みを選べ',
        targetCharacter: '閣',
        options: [
          { kanji: '閣', reading: 'カク', meaning: 'pavilion', isCorrect: true },
          { kanji: '闊', reading: 'カツ', meaning: 'spacious', isCorrect: false },
        ],
        correctAnswer: 'カク',
        explanation: '金閣・内閣の「閣」は「カク」と読みます。',
      },
      {
        id: 'q-boss-05-2',
        type: 'meaning_to_glyph',
        prompt: '「金閣寺（きんかくじ）」の「かく」を表す文字は？',
        targetCharacter: '閣',
        options: [
          { kanji: '閣', reading: 'カク', meaning: 'pavilion', isCorrect: true },
          { kanji: '闊', reading: 'カツ', meaning: 'spacious', isCorrect: false },
        ],
        correctAnswer: '閣',
        explanation: '門構えの中に「各」が入るのが「閣」です。',
      },
    ],
  },
  {
    id: 'boss-06-kon-haku',
    title: '魂 vs 魄: 天に昇る陽魂と地に留まる陰魄',
    subtitle: 'Ascending Yang Soul vs Earthbound Yin Wraith',
    tier: 4,
    characterA: '魂',
    characterB: '魄',
    meanings: {
      魂: 'Soul, spiritual mind, divine psyche',
      魄: 'Physical spirit, earthly wraith, animal soul',
    },
    readings: {
      魂: { onyomi: ['コン'], kunyomi: ['たましい', 'たま'] },
      魄: { onyomi: ['ハク'], kunyomi: ['はく'] },
    },
    distinctionNotes:
      '東洋思想では人間は天の「魂（云＋鬼）」と地の「魄（白＋鬼）」から成る。死して魂は天に昇り、魄は骨（白）となって大地に帰る。『奔馬』で勲が宿すのは烈しき「魂（たましい）」です。',
    mnemonicTip: '雲のように昇る魂（たましい）、白骨となって残る魄（はく）。',
    bossName: '魂魄天魔 (Soul & Wraith Demon)',
    bossTitle: '第四階層 死生観の審判 (Tier 4 Arbiter of Samsara)',
    bossHp: 12,
    timeLimitSeconds: 4.5,
    questions: [
      {
        id: 'q-boss-06-1',
        type: 'glyph_to_sound',
        prompt: '【魂】の訓読みを選べ',
        targetCharacter: '魂',
        options: [
          { kanji: '魂', reading: 'たましい', meaning: 'soul', isCorrect: true },
          { kanji: '魄', reading: 'はく', meaning: 'wraith', isCorrect: false },
        ],
        correctAnswer: 'たましい',
        explanation: '「魂」は「たましい」。「魄」は「はく」です。',
      },
      {
        id: 'q-boss-06-2',
        type: 'meaning_to_glyph',
        prompt: '大和魂（やまとだましい）の「たましい」は？',
        targetCharacter: '魂',
        options: [
          { kanji: '魂', reading: 'コン', meaning: 'soul', isCorrect: true },
          { kanji: '魄', reading: 'ハク', meaning: 'wraith', isCorrect: false },
        ],
        correctAnswer: '魂',
        explanation: '精神・志を表すのは「云」偏の「魂」です。',
      },
    ],
  },
  {
    id: 'boss-07-blade-family',
    title: '四刃の門: 刀 · 刃 · 切 · 力 の峻別',
    subtitle: 'The Fourfold Blades: Sword, Whetted Edge, Severing Cut & Force',
    tier: 4,
    characterA: '刃',
    characterB: '刀',
    additionalCharacters: ['切', '力'],
    meanings: {
      刃: 'Blade, whetted cutting edge',
      刀: 'Sword, katana, single-edged saber',
      切: 'Cut, sever, poignant, urgent',
      力: 'Power, physical force, vigor',
    },
    readings: {
      刃: { onyomi: ['ジン'], kunyomi: ['は', 'やいば'] },
      刀: { onyomi: ['トウ'], kunyomi: ['かたな'] },
      切: { onyomi: ['セツ', 'サイ'], kunyomi: ['き・る'] },
      力: { onyomi: ['リョク', 'リキ'], kunyomi: ['ちから'] },
    },
    distinctionNotes:
      '「刀」は反りのある刀身の形（2画）。「刃」はその内側に切っ先の点を打ち鋭利な刃先を示す（3画）。「切」は七＋刀で断ち切る動作。「力」は上部が突き抜けず筋肉の張りを表す。白刃の「刃」と切腹の「切」を見極めよ。',
    mnemonicTip: '刀の中に点があれば刃（やいば）、七がつけば切（きる）、突き出ぬ筋は力（ちから）。',
    bossName: '四面白刃王 (Master of the Fourfold Blades)',
    bossTitle: '第四階層 抜刀の武神 (Tier 4 Martial Blade Sovereign)',
    bossHp: 14,
    timeLimitSeconds: 4.0,
    questions: [
      {
        id: 'q-boss-07-1',
        type: 'glyph_to_sound',
        prompt: '【刃】の訓読みを選べ',
        targetCharacter: '刃',
        options: [
          { kanji: '刃', reading: 'やいば', meaning: 'blade edge', isCorrect: true },
          { kanji: '刀', reading: 'かたな', meaning: 'sword', isCorrect: false },
        ],
        correctAnswer: 'やいば',
        explanation: '点が入った「刃」は刃先を意味し「やいば」「は」と読みます。',
      },
      {
        id: 'q-boss-07-2',
        type: 'meaning_to_glyph',
        prompt: '「白刃（はくじん）」の鋭い切っ先を表す文字は？',
        targetCharacter: '刃',
        options: [
          { kanji: '刃', reading: 'ジン', meaning: 'blade edge', isCorrect: true },
          { kanji: '刀', reading: 'トウ', meaning: 'sword', isCorrect: false },
          { kanji: '力', reading: 'リョク', meaning: 'power', isCorrect: false },
        ],
        correctAnswer: '刃',
        explanation: '研ぎ澄まされた刃先の点をもつ「刃」が白刃の字です。',
      },
      {
        id: 'q-boss-07-3',
        type: 'sound_to_glyph',
        prompt: '「せっぷく（切腹）」の「せつ」を表す文字は？',
        targetCharacter: '切',
        options: [
          { kanji: '切', reading: 'セツ', meaning: 'cut/sever', isCorrect: true },
          { kanji: '刃', reading: 'ジン', meaning: 'blade', isCorrect: false },
        ],
        correctAnswer: '切',
        explanation: '「七」と「刀」が合わさった「切」が切腹の字です。',
      },
    ],
  },
  {
    id: 'boss-08-mishima-grand',
    title: '文豪・三島由紀夫の試練: 輪廻 · 刹那 · 宿命',
    subtitle: "Mishima's Ultimate Examination: Samsara, Fleeting Instant & Destiny",
    tier: 'special',
    characterA: '輪',
    characterB: '廻',
    additionalCharacters: ['刹', '宿', '命'],
    meanings: {
      輪: 'Wheel, cosmic ring, solar disc',
      廻: 'Revolve, cycle, rotate, round',
      刹: 'Split-second, instantaneous eternity, temple',
      宿: 'Destiny, lodge, dwelling, predetermined',
      命: 'Life, command, fate, dedication',
    },
    readings: {
      輪: { onyomi: ['リン'], kunyomi: ['わ'] },
      廻: { onyomi: ['カイ'], kunyomi: ['まわ・る'] },
      刹: { onyomi: ['セツ', 'サツ'], kunyomi: [] },
      宿: { onyomi: ['シュク'], kunyomi: ['やど'] },
      命: { onyomi: ['メイ', 'ミョウ'], kunyomi: ['いのち'] },
    },
    distinctionNotes:
      '三島文学の終着点である仏教的宇宙観と宿命。車輪の「輪」と巡る「廻」で「輪廻」を成し、極小の瞬間「刹那」に永遠を凝縮し、己の「宿命」に「命」を捧げて美を完成させる。',
    mnemonicTip: '輪（わ）と廻（まわり）で巡る魂、刹那（せつな）の閃光に命（いのち）を刻め。',
    bossName: '幻影文豪・三島 (Phantom Literatus Mishima)',
    bossTitle: 'サロン三島 最終試験官 (Salon Mishima Grand Master)',
    bossHp: 16,
    timeLimitSeconds: 3.5,
    questions: [
      {
        id: 'q-boss-08-1',
        type: 'glyph_to_sound',
        prompt: '【刹那】の「刹」の音読みは？',
        targetCharacter: '刹',
        options: [
          { kanji: '刹', reading: 'セツ', meaning: 'instant', isCorrect: true },
          { kanji: '切', reading: 'サイ', meaning: 'cut', isCorrect: false },
        ],
        correctAnswer: 'セツ',
        explanation: '「刹那」は仏教用語で極めて短い時間を表し、「セツ」と読みます。',
      },
      {
        id: 'q-boss-08-2',
        type: 'meaning_to_glyph',
        prompt: '「輪廻（りんね）」の「ね（めぐる）」を表す文字は？',
        targetCharacter: '廻',
        options: [
          { kanji: '廻', reading: 'カイ / え', meaning: 'revolve', isCorrect: true },
          { kanji: '回', reading: 'カイ', meaning: 'turn', isCorrect: false },
        ],
        correctAnswer: '廻',
        explanation: '仏教の「輪廻」の伝統的な表記は廴（えんにょう）のつく「廻」です。',
      },
      {
        id: 'q-boss-08-3',
        type: 'glyph_to_sound',
        prompt: '『奔馬』の結末で昇る【日輪】の「輪」の読みは？',
        targetCharacter: '輪',
        options: [
          { kanji: '輪', reading: 'リン', meaning: 'wheel/sun disc', isCorrect: true },
          { kanji: '輪', reading: 'わ', meaning: 'ring', isCorrect: false },
        ],
        correctAnswer: 'リン',
        explanation: '太陽の円盤を表す「日輪」は「にちりん」と音読みします。',
      },
    ],
  },
];

export function getAllBossPairs(): BossKanjiPair[] {
  return BOSS_PAIRS;
}

export function getBossPairById(id: string): BossKanjiPair | undefined {
  return BOSS_PAIRS.find((b) => b.id === id);
}

export function getBossPairsByTier(
  tier: CurriculumTierNumber | 'special'
): BossKanjiPair[] {
  return BOSS_PAIRS.filter((b) => b.tier === tier);
}
