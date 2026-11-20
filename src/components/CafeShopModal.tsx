/**
 * Salon Mishima 3D - Live 3D Cafe Interior Upgrade Shop Modal
 * File: src/components/CafeShopModal.tsx
 *
 * Docked side-drawer / bottom-sheet with an unblurred transparent 3D viewport
 * so players watch their newly bought siphon, Kinkaku phoenix, velvet stools,
 * gramophone, bookshelf, and wagashi showcase appear in 3D in real time!
 */

import React, { useEffect, useState } from 'react';
import { Coins, CheckCircle2, Sparkles, Store, X } from 'lucide-react';
import type { PlayerProfile } from '../types/srs';
import type { CafeUpgradeId } from '../types/three3d';
import {
  getAllCafeUpgrades,
  normalizeUnlockedUpgrades,
  canAffordCafeUpgrade,
  getCafeGameplayBuffs,
  purchaseCafeUpgrade,
} from '../game/cafeShopEngine';
import { gameEngine } from '../game/gameEngine';
import { playSound, unlockAudio } from '../audio/soundSynthesizer';
import { useGameState, useGameDispatch } from '../hooks/useGameState';

export interface CafeShopModalProps {
  isOpen?: boolean;
  profile?: PlayerProfile | null;
  coins?: number;
  unlockedUpgrades?: readonly string[];
  onPurchaseUpgrade?: (upgradeId: CafeUpgradeId) => void;
  onPurchase?: (upgradeId: CafeUpgradeId) => void;
  onBuyUpgrade?: (upgradeId: CafeUpgradeId) => void;
  onClose: () => void;
}

