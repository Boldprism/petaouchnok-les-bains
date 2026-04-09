'use client';

import { useState, useEffect, useCallback } from 'react';

/* ─── DATA ─── */
const CULTURES = [
  { id: 'fraises', emoji: '🍓', nom: 'Fraises de Vallon', nomCourt: 'Fraises', desc: 'Petites baies sucrées du vallon, elles poussent vite et rapportent honnêtement.', cout: 8, temps: 2, gain: 28, saison: 'Printemps/Été', dispo: true },
  { id: 'tournesols', emoji: '🌻', nom: 'Tournesols de Place', nomCourt: 'Tournesols', desc: 'Grands et lumineux, ils tournent toujours face à la Source. Personne ne sait pourquoi.', cout: 12, temps: 4, gain: 42, saison: 'Été', dispo: true },
  { id: 'champignons', emoji: '🍄', nom: 'Champignons de Cave', nomCourt: 'Champignons', desc: 'Cultivés dans l\'obscurité, ils brillent faiblement la nuit. Un effet de la Source, dit-on.', cout: 20, temps: 8, gain: 72, saison: 'Automne', dispo: true },
  { id: 'herbes', emoji: '🌿', nom: 'Herbes de Source', nomCourt: 'Herbes', desc: 'Herbes aromatiques imprégnées par l\'eau dorée. Leur parfum est... indescriptible.', cout: 30, temps: 12, gain: 108, saison: 'Toute saison', dispo: true },
  { id: 'courges', emoji: '🎃', nom: 'Courges de Novembre', nomCourt: 'Courges', desc: 'Elles n\'apparaissent qu\'en automne. Certaines portent des motifs qu\'on jurerait être des visages.', cout: 18, temps: 6, gain: 65, saison: 'Automne', dispo: false },
  { id: 'myrtilles', emoji: '🫐', nom: 'Myrtilles du Vallon', nomCourt: 'Myrtilles', desc: 'Minuscules et d\'un bleu profond. Le jus tache les doigts pendant des jours.', cout: 35, temps: 16, gain: 130, saison: 'Été', dispo: false },
];

interface Parcelle {
  id: number;
  nom: string;
  etat: 'empty' | 'growing' | 'ready';
  culture: string | null;
  planteeLe: Date | null;
}

const makeParcelles = (): Parcelle[] => [
  { id: 1, nom: 'Parcelle du Matin', etat: 'ready', culture: 'fraises', planteeLe: null },
  { id: 2, nom: 'Parcelle de Midi', etat: 'growing', culture: 'champignons', planteeLe: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 3, nom: 'Parcelle du Soir', etat: 'empty', culture: null, planteeLe: null },
];

function getCulture(id: string | null) {
  return CULTURES.find((c) => c.id === id) ?? null;
}

function formatDuree(h: number) {
  if (h < 1) return `${Math.round(h * 60)}min`;
  return `${h}h`;
}

function getProgress(parcelle: Parcelle) {
  const culture = getCulture(parcelle.culture);
  if (!culture || !parcelle.planteeLe) return 0;
  const elapsed = (Date.now() - parcelle.planteeLe.getTime()) / (1000 * 60 * 60);
  return Math.min(elapsed / culture.temps, 1);
}

function getHeuresRestantes(parcelle: Parcelle) {
  const culture = getCulture(parcelle.culture);
  if (!culture || !parcelle.planteeLe) return 0;
  const elapsed = (Date.now() - parcelle.planteeLe.getTime()) / (1000 * 60 * 60);
  return Math.max(culture.temps - elapsed, 0);
}

