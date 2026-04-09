'use client';

import { useState } from 'react';

/* ─── DATA ─── */
type Category = 'Tous' | 'Mois 1' | 'Mystères' | 'Personnages';

const LETTRES = [
  {
    id: 'lettre-bienvenue',
    month: 1,
    category: 'Mois 1' as Category,
    title: 'La Lettre de Bienvenue',
    from: 'Fernand Plongeot, Maire',
    date: 'Le 1er du mois',
    emoji: '💌',
    unlocked: true,
    isNew: false,
    content: `Cher·e nouvel·le arrivant·e,

En ma qualité de Maire de Pétaouchnok-les-Bains, je vous souhaite la bienvenue.

Vous avez probablement des questions. C'est normal. Tout le monde en a au début. Puis on oublie de les poser, et un jour on se rend compte qu'on connaît déjà les réponses.

Le village est petit mais complet. Vous trouverez tout ce dont vous avez besoin — une boulangerie dont les croissants défient la physique, une bibliothèque dont les livres ont parfois des opinions, et bien sûr, la Source.

La Source, c'est le cœur du village. Son eau est légèrement dorée et sent vaguement la vanille. Ne me demandez pas pourquoi. Je ne sais pas. Personne ne sait. C'est ce qui la rend intéressante.

Installez-vous. Prenez le temps. Le village vous connaît déjà.

Cordialement (et un peu pompeusement),
Fernand Plongeot
Maire de Pétaouchnok-les-Bains
(depuis toujours)`,
  },
  {
    id: 'lettre-2',
    month: 2,
    category: 'Mystères' as Category,
    title: 'La Mélodie de la Source',
    from: 'Pip Minuscule',
    date: 'Le 1er du mois',
    emoji: '🎵',
    unlocked: false,
    isNew: false,
    content: '',
  },
  {
    id: 'lettre-3',
    month: 3,
    category: 'Personnages' as Category,
    title: 'Le Registre Disparu',
    from: 'Madeleine Épinette',
    date: 'Le 1er du mois',
    emoji: '📖',
    unlocked: false,
    isNew: false,
    content: '',
  },
];

const CATEGORIES: Category[] = ['Tous', 'Mois 1', 'Mystères', 'Personnages'];

