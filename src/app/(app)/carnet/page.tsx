'use client';

import { useState } from 'react';

/* ─── DATA ─── */
interface Fragment {
  id: string;
  titre: string;
  niveau: number;
  source: string;
  unlocked: boolean;
  texte: string;
}

const FRAGMENTS: Fragment[] = [
  // NIVEAU 1 — Couleur locale
  { id: 'F001', titre: 'Le Règlement Municipal de 1962', niveau: 1, source: 'achat', unlocked: true,
    texte: "Article 7 : Il est interdit de prélever l'eau de la Source dans des récipients de plus de 50cl. Article 9 : Aucune autorisation spéciale n'a été délivrée depuis 1924." },
  { id: 'F002', titre: 'Journal de Viviane, semaine ordinaire', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Lundi : livré 47 courriers, 1 lettre pour Monsieur Trouffier (mort depuis 1991, je la glisse quand même). Mercredi : la lettre de Trouffier est revenue. Je vais la remettre demain." },
  { id: 'F003', titre: 'Recette secrète de Gaston', niveau: 1, source: 'achat', unlocked: true,
    texte: "Pain de Source : eau ordinaire 300ml + eau de Source 50ml. Ne jamais inverser les proportions. J'ai inversé une fois en 1998. Les clients ont pleuré en mangeant. Pas de tristesse. De reconnaissance." },
  { id: 'F004', titre: 'Diagnostic du Docteur Carapasse', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Patient : Fernand Plongeot. Symptôme : 'impression d'être observé par ma propre statue'. Diagnostic : changement de saison. Note personnelle : la statue a l'air différente ce matin. Je mets ça sur le changement de saison également." },
  { id: 'F005', titre: 'Extrait du Bulletin n°203', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Les horloges de la rue principale avancent toutes d'une seconde exactement. M. le Maire parle d'anomalie magnétique. Le Professeur Hublot parle de résonance temporelle de type 4. Les habitants parlent d'autre chose." },
  { id: 'F006', titre: 'Note de Madeleine, classée sous "divers"', niveau: 1, source: 'achat', unlocked: true,
    texte: "Livre rendu par Octave : page 47, quelqu'un a souligné 'résonance' et écrit en marge : 'pas alpin. pas thermal. autre chose.' L'écriture ressemble à celle d'Archibald. Octave dit qu'il ne se souvient pas d'avoir souligné quoi que ce soit." },
  { id: 'F007', titre: 'Message interne de Fernand', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Note de service : ne pas mentionner la valise du bureau du Maire. Ni son existence. Ni le fait qu'elle émet parfois un son. Ce son est climatique. — F.P." },
  { id: 'F008', titre: 'Dessin de Pip', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Dessin de la fontaine avec une spirale dorée au centre. Note de Colette : « Pip dit que c'est 'ce qu'il voit'. J'ai mis ça au mur. Ça me semblait important. »" },
  { id: 'F009', titre: 'Affiche du Marché de 1987', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Stand n°14 : objets trouvés. Propriétaire : inconnu. Horaires : variables. Note : ce stand n'était pas dans les inscriptions. Nous l'avons accepté quand même. Les objets exposés étaient très beaux." },
  { id: 'F010', titre: 'Léonie joue aux échecs', niveau: 1, source: 'evenement', unlocked: true,
    texte: "Partie du 14 mars. Blanc gagne en 23 coups. Noir gagne en 23 coups. Égalité parfaite. Troisième fois ce mois-ci. Instinct de secrétaire." },
  // NIVEAU 2 — Coïncidences troublantes
  { id: 'F011', titre: 'Carnet de Colette — mur des coïncidences', niveau: 2, source: 'evenement', unlocked: true,
    texte: "Connexion n°17 : les dates. Archibald fonde le village en 1743. Disparition : 1745. Premier Débordement : 1853 (108 ans après). Deuxième : 1961 (108 ans après). Prochain : cette année ? Je mets un point d'interrogation rouge." },
  { id: 'F012', titre: 'Lettre retrouvée dans la tournée de Viviane', niveau: 2, source: 'evenement', unlocked: true,
    texte: "Destinataire : Archibald Plongeot (mort en 1745). Contenu : « Tu avais raison sur le cycle. L'Écho se produit toujours au retour. Il ne saura pas qui il est au début — c'est voulu. Laisse la Source faire son travail. — V. »" },
  { id: 'F013', titre: 'Analyse du Professeur Hublot', niveau: 2, source: 'achat', unlocked: false, texte: '' },
  { id: 'F014', titre: 'Archives de la mairie, 1916', niveau: 2, source: 'evenement', unlocked: false, texte: '' },
  { id: 'F015', titre: 'Note de Madeleine, non classée', niveau: 2, source: 'achat', unlocked: false, texte: '' },
  { id: 'F016', titre: 'Lettre en latin pêchée par Maurice', niveau: 2, source: 'peche', unlocked: false, texte: '' },
  // NIVEAU 3
  { id: 'F021', titre: "Carnet d'Archibald, entrée n°1", niveau: 3, source: 'achat', unlocked: false, texte: '' },
  // NIVEAU 4
  { id: 'F036', titre: 'La clé rouillée', niveau: 4, source: 'chaine_narrative', unlocked: false, texte: '' },
  { id: 'F040', titre: 'La Page Arrachée', niveau: 4, source: 'chaine_narrative', unlocked: false, texte: '' },
  // NUITS DE LA SOURCE
  { id: 'NS001', titre: 'Nuit de la Source — I', niveau: 5, source: 'nuit_source', unlocked: false, texte: '' },
];

const SOURCE_BADGES: Record<string, { emoji: string; label: string }> = {
  achat: { emoji: '🏪', label: 'Commerce' },
  peche: { emoji: '🎣', label: 'Pêche' },
  evenement: { emoji: '⭐', label: 'Événement' },
  nuit_source: { emoji: '🌙', label: 'Nuit de la Source' },
  chaine_narrative: { emoji: '🔗', label: 'Chaîne narrative' },
};

const NIVEAU_LABELS: Record<number, string> = {
  1: 'Couleur locale',
  2: 'Coïncidences troublantes',
  3: 'Le fil d\'Archibald',
  4: 'Vérités enfouies',
  5: 'Nuit de la Source',
};

type FilterKey = 'Tous' | 'Niveau 1' | 'Niveau 2' | 'Mystère' | 'Pêche' | 'Nuit de la Source';
const FILTERS: FilterKey[] = ['Tous', 'Niveau 1', 'Niveau 2', 'Mystère', 'Pêche', 'Nuit de la Source'];

/* ─── PAGE ─── */
export default function CarnetPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('Tous');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalUnlocked = FRAGMENTS.filter((f) => f.unlocked).length;
  const total = 60;
  const progressPct = Math.round((totalUnlocked / total) * 100);

  const filtered = FRAGMENTS.filter((f) => {
    switch (activeFilter) {
      case 'Tous': return true;
      case 'Niveau 1': return f.niveau === 1;
      case 'Niveau 2': return f.niveau === 2;
      case 'Mystère': return f.niveau >= 3;
      case 'Pêche': return f.source === 'peche';
      case 'Nuit de la Source': return f.source === 'nuit_source';
      default: return true;
    }
  });

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto">

      {/* Header sticky */}
      <div
        className="sticky top-0 z-20 px-4 pt-3 pb-2"
        style={{ background: 'var(--app-bg-dark)' }}
      >
        <div className="flex items-baseline justify-between mb-1">
          <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--nav-active)' }}>
            CARNET DE LORE
          </h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--hud-lore)' }}>
            {totalUnlocked} / {total} fragments
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="mb-3"
          style={{ height: 8, background: '#5a3a10', border: '1px solid var(--card-border)' }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'var(--btn-gold-bg)',
              transition: 'width 300ms',
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 7,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                padding: '5px 10px',
                letterSpacing: 0.5,
                background: activeFilter === f ? 'var(--btn-gold-bg)' : 'rgba(0,0,0,0.3)',
                border: `2px solid ${activeFilter === f ? 'var(--btn-gold-border)' : 'rgba(255,255,255,0.15)'}`,
                boxShadow: activeFilter === f ? '2px 2px 0 var(--btn-gold-shadow)' : 'none',
                color: activeFilter === f ? 'var(--btn-gold-text)' : 'var(--nav-inactive)',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Fragment cards */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
        {filtered.map((fragment) => {
          const badge = SOURCE_BADGES[fragment.source];
          const isExpanded = expandedId === fragment.id;

          return (
            <button
              key={fragment.id}
              className="pixel-card relative overflow-hidden text-left w-full"
              style={{
                padding: 14,
                cursor: fragment.unlocked ? 'pointer' : 'default',
                opacity: fragment.unlocked ? 1 : 0.85,
              }}
              onClick={() => fragment.unlocked && setExpandedId(isExpanded ? null : fragment.id)}
            >
              {/* Locked overlay */}
              {!fragment.unlocked && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  style={{ background: 'rgba(200,176,80,0.75)' }}
                >
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 14, color: 'var(--card-border)' }}>
                    🔒 ???
                  </span>
                </div>
              )}

              {/* Header row */}
              <div className="flex items-start justify-between mb-1">
                <h3 style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 7,
                  lineHeight: '1.6',
                  color: 'var(--btn-gold-text)',
                  flex: 1,
                  marginRight: 8,
                }}>
                  {fragment.titre}
                </h3>
                <span
                  className="shrink-0"
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: 6,
                    color: 'var(--accent-mystere)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Niv. {fragment.niveau}
                </span>
              </div>

              {/* Niveau label */}
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: '#8B5E2A',
                marginBottom: fragment.unlocked && isExpanded ? 8 : 4,
              }}>
                {NIVEAU_LABELS[fragment.niveau]}
              </p>

              {/* Text — expanded */}
              {fragment.unlocked && isExpanded && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: '#4a3520',
                  lineHeight: 1.65,
                  marginBottom: 8,
                }}>
                  {fragment.texte}
                </p>
              )}

              {/* Footer — source badge */}
              {badge && (
                <div className="flex justify-end">
                  <span style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: 6,
                    color: '#8B5E2A',
                    background: 'rgba(139,94,42,0.12)',
                    border: '1px solid rgba(139,94,42,0.25)',
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                  }}>
                    {badge.emoji} {badge.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <p style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 8,
            color: 'var(--nav-inactive)',
            textAlign: 'center',
            padding: 32,
            opacity: 0.6,
          }}>
            Aucun fragment pour ce filtre
          </p>
        )}
      </div>
    </div>
  );
}