/* ─── PAGE ─── */
export default function JardinPage() {
  const [tab, setTab] = useState<'parcelles' | 'semences'>('parcelles');
  const [parcelles, setParcelles] = useState<Parcelle[]>(makeParcelles);
  const [detailCulture, setDetailCulture] = useState<string | null>(null);
  const [planterPour, setPlanterPour] = useState<number | null>(null); // parcelle id
  const [recolteAnim, setRecolteAnim] = useState<{ id: number; gain: number } | null>(null);
  const [, setTick] = useState(0);

  // tick every 10s to update progress bars + check if growing parcelles are ready
  useEffect(() => {
    const iv = setInterval(() => {
      setTick((t) => t + 1);
      setParcelles((prev) => {
        let changed = false;
        const next = prev.map((p) => {
          if (p.etat !== 'growing') return p;
          if (getProgress(p) >= 1) { changed = true; return { ...p, etat: 'ready' as const }; }
          return p;
        });
        return changed ? next : prev;
      });
    }, 10_000);
    return () => clearInterval(iv);
  }, []);

  const occupees = parcelles.filter((p) => p.etat !== 'empty').length;

  const handlePlanter = useCallback((parcelleId: number, cultureId: string) => {
    setParcelles((prev) =>
      prev.map((p) =>
        p.id === parcelleId
          ? { ...p, etat: 'growing' as const, culture: cultureId, planteeLe: new Date() }
          : p,
      ),
    );
    setPlanterPour(null);
    setDetailCulture(null);
  }, []);

  const handleRecolter = useCallback((parcelleId: number) => {
    const p = parcelles.find((x) => x.id === parcelleId);
    const culture = getCulture(p?.culture ?? null);
    if (culture) {
      setRecolteAnim({ id: parcelleId, gain: culture.gain });
      setTimeout(() => setRecolteAnim(null), 1200);
    }
    setParcelles((prev) =>
      prev.map((x) =>
        x.id === parcelleId
          ? { ...x, etat: 'empty' as const, culture: null, planteeLe: null }
          : x,
      ),
    );
  }, [parcelles]);

  const handleArroser = useCallback((parcelleId: number) => {
    setParcelles((prev) =>
      prev.map((p) => {
        if (p.id !== parcelleId || !p.planteeLe) return p;
        const culture = getCulture(p.culture);
        if (!culture) return p;
        // advance by 20% of total time
        const boost = culture.temps * 0.2 * 60 * 60 * 1000;
        return { ...p, planteeLe: new Date(p.planteeLe.getTime() - boost) };
      }),
    );
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto">

      {/* Header sticky */}
      <div
        className="sticky top-0 z-20 px-4 pt-3 pb-2"
        style={{ background: 'var(--app-bg-dark)' }}
      >
        <div className="flex items-baseline justify-between mb-2">
          <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--nav-active)' }}>
            JARDIN &amp; CULTURES
          </h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--hud-lore)' }}>
            Slots : {occupees}/3 occupés
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['parcelles', 'semences'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 8,
                padding: '6px 12px',
                letterSpacing: 0.5,
                background: tab === t ? 'var(--btn-gold-bg)' : 'rgba(0,0,0,0.3)',
                border: `2px solid ${tab === t ? 'var(--btn-gold-border)' : 'rgba(255,255,255,0.15)'}`,
                boxShadow: tab === t ? '2px 2px 0 var(--btn-gold-shadow)' : 'none',
                color: tab === t ? 'var(--btn-gold-text)' : 'var(--nav-inactive)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {t === 'parcelles' ? 'MES PARCELLES' : 'SEMENCES'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 pt-2">
        {tab === 'parcelles' ? (
          <div className="flex flex-col gap-3">
            {parcelles.map((p) => (
              <ParcelleCard
                key={p.id}
                parcelle={p}
                onPlanter={() => setPlanterPour(p.id)}
                onRecolter={() => handleRecolter(p.id)}
                onArroser={() => handleArroser(p.id)}
                recolteAnim={recolteAnim?.id === p.id ? recolteAnim.gain : null}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {CULTURES.map((c) => (
              <SemenceCard key={c.id} culture={c} onTap={() => setDetailCulture(c.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail popup */}
      {detailCulture && (
        <DetailPopup
          cultureId={detailCulture}
          parcelles={parcelles}
          onClose={() => setDetailCulture(null)}
          onPlanter={(parcelleId) => handlePlanter(parcelleId, detailCulture)}
        />
      )}

      {/* Planter selector (from parcelle) */}
      {planterPour !== null && (
        <PlanterSelector
          parcelleId={planterPour}
          onSelect={(cultureId) => handlePlanter(planterPour, cultureId)}
          onClose={() => setPlanterPour(null)}
        />
      )}
    </div>
  );
}

/* ─── PARCELLE CARD ─── */
function ParcelleCard({
  parcelle,
  onPlanter,
  onRecolter,
  onArroser,
  recolteAnim,
}: {
  parcelle: Parcelle;
  onPlanter: () => void;
  onRecolter: () => void;
  onArroser: () => void;
  recolteAnim: number | null;
}) {
  const culture = getCulture(parcelle.culture);

  if (parcelle.etat === 'empty') {
    return (
      <div
        className="pixel-card p-4"
        style={{ background: '#8B6914', borderColor: 'var(--card-border)' }}
      >
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--card-bg-light)', marginBottom: 12 }}>
          {parcelle.nom}
        </p>
        <div
          className="flex items-center justify-center"
          style={{ height: 48, background: 'rgba(0,0,0,0.15)', marginBottom: 12 }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'rgba(255,255,255,0.25)' }}>
            sol vide
          </span>
        </div>
        <button className="app-btn w-full" onClick={onPlanter}>
          + PLANTER
        </button>
      </div>
    );
  }

  if (parcelle.etat === 'growing') {
    const progress = getProgress(parcelle);
    const restant = getHeuresRestantes(parcelle);
    const elapsed = parcelle.planteeLe
      ? (Date.now() - parcelle.planteeLe.getTime()) / (1000 * 60 * 60)
      : 0;
    const canArroser = elapsed >= 1;

    return (
      <div className="pixel-card p-4">
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--card-border)', marginBottom: 8 }}>
          {parcelle.nom}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 28 }}>{culture?.emoji}</span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#2d1a08' }}>
            {culture?.nom}
          </span>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex-1"
            style={{ height: 12, background: '#5a3a10', border: '1px solid var(--card-border)' }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.round(progress * 100)}%`,
                background: 'var(--btn-gold-bg)',
                transition: 'width 1s linear',
              }}
            />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#5a3a10', whiteSpace: 'nowrap' }}>
            {restant < 1 ? `${Math.round(restant * 60)}min` : `${Math.round(restant)}h`} restantes
          </span>
        </div>
        <button
          className="app-btn w-full"
          onClick={onArroser}
          disabled={!canArroser}
          style={{ opacity: canArroser ? 1 : 0.4 }}
        >
          ARROSER → -20% temps
        </button>
      </div>
    );
  }

  // ready
  return (
    <div
      className="pixel-card p-4 relative"
      style={{
        animation: 'pulse-gold 2s ease-in-out infinite',
        boxShadow: '3px 3px 0 var(--card-shadow), 0 0 12px rgba(245,200,66,0.3)',
      }}
    >
      {/* Récolte animation */}
      {recolteAnim !== null && (
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 16,
            fontFamily: 'var(--font-pixel)',
            fontSize: 14,
            color: 'var(--hud-eclat)',
            animation: 'float-up 1.2s ease-out forwards',
            pointerEvents: 'none',
          }}
        >
          +{recolteAnim} ✦
        </span>
      )}
      <div className="flex items-baseline justify-between mb-2">
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--card-border)' }}>
          {parcelle.nom}
        </p>
        <span style={{ fontSize: 16 }}>✨</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: 28 }}>{culture?.emoji}</span>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#2d1a08' }}>
          {culture?.nom}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 8,
          color: 'var(--btn-gold-text)',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        PRÊTE À RÉCOLTER!
      </p>
      <button className="app-btn w-full" onClick={onRecolter}>
        RÉCOLTER → +{culture?.gain} ✦
      </button>
    </div>
  );
}

/* ─── SEMENCE CARD ─── */
function SemenceCard({ culture, onTap }: { culture: (typeof CULTURES)[number]; onTap: () => void }) {
  return (
    <button
      className="pixel-card relative flex flex-col items-center p-2"
      style={{ minHeight: 120, cursor: culture.dispo ? 'pointer' : 'default' }}
      onClick={culture.dispo ? onTap : undefined}
    >
      {!culture.dispo && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ background: 'rgba(90,58,16,0.7)' }}
        >
          <span style={{ fontSize: 28 }}>🔒</span>
        </div>
      )}
      <span style={{ fontSize: 32, marginBottom: 4 }}>{culture.emoji}</span>
      <span
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 8,
          color: '#2d1a08',
          textAlign: 'center',
          lineHeight: '1.5',
          marginBottom: 2,
        }}
      >
        {culture.nomCourt}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#5a3a10' }}>
        {formatDuree(culture.temps)}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--btn-gold-border)' }}>
        +{culture.gain} ✦
      </span>
      <span
        className="app-btn mt-auto"
        style={{ fontSize: 7, padding: '4px 8px' }}
      >
        {culture.cout} ✦
      </span>
    </button>
  );
}

/* ─── DETAIL POPUP ─── */
function DetailPopup({
  cultureId,
  parcelles,
  onClose,
  onPlanter,
}: {
  cultureId: string;
  parcelles: Parcelle[];
  onClose: () => void;
  onPlanter: (parcelleId: number) => void;
}) {
  const culture = getCulture(cultureId);
  if (!culture) return null;
  const videsCount = parcelles.filter((p) => p.etat === 'empty').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="pixel-card w-full max-w-md p-5 mb-0"
        style={{ borderBottom: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, color: 'var(--card-border)', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: 40 }}>{culture.emoji}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, color: '#2d1a08', marginBottom: 4 }}>
              {culture.nom}
            </h3>
            <span
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: 'var(--accent-mystere)', textTransform: 'uppercase' }}
            >
              {culture.saison}
            </span>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4a3520', lineHeight: 1.6, marginBottom: 12 }}>
          {culture.desc}
        </p>

        <div className="flex gap-4 mb-4">
          <div>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: '#8B5E2A' }}>TEMPS</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: '#2d1a08' }}>{formatDuree(culture.temps)}</p>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: '#8B5E2A' }}>GAIN</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--btn-gold-border)' }}>+{culture.gain} ✦</p>
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: '#8B5E2A' }}>COÛT</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: '#2d1a08' }}>{culture.cout} ✦</p>
          </div>
        </div>

        {videsCount > 0 ? (
          <div>
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, color: '#8B5E2A', marginBottom: 6 }}>
              CHOISIR UNE PARCELLE :
            </p>
            <div className="flex flex-col gap-2">
              {parcelles
                .filter((p) => p.etat === 'empty')
                .map((p) => (
                  <button
                    key={p.id}
                    className="app-btn w-full"
                    onClick={() => onPlanter(p.id)}
                  >
                    PLANTER → {p.nom}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#8B5E2A', textAlign: 'center', opacity: 0.7 }}>
            Aucune parcelle disponible
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── PLANTER SELECTOR ─── */
function PlanterSelector({
  parcelleId,
  onSelect,
  onClose,
}: {
  parcelleId: number;
  onSelect: (cultureId: string) => void;
  onClose: () => void;
}) {
  const available = CULTURES.filter((c) => c.dispo);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="pixel-card w-full max-w-md p-4 mb-0"
        style={{ borderBottom: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, color: '#2d1a08', marginBottom: 12 }}>
          CHOISIR UNE SEMENCE
        </h3>
        <div className="flex flex-col gap-2">
          {available.map((c) => (
            <button
              key={c.id}
              className="pixel-card flex items-center gap-3 p-3"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(c.id)}
            >
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <div className="flex-1 text-left">
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: '#2d1a08' }}>
                  {c.nomCourt}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#5a3a10', marginLeft: 8 }}>
                  {formatDuree(c.temps)} → +{c.gain} ✦
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--btn-gold-border)' }}>
                {c.cout} ✦
              </span>
            </button>
          ))}
        </div>
        <button
          className="app-btn w-full mt-3"
          style={{ background: 'var(--card-border)' }}
          onClick={onClose}
        >
          ANNULER
        </button>
      </div>
    </div>
  );
}
