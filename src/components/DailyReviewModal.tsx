/**
 * Salon Mishima - Daily Leitner Spaced Repetition Morning Review Modal
 * File: src/components/DailyReviewModal.tsx
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Flame, X, Volume2 } from 'lucide-react';
import type { CardProgress, PlayerProfile } from '../types/srs';
import type { MishimaKanjiEntry } from '../types/curriculum';
import { getAllKanji, getKanjiById } from '../data/mishimaCurriculum';
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
    const dueCardsChangedWhileOpen = isOpen && dueCards !== prevDueCardsRef.current;
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
    // Deterministic sort based on charCode so options don't jump
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
        speakKanji(currentKanji.literaryCompounds?.[0]?.reading || currentKanji.character);
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
    setIsDone(false);
    setFeedback(null);
    onClose();
  };

  return (
    <div
      className="word-reveal-modal"
      data-testid="daily-review-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Daily Morning Review"
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
              color: 'var(--color-crimson)',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            <Calendar size={16} />
            <span>朝の復習 — LEITNER SRS</span>
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              color: 'var(--color-ink-secondary)',
            }}
          >
            <Flame size={15} color="var(--color-crimson)" />
            <span>連続 {resolvedProfile.streak || 1} 日</span>
          </span>
        </div>

        {reviewQueue.length === 0 && !isDone && (
          <div style={{ padding: '1.25rem 0' }}>
            <CheckCircle2
              size={48}
              color="var(--color-emerald)"
              style={{ margin: '0 auto 0.75rem' }}
            />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              本日の復習予定はありません
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-ink-secondary)',
                marginBottom: '1.5rem',
              }}
            >
              すべての習得済み漢字が次回の間隔まで定着しています。
              {Object.keys(resolvedProfile.cards || {}).length > 0 &&
                ' 苦手な漢字を特訓することもできます。'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {Object.keys(resolvedProfile.cards || {}).length > 0 && (
                <button
                  type="button"
                  data-testid="btn-practice-weakest"
                  className="btn-gold"
                  onClick={() => {
                    setSessionQueue(buildQueue(true));
                    setCurrentIndex(0);
                    setCorrectCount(0);
                    setFeedback(null);
                    setIsDone(false);
                  }}
                >
                  弱点漢字を特訓する
                </button>
              )}
              <button
                type="button"
                data-testid="btn-close-review"
                className="btn-lacquer"
                onClick={handleClose}
              >
                <X size={16} />
                <span>閉じる</span>
              </button>
            </div>
          </div>
        )}

        {reviewQueue.length > 0 && !isDone && currentKanji && (
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-ink-muted)',
                marginBottom: '0.75rem',
              }}
            >
              復習 {currentIndex + 1} / {reviewQueue.length} — 『{currentKanji.primaryWork}』
            </div>

            <div className="reveal-quote-box" style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                意味: {currentKanji.meanings.join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-secondary)' }}>
                読み: {[...(currentKanji.onyomi || []), ...(currentKanji.kunyomi || [])].join('・')}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              {options.map((opt) => {
                const isSelected = feedback?.selected === opt;
                const bg = isSelected
                  ? feedback.isCorrect
                    ? 'var(--color-emerald)'
                    : 'var(--color-crimson)'
                  : 'var(--color-counter)';

                return (
                  <button
                    key={opt}
                    type="button"
                    data-testid={`review-option-${opt}`}
                    disabled={Boolean(feedback)}
                    onClick={() => handleAnswer(opt)}
                    style={{
                      padding: '1rem',
                      fontSize: '2rem',
                      fontWeight: 900,
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      color: 'var(--color-gold-light)',
                      border: '2px solid var(--color-gold-border)',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-lacquer"
                onClick={() => {
                  try {
                    speakKanji(currentKanji.character);
                  } catch {
                    // Fallback
                  }
                }}
              >
                <Volume2 size={16} />
                <span>ヒント音声</span>
              </button>

              <button
                type="button"
                data-testid="btn-close-review"
                className="btn-lacquer"
                onClick={handleClose}
              >
                <span>中断して閉じる</span>
              </button>
            </div>
          </div>
        )}

        {isDone && (
          <div style={{ padding: '1rem 0' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              朝の復習 完了！
            </h3>
            <p style={{ color: 'var(--color-ink-secondary)', marginBottom: '1.5rem' }}>
              正答数: {correctCount} / {reviewQueue.length} 問 ／ 報酬: {correctCount * 25} 銭
            </p>
            <button
              type="button"
              data-testid="btn-close-review"
              className="btn-gold"
              onClick={handleClose}
            >
              <span>帳場へ戻る</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReviewModal;
