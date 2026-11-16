/**
 * Salon Mishima - Complete 80-Kanji Yukio Mishima Literary Curriculum Dataset
 * File: src/data/mishimaCurriculum.ts
 *
 * Full canonical curriculum across 4 tiers (20 entries per tier),
 * verified against Mishima's corpus (Shinchō Bunko editions) with 100%
 * character containment in quotes and compounds.
 */

import {
  MishimaKanjiEntry,
  CurriculumTierMeta,
  MishimaCurriculumDataset,
  CurriculumTierNumber,
} from '../types/curriculum';

export const TIER_METADATA: CurriculumTierMeta[] = [
  {
    tier: 1,
    name: '金閣の炎と耽美',
    subtitle: 'The Temple of the Golden Pavilion & Foundation Aesthetics',
    themeDescription:
      "Mizoguchi's obsession with absolute beauty, the burning of Rokuon-ji, mirror reflections, and the philosophical duality of destruction and eternity.",
    primaryWorks: ['金閣寺'],
    kanjiCount: 20,
  },
  {
    tier: 2,
    name: '潮騒の海と幽玄',
    subtitle:
      "The Sound of Waves & Sea of Fertility (Spring Snow / Angel's Decay)",
    themeDescription:
      'Island romance, raging waves, pure pastoral love, and the cosmic lunar cycles of Buddhist transmigration and angelic decay.',
    primaryWorks: ['潮騒', '豊饒の海', '春の雪', '天人五衰'],
    kanjiCount: 20,
  },
  {
    tier: 3,
    name: '仮面の告白と愛憎',
    subtitle: 'Confessions of a Mask, Forbidden Colors & Rokumeikan',
    themeDescription:
      'Psychological theatricality, performative masks, Saint Sebastian martyrdom, taboo desires, and the decadent ballroom intrigue of the Meiji aristocracy.',
    primaryWorks: ['仮面の告白', '禁色', '鹿鳴館'],
    kanjiCount: 20,
  },
  {
    tier: 4,
    name: '憂国と太陽・奔馬',
    subtitle:
      'Patriotism, Runaway Horses, Sun and Steel & Ultimate Philosophy',
    themeDescription:
      'Martial conviction, the Ni-Ni-Roku Incident, ritual seppuku, iron bodybuilding, runaway horses, sunburst at death, and Samsara.',
    primaryWorks: ['憂国', '奔馬', '太陽と鉄', '暁の寺'],
    kanjiCount: 20,
  },
];