const CATEGORY_COLORS: Record<Category, string> = {
  'Tous': '#5a7aa8',
  'Mois 1': '#c8933a',
  'Mystères': '#7a5aab',
  'Personnages': '#3a8a5c',
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
  filterBar: {
    background: '#3d2010',
    padding: '8px 12px',
    display: 'flex',
    gap: 6,
    overflowX: 'auto' as const,
    borderBottom: '3px solid #1a0d05',
    boxShadow: '0 2px 0 #6b3d1e',
  },
  tabInactive: {
    background: '#2d1a0e',
    border: '2px solid #6b3d1e',
    borderRadius: 4,
    padding: '5px 10px',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 6,
    color: '#8b6a3e',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  tabActive: {
    background: '#f0c040',
    border: '2px solid #9a7010',
    borderRadius: 4,
    padding: '5px 10px',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 6,
    color: '#2a1a08',
    boxShadow: '0 2px 0 #6a6000',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  card: {
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
    minHeight: 80,
  },
  iconBox: {
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
  cardTitle: {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 7,
    color: '#2a1a08',
    marginTop: 4,
  },
  cardSubtitle: {
    fontFamily: "'Lora', serif",
    fontStyle: 'italic' as const,
    fontSize: 10,
    color: '#4a3020',
  },
} as const;

/* ─── PAGE ─── */
export default function LettresPage() {
  const [openLetter, setOpenLetter] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [activeTab, setActiveTab] = useState<Category>('Tous');

  const activeLetter = LETTRES.find((l) => l.id === openLetter);

  const filtered =
    activeTab === 'Tous' ? LETTRES : LETTRES.filter((l) => l.category === activeTab);

  const handleOpen = (id: string) => {
    setFlipping(true);
    setTimeout(() => {
      setOpenLetter(id);
      setFlipping(false);
    }, 400);
  };

  const handleClose = () => {
    setFlipping(true);
    setTimeout(() => {
      setOpenLetter(null);
      setFlipping(false);
    }, 400);
  };

  return (
    <div style={S.page}>
      {!activeLetter ? (
        <>
          {/* Banner */}
          <div style={S.banner}>
            <span style={{ fontSize: 18 }}>💌</span>
            <h1 style={S.bannerTitle}>LETTRES</h1>
            <span style={{ fontSize: 18 }}>💌</span>
          </div>

          {/* Filter tabs */}
          <div style={S.filterBar}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={activeTab === cat ? S.tabActive : S.tabInactive}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Card list with flip wrapper */}
          <div style={{ padding: '10px 0', perspective: 800 }}>
            <div
              style={{
                transition: 'transform 400ms ease-in-out',
                transformStyle: 'preserve-3d',
                transform: flipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {filtered.map((lettre) => (
                <button
                  key={lettre.id}
                  onClick={() => lettre.unlocked && handleOpen(lettre.id)}
                  disabled={!lettre.unlocked}
                  style={{
                    ...S.card,
                    cursor: lettre.unlocked ? 'pointer' : 'default',
                    filter: lettre.unlocked
                      ? undefined
                      : 'brightness(0.75) saturate(0.6)',
                    textAlign: 'left' as const,
                  }}
                >
                  {/* Icon box */}
                  <div style={S.iconBox}>
                    <span>{lettre.unlocked ? lettre.emoji : '🔒'}</span>
                  </div>

                  {/* Center info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Category pill */}
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 5,
                        color: '#fff',
                        background: CATEGORY_COLORS[lettre.category],
                        borderRadius: 3,
                        padding: '2px 6px',
                      }}
                    >
                      {lettre.category.toUpperCase()}
                    </span>
                    {/* Title */}
                    <div style={S.cardTitle}>{lettre.title}</div>
                    {/* Subtitle */}
                    <div style={S.cardSubtitle}>
                      {lettre.unlocked
                        ? `De ${lettre.from}`
                        : "En attente d'envoi"}
                    </div>
                  </div>

                  {/* Right badge */}
                  <div style={{ flexShrink: 0 }}>
                    {lettre.unlocked ? (
                      lettre.isNew ? (
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 5,
                            background: '#4a6a2a',
                            color: '#90ee60',
                            borderRadius: 3,
                            padding: '3px 6px',
                          }}
                        >
                          NEW
                        </span>
                      ) : (
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 6,
                            background: 'linear-gradient(180deg, #f0c040 0%, #d4a017 100%)',
                            border: '1px solid #9a7010',
                            borderRadius: 3,
                            padding: '3px 8px',
                            color: '#2a1a08',
                          }}
                        >
                          DÉBLOQUÉ
                        </span>
                      )
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <span style={{ fontSize: 16 }}>🔒</span>
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 5,
                            color: '#8b2020',
                          }}
                        >
                          VERROUILLÉ
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Back button header */}
          <div
            style={{
              background: '#3d2010',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderBottom: '3px solid #1a0d05',
            }}
          >
            <button
              onClick={handleClose}
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
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: '#f0c040',
              }}
            >
              MOIS {activeLetter.month}
            </span>
          </div>

          {/* Open letter view */}
          <div style={{ padding: 12, perspective: 800 }}>
            <div
              style={{
                transition: 'transform 400ms ease-in-out',
                transformStyle: 'preserve-3d',
                transform: flipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Parchment card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f5e8c0 0%, #e8d5a0 100%)',
                  border: '2px solid #d4a017',
                  borderRadius: 8,
                  boxShadow:
                    '0 0 0 2px #1a0d05, 0 0 0 4px #d4a017, 0 0 0 6px #9a7010, 0 0 8px rgba(212,160,23,0.4), inset 0 0 0 1px #f0c040',
                  padding: 24,
                }}
              >
                {/* Month badge + REÇUE */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: '#7a5aab',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    💌 Lettre du Mois {activeLetter.month}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 5,
                      background: '#4a6a2a',
                      color: '#90ee60',
                      borderRadius: 3,
                      padding: '2px 8px',
                    }}
                  >
                    REÇUE
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 10,
                    color: '#2a1a08',
                    marginBottom: 4,
                  }}
                >
                  {activeLetter.title}
                </h2>

                {/* From / date */}
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 14,
                    color: '#8B5E2A',
                    fontStyle: 'italic',
                    marginBottom: 16,
                  }}
                >
                  De {activeLetter.from} — {activeLetter.date}
                </p>

                {/* Separator */}
                <div
                  style={{
                    height: 2,
                    background: '#3d2010',
                    opacity: 0.3,
                    marginBottom: 16,
                  }}
                />

                {/* Content */}
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 15,
                    color: '#4a3520',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {activeLetter.content}
                </p>

                {/* Footer seal */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 24,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: '#3d2010',
                      opacity: 0.5,
                      letterSpacing: 2,
                    }}
                  >
                    ✦ PÉTAOUCHNOK-LES-BAINS ✦
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
