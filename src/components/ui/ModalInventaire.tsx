'use client';

import { useState } from 'react';

/* ─── DATA ─── */
interface ObjetInventaire {
  id: string;
  emoji: string;
  nom: string;
  quantite: number;
  description: string;
}

const INVENTAIRE_DEMO: ObjetInventaire[] = [
  { id: 'arrosoir', emoji: '🚿', nom: 'Arrosoir en cuivre', quantite: 1, description: '-20% sur toutes les cultures' },
  { id: 'filet', emoji: '🥅', nom: 'Filet à papillons', quantite: 1, description: 'Débloque événements Ziggy' },
  { id: 'eclats_source', emoji: '✦', nom: 'Éclat de Source (fragment)', quantite: 3, description: 'Trouvé au bord de la fontaine' },
];

const GRID_SLOTS = 9; // 3×3

/* ─── COMPONENT ─── */
export default function ModalInventaire({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<ObjetInventaire | null>(null);

  if (!open) return null;

  const emptySlots = GRID_SLOTS - INVENTAIRE_DEMO.length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={() => { setSelected(null); onClose(); }}
      />

      {/* Panel slide-up */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          maxHeight: '70vh',
          background: 'var(--app-bg-dark)',
          borderTop: '3px solid var(--btn-gold-border)',
          animation: 'slide-up 300ms ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 20 }}>🎒</span>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: 'var(--nav-active)' }}>
              INVENTAIRE
            </span>
          </div>
          <button
            onClick={() => { setSelected(null); onClose(); }}
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 10,
              color: 'var(--nav-inactive)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {INVENTAIRE_DEMO.map((obj) => (
              <button
                key={obj.id}
                className="pixel-card flex flex-col items-center justify-center p-2"
                style={{ minHeight: 90, cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setSelected(obj); }}
              >
                <span style={{ fontSize: 28, marginBottom: 4 }}>
                  {obj.emoji}
                </span>
                <span style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 6,
                  color: 'var(--btn-gold-text)',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  marginBottom: 2,
                }}>
                  {obj.nom}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  color: '#8B5E2A',
                }}>
                  ×{obj.quantite}
                </span>
              </button>
            ))}
            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center"
                style={{
                  minHeight: 90,
                  background: 'rgba(0,0,0,0.2)',
                  border: '2px dashed rgba(255,255,255,0.1)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 24,
                  color: 'rgba(255,255,255,0.15)',
                }}>
                  +
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail popup */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="pixel-card p-5 w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: 36 }}>{selected.emoji}</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--btn-gold-text)', lineHeight: '1.5', marginBottom: 2 }}>
                  {selected.nom}
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#8B5E2A' }}>
                  Quantité : {selected.quantite}
                </span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#5a3a10', lineHeight: 1.5, marginBottom: 16 }}>
              {selected.description}
            </p>
            <div className="flex gap-2">
              <button
                className="app-btn flex-1"
                disabled
                style={{ opacity: 0.4, fontSize: 8 }}
              >
                UTILISER
              </button>
              <button
                className="app-btn flex-1"
                style={{ fontSize: 8, background: 'var(--card-border)' }}
                onClick={() => setSelected(null)}
              >
                FERMER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
