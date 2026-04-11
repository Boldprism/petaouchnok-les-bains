'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, CSSProperties } from 'react';

/* ─── DATA ─── */
interface Item {
  emoji: string;
  nom: string;
  desc: string;
  prix: number;
  special?: boolean;
}

interface CommerceData {
  nom: string;
  perso: string;
  emoji: string;
  emojiPerso: string;
  citation: string;
  items: Item[];
}

const COMMERCES: Record<string, CommerceData> = {
  noisette: {
    nom: 'ÉPICERIE GRIGNOTIER', perso: 'Noisette', emoji: '🛒', emojiPerso: '🐿️',
    citation: "On n'est jamais trop préparé pour ce qu'on ne sait pas encore.",
    items: [
      { emoji: '🌱', nom: 'Graines de Vanille', desc: 'Plante une culture (4h)', prix: 10 },
      { emoji: '🌿', nom: 'Engrais de Gaston', desc: '-40% temps culture', prix: 15 },
      { emoji: '🔍', nom: 'Loupe de poche', desc: 'Détails objets pêchés', prix: 25 },
      { emoji: '🪣', nom: 'Arrosoir en cuivre', desc: '-20% cultures permanent', prix: 45, special: true },
      { emoji: '♨️', nom: 'Thermos de Source', desc: '+10% Éclats 24h', prix: 60, special: true },
      { emoji: '☂️', nom: 'Parapluie Maurice', desc: 'Protège du gel', prix: 35 },
      { emoji: '💡', nom: 'Lampe à huile', desc: 'Champignons +30% nuit', prix: 40 },
      { emoji: '🗝️', nom: 'Clé Rouillée', desc: 'Chaîne narrative × 3', prix: 200, special: true },
      { emoji: '📦', nom: 'Caisse A.P.', desc: 'Chaîne narrative × 2', prix: 350, special: true },
    ],
  },
  gaston: {
    nom: 'BOULANGERIE MIELLEUX', perso: 'Gaston', emoji: '🥐', emojiPerso: '🐻',
    citation: "Un bon pain, c'est une journée sauvée d'avance.",
    items: [
      { emoji: '🥐', nom: 'Croissant spiralé', desc: '+15% vitesse 2h', prix: 12 },
      { emoji: '🍞', nom: 'Pain de Source', desc: '+25% gain vente 3h', prix: 25 },
      { emoji: '🧁', nom: 'Brioche bienvenue', desc: '+1 Éclat/action 1h', prix: 8 },
      { emoji: '🫐', nom: 'Tarte myrtilles', desc: '-1h tous les timers', prix: 30 },
      { emoji: '🍰', nom: 'Millefeuille nov.', desc: 'Double prochaine récolte', prix: 45, special: true },
      { emoji: '🎂', nom: 'Galette Archibald', desc: 'Réinitialise tous timers', prix: 150, special: true },
    ],
  },
  madeleine: {
    nom: 'BIBLIOTHÈQUE', perso: 'Madeleine', emoji: '📚', emojiPerso: '🦔',
    citation: "Je range dans un ordre que l'univers comprend.",
    items: [
      { emoji: '📖', nom: 'Histoire vol.1', desc: 'Lore officiel version Fernand', prix: 40 },
      { emoji: '📗', nom: 'Histoire vol.2', desc: 'Lore officiel suite', prix: 40 },
      { emoji: '🌿', nom: 'Flore et faune', desc: 'Lore mineur sur les plantes', prix: 25 },
      { emoji: '📝', nom: 'Note marginale n°1', desc: 'Première déviation du lore', prix: 60 },
      { emoji: '📜', nom: 'Note marginale n°2', desc: 'Madeleine commence à parler', prix: 80, special: true },
      { emoji: '🗒️', nom: 'Document Archibald', desc: 'La Source expliquée en 1789', prix: 120, special: true },
      { emoji: '📔', nom: 'Carnet terrain n°1', desc: "Journal d'Archibald, 1/3", prix: 150, special: true },
      { emoji: '📓', nom: 'Carnet terrain n°2', desc: "Journal d'Archibald, 2/3", prix: 200, special: true },
      { emoji: '📕', nom: 'La page arrachée', desc: 'Chaîne narrative dédiée', prix: 400, special: true },
    ],
  },
};

const fontPixel = "'Press Start 2P', monospace";

