'use client';

import { useState } from 'react';

/* ─── DATA ─── */
interface Article {
  id: string;
  emoji: string;
  nom: string;
  prix: number;
  effet: string;
  type: string;
  rare?: boolean;
  phrase?: string;
}

interface Commerce {
  emoji: string;
  nom: string;
  personnage: string;
  animal: string;
  citation: string;
  articles: Article[];
}

const COMMERCES: Record<string, Commerce> = {
  noisette: {
    emoji: '🛒', nom: 'Épicerie Grignotier', personnage: 'Noisette',
    animal: '🐿️',
    citation: "On n'est jamais trop préparé pour ce qu'on ne sait pas encore.",
    articles: [
      { id: 'graines', emoji: '🌱', nom: 'Graines de Vanille', prix: 10, effet: 'Plante une culture (récolte en 4h)', type: 'consommable' },
      { id: 'engrais', emoji: '🌿', nom: 'Engrais de Gaston', prix: 15, effet: '-40% temps de culture', type: 'consommable' },
      { id: 'loupe', emoji: '🔍', nom: 'Loupe de poche', prix: 25, effet: 'Détails sur objets pêchés', type: 'permanent' },
      { id: 'arrosoir', emoji: '🪣', nom: 'Arrosoir en cuivre', prix: 45, effet: '-20% cultures (permanent)', type: 'permanent', rare: true },
      { id: 'thermos', emoji: '♨️', nom: 'Thermos de Source', prix: 60, effet: '+10% Éclats 24h', type: 'consommable' },
      { id: 'cle', emoji: '🗝️', nom: 'Clé Rouillée', prix: 200, effet: 'Chaîne narrative × 3', type: 'narratif', rare: true },
      { id: 'caisse', emoji: '📦', nom: 'Caisse A.P.', prix: 350, effet: 'Chaîne narrative × 2', type: 'narratif', rare: true },
      { id: 'parapluie', emoji: '☂️', nom: 'Parapluie Maurice', prix: 35, effet: 'Protège du gel', type: 'permanent' },
      { id: 'lampe', emoji: '💡', nom: 'Lampe à huile', prix: 40, effet: 'Champignons +30% la nuit', type: 'permanent' },
    ],
  },
  gaston: {
    emoji: '🥐', nom: 'Boulangerie Mielleux', personnage: 'Gaston',
    animal: '🐻',
    citation: "Un bon pain, c'est une journée sauvée d'avance.",
    articles: [
      { id: 'croissant', emoji: '🥐', nom: 'Croissant spiralé', prix: 12, effet: '+15% vitesse 2h', phrase: "Je sais pas pourquoi il est comme ça. Il est bon quand même.", type: 'consommable' },
      { id: 'pain_source', emoji: '🍞', nom: 'Pain de Source', prix: 25, effet: '+25% gain de vente 3h', phrase: "La farine, elle a absorbé quelque chose.", type: 'consommable' },
      { id: 'brioche', emoji: '🧁', nom: 'Brioche de bienvenue', prix: 8, effet: '+1 Éclat par action 1h', phrase: "Pour les nouveaux. Bienvenue, vraiment.", type: 'consommable' },
      { id: 'tarte', emoji: '🥧', nom: 'Tarte aux myrtilles', prix: 30, effet: '-1h sur tous les timers actifs', phrase: "Les myrtilles sont bleues comme... bah comme les myrtilles.", type: 'consommable' },
      { id: 'millefeuille', emoji: '🍰', nom: 'Millefeuille de novembre', prix: 45, effet: 'Double la prochaine récolte', phrase: "Celui-là, je l'ai fait sans le vouloir.", type: 'consommable' },
      { id: 'galette', emoji: '🫓', nom: "Galette d'Archibald", prix: 150, effet: 'Réinitialise tous les timers', phrase: "C'est une vieille recette. Très vieille.", type: 'consommable', rare: true },
    ],
  },
  madeleine: {
    emoji: '📚', nom: 'Bibliothèque', personnage: 'Madeleine',
    animal: '🦔',
    citation: "Je range dans un ordre que l'univers comprend.",
    articles: [
      { id: 'histoire1', emoji: '📕', nom: '"Histoire de Pétaouchnok" vol.1', prix: 40, effet: 'Lore officiel version Fernand', type: 'lore' },
      { id: 'histoire2', emoji: '📗', nom: '"Histoire de Pétaouchnok" vol.2', prix: 40, effet: 'Lore officiel suite', type: 'lore' },
      { id: 'flore', emoji: '🌿', nom: 'Flore et faune du vallon', prix: 25, effet: 'Lore mineur sur les plantes', type: 'lore' },
      { id: 'note1', emoji: '📝', nom: 'Note marginale n°1', prix: 60, effet: 'Première déviation du lore officiel', type: 'lore' },
      { id: 'note2', emoji: '📝', nom: 'Note marginale n°2', prix: 80, effet: 'Madeleine commence à parler', type: 'lore' },
      { id: 'doc_archibald', emoji: '📜', nom: "Document d'Archibald (copie)", prix: 120, effet: 'La Source expliquée en 1789', type: 'lore', rare: true },
      { id: 'carnet1', emoji: '📓', nom: 'Carnet de terrain n°1', prix: 150, effet: "Journal d'Archibald, premier tiers", type: 'lore', rare: true },
      { id: 'carnet2', emoji: '📓', nom: 'Carnet de terrain n°2', prix: 200, effet: "Journal d'Archibald, deuxième tiers", type: 'lore', rare: true },
      { id: 'carnet3', emoji: '📓', nom: 'Carnet de terrain n°3', prix: 250, effet: "Journal d'Archibald, troisième tiers", type: 'lore', rare: true },
      { id: 'page', emoji: '📄', nom: 'La page arrachée', prix: 400, effet: 'Chaîne narrative', type: 'narratif', rare: true },
    ],
  },
};

