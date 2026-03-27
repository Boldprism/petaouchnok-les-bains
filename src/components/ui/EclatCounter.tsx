'use client';

import { useState, useEffect } from 'react';

export default function EclatCounter() {
  const [eclats, setEclats] = useState(100);
  const [bonus, setBonus] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<{ amount: number }>) => {
      const amount = e.detail.amount;
      setEclats((prev) => prev + amount);
      setBonus(amount);
      setTimeout(() => setBonus(null), 1200);
    };
    window.addEventListener('eclat-gain' as string, handler as EventListener);
    return () => window.removeEventListener('eclat-gain' as string, handler as EventListener);
  }, []);

  return (
    <div
      className="bg-bg-sombre/80 backdrop-blur-sm border border-accent-or/30 px-4 py-2 flex items-center gap-2 relative"
      style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
    >
      <span className="text-accent-or text-lg animate-[pulse-gold_3s_ease-in-out_infinite]">✦</span>
      <span
        className="text-eclat-or text-xl"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {eclats.toLocaleString('fr-FR')}
      </span>

      {/* Bonus popup */}
      {bonus !== null && (
        <span
          className="absolute -top-6 right-0 text-eclat-lueur animate-[float_1s_ease-out_forwards]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}
        >
          +{bonus}
        </span>
      )}
    </div>
  );
}