/* ─── STYLES ─── */
const S: Record<string, CSSProperties> = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#3d2010',
  },
  backHeader: {
    background: '#2a1408',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  backBtn: {
    fontFamily: fontPixel,
    fontSize: 6,
    color: '#8b6a3e',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  shopName: {
    fontFamily: fontPixel,
    fontSize: 8,
    color: '#f0c040',
  },
  npcZone: {
    background: '#5a3010',
    border: '2px solid #3d2010',
    borderBottom: '3px solid #1a0d05',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  npcAvatar: {
    width: 56,
    height: 56,
    flexShrink: 0,
    background: 'radial-gradient(#a06830, #5a3010)',
    border: '2px solid #c8933a',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
  npcNom: {
    fontFamily: fontPixel,
    fontSize: 7,
    color: '#f0c040',
    marginBottom: 4,
  },
  npcCitation: {
    fontFamily: "'Lora', serif",
    fontStyle: 'italic',
    fontSize: 11,
    color: '#e8d5a0',
    lineHeight: 1.5,
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    padding: '10px 12px',
    background: '#3d2010',
    flex: 1,
    overflowY: 'auto',
    alignContent: 'start',
  },
  card: {
    background: '#e8d5a0',
    border: '2px solid #6b3d1e',
    borderRadius: 6,
    boxShadow: '2px 3px 0 #3d2010, inset 0 1px 0 rgba(255,255,255,0.3)',
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    cursor: 'pointer',
  },
  specialBadge: {
    position: 'absolute',
    top: -6,
    right: 4,
    background: '#8b2020',
    color: '#ffd0d0',
    fontFamily: fontPixel,
    fontSize: 5,
    padding: '2px 4px',
    borderRadius: 2,
  },
  illustZone: {
    height: 56,
    width: '100%',
    background: '#d4c090',
    borderRadius: 4,
    border: '1px solid #b09050',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
  itemNom: {
    fontFamily: fontPixel,
    fontSize: 6,
    color: '#3d2010',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  itemDesc: {
    fontFamily: "'Lora', serif",
    fontStyle: 'italic',
    fontSize: 9,
    color: '#6b4a20',
    textAlign: 'center',
  },
  priceBtn: {
    background: 'linear-gradient(180deg, #f0c040 0%, #d4a017 100%)',
    border: '2px solid #9a7010',
    borderRadius: 4,
    boxShadow: '0 2px 0 #6a5000',
    padding: '4px 10px',
    fontFamily: fontPixel,
    fontSize: 7,
    color: '#2a1408',
    cursor: 'pointer',
    marginTop: 'auto',
  },
  achatFloat: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontFamily: fontPixel,
    fontSize: 8,
    color: '#f0c040',
    animation: 'float-up 1s ease-out forwards',
    pointerEvents: 'none',
    zIndex: 5,
  },
};

const KEYFRAMES = `
@keyframes float-up {
  0%   { opacity: 0; transform: translate(-50%, 0); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -32px); }
}
`;

/* ─── PAGE ─── */
export default function BoutiquePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const commerce = COMMERCES[id];
  const [achatAnim, setAchatAnim] = useState<string | null>(null);

  if (!commerce) {
    return (
      <div style={S.page}>
        <div style={S.backHeader}>
          <button style={S.backBtn} onClick={() => router.push('/commerces')}>← RETOUR</button>
        </div>
        <div style={{ padding: 20, textAlign: 'center', color: '#c8b078', fontFamily: fontPixel, fontSize: 8 }}>
          Commerce introuvable
        </div>
      </div>
    );
  }

  const handleAchat = (itemNom: string) => {
    setAchatAnim(itemNom);
    setTimeout(() => setAchatAnim(null), 1000);
  };

  return (
    <div style={S.page}>
      <style>{KEYFRAMES}</style>

      {/* Header retour */}
      <div style={S.backHeader}>
        <button style={S.backBtn} onClick={() => router.push('/commerces')}>← RETOUR</button>
        <span style={S.shopName}>{commerce.nom}</span>
      </div>

      {/* Zone NPC */}
      <div style={S.npcZone}>
        <div style={S.npcAvatar}>
          <span>{commerce.emojiPerso}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={S.npcNom}>{commerce.perso}</div>
          <div style={S.npcCitation}>«&nbsp;{commerce.citation}&nbsp;»</div>
        </div>
      </div>

      {/* Grille items */}
      <div style={S.itemGrid}>
        {commerce.items.map((item) => (
          <div key={item.nom} style={S.card} onClick={() => handleAchat(item.nom)}>
            {/* Badge SPÉCIAL */}
            {item.special && <span style={S.specialBadge}>SPÉCIAL</span>}

            {/* Achat anim */}
            {achatAnim === item.nom && <span style={S.achatFloat}>ACHETÉ!</span>}

            {/* Illustration */}
            <div style={S.illustZone}>
              <span>{item.emoji}</span>
            </div>

            {/* Nom */}
            <span style={S.itemNom}>{item.nom}</span>

            {/* Description */}
            <span style={S.itemDesc}>{item.desc}</span>

            {/* Bouton prix */}
            <button style={S.priceBtn} onClick={(e) => { e.stopPropagation(); handleAchat(item.nom); }}>
              ✦ {item.prix}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
