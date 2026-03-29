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
    <div className="w-full flex-1 flex flex-col p-4 overflow-y-auto">
      <h1
        className="text-accent-or mb-4"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
      >
        CARNET DE LORE
      </h1>

      {/* Filters — sticky */}
      <div
        className="flex gap-2 mb-6 overflow-x-auto pb-2 sticky top-0 z-20"
        style={{ background: 'var(--color-bg-nuit, #0d1117)', paddingTop: '4px' }}
      >     {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setActiveFilter(f)}
          className="shrink-0 transition-colors" style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '9px',
            whiteSpace: 'nowrap',
            background: activeFilter === f ? 'rgba(212,170,80,0.2)' : 'transparent',
            border: activeFilter === f ? '2px solid rgba(212,170,80,0.6)' : '2px solid rgba(255,255,255,0.25)',
            color: activeFilter === f ? '#d4aa50' : 'rgba(220,210,195,0.85)',
            padding: '6px 12px',
          }}
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
            className="p-4 relative overflow-hidden"
            style={{
              background: '#f5ead8',
              color: '#2a1a0a',
              border: fragment.unlocked ? '2px solid #c8a96e' : '2px solid #a0937e',
              boxShadow: '3px 3px 0px #8b6914',
            }}
          >
            {/* Lock indicator — uniquement si verrouillé */}
            {!fragment.unlocked && (
              <div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{ background: 'rgba(245,234,216,0.92)' }}
              >
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: '#a0937e' }}>
                  ???
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-2">
              <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: '1.6', color: '#2a1a0a' }}>
                {fragment.title}
              </h3>
              <span className="shrink-0 ml-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#8b6914' }}>
                Mois {fragment.month}
              </span>
            </div>

            {fragment.unlocked && (
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: '#4a3520' }}>
                {fragment.text}
              </p>
            )}

            <span className="inline-block mt-2" style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', color: '#7b5ea7' }}>
              {fragment.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
