/**
 * Salon Mishima - Celebratory Washi Word Reveal Modal
 * File: src/components/WordRevealModal.tsx
 */

import React, { useEffect } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import type { MishimaKanjiEntry } from '../types/curriculum';
import { getKoreanGloss, getKoreanWorkTitle } from '../data/koreanGlossary';
import { speakKanji } from '../audio/speechSynthesizer';

export interface WordRevealModalProps {
  isOpen: boolean;
  kanji: MishimaKanjiEntry | null;
  onClose: () => void;
}

export const WordRevealModal: React.FC<WordRevealModalProps> = ({
  isOpen,
  kanji,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen || !kanji) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, kanji, onClose]);

  if (!isOpen || !kanji) {
    return null;
  }

  const koGloss = getKoreanGloss(kanji.character);
  const workKo = getKoreanWorkTitle(kanji.literaryQuote.sourceWork);

  const onyomiList = kanji.onyomi?.length
    ? kanji.onyomi
    : kanji.readings?.onyomi || [];
  const kunyomiList = kanji.kunyomi?.length
    ? kanji.kunyomi
    : kanji.readings?.kunyomi || [];

  const handlePlayAudio = () => {
    const text =
      kanji.literaryCompounds?.[0]?.reading ||
      kanji.character;
    try {
      speakKanji(text);
    } catch {
      // Safe speech fallback
    }
  };

  return (
    <div
      className="word-reveal-modal"
      data-testid="word-reveal-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-character-heading"
    >
      <div className="reveal-parchment-card">
        <div className="hanko-seal" aria-hidden="true">
          三島印
        </div>

        <div className="reveal-header-badge">
          一字習得 — LITERARY REVEAL
        </div>

        <div
          id="reveal-character-heading"
          className="reveal-character"
          data-testid="reveal-character"
        >
          {kanji.character}
        </div>

        <div className="reveal-readings">
          {onyomiList.length > 0 && (
            <span>音読み: {onyomiList.join('、')}</span>
          )}
          {onyomiList.length > 0 && kunyomiList.length > 0 && (
            <span> ／ </span>
          )}
          {kunyomiList.length > 0 && (
            <span>訓読み: {kunyomiList.join('、')}</span>
          )}
        </div>

        <div className="reveal-meaning">
          <strong>意味:</strong> {kanji.meanings.join(', ')}
          {koGloss && (
            <div style={{ marginTop: '0.25rem', color: 'var(--color-crimson)', fontWeight: 700 }}>
              훈음: {koGloss.huneum} ({koGloss.meaningKo})
            </div>
          )}
        </div>

        {kanji.literaryCompounds?.length > 0 && (
          <div
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-ink-secondary)',
              marginBottom: '1rem',
            }}
          >
            <strong>代表熟語:</strong>{' '}
            {kanji.literaryCompounds[0].compound}（
            {kanji.literaryCompounds[0].reading}）—{' '}
            {kanji.literaryCompounds[0].meaning}
            {koGloss?.primaryCompoundKo ? ` · ${koGloss.primaryCompoundKo}` : ''}
          </div>
        )}

        <div className="reveal-quote-box">
          <p className="reveal-quote" data-testid="reveal-quote">
            {kanji.literaryQuote.originalJapanese}
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-ink-secondary)',
              fontStyle: 'italic',
              marginBottom: '0.45rem',
            }}
          >
            {kanji.literaryQuote.englishTranslation}
          </p>
          <div className="reveal-source" data-testid="reveal-source">
            —— 三島由紀夫『{kanji.literaryQuote.sourceWork}』{workKo ? ` (${workKo})` : ''}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            data-testid="btn-reveal-audio"
            className="btn-lacquer"
            onClick={handlePlayAudio}
          >
            <Volume2 size={18} />
            <span>朗読を聴く</span>
          </button>

          <button
            type="button"
            data-testid="btn-modal-continue"
            className="btn-gold"
            onClick={onClose}
          >
            <span>次へ進む (Continue)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordRevealModal;
