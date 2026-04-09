'use client';

import { useState, useEffect, useCallback, CSSProperties } from 'react';

/* ─── DATA ─── */
const CULTURES = [
  { id: 'fraises', emoji: '🍓', nom: 'Fraises de Vallon', nomCourt: 'Fraises', desc: 'Petites baies sucrées du vallon, elles poussent vite et rapportent honnêtement.', cout: 8, temps: 2, gain: 28, saison: 'Printemps/Été', dispo: true },
  { id: 'tournesols', emoji: '🌻', nom: 'Tournesols de Place', nomCourt: 'Tournesols', desc: 'Grands et lumineux, ils tournent toujours face à la Source. Personne ne sait pourquoi.', cout: 12, temps: 4, gain: 42, saison: 'Été', dispo: true },
  { id: 'champignons', emoji: '🍄', nom: 'Champignons de Cave', nomCourt: 'Champignons', desc: 'Cultivés dans l\'obscurité, ils brillent faiblement la nuit. Un effet de la Source, dit-on.', cout: 20, temps: 8, gain: 72, saison: 'Automne', dispo: true },
  { id: 'herbes', emoji: '🌿', nom: 'Herbes de Source', nomCourt: 'Herbes', desc: 'Herbes aromatiques imprégnées par l\'eau dorée. Leur parfum est... indescriptible.', cout: 30, temps: 12, gain: 108, saison: 'Toute saison', dispo: true },
  { id: 'courges', emoji: '🎃', nom: 'Courges de Novembre', nomCourt: 'Courges', desc: 'Elles n\'apparaissent qu\'en automne. Certaines portent des motifs qu\'on jurerait être des visages.', cout: 18, temps: 6, gain: 65, saison: 'Automne', dispo: false },
  { id: 'myrtilles', emoji: '🫐', nom: 'Myrtilles du Vallon', nomCourt: 'Myrtilles', desc: 'Minuscules et d\'un bleu profond. Le jus tache les doigts pendant des jours.', cout: 35, temps: 16, gain: 130, saison: 'Été', dispo: false },
];

const CULTURE_IMAGES: Record<string, string> = {
  fraises:     '/assets/garden/fraises.png',
  tournesols:  '/assets/garden/tournesol.png',
  champignons: '/assets/garden/champignons.png',
  herbes:      '/assets/garden/herbes.png',
  courges:     '/assets/garden/courge.png',
  myrtilles:   '/assets/garden/myrtilles.png',
};

interface Parcelle {
  id: number;
  etat: 'empty' | 'growing' | 'ready' | 'locked';
  culture: string | null;
  planteeLe: Date | null;
}

const makeParcelles = (): Parcelle[] => [
  { id: 1, etat: 'ready',   culture: 'fraises',     planteeLe: null },
  { id: 2, etat: 'growing', culture: 'champignons', planteeLe: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 3, etat: 'empty',   culture: null,          planteeLe: null },
  { id: 4, etat: 'locked',  culture: null,          planteeLe: null },
  { id: 5, etat: 'locked',  culture: null,          planteeLe: null },
  { id: 6, etat: 'locked',  culture: null,          planteeLe: null },
  { id: 7, etat: 'locked',  culture: null,          planteeLe: null },
  { id: 8, etat: 'locked',  culture: null,          planteeLe: null },
  { id: 9, etat: 'locked',  culture: null,          planteeLe: null },
];

function getCulture(id: string | null) {
  return CULTURES.find((c) => c.id === id) ?? null;
}

function getSecondesRestantes(parcelle: Parcelle) {
  const culture = getCulture(parcelle.culture);
  if (!culture || !parcelle.planteeLe) return 0;
  const elapsedSec = (Date.now() - parcelle.planteeLe.getTime()) / 1000;
  const totalSec = culture.temps * 3600;
  return Math.max(totalSec - elapsedSec, 0);
}

function formatTimer(sec: number) {
  if (sec <= 0) return '0s';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDureeShort(h: number) {
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h >= 24) return `${Math.floor(h / 24)}d`;
  return `${h}h`;
}

