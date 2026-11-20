/**
 * Salon Mishima 3D - Pre-Shift 1-Minute Beginner Kanji Lesson Modal
 * ("☕ 오픈 전 마스터의 1분 한자 과외 — 먼저 배우고 익힌 뒤 출근!")
 * File: src/components/PreShiftLessonModal.tsx
 *
 * 3-Step Zero-Stress Flow for Complete Beginners:
 * - Step 1 (Study): 5 visual/phonetic flashcards with Hangul readings, audio & 1-tap hand check
 * - Step 2 (Practice): 5 untimed, zero-penalty warm-up checks with gentle master coaching tips
 * - Step 3 (Ready): Confident launch into the 3D cafe shift (only those 5 kanji appear!)
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Coffee,
  Sparkles,
  Hand,
  GraduationCap,
  X,
} from 'lucide-react';
import type { CurriculumTierNumber, MishimaKanjiEntry } from '../types/curriculum';
import {
  getStageKanjiList,
  getKoreanMnemonic,
  kanaToHangul,
  formatReadingWithHangul,
  parseStageId,
  type StageKanjiLessonItem,
} from '../data/koreanMnemonics';
import { playSound, unlockAudio } from '../audio/soundSynthesizer';
import { speakKanji } from '../audio/speechSynthesizer';

export interface PreShiftLessonModalProps {
  isOpen?: boolean;
  tier?: CurriculumTierNumber | number;
  stageNum?: 1 | 2 | 3 | 4 | number;
  stageId?: string | null;
  /** Optional explicit 5-kanji list override (e.g. in standalone tests) */
  kanjiList?: MishimaKanjiEntry[];
  /** Invoked when player completes Step 3 ("이제 자신 있게 출근하기!") */
  onStartShift?: (tier: CurriculumTierNumber, stageId: string) => void;
  /** Alias of onStartShift for ergonomic test/App wiring */
  onComplete?: (tier: CurriculumTierNumber, stageId: string) => void;
  /** Invoked when veteran clicks "예습 건너뛰고 바로 서빙 →" */
  onSkip?: (tier: CurriculumTierNumber, stageId: string) => void;
  onSkipLesson?: (tier: CurriculumTierNumber, stageId: string) => void;
  /** Optional close button back to Title / Map without starting shift */
  onClose?: () => void;
  /** Optional hook so App.tsx can showcase the active study kanji on the 3D counter */
  onActiveKanjiChange?: (kanji: MishimaKanjiEntry, index: number) => void;
}

interface WarmupQuestion {
  index: number;
  kind: 'meaning_to_kanji' | 'kanji_to_reading';
  target: StageKanjiLessonItem;
  promptKo: string;
  options: { label: string; sublabel?: string; isCorrect: boolean }[];
}

function buildLessonItemsFromOverride(list: MishimaKanjiEntry[]): StageKanjiLessonItem[] {
  return list.slice(0, 5).map((kanji) => {
    const fallbackStage = getStageKanjiList(kanji.tier || 1, 1);
    const mnemonic =
      getKoreanMnemonic(kanji.character) ||
      getKoreanMnemonic(kanji.id) ||
      fallbackStage[0].mnemonic;

    const onyomiRaw = kanji.onyomi?.length ? kanji.onyomi : kanji.readings?.onyomi || [];
    const kunyomiRaw = kanji.kunyomi?.length ? kanji.kunyomi : kanji.readings?.kunyomi || [];
    const primaryReadingRaw = onyomiRaw[0] || kunyomiRaw[0] || kanji.character;

    return {
      kanji,
      mnemonic,
      id: kanji.id,
      character: kanji.character,
      huneum: mnemonic.huneum,
      meaningKo: mnemonic.meaningKo,
      primaryReading: primaryReadingRaw.replace(/[・\-]/g, '').trim(),
      primaryReadingHangul: kanaToHangul(primaryReadingRaw),
      primaryReadingFormatted: formatReadingWithHangul(primaryReadingRaw),
      onyomiFormatted: onyomiRaw.map((r) => formatReadingWithHangul(r)),
      kunyomiFormatted: kunyomiRaw.map((r) => formatReadingWithHangul(r)),
      warmTipKo: `괜찮아요! ${mnemonic.visualPictogram} ${mnemonic.radicalBreakdown} → '${mnemonic.huneum}(${kanji.character})' · 발음은 ${formatReadingWithHangul(primaryReadingRaw)}이에요 😊 다시 눌러볼까요?`,
    };
  });
}

