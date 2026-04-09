'use client';

import { useState, useEffect, useCallback } from 'react';

/* ─── DATA ─── */
interface ResultatPeche {
  id: string;
  label: string;
  probabilite: number;
  valeur: number;
  note: string;
  type: 'eclats' | 'fragment' | 'vide';
}

const RESULTATS_PECHE: ResultatPeche[] = [
  { id: 'poisson_ord', label: 'Poisson ordinaire', probabilite: 35, valeur: 15, note: "Un poisson qui n'écoutait pas", type: 'eclats' },
  { id: 'poisson_beau', label: 'Beau poisson', probabilite: 20, valeur: 35, note: "Celui-là savait des choses", type: 'eclats' },
  { id: 'poisson_rare', label: 'Poisson rare', probabilite: 10, valeur: 80, note: "Maurice refuse de le vendre, puis accepte", type: 'eclats' },
  { id: 'botte', label: 'Vieille botte', probabilite: 8, valeur: 2, note: "La rivière trie sur le volet", type: 'eclats' },
  { id: 'bouteille', label: 'Bouteille scellée', probabilite: 6, valeur: 0, note: "Fragment de lore", type: 'fragment' },
  { id: 'piece', label: 'Pièce ancienne', probabilite: 5, valeur: 120, note: "Frappée en 1743. Coïncidence.", type: 'eclats' },
  { id: 'objet_imp', label: 'Objet impossible', probabilite: 4, valeur: 0, note: "Fragment de lore majeur", type: 'fragment' },
  { id: 'eclat', label: 'Éclat de Source', probabilite: 4, valeur: 60, note: "La rivière rend ce qu'on lui confie", type: 'eclats' },
  { id: 'lettre_latin', label: 'Lettre en latin', probabilite: 3, valeur: 0, note: "Fragment F016 — signé A.P.", type: 'fragment' },
  { id: 'rien', label: 'Rien', probabilite: 5, valeur: 0, note: "Certains jours, la rivière réfléchit.", type: 'vide' },
];

const EMOJIS: Record<string, string> = {
  poisson_ord: '🐟', poisson_beau: '🐠', poisson_rare: '🐡',
  botte: '👢', bouteille: '🍾', piece: '🪙',
  objet_imp: '✨', eclat: '💎', lettre_latin: '📜', rien: '🌊',
};

const CITATIONS_ATTENTE = [
  "La patience est une vertu que les poissons apprécient.",
  "La rivière murmure des secrets à ceux qui attendent.",
  "Un bon pêcheur ne tire jamais trop tôt.",
  "L'eau est calme. C'est bon signe. Ou mauvais. C'est pareil.",
];

const LS_KEY = 'peche_start';
const LS_DURATION = 'peche_duration';
const LS_LAST = 'peche_last';

function pickResult(): ResultatPeche {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const r of RESULTATS_PECHE) {
    acc += r.probabilite;
    if (roll <= acc) return r;
  }
  return RESULTATS_PECHE[RESULTATS_PECHE.length - 1];
}

function randomDuration() {
  // 3h to 6h in ms
  return (3 + Math.random() * 3) * 60 * 60 * 1000;
}

