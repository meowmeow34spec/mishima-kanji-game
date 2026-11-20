/**
 * Salon Mishima 3D - Effortless Korean Mnemonic & Literary Word Reveal Modal
 * File: src/components/WordRevealModal.tsx
 */

import React, { useEffect } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import type { MishimaKanjiEntry } from '../types/curriculum';
import { getKoreanGloss, getKoreanWorkTitle } from '../data/koreanGlossary';
import { getKoreanMnemonic, formatReadingWithHangul } from '../data/koreanMnemonics';
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
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
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

  const mne = getKoreanMnemonic(kanji.character);
  const koGloss = getKoreanGloss(kanji.character);
  const workKo = getKoreanWorkTitle(kanji.literaryQuote.sourceWork);

  const onyomiList = kanji.onyomi?.length
    ? kanji.onyomi
    : kanji.readings?.onyomi || [];
  const kunyomiList = kanji.kunyomi?.length
    ? kanji.kunyomi
    : kanji.readings?.kunyomi || [];

  const huneumLabel = mne?.huneum || koGloss?.huneum || kanji.meanings[0] || '';
  const meaningKoLabel =
    mne?.meaningKo || koGloss?.meaningKo || kanji.meanings.join(', ');

  const handlePlayAudio = () => {
    const text =
      kanji.literaryCompounds?.[0]?.reading || kanji.character;
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
          ✨ 서빙 성공 · 1초 연상 한자 카드
        </div>

        {/* Hero Kanji + Big Korean Huneum */}
        <div className="reveal-hero-row">
          <div
            id="reveal-character-heading"
            className="reveal-character"
            data-testid="reveal-character"
          >
            {kanji.character}
          </div>

          <div style={{ textAlign: 'left', minWidth: 0 }}>
            <div className="reveal-huneum-headline">
              {mne?.visualPictogram ? `${mne.visualPictogram} ` : ''}
              {huneumLabel}
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#2c2520',
                marginTop: '0.1rem',
              }}
            >
              뜻: {meaningKoLabel}
            </div>
          </div>
        </div>

        {/* Crisp >= 15px Furigana / Reading Pill Badges (with Hangul!) */}
        <div className="reveal-readings">
          {onyomiList.length > 0 && (
            <span className="pill-badge pill-badge--onyomi">
              음독 {onyomiList.map((r) => formatReadingWithHangul(r)).join(' · ')}
            </span>
          )}
          {kunyomiList.length > 0 && (
            <span className="pill-badge pill-badge--kunyomi">
              훈독 {kunyomiList.map((r) => formatReadingWithHangul(r)).join(' · ')}
            </span>
          )}
        </div>

        {/* Effortless Memorization Box: Radical Split + Story Mnemonic + Sound Bridge */}
        {mne && (
          <div className="reveal-mnemonic-box" data-testid="reveal-mnemonic-box">
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#451a03' }}>
              🧩 <strong>부수 분해:</strong> {mne.radicalBreakdown}
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#141210', lineHeight: 1.42 }}>
              💡 <strong>1초 연상:</strong> {mne.storyMnemonicKo}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#7f1d1d', lineHeight: 1.4 }}>
              🗣️ <strong>발음 공식:</strong> {mne.koreanSoundTip}
            </div>
          </div>
        )}

        {/* Primary Literary Compound */}
        {kanji.literaryCompounds?.length > 0 && (
          <div
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#141210',
              backgroundColor: '#f3efe6',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              marginBottom: '0.6rem',
            }}
          >
            <strong>핵심 숙어:</strong>{' '}
            <span className="kanji-serif" style={{ fontSize: '1.05rem' }}>
              {kanji.literaryCompounds[0].compound}
            </span>
            （{kanji.literaryCompounds[0].reading}）—{' '}
            {mne?.compoundsKo?.[0] ||
              koGloss?.primaryCompoundKo ||
              kanji.literaryCompounds[0].meaning}
          </div>
        )}

        {/* Original Japanese Quote + Crisp Korean Translation */}
        <div className="reveal-quote-box">
          <p className="reveal-quote" data-testid="reveal-quote">
            {kanji.literaryQuote.originalJapanese}
          </p>
          {mne?.quoteKo ? (
            <p className="reveal-quote-ko">{mne.quoteKo}</p>
          ) : (
            <p className="reveal-quote-ko">
              {kanji.literaryQuote.englishTranslation}
            </p>
          )}
          <div className="reveal-source" data-testid="reveal-source">
            —— 미시마 유키오 『{kanji.literaryQuote.sourceWork}』
            {workKo ? ` (${workKo})` : ''}
          </div>
        </div>

        {/* Single-Row Footer Actions (Fits 100% Above Fold on 390x844 Mobile!) */}
        <div className="reveal-footer-actions">
          <button
            type="button"
            data-testid="btn-reveal-audio"
            className="btn-ivory"
            style={{ flex: '0 0 auto', whiteSpace: 'nowrap', padding: '0.58rem 0.85rem' }}
            onClick={handlePlayAudio}
          >
            <Volume2 size={17} />
            <span>발음 듣기</span>
          </button>

          <button
            type="button"
            data-testid="btn-modal-continue"
            className="btn-gold"
            style={{ flex: '1 1 auto', whiteSpace: 'nowrap', padding: '0.58rem 0.95rem' }}
            onClick={onClose}
          >
            <span>다음 손님 받기 (Enter)</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordRevealModal;