export const CafeShopModal: React.FC<CafeShopModalProps> = ({
  isOpen = true,
  profile,
  coins,
  unlockedUpgrades,
  onPurchaseUpgrade,
  onPurchase,
  onBuyUpgrade,
  onClose,
}) => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setToastMsg(null);
      return;
    }
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

  const resolvedProfile = profile ?? gameState.profile;
  const resolvedCoins =
    coins ?? resolvedProfile?.coins ?? gameState.coins ?? 0;
  const resolvedUnlocked = normalizeUnlockedUpgrades(
    unlockedUpgrades ??
      resolvedProfile?.unlockedUpgrades ??
      gameState.unlockedUpgrades ??
      []
  );
  const buffs = getCafeGameplayBuffs(resolvedUnlocked);
  const allUpgrades = getAllCafeUpgrades();

  const handleBuy = (upgradeId: CafeUpgradeId, nameKo: string) => {
    try {
      unlockAudio().catch(() => {});
    } catch {
      // Safe fallback
    }

    const purchaseCallback = onPurchaseUpgrade ?? onPurchase ?? onBuyUpgrade;
    if (purchaseCallback) {
      purchaseCallback(upgradeId);
      setToastMsg(`✨ 「${nameKo}」 설치 완료! 3D 카페를 확인해보세요!`);
      return;
    }

    // Dispatch engine action first; fall back to direct shop engine if standalone
    dispatch({ type: 'PURCHASE_UPGRADE', payload: { upgradeId } });
    const latestState = gameEngine.getState();
    const nowOwned = normalizeUnlockedUpgrades(
      latestState.profile?.unlockedUpgrades ?? latestState.unlockedUpgrades ?? []
    );

    if (nowOwned.includes(upgradeId)) {
      setToastMsg(`✨ 「${nameKo}」 설치 완료! 뒤쪽 3D 카페에 배치되었습니다!`);
      return;
    }

    // Standalone / unit-test fallback when gameEngine state wasn't seeded with prop profile
    if (resolvedProfile) {
      const result = purchaseCafeUpgrade(resolvedProfile, upgradeId);
      if (result.success) {
        try {
          playSound('fanfare');
        } catch {
          // Ignore audio error in headless env
        }
        dispatch({ type: 'UPDATE_PROFILE', payload: result.profile });
        setToastMsg(`✨ 「${nameKo}」 설치 완료! 뒤쪽 3D 카페에 배치되었습니다!`);
      } else if (result.error) {
        setToastMsg(result.error);
      }
    }
  };

  return (
    <div
      className="cafe-shop-modal"
      data-testid="cafe-shop-modal"
      role="dialog"
      aria-modal="true"
      aria-label="3D 카페 인테리어 상점"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="cafe-shop-drawer">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.75rem',
            borderBottom: '2px solid #e7dfd0',
            paddingBottom: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Store size={21} color="#92400e" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#141210' }}>
                3D 카페 인테리어 상점
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#2c2520', fontWeight: 700, marginTop: '0.2rem' }}>
              구매 즉시 왼쪽·뒤쪽 3D 살롱에 소품이 실시간으로 추가됩니다!
            </p>
          </div>

          <button
            type="button"
            data-testid="btn-close-shop"
            className="btn-ivory"
            style={{ padding: '0.4rem 0.75rem', flexShrink: 0 }}
            onClick={onClose}
          >
            <X size={16} />
            <span>닫기</span>
          </button>
        </div>

        {/* Coins & Active Buffs Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            background: '#fef3c7',
            border: '1.5px solid #d97706',
            borderRadius: 'var(--radius-md)',
            padding: '0.55rem 0.85rem',
          }}
        >
          <div
            data-testid="shop-coins"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 900,
              fontSize: '1.05rem',
              color: '#451a03',
            }}
          >
            <Coins size={18} color="#b45309" />
            <span>보유 엽전: {resolvedCoins} 銭</span>
          </div>

          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#5c2d0c' }}>
            인테리어 달성: {resolvedUnlocked.length} / {allUpgrades.length}종 · 최대 ❤️{buffs.maxHearts}
          </div>
        </div>

        {toastMsg && (
          <div
            data-testid="shop-toast"
            style={{
              background: '#ecfdf5',
              border: '1.5px solid #059669',
              color: '#064e3b',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.8rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 6 Upgrades List */}
        <div className="cafe-shop-list">
          {allUpgrades.map((upgrade) => {
            const isOwned = resolvedUnlocked.includes(upgrade.id);
            const canBuy = canAffordCafeUpgrade(
              resolvedCoins,
              upgrade.id,
              resolvedUnlocked
            );

            return (
              <div
                key={upgrade.id}
                data-testid={`shop-upgrade-card-${upgrade.id}`}
                className={`cafe-shop-item ${isOwned ? 'cafe-shop-item--owned' : ''}`.trim()}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '1.45rem' }} aria-hidden="true">
                      {upgrade.icon}
                    </span>
                    <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#141210' }}>
                      {upgrade.nameKo}
                    </strong>
                  </div>

                  <div style={{ marginTop: '0.3rem' }}>
                    <span className="pill-badge pill-badge--huneum" style={{ fontSize: '0.875rem' }}>
                      ⚡ {upgrade.effectKo}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#2c2520',
                      fontWeight: 600,
                      marginTop: '0.35rem',
                      lineHeight: 1.4,
                    }}
                  >
                    🪑 3D 효과: {upgrade.visualKo}
                  </p>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isOwned ? (
                    <button
                      type="button"
                      data-testid={`btn-buy-upgrade-${upgrade.id}`}
                      disabled
                      className="btn-emerald"
                      style={{ padding: '0.55rem 0.9rem', fontSize: '0.9rem', opacity: 0.95 }}
                    >
                      <CheckCircle2 size={16} />
                      <span>배치됨</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-testid={`btn-buy-upgrade-${upgrade.id}`}
                      disabled={!canBuy}
                      className={canBuy ? 'btn-gold' : 'btn-ivory'}
                      style={{
                        padding: '0.55rem 0.95rem',
                        fontSize: '0.9rem',
                        opacity: canBuy ? 1 : 0.6,
                      }}
                      onClick={() => handleBuy(upgrade.id, upgrade.nameKo)}
                    >
                      <span>{upgrade.cost} 銭 구매</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CafeShopModal;