const COMMERCE_KEYS = ['noisette', 'gaston', 'madeleine'] as const;

/* ─── NARRATIVE DIALOGUES ─── */
const NARRATIFS: Record<string, string[]> = {
  cle: [
    "Noisette hésite un instant avant de la poser sur le comptoir.\n\n« Elle était accrochée derrière le rayon des conserves. Je ne sais pas depuis combien de temps. »",
    "« La serrure correspondante... je crois que Fernand sait. Ou savait. Demandez-lui, mais choisissez bien vos mots. »",
    "« Si vous trouvez ce qu'elle ouvre, ne me le dites pas. Certaines choses doivent rester entre vous et le village. »",
  ],
  caisse: [
    "La caisse est lourde pour sa taille. Les initiales A.P. sont gravées dans le bois.\n\n« Elle était dans la cave quand j'ai repris le commerce. Je n'ai jamais réussi à l'ouvrir. »",
    "« Peut-être qu'avec la bonne clé... ou le bon moment. Ce village a son propre calendrier pour ces choses-là. »",
  ],
  page: [
    "Madeleine sort la page d'un tiroir fermé à clé, les mains légèrement tremblantes.\n\n« Cette page a été arrachée du registre fondateur. Par qui ? Je ne sais pas. Pourquoi ? Ça, je commence à comprendre. »",
    "« Ce qui est écrit dessus contredit tout ce que Fernand raconte sur la fondation du village. Tout. »",
    "« Gardez-la précieusement. Et si Fernand vous demande si vous l'avez vue... vous ne l'avez pas vue. »",
  ],
  galette: [
    "Gaston emballe la galette avec un soin inhabituel.\n\n« C'est une vieille recette. Très vieille. Je sais pas d'où elle vient. La pâte, elle fait un truc que je comprends pas. »",
  ],
};

