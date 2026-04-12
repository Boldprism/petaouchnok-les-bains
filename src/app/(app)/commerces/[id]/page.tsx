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

const NPC_SPRITES: Record<string, string> = {
  noisette:  '/assets/commerces/noisette.png',
  gaston:    '/assets/commerces/gaston.png',
  madeleine: '/assets/commerces/madeleine.png',
};

const DIALOGUES: Record<string, string[]> = {
  // Noisette
  'Clé Rouillée': [
    "Je sais pas pourquoi je vous la vends. Elle était dans les stocks depuis avant mon arrivée, sous une étiquette 'NE PAS VENDRE'. J'ai pensé que ça datait. Maintenant je suis pas sûre.",
    "Fragment débloqué — Sur le métal, gravés si finement qu'on ne les voit qu'en pleine lumière : « Pour la prochaine fois. »",
  ],
  'Caisse A.P.': [
    "Elle est là depuis avant moi. Je l'ai jamais ouverte par respect. Mais bon. Vous avez l'air de quelqu'un à qui ça appartient, d'une certaine façon. Je sais pas pourquoi je dis ça.",
    "Fragment débloqué — Une lanterne qui s'allume seule. Trois graines qui sentent la vanille. Un miroir dont le reflet a une seconde d'avance. Et tout au fond : un portrait qui vous ressemble étrangement.",
  ],
  'Arrosoir en cuivre': [
    "Celui-là, il est spécial. Le cuivre vient de la Source. L'eau qu'il verse... elle fait pousser les choses un peu plus vite que la normale.",
  ],
  'Thermos de Source': [
    "L'eau de la Source, embouteillée. Enfin, thermosée. Ça garde la chaleur pendant 24 heures. Et pendant 24 heures, tout ce que vous touchez brille un peu plus.",
  ],
  // Gaston
  'Millefeuille nov.': [
    "Celui-là, je l'ai fait sans le vouloir. La pâte a levé trois fois au lieu de deux. J'ai pas compris pourquoi. Mais quand on le mange... la prochaine récolte, elle double. J'explique pas.",
  ],
  'Galette Archibald': [
    "C'est une vieille recette. Très vieille. Je sais pas d'où elle vient. La pâte, elle fait un truc que je comprends pas. Mais quand on la mange, tout repart à zéro. Les timers, les cultures, tout.",
    "Fragment débloqué — La recette, écrite à la main sur du papier jauni : « Farine de Source, eau de pluie d'automne, un soupçon de patience. Cuire jusqu'à ce que la croûte chante. » Signé : A.P.",
  ],
  // Madeleine
  'Note marginale n°2': [
    "Celle-ci... je l'ai trouvée entre deux pages du registre. Quelqu'un l'a glissée là exprès. Quelqu'un qui voulait qu'on la trouve, mais pas trop vite.",
    "Fragment débloqué — L'écriture est différente du reste du registre. Plus petite, plus nerveuse. « Il ment. La Source n'a jamais été découverte. Elle a toujours été là. C'est le village qui est apparu autour. »",
  ],
  'Document Archibald': [
    "Ce document date de 1789. Archibald Pétaouchnok y décrit la Source avec une précision... troublante. Comme s'il la connaissait personnellement.",
    "Fragment débloqué — « La Source ne donne pas. Elle échange. Chaque Éclat récolté est un souvenir déposé. Les villageois l'oublient. Moi, je note. »",
  ],
  'Carnet terrain n°1': [
    "Le premier tiers du journal d'Archibald. Les pages sont fragiles. Il y décrit ses premières explorations du vallon, avant même que le village n'existe.",
    "Fragment débloqué — « Jour 1 — J'ai trouvé l'eau. Elle est tiède. Elle brille. Quand je la touche, je me souviens de choses qui ne me sont pas encore arrivées. »",
  ],
  'Carnet terrain n°2': [
    "Le deuxième tiers. L'écriture devient plus pressée. Archibald commence à comprendre quelque chose, mais il a peur de l'écrire clairement.",
    "Fragment débloqué — « Jour 47 — Les graines que j'ai plantées hier ont déjà poussé. Pas normalement. Elles ont poussé en arrière. Les fruits étaient là avant les fleurs. »",
  ],
  'La page arrachée': [
    "Madeleine sort la page d'un tiroir fermé à clé, les mains légèrement tremblantes.\n\n« Cette page a été arrachée du registre fondateur. Par qui ? Je ne sais pas. Pourquoi ? Ça, je commence à comprendre. »",
    "« Ce qui est écrit dessus contredit tout ce que Fernand raconte sur la fondation du village. Tout. »",
    "Fragment débloqué — La page, jaunie et déchirée sur un bord : « Pétaouchnok-les-Bains n'a pas été fondé. Il a été rappelé. La Source se souvient d'un village, et le village apparaît. Encore et encore. Nous sommes la énième itération. » Signé d'une main tremblante : A.P.",
  ],
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
  const [achatModal, setAchatModal] = useState<{ item: Item; etape: number } | null>(null);

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

      {/* Illustration boutique placeholder */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 220,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src="/assets/commerces/boutique-bg.png"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            imageRendering: 'pixelated',
          }}
        />
        {/* Gradient de fondu vers le bas */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(transparent, #3d2010)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Zone NPC */}
      <div style={S.npcZone}>
        <img
          src={NPC_SPRITES[id] ?? ''}
          alt={commerce.perso}
          style={{
            height: 64,
            width: 'auto',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.5))',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={S.npcNom}>{commerce.perso}</div>
          <div style={S.npcCitation}>«&nbsp;{commerce.citation}&nbsp;»</div>
        </div>
      </div>

      {/* Grille items */}
      <div style={S.itemGrid}>
        {commerce.items.map((item) => (
          <div key={item.nom} style={S.card} onClick={() => {
            if (item.special && DIALOGUES[item.nom]) {
              setAchatModal({ item, etape: 0 });
            } else {
              handleAchat(item.nom);
            }
          }}>
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
            <button style={S.priceBtn} onClick={(e) => {
              e.stopPropagation();
              if (item.special && DIALOGUES[item.nom]) {
                setAchatModal({ item, etape: 0 });
              } else {
                handleAchat(item.nom);
              }
            }}>
              ✦ {item.prix}
            </button>
          </div>
        ))}
      </div>

      {/* Modal achat spécial */}
      {achatModal && DIALOGUES[achatModal.item.nom] && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            width: '100%', maxWidth: 480,
            background: 'linear-gradient(180deg, #f5e8c0 0%, #e8d5a0 100%)',
            border: '3px solid #3d2010',
            borderBottom: 'none',
            boxShadow: '0 0 0 5px #1a0d05, 0 0 0 7px #6b3d1e',
            borderRadius: '12px 12px 0 0',
            padding: '20px 16px 28px',
          }}>
            {/* Header item */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, background: '#d4c090',
                border: '2px solid #b09050', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>
                {achatModal.item.emoji}
              </div>
              <div>
                <div style={{ fontFamily: fontPixel, fontSize: 8, color: '#3d2010', marginBottom: 3 }}>
                  {achatModal.item.nom}
                </div>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 10, color: '#8b6a3e', fontStyle: 'italic' }}>
                  {achatModal.etape < DIALOGUES[achatModal.item.nom].length - 1
                    ? `${commerce.perso} dit :`
                    : 'Fragment de lore'}
                </div>
              </div>
            </div>

            {/* Texte dialogue */}
            <div style={{
              background: '#fff8e8',
              border: '2px solid #c8b078',
              borderRadius: 6,
              padding: '12px 14px',
              marginBottom: 16,
              fontFamily: 'Lora, serif',
              fontSize: 13,
              fontStyle: 'italic',
              color: achatModal.etape === DIALOGUES[achatModal.item.nom].length - 1 ? '#5a3010' : '#2a1408',
              lineHeight: 1.6,
              minHeight: 80,
              whiteSpace: 'pre-line',
            }}>
              {achatModal.etape === DIALOGUES[achatModal.item.nom].length - 1 &&
                DIALOGUES[achatModal.item.nom].length > 1 && (
                <span style={{
                  fontFamily: fontPixel, fontSize: 6,
                  color: '#4a6a2a', display: 'block', marginBottom: 8,
                }}>
                  ✦ FRAGMENT DÉBLOQUÉ
                </span>
              )}
              «&nbsp;{DIALOGUES[achatModal.item.nom][achatModal.etape]}&nbsp;»
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {achatModal.etape === 0 ? (
                <>
                  <button
                    onClick={() => setAchatModal(null)}
                    style={{
                      flex: 1, padding: '10px 8px',
                      background: '#6b3d1e', border: '2px solid #3d2010',
                      borderRadius: 6, fontFamily: fontPixel, fontSize: 7,
                      color: '#f5e8c0', cursor: 'pointer',
                    }}
                  >
                    ANNULER
                  </button>
                  <button
                    onClick={() => setAchatModal(prev => prev ? { ...prev, etape: 1 } : null)}
                    style={{
                      flex: 2, padding: '10px 8px',
                      background: 'linear-gradient(180deg, #f0c040 0%, #d4a017 100%)',
                      border: '2px solid #9a7010',
                      borderRadius: 6,
                      boxShadow: '0 2px 0 #6a5000',
                      fontFamily: fontPixel, fontSize: 7,
                      color: '#2a1408', cursor: 'pointer',
                    }}
                  >
                    ACHETER — {achatModal.item.prix} ✦
                  </button>
                </>
              ) : achatModal.etape < DIALOGUES[achatModal.item.nom].length - 1 ? (
                <button
                  onClick={() => setAchatModal(prev => prev ? { ...prev, etape: prev.etape + 1 } : null)}
                  style={{
                    flex: 1, padding: '10px 8px',
                    background: 'linear-gradient(180deg, #f0c040 0%, #d4a017 100%)',
                    border: '2px solid #9a7010',
                    borderRadius: 6,
                    boxShadow: '0 2px 0 #6a5000',
                    fontFamily: fontPixel, fontSize: 7,
                    color: '#2a1408', cursor: 'pointer',
                  }}
                >
                  SUIVANT →
                </button>
              ) : (
                <button
                  onClick={() => setAchatModal(null)}
                  style={{
                    flex: 1, padding: '10px 8px',
                    background: 'linear-gradient(180deg, #7ab83a 0%, #4a6a2a 100%)',
                    border: '2px solid #2a4010',
                    borderRadius: 6, fontFamily: fontPixel, fontSize: 7,
                    color: '#e8ffd0', cursor: 'pointer',
                    boxShadow: '0 2px 0 #2a4010',
                  }}
                >
                  ✓ CONTINUER
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
