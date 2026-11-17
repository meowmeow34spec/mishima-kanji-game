/**
 * Salon Mishima - 80-Kanji Study Codex & Literary Reference Modal
 * File: src/components/StudyCodexModal.tsx
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Volume2, X, BookOpen } from 'lucide-react';
import type { MishimaKanjiEntry, CurriculumTierNumber } from '../types/curriculum';
import { getAllKanji, TIER_METADATA } from '../data/mishimaCurriculum';
import { getKoreanGloss, getKoreanWorkTitle } from '../data/koreanGlossary';
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
      const workKo = getKoreanWorkTitle(entry.primaryWork).toLowerCase();
      const koSearchBlob = koGloss
        ? `${koGloss.huneum} ${koGloss.meaningKo} ${koGloss.primaryCompoundKo}`.toLowerCase()
        : '';

      return (
        entry.character.includes(query) ||
        onyomi.includes(query) ||
        kunyomi.includes(query) ||
        meanings.includes(query) ||
        entry.primaryWork.toLowerCase().includes(query) ||
        entry.primaryWorkEnglish.toLowerCase().includes(query) ||
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
      aria-label="Mishima Kanji Study Codex"
    >
      <div className="codex-dialog">
        <div className="codex-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={24} color="var(--color-gold-light)" />
            <h2 className="codex-title">三島漢字録 ({filteredKanji.length} / {sourceList.length})</h2>
          </div>

          <div className="codex-controls">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 220px', minWidth: 0 }}>
              <Search
                size={16}
                color="var(--color-gold)"
                style={{ position: 'absolute', left: '0.85rem', pointerEvents: 'none' }}
              />
              <input
                type="text"
                data-testid="codex-search-input"
                className="codex-search-input"
                style={{ paddingLeft: '2.35rem' }}
                placeholder="漢字・読み・意味・한국어 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              data-testid="btn-close-codex"
              className="btn-lacquer"
              onClick={onClose}
            >
              <X size={16} />
              <span>閉じる (Close)</span>
            </button>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="codex-tier-tabs">
          <button
            type="button"
            data-testid="codex-tier-all"
            className={selectedTier === 'all' ? 'btn-gold' : 'btn-lacquer'}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', flexShrink: 0 }}
            onClick={() => setSelectedTier('all')}
          >
            全階層 (All)
          </button>
          {TIER_METADATA.map((meta) => (
            <button
              key={meta.tier}
              type="button"
              data-testid={`codex-tier-${meta.tier}`}
              className={selectedTier === meta.tier ? 'btn-gold' : 'btn-lacquer'}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', flexShrink: 0 }}
              onClick={() => setSelectedTier(meta.tier)}
            >
              第{meta.tier}階層：{meta.name}
            </button>
          ))}
        </div>

        {/* Selected Kanji Inspector */}
        {selectedKanji && (() => {
          const koDetail = getKoreanGloss(selectedKanji.character);
          const workKoDetail = getKoreanWorkTitle(selectedKanji.primaryWork);
          return (
            <div
              data-testid="codex-detail-panel"
              className="codex-detail-panel"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>
                  {selectedKanji.character}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {selectedKanji.meanings.join(', ')}
                    {koDetail ? ` · ${koDetail.huneum}` : ''}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)' }}>
                    音: {(selectedKanji.onyomi || []).join('・') || '—'} ／ 訓:{' '}
                    {(selectedKanji.kunyomi || []).join('・') || '—'} ／ 画数:{' '}
                    {selectedKanji.strokeCount}画 ({selectedKanji.jlptLevel})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-crimson)', marginTop: '0.2rem' }}>
                    代表作: 『{selectedKanji.primaryWork}』{workKoDetail ? ` (${workKoDetail})` : ` (${selectedKanji.primaryWorkEnglish})`}
                  </div>
                </div>
              </div>

              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  {selectedKanji.literaryQuote.originalJapanese}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-secondary)', fontStyle: 'italic' }}>
                  {selectedKanji.literaryQuote.englishTranslation}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-lacquer"
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
                  <span>発音</span>
                </button>
                <button
                  type="button"
                  className="btn-lacquer"
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
            const koCard = getKoreanGloss(entry.character);
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
                  style={{ '--tier-accent-color': TIER_COLORS[entry.tier] } as React.CSSProperties}
                >
                  第{entry.tier}層・{entry.primaryWork}
                </span>
                <span className="codex-card-char">{entry.character}</span>
                <span className="codex-card-reading">{firstReading}</span>
                <span className="codex-card-meaning">
                  {koCard ? `${koCard.huneum.split(' · ')[0]} · ${entry.meanings?.[0] || ''}` : entry.meanings?.[0] || ''}
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
