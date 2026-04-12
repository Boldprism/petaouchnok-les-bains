'use client';

import { useRouter } from 'next/navigation';
import { CSSProperties } from 'react';

/* ─── DATA ─── */
const COMMERCES = [
  { id: 'noisette', nom: 'ÉPICERIE GRIGNOTIER', perso: 'Noisette 🐿️',
    citation: '"On n\'est jamais trop préparé..."', emoji: '🛒' },
  { id: 'gaston',   nom: 'BOULANGERIE MIELLEUX', perso: 'Gaston 🐻',
    citation: '"Un bon pain, c\'est une journée sauvée..."', emoji: '🥐' },
  { id: 'madeleine', nom: 'BIBLIOTHÈQUE', perso: 'Madeleine 🦔',
    citation: '"Je range dans un ordre que l\'univers comprend..."', emoji: '📚' },
];

const NPC_SPRITES: Record<string, string> = {
  noisette:  '/assets/commerces/noisette.png',
  gaston:    '/assets/commerces/gaston.png',
  madeleine: '/assets/commerces/madeleine.png',
};

const fontPixel = "'Press Start 2P', monospace";

/* ─── STYLES ─── */
const S: Record<string, CSSProperties> = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    background: '#3d2010',
  },
  banner: {
    background: 'linear-gradient(180deg, #f5e8c0 0%, #e8d5a0 100%)',
    border: '3px solid #3d2010',
    boxShadow: '0 0 0 5px #1a0d05, 0 0 0 7px #6b3d1e',
    borderRadius: 8,
    margin: '10px 12px',
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
    fontSize: 11,
    color: '#3d2010',
    textShadow: '2px 2px 0 rgba(0,0,0,0.25)',
    letterSpacing: 1,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    borderBottom: '2px solid #2a1408',
    cursor: 'pointer',
  },
  avatar: {
    width: 44,
    height: 44,
    flexShrink: 0,
    background: '#8b5a2b',
    border: '2px solid #c8933a',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
  },
  nom: {
    fontFamily: fontPixel,
    fontSize: 7,
    color: '#f0c040',
    lineHeight: 1.6,
  },
  perso: {
    fontFamily: "'Lora', serif",
    fontStyle: 'italic',
    fontSize: 11,
    color: '#c8b078',
  },
  citation: {
    fontFamily: "'Lora', serif",
    fontStyle: 'italic',
    fontSize: 10,
    color: 'rgba(200,176,120,0.7)',
    marginTop: 1,
  },
  arrow: {
    fontFamily: fontPixel,
    fontSize: 10,
    color: '#c8933a',
    flexShrink: 0,
  },
};

/* ─── PAGE ─── */
export default function CommercesPage() {
  const router = useRouter();

  return (
    <div style={S.page}>
      {/* Bannière */}
      <div style={S.banner}>
        <span style={{ fontSize: 16 }}>🛒</span>
        <span style={S.bannerTitle}>COMMERCES</span>
        <span style={{ fontSize: 16 }}>🛒</span>
      </div>

      {/* Liste des commerces */}
      {COMMERCES.map((c, i) => (
        <div
          key={c.id}
          style={{
            ...S.row,
            background: i % 2 === 0 ? '#5a3010' : '#4a2808',
          }}
          onClick={() => router.push(`/commerces/${c.id}`)}
        >
          <div style={S.avatar}>
            <img
              src={NPC_SPRITES[c.id]}
              alt={c.perso}
              style={{
                height: 44,
                width: 'auto',
                imageRendering: 'pixelated',
                filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.4))',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={S.nom}>{c.nom}</div>
            <div style={S.perso}>{c.perso}</div>
            <div style={S.citation}>{c.citation}</div>
          </div>
          <span style={S.arrow}>→</span>
        </div>
      ))}
    </div>
  );
}