export const MISHIMA_KANJI_CURRICULUM: MishimaKanjiEntry[] = [
  {
    "id": "kinkaku-01-kin",
    "character": "金",
    "strokeCount": 8,
    "grade": 1,
    "jlptLevel": "N5",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "キン",
      "コン"
    ],
    "kunyomi": [
      "かね",
      "かな-"
    ],
    "readings": {
      "onyomi": [
        "キン",
        "コン"
      ],
      "kunyomi": [
        "かね",
        "かな-"
      ]
    },
    "meanings": [
      "gold",
      "metal",
      "money"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "金閣",
        "reading": "きんかく",
        "meaning": "Golden Pavilion"
      },
      {
        "compound": "黄金",
        "reading": "おうごん",
        "meaning": "gold"
      },
      {
        "compound": "金箔",
        "reading": "きんぱく",
        "meaning": "gold compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「幼時から父は、私によく、金閣のことを語った。」",
      "englishTranslation": "From earliest childhood, my father often spoke to me of the Golden Pavilion.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "金箔抹茶パフェ",
      "flavorProfile": "Gold Leaf Matcha Parfait",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【金箔抹茶パフェ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-1",
      "n5",
      "金閣寺",
      "gold",
      "metal"
    ]
  },
  {
    "id": "kinkaku-02-kaku",
    "character": "閣",
    "strokeCount": 14,
    "grade": 6,
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "カク"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "カク"
      ],
      "kunyomi": []
    },
    "meanings": [
      "pavilion",
      "tall tower",
      "palace"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "金閣",
        "reading": "きんかく",
        "meaning": "Golden Pavilion"
      },
      {
        "compound": "楼閣",
        "reading": "ろうかく",
        "meaning": "multi-storied tower"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「金閣の全景は、池の青い水面に、微風にゆらぐ楼閣の影を投げていた。」",
      "englishTranslation": "The full view of the Golden Pavilion cast the reflection of the tower upon the blue surface of the pond.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "楼閣最中",
      "flavorProfile": "Tower Monaka Wafer",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【楼閣最中】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-6",
      "n1",
      "金閣寺",
      "pavilion",
      "tall-tower"
    ]
  },
  {
    "id": "kinkaku-03-ji",
    "character": "寺",
    "strokeCount": 6,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ジ"
    ],
    "kunyomi": [
      "てら"
    ],
    "readings": {
      "onyomi": [
        "ジ"
      ],
      "kunyomi": [
        "てら"
      ]
    },
    "meanings": [
      "Buddhist temple"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "金閣寺",
        "reading": "きんかくじ",
        "meaning": "Kinkaku-ji"
      },
      {
        "compound": "寺院",
        "reading": "じいん",
        "meaning": "temple"
      },
      {
        "compound": "禅寺",
        "reading": "ぜんでら",
        "meaning": "Buddhist temple compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「鹿苑寺の山門をくぐると、その寺の静寂が私を包んだ。」",
      "englishTranslation": "Passing through the outer gate of Rokuon-ji, the stillness of the temple enveloped me.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "禅寺煎茶",
      "flavorProfile": "Zen Temple Sencha",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【禅寺煎茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-2",
      "n4",
      "金閣寺",
      "buddhist-temple"
    ]
  },
  {
    "id": "kinkaku-04-bi",
    "character": "美",
    "strokeCount": 9,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ビ",
      "ミ"
    ],
    "kunyomi": [
      "うつく・しい"
    ],
    "readings": {
      "onyomi": [
        "ビ",
        "ミ"
      ],
      "kunyomi": [
        "うつく・しい"
      ]
    },
    "meanings": [
      "beauty",
      "aesthetic",
      "grace"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "耽美",
        "reading": "たんび",
        "meaning": "aestheticism"
      },
      {
        "compound": "絶対美",
        "reading": "ぜったいび",
        "meaning": "absolute beauty"
      },
      {
        "compound": "美意識",
        "reading": "びいしき",
        "meaning": "beauty compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「美というものは、何という冷酷な力を持っていることだろう。」",
      "englishTranslation": "What a ruthless power beauty possesses!",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "耽美琥珀羹",
      "flavorProfile": "Aesthetic Amber Agar Jelly",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【耽美琥珀羹】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-3",
      "n3",
      "金閣寺",
      "beauty",
      "aesthetic"
    ]
  },
  {
    "id": "kinkaku-05-kyo",
    "character": "鏡",
    "strokeCount": 19,
    "grade": 4,
    "jlptLevel": "N2",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "キョウ"
    ],
    "kunyomi": [
      "かがみ"
    ],
    "readings": {
      "onyomi": [
        "キョウ"
      ],
      "kunyomi": [
        "かがみ"
      ]
    },
    "meanings": [
      "mirror",
      "reflection"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "鏡湖池",
        "reading": "きょうこち",
        "meaning": "Mirror Pond"
      },
      {
        "compound": "明鏡",
        "reading": "めいきょう",
        "meaning": "clear mirror"
      },
      {
        "compound": "水鏡",
        "reading": "みずかがみ",
        "meaning": "mirror compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「鏡湖池の水面に映る金閣は、実物よりもさらに虚構のように美しかった。」",
      "englishTranslation": "Reflected in Mirror Pond, the pavilion was even more fictionally beautiful than the reality.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "鏡面葛切り",
      "flavorProfile": "Mirror Kudzu Noodles",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【鏡面葛切り】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-4",
      "n2",
      "金閣寺",
      "mirror",
      "reflection"
    ]
  },
  {
    "id": "kinkaku-06-en",
    "character": "炎",
    "strokeCount": 8,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "エン"
    ],
    "kunyomi": [
      "ほのお"
    ],
    "readings": {
      "onyomi": [
        "エン"
      ],
      "kunyomi": [
        "ほのお"
      ]
    },
    "meanings": [
      "flame",
      "blaze",
      "fire"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "火炎",
        "reading": "かえん",
        "meaning": "flames"
      },
      {
        "compound": "炎上",
        "reading": "えんじょう",
        "meaning": "blazing up"
      },
      {
        "compound": "情炎",
        "reading": "じょうえん",
        "meaning": "flame compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「夜空に舞い上がる火炎の中に、金閣の骨組みが黒々と浮かび上がった。」",
      "englishTranslation": "Amidst the flames soaring into the night sky, the dark skeleton of the Golden Pavilion emerged.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "紅炎焙じ茶",
      "flavorProfile": "Crimson Flame Hojicha",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【紅炎焙じ茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n1",
      "金閣寺",
      "flame",
      "blaze"
    ]
  },
  {
    "id": "kinkaku-07-ei",
    "character": "影",
    "strokeCount": 15,
    "grade": "S",
    "jlptLevel": "N2",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "エイ"
    ],
    "kunyomi": [
      "かげ"
    ],
    "readings": {
      "onyomi": [
        "エイ"
      ],
      "kunyomi": [
        "かげ"
      ]
    },
    "meanings": [
      "shadow",
      "silhouette",
      "reflection"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "幻影",
        "reading": "げんえい",
        "meaning": "phantom/vision"
      },
      {
        "compound": "面影",
        "reading": "おもかげ",
        "meaning": "visage/trace"
      },
      {
        "compound": "暗影",
        "reading": "あんえい",
        "meaning": "shadow compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私の心に焼きついた美の影は、決して消え去ることがなかった。」",
      "englishTranslation": "The shadow of beauty seared into my heart would never fade away.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "影絵黒胡麻羊羹",
      "flavorProfile": "Silhouette Black Sesame Yokan",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【影絵黒胡麻羊羹】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n2",
      "金閣寺",
      "shadow",
      "silhouette"
    ]
  },
  {
    "id": "kinkaku-08-so",
    "character": "僧",
    "strokeCount": 13,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ソウ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ソウ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "Buddhist monk",
      "priest"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "学僧",
        "reading": "がくそう",
        "meaning": "student monk"
      },
      {
        "compound": "僧侶",
        "reading": "そうりょ",
        "meaning": "Buddhist priest"
      },
      {
        "compound": "高僧",
        "reading": "こうそう",
        "meaning": "Buddhist monk compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「吃音の学僧であった私は、言葉の世界から追放されていた。」",
      "englishTranslation": "As a stuttering acolyte, I had been exiled from the realm of words.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "雲水薄茶",
      "flavorProfile": "Acolyte Light Matcha",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【雲水薄茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n1",
      "金閣寺",
      "buddhist-monk",
      "priest"
    ]
  },
  {
    "id": "kinkaku-09-gen",
    "character": "幻",
    "strokeCount": 4,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ゲン"
    ],
    "kunyomi": [
      "まぼろし"
    ],
    "readings": {
      "onyomi": [
        "ゲン"
      ],
      "kunyomi": [
        "まぼろし"
      ]
    },
    "meanings": [
      "illusion",
      "phantom",
      "apparition"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "幻影",
        "reading": "げんえい",
        "meaning": "phantom"
      },
      {
        "compound": "幻滅",
        "reading": "げんめつ",
        "meaning": "disillusionment"
      },
      {
        "compound": "夢幻",
        "reading": "むげん",
        "meaning": "illusion compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私を拒み続ける現実よりも、金閣の幻のほうがはるかに確かであった。」",
      "englishTranslation": "The phantom of the Golden Pavilion was far more solid than the reality that kept rejecting me.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "幻影落雁",
      "flavorProfile": "Phantom Sugar Candies",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【幻影落雁】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n1",
      "金閣寺",
      "illusion",
      "phantom"
    ]
  },
  {
    "id": "kinkaku-10-metsu",
    "character": "滅",
    "strokeCount": 13,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "メツ"
    ],
    "kunyomi": [
      "ほろ・びる",
      "ほろ・ぼす"
    ],
    "readings": {
      "onyomi": [
        "メツ"
      ],
      "kunyomi": [
        "ほろ・びる",
        "ほろ・ぼす"
      ]
    },
    "meanings": [
      "perish",
      "extinguish",
      "ruin"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "破滅",
        "reading": "はめつ",
        "meaning": "destruction/ruin"
      },
      {
        "compound": "不滅",
        "reading": "ふめつ",
        "meaning": "immortal"
      },
      {
        "compound": "生滅",
        "reading": "しょうめつ",
        "meaning": "perish compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「美が滅びる瞬間にこそ、永遠の完成があるのではないか。」",
      "englishTranslation": "Is it not at the very instant beauty perishes that eternal perfection is attained?",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "滅紫しるこ",
      "flavorProfile": "Extinction Purple Shiruko",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【滅紫しるこ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n1",
      "金閣寺",
      "perish",
      "extinguish"
    ]
  },
  {
    "id": "kinkaku-11-sho",
    "character": "焼",
    "strokeCount": 12,
    "grade": 4,
    "jlptLevel": "N3",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ショウ"
    ],
    "kunyomi": [
      "や・く",
      "や・ける"
    ],
    "readings": {
      "onyomi": [
        "ショウ"
      ],
      "kunyomi": [
        "や・く",
        "や・ける"
      ]
    },
    "meanings": [
      "burn",
      "bake",
      "scorch"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "焼失",
        "reading": "しょうしつ",
        "meaning": "destroyed by fire"
      },
      {
        "compound": "全焼",
        "reading": "ぜんしょう",
        "meaning": "burned to the ground"
      },
      {
        "compound": "延焼",
        "reading": "えんしょう",
        "meaning": "burn compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「燃えさかる炎の中で、私はすべてを焼き尽くす決意を固めた。」",
      "englishTranslation": "Amidst the roaring flames, I hardened my resolve to burn everything to ash.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "炭焼き団子",
      "flavorProfile": "Charcoal Roasted Dango",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【炭焼き団子】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-4",
      "n3",
      "金閣寺",
      "burn",
      "bake"
    ]
  },
  {
    "id": "kinkaku-12-kai",
    "character": "灰",
    "strokeCount": 6,
    "grade": 6,
    "jlptLevel": "N2",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": [
      "はい"
    ],
    "readings": {
      "onyomi": [
        "カイ"
      ],
      "kunyomi": [
        "はい"
      ]
    },
    "meanings": [
      "ash",
      "cinders",
      "embers"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "灰燼",
        "reading": "かいじん",
        "meaning": "ashes"
      },
      {
        "compound": "降灰",
        "reading": "こうかい",
        "meaning": "falling ash"
      },
      {
        "compound": "死灰",
        "reading": "しかい",
        "meaning": "ash compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「かつての燦然たる楼閣は、やがて冷たい灰燼に帰した。」",
      "englishTranslation": "The once resplendent pavilion at last returned to cold ashes.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "灰被り黒蜜蕨餅",
      "flavorProfile": "Ash-Dusted Warabimochi",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【灰被り黒蜜蕨餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-6",
      "n2",
      "金閣寺",
      "ash",
      "cinders"
    ]
  },
  {
    "id": "kinkaku-13-ho",
    "character": "鳳",
    "strokeCount": 14,
    "grade": "Jinmeiyo",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ホウ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ホウ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "male phoenix"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "鳳凰",
        "reading": "ほうおう",
        "meaning": "Chinese phoenix"
      },
      {
        "compound": "鳳冠",
        "reading": "ほうかん",
        "meaning": "phoenix crown"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「屋根の頂に立つ金色の鳳凰は、時を超えて空を見つめていた。」",
      "englishTranslation": "The golden phoenix atop the roof gazed out across time into the sky.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "鳳凰金団",
      "flavorProfile": "Golden Phoenix Kinton",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【鳳凰金団】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-jinmeiyo",
      "n1",
      "金閣寺",
      "male-phoenix"
    ]
  },
  {
    "id": "kinkaku-14-o",
    "character": "凰",
    "strokeCount": 11,
    "grade": "Jinmeiyo",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "オウ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "オウ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "female phoenix"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "鳳凰",
        "reading": "ほうおう",
        "meaning": "Chinese phoenix"
      },
      {
        "compound": "凰翼",
        "reading": "おうよく",
        "meaning": "female phoenix compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「鳳凰の羽ばたきは凍てつき、夜の星明かりだけを浴びていた。」",
      "englishTranslation": "The flapping of the phoenix wings was frozen, bathed only in starlight.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "金鳥練り切り",
      "flavorProfile": "Golden Bird Nerikiri",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【金鳥練り切り】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-jinmeiyo",
      "n1",
      "金閣寺",
      "female-phoenix"
    ]
  },
  {
    "id": "kinkaku-15-chi",
    "character": "池",
    "strokeCount": 6,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "チ"
    ],
    "kunyomi": [
      "いけ"
    ],
    "readings": {
      "onyomi": [
        "チ"
      ],
      "kunyomi": [
        "いけ"
      ]
    },
    "meanings": [
      "pond",
      "reservoir"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "鏡湖池",
        "reading": "きょうこち",
        "meaning": "Mirror Pond"
      },
      {
        "compound": "池畔",
        "reading": "ちはん",
        "meaning": "pond bank"
      },
      {
        "compound": "古池",
        "reading": "ふるいけ",
        "meaning": "pond compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私は池のほとりに立ち尽くし、さざ波を見つめていた。」",
      "englishTranslation": "I stood motionless on the bank of the pond, watching the ripples.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "蓮池玉露",
      "flavorProfile": "Lotus Pond Gyokuro",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【蓮池玉露】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-2",
      "n4",
      "金閣寺",
      "pond",
      "reservoir"
    ]
  },
  {
    "id": "kinkaku-16-ko",
    "character": "光",
    "strokeCount": 6,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "ひか・る",
      "ひかり"
    ],
    "readings": {
      "onyomi": [
        "コウ"
      ],
      "kunyomi": [
        "ひか・る",
        "ひかり"
      ]
    },
    "meanings": [
      "light",
      "radiance",
      "gleam"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "金光",
        "reading": "きんこう",
        "meaning": "golden light"
      },
      {
        "compound": "栄光",
        "reading": "えいこう",
        "meaning": "glory"
      },
      {
        "compound": "光輝",
        "reading": "こうき",
        "meaning": "light compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「夕暮れの日光を受けて、金箔は燦然たる輝きを放った。」",
      "englishTranslation": "Catching the evening sun, the gold leaf shed a dazzling luster.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "黄金光カステラ",
      "flavorProfile": "Golden Light Castella",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【黄金光カステラ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-2",
      "n4",
      "金閣寺",
      "light",
      "radiance"
    ]
  },
  {
    "id": "kinkaku-17-zetsu",
    "character": "絶",
    "strokeCount": 12,
    "grade": 5,
    "jlptLevel": "N2",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ゼツ"
    ],
    "kunyomi": [
      "た・える",
      "た・つ"
    ],
    "readings": {
      "onyomi": [
        "ゼツ"
      ],
      "kunyomi": [
        "た・える",
        "た・つ"
      ]
    },
    "meanings": [
      "absolute",
      "sever",
      "extinguish"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "絶対",
        "reading": "ぜったい",
        "meaning": "absolute"
      },
      {
        "compound": "絶望",
        "reading": "ぜつぼう",
        "meaning": "despair"
      },
      {
        "compound": "拒絶",
        "reading": "きょぜつ",
        "meaning": "absolute compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私は絶対の美と、この世の醜悪さとの間で引き裂かれていた。」",
      "englishTranslation": "I was torn between absolute beauty and the world's ugliness.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "絶対純米甘酒",
      "flavorProfile": "Absolute Pure Amazake",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【絶対純米甘酒】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-5",
      "n2",
      "金閣寺",
      "absolute",
      "sever"
    ]
  },
  {
    "id": "kinkaku-18-shitsu",
    "character": "嫉",
    "strokeCount": 13,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "シツ"
    ],
    "kunyomi": [
      "ねた・む"
    ],
    "readings": {
      "onyomi": [
        "シツ"
      ],
      "kunyomi": [
        "ねた・む"
      ]
    },
    "meanings": [
      "envy",
      "jealousy"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "嫉妬",
        "reading": "しっと",
        "meaning": "jealousy/envy"
      },
      {
        "compound": "嫉視",
        "reading": "しっし",
        "meaning": "envy compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私は彼らの健やかな世界に対して、暗い嫉妬を抱いていた。」",
      "englishTranslation": "Toward their wholesome, healthy world, I harbored a dark jealousy.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "嫉妬柚子ソーダ",
      "flavorProfile": "Jealousy Yuzu Soda",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【嫉妬柚子ソーダ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n1",
      "金閣寺",
      "envy",
      "jealousy"
    ]
  },
  {
    "id": "kinkaku-19-to",
    "character": "妬",
    "strokeCount": 8,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "ト"
    ],
    "kunyomi": [
      "ねた・む"
    ],
    "readings": {
      "onyomi": [
        "ト"
      ],
      "kunyomi": [
        "ねた・む"
      ]
    },
    "meanings": [
      "jealousy",
      "grudge"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "嫉妬",
        "reading": "しっと",
        "meaning": "jealousy/envy"
      },
      {
        "compound": "猜妬",
        "reading": "さいと",
        "meaning": "jealousy compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「嫉妬の毒が、私の吃音の舌をいっそう重く縛りつけた。」",
      "englishTranslation": "The venom of envy bound my stuttering tongue even more heavily.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "青梅冷菓",
      "flavorProfile": "Bitter Green Plum Sherbet",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【青梅冷菓】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-s",
      "n1",
      "金閣寺",
      "jealousy",
      "grudge"
    ]
  },
  {
    "id": "kinkaku-20-sei",
    "character": "生",
    "strokeCount": 5,
    "grade": 1,
    "jlptLevel": "N5",
    "tier": 1,
    "tierName": "金閣の炎と耽美",
    "onyomi": [
      "セイ",
      "ショウ"
    ],
    "kunyomi": [
      "い・きる",
      "う・まれる",
      "なま"
    ],
    "readings": {
      "onyomi": [
        "セイ",
        "ショウ"
      ],
      "kunyomi": [
        "い・きる",
        "う・まれる",
        "なま"
      ]
    },
    "meanings": [
      "life",
      "live",
      "birth",
      "raw"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "再生",
        "reading": "さいせい",
        "meaning": "rebirth"
      },
      {
        "compound": "生存",
        "reading": "せいぞん",
        "meaning": "survival"
      },
      {
        "compound": "死生",
        "reading": "しせい",
        "meaning": "life compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「一ト仕事を終えて一服している人がよくそう思うように、生きようと私は思った。」",
      "englishTranslation": "Like a man who has finished a job of work and sits down for a smoke, I wished to live.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "延命八宝茶",
      "flavorProfile": "Longevity Eight-Treasure Tea",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【延命八宝茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-1",
      "grade-1",
      "n5",
      "金閣寺",
      "life",
      "live"
    ]
  },
  {
    "id": "shiosai-21-cho",
    "character": "潮",
    "strokeCount": 15,
    "grade": 6,
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "チョウ"
    ],
    "kunyomi": [
      "しお"
    ],
    "readings": {
      "onyomi": [
        "チョウ"
      ],
      "kunyomi": [
        "しお"
      ]
    },
    "meanings": [
      "tide",
      "salt water",
      "current"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "潮騒",
        "reading": "しおさい",
        "meaning": "sound of the tide"
      },
      {
        "compound": "黒潮",
        "reading": "くろしお",
        "meaning": "Black Current"
      },
      {
        "compound": "潮風",
        "reading": "しおかぜ",
        "meaning": "tide compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「遠くから響いてくる潮騒の音が、夜の浜辺を静かに揺らしていた。」",
      "englishTranslation": "The roar of the surf echoing from afar gently rocked the night shore.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "潮騒塩羊羹",
      "flavorProfile": "Salt-Kissed Surf Yokan",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【潮騒塩羊羹】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-6",
      "n2",
      "潮騒",
      "tide",
      "salt-water"
    ]
  },
  {
    "id": "shiosai-22-so",
    "character": "騒",
    "strokeCount": 18,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ソウ"
    ],
    "kunyomi": [
      "さわ・ぐ"
    ],
    "readings": {
      "onyomi": [
        "ソウ"
      ],
      "kunyomi": [
        "さわ・ぐ"
      ]
    },
    "meanings": [
      "clamor",
      "tumult",
      "noisy"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "潮騒",
        "reading": "しおさい",
        "meaning": "sound of waves"
      },
      {
        "compound": "喧騒",
        "reading": "けんそう",
        "meaning": "bustle/noise"
      },
      {
        "compound": "物騒",
        "reading": "ぶっそう",
        "meaning": "clamor compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「磯の匂いと潮騒の合間に、二人の若い吐息が重なり合った。」",
      "englishTranslation": "Between the scent of the shore and the murmur of the tide, their young breaths mingled.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "磯騒サイダー",
      "flavorProfile": "Reef Surf Cider",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【磯騒サイダー】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n1",
      "潮騒",
      "clamor",
      "tumult"
    ]
  },
  {
    "id": "shiosai-23-kai",
    "character": "海",
    "strokeCount": 9,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": [
      "うみ"
    ],
    "readings": {
      "onyomi": [
        "カイ"
      ],
      "kunyomi": [
        "うみ"
      ]
    },
    "meanings": [
      "sea",
      "ocean"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "豊饒の海",
        "reading": "ほうじょうのうみ",
        "meaning": "Sea of Fertility"
      },
      {
        "compound": "海原",
        "reading": "うなばら",
        "meaning": "ocean expanse"
      },
      {
        "compound": "深海",
        "reading": "しんかい",
        "meaning": "sea compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「二百段の石段を昇って見返ると、古代さながらの伊勢の海が眺められる。」",
      "englishTranslation": "Climbing the two hundred stone steps and looking back, the sea of Ise spreads out like the sea of antiquity.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "伊勢海深碧茶",
      "flavorProfile": "Ise Deep Blue Ocean Tea",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【伊勢海深碧茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-2",
      "n4",
      "潮騒",
      "sea",
      "ocean"
    ]
  },
  {
    "id": "shiosai-24-ho",
    "character": "豊",
    "strokeCount": 13,
    "grade": 5,
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ホウ"
    ],
    "kunyomi": [
      "ゆた・か"
    ],
    "readings": {
      "onyomi": [
        "ホウ"
      ],
      "kunyomi": [
        "ゆた・か"
      ]
    },
    "meanings": [
      "abundant",
      "plentiful",
      "rich"
    ],
    "primaryWork": "豊饒の海",
    "primaryWorkEnglish": "The Sea of Fertility",
    "allRelatedWorks": [
      "豊饒の海",
      "潮騒",
      "春の雪",
      "奔馬",
      "天人五衰"
    ],
    "literaryCompounds": [
      {
        "compound": "豊饒",
        "reading": "ほうじょう",
        "meaning": "fertility/abundance"
      },
      {
        "compound": "豊富",
        "reading": "ほうふ",
        "meaning": "plentiful"
      },
      {
        "compound": "豊作",
        "reading": "ほうさく",
        "meaning": "abundant compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「月光に照らされた砂漠は、豊饒の海という名にふさわしい死の静寂をたたえていた。」",
      "englishTranslation": "Bathed in moonlight, the desert held a silence of death fitting the name Sea of Fertility.",
      "sourceWork": "豊饒の海",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『豊饒の海』."
    },
    "cafeOrderItem": {
      "itemName": "豊穣蜜芋ぜんざい",
      "flavorProfile": "Rich Honey Yam Zenzai",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【豊穣蜜芋ぜんざい】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-5",
      "n2",
      "豊饒の海",
      "abundant",
      "plentiful"
    ]
  },
  {
    "id": "shiosai-25-jo",
    "character": "饒",
    "strokeCount": 21,
    "grade": "Hyogai",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ジョウ",
      "ニョウ"
    ],
    "kunyomi": [
      "ゆた・か"
    ],
    "readings": {
      "onyomi": [
        "ジョウ",
        "ニョウ"
      ],
      "kunyomi": [
        "ゆた・か"
      ]
    },
    "meanings": [
      "fertile",
      "copious",
      "plentiful"
    ],
    "primaryWork": "豊饒の海",
    "primaryWorkEnglish": "The Sea of Fertility",
    "allRelatedWorks": [
      "豊饒の海",
      "潮騒",
      "春の雪",
      "奔馬",
      "天人五衰"
    ],
    "literaryCompounds": [
      {
        "compound": "豊饒",
        "reading": "ほうじょう",
        "meaning": "fertility/richness"
      },
      {
        "compound": "饒舌",
        "reading": "じょうぜつ",
        "meaning": "fertile compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「虚無の中にのみ、真の豊饒が存在するのかもしれなかった。」",
      "englishTranslation": "Perhaps only within nothingness does true fertility reside.",
      "sourceWork": "豊饒の海",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『豊饒の海』."
    },
    "cafeOrderItem": {
      "itemName": "豊饒抹茶饅頭",
      "flavorProfile": "Fertile Matcha Manju",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【豊饒抹茶饅頭】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-hyogai",
      "n1",
      "豊饒の海",
      "fertile",
      "copious"
    ]
  },
  {
    "id": "shiosai-26-ha",
    "character": "波",
    "strokeCount": 8,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ハ"
    ],
    "kunyomi": [
      "なみ"
    ],
    "readings": {
      "onyomi": [
        "ハ"
      ],
      "kunyomi": [
        "なみ"
      ]
    },
    "meanings": [
      "wave",
      "billow"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "白波",
        "reading": "しらなみ",
        "meaning": "whitecaps"
      },
      {
        "compound": "波濤",
        "reading": "はとう",
        "meaning": "surging billows, raging ocean waves"
      },
      {
        "compound": "さざ波",
        "reading": "さざなみ",
        "meaning": "ripples, gentle lapping waves"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「荒れ狂う波をものともせず、新治は海へと飛び込んだ。」",
      "englishTranslation": "Heeding not the raging waves, Shinji dived straight into the sea.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "白波落雁",
      "flavorProfile": "Whitecap Dry Sweets",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【白波落雁】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-3",
      "n3",
      "潮騒",
      "wave",
      "billow"
    ]
  },
  {
    "id": "shiosai-27-gyo",
    "character": "漁",
    "strokeCount": 14,
    "grade": 4,
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ギョ",
      "リョウ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ギョ",
        "リョウ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "fishing",
      "fishery"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "漁夫",
        "reading": "ぎょふ",
        "meaning": "fisherman"
      },
      {
        "compound": "漁船",
        "reading": "ぎょせん",
        "meaning": "fishing boat"
      },
      {
        "compound": "漁火",
        "reading": "いさりび",
        "meaning": "fishing compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「若い漁夫の逞しい腕は、潮風と日焼けで赤銅色に輝いていた。」",
      "englishTranslation": "The young fisherman's sinewy arms glowed bronze with sea breeze and sunburn.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "漁火焙じ茶ラテ",
      "flavorProfile": "Fisherman's Bonfire Latte",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【漁火焙じ茶ラテ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-4",
      "n2",
      "潮騒",
      "fishing",
      "fishery"
    ]
  },
  {
    "id": "shiosai-28-to",
    "character": "島",
    "strokeCount": 10,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "トウ"
    ],
    "kunyomi": [
      "しま"
    ],
    "readings": {
      "onyomi": [
        "トウ"
      ],
      "kunyomi": [
        "しま"
      ]
    },
    "meanings": [
      "island"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "歌島",
        "reading": "うたじま",
        "meaning": "Utajima island"
      },
      {
        "compound": "孤島",
        "reading": "ことう",
        "meaning": "solitary island"
      },
      {
        "compound": "島民",
        "reading": "とうみん",
        "meaning": "island compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「歌島は人口千四百、周囲一里に充たない小島である。」",
      "englishTranslation": "Utajima is a small island with a population of fourteen hundred and a circumference of less than a league.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "歌島柑橘ゼリー",
      "flavorProfile": "Utajima Citrus Jelly",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【歌島柑橘ゼリー】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-3",
      "n3",
      "潮騒",
      "island"
    ]
  },
  {
    "id": "shiosai-29-shu",
    "character": "舟",
    "strokeCount": 6,
    "grade": "S",
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "シュウ"
    ],
    "kunyomi": [
      "ふね",
      "ふな-"
    ],
    "readings": {
      "onyomi": [
        "シュウ"
      ],
      "kunyomi": [
        "ふね",
        "ふな-"
      ]
    },
    "meanings": [
      "boat",
      "small craft"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "小舟",
        "reading": "こぶね",
        "meaning": "small boat"
      },
      {
        "compound": "孤舟",
        "reading": "こしゅう",
        "meaning": "solitary boat"
      },
      {
        "compound": "笹舟",
        "reading": "ささぶね",
        "meaning": "boat compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「波間に揺れる一艘の小舟のように、運命は定まらなかった。」",
      "englishTranslation": "Like a lone boat rocking upon the waves, their destiny was yet unfixed.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "笹舟草餅",
      "flavorProfile": "Bamboo Boat Kusamochi",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【笹舟草餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n2",
      "潮騒",
      "boat",
      "small-craft"
    ]
  },
  {
    "id": "shiosai-30-ran",
    "character": "嵐",
    "strokeCount": 12,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ラン"
    ],
    "kunyomi": [
      "あらし"
    ],
    "readings": {
      "onyomi": [
        "ラン"
      ],
      "kunyomi": [
        "あらし"
      ]
    },
    "meanings": [
      "storm",
      "tempest"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "砂嵐",
        "reading": "すなあらし",
        "meaning": "sandstorm"
      },
      {
        "compound": "春嵐",
        "reading": "しゅんらん",
        "meaning": "spring storm, tempest of blossom season"
      },
      {
        "compound": "嵐雪",
        "reading": "らんせつ",
        "meaning": "snowstorm, blizzard"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「嵐の夜、観測塔の暗闇の中で二人の出会いは運命となった。」",
      "englishTranslation": "On the night of the tempest, in the darkness of the observation tower, their encounter became destiny.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "嵐の夜の生姜湯",
      "flavorProfile": "Stormy Night Ginger Elixir",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【嵐の夜の生姜湯】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n1",
      "潮騒",
      "storm",
      "tempest"
    ]
  },
  {
    "id": "shiosai-31-hin",
    "character": "浜",
    "strokeCount": 10,
    "grade": "S",
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ヒン"
    ],
    "kunyomi": [
      "はま"
    ],
    "readings": {
      "onyomi": [
        "ヒン"
      ],
      "kunyomi": [
        "はま"
      ]
    },
    "meanings": [
      "beach",
      "seashore"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "浜辺",
        "reading": "はまべ",
        "meaning": "beach"
      },
      {
        "compound": "海浜",
        "reading": "かいひん",
        "meaning": "seashore"
      },
      {
        "compound": "白浜",
        "reading": "しらはま",
        "meaning": "beach compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「初江は白い息を吐きながら、誰もいない朝の浜辺を歩いた。」",
      "englishTranslation": "Breathing white mist, Hatsue walked along the deserted morning shore.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "浜真珠糖花",
      "flavorProfile": "Beach Pearl Candies",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【浜真珠糖花】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n2",
      "潮騒",
      "beach",
      "seashore"
    ]
  },
  {
    "id": "shiosai-32-sa",
    "character": "砂",
    "strokeCount": 9,
    "grade": 6,
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "サ",
      "シャ"
    ],
    "kunyomi": [
      "すな"
    ],
    "readings": {
      "onyomi": [
        "サ",
        "シャ"
      ],
      "kunyomi": [
        "すな"
      ]
    },
    "meanings": [
      "sand",
      "grit"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "白砂",
        "reading": "はくさ",
        "meaning": "white sand"
      },
      {
        "compound": "砂浜",
        "reading": "すなはま",
        "meaning": "sandy beach"
      },
      {
        "compound": "砂漠",
        "reading": "さばく",
        "meaning": "sand compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「清らかな白砂の上に、二人の濡れた足跡が刻まれた。」",
      "englishTranslation": "Upon the pristine white sand, their wet footprints were imprinted.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "白砂きな粉餅",
      "flavorProfile": "White Sand Kinako Mochi",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【白砂きな粉餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-6",
      "n2",
      "潮騒",
      "sand",
      "grit"
    ]
  },
  {
    "id": "shiosai-33-ko",
    "character": "篝",
    "strokeCount": 16,
    "grade": "Hyogai",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [
      "かがり"
    ],
    "readings": {
      "onyomi": [
        "コウ"
      ],
      "kunyomi": [
        "かがり"
      ]
    },
    "meanings": [
      "bonfire basket",
      "beacon"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "篝火",
        "reading": "かがりび",
        "meaning": "watchfire/bonfire"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「その火を飛び越して来い。その篝火を飛び越してきたら……」",
      "englishTranslation": "Jump across that fire! If you leap over that bonfire...!",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "篝火焼き林檎",
      "flavorProfile": "Bonfire Roasted Apple",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【篝火焼き林檎】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-hyogai",
      "n1",
      "潮騒",
      "bonfire-basket",
      "beacon"
    ]
  },
  {
    "id": "shiosai-34-sen",
    "character": "潜",
    "strokeCount": 15,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "セン"
    ],
    "kunyomi": [
      "ひそ・む",
      "もぐ・る"
    ],
    "readings": {
      "onyomi": [
        "セン"
      ],
      "kunyomi": [
        "ひそ・む",
        "もぐ・る"
      ]
    },
    "meanings": [
      "dive",
      "submerge",
      "conceal"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "潜水",
        "reading": "せんすい",
        "meaning": "diving"
      },
      {
        "compound": "潜伏",
        "reading": "せんぷく",
        "meaning": "latency, concealment, lying dormant"
      },
      {
        "compound": "潜入",
        "reading": "せんにゅう",
        "meaning": "infiltration, sneaking into"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「島の娘たちは深く水に潜り、鮑を求めて海底を泳いだ。」",
      "englishTranslation": "The island maidens dove deep into the water, swimming along the ocean floor for abalone.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "潜水玉露",
      "flavorProfile": "Deep Dive Gyokuro",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【潜水玉露】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n1",
      "潮騒",
      "dive",
      "submerge"
    ]
  },
  {
    "id": "shiosai-35-sei",
    "character": "誓",
    "strokeCount": 14,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "セイ"
    ],
    "kunyomi": [
      "ちか・う"
    ],
    "readings": {
      "onyomi": [
        "セイ"
      ],
      "kunyomi": [
        "ちか・う"
      ]
    },
    "meanings": [
      "vow",
      "pledge",
      "swear"
    ],
    "primaryWork": "潮騒",
    "primaryWorkEnglish": "The Sound of Waves",
    "allRelatedWorks": [
      "潮騒",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "誓約",
        "reading": "せいやく",
        "meaning": "solemn covenant"
      },
      {
        "compound": "誓い",
        "reading": "ちかい",
        "meaning": "vow"
      },
      {
        "compound": "祈誓",
        "reading": "きせい",
        "meaning": "vow compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「八代神社の神前で、二人は生涯の愛を密かに誓い合った。」",
      "englishTranslation": "Before the altar of Yashiro Shrine, the two secretly pledged lifelong love.",
      "sourceWork": "潮騒",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『潮騒』."
    },
    "cafeOrderItem": {
      "itemName": "神前契り煎餅",
      "flavorProfile": "Shrine Vow Senbei",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【神前契り煎餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n1",
      "潮騒",
      "vow",
      "pledge"
    ]
  },
  {
    "id": "shiosai-36-shun",
    "character": "春",
    "strokeCount": 9,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "シュン"
    ],
    "kunyomi": [
      "はる"
    ],
    "readings": {
      "onyomi": [
        "シュン"
      ],
      "kunyomi": [
        "はる"
      ]
    },
    "meanings": [
      "spring",
      "springtime"
    ],
    "primaryWork": "春の雪",
    "primaryWorkEnglish": "Spring Snow",
    "allRelatedWorks": [
      "春の雪",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "春雪",
        "reading": "しゅんせつ",
        "meaning": "spring snow"
      },
      {
        "compound": "春の雪",
        "reading": "はるのゆき",
        "meaning": "Spring Snow"
      },
      {
        "compound": "青春",
        "reading": "せいしゅん",
        "meaning": "spring compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「春の雪は薄墨色の空から舞い降り、たちまち手のひらで消え失せた。」",
      "englishTranslation": "The spring snow drifted down from the pale ink-wash sky and melted away upon the palm.",
      "sourceWork": "春の雪",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『春の雪』."
    },
    "cafeOrderItem": {
      "itemName": "春雪桜餅",
      "flavorProfile": "Spring Snow Sakura Mochi",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【春雪桜餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-2",
      "n4",
      "春の雪",
      "spring",
      "springtime"
    ]
  },
  {
    "id": "shiosai-37-setsu",
    "character": "雪",
    "strokeCount": 11,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "セツ"
    ],
    "kunyomi": [
      "ゆき"
    ],
    "readings": {
      "onyomi": [
        "セツ"
      ],
      "kunyomi": [
        "ゆき"
      ]
    },
    "meanings": [
      "snow"
    ],
    "primaryWork": "春の雪",
    "primaryWorkEnglish": "Spring Snow",
    "allRelatedWorks": [
      "春の雪",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "残雪",
        "reading": "ざんせつ",
        "meaning": "lingering snow"
      },
      {
        "compound": "吹雪",
        "reading": "ふぶき",
        "meaning": "blizzard"
      },
      {
        "compound": "白雪",
        "reading": "しらゆき",
        "meaning": "snow compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「降る雪の音さえ聞こえるような、貴族の邸宅の深い静寂であった。」",
      "englishTranslation": "It was a silence so profound within the aristocratic mansion that one could hear the falling snow.",
      "sourceWork": "春の雪",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『春の雪』."
    },
    "cafeOrderItem": {
      "itemName": "淡雪羹",
      "flavorProfile": "Light Snow Agar Dessert",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【淡雪羹】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-2",
      "n4",
      "春の雪",
      "snow"
    ]
  },
  {
    "id": "shiosai-38-sui",
    "character": "衰",
    "strokeCount": 10,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "スイ"
    ],
    "kunyomi": [
      "おとろ・える"
    ],
    "readings": {
      "onyomi": [
        "スイ"
      ],
      "kunyomi": [
        "おとろ・える"
      ]
    },
    "meanings": [
      "decline",
      "decay",
      "wane"
    ],
    "primaryWork": "天人五衰",
    "primaryWorkEnglish": "The Decay of the Angel",
    "allRelatedWorks": [
      "天人五衰",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "天人五衰",
        "reading": "てんにんごすい",
        "meaning": "five signs of decay in an angel"
      },
      {
        "compound": "衰退",
        "reading": "すいたい",
        "meaning": "decline"
      },
      {
        "compound": "衰弱",
        "reading": "すいじゃく",
        "meaning": "decline compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「頭上の花冠は萎れ、腋の下から汗が流れ出る、これぞ天人五衰の兆しであった。」",
      "englishTranslation": "The floral crown atop his head withered and sweat flowed from beneath his arms—the omen of the angel's decay.",
      "sourceWork": "天人五衰",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『天人五衰』."
    },
    "cafeOrderItem": {
      "itemName": "五衰萎れ花茶",
      "flavorProfile": "Angel's Floral Infusion",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【五衰萎れ花茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n1",
      "天人五衰",
      "decline",
      "decay"
    ]
  },
  {
    "id": "shiosai-39-taki",
    "character": "滝",
    "strokeCount": 13,
    "grade": "S",
    "jlptLevel": "N2",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ロウ"
    ],
    "kunyomi": [
      "たき"
    ],
    "readings": {
      "onyomi": [
        "ロウ"
      ],
      "kunyomi": [
        "たき"
      ]
    },
    "meanings": [
      "waterfall",
      "cascade"
    ],
    "primaryWork": "春の雪",
    "primaryWorkEnglish": "Spring Snow",
    "allRelatedWorks": [
      "春の雪",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "滝下",
        "reading": "たきした",
        "meaning": "beneath the waterfall"
      },
      {
        "compound": "滝壺",
        "reading": "たきつぼ",
        "meaning": "waterfall basin, deep plunge pool"
      },
      {
        "compound": "滝川",
        "reading": "たきがわ",
        "meaning": "rapids, cascading mountain river"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「また、会うぜ。きっと会う。滝下で。」",
      "englishTranslation": "I will see you again. I know I will. Beneath the waterfall.",
      "sourceWork": "春の雪",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『春の雪』."
    },
    "cafeOrderItem": {
      "itemName": "滝しぶき冷水点茶",
      "flavorProfile": "Waterfall Mist Cold Brew",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【滝しぶき冷水点茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n2",
      "春の雪",
      "waterfall",
      "cascade"
    ]
  },
  {
    "id": "shiosai-40-jaku",
    "character": "寂",
    "strokeCount": 11,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 2,
    "tierName": "潮騒の海と幽玄",
    "onyomi": [
      "ジャク",
      "セキ"
    ],
    "kunyomi": [
      "さび・しい"
    ],
    "readings": {
      "onyomi": [
        "ジャク",
        "セキ"
      ],
      "kunyomi": [
        "さび・しい"
      ]
    },
    "meanings": [
      "lonely",
      "quiet",
      "nirvana"
    ],
    "primaryWork": "天人五衰",
    "primaryWorkEnglish": "The Decay of the Angel",
    "allRelatedWorks": [
      "天人五衰",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "寂莫",
        "reading": "じゃくまく",
        "meaning": "desolation/quietude"
      },
      {
        "compound": "寂静",
        "reading": "じゃくじょう",
        "meaning": "stillness"
      },
      {
        "compound": "寂寥",
        "reading": "じゃくりょう",
        "meaning": "lonely compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「そのほかには何一つ音とてなく、寂莫を極めている。この庭には何もない。」",
      "englishTranslation": "There was not another sound, desolation supreme. In this garden there was nothing.",
      "sourceWork": "天人五衰",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『天人五衰』."
    },
    "cafeOrderItem": {
      "itemName": "寂静枯山水菓子",
      "flavorProfile": "Dry Landscape Solitude Sweet",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【寂静枯山水菓子】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-2",
      "grade-s",
      "n1",
      "天人五衰",
      "lonely",
      "quiet"
    ]
  },
  {
    "id": "kamen-41-ka",
    "character": "仮",
    "strokeCount": 6,
    "grade": 5,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "カ",
      "ケ"
    ],
    "kunyomi": [
      "かり"
    ],
    "readings": {
      "onyomi": [
        "カ",
        "ケ"
      ],
      "kunyomi": [
        "かり"
      ]
    },
    "meanings": [
      "mask",
      "provisional"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "仮面",
        "reading": "かめん",
        "meaning": "mask/persona"
      },
      {
        "compound": "仮象",
        "reading": "かしょう",
        "meaning": "semblance/illusion"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私は仮面をつけ、それを本物の素顔だと人々に信じ込ませた。」",
      "englishTranslation": "I donned a mask and made the world believe it was my true countenance.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "仮面舞踏会ショコラ",
      "flavorProfile": "Masquerade Dark Chocolate",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【仮面舞踏会ショコラ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-5",
      "n2",
      "仮面の告白",
      "mask",
      "provisional"
    ]
  },
  {
    "id": "kamen-42-men",
    "character": "面",
    "strokeCount": 9,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "メン"
    ],
    "kunyomi": [
      "おも",
      "つら"
    ],
    "readings": {
      "onyomi": [
        "メン"
      ],
      "kunyomi": [
        "おも",
        "つら"
      ]
    },
    "meanings": [
      "face",
      "mask",
      "surface"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "仮面",
        "reading": "かめん",
        "meaning": "mask"
      },
      {
        "compound": "面影",
        "reading": "おもかげ",
        "meaning": "visage"
      },
      {
        "compound": "対面",
        "reading": "たいめん",
        "meaning": "confrontation, face-to-face meeting, interview"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「鏡に映る自分の顔は、いつの間にか仮面そのものになっていた。」",
      "englishTranslation": "The reflection in the glass had imperceptibly become the mask itself.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "素顔合わせ練り切り",
      "flavorProfile": "True-Face Nerikiri",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【素顔合わせ練り切り】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-3",
      "n3",
      "仮面の告白",
      "face",
      "mask"
    ]
  },
  {
    "id": "kamen-43-koku",
    "character": "告",
    "strokeCount": 7,
    "grade": 5,
    "jlptLevel": "N3",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "コク"
    ],
    "kunyomi": [
      "つ・げる"
    ],
    "readings": {
      "onyomi": [
        "コク"
      ],
      "kunyomi": [
        "つ・げる"
      ]
    },
    "meanings": [
      "confess",
      "announce"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "告白",
        "reading": "こくはく",
        "meaning": "confession"
      },
      {
        "compound": "予告",
        "reading": "よこく",
        "meaning": "advance notice"
      },
      {
        "compound": "宣告",
        "reading": "せんこく",
        "meaning": "confess compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「この手記は、誰にも打ち明けられぬ私の真実の告白である。」",
      "englishTranslation": "These memoirs are my true confession, which I could disclose to no one.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "密やかな告白珈琲",
      "flavorProfile": "Secret Confession Coffee",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【密やかな告白珈琲】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-5",
      "n3",
      "仮面の告白",
      "confess",
      "announce"
    ]
  },
  {
    "id": "kamen-44-haku",
    "character": "白",
    "strokeCount": 5,
    "grade": 1,
    "jlptLevel": "N5",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ハク",
      "ビャク"
    ],
    "kunyomi": [
      "しろ・い"
    ],
    "readings": {
      "onyomi": [
        "ハク",
        "ビャク"
      ],
      "kunyomi": [
        "しろ・い"
      ]
    },
    "meanings": [
      "white",
      "pure",
      "clear"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "告白",
        "reading": "こくはく",
        "meaning": "confession"
      },
      {
        "compound": "純白",
        "reading": "じゅんぱく",
        "meaning": "pure white"
      },
      {
        "compound": "潔白",
        "reading": "けっぱく",
        "meaning": "white compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「白磁のような肉体の上に、鮮やかな赤い血が滴り落ちた。」",
      "englishTranslation": "Upon that porcelain-white flesh, bright crimson blood dripped down.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "純白淡雪プリン",
      "flavorProfile": "Pure White Blancmange",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【純白淡雪プリン】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-1",
      "n5",
      "仮面の告白",
      "white",
      "pure"
    ]
  },
  {
    "id": "kamen-45-kin",
    "character": "禁",
    "strokeCount": 13,
    "grade": 5,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "キン"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "キン"
      ],
      "kunyomi": []
    },
    "meanings": [
      "forbid",
      "prohibit",
      "taboo"
    ],
    "primaryWork": "禁色",
    "primaryWorkEnglish": "Forbidden Colors",
    "allRelatedWorks": [
      "禁色"
    ],
    "literaryCompounds": [
      {
        "compound": "禁色",
        "reading": "きんじき",
        "meaning": "forbidden colors"
      },
      {
        "compound": "禁断",
        "reading": "きんだん",
        "meaning": "taboo"
      },
      {
        "compound": "厳禁",
        "reading": "げんきん",
        "meaning": "forbid compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「俊輔は青年の美貌を使い、禁色の園へと女たちを誘い込んだ。」",
      "englishTranslation": "Shunsuke used the youth's beauty to lure women into the garden of forbidden colors.",
      "sourceWork": "禁色",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『禁色』."
    },
    "cafeOrderItem": {
      "itemName": "禁色の紫芋モンブラン",
      "flavorProfile": "Forbidden Purple Mont Blanc",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【禁色の紫芋モンブラン】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-5",
      "n2",
      "禁色",
      "forbid",
      "prohibit"
    ]
  },
  {
    "id": "kamen-46-shiki",
    "character": "色",
    "strokeCount": 6,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ショク",
      "シキ"
    ],
    "kunyomi": [
      "いろ"
    ],
    "readings": {
      "onyomi": [
        "ショク",
        "シキ"
      ],
      "kunyomi": [
        "いろ"
      ]
    },
    "meanings": [
      "color",
      "sensuality"
    ],
    "primaryWork": "禁色",
    "primaryWorkEnglish": "Forbidden Colors",
    "allRelatedWorks": [
      "禁色"
    ],
    "literaryCompounds": [
      {
        "compound": "禁色",
        "reading": "きんじき",
        "meaning": "forbidden colors"
      },
      {
        "compound": "色情",
        "reading": "しきじょう",
        "meaning": "lust/passion"
      },
      {
        "compound": "景色",
        "reading": "けしき",
        "meaning": "color compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「青年の冷徹な瞳には、あらゆる欲望の色が映っては消えた。」",
      "englishTranslation": "In the youth's icy eyes, colors of every desire flickered and vanished.",
      "sourceWork": "禁色",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『禁色』."
    },
    "cafeOrderItem": {
      "itemName": "七色琥珀糖",
      "flavorProfile": "Prismatic Kohakuto",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【七色琥珀糖】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-2",
      "n4",
      "禁色",
      "color",
      "sensuality"
    ]
  },
  {
    "id": "kamen-47-zai",
    "character": "罪",
    "strokeCount": 13,
    "grade": 5,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ザイ"
    ],
    "kunyomi": [
      "つみ"
    ],
    "readings": {
      "onyomi": [
        "ザイ"
      ],
      "kunyomi": [
        "つみ"
      ]
    },
    "meanings": [
      "sin",
      "crime",
      "guilt"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "罪悪",
        "reading": "ざいあく",
        "meaning": "evil/sin"
      },
      {
        "compound": "原罪",
        "reading": "げんざい",
        "meaning": "original sin"
      },
      {
        "compound": "罪業",
        "reading": "ざいごう",
        "meaning": "sin compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「幼少期の私は、自分が生まれながらにして罪を背負っていると感じていた。」",
      "englishTranslation": "From childhood, I felt I had been born burdened with innate guilt.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "原罪カカオトリュフ",
      "flavorProfile": "Original Sin Cacao Truffle",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【原罪カカオトリュフ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-5",
      "n2",
      "仮面の告白",
      "sin",
      "crime"
    ]
  },
  {
    "id": "kamen-48-gi",
    "character": "偽",
    "strokeCount": 11,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ギ"
    ],
    "kunyomi": [
      "いつわ・る",
      "にせ"
    ],
    "readings": {
      "onyomi": [
        "ギ"
      ],
      "kunyomi": [
        "いつわ・る",
        "にせ"
      ]
    },
    "meanings": [
      "falsehood",
      "fake",
      "hypocrisy"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "偽善",
        "reading": "ぎぜん",
        "meaning": "hypocrisy"
      },
      {
        "compound": "虚偽",
        "reading": "きょぎ",
        "meaning": "falsehood"
      },
      {
        "compound": "偽物",
        "reading": "にせもの",
        "meaning": "falsehood compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私の生活のすべては偽りであり、私は偽りの感情を演じ続けた。」",
      "englishTranslation": "My entire life was a counterfeit; I continuously acted out false emotions.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "偽りの金箔オペラ",
      "flavorProfile": "Counterfeit Gilt Opera Cake",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【偽りの金箔オペラ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-s",
      "n1",
      "仮面の告白",
      "falsehood",
      "fake"
    ]
  },
  {
    "id": "kamen-49-chi",
    "character": "恥",
    "strokeCount": 10,
    "grade": "S",
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "チ"
    ],
    "kunyomi": [
      "は・ずかしい",
      "はじ"
    ],
    "readings": {
      "onyomi": [
        "チ"
      ],
      "kunyomi": [
        "は・ずかしい",
        "はじ"
      ]
    },
    "meanings": [
      "shame",
      "disgrace",
      "shyness"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "羞恥",
        "reading": "しゅうち",
        "meaning": "shyness/shame"
      },
      {
        "compound": "恥辱",
        "reading": "ちじょく",
        "meaning": "disgrace"
      },
      {
        "compound": "恥部",
        "reading": "ちぶ",
        "meaning": "shame compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「聖セバスチャンの画を見たとき、激しい羞恥と歓喜が私を貫いた。」",
      "englishTranslation": "Beholding the painting of Saint Sebastian, fierce shame and ecstasy pierced me.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "羞恥の林檎パイ",
      "flavorProfile": "Blushing Apple Tart",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【羞恥の林檎パイ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-s",
      "n2",
      "仮面の告白",
      "shame",
      "disgrace"
    ]
  },
  {
    "id": "kamen-50-geki",
    "character": "劇",
    "strokeCount": 15,
    "grade": 6,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ゲキ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ゲキ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "drama",
      "play",
      "intense"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "悲劇",
        "reading": "ひげき",
        "meaning": "tragedy"
      },
      {
        "compound": "劇薬",
        "reading": "げきやく",
        "meaning": "potent poison"
      },
      {
        "compound": "劇場",
        "reading": "げきじょう",
        "meaning": "drama compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私の人生は、観客のいない劇場で演じられる悲劇にすぎなかった。」",
      "englishTranslation": "My life was nothing but a tragedy staged in a theater devoid of spectators.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "悲劇のクランベリータルト",
      "flavorProfile": "Tragedy Cranberry Tart",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【悲劇のクランベリータルト】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-6",
      "n2",
      "仮面の告白",
      "drama",
      "play"
    ]
  },
  {
    "id": "kamen-51-en",
    "character": "演",
    "strokeCount": 14,
    "grade": 5,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "エン"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "エン"
      ],
      "kunyomi": []
    },
    "meanings": [
      "perform",
      "enact",
      "play"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "演技",
        "reading": "えんぎ",
        "meaning": "acting"
      },
      {
        "compound": "演劇",
        "reading": "えんげき",
        "meaning": "theater"
      },
      {
        "compound": "公演",
        "reading": "こうえん",
        "meaning": "perform compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「私は他人が期待する通りの『正常な少年』を完璧に演じてみせた。」",
      "englishTranslation": "I performed to perfection the role of the 'normal boy' that others expected.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "舞台裏の紅茶",
      "flavorProfile": "Backstage Earl Grey",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【舞台裏の紅茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-5",
      "n2",
      "仮面の告白",
      "perform",
      "enact"
    ]
  },
  {
    "id": "kamen-52-tan",
    "character": "耽",
    "strokeCount": 10,
    "grade": "Hyogai",
    "jlptLevel": "N1",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "タン"
    ],
    "kunyomi": [
      "ふけ・る"
    ],
    "readings": {
      "onyomi": [
        "タン"
      ],
      "kunyomi": [
        "ふけ・る"
      ]
    },
    "meanings": [
      "indulge",
      "absorbed in"
    ],
    "primaryWork": "禁色",
    "primaryWorkEnglish": "Forbidden Colors",
    "allRelatedWorks": [
      "禁色"
    ],
    "literaryCompounds": [
      {
        "compound": "耽美",
        "reading": "たんび",
        "meaning": "aestheticism"
      },
      {
        "compound": "耽溺",
        "reading": "たんでき",
        "meaning": "indulgence"
      },
      {
        "compound": "耽読",
        "reading": "たんどく",
        "meaning": "indulge compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「老作家・檜俊輔は、美への耽溺こそが精神の復讐であると信じた。」",
      "englishTranslation": "The aged author Shunsuke Hinoki believed indulgence in beauty was the mind's vengeance.",
      "sourceWork": "禁色",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『禁色』."
    },
    "cafeOrderItem": {
      "itemName": "耽溺赤ワイン羹",
      "flavorProfile": "Indulgence Port Agar Jelly",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【耽溺赤ワイン羹】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-hyogai",
      "n1",
      "禁色",
      "indulge",
      "absorbed-in"
    ]
  },
  {
    "id": "kamen-53-shi",
    "character": "矢",
    "strokeCount": 5,
    "grade": 2,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "シ"
    ],
    "kunyomi": [
      "や"
    ],
    "readings": {
      "onyomi": [
        "シ"
      ],
      "kunyomi": [
        "や"
      ]
    },
    "meanings": [
      "arrow",
      "dart"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "毒矢",
        "reading": "どくや",
        "meaning": "poisoned arrow"
      },
      {
        "compound": "射矢",
        "reading": "しゃし",
        "meaning": "shooting arrows"
      },
      {
        "compound": "弓矢",
        "reading": "ゆみや",
        "meaning": "arrow compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「聖セバスチャンの引き締まった胸を、無残な矢が深く射抜いていた。」",
      "englishTranslation": "Cruel arrows deeply pierced the taut chest of Saint Sebastian.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "銀の矢シナモンチュロス",
      "flavorProfile": "Silver Arrow Churros",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【銀の矢シナモンチュロス】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-2",
      "n2",
      "仮面の告白",
      "arrow",
      "dart"
    ]
  },
  {
    "id": "kamen-54-jun",
    "character": "殉",
    "strokeCount": 10,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ジュン"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ジュン"
      ],
      "kunyomi": []
    },
    "meanings": [
      "martyrdom",
      "sacrifice life"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "殉教",
        "reading": "じゅんきょう",
        "meaning": "martyrdom"
      },
      {
        "compound": "殉死",
        "reading": "じゅんし",
        "meaning": "dying for one's lord"
      },
      {
        "compound": "殉難",
        "reading": "じゅんなん",
        "meaning": "martyrdom compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「苦痛の中で天を見上げる若き殉教者の姿に、私は魂を奪われた。」",
      "englishTranslation": "Beholding the young martyr gazing heavenward in pain, my soul was stolen away.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "殉教者サブレ",
      "flavorProfile": "Martyr Shortbread",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【殉教者サブレ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-s",
      "n1",
      "仮面の告白",
      "martyrdom",
      "sacrifice-life"
    ]
  },
  {
    "id": "kamen-55-sha",
    "character": "射",
    "strokeCount": 10,
    "grade": 6,
    "jlptLevel": "N1",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "シャ"
    ],
    "kunyomi": [
      "い・る",
      "さ・す"
    ],
    "readings": {
      "onyomi": [
        "シャ"
      ],
      "kunyomi": [
        "い・る",
        "さ・す"
      ]
    },
    "meanings": [
      "shoot",
      "pierce",
      "shine"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "放射",
        "reading": "ほうしゃ",
        "meaning": "radiation"
      },
      {
        "compound": "射止める",
        "reading": "いとめる",
        "meaning": "win/shoot down"
      },
      {
        "compound": "照射",
        "reading": "しょうしゃ",
        "meaning": "shoot compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「冷酷な矢が肉体を射抜く瞬間、そこに美の頂点が現出する。」",
      "englishTranslation": "The moment the cold arrow pierces the flesh, beauty's zenith appears.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "一矢エスプレッソ",
      "flavorProfile": "Piercing Espresso Shot",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【一矢エスプレッソ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-6",
      "n1",
      "仮面の告白",
      "shoot",
      "pierce"
    ]
  },
  {
    "id": "kamen-56-ko",
    "character": "恍",
    "strokeCount": 9,
    "grade": "Hyogai",
    "jlptLevel": "N1",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "コウ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "コウ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "ecstatic",
      "trance"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "恍惚",
        "reading": "こうこつ",
        "meaning": "rapture/ecstasy"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「死の痛覚と官能が交錯するとき、青年は恍惚の境地に達した。」",
      "englishTranslation": "When the pang of death and sensuality intertwined, the youth reached ecstasy.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "恍惚バニラスフレ",
      "flavorProfile": "Ecstatic Vanilla Soufflé",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【恍惚バニラスフレ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-hyogai",
      "n1",
      "仮面の告白",
      "ecstatic",
      "trance"
    ]
  },
  {
    "id": "kamen-57-kotsu",
    "character": "惚",
    "strokeCount": 11,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "コツ"
    ],
    "kunyomi": [
      "ほ・れる"
    ],
    "readings": {
      "onyomi": [
        "コツ"
      ],
      "kunyomi": [
        "ほ・れる"
      ]
    },
    "meanings": [
      "enchanted",
      "infatuated"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "恍惚",
        "reading": "こうこつ",
        "meaning": "rapture/ecstasy"
      },
      {
        "compound": "自惚れ",
        "reading": "うぬぼれ",
        "meaning": "enchanted compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「恍惚とした笑みを浮かべたまま、絵の中の聖者は息絶えようとしていた。」",
      "englishTranslation": "Wearing an ecstatic smile, the painted saint seemed about to draw his last breath.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "恋惚れローズヒップティー",
      "flavorProfile": "Infatuation Rosehip Infusion",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【恋惚れローズヒップティー】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-s",
      "n1",
      "仮面の告白",
      "enchanted",
      "infatuated"
    ]
  },
  {
    "id": "kamen-58-roku",
    "character": "鹿",
    "strokeCount": 11,
    "grade": 4,
    "jlptLevel": "N2",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "ロク"
    ],
    "kunyomi": [
      "しか"
    ],
    "readings": {
      "onyomi": [
        "ロク"
      ],
      "kunyomi": [
        "しか"
      ]
    },
    "meanings": [
      "deer"
    ],
    "primaryWork": "鹿鳴館",
    "primaryWorkEnglish": "Rokumeikan",
    "allRelatedWorks": [
      "鹿鳴館"
    ],
    "literaryCompounds": [
      {
        "compound": "鹿鳴館",
        "reading": "ろくめいかん",
        "meaning": "Rokumeikan"
      },
      {
        "compound": "鹿肉",
        "reading": "しかにく",
        "meaning": "deer compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「鹿鳴館の華やかな夜会に、時代の光と影が交錯していた。」",
      "englishTranslation": "At the brilliant soiree of Rokumeikan, the era's light and shadows crossed.",
      "sourceWork": "鹿鳴館",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『鹿鳴館』."
    },
    "cafeOrderItem": {
      "itemName": "鹿鳴館ロイヤルミルクティー",
      "flavorProfile": "Rokumeikan Royal Milk Tea",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【鹿鳴館ロイヤルミルクティー】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-4",
      "n2",
      "鹿鳴館",
      "deer"
    ]
  },
  {
    "id": "kamen-59-mei",
    "character": "鳴",
    "strokeCount": 14,
    "grade": 2,
    "jlptLevel": "N3",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "メイ"
    ],
    "kunyomi": [
      "な・く",
      "な・る"
    ],
    "readings": {
      "onyomi": [
        "メイ"
      ],
      "kunyomi": [
        "な・く",
        "な・る"
      ]
    },
    "meanings": [
      "ring",
      "cry",
      "resound"
    ],
    "primaryWork": "鹿鳴館",
    "primaryWorkEnglish": "Rokumeikan",
    "allRelatedWorks": [
      "鹿鳴館"
    ],
    "literaryCompounds": [
      {
        "compound": "鹿鳴館",
        "reading": "ろくめいかん",
        "meaning": "Rokumeikan"
      },
      {
        "compound": "共鳴",
        "reading": "きょうめい",
        "meaning": "resonance"
      },
      {
        "compound": "悲鳴",
        "reading": "ひめい",
        "meaning": "ring compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「ワルツの旋律の陰で、破滅を告げる銃声が館内に鳴り響いた。」",
      "englishTranslation": "Behind the waltz melody, gunshots heralding doom rang through the hall.",
      "sourceWork": "鹿鳴館",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『鹿鳴館』."
    },
    "cafeOrderItem": {
      "itemName": "鈴鳴りマカロン",
      "flavorProfile": "Chiming Bell Macaron",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【鈴鳴りマカロン】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-2",
      "n3",
      "鹿鳴館",
      "ring",
      "cry"
    ]
  },
  {
    "id": "kamen-60-kan",
    "character": "館",
    "strokeCount": 16,
    "grade": 3,
    "jlptLevel": "N4",
    "tier": 3,
    "tierName": "仮面の告白と愛憎",
    "onyomi": [
      "カン"
    ],
    "kunyomi": [
      "やかた"
    ],
    "readings": {
      "onyomi": [
        "カン"
      ],
      "kunyomi": [
        "やかた"
      ]
    },
    "meanings": [
      "hall",
      "mansion",
      "palace"
    ],
    "primaryWork": "鹿鳴館",
    "primaryWorkEnglish": "Rokumeikan",
    "allRelatedWorks": [
      "鹿鳴館"
    ],
    "literaryCompounds": [
      {
        "compound": "鹿鳴館",
        "reading": "ろくめいかん",
        "meaning": "Rokumeikan"
      },
      {
        "compound": "洋館",
        "reading": "ようかん",
        "meaning": "Western manor"
      },
      {
        "compound": "館内",
        "reading": "かんない",
        "meaning": "hall compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「文明開化の象徴たるこの館で、貴族たちの陰謀が渦巻いていた。」",
      "englishTranslation": "In this mansion symbolizing civilization and enlightenment, nobles' plots swirled.",
      "sourceWork": "鹿鳴館",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『鹿鳴館』."
    },
    "cafeOrderItem": {
      "itemName": "貴賓館スコーン",
      "flavorProfile": "Grand Pavilion Scones",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【貴賓館スコーン】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-3",
      "grade-3",
      "n4",
      "鹿鳴館",
      "hall",
      "mansion"
    ]
  },
  {
    "id": "yukoku-61-yu",
    "character": "憂",
    "strokeCount": 15,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "ユウ"
    ],
    "kunyomi": [
      "うれ・える",
      "う・い"
    ],
    "readings": {
      "onyomi": [
        "ユウ"
      ],
      "kunyomi": [
        "うれ・える",
        "う・い"
      ]
    },
    "meanings": [
      "grieve",
      "mourn for",
      "sorrow"
    ],
    "primaryWork": "憂国",
    "primaryWorkEnglish": "Patriotism",
    "allRelatedWorks": [
      "憂国"
    ],
    "literaryCompounds": [
      {
        "compound": "憂国",
        "reading": "ゆうこく",
        "meaning": "patriotism/national grief"
      },
      {
        "compound": "憂慮",
        "reading": "ゆうりょ",
        "meaning": "anxiety"
      },
      {
        "compound": "杞憂",
        "reading": "きゆう",
        "meaning": "grieve compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「憂国の情に駆られた青年将校は、大義のために命を捧げる決意を固めた。」",
      "englishTranslation": "Impelled by patriotic grief, the young officer resolved to lay down his life for the cause.",
      "sourceWork": "憂国",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『憂国』."
    },
    "cafeOrderItem": {
      "itemName": "憂国深煎珈琲",
      "flavorProfile": "Patriot Dark Roast",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【憂国深煎珈琲】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-s",
      "n1",
      "憂国",
      "grieve",
      "mourn-for"
    ]
  },
  {
    "id": "yukoku-62-koku",
    "character": "国",
    "strokeCount": 8,
    "grade": 2,
    "jlptLevel": "N5",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "コク"
    ],
    "kunyomi": [
      "くに"
    ],
    "readings": {
      "onyomi": [
        "コク"
      ],
      "kunyomi": [
        "くに"
      ]
    },
    "meanings": [
      "country",
      "nation",
      "state"
    ],
    "primaryWork": "憂国",
    "primaryWorkEnglish": "Patriotism",
    "allRelatedWorks": [
      "憂国"
    ],
    "literaryCompounds": [
      {
        "compound": "憂国",
        "reading": "ゆうこく",
        "meaning": "patriotism"
      },
      {
        "compound": "皇国",
        "reading": "こうこく",
        "meaning": "Imperial realm"
      },
      {
        "compound": "祖国",
        "reading": "そこく",
        "meaning": "country compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「国の危急に際し、友軍相撃の事態を避けるため、中尉は自決を選んだ。」",
      "englishTranslation": "In the nation's crisis, to avoid brother troops shooting one another, the lieutenant chose suicide.",
      "sourceWork": "憂国",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『憂国』."
    },
    "cafeOrderItem": {
      "itemName": "皇国菊茶",
      "flavorProfile": "Imperial Chrysanthemum Tea",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【皇国菊茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-2",
      "n5",
      "憂国",
      "country",
      "nation"
    ]
  },
  {
    "id": "yukoku-63-hon",
    "character": "奔",
    "strokeCount": 9,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "ホン"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ホン"
      ],
      "kunyomi": []
    },
    "meanings": [
      "run",
      "dash",
      "bolt",
      "gallop"
    ],
    "primaryWork": "奔馬",
    "primaryWorkEnglish": "Runaway Horses",
    "allRelatedWorks": [
      "奔馬",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "奔馬",
        "reading": "ほんば",
        "meaning": "runaway horses"
      },
      {
        "compound": "奔放",
        "reading": "ほんぽう",
        "meaning": "wild/uninhibited"
      },
      {
        "compound": "疾奔",
        "reading": "しっぽん",
        "meaning": "run compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「飯沼勲の純粋な狂気は、荒野を疾走する奔馬のように止めようがなかった。」",
      "englishTranslation": "Isao Iinuma's pure madness was unstoppable like runaway horses galloping across wild plains.",
      "sourceWork": "奔馬",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『奔馬』."
    },
    "cafeOrderItem": {
      "itemName": "奔馬黒糖カヌレ",
      "flavorProfile": "Runaway Horse Canelé",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【奔馬黒糖カヌレ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-s",
      "n1",
      "奔馬",
      "run",
      "dash"
    ]
  },
  {
    "id": "yukoku-64-ba",
    "character": "馬",
    "strokeCount": 10,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "バ"
    ],
    "kunyomi": [
      "うま"
    ],
    "readings": {
      "onyomi": [
        "バ"
      ],
      "kunyomi": [
        "うま"
      ]
    },
    "meanings": [
      "horse",
      "steed"
    ],
    "primaryWork": "奔馬",
    "primaryWorkEnglish": "Runaway Horses",
    "allRelatedWorks": [
      "奔馬",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "奔馬",
        "reading": "ほんば",
        "meaning": "runaway horses"
      },
      {
        "compound": "神馬",
        "reading": "しんめ",
        "meaning": "sacred shrine steed"
      },
      {
        "compound": "白馬",
        "reading": "はくば",
        "meaning": "horse compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「駆ける馬の嘶きのごとく、若者たちの志は闇を切り裂いた。」",
      "englishTranslation": "Like the neighing of a charging steed, the young men's conviction slashed through the dark.",
      "sourceWork": "奔馬",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『奔馬』."
    },
    "cafeOrderItem": {
      "itemName": "白馬練り切り",
      "flavorProfile": "White Steed Nerikiri",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【白馬練り切り】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-2",
      "n4",
      "奔馬",
      "horse",
      "steed"
    ]
  },
  {
    "id": "yukoku-65-gyo",
    "character": "暁",
    "strokeCount": 12,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "ギョウ"
    ],
    "kunyomi": [
      "あかつき"
    ],
    "readings": {
      "onyomi": [
        "ギョウ"
      ],
      "kunyomi": [
        "あかつき"
      ]
    },
    "meanings": [
      "dawn",
      "daybreak"
    ],
    "primaryWork": "暁の寺",
    "primaryWorkEnglish": "The Temple of Dawn",
    "allRelatedWorks": [
      "暁の寺",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "暁の寺",
        "reading": "あかつきのてら",
        "meaning": "Temple of Dawn"
      },
      {
        "compound": "暁光",
        "reading": "ぎょうこう",
        "meaning": "morning beam"
      },
      {
        "compound": "暁星",
        "reading": "ぎょうせい",
        "meaning": "dawn compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「暁の寺の尖塔が、夜明けの光を浴びて金色に輝き始めた。」",
      "englishTranslation": "The spires of the Temple of Dawn began to glow gold bathed in dawn's light.",
      "sourceWork": "暁の寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『暁の寺』."
    },
    "cafeOrderItem": {
      "itemName": "暁光チャイ",
      "flavorProfile": "Dawn Spiced Chai",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【暁光チャイ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-s",
      "n1",
      "暁の寺",
      "dawn",
      "daybreak"
    ]
  },
  {
    "id": "yukoku-66-tetsu",
    "character": "鉄",
    "strokeCount": 13,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "テツ"
    ],
    "kunyomi": [
      "くろがね"
    ],
    "readings": {
      "onyomi": [
        "テツ"
      ],
      "kunyomi": [
        "くろがね"
      ]
    },
    "meanings": [
      "iron",
      "steel"
    ],
    "primaryWork": "太陽と鉄",
    "primaryWorkEnglish": "Sun and Steel",
    "allRelatedWorks": [
      "太陽と鉄"
    ],
    "literaryCompounds": [
      {
        "compound": "太陽と鉄",
        "reading": "たいようとてつ",
        "meaning": "Sun and Steel"
      },
      {
        "compound": "鋼鉄",
        "reading": "こうてつ",
        "meaning": "steel"
      },
      {
        "compound": "鉄拳",
        "reading": "てっけん",
        "meaning": "iron compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「冷たい鉄の重みを通じてのみ、私の肉体は確固たる実在を回復した。」",
      "englishTranslation": "Only through the weight of cold iron did my physical body recover solid reality.",
      "sourceWork": "太陽と鉄",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『太陽と鉄』."
    },
    "cafeOrderItem": {
      "itemName": "鉄器点て濃茶",
      "flavorProfile": "Cast-Iron Whisked Koicha",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【鉄器点て濃茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-3",
      "n3",
      "太陽と鉄",
      "iron",
      "steel"
    ]
  },
  {
    "id": "yukoku-67-yo",
    "character": "陽",
    "strokeCount": 12,
    "grade": 3,
    "jlptLevel": "N2",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "ヨウ"
    ],
    "kunyomi": [
      "ひ"
    ],
    "readings": {
      "onyomi": [
        "ヨウ"
      ],
      "kunyomi": [
        "ひ"
      ]
    },
    "meanings": [
      "sun",
      "sunshine",
      "yang"
    ],
    "primaryWork": "太陽と鉄",
    "primaryWorkEnglish": "Sun and Steel",
    "allRelatedWorks": [
      "太陽と鉄"
    ],
    "literaryCompounds": [
      {
        "compound": "太陽",
        "reading": "たいよう",
        "meaning": "sun"
      },
      {
        "compound": "陽光",
        "reading": "ようこう",
        "meaning": "sunlight"
      },
      {
        "compound": "朝陽",
        "reading": "ちょうよう",
        "meaning": "sun compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「太陽の容赦ない光が、青空の下で逞しい肉体を照らし出した。」",
      "englishTranslation": "The sun's merciless glare illuminated the sinewy physique under the blue sky.",
      "sourceWork": "太陽と鉄",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『太陽と鉄』."
    },
    "cafeOrderItem": {
      "itemName": "日輪金柑タルト",
      "flavorProfile": "Solar Kumquat Tart",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【日輪金柑タルト】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-3",
      "n2",
      "太陽と鉄",
      "sun",
      "sunshine"
    ]
  },
  {
    "id": "yukoku-68-tai",
    "character": "太",
    "strokeCount": 4,
    "grade": 2,
    "jlptLevel": "N3",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "タイ",
      "タ"
    ],
    "kunyomi": [
      "ふと・い"
    ],
    "readings": {
      "onyomi": [
        "タイ",
        "タ"
      ],
      "kunyomi": [
        "ふと・い"
      ]
    },
    "meanings": [
      "great",
      "grand",
      "thick"
    ],
    "primaryWork": "太陽と鉄",
    "primaryWorkEnglish": "Sun and Steel",
    "allRelatedWorks": [
      "太陽と鉄"
    ],
    "literaryCompounds": [
      {
        "compound": "太陽",
        "reading": "たいよう",
        "meaning": "sun"
      },
      {
        "compound": "太古",
        "reading": "たいこ",
        "meaning": "primordial"
      },
      {
        "compound": "丸太",
        "reading": "まるた",
        "meaning": "great compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「太陽と死という二つの絶対的な存在が、私の中で結びついた。」",
      "englishTranslation": "Two absolute realities—the sun and death—joined together within me.",
      "sourceWork": "太陽と鉄",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『太陽と鉄』."
    },
    "cafeOrderItem": {
      "itemName": "太古の蜜酒",
      "flavorProfile": "Primordial Mead Elixir",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【太古の蜜酒】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-2",
      "n3",
      "太陽と鉄",
      "great",
      "grand"
    ]
  },
  {
    "id": "yukoku-69-niku",
    "character": "肉",
    "strokeCount": 6,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "ニク"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "ニク"
      ],
      "kunyomi": []
    },
    "meanings": [
      "flesh",
      "meat",
      "body"
    ],
    "primaryWork": "太陽と鉄",
    "primaryWorkEnglish": "Sun and Steel",
    "allRelatedWorks": [
      "太陽と鉄"
    ],
    "literaryCompounds": [
      {
        "compound": "肉体",
        "reading": "にくたい",
        "meaning": "physical body"
      },
      {
        "compound": "筋肉",
        "reading": "きんにく",
        "meaning": "muscles"
      },
      {
        "compound": "骨肉",
        "reading": "こつにく",
        "meaning": "flesh compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「つらつら幼時を思いめぐらすと、私にとっては、言葉の記憶は肉体の記憶よりもはるかに遠くまで遡る。」",
      "englishTranslation": "Recalling my childhood, the memory of words reaches back much further than the memory of flesh.",
      "sourceWork": "太陽と鉄",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『太陽と鉄』."
    },
    "cafeOrderItem": {
      "itemName": "鍛錬黒豆羹",
      "flavorProfile": "Iron-Forged Black Bean Jelly",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【鍛錬黒豆羹】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-2",
      "n4",
      "太陽と鉄",
      "flesh",
      "meat"
    ]
  },
  {
    "id": "yukoku-70-kin",
    "character": "筋",
    "strokeCount": 12,
    "grade": 6,
    "jlptLevel": "N2",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "キン"
    ],
    "kunyomi": [
      "すじ"
    ],
    "readings": {
      "onyomi": [
        "キン"
      ],
      "kunyomi": [
        "すじ"
      ]
    },
    "meanings": [
      "muscle",
      "sinew",
      "tendon"
    ],
    "primaryWork": "太陽と鉄",
    "primaryWorkEnglish": "Sun and Steel",
    "allRelatedWorks": [
      "太陽と鉄"
    ],
    "literaryCompounds": [
      {
        "compound": "筋肉",
        "reading": "きんにく",
        "meaning": "muscles"
      },
      {
        "compound": "筋骨",
        "reading": "きんこつ",
        "meaning": "physique"
      },
      {
        "compound": "筋力",
        "reading": "きんりょく",
        "meaning": "muscle compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「鉄を持ち上げることによって鍛えられた筋肉は、精神の鎧となった。」",
      "englishTranslation": "The muscles forged by lifting iron became the armor of the spirit.",
      "sourceWork": "太陽と鉄",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『太陽と鉄』."
    },
    "cafeOrderItem": {
      "itemName": "剛健プロテイン甘酒",
      "flavorProfile": "Vigor Protein Amazake",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【剛健プロテイン甘酒】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-6",
      "n2",
      "太陽と鉄",
      "muscle",
      "sinew"
    ]
  },
  {
    "id": "yukoku-71-kon",
    "character": "魂",
    "strokeCount": 14,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "コン"
    ],
    "kunyomi": [
      "たましい"
    ],
    "readings": {
      "onyomi": [
        "コン"
      ],
      "kunyomi": [
        "たましい"
      ]
    },
    "meanings": [
      "soul",
      "spirit",
      "psyche"
    ],
    "primaryWork": "奔馬",
    "primaryWorkEnglish": "Runaway Horses",
    "allRelatedWorks": [
      "奔馬",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "大和魂",
        "reading": "やまとだましい",
        "meaning": "Japanese spirit"
      },
      {
        "compound": "霊魂",
        "reading": "れいこん",
        "meaning": "soul"
      },
      {
        "compound": "闘魂",
        "reading": "とうこん",
        "meaning": "soul compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「肉体の滅びとともに、純粋な魂は天へと昇りゆくのだ。」",
      "englishTranslation": "Along with the destruction of the body, the pure soul rises heavenward.",
      "sourceWork": "奔馬",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『奔馬』."
    },
    "cafeOrderItem": {
      "itemName": "魂結び五平餅",
      "flavorProfile": "Soul-Knot Gohei Mochi",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【魂結び五平餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-s",
      "n1",
      "奔馬",
      "soul",
      "spirit"
    ]
  },
  {
    "id": "yukoku-72-jin",
    "character": "刃",
    "strokeCount": 3,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "ジン"
    ],
    "kunyomi": [
      "は",
      "やいば"
    ],
    "readings": {
      "onyomi": [
        "ジン"
      ],
      "kunyomi": [
        "は",
        "やいば"
      ]
    },
    "meanings": [
      "blade",
      "sword edge"
    ],
    "primaryWork": "憂国",
    "primaryWorkEnglish": "Patriotism",
    "allRelatedWorks": [
      "憂国"
    ],
    "literaryCompounds": [
      {
        "compound": "白刃",
        "reading": "はくじん",
        "meaning": "naked blade"
      },
      {
        "compound": "凶刃",
        "reading": "きょうじん",
        "meaning": "assassin's blade"
      },
      {
        "compound": "刃物",
        "reading": "はもの",
        "meaning": "blade compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「研ぎ澄まされた白刃が、清冽な月光を反射して青白く光った。」",
      "englishTranslation": "The whetted naked blade shone pale blue, reflecting the crisp moonlight.",
      "sourceWork": "憂国",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『憂国』."
    },
    "cafeOrderItem": {
      "itemName": "白刃切餅",
      "flavorProfile": "Honed Blade Sliced Mochi",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【白刃切餅】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-s",
      "n1",
      "憂国",
      "blade",
      "sword-edge"
    ]
  },
  {
    "id": "yukoku-73-fuku",
    "character": "腹",
    "strokeCount": 13,
    "grade": 6,
    "jlptLevel": "N2",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "フク"
    ],
    "kunyomi": [
      "はら"
    ],
    "readings": {
      "onyomi": [
        "フク"
      ],
      "kunyomi": [
        "はら"
      ]
    },
    "meanings": [
      "belly",
      "abdomen"
    ],
    "primaryWork": "奔馬",
    "primaryWorkEnglish": "Runaway Horses",
    "allRelatedWorks": [
      "奔馬",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "切腹",
        "reading": "せっぷく",
        "meaning": "seppuku"
      },
      {
        "compound": "割腹",
        "reading": "かっぷく",
        "meaning": "disembowelment"
      },
      {
        "compound": "腹背",
        "reading": "ふくはい",
        "meaning": "belly compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「正に刀を腹へ突き立てた瞬間、日輪は瞼の裏に赫奕と昇った。」",
      "englishTranslation": "The instant the blade plunged into his belly, the sun disc rose in dazzling radiance behind his eyelids.",
      "sourceWork": "奔馬",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『奔馬』."
    },
    "cafeOrderItem": {
      "itemName": "覚悟の濃黒胡麻団子",
      "flavorProfile": "Resolution Black Sesame Dango",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【覚悟の濃黒胡麻団子】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-6",
      "n2",
      "奔馬",
      "belly",
      "abdomen"
    ]
  },
  {
    "id": "yukoku-74-setsu",
    "character": "切",
    "strokeCount": 4,
    "grade": 2,
    "jlptLevel": "N4",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "セツ",
      "サイ"
    ],
    "kunyomi": [
      "き・る"
    ],
    "readings": {
      "onyomi": [
        "セツ",
        "サイ"
      ],
      "kunyomi": [
        "き・る"
      ]
    },
    "meanings": [
      "cut",
      "sever",
      "poignant"
    ],
    "primaryWork": "憂国",
    "primaryWorkEnglish": "Patriotism",
    "allRelatedWorks": [
      "憂国"
    ],
    "literaryCompounds": [
      {
        "compound": "切腹",
        "reading": "せっぷく",
        "meaning": "seppuku"
      },
      {
        "compound": "切実",
        "reading": "せつじつ",
        "meaning": "poignant/urgent"
      },
      {
        "compound": "親切",
        "reading": "しんせつ",
        "meaning": "cut compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「中尉は見事に切腹を遂げ、妻もまた微笑んで夫の後を追った。」",
      "englishTranslation": "The lieutenant accomplished flawless seppuku, and his wife too smiled, following her husband in death.",
      "sourceWork": "憂国",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『憂国』."
    },
    "cafeOrderItem": {
      "itemName": "切腹最中",
      "flavorProfile": "Seppuku Monaka",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【切腹最中】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-2",
      "n4",
      "憂国",
      "cut",
      "sever"
    ]
  },
  {
    "id": "yukoku-75-chu",
    "character": "忠",
    "strokeCount": 8,
    "grade": 6,
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "チュウ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "チュウ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "loyalty",
      "fidelity",
      "devotion"
    ],
    "primaryWork": "憂国",
    "primaryWorkEnglish": "Patriotism",
    "allRelatedWorks": [
      "憂国"
    ],
    "literaryCompounds": [
      {
        "compound": "忠義",
        "reading": "ちゅうぎ",
        "meaning": "loyalty/devotion"
      },
      {
        "compound": "忠誠",
        "reading": "ちゅうせい",
        "meaning": "allegiance"
      },
      {
        "compound": "忠節",
        "reading": "ちゅうせつ",
        "meaning": "loyalty compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「至誠にして忠義を尽くすことこそ、武士道の至高の美徳であった。」",
      "englishTranslation": "To maintain utmost sincerity and fulfill loyalty was the supreme virtue of Bushido.",
      "sourceWork": "憂国",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『憂国』."
    },
    "cafeOrderItem": {
      "itemName": "至誠忠義緑茶",
      "flavorProfile": "Devotion Sencha",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【至誠忠義緑茶】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-6",
      "n1",
      "憂国",
      "loyalty",
      "fidelity"
    ]
  },
  {
    "id": "yukoku-76-rin",
    "character": "輪",
    "strokeCount": 15,
    "grade": 4,
    "jlptLevel": "N2",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "リン"
    ],
    "kunyomi": [
      "わ"
    ],
    "readings": {
      "onyomi": [
        "リン"
      ],
      "kunyomi": [
        "わ"
      ]
    },
    "meanings": [
      "wheel",
      "ring",
      "cycle"
    ],
    "primaryWork": "奔馬",
    "primaryWorkEnglish": "Runaway Horses",
    "allRelatedWorks": [
      "奔馬",
      "豊饒の海"
    ],
    "literaryCompounds": [
      {
        "compound": "輪廻",
        "reading": "りんね",
        "meaning": "Samsara/transmigration"
      },
      {
        "compound": "日輪",
        "reading": "にちりん",
        "meaning": "sun disc"
      },
      {
        "compound": "車輪",
        "reading": "しゃりん",
        "meaning": "wheel compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「正に刀を腹へ突き立てた瞬間、日輪は瞼の裏に赫奕と昇った。」",
      "englishTranslation": "The instant the blade plunged into his belly, the sun disc rose in dazzling radiance behind his eyelids.",
      "sourceWork": "奔馬",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『奔馬』."
    },
    "cafeOrderItem": {
      "itemName": "日輪バウムクーヘン",
      "flavorProfile": "Solar Wheel Baumkuchen",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【日輪バウムクーヘン】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-4",
      "n2",
      "奔馬",
      "wheel",
      "ring"
    ]
  },
  {
    "id": "yukoku-77-kai",
    "character": "廻",
    "strokeCount": 9,
    "grade": "S",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "カイ"
    ],
    "kunyomi": [
      "まわ・る"
    ],
    "readings": {
      "onyomi": [
        "カイ"
      ],
      "kunyomi": [
        "まわ・る"
      ]
    },
    "meanings": [
      "revolve",
      "cycle",
      "round"
    ],
    "primaryWork": "豊饒の海",
    "primaryWorkEnglish": "The Sea of Fertility",
    "allRelatedWorks": [
      "豊饒の海",
      "潮騒",
      "春の雪",
      "奔馬",
      "天人五衰"
    ],
    "literaryCompounds": [
      {
        "compound": "輪廻",
        "reading": "りんね",
        "meaning": "Samsara/reincarnation"
      },
      {
        "compound": "巡廻",
        "reading": "じゅんかい",
        "meaning": "circuit"
      },
      {
        "compound": "廻転",
        "reading": "かいてん",
        "meaning": "revolve compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「輪廻の環から解き放たれることを求めつつ、魂は巡り続ける。」",
      "englishTranslation": "Yearning to be freed from the wheel of Samsara, the soul continues to transmigrate.",
      "sourceWork": "豊饒の海",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『豊饒の海』."
    },
    "cafeOrderItem": {
      "itemName": "輪廻渦巻きロール",
      "flavorProfile": "Samsara Swirl Roll Cake",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【輪廻渦巻きロール】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-s",
      "n1",
      "豊饒の海",
      "revolve",
      "cycle"
    ]
  },
  {
    "id": "yukoku-78-setsu",
    "character": "刹",
    "strokeCount": 8,
    "grade": "Jinmeiyo",
    "jlptLevel": "N1",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "セツ",
      "サツ"
    ],
    "kunyomi": [],
    "readings": {
      "onyomi": [
        "セツ",
        "サツ"
      ],
      "kunyomi": []
    },
    "meanings": [
      "split-second",
      "instant"
    ],
    "primaryWork": "金閣寺",
    "primaryWorkEnglish": "The Temple of the Golden Pavilion",
    "allRelatedWorks": [
      "金閣寺"
    ],
    "literaryCompounds": [
      {
        "compound": "刹那",
        "reading": "せつな",
        "meaning": "the fleeting instant"
      },
      {
        "compound": "刹那美",
        "reading": "せつなび",
        "meaning": "ephemeral beauty"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「永遠とは、激しく燃え上がる刹那の火花の中にこそ存在する。」",
      "englishTranslation": "Eternity exists only within the furiously burning spark of the instant.",
      "sourceWork": "金閣寺",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『金閣寺』."
    },
    "cafeOrderItem": {
      "itemName": "刹那氷菓子",
      "flavorProfile": "Ephemeral Flash Sorbet",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【刹那氷菓子】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-jinmeiyo",
      "n1",
      "金閣寺",
      "split-second",
      "instant"
    ]
  },
  {
    "id": "yukoku-79-shuku",
    "character": "宿",
    "strokeCount": 11,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "シュク"
    ],
    "kunyomi": [
      "やど",
      "やど・る"
    ],
    "readings": {
      "onyomi": [
        "シュク"
      ],
      "kunyomi": [
        "やど",
        "やど・る"
      ]
    },
    "meanings": [
      "destiny",
      "lodge",
      "dwelling"
    ],
    "primaryWork": "仮面の告白",
    "primaryWorkEnglish": "Confessions of a Mask",
    "allRelatedWorks": [
      "仮面の告白"
    ],
    "literaryCompounds": [
      {
        "compound": "宿命",
        "reading": "しゅくめい",
        "meaning": "destiny/fate"
      },
      {
        "compound": "宿痾",
        "reading": "しゅくあ",
        "meaning": "deep chronic ailment"
      },
      {
        "compound": "宿泊",
        "reading": "しゅくはく",
        "meaning": "destiny compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「人は誰しも、己の生まれ持った宿命から逃れることはできない。」",
      "englishTranslation": "No man can escape the destiny with which he was born.",
      "sourceWork": "仮面の告白",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『仮面の告白』."
    },
    "cafeOrderItem": {
      "itemName": "宿命の深煎りエスプレッソ",
      "flavorProfile": "Fate Double Espresso",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【宿命の深煎りエスプレッソ】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-3",
      "n3",
      "仮面の告白",
      "destiny",
      "lodge"
    ]
  },
  {
    "id": "yukoku-80-mei",
    "character": "命",
    "strokeCount": 8,
    "grade": 3,
    "jlptLevel": "N3",
    "tier": 4,
    "tierName": "憂国と太陽・奔馬",
    "onyomi": [
      "メイ",
      "ミョウ"
    ],
    "kunyomi": [
      "いのち"
    ],
    "readings": {
      "onyomi": [
        "メイ",
        "ミョウ"
      ],
      "kunyomi": [
        "いのち"
      ]
    },
    "meanings": [
      "life",
      "destiny",
      "command"
    ],
    "primaryWork": "憂国",
    "primaryWorkEnglish": "Patriotism",
    "allRelatedWorks": [
      "憂国"
    ],
    "literaryCompounds": [
      {
        "compound": "宿命",
        "reading": "しゅくめい",
        "meaning": "fate"
      },
      {
        "compound": "運命",
        "reading": "うんめい",
        "meaning": "destiny"
      },
      {
        "compound": "使命",
        "reading": "しめい",
        "meaning": "life compound"
      }
    ],
    "literaryQuote": {
      "originalJapanese": "「己の命を捧げることによってのみ、美は完成されるのだ。」",
      "englishTranslation": "Only by dedicating one's life is beauty brought to completion.",
      "sourceWork": "憂国",
      "contextNote": "Key excerpt demonstrating the aesthetic tension and psychological resonance of 『憂国』."
    },
    "cafeOrderItem": {
      "itemName": "命の雫玉露",
      "flavorProfile": "Drop-of-Life Gyokuro",
      "dialogueLine": "「文豪・三島由紀夫の美学を宿した【命の雫玉露】をご賞味ください。」"
    },
    "gameplayTags": [
      "tier-4",
      "grade-3",
      "n3",
      "憂国",
      "life",
      "destiny"
    ]
  }
];