function buildWarmupQuestions(items: StageKanjiLessonItem[]): WarmupQuestion[] {
  return items.map((target, idx) => {
    const others = items.filter((it) => it.id !== target.id);
    // Deterministic rotation so options vary across questions without jumping on re-render
    const distractors = [
      others[idx % others.length],
      others[(idx + 1) % others.length],
      others[(idx + 2) % others.length],
    ].filter(Boolean);

    if (idx % 2 === 0) {
      // Meaning + Huneum -> Pick Kanji
      const rawOpts = [target, ...distractors.slice(0, 3)];
      const rotated = rawOpts.map((_, i) => rawOpts[(i + idx) % rawOpts.length]);
      return {
        index: idx,
        kind: 'meaning_to_kanji',
        target,
        promptKo: `방금 배운 『${target.huneum}』 (${target.meaningKo}) 한자는 어느 것일까요?`,
        options: rotated.map((item) => ({
          label: item.character,
          sublabel: item.primaryReadingFormatted,
          isCorrect: item.id === target.id,
        })),
      };
    }

    // Kanji + Huneum -> Pick Japanese Reading (with Hangul!)
    const usedReadings = new Set<string>([target.primaryReadingFormatted]);
    const readingDistractors: StageKanjiLessonItem[] = [];
    for (const d of others) {
      if (!usedReadings.has(d.primaryReadingFormatted)) {
        usedReadings.add(d.primaryReadingFormatted);
        readingDistractors.push(d);
      }
      if (readingDistractors.length >= 3) break;
    }
    const rawOpts = [target, ...readingDistractors];
    const rotated = rawOpts.map((_, i) => rawOpts[(i + idx) % rawOpts.length]);
    return {
      index: idx,
      kind: 'kanji_to_reading',
      target,
      promptKo: `한자 『${target.character}』 (${target.huneum})의 알맞은 일본어 발음은?`,
      options: rotated.map((item) => ({
        label: item.primaryReadingFormatted,
        isCorrect: item.id === target.id,
      })),
    };
  });
}

