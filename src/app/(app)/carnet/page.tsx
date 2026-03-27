'use client';

import { useState } from 'react';

const FILTERS = ['Tous', 'Mois 1', 'Personnages', 'Mystère'];

const FRAGMENTS = [
  {
    id: 'f1',
    title: 'La Fondation',
    category: 'Mystère',
    month: 1,
    unlocked: true,
    text: 'Pétaouchnok-les-Bains n\'apparaît sur aucune carte depuis 1924. Le dernier cartographe à l\'avoir mentionné s\'appelait Émile Vautour. Il n\'a jamais expliqué pourquoi il avait cessé.',
  },
  {
    id: 'f2',
    title: 'La Source',
    category: 'Mystère',
    month: 1,
    unlocked: true,
    text: 'L\'eau de la Source est légèrement dorée et sent vaguement la vanille. Les analyses chimiques ne révèlent rien d\'anormal. Pourtant, personne n\'arrive à la reproduire.',
  },
  {
    id: 'f3',
    title: 'Le Maire éternel',
    category: 'Personnages',
    month: 1,
    unlocked: true,
    text: 'Fernand Plongeot est maire depuis aussi longtemps que les registres existent. Quand on lui demande son âge, il répond : "Pertinent."',
  },
  {
    id: 'f4',
    title: 'La Mélodie',
    category: 'Mystère',
    month: 2,
    unlocked: false,
    text: '',
  },
  {
    id: 'f5',
    title: 'Les Éclats',
    category: 'Mystère',
    month: 1,
    unlocked: true,
    text: 'De petits fragments dorés, translucides, qu\'on trouve parfois au bord de la fontaine après une nuit de forte lune. Tout le monde les accepte. Personne ne sait pourquoi.',
  },
  {
    id: 'f6',
    title: 'Le Secret de Madeleine',
    category: 'Personnages',
    month: 3,
    unlocked: false,
    text: '',
  },
];

export default function CarnetPage() {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filtered = FRAGMENTS.filter((f) => {
    if (activeFilter === 'Tous') return true;
    if (activeFilter === 'Mois 1') return f.month === 1;
    return f.category === activeFilter;
  });

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1
        className="text-accent-or mb-4"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
      >
        CARNET DE LORE
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 px-3 py-1.5 border transition-colors ${
              activeFilter === f
                ? 'bg-accent-or/20 border-accent-or/50 text-accent-or'
                : 'bg-bg-sombre border-ardoise/30 text-texte-clair/50'
            }`}
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Fragment cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((fragment) => (
          <div
            key={fragment.id}
            className={`bg-bg-sombre border-2 p-4 relative ${
              fragment.unlocked ? 'border-accent-or/20' : 'border-ardoise/20'
            }`}
            style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
          >
            {/* Lock indicator */}
            {!fragment.unlocked && (
              <div className="absolute inset-0 bg-bg-sombre/80 backdrop-blur-sm flex items-center justify-center z-10">
                <span
                  className="text-ardoise"
                  style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px' }}
                >
                  ???
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-2">
              <h3
                className="text-beige-clair"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: '1.6' }}
              >
                {fragment.title}
              </h3>
              <span
                className="text-ardoise shrink-0 ml-2"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}
              >
                Mois {fragment.month}
              </span>
            </div>

            {fragment.unlocked && (
              <p
                className="text-texte-clair/70 text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {fragment.text}
              </p>
            )}

            <span
              className="inline-block mt-2 text-accent-mystere"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px' }}
            >
              {fragment.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