/* ─── PAGE ─── */
export default function PechePage() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [lastResult, setLastResult] = useState<ResultatPeche | null>(null);
  const [revealState, setRevealState] = useState<'hidden' | 'flipping' | 'revealed'>('hidden');
  const [pendingResult, setPendingResult] = useState<ResultatPeche | null>(null);
  const [, setTick] = useState(0);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    const savedDur = localStorage.getItem(LS_DURATION);
    const savedLast = localStorage.getItem(LS_LAST);
    if (saved && savedDur) {
      setStartTime(Number(saved));
      setDuration(Number(savedDur));
    }
    if (savedLast) {
      try { setLastResult(JSON.parse(savedLast)); } catch { /* ignore */ }
    }
  }, []);

  // Tick every 5s
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(iv);
  }, []);

  const now = Date.now();
  const isActive = startTime !== null;
  const elapsed = isActive ? now - startTime : 0;
  const progress = isActive ? Math.min(elapsed / duration, 1) : 0;
  const isDone = isActive && progress >= 1;
  const remaining = isActive ? Math.max(duration - elapsed, 0) : 0;

  const formatRemaining = (ms: number) => {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
  };

  const handleEnvoyer = useCallback(() => {
    const dur = randomDuration();
    const start = Date.now();
    setStartTime(start);
    setDuration(dur);
    setRevealState('hidden');
    setPendingResult(null);
    localStorage.setItem(LS_KEY, String(start));
    localStorage.setItem(LS_DURATION, String(dur));
  }, []);

  const handleReveal = useCallback(() => {
    if (revealState === 'hidden') {
      const result = pickResult();
      setPendingResult(result);
      setRevealState('flipping');
      setTimeout(() => setRevealState('revealed'), 600);
    }
  }, [revealState]);

  const handleCollect = useCallback(() => {
    if (pendingResult) {
      setLastResult(pendingResult);
      localStorage.setItem(LS_LAST, JSON.stringify(pendingResult));
    }
    setStartTime(null);
    setDuration(0);
    setPendingResult(null);
    setRevealState('hidden');
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_DURATION);
  }, [pendingResult]);

  const citation = CITATIONS_ATTENTE[Math.floor((startTime ?? 0) / 1000) % CITATIONS_ATTENTE.length];

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto">

      {/* Header sticky */}
      <div className="sticky top-0 z-20 px-4 pt-3 pb-2" style={{ background: 'var(--app-bg-dark)' }}>
        <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--nav-active)' }}>
          PÊCHE AVEC MAURICE
        </h1>
      </div>

      <div className="flex-1 px-4 pb-4 pt-2 flex flex-col items-center">

        {/* ─── STATE: DONE — reveal ─── */}
        {isDone && (
          <div className="pixel-card p-5 w-full max-w-sm text-center">
            <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>🦭</span>
            <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: 'var(--btn-gold-text)', marginBottom: 16 }}>
              MAURICE EST DE RETOUR !
            </h2>

            {/* Reveal card */}
            <div style={{ perspective: 600, marginBottom: 16 }}>
              <div
                style={{
                  transition: 'transform 600ms ease-in-out',
                  transformStyle: 'preserve-3d',
                  transform: revealState === 'flipping' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {revealState === 'revealed' && pendingResult ? (
                  /* Revealed face */
                  <div
                    className="pixel-card p-4 relative"
                    style={{
                      background: pendingResult.type === 'fragment'
                        ? 'linear-gradient(135deg, #d8c0f0 0%, #e8d5f5 100%)'
                        : pendingResult.type === 'vide'
                          ? 'var(--card-bg-light)'
                          : 'linear-gradient(135deg, #f5e8a0 0%, #ffe070 100%)',
                    }}
                  >
                    {/* Sparkle for éclats */}
                    {pendingResult.type === 'eclats' && pendingResult.valeur > 30 && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              position: 'absolute',
                              left: `${15 + (i * 14)}%`,
                              top: `${10 + ((i * 17) % 60)}%`,
                              fontSize: 12,
                              animation: `float ${1.5 + i * 0.3}s ease-in-out infinite`,
                              opacity: 0.7,
                            }}
                          >
                            ✦
                          </span>
                        ))}
                      </div>
                    )}
                    <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>
                      {EMOJIS[pendingResult.id] ?? '❓'}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#2d1a08', marginBottom: 6 }}>
                      {pendingResult.label}
                    </h3>
                    {pendingResult.valeur > 0 && (
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--btn-gold-border)', marginBottom: 4 }}>
                        +{pendingResult.valeur} ✦
                      </p>
                    )}
                    {pendingResult.type === 'fragment' && (
                      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: 'var(--accent-mystere)', marginBottom: 4 }}>
                        📜 FRAGMENT DE LORE DÉCOUVERT
                      </p>
                    )}
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5a3a10', fontStyle: 'italic', marginTop: 8 }}>
                      &laquo;&nbsp;{pendingResult.note}&nbsp;&raquo;
                    </p>
                  </div>
                ) : (
                  /* Hidden face */
                  <button
                    className="pixel-card p-6 w-full"
                    style={{
                      cursor: 'pointer',
                      background: 'var(--app-bg-dark)',
                      borderColor: 'var(--btn-gold-border)',
                    }}
                    onClick={handleReveal}
                  >
                    <span style={{
                      fontSize: 48,
                      display: 'block',
                      marginBottom: 8,
                      animation: 'pulse-gold 2s ease-in-out infinite',
                    }}>
                      ❓
                    </span>
                    <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--nav-active)' }}>
                      TAPER POUR RÉVÉLER
                    </p>
                  </button>
                )}
              </div>
            </div>

            {revealState === 'revealed' && (
              <button className="app-btn w-full" onClick={handleCollect}>
                RÉCUPÉRER ET CONTINUER
              </button>
            )}
          </div>
        )}

        {/* ─── STATE: FISHING — in progress ─── */}
        {isActive && !isDone && (
          <div className="pixel-card p-5 w-full max-w-sm text-center">
            <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>🦭</span>
            <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: 'var(--btn-gold-text)', marginBottom: 16 }}>
              MAURICE PÊCHE...
            </h2>

            {/* Fishing line animation */}
            <div style={{ height: 60, position: 'relative', marginBottom: 16 }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                width: 2,
                height: 40,
                background: 'var(--card-border)',
              }} />
              <span style={{
                position: 'absolute',
                left: '50%',
                top: 36,
                transform: 'translateX(-50%)',
                fontSize: 20,
                animation: 'bob 2s ease-in-out infinite',
              }}>
                🎣
              </span>
            </div>

            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: '#8B5E2A', marginBottom: 8 }}>
              RETOUR ESTIMÉ DANS :
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1" style={{ height: 12, background: '#5a3a10', border: '1px solid var(--card-border)' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round(progress * 100)}%`,
                  background: 'var(--btn-gold-bg)',
                  transition: 'width 5s linear',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#5a3a10', whiteSpace: 'nowrap' }}>
                {formatRemaining(remaining)}
              </span>
            </div>

            {/* Citation */}
            <div style={{ borderTop: '1px solid rgba(139,94,42,0.2)', paddingTop: 12 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#5a3a10', fontStyle: 'italic', lineHeight: 1.5 }}>
                &laquo;&nbsp;{citation}&nbsp;&raquo;
              </p>
              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 6, color: '#8B5E2A', marginTop: 4 }}>
                — MAURICE PLONGEUR
              </p>
            </div>
          </div>
        )}

        {/* ─── STATE: IDLE — ready to fish ─── */}
        {!isActive && (
          <div className="w-full max-w-sm">
            <div className="pixel-card p-5 text-center mb-4">
              <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>🦭</span>
              <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: 'var(--btn-gold-text)', marginBottom: 12 }}>
                PÊCHE AVEC MAURICE
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#5a3a10', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 16 }}>
                &laquo;&nbsp;La rivière est calme ce matin. On tente notre chance ?&nbsp;&raquo;
              </p>

              <div className="flex justify-between mb-4 px-4">
                <div>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 6, color: '#8B5E2A' }}>DURÉE</span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#2d1a08' }}>3h à 6h</p>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 6, color: '#8B5E2A' }}>COÛT</span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--vert-fonce)' }}>Gratuit</p>
                </div>
              </div>

              <button className="app-btn w-full" onClick={handleEnvoyer}>
                🎣 ENVOYER MAURICE
              </button>
            </div>

            {/* Last result */}
            {lastResult && (
              <div className="pixel-card p-4">
                <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: '#8B5E2A', marginBottom: 8 }}>
                  DERNIÈRE PRISE
                </p>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 28 }}>{EMOJIS[lastResult.id] ?? '❓'}</span>
                  <div className="flex-1">
                    <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--btn-gold-text)', marginBottom: 2 }}>
                      {lastResult.label}
                    </h4>
                    {lastResult.valeur > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--btn-gold-border)' }}>
                        +{lastResult.valeur} ✦
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#5a3a10', fontStyle: 'italic', marginTop: 6 }}>
                  &laquo;&nbsp;{lastResult.note}&nbsp;&raquo;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