/* ─── STYLES ─── */
const S = {
  page: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
    background: '#2d1a0e',
  },
  banner: {
    background: 'linear-gradient(180deg, #f5e8c0 0%, #e8d5a0 100%)',
    border: '3px solid #3d2010',
    boxShadow: '0 0 0 5px #1a0d05, 0 0 0 7px #6b3d1e, 0 4px 12px rgba(0,0,0,0.5)',
    borderRadius: 8,
    margin: 12,
    padding: '10px 16px',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  bannerTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 13,
    color: '#3d2010',
    textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
  },
  /* Shop selector cards — full width */
  shopCard: {
    background: '#e8d8b0',
    border: '2px solid #3d2010',
    borderRadius: 8,
    boxShadow:
      '0 0 0 2px #1a0d05, 0 0 0 4px #6b3d1e, 0 0 0 5px #1a0d05, inset 0 0 0 1px #c8b078, 3px 4px 0 rgba(0,0,0,0.4)',
    margin: '0 12px',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  shopIcon: {
    width: 56,
    height: 56,
    flexShrink: 0,
    background: '#d4c090',
    border: '1px solid #b09050',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
  /* Back header */
  backHeader: {
    background: '#3d2010',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '3px solid #1a0d05',
    boxShadow: '0 2px 0 #6b3d1e',
  },
  /* Character greeting card */
  greetingCard: {
    background: 'linear-gradient(135deg, #f5e8c0 0%, #e8d5a0 100%)',
    border: '2px solid #d4a017',
    borderRadius: 8,
    boxShadow:
      '0 0 0 2px #1a0d05, 0 0 0 4px #d4a017, 0 0 0 6px #9a7010, 0 0 8px rgba(212,160,23,0.4), inset 0 0 0 1px #f0c040',
    margin: '0 12px 10px',
    padding: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  /* Article grid */
  articleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    padding: '0 12px 12px',
  },
  /* Article card */
  articleCard: {
    background: '#e8d8b0',
    borderRadius: 8,
    border: '2px solid #3d2010',
    boxShadow:
      '0 0 0 2px #1a0d05, 0 0 0 4px #6b3d1e, 0 0 0 5px #1a0d05, inset 0 0 0 1px #c8b078, 3px 4px 0 rgba(0,0,0,0.4)',
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    position: 'relative' as const,
  },
  articleCardSpecial: {
    background: '#f5e8c0',
    borderRadius: 8,
    border: '2px solid #d4a017',
    boxShadow:
      '0 0 0 2px #1a0d05, 0 0 0 4px #d4a017, 0 0 0 6px #9a7010, 0 0 8px rgba(212,160,23,0.4), inset 0 0 0 1px #f0c040',
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    position: 'relative' as const,
  },
  illustZone: {
    width: '100%',
    height: 70,
    background: '#d4c090',
    borderRadius: 4,
    border: '1px solid #b09050',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
  },
  itemTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 6,
    color: '#2a1a08',
    textAlign: 'center' as const,
    lineHeight: 1.6,
  },
  itemDesc: {
    fontFamily: "'Lora', serif",
    fontSize: 9,
    fontStyle: 'italic' as const,
    color: '#4a3020',
    textAlign: 'center' as const,
  },
  priceBtn: {
    background: 'linear-gradient(180deg, #f0c040 0%, #d4a017 100%)',
    border: '2px solid #9a7010',
    borderRadius: 4,
    boxShadow: '0 2px 0 #6a6000, inset 0 1px 0 rgba(255,255,200,0.4)',
    padding: '4px 10px',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 7,
    color: '#2a1a08',
    cursor: 'pointer',
    marginTop: 'auto',
  },
} as const;