/* ─── PAGE ─── */
export default function JardinPage() {
  const [parcelles, setParcelles] = useState<Parcelle[]>(makeParcelles);
  const [planterPour, setPlanterPour] = useState<number | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [recolteAnim, setRecolteAnim] = useState<{ id: number; gain: number } | null>(null);
  const [justHarvested, setJustHarvested] = useState<Set<number>>(new Set());
  const [, setTick] = useState(0);

  // tick every 1s for live timer + auto ready
  useEffect(() => {
    const iv = setInterval(() => {
      setTick((t) => t + 1);
      setParcelles((prev) => {
        let changed = false;
        const next = prev.map((p) => {
          if (p.etat !== 'growing') return p;
          if (getSecondesRestantes(p) <= 0) {
            changed = true;
            return { ...p, etat: 'ready' as const };
          }
          return p;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const handlePlanter = useCallback((parcelleId: number, cultureId: string) => {
    setParcelles((prev) =>
      prev.map((p) =>
        p.id === parcelleId
          ? { ...p, etat: 'growing' as const, culture: cultureId, planteeLe: new Date() }
          : p,
      ),
    );
    setPlanterPour(null);
  }, []);

  const handleRecolter = useCallback((parcelleId: number) => {
    setParcelles((prev) => {
      const target = prev.find((x) => x.id === parcelleId);
      const culture = getCulture(target?.culture ?? null);
      if (culture) {
        setRecolteAnim({ id: parcelleId, gain: culture.gain });
        setTimeout(() => setRecolteAnim(null), 1200);
      }
      return prev.map((x) =>
        x.id === parcelleId
          ? { ...x, etat: 'empty' as const, culture: null, planteeLe: null }
          : x,
      );
    });
    setJustHarvested((prev) => new Set(prev).add(parcelleId));
    setTimeout(() => {
      setJustHarvested((prev) => {
        const next = new Set(prev);
        next.delete(parcelleId);
        return next;
      });
    }, 800);
  }, []);

  const handleArroser = useCallback((parcelleId: number) => {
    setParcelles((prev) =>
      prev.map((p) => {
        if (p.id !== parcelleId || !p.planteeLe) return p;
        const culture = getCulture(p.culture);
        if (!culture) return p;
        const boost = culture.temps * 0.2 * 60 * 60 * 1000;
        return { ...p, planteeLe: new Date(p.planteeLe.getTime() - boost) };
      }),
    );
  }, []);

  const handleParcelleClick = useCallback(
    (p: Parcelle) => {
      if (p.etat === 'empty') setPlanterPour(p.id);
      else if (p.etat === 'ready') handleRecolter(p.id);
    },
    [handleRecolter],
  );

  return (
    <div style={S.page}>
      {/* keyframes + global anim */}
      <style>{KEYFRAMES}</style>

      {/* ─── HEADER BANNIÈRE ─── */}
      <div style={S.banner}>
        <span style={{ fontSize: 16 }}>🌱</span>
        <span style={S.bannerTitle}>JARDIN</span>
        <span style={{ fontSize: 16 }}>🌱</span>
      </div>

      {/* ─── GRILLE 3×3 (avec décorations latérales) ─── */}
      <div style={S.gridWrap}>
        <div style={S.grid}>
          {parcelles.map((p) => (
            <ParcelleCell
              key={p.id}
              parcelle={p}
              onClick={() => handleParcelleClick(p)}
              recolteAnim={recolteAnim?.id === p.id ? recolteAnim.gain : null}
              justHarvested={justHarvested.has(p.id)}
            />
          ))}
        </div>

        {/* Décorations gauche */}
        <img
          src="/assets/garden/arrosoir.png"
          alt=""
          style={{
            position: 'absolute',
            left: -28,
            top: '30%',
            width: 32,
            height: 32,
            imageRendering: 'pixelated',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />
        <img
          src="/assets/garden/cailloux.png"
          alt=""
          style={{
            position: 'absolute',
            left: -20,
            bottom: '15%',
            width: 28,
            height: 28,
            imageRendering: 'pixelated',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        />

        {/* Décorations droite */}
        <img
          src="/assets/garden/ruche.png"
          alt=""
          style={{
            position: 'absolute',
            right: -28,
            top: '35%',
            width: 32,
            height: 32,
            imageRendering: 'pixelated',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />
        <img
          src="/assets/garden/pierre.png"
          alt=""
          style={{
            position: 'absolute',
            right: -16,
            bottom: '20%',
            width: 20,
            height: 20,
            imageRendering: 'pixelated',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ─── BARRE D'ACTIONS ─── */}
      <div style={S.actionBar}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <button style={S.agirBtn} onClick={() => setActionsOpen(true)}>
            AGIR SUR JARDIN
          </button>
          <span style={S.agirHint}>PLANTER · ARROSER · RÉCOLTER</span>
        </div>
        <button
          style={S.roundBtn}
          onClick={() => setActionsOpen(true)}
          aria-label="Arrosoir"
        >
          💧
        </button>
        <button
          style={S.roundBtn}
          onClick={() => setActionsOpen(true)}
          aria-label="Panier"
        >
          🧺
        </button>
      </div>

      {/* ─── MODALES ─── */}
      {planterPour !== null && (
        <PlanterSelector
          onSelect={(cultureId) => handlePlanter(planterPour, cultureId)}
          onClose={() => setPlanterPour(null)}
        />
      )}

      {actionsOpen && (
        <ActionsModal
          parcelles={parcelles}
          onClose={() => setActionsOpen(false)}
          onPlanter={(id) => {
            setActionsOpen(false);
            setPlanterPour(id);
          }}
          onArroser={(id) => handleArroser(id)}
          onRecolter={(id) => handleRecolter(id)}
        />
      )}
    </div>
  );
}

/* ─── PARCELLE CELL ─── */
function ParcelleCell({
  parcelle,
  onClick,
  recolteAnim,
  justHarvested,
}: {
  parcelle: Parcelle;
  onClick: () => void;
  recolteAnim: number | null;
  justHarvested: boolean;
}) {
  const culture = getCulture(parcelle.culture);
  const isReady = parcelle.etat === 'ready';
  const isLocked = parcelle.etat === 'locked';

  const cellStyle: CSSProperties = {
    ...S.parcelle,
    ...(isReady ? S.parcelleReady : {}),
    ...(isLocked ? S.parcelleLocked : {}),
    ...(justHarvested
      ? { borderColor: '#d4a017', transition: 'border-color 800ms ease-out' }
      : { transition: 'border-color 800ms ease-out' }),
    cursor: parcelle.etat === 'empty' || isReady ? 'pointer' : 'default',
  };

  return (
    <div style={cellStyle} onClick={isLocked ? undefined : onClick}>
      {/* Numéro (gland) */}
      <div style={S.parcelleNum}>
        <img
          src="/assets/garden/gland.png"
          alt=""
          draggable={false}
          style={{
            width: 16,
            height: 16,
            imageRendering: 'pixelated',
            pointerEvents: 'none',
            WebkitUserDrag: 'none',
          } as CSSProperties}
        />
        <span style={{ fontSize: 5, color: 'rgba(240,200,100,0.9)', fontFamily: fontPixel }}>
          {parcelle.id}
        </span>
      </div>

      {/* Récolte +X ✦ */}
      {recolteAnim !== null && (
        <span style={S.recolteFloat}>+{recolteAnim} ✦</span>
      )}

      {/* Étoiles si ready */}
      {isReady && (
        <>
          {[
            { top: '10%', left: '15%', delay: '0s', size: 12 },
            { top: '20%', right: '12%', delay: '0.5s', size: 10 },
            { bottom: '25%', left: '25%', delay: '1s', size: 14 },
          ].map((pos, i) => (
            <img
              key={i}
              src="/assets/garden/etoile.png"
              alt=""
              style={{
                position: 'absolute',
                ...pos,
                width: pos.size,
                height: pos.size,
                imageRendering: 'pixelated',
                animation: 'sparkle 1.5s ease-in-out infinite',
                animationDelay: pos.delay,
                pointerEvents: 'none',
              }}
            />
          ))}
        </>
      )}

      {/* Contenu central */}
      <div style={S.parcelleContent}>
        {parcelle.etat === 'empty' && <span style={S.emptyPlus}>+</span>}
        {parcelle.etat === 'locked' && <span style={S.lockIcon}>🔒</span>}
        {(parcelle.etat === 'growing' || parcelle.etat === 'ready') && culture && (
          CULTURE_IMAGES[culture.id] ? (
            <img
              src={CULTURE_IMAGES[culture.id]}
              alt={culture.nomCourt}
              draggable={false}
              style={{
                width: 'clamp(40px, 70%, 56px)',
                height: 'clamp(40px, 70%, 56px)',
                imageRendering: 'pixelated',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))',
                pointerEvents: 'none',
                WebkitUserDrag: 'none',
              } as CSSProperties}
            />
          ) : (
            <span style={S.cropEmoji}>{culture.emoji}</span>
          )
        )}
      </div>

      {/* Badge bas */}
      {parcelle.etat === 'growing' && (
        <span style={S.timerBadge}>{formatTimer(getSecondesRestantes(parcelle))}</span>
      )}
      {isReady && <span style={S.readyBadge}>PRÊTE !</span>}
    </div>
  );
}

/* ─── PLANTER SELECTOR (semences) ─── */
function PlanterSelector({
  onSelect,
  onClose,
}: {
  onSelect: (cultureId: string) => void;
  onClose: () => void;
}) {
  const available = CULTURES.filter((c) => c.dispo);

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalSheet} onClick={(e) => e.stopPropagation()}>
        <h3 style={S.modalTitle}>CHOISIR UNE SEMENCE</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {available.map((c) => (
            <button key={c.id} style={S.semenceRow} onClick={() => onSelect(c.id)}>
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={S.semenceNom}>{c.nomCourt}</div>
                <div style={S.semenceMeta}>
                  {formatDureeShort(c.temps)} · +{c.gain} ✦
                </div>
              </div>
              <span style={S.semenceCout}>{c.cout} ✦</span>
            </button>
          ))}
        </div>
        <button style={S.modalCancel} onClick={onClose}>
          ANNULER
        </button>
      </div>
    </div>
  );
}

/* ─── ACTIONS MODAL ─── */
function ActionsModal({
  parcelles,
  onClose,
  onPlanter,
  onArroser,
  onRecolter,
}: {
  parcelles: Parcelle[];
  onClose: () => void;
  onPlanter: (id: number) => void;
  onArroser: (id: number) => void;
  onRecolter: (id: number) => void;
}) {
  const actives = parcelles.filter((p) => p.etat !== 'locked');

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalSheet} onClick={(e) => e.stopPropagation()}>
        <h3 style={S.modalTitle}>AGIR SUR LE JARDIN</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {actives.map((p) => {
            const culture = getCulture(p.culture);
            const elapsedH = p.planteeLe
              ? (Date.now() - p.planteeLe.getTime()) / (1000 * 60 * 60)
              : 0;
            const canArroser = p.etat === 'growing' && elapsedH >= 1;

            return (
              <div key={p.id} style={S.actionRow}>
                <span style={S.actionRowNum}>#{p.id}</span>
                <span style={{ fontSize: 22, width: 28, textAlign: 'center' }}>
                  {p.etat === 'empty' ? '🟫' : culture?.emoji ?? ''}
                </span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={S.actionRowNom}>
                    {p.etat === 'empty'
                      ? 'Sol nu'
                      : culture?.nomCourt ?? '—'}
                  </div>
                  <div style={S.actionRowMeta}>
                    {p.etat === 'growing' && `${formatTimer(getSecondesRestantes(p))} restantes`}
                    {p.etat === 'ready' && culture && `+${culture.gain} ✦`}
                    {p.etat === 'empty' && 'Prête à planter'}
                  </div>
                </div>
                {p.etat === 'empty' && (
                  <button style={S.actionBtnGold} onClick={() => onPlanter(p.id)}>
                    PLANTER
                  </button>
                )}
                {p.etat === 'growing' && (
                  <button
                    style={{ ...S.actionBtnBlue, opacity: canArroser ? 1 : 0.4 }}
                    onClick={() => canArroser && onArroser(p.id)}
                    disabled={!canArroser}
                  >
                    ARROSER
                  </button>
                )}
                {p.etat === 'ready' && (
                  <button style={S.actionBtnGreen} onClick={() => onRecolter(p.id)}>
                    RÉCOLTER
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button style={S.modalCancel} onClick={onClose}>
          FERMER
        </button>
      </div>
    </div>
  );
}

/* ─── KEYFRAMES ─── */
const KEYFRAMES = `
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50%      { opacity: 1; transform: scale(1); }
}
@keyframes float-up {
  0%   { opacity: 0; transform: translate(-50%, 0); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -32px); }
}
@keyframes ready-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(212,160,23,0.4), 0 0 16px rgba(212,160,23,0.2); }
  50%      { box-shadow: 0 0 16px rgba(212,160,23,0.8), 0 0 32px rgba(212,160,23,0.4); }
}
`;

/* ─── STYLES ─── */
const fontPixel = "'Press Start 2P', monospace";

const S: Record<string, CSSProperties> = {
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background:
      'radial-gradient(ellipse at 50% 30%, #6b3a1f 0%, #3d1f0a 60%, #2a1408 100%)',
  },

  /* Header */
  banner: {
    background: 'linear-gradient(180deg, #f5e8c0 0%, #e8d5a0 100%)',
    border: '3px solid #3d2010',
    boxShadow: '0 0 0 5px #1a0d05, 0 0 0 7px #6b3d1e, 0 4px 12px rgba(0,0,0,0.5)',
    borderRadius: 8,
    margin: '10px 12px 8px',
    padding: '8px 16px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexShrink: 0,
  },
  bannerTitle: {
    fontFamily: fontPixel,
    fontSize: 12,
    color: '#3d2010',
    textShadow: '2px 2px 0 rgba(0,0,0,0.25)',
    letterSpacing: 1,
  },

  /* Grille */
  gridWrap: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    display: 'flex',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: 8,
    padding: '0 10px',
    flex: 1,
    minHeight: 0,
  },

  /* Parcelle */
  parcelle: {
    background: "url('/assets/garden/soil.png')",
    backgroundSize: '64px 64px',
    backgroundRepeat: 'repeat',
    imageRendering: 'pixelated',
    borderRadius: 8,
    border: '3px solid #2a1408',
    boxShadow:
      '0 0 0 1px #6b3d1e, inset 0 1px 0 rgba(180,120,60,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 0,
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    transition: 'border-color 800ms ease-out',
  },
  parcelleReady: {
    boxShadow: [
      '0 0 0 1px #6b3d1e',
      'inset 0 1px 0 rgba(180,120,60,0.3)',
      'inset 0 -2px 4px rgba(0,0,0,0.4)',
      '0 0 10px rgba(212,160,23,0.6)',
      '0 0 20px rgba(212,160,23,0.3)',
      '0 0 0 2px #d4a017',
    ].join(', '),
    animation: 'ready-pulse 2s ease-in-out infinite',
  },
  parcelleLocked: {
    background:
      'repeating-linear-gradient(0deg, transparent 0px, transparent 6px, rgba(0,0,0,0.25) 6px, rgba(0,0,0,0.3) 8px), linear-gradient(180deg, #3a2410 0%, #2a1808 100%)',
    opacity: 0.55,
  },

  parcelleNum: {
    position: 'absolute',
    top: 2,
    left: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    zIndex: 2,
  },

  parcelleContent: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },

  emptyPlus: {
    fontFamily: fontPixel,
    fontSize: 10,
    color: 'rgba(240,200,100,0.4)',
  },
  lockIcon: {
    fontSize: 'clamp(18px, 5vw, 26px)',
    filter: 'grayscale(0.3)',
    opacity: 0.85,
  },
  cropEmoji: {
    fontSize: 'clamp(24px, 6vw, 36px)',
    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))',
  },

  timerBadge: {
    position: 'absolute',
    bottom: 4,
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid #c8933a',
    borderRadius: 3,
    padding: '2px 5px',
    fontFamily: fontPixel,
    fontSize: 5,
    color: '#f0c040',
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
  },
  readyBadge: {
    position: 'absolute',
    bottom: 4,
    background: '#4a6a2a',
    border: '1px solid #7ab83a',
    borderRadius: 3,
    padding: '2px 6px',
    fontFamily: fontPixel,
    fontSize: 5,
    color: '#e8ffd0',
    letterSpacing: 0.5,
    textShadow: '0 1px 0 rgba(0,0,0,0.5)',
  },

  spark: {
    position: 'absolute',
    width: 4,
    height: 4,
    background: '#f0c040',
    borderRadius: '50%',
    boxShadow: '0 0 4px #f0c040',
    animation: 'sparkle 1.5s ease-in-out infinite',
    pointerEvents: 'none',
  },

  recolteFloat: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    fontFamily: fontPixel,
    fontSize: 10,
    color: '#f0c040',
    textShadow: '0 1px 0 #2a1408, 0 0 6px rgba(240,192,64,0.8)',
    animation: 'float-up 1.2s ease-out forwards',
    pointerEvents: 'none',
    zIndex: 5,
    whiteSpace: 'nowrap',
  },

  /* Action bar */
  actionBar: {
    padding: '8px 12px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  agirBtn: {
    width: '100%',
    background: 'linear-gradient(180deg, #f0c040 0%, #d4a017 50%, #b88010 100%)',
    border: '3px solid #2a1408',
    boxShadow: '0 0 0 2px #d4a017, 0 3px 0 #6a5000, 0 5px 8px rgba(0,0,0,0.4)',
    borderRadius: 6,
    padding: '10px 8px',
    fontFamily: fontPixel,
    fontSize: 9,
    color: '#2a1408',
    textShadow: '0 1px 0 rgba(255,220,80,0.5)',
    cursor: 'pointer',
    letterSpacing: 0.5,
  },
  agirHint: {
    fontFamily: fontPixel,
    fontSize: 5,
    color: 'rgba(240,200,100,0.5)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #c8933a 0%, #8b5a20 100%)',
    border: '2px solid #2a1408',
    boxShadow: '0 0 0 2px #c8933a, 0 2px 0 #4a2808',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  /* Modal */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(2px)',
  },
  modalSheet: {
    width: '100%',
    maxWidth: 480,
    background: 'linear-gradient(180deg, #f5e8c0 0%, #e8d5a0 100%)',
    border: '3px solid #3d2010',
    borderBottom: 'none',
    boxShadow: '0 0 0 5px #1a0d05, 0 0 0 7px #6b3d1e, 0 -8px 24px rgba(0,0,0,0.6)',
    borderRadius: '12px 12px 0 0',
    padding: 16,
    paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
  },
  modalTitle: {
    fontFamily: fontPixel,
    fontSize: 10,
    color: '#3d2010',
    textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },

  semenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    background: 'linear-gradient(180deg, #fff5d8 0%, #f0e2b0 100%)',
    border: '2px solid #6b3d1e',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: '0 2px 0 #3d2010',
  },
  semenceNom: {
    fontFamily: fontPixel,
    fontSize: 8,
    color: '#3d2010',
    marginBottom: 3,
  },
  semenceMeta: {
    fontFamily: fontPixel,
    fontSize: 6,
    color: '#6b4a20',
  },
  semenceCout: {
    fontFamily: fontPixel,
    fontSize: 8,
    color: '#b88010',
  },

  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    background: 'linear-gradient(180deg, #fff5d8 0%, #f0e2b0 100%)',
    border: '2px solid #6b3d1e',
    borderRadius: 6,
    boxShadow: '0 2px 0 #3d2010',
  },
  actionRowNum: {
    fontFamily: fontPixel,
    fontSize: 6,
    color: '#8B5E2A',
    width: 16,
  },
  actionRowNom: {
    fontFamily: fontPixel,
    fontSize: 7,
    color: '#3d2010',
    marginBottom: 3,
  },
  actionRowMeta: {
    fontFamily: fontPixel,
    fontSize: 5,
    color: '#6b4a20',
  },
  actionBtnGold: {
    fontFamily: fontPixel,
    fontSize: 7,
    padding: '6px 8px',
    background: 'linear-gradient(180deg, #f0c040 0%, #b88010 100%)',
    border: '2px solid #2a1408',
    borderRadius: 4,
    color: '#2a1408',
    cursor: 'pointer',
    boxShadow: '0 2px 0 #6a5000',
  },
  actionBtnBlue: {
    fontFamily: fontPixel,
    fontSize: 7,
    padding: '6px 8px',
    background: 'linear-gradient(180deg, #5aa0d0 0%, #2a6090 100%)',
    border: '2px solid #2a1408',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 0 #103040',
  },
  actionBtnGreen: {
    fontFamily: fontPixel,
    fontSize: 7,
    padding: '6px 8px',
    background: 'linear-gradient(180deg, #7ab83a 0%, #4a6a2a 100%)',
    border: '2px solid #2a1408',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 0 #2a4010',
  },
  modalCancel: {
    width: '100%',
    marginTop: 12,
    padding: 10,
    background: 'linear-gradient(180deg, #6b3d1e 0%, #3d2010 100%)',
    border: '2px solid #1a0d05',
    borderRadius: 6,
    fontFamily: fontPixel,
    fontSize: 8,
    color: '#f5e8c0',
    cursor: 'pointer',
    boxShadow: '0 2px 0 #1a0d05',
  },
};