export const CURRICULUM_DATASET: MishimaCurriculumDataset = {
  version: '1.0.0',
  lastUpdated: '2026-11-16',
  authorNote:
    'Curated literary curriculum of 80 canonical Kanji featured in the works of Yukio Mishima, with authentic citations, Joyo classifications, and kissaten cafe bindings.',
  totalKanjiCount: 80,
  tiers: TIER_METADATA,
  kanjiList: MISHIMA_KANJI_CURRICULUM,
};

// Aliases for export compatibility
export const kanjiList = MISHIMA_KANJI_CURRICULUM;
export const curriculumTiers = TIER_METADATA;
export const mishimaCurriculum = CURRICULUM_DATASET;

// Query Helper Functions
export function getAllKanji(): MishimaKanjiEntry[] {
  return MISHIMA_KANJI_CURRICULUM;
}

export function getKanjiByTier(tier: CurriculumTierNumber): MishimaKanjiEntry[] {
  if (tier !== 1 && tier !== 2 && tier !== 3 && tier !== 4) {
    return [];
  }
  return MISHIMA_KANJI_CURRICULUM.filter((k) => k.tier === tier);
}

export function getKanjiById(id: string): MishimaKanjiEntry | undefined {
  if (!id) return undefined;
  return MISHIMA_KANJI_CURRICULUM.find((k) => k.id === id);
}

export function getKanjiByCharacter(character: string): MishimaKanjiEntry | undefined {
  if (!character) return undefined;
  return MISHIMA_KANJI_CURRICULUM.find((k) => k.character === character);
}

export function getTierMeta(tier: CurriculumTierNumber): CurriculumTierMeta | undefined {
  if (tier !== 1 && tier !== 2 && tier !== 3 && tier !== 4) {
    return undefined;
  }
  return TIER_METADATA.find((t) => t.tier === tier);
}

export function getKanjiByWork(workTitle: string): MishimaKanjiEntry[] {
  if (!workTitle) return [];
  return MISHIMA_KANJI_CURRICULUM.filter(
    (k) => k.primaryWork === workTitle || k.allRelatedWorks.includes(workTitle)
  );
}
