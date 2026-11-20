/**
 * Salon Mishima 3D - 80-Kanji Korean Mnemonic Study Codex Modal
 * File: src/components/StudyCodexModal.tsx
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Volume2, X, BookOpen } from 'lucide-react';
import type { MishimaKanjiEntry, CurriculumTierNumber } from '../types/curriculum';
import { getAllKanji, TIER_METADATA } from '../data/mishimaCurriculum';
import { getKoreanGloss, getKoreanWorkTitle } from '../data/koreanGlossary';
import { getKoreanMnemonic } from '../data/koreanMnemonics';
import { speakKanji } from '../audio/speechSynthesizer';

export interface StudyCodexModalProps {
  isOpen: boolean;
  kanjiList?: MishimaKanjiEntry[];
  onClose: () => void;
}

const TIER_COLORS: Record<CurriculumTierNumber, string> = {
  1: 'var(--tier-1-color)',
  2: 'var(--tier-2-color)',
  3: 'var(--tier-3-color)',
  4: 'var(--tier-4-color)',
};

const TIER_NAMES_KO: Record<CurriculumTierNumber, string> = {
  1: '제1막 · 금각사',
  2: '제2막 · 조소·봄눈',
  3: '제3막 · 가면·록명관',
  4: '제4막 · 우국·분마',
};

export const StudyCodexModal: React.FC<StudyCodexModalProps> = ({
  isOpen,
  kanjiList,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<CurriculumTierNumber | 'all'>('all');
  const [selectedKanji, setSelectedKanji] = useState<MishimaKanjiEntry | null>(null);

  const sourceList = useMemo(
    () => (kanjiList && kanjiList.length > 0 ? kanjiList : getAllKanji()),
    [kanjiList]
  );

  const filteredKanji = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return sourceList.filter((entry) => {
      if (selectedTier !== 'all' && entry.tier !== selectedTier) {
        return false;
      }
      if (!query) return true;

      const onyomi = (entry.onyomi || entry.readings?.onyomi || []).join(' ').toLowerCase();
      const kunyomi = (entry.kunyomi || entry.readings?.kunyomi || []).join(' ').toLowerCase();
      const meanings = (entry.meanings || []).join(' ').toLowerCase();
      const compounds = (entry.literaryCompounds || [])
        .map((c) => `${c.compound} ${c.reading} ${c.meaning}`)
        .join(' ')
        .toLowerCase();

      const koGloss = getKoreanGloss(entry.character);
      const mne = getKoreanMnemonic(entry.character);
      const workKo = getKoreanWorkTitle(entry.primaryWork).toLowerCase();
      const koSearchBlob = [
        koGloss?.huneum,
        koGloss?.meaningKo,
        koGloss?.primaryCompoundKo,
        mne?.huneum,
        mne?.meaningKo,
        mne?.radicalBreakdown,
        mne?.storyMnemonicKo,
        ...(mne?.compoundsKo || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        entry.character.includes(query) ||
        onyomi.includes(query) ||
        kunyomi.includes(query) ||
        meanings.includes(query) ||
        entry.primaryWork.toLowerCase().includes(query) ||
        (entry.primaryWorkEnglish || '').toLowerCase().includes(query) ||
        workKo.includes(query) ||
        koSearchBlob.includes(query) ||
        compounds.includes(query)
      );
    });
  }, [sourceList, searchQuery, selectedTier]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="study-codex-modal"
      data-testid="study-codex-modal"
      role="dialog"
      aria-modal="true"
      aria-label="미시마 유키오 80한자 연상 도감"
    >
      <div className="codex-dialog">
        <div className="codex-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={22} color="#92400e" />
            <h2 className="codex-title">
              미시마 80한자 연상 도감 ({filteredKanji.length} / {sourceList.length})
            </h2>
          </div>

          <div className="codex-controls">
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flex: '1 1 220px',
                minWidth: 0,
              }}
            >
              <Search
                size={16}
                color="#78350f"
                style={{ position: 'absolute', left: '0.85rem', pointerEvents: 'none' }}
              />
              <input
                type="text"
                data-testid="codex-search-input"
                className="codex-search-input"
                style={{ paddingLeft: '2.35rem' }}
                placeholder="한자 · 훈음 · 부수 · 작품명 검색 (예: 금각사, 불꽃)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              data-testid="btn-close-codex"
              className="btn-ivory"
              onClick={onClose}
            >
              <X size={16} />
              <span>닫기</span>
            </button>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="codex-tier-tabs">
          <button
            type="button"
            data-testid="codex-tier-all"
            className={selectedTier === 'all' ? 'btn-gold' : 'btn-ivory'}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.9rem', flexShrink: 0 }}
            onClick={() => setSelectedTier('all')}
          >
            전체 80자 보기
          </button>
          {TIER_METADATA.map((meta) => (
            <button
              key={meta.tier}
              type="button"
              data-testid={`codex-tier-${meta.tier}`}
              className={selectedTier === meta.tier ? 'btn-gold' : 'btn-ivory'}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.9rem', flexShrink: 0 }}
              onClick={() => setSelectedTier(meta.tier)}
            >
              {TIER_NAMES_KO[meta.tier]}
            </button>
          ))}
        </div>

        {/* Selected Kanji Inspector with Full Korean Mnemonics */}
        {selectedKanji &&
          (() => {
            const koDetail = getKoreanGloss(selectedKanji.character);
            const mne = getKoreanMnemonic(selectedKanji.character);
            const workKoDetail = getKoreanWorkTitle(selectedKanji.primaryWork);
            return (
              <div data-testid="codex-detail-panel" className="codex-detail-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    className="kanji-serif"
                    style={{ fontSize: '3.4rem', fontWeight: 900, lineHeight: 1, color: '#111111' }}
                  >
                    {selectedKanji.character}
                  </span>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#7c2d12' }}>
                      {mne?.visualPictogram ? `${mne.visualPictogram} ` : ''}
                      {mne?.huneum || koDetail?.huneum || ''}{' '}
                      <span style={{ color: '#141210' }}>
                        ({mne?.meaningKo || koDetail?.meaningKo || selectedKanji.meanings.join(', ')})
                      </span>
                    </div>
                    <div className="pill-row" style={{ marginTop: '0.35rem' }}>
                      {(selectedKanji.onyomi || []).length > 0 && (
                        <span className="pill-badge pill-badge--onyomi">
                          음독 {(selectedKanji.onyomi || []).join('·')}
                        </span>
                      )}
                      {(selectedKanji.kunyomi || []).length > 0 && (
                        <span className="pill-badge pill-badge--kunyomi">
                          훈독 {(selectedKanji.kunyomi || []).join('·')}
                        </span>
                      )}
                      <span className="pill-badge pill-badge--work">
                        {selectedKanji.strokeCount}획 · {selectedKanji.jlptLevel} · 『{workKoDetail || selectedKanji.primaryWork}』
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                  {mne && (
                    <div
                      style={{
                        background: '#fffbeb',
                        border: '1.5px solid #f59e0b',
                        borderRadius: '10px',
                        padding: '0.55rem 0.75rem',
                        marginBottom: '0.5rem',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                      }}
                    >
                      <div>🧩 <strong>부수:</strong> {mne.radicalBreakdown}</div>
                      <div style={{ marginTop: '0.2rem' }}>💡 <strong>연상:</strong> {mne.storyMnemonicKo}</div>
                      <div style={{ marginTop: '0.2rem', color: '#7f1d1d' }}>🗣️ <strong>발음팁:</strong> {mne.koreanSoundTip}</div>
                    </div>
                  )}
                  <p className="kanji-serif" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {selectedKanji.literaryQuote.originalJapanese}
                  </p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2c2520' }}>
                    {mne?.quoteKo || selectedKanji.literaryQuote.englishTranslation}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-ivory"
                    onClick={() => {
                      try {
                        speakKanji(
                          selectedKanji.literaryCompounds?.[0]?.reading ||
                            selectedKanji.character
                        );
                      } catch {
                        // Fallback
                      }
                    }}
                  >
                    <Volume2 size={16} />
                    <span>발음 듣기</span>
                  </button>
                  <button
                    type="button"
                    className="btn-ivory"
                    onClick={() => setSelectedKanji(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })()}

        {/* 80-Kanji Grid */}
        <div className="codex-grid">
          {filteredKanji.map((entry) => {
            const firstReading =
              entry.onyomi?.[0] ||
              entry.kunyomi?.[0] ||
              entry.readings?.onyomi?.[0] ||
              '';
            const mneCard = getKoreanMnemonic(entry.character);
            const koCard = getKoreanGloss(entry.character);
            const workKoCard = getKoreanWorkTitle(entry.primaryWork);
            return (
              <button
                key={entry.id}
                type="button"
                data-testid={`codex-card-${entry.id}`}
                className="codex-card"
                onClick={() => setSelectedKanji(entry)}
              >
                <span
                  className="codex-tier-tag"
                  style={
                    {
                      '--tier-accent-color': TIER_COLORS[entry.tier],
                    } as React.CSSProperties
                  }
                >
                  {workKoCard || entry.primaryWork}
                </span>
                <span className="codex-card-char">{entry.character}</span>
                <span className="codex-card-reading">{firstReading}</span>
                <span className="codex-card-meaning">
                  {mneCard?.huneum ||
                    (koCard ? koCard.huneum.split(' · ')[0] : entry.meanings?.[0] || '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyCodexModal;
