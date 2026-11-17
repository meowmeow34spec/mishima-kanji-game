# サロン三島 — Salon Mishima

**An interactive Showa-era literary kissaten kanji learning game built around the works of Yukio Mishima (三島由紀夫).**

Inspired by [`katakana-cafe`](https://github.com/meowmeow34spec/katakana-cafe), **Salon Mishima** places you behind the polished mahogany counter of a 1950s–60s Japanese literary café. Iconic characters from Yukio Mishima's novels visit the salon and order thematic wagashi sweets and teas—and you must identify, recall, and assemble the kanji woven through Mishima's prose to serve them.

### Play Now in Your Browser (웹에서 바로 플레이)
👉 **[https://meowmeow34spec.github.io/mishima-kanji-game/](https://meowmeow34spec.github.io/mishima-kanji-game/)**

---

## Table of Contents

- [Concept & Aesthetic](#concept--aesthetic)
- [Yukio Mishima 80-Kanji Curriculum](#yukio-mishima-80-kanji-curriculum)
- [Gameplay Mechanics](#gameplay-mechanics)
- [Learning & Spaced Repetition Systems](#learning--spaced-repetition-systems)
- [Procedural Audio & Japanese Speech](#procedural-audio--japanese-speech)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Testing & Verification](#testing--verification)
- [Acknowledgments](#acknowledgments)

---

## Concept & Aesthetic

**Salon Mishima** (*サロン三島*) blends tactile café-serving gameplay with Japanese literary study:

- **Showa Kissaten Atmosphere**: Styled with deep *urushi* black lacquer (`#181514`), aged mahogany counters (`#2c1810`), burnished *chinkin* gold inlays (`#d4af37`), handcrafted mulberry *washi* reveal cards (`#f7f4ec`), vermilion *hanko* seals (`三島印`), and classical Mincho serif typography (`Shippori Mincho` & `Noto Serif JP`).
- **Literary Patrons**: Serve 8 memorable characters drawn from Mishima's bibliography—**有為子** (*Uiko*), **柏木** (*Kashiwagi*), **溝口** (*Mizoguchi*), **新治** (*Shinji*), **初江** (*Hatsue*), **松枝清顕** (*Kiyoaki Matsugae*), **本多繁邦** (*Shigekuni Honda*), and **影山朝子** (*Asako Kageyama*).
- **Thematic Salon Menu**: Every kanji is paired with a bespoke café delicacy and patron dialogue line (such as *金箔抹茶パフェ / Gold Leaf Matcha Parfait* for **金**).

---

## Yukio Mishima 80-Kanji Curriculum

The curriculum spans **80 curated kanji** organized into **4 progressive literary tiers** (20 kanji per tier), covering JLPT levels **N5 through N1** (`N5: 4`, `N4: 11`, `N3: 11`, `N2: 23`, `N1: 31`):

| Tier | Title | Literary Works Covered | Sample Kanji |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **金閣の炎と耽美**<br>*The Temple of the Golden Pavilion & Foundation Aesthetics* | *The Temple of the Golden Pavilion* (`金閣寺`) | `金 閣 寺 美 鏡 炎 影 僧 幻 滅 焼 灰 鳳 凰 池 光 絶 嫉 妬 生` |
| **Tier 2** | **潮騒の海と幽玄**<br>*The Sound of Waves & Sea of Fertility* | *The Sound of Waves* (`潮騒`), *The Sea of Fertility* (`豊饒の海`), *Spring Snow* (`春の雪`), *The Decay of the Angel* (`天人五衰`) | `潮 騒 海 豊 饒 波 漁 島 舟 嵐 浜 砂 篝 潜 誓 春 雪 衰 滝 寂` |
| **Tier 3** | **仮面の告白と愛憎**<br>*Confessions of a Mask, Forbidden Colors & Rokumeikan* | *Confessions of a Mask* (`仮面の告白`), *Forbidden Colors* (`禁色`), *Rokumeikan* (`鹿鳴館`) | `仮 面 告 白 禁 色 罪 偽 恥 劇 演 耽 矢 殉 射 恍 惚 鹿 鳴 館` |
| **Tier 4** | **憂国と太陽・奔馬**<br>*Patriotism, Runaway Horses, Sun and Steel & Samsara* | *Patriotism* (`憂国`), *Runaway Horses* (`奔馬`), *Sun and Steel* (`太陽と鉄`), *The Temple of Dawn* (`暁の寺`) | `憂 国 奔 馬 暁 鉄 陽 太 肉 筋 魂 刃 腹 切 忠 輪 廻 刹 宿 命` |

Each kanji entry includes:
- **Readings**: Strict phonetic separation with *On'yomi* in Katakana and *Kun'yomi* in Hiragana (plus stroke count, Joyo grade, and JLPT level).
- **230 Literary Compounds**: 2–3 key vocabulary compounds per kanji with furigana readings and English definitions.
- **80 Literary Excerpts**: Verbatim Japanese sentences from Yukio Mishima's works containing the target kanji, paired with English translations and literary context notes.

---

## Gameplay Mechanics

### 1. Salon Floor Plan (`SalonMap`)
Navigate across the 4 literary tiers, each featuring **3 counter service stages** (`第N幕・壱 / 弐 / 参`) and **1 Boss Duel** (`第N幕・決闘`), alongside instant access to **25s Rush Mode**, **Daily Review**, and the **Study Codex**.

### 2. Counter Service Orders (`SalonCounter`)
Each stage consists of 6 customer orders cycling through three interactive task modes:
- **Conveyor Rail Picking (`pick`)**: Read the patron's request on the chalkboard and select the matching 3D wooden kanji block from the mahogany conveyor rail (`ConveyorRail`).
- **Reading Recall Keypad (`recall`)**: Identify the correct *On'yomi* or *Kun'yomi* reading on the virtual keypad (`KeypadRecall`), with automatic normalization across Hiragana/Katakana and okurigana delimiters (`・`, `-`).
- **Multi-Slot Serving Tray (`build`)**: Assemble literary kanji compounds (e.g., `金閣`) character-by-character in sequential order on the lacquer serving tray (`ServingTray`).

### 3. Literary Word Reveal (`WordRevealModal`)
Completing an order presents a celebratory *washi* parchment card stamped with Mishima's vermilion seal (`三島印`), displaying readings, compounds, the source novel quote, and a Japanese pronunciation replay button.

### 4. Combo & Coin Economy (`comboCalculator`)
- Consecutive correct answers build a **Combo Streak**, awarding `50 + min(combo - 1, 10) * 10` coins (*銭*) per hit (up to 150 coins per hit).
- Reaching combo milestones (`3, 5, 10, 15, 20...`) triggers celebratory fanfares.
- Mistakes reset your combo to `0` and cost one of your **3 hearts**.

### 5. 25-Second Rush Mode (`RushOverlay`)
A rapid-fire blitz against a **25.0-second** countdown timer:
- Earn **+15 coins** for every correct kanji identified.
- Mistakes incur a **-1.5 second** time penalty.

### 6. Confusing Kanji Boss Duels (`BossArena`)
Confront 8 themed boss battles centered on visually or semantically deceptive kanji pairs:
- **Tier 1**: `寺 vs 侍` (*Temple vs Samurai*), `炎 vs 炭` (*Inferno vs Charcoal*)
- **Tier 2**: `華 vs 葉` (*Splendor vs Leaf*)
- **Tier 3**: `憂 vs 優` (*Grief vs Gentle/Actor*), `閣 vs 闊` (*Pavilion vs Spacious*)
- **Tier 4**: `魂 vs 魄` (*Soul vs Wraith*), `刀 · 刃 · 切 · 力` (*The Fourfold Blades*)
- **Grand Master**: `輪 · 廻 · 刹 · 宿 · 命` (*Phantom Literatus Mishima*)

Answer rapid-fire distinction questions before the accelerating round timer expires (decaying `-0.4s` per round down to `3.6s`) to deplete the Boss's HP (`10–16` HP) while protecting your **3 hearts**. Defeating a tier boss awards **500 coins** and unlocks the next literary tier.

### 7. Study Codex (`StudyCodexModal`)
Browse all **80 kanji** in an interactive dictionary grid with real-time search (by kanji glyph, *On/Kun* reading, English meaning, compound, or novel title), tier filter tabs, full literary quotes, and spoken audio playback.

---

## Learning & Spaced Repetition Systems

- **7-Box Leitner SRS (`src/srs/leitnerEngine.ts`)**:
  - Cards progress from **Box 0** (unreviewed) through **Box 6** (mastered) using spaced intervals of `[0, 1, 2, 4, 7, 14, 30]` days.
  - Correct answers promote the card (+1 box, max Box 6); missed cards demote to **Box 1** for next-day reinforcement.
  - **Daily Morning Review (`DailyReviewModal`)**: Surfaces due cards (or your 5 weakest cards ranked by error rate, box penalty, and overdue duration) and awards **+25 coins** per review.
- **Dynamic Confusion Matrix**:
  - Logs every mistaken kanji choice (`targetId -> mistakenOption -> count`) and automatically biases future conveyor/review distractors toward pairs you confuse most.
- **Resilient LocalStorage Persistence (`src/srs/storageManager.ts`)**:
  - Saves cards, coins, unlocked tiers, completed stages, confusion matrix, audio settings, and calendar-day login streaks under `mishima-cafe/v1`, with safe recovery from corrupted JSON or storage quota limits.

---

## Procedural Audio & Japanese Speech

Zero external audio assets are required—all sound is synthesized in real time in the browser:

- **Procedural Web Audio API (`src/audio/soundSynthesizer.ts`)**:
  - **9 Synthesized Sound Effects**: `bell` (salon entrance chime), `clink` (wooden block tap), `correct` (combo-ascending pentatonic chime), `wrong`, `drop` (tray placement), `fanfare`, `rush` tick, `hurt`, and `bossHit`.
  - **Real-Time Procedural BGM**:
    - *Salon Mode*: 92 BPM Showa kissaten jazz progression (`Fmaj7 → Em7 → Dm7 → Cmaj7`) with C major pentatonic improvisation.
    - *Boss Mode*: 132 BPM urgent duel progression (`Am → F → G → E`) with A harmonic minor lead.
- **Japanese Text-to-Speech (`src/audio/speechSynthesizer.ts`)**:
  - Dispatches native `ja-JP` pronunciation via the Web Speech API (`rate: 0.85`, `pitch: 1.05`), prioritizing high-quality Japanese system voices with graceful silent fallback if unsupported or muted.

---

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/meowmeow34spec/mishima-kanji-game.git
cd mishima-kanji-game

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open the local URL displayed in your terminal (typically `http://localhost:5173`) in a modern browser.

### Production Build & Preview

```bash
# Type-check with TypeScript and build production bundle into dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```text
mishima-kanji-game/
├── index.html                   # Showa serif fonts & SPA entry shell
├── package.json                 # Scripts (dev, build, preview, test, test:e2e, test:watch)
├── vite.config.ts               # Vite + Vitest (jsdom) configuration
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                  # Root HUD, mode router, and global modals
│   ├── main.tsx                 # React 19 entry point
│   ├── audio/
│   │   ├── soundSynthesizer.ts  # Procedural Web Audio API SFX & Showa jazz/boss BGM
│   │   └── speechSynthesizer.ts # Web Speech API (ja-JP) Japanese TTS
│   ├── components/
│   │   ├── BossArena.tsx        # Confusing kanji boss duel arena
│   │   ├── ConveyorRail.tsx     # 3D mahogany rail & wooden kanji blocks
│   │   ├── DailyReviewModal.tsx # Morning Leitner SRS review modal
│   │   ├── KeypadRecall.tsx     # Virtual reading selection keypad
│   │   ├── RushOverlay.tsx      # 25-second rush mode HUD & prompts
│   │   ├── SalonCounter.tsx     # Active patron dialogue, chalkboard & counter
│   │   ├── SalonMap.tsx         # 4-tier salon floor plan & stage selector
│   │   ├── ServingTray.tsx      # Multi-slot compound assembly tray
│   │   ├── SettingsModal.tsx    # Master mute, volume & TTS controls
│   │   ├── StudyCodexModal.tsx  # Searchable 80-kanji literary codex
│   │   ├── TitleScreen.tsx      # Title banner & mastery overview
│   │   └── WordRevealModal.tsx  # Washi reveal card with Mishima quotes
│   ├── data/
│   │   ├── bossPairs.ts         # 8 confusing kanji boss encounters
│   │   └── mishimaCurriculum.ts # 80-kanji dataset across 4 literary tiers
│   ├── game/
│   │   ├── bossBattleEngine.ts  # Boss HP, hearts & accelerating timer logic
│   │   ├── comboCalculator.ts   # Progressive combo & milestone payout formula
│   │   ├── gameEngine.ts        # Master GameEngine state machine
│   │   ├── matchingEngine.ts    # Pick, recall, tray drop & kana normalization
│   │   ├── orderGenerator.ts    # Patron order & confusion-biased distractors
│   │   └── rushController.ts    # 25s rush countdown & -1.5s penalty logic
│   ├── hooks/
│   │   └── useGameState.ts      # React subscription hook for GameEngine
│   ├── srs/
│   │   ├── leitnerEngine.ts     # 7-box Leitner SRS, weakness & confusion matrix
│   │   └── storageManager.ts    # LocalStorage persistence (`mishima-cafe/v1`)
│   ├── styles/
│   │   ├── salon.css            # Showa kissaten layout & 3D block styles
│   │   └── variables.css        # Lacquer, gold, washi & typography tokens
│   └── types/                   # TypeScript contracts (audio, curriculum, game, srs)
└── tests/
    ├── audio.test.ts            # Audio & speech unit tests (32 tests)
    ├── curriculum.test.ts       # Curriculum schema & integrity tests (46 tests)
    ├── gameLogic.test.ts        # Core game engine unit tests (41 tests)
    ├── srs.test.ts              # Leitner & confusion matrix unit tests (25 tests)
    ├── storage.test.ts          # LocalStorage & recovery unit tests (24 tests)
    ├── e2e/                     # 4-tier E2E suite (58 tests)
    │   ├── tier1_features.test.ts
    │   ├── tier2_boundaries.test.ts
    │   ├── tier3_interactions.test.ts
    │   └── tier4_scenarios.test.ts
    └── helpers/                 # Deterministic audio/speech/storage mocks & driver
```

---

## Testing & Verification

The project includes **226 automated tests** across **9 Vitest suites** (168 unit tests + 58 opaque-box E2E tests covering features, boundaries, cross-subsystem interactions, and end-to-end player journeys):

```bash
# Run the complete unit + E2E test suite
npm test

# Run only the 4-tier E2E test suite
npm run test:e2e

# Run tests in watch mode during development
npm run test:watch

# Verify TypeScript compilation without emitting files
npx tsc --noEmit
```

### Suite Breakdown
- **Unit Tests (168)**: `curriculum.test.ts` (46), `gameLogic.test.ts` (41), `audio.test.ts` (32), `srs.test.ts` (25), `storage.test.ts` (24).
- **E2E Tests (58)**:
  - `tier1_features.test.ts` (37): Curriculum inventory, game mechanics, SRS, audio/speech, UI components, and repository delivery checks.
  - `tier2_boundaries.test.ts` (10): Invalid queries, timer underflow clamping, heart depletion, corrupted JSON/quota storage recovery, okurigana normalization.
  - `tier3_interactions.test.ts` (6): Cross-subsystem chains (order → tray → combo → SRS; mistake → confusion bias; audio transitions & mute enforcement).
  - `tier4_scenarios.test.ts` (5): Full novice shift, morning review, boss victory & tier unlock, multi-day streak progression, and auto-recovery journeys.

---

## Acknowledgments

- Gameplay loop and café-serving inspiration from [`katakana-cafe`](https://github.com/meowmeow34spec/katakana-cafe).
- Literary excerpts and vocabulary curated around the works of **Yukio Mishima (三島由紀夫)**.