/* ─── PAGE ─── */
export default function CommercesPage() {
  const [activeShop, setActiveShop] = useState<string | null>(null);
  const [narratif, setNarratif] = useState<{ articleId: string; step: number; steps: string[] } | null>(null);
  const [achatAnim, setAchatAnim] = useState<string | null>(null);

  const commerce = activeShop ? COMMERCES[activeShop] : null;

  const handleAchat = (article: Article) => {
    const dialogues = NARRATIFS[article.id];
    if (dialogues) {
      setNarratif({ articleId: article.id, step: 0, steps: dialogues });
    } else {
      setAchatAnim(article.id);
      setTimeout(() => setAchatAnim(null), 1000);
    }
  };

  const handleNarratifNext = () => {
    if (!narratif) return;
    if (narratif.step < narratif.steps.length - 1) {
      setNarratif({ ...narratif, step: narratif.step + 1 });
    } else {
      setNarratif(null);
    }
  };

  return (
    <div style={S.page}>
      {!commerce ? (
        <>
          {/* Banner */}
          <div style={S.banner}>
            <span style={{ fontSize: 18 }}>🌰</span>
            <h1 style={S.bannerTitle}>COMMERCES</h1>
            <span style={{ fontSize: 18 }}>🌰</span>
          </div>

          {/* Éclats disponibles */}
          <div style={{ padding: '0 12px 10px', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#f0c040' }}>
              ✦ 245 Éclats disponibles
            </span>
          </div>

          {/* Shop list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
            {COMMERCE_KEYS.map((key) => {
              const c = COMMERCES[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveShop(key)}
                  style={S.shopCard}
                >
                  {/* Icon box */}
                  <div style={S.shopIcon}>
                    <span>{c.emoji}</span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: '#2a1a08',
                      lineHeight: 1.6,
                      marginBottom: 2,
                    }}>
                      {c.nom.toUpperCase()}
                    </div>
                    <div style={{
                      fontFamily: "'Lora', serif",
                      fontSize: 12,
                      color: '#4a3020',
                    }}>
                      {c.personnage} {c.animal}
                    </div>
                    <div style={{
                      fontFamily: "'Lora', serif",
                      fontSize: 10,
                      fontStyle: 'italic',
                      color: '#8B5E2A',
                      marginTop: 2,
                    }}>
                      &laquo;&nbsp;{c.citation.slice(0, 45)}...&nbsp;&raquo;
                    </div>
                  </div>

                  {/* Arrow */}
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 10,
                    color: '#6b3d1e',
                  }}>→</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Back header */}
          <div style={S.backHeader}>
            <button
              onClick={() => setActiveShop(null)}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#8b6a3e',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ← RETOUR
            </button>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: '#f0c040',
            }}>
              {commerce.nom.toUpperCase()}
            </span>
          </div>

          {/* Character greeting */}
          <div style={{ padding: '10px 0 0' }}>
            <div style={S.greetingCard}>
              <span style={{ fontSize: 36 }}>{commerce.animal}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: '#d4a017',
                  marginBottom: 4,
                }}>
                  {commerce.personnage}
                </div>
                <div style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: '#4a3520',
                  lineHeight: 1.6,
                }}>
                  &laquo;&nbsp;{commerce.citation}&nbsp;&raquo;
                </div>
              </div>
            </div>
          </div>

          {/* Articles grid — 3 columns */}
          <div style={S.articleGrid}>
            {commerce.articles.map((article) => (
              <div
                key={article.id}
                style={article.rare ? S.articleCardSpecial : S.articleCard}
              >
                {/* Rare badge */}
                {article.rare && (
                  <span style={{
                    position: 'absolute',
                    top: -6,
                    right: -4,
                    background: '#7a5aab',
                    color: '#fff',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 4,
                    padding: '2px 4px',
                    borderRadius: 2,
                    letterSpacing: 0.5,
                  }}>
                    ✦ RARE
                  </span>
                )}

                {/* Achat anim */}
                {achatAnim === article.id && (
                  <span style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: '#f0c040',
                    animation: 'float-up 1s ease-out forwards',
                    pointerEvents: 'none',
                  }}>
                    ACHETÉ!
                  </span>
                )}

                {/* Illustration zone */}
                <div style={S.illustZone}>
                  <span>{article.emoji}</span>
                </div>

                {/* Title */}
                <span style={S.itemTitle}>{article.nom}</span>

                {/* Description */}
                <span style={S.itemDesc}>{article.effet}</span>

                {/* Price button */}
                <button style={S.priceBtn} onClick={() => handleAchat(article)}>
                  🪙 {article.prix}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Narrative modal */}
      {narratif && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            background: 'rgba(0,0,0,0.7)',
          }}
          onClick={handleNarratifNext}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              background: 'linear-gradient(135deg, #f5e8c0 0%, #e8d5a0 100%)',
              border: '2px solid #d4a017',
              borderRadius: 8,
              boxShadow:
                '0 0 0 2px #1a0d05, 0 0 0 4px #d4a017, 0 0 0 6px #9a7010, 0 0 8px rgba(212,160,23,0.4), inset 0 0 0 1px #f0c040',
              padding: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#7a5aab' }}>
                ✦ CHAÎNE NARRATIVE
              </span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: '#8B5E2A' }}>
                {narratif.step + 1}/{narratif.steps.length}
              </span>
            </div>

            {/* Dialogue */}
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: 15,
              color: '#2d1a08',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              marginBottom: 16,
            }}>
              {narratif.steps[narratif.step]}
            </p>

            {/* Next / Close */}
            <button
              onClick={handleNarratifNext}
              style={{
                ...S.priceBtn,
                width: '100%',
                padding: '8px 16px',
                fontSize: 8,
              }}
            >
              {narratif.step < narratif.steps.length - 1 ? 'SUIVANT →' : 'FERMER'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
