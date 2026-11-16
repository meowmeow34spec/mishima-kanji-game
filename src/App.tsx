import React, { useState } from 'react';
import { Coffee, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [coins, setCoins] = useState(100);

  const handleCelebrate = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    setCoins((c) => c + 10);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-gold-burnished)', fontSize: '2.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          サロン三島
        </h1>
        <p style={{ color: 'var(--color-washi-dim)', letterSpacing: '0.12em', fontSize: '1.1rem' }}>
          Yukio Mishima Literary Kanji Learning Game
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: 'var(--border-gold)' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coffee size={22} color="var(--color-gold-burnished)" />
            <span style={{ fontSize: '1.15rem' }}>所持金: {coins} 銭</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={22} color="var(--color-crimson-bright)" />
            <span style={{ fontSize: '1.15rem' }}>連続: 1 日</span>
          </div>
        </div>

        <button
          onClick={handleCelebrate}
          style={{
            marginTop: '0.5rem',
            padding: '0.85rem 1.75rem',
            backgroundColor: 'var(--color-gold-burnished)',
            color: 'var(--color-lacquer-dark)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-gold)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={18} />
          <span>注文を給仕する (Serve Order)</span>
        </button>
      </main>
    </div>
  );
};

export default App;
