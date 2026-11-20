/**
 * Salon Mishima 3D - Korean-First Daily Leitner Spaced Repetition Review Modal
 * File: src/components/DailyReviewModal.tsx
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Flame, X, Volume2, Lightbulb } from 'lucide-react';
import type { CardProgress, PlayerProfile } from '../types/srs';
import type { MishimaKanjiEntry } from '../types/curriculum';
import { getAllKanji, getKanjiById } from '../data/mishimaCurriculum';
import { getKoreanGloss, getKoreanWorkTitle } from '../data/koreanGlossary';
import { getKoreanMnemonic } from '../data/koreanMnemonics';
import { getDueKanji, getWeakestKanji, getDistractors } from '../srs/leitnerEngine';
import { loadProfile, recordReviewResult } from '../srs/storageManager';
import { playSound } from '../audio/soundSynthesizer';
import { speakKanji } from '../audio/speechSynthesizer';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface DailyReviewModalProps {
  isOpen: boolean;
  dueCards?: CardProgress[];
  profile?: PlayerProfile | null;
  onClose: () => void;
  onReviewComplete?: () => void;
  onCompleteReview?: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({
  isOpen,
  dueCards,
  profile,
  onClose,
  onReviewComplete,
  onCompleteReview,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  const resolvedProfile = useMemo(
    () => profile ?? gameState.profile ?? loadProfile(),
    [profile, gameState.profile]
  );

  const buildQueue = (useWeakest: boolean): MishimaKanjiEntry[] => {
    const sourceCards = useWeakest
      ? getWeakestKanji(resolvedProfile.cards || {}, 5)
      : dueCards ?? getDueKanji(resolvedProfile.cards || {});
    return sourceCards
      .map((c) => getKanjiById(c.id))
      .filter((k): k is MishimaKanjiEntry => Boolean(k));
  };

  const [sessionQueue, setSessionQueue] = useState<MishimaKanjiEntry[]>(() =>
    isOpen ? buildQueue(false) : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    selected: string;
    isCorrect: boolean;
  } | null>(null);
  const [isDone, setIsDone] = useState(false);

  const prevIsOpenRef = useRef<boolean>(isOpen);
  const prevDueCardsRef = useRef<CardProgress[] | undefined>(dueCards);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    const dueCardsChangedWhileOpen =
      isOpen && dueCards !== prevDueCardsRef.current;
    prevIsOpenRef.current = isOpen;
    prevDueCardsRef.current = dueCards;

    if (justOpened || dueCardsChangedWhileOpen) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setSessionQueue(buildQueue(false));
      setCurrentIndex(0);
      setCorrectCount(0);
      setShowHint(false);
      setFeedback(null);
      setIsDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dueCards]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const reviewQueue = sessionQueue;
  const currentKanji = reviewQueue[currentIndex] || null;

  const confusionRef = useRef(resolvedProfile.confusion || {});
  confusionRef.current = resolvedProfile.confusion || {};

  const options = useMemo(() => {
    if (!currentKanji) return [];
    const all = getAllKanji();
    const distractors = getDistractors(
      currentKanji,
      all,
      3,
      confusionRef.current
    ).map((k) => k.character);
    const list = Array.from(new Set([currentKanji.character, ...distractors]));
    return list.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
  }, [currentKanji]);

  if (!isOpen) {
    return null;
  }

  const handleAnswer = (chosenChar: string) => {
    if (!currentKanji || feedback) return;
    const isCorrect = chosenChar === currentKanji.character;
    setFeedback({ selected: chosenChar, isCorrect });

    try {
      playSound(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        speakKanji(
          currentKanji.literaryCompounds?.[0]?.reading || currentKanji.character
        );
      }
      const updated = recordReviewResult(
        currentKanji.id,
        isCorrect,
        isCorrect ? undefined : chosenChar
      );
      if (isCorrect) {
        updated.coins = (updated.coins || 0) + 25;
      }
      dispatch({ type: 'UPDATE_PROFILE', payload: updated });
    } catch {
      // Safe fallback
    }

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setFeedback(null);
      setShowHint(false);
      if (currentIndex + 1 >= reviewQueue.length) {
        setIsDone(true);
        try {
          playSound('fanfare');
        } catch {
          // Safe fallback
        }
        onReviewComplete?.();
        onCompleteReview?.();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 600);
  };

  const handleClose = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCurrentIndex(0);
    setCorrectCount(0);
    setShowHint(false);
    setIsDone(false);
    setFeedback(null);
    onClose();
  };

  const mne = currentKanji ? getKoreanMnemonic(currentKanji.character) : undefined;
  const koGloss = currentKanji ? getKoreanGloss(currentKanji.character) : undefined;

  return (
    <div
      className="word-reveal-modal"
      data-testid="daily-review-modal"
      role="dialog"
      aria-modal="true"
      aria-label="오늘의 라이트너 복습"
    >
      <div className="reveal-parchment-card" style={{ maxWidth: '580px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#991b1b',
              fontWeight: 900,
              fontSize: '0.98rem',
            }}
          >
            <Calendar size={17} />
            <span>오늘의 복습 (라이트너 암기 상자)</span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#451a03',
            }}
          >
            <Flame size={16} color="#b91c1c" />
            <span>{resolvedProfile.streak || 1}일 연속 출근</span>
          </span>
        </div>

        {reviewQueue.length === 0 && !isDone && (
          <div style={{ padding: '1rem 0' }}>
            <CheckCircle2
              size={48}
              color="#047857"
              style={{ margin: '0 auto 0.65rem' }}
            />
            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              오늘 복습할 한자를 모두 마쳤습니다!
            </h3>
            <p
              style={{
                fontSize: '0.96rem',
                fontWeight: 700,
                color: '#2c2520',
                marginBottom: '1.35rem',
              }}
            >
              학습한 한자들이 다음 복습 주기까지 머릿속에 단단히 정착되어 있습니다.
              {Object.keys(resolvedProfile.cards || {}).length > 0 &&
                ' 원하시면 자주 헷갈렸던 취약 한자 5개를 집중 복습할 수 있습니다!'}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              {Object.keys(resolvedProfile.cards || {}).length > 0 && (
                <button
                  type="button"
                  data-testid="btn-practice-weakest"
                  className="btn-gold"
                  onClick={() => {
                    setSessionQueue(buildQueue(true));
                    setCurrentIndex(0);
                    setCorrectCount(0);
                    setShowHint(false);
                    setFeedback(null);
                    setIsDone(false);
                  }}
                >
                  🎯 취약 한자 5개 집중 특훈
                </button>
              )}
              <button
                type="button"
                data-testid="btn-close-review"
                className="btn-ivory"
                onClick={handleClose}
              >
                <X size={16} />
                <span>닫기</span>
              </button>
            </div>
          </div>
        )}

        {reviewQueue.length > 0 && !isDone && currentKanji && (
          <div>
            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#453b32',
                marginBottom: '0.65rem',
              }}
            >
              복습 {currentIndex + 1} / {reviewQueue.length} · 『
              {getKoreanWorkTitle(currentKanji.primaryWork) || currentKanji.primaryWork}』
            </div>

            <div className="reveal-quote-box" style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#141210', marginBottom: '0.45rem' }}>
                훈음: {mne?.huneum || koGloss?.huneum || currentKanji.meanings.join(', ')}{' '}
                <span style={{ fontSize: '0.95rem', color: '#2c2520' }}>
                  ({mne?.meaningKo || currentKanji.meanings.join(', ')})
                </span>
              </div>

              <div className="pill-row">
                {(currentKanji.onyomi || []).length > 0 && (
                  <span className="pill-badge pill-badge--onyomi">
                    음독 {(currentKanji.onyomi || []).join('·')}
                  </span>
                )}
                {(currentKanji.kunyomi || []).length > 0 && (
                  <span className="pill-badge pill-badge--kunyomi">
                    훈독 {(currentKanji.kunyomi || []).join('·')}
                  </span>
                )}
              </div>

              {showHint && mne && (
                <div className="mnemonic-hint-strip" style={{ marginTop: '0.6rem' }}>
                  <span>{mne.visualPictogram}</span>
                  <span>🧩 {mne.radicalBreakdown}</span>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.8rem',
                marginBottom: '1.15rem',
              }}
            >
              {options.map((opt) => {
                const isSelected = feedback?.selected === opt;
                const stateClass = isSelected
                  ? feedback.isCorrect
                    ? 'wooden-block--correct'
                    : 'wooden-block--wrong'
                  : '';

                return (
                  <button
                    key={opt}
                    type="button"
                    data-testid={`review-option-${opt}`}
                    disabled={Boolean(feedback)}
                    onClick={() => handleAnswer(opt)}
                    className={`wooden-block ${stateClass}`.trim()}
                    style={{ fontSize: '2.25rem', minHeight: '76px' }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-ivory"
                  onClick={() => {
                    try {
                      speakKanji(currentKanji.character);
                    } catch {
                      // Fallback
                    }
                  }}
                >
                  <Volume2 size={16} />
                  <span>발음 힌트</span>
                </button>

                {mne && !showHint && (
                  <button
                    type="button"
                    className="btn-ivory"
                    onClick={() => setShowHint(true)}
                  >
                    <Lightbulb size={16} color="#d97706" />
                    <span>부수 힌트</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                data-testid="btn-close-review"
                className="btn-ivory"
                onClick={handleClose}
              >
                <span>복습 닫기</span>
              </button>
            </div>
          </div>
        )}

        {isDone && (
          <div style={{ padding: '1rem 0' }}>
            <h3 style={{ fontSize: '1.65rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              🎉 오늘의 복습 완료!
            </h3>
            <p
              style={{
                color: '#2c2520',
                fontWeight: 800,
                fontSize: '1rem',
                marginBottom: '1.35rem',
              }}
            >
              정답: {correctCount} / {reviewQueue.length}문제 · 보너스 엽전: +{correctCount * 25} 銭
            </p>
            <button
              type="button"
              data-testid="btn-close-review"
              className="btn-gold"
              onClick={handleClose}
            >
              <span>☕ 카페로 돌아가기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReviewModal;
