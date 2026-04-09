'use client';

/* ─── DATA ─── */
interface LigneHistorique {
  montant: number;
  description: string;
  heure: string;
}

const HISTORIQUE_DEMO: LigneHistorique[] = [
  { montant: +28,  description: 'Récolte Fraises',    heure: '14:32' },
  { montant: +60,  description: 'Éclat de Source',     heure: '11:05' },
  { montant: -15,  description: 'Engrais de Gaston',   heure: '9:47'  },
  { montant: +100, description: 'Connexion du jour',   heure: '9:01'  },
  { montant: +5,   description: 'Papillon attrapé',    heure: '8:14'  },
  { montant: -30,  description: 'Graine mystère',      heure: '7:50'  },
  { montant: +12,  description: 'Don de Fernand',      heure: '7:22'  },
];

const ECLATS_TOTAL = 245;

/* ─── COMPONENT ─── */
export default function ModalEclats({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Panel slide-up */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          height: '50vh',
          background: 'var(--app-bg-dark)',
          borderTop: '3px solid var(--btn-gold-border)',
          animation: 'slide-up 300ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16, color: 'var(--hud-eclat)' }}>✦</span>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: 'var(--nav-active)' }}>
              ÉCLATS DE SOURCE
            </span>
          </div>
          <button
            onClick={onClose}
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

        {/* Total */}
        <div className="flex items-center justify-center py-4 shrink-0">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 48,
              color: 'var(--hud-eclat)',
              textShadow: '0 0 12px rgba(255,215,0,0.4)',
            }}
          >
            ✦ {ECLATS_TOTAL}
          </span>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-2 px-4 shrink-0" style={{ marginBottom: 8 }}>
          <div className="flex-1" style={{ height: 1, background: 'var(--btn-gold-border)', opacity: 0.4 }} />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: 'var(--nav-active)', letterSpacing: 1 }}>
            HISTORIQUE
          </span>
          <div className="flex-1" style={{ height: 1, background: 'var(--btn-gold-border)', opacity: 0.4 }} />
        </div>

        {/* Historique list */}
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          <div className="flex flex-col gap-1">
            {HISTORIQUE_DEMO.map((ligne, i) => {
              const isPositif = ligne.montant > 0;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 px-3"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderLeft: `3px solid ${isPositif ? '#5cb85c' : '#d9534f'}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 18,
                        color: isPositif ? '#5cb85c' : '#d9534f',
                        minWidth: 48,
                      }}
                    >
                      {isPositif ? '+' : ''}{ligne.montant}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        color: 'var(--hud-text)',
                      }}
                    >
                      {ligne.description}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {ligne.heure}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Citation Fernand */}
        <div className="shrink-0 px-4 pb-4">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontStyle: 'italic',
              color: 'var(--hud-lore)',
              lineHeight: 1.5,
              textAlign: 'center',
              opacity: 0.7,
            }}
          >
            &laquo;&nbsp;Les Éclats brillent plus fort certains soirs.
            Les rumeurs à ce sujet sont sans fondement.&nbsp;&raquo; — Fernand
          </p>
        </div>
      </div>
    </>
  );
}