export const PreShiftLessonModal: React.FC<PreShiftLessonModalProps> = ({
  isOpen = true,
  tier = 1,
  stageNum,
  stageId,
  kanjiList,
  onStartShift,
  onComplete,
  onSkip,
  onSkipLesson,
  onClose,
  onActiveKanjiChange,
}) => {
  const parsedStage = useMemo(
    () =>
      parseStageId(
        stageId ?? stageNum ?? 1,
        (tier === 1 || tier === 2 || tier === 3 || tier === 4 ? tier : 1) as CurriculumTierNumber
      ),
    [stageId, stageNum, tier]
  );

  const lessonItems = useMemo<StageKanjiLessonItem[]>(() => {
    if (kanjiList && kanjiList.length > 0) {
      return buildLessonItemsFromOverride(kanjiList);
    }
    return getStageKanjiList(parsedStage.tier, parsedStage.stageNum);
  }, [kanjiList, parsedStage.tier, parsedStage.stageNum]);

  const warmupQuestions = useMemo(
    () => buildWarmupQuestions(lessonItems),
    [lessonItems]
  );

  const [phase, setPhase] = useState<'study' | 'practice' | 'ready'>('study');
  const [studyIndex, setStudyIndex] = useState(0);
  const [touchedIds, setTouchedIds] = useState<Record<string, boolean>>({});
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [wrongOptIndices, setWrongOptIndices] = useState<number[]>([]);
  const [warmTip, setWarmTip] = useState<string | null>(null);

  // Reset lesson state whenever modal opens for a new stage
  useEffect(() => {
    if (isOpen) {
      setPhase('study');
      setStudyIndex(0);
      setTouchedIds({});
      setPracticeIndex(0);
      setWrongOptIndices([]);
      setWarmTip(null);
    }
  }, [isOpen, parsedStage.stageId]);

  const currentStudyItem = lessonItems[studyIndex] || lessonItems[0];
  const currentQuestion = warmupQuestions[practiceIndex] || warmupQuestions[0];

  useEffect(() => {
    if (!isOpen || !onActiveKanjiChange) return;
    if (phase === 'study' && currentStudyItem) {
      onActiveKanjiChange(currentStudyItem.kanji, studyIndex);
    } else if (phase === 'practice' && currentQuestion) {
      onActiveKanjiChange(currentQuestion.target.kanji, practiceIndex);
    }
  }, [
    isOpen,
    phase,
    studyIndex,
    practiceIndex,
    currentStudyItem,
    currentQuestion,
    onActiveKanjiChange,
  ]);

  if (!isOpen || lessonItems.length === 0) {
    return null;
  }

  const playSafeChime = (cue: 'correct' | 'wrong' | 'fanfare' | 'clink') => {
    try {
      unlockAudio().catch(() => {});
      playSound(cue);
    } catch {
      // Headless safe
    }
  };

  const speakSafe = (kanjiEntry: MishimaKanjiEntry) => {
    try {
      const text =
        kanjiEntry.literaryCompounds?.[0]?.reading || kanjiEntry.character;
      speakKanji(text);
    } catch {
      // Headless safe
    }
  };

  const handleSkipToShift = () => {
    const skipFn = onSkip ?? onSkipLesson ?? onStartShift ?? onComplete;
    skipFn?.(parsedStage.tier, parsedStage.stageId);
  };

  const handleFinishToShift = () => {
    playSafeChime('fanfare');
    const finishFn = onStartShift ?? onComplete;
    finishFn?.(parsedStage.tier, parsedStage.stageId);
  };

  const isCurrentTouched = Boolean(
    currentStudyItem && touchedIds[currentStudyItem.id]
  );

  const handleTouchKanji = () => {
    if (!currentStudyItem) return;
    playSafeChime('correct');
    speakSafe(currentStudyItem.kanji);
    setTouchedIds((prev) => ({ ...prev, [currentStudyItem.id]: true }));
  };

  const handleNextStudyCard = () => {
    if (studyIndex + 1 < lessonItems.length) {
      setStudyIndex(studyIndex + 1);
    } else {
      setPhase('practice');
      setPracticeIndex(0);
      setWrongOptIndices([]);
      setWarmTip(null);
    }
  };

  const handlePracticePick = (optIdx: number, forQuestionIndex: number) => {
    if (forQuestionIndex !== practiceIndex || !currentQuestion) return;
    const chosen = currentQuestion.options[optIdx];
    if (!chosen) return;

    if (chosen.isCorrect) {
      playSafeChime('correct');
      speakSafe(currentQuestion.target.kanji);
      setWrongOptIndices([]);
      setWarmTip(null);
      if (practiceIndex + 1 < warmupQuestions.length) {
        setPracticeIndex(practiceIndex + 1);
      } else {
        playSafeChime('fanfare');
        setPhase('ready');
      }
    } else {
      playSafeChime('clink');
      if (!wrongOptIndices.includes(optIdx)) {
        setWrongOptIndices((prev) => [...prev, optIdx]);
      }
      setWarmTip(currentQuestion.target.warmTipKo);
    }
  };

  return (
    <div
      className="pre-shift-lesson-modal"
      data-testid="pre-shift-lesson-modal"
      role="dialog"
      aria-modal="true"
      aria-label="오픈 전 마스터의 1분 한자 과외"
    >
      <div className="lesson-dialog-card">
        {/* Top Bar: Lesson Title + Veteran Skip */}
        <div className="lesson-top-bar">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <GraduationCap size={20} color="#92400e" />
            <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#141210' }}>
              마스터의 1분 한자 과외 · 제{parsedStage.tier}막 {parsedStage.stageNum}교시
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              data-testid="btn-lesson-skip"
              className="btn-ivory"
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.875rem' }}
              onClick={handleSkipToShift}
            >
              <span>예습 건너뛰고 바로 서빙 →</span>
            </button>

            {onClose && (
              <button
                type="button"
                data-testid="btn-lesson-close"
                className="btn-ivory"
                aria-label="과외 창 닫기"
                style={{ padding: '0.3rem 0.5rem' }}
                onClick={onClose}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="pill-row" style={{ justifyContent: 'center' }}>
          <span
            className={
              phase === 'study'
                ? 'pill-badge pill-badge--huneum'
                : 'pill-badge pill-badge--kunyomi'
            }
          >
            1단계: 눈으로 5글자 익히기
          </span>
          <span
            className={
              phase === 'practice'
                ? 'pill-badge pill-badge--huneum'
                : phase === 'ready'
                  ? 'pill-badge pill-badge--kunyomi'
                  : 'pill-badge pill-badge--work'
            }
          >
            2단계: 손풀기 미니 연습
          </span>
          <span
            className={
              phase === 'ready'
                ? 'pill-badge pill-badge--kunyomi'
                : 'pill-badge pill-badge--work'
            }
          >
            3단계: 출근 준비 완료
          </span>
        </div>

        {/* =================================================================
            STEP 1: 5-KANJI VISUAL & PHONETIC FLASHCARDS
            ================================================================= */}
        {phase === 'study' && currentStudyItem && (
          <div data-testid="lesson-step-study" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {/* 5 Kanji Progress Tabs */}
            <div className="lesson-progress-dots">
              {lessonItems.map((item, idx) => {
                const done = Boolean(touchedIds[item.id]);
                const active = idx === studyIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`lesson-tab-${idx}`}
                    className={`lesson-dot-btn ${
                      active ? 'lesson-dot-btn--active' : done ? 'lesson-dot-btn--done' : ''
                    }`.trim()}
                    onClick={() => setStudyIndex(idx)}
                  >
                    <span className="kanji-serif">{item.character}</span>
                    {done && <CheckCircle2 size={14} />}
                  </button>
                );
              })}
            </div>

            {/* Study Card Body */}
            <div className="lesson-hero-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span
                    className="lesson-kanji-display"
                    data-testid="lesson-study-kanji"
                  >
                    {currentStudyItem.character}
                  </span>
                  <div>
                    <div
                      data-testid="lesson-study-huneum"
                      style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7c2d12' }}
                    >
                      {currentStudyItem.mnemonic.visualPictogram}{' '}
                      {currentStudyItem.huneum}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2c2520' }}>
                      뜻: {currentStudyItem.meaningKo} ({studyIndex + 1} / {lessonItems.length})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="btn-lesson-audio"
                  className="btn-ivory"
                  style={{ padding: '0.4rem 0.75rem' }}
                  onClick={() => speakSafe(currentStudyItem.kanji)}
                >
                  <Volume2 size={16} />
                  <span>발음 듣기</span>
                </button>
              </div>

              {/* Kana + Hangul Reading Pills */}
              <div className="pill-row">
                {currentStudyItem.onyomiFormatted.map((on, i) => (
                  <span key={`on-${i}`} className="pill-badge pill-badge--onyomi">
                    음독 {on}
                  </span>
                ))}
                {currentStudyItem.kunyomiFormatted.map((kun, i) => (
                  <span key={`kun-${i}`} className="pill-badge pill-badge--kunyomi">
                    훈독 {kun}
                  </span>
                ))}
              </div>

              {/* Radical + 1-Second Story + Sound Bridge */}
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #f59e0b',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                }}
              >
                <div style={{ color: '#451a03' }}>
                  🧩 <strong>모양 조립:</strong> {currentStudyItem.mnemonic.radicalBreakdown}
                </div>
                <div style={{ color: '#141210', lineHeight: 1.42 }}>
                  💡 <strong>1초 연상:</strong> {currentStudyItem.mnemonic.storyMnemonicKo}
                </div>
                <div style={{ color: '#7f1d1d', lineHeight: 1.4 }}>
                  🗣️ <strong>한글 발음 공식:</strong> {currentStudyItem.mnemonic.koreanSoundTip}
                </div>
              </div>
            </div>

            {/* 1-Tap Touch Check + Next Card */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {studyIndex > 0 && (
                <button
                  type="button"
                  className="btn-ivory"
                  style={{ padding: '0.55rem 0.75rem' }}
                  onClick={() => setStudyIndex(studyIndex - 1)}
                >
                  <ArrowLeft size={16} />
                  <span>이전</span>
                </button>
              )}

              <button
                type="button"
                data-testid="btn-lesson-touch-kanji"
                className={isCurrentTouched ? 'btn-emerald' : 'btn-ivory'}
                style={{ flex: '1 1 200px', padding: '0.6rem 0.85rem' }}
                onClick={handleTouchKanji}
              >
                {isCurrentTouched ? <CheckCircle2 size={17} /> : <Hand size={17} color="#b45309" />}
                <span>
                  {isCurrentTouched
                    ? `「${currentStudyItem.character} (${currentStudyItem.huneum})」 손에 익힘 완료!`
                    : `방금 본 한자 「${currentStudyItem.character}」 톡 눌러서 손에 익히기`}
                </span>
              </button>

              <button
                type="button"
                data-testid="btn-lesson-next"
                disabled={!isCurrentTouched}
                className="btn-gold"
                style={{
                  flex: '1 1 160px',
                  padding: '0.6rem 0.9rem',
                  opacity: isCurrentTouched ? 1 : 0.55,
                }}
                onClick={handleNextStudyCard}
              >
                <span>
                  {studyIndex + 1 < lessonItems.length
                    ? `다음 글자 (${studyIndex + 2}/${lessonItems.length})`
                    : '손풀기 미니 연습 시작'}
                </span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            STEP 2: ZERO-PENALTY WARM-UP PRACTICE (NO TIMER, NO HEART LOSS!)
            ================================================================= */}
        {phase === 'practice' && currentQuestion && (
          <div data-testid="lesson-step-practice" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}
            >
              <span className="pill-badge pill-badge--kunyomi">
                손풀기 연습 {practiceIndex + 1} / {warmupQuestions.length}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#047857' }}>
                시간제한 없음 · 틀려도 하트가 전혀 깎이지 않아요!
              </span>
            </div>

            <div className="lesson-hero-card" style={{ textAlign: 'center' }}>
              {currentQuestion.kind === 'kanji_to_reading' && (
                <div className="lesson-kanji-display" style={{ margin: '0 auto' }}>
                  {currentQuestion.target.character}
                </div>
              )}
              <div style={{ fontSize: '1.12rem', fontWeight: 900, color: '#141210' }}>
                {currentQuestion.promptKo}
              </div>
            </div>

            <div className="lesson-practice-grid">
              {currentQuestion.options.map((opt, idx) => {
                const isMarkedWrong = wrongOptIndices.includes(idx);
                return (
                  <button
                    key={`${practiceIndex}-${idx}`}
                    type="button"
                    data-testid={`lesson-practice-option-${idx}`}
                    className={`wooden-block lesson-practice-option ${
                      isMarkedWrong ? 'wooden-block--wrong' : ''
                    }`.trim()}
                    style={{
                      minHeight: '64px',
                      fontSize:
                        currentQuestion.kind === 'meaning_to_kanji' ? '2rem' : '1.12rem',
                      fontFamily:
                        currentQuestion.kind === 'meaning_to_kanji'
                          ? 'var(--font-kanji)'
                          : 'var(--font-sans)',
                      opacity: isMarkedWrong ? 0.55 : 1,
                    }}
                    onClick={() => handlePracticePick(idx, practiceIndex)}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {warmTip && (
              <div className="lesson-warm-tip" data-testid="lesson-warm-tip">
                {warmTip}
              </div>
            )}
          </div>
        )}

        {/* =================================================================
            STEP 3: READY TO START SHIFT!
            ================================================================= */}
        {phase === 'ready' && (
          <div
            data-testid="lesson-step-complete"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.75rem',
              padding: '0.4rem 0',
            }}
          >
            <Sparkles size={34} color="#d97706" />
            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#141210' }}>
              5글자 예습 완료! 이제 손님을 맞이할 준비가 끝났어요!
            </h3>
            <p style={{ fontSize: '0.96rem', fontWeight: 700, color: '#2c2520', maxWidth: '500px' }}>
              방금 배우고 연습한 아래 <strong>5글자만 손님이 주문합니다!</strong> 서빙 도중 기억이 안 나면 상단 <strong>[배운 5글자 컨닝페이퍼]</strong>를 언제든 열어보세요.
            </p>

            <div className="pill-row" style={{ justifyContent: 'center' }}>
              {lessonItems.map((item) => (
                <span
                  key={item.id}
                  className="pill-badge pill-badge--huneum"
                  style={{ fontSize: '0.95rem', padding: '0.28rem 0.7rem' }}
                >
                  <strong className="kanji-serif" style={{ fontSize: '1.15rem' }}>
                    {item.character}
                  </strong>{' '}
                  {item.huneum} · {item.primaryReadingHangul}
                </span>
              ))}
            </div>

            <button
              type="button"
              data-testid="btn-lesson-start-shift"
              className="btn-gold"
              style={{ width: '100%', maxWidth: '420px', fontSize: '1.08rem', padding: '0.8rem 1.4rem' }}
              onClick={handleFinishToShift}
            >
              <Coffee size={19} />
              <span>이제 자신 있게 출근하기!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreShiftLessonModal;
