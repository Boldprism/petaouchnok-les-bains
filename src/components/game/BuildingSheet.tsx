'use client';

import { useEffect, useState } from 'react';

interface Building {
  id: string;
  label: string;
  resident?: string | null;
}

interface BuildingSheetProps {
  building: Building | null;
  onClose: () => void;
}

const SIDE_SPRITES: Record<string, string> = {
  boulangerie: '/assets/buildings/side/boulangerie_side.png',
  mairie: '/assets/buildings/side/mairie_side.png',
  bibliotheque: '/assets/buildings/side/bibliotheque_side.png',
  epicerie: '/assets/buildings/side/epicerie_side.png',
  garage: '/assets/buildings/side/garage_side.png',
  fleuriste: '/assets/buildings/side/fleuriste_side.png',
  medecin: '/assets/buildings/side/medecin_side.png',
  hublot: '/assets/buildings/side/hublot_side.png',
  leonie: '/assets/buildings/side/leonie_side.png',
  bulletin: '/assets/buildings/side/bulletin_side.png',
  maurice: '/assets/buildings/side/maurice_side.png',
};

const BUILDING_INFO: Record<string, { description: string; actions: string[] }> = {
  mairie: {
    description:
      'Le bâtiment le plus imposant du village. Fernand Plongeot y règne depuis si longtemps que personne ne se souvient d\'une époque sans lui.',
    actions: ['Parler au Maire', 'Consulter le registre'],
  },
  boulangerie: {
    description:
      'Les croissants de Gaston ont un goût que personne n\'arrive à décrire. "C\'est l\'eau de la Source", dit-il en clignant de l\'œil.',
    actions: ['Acheter du pain', 'Mission : livraison'],
  },
  bibliotheque: {
    description:
      'Madeleine connaît chaque livre par cœur. Certains, dit-elle, changent de contenu quand on ne les regarde pas.',
    actions: ['Consulter un livre', 'Fragments de lore'],
  },
  epicerie: {
    description:
      'On y trouve tout ce dont on a besoin, et parfois des choses dont on ignorait avoir besoin.',
    actions: ['Acheter des semences', 'Acheter des outils'],
  },
  garage: {
    description:
      'Théodore Mâchefer répare tout, même les choses qui ne sont pas cassées. Surtout les choses qui ne sont pas cassées.',
    actions: ['Réparer un outil', 'Demander un conseil'],
  },
  fleuriste: {
    description:
      'Les fleurs de Rosalie poussent dans des couleurs qui n\'existent pas dans le spectre visible. Du moins, c\'est ce qu\'elle prétend.',
    actions: ['Acheter des fleurs', 'Mission : bouquet'],
  },
  medecin: {
    description:
      'Le Dr Carapasse soigne tout avec des tisanes à base d\'eau de la Source. Personne ne s\'en plaint.',
    actions: ['Consultation', 'Acheter une tisane'],
  },
  hublot: {
    description:
      'Le Professeur Hublot observe les étoiles depuis sa tour. Il dit qu\'elles bougent un peu plus vite au-dessus de Pétaouchnok.',
    actions: ['Monter au sommet', 'Observer les étoiles'],
  },
  leonie: {
    description:
      'Léonie Bontemps cuisine des gâteaux dont la recette change selon l\'humeur de la Source.',
    actions: ['Goûter un gâteau', 'Discuter'],
  },
  bulletin: {
    description:
      'Gustave Grenouillard rédige le journal du village. Ses sources sont confidentielles. Et imaginaires.',
    actions: ['Lire le bulletin', 'Proposer un scoop'],
  },
  maurice: {
    description:
      'Maurice Plongeur pêche au bord de la rivière. « La rivière connaît des histoires que la mer n\'a jamais entendues. »',
    actions: ['Pêcher ensemble', 'Écouter une histoire'],
  },
  source: {
    description:
      'Au centre du village coule la Source, une fontaine thermale dont l\'eau est légèrement dorée et sent vaguement la vanille. On dit qu\'elle porte bonheur.',
    actions: ['Récolter des Éclats', 'Méditer'],
  },
};

export default function BuildingSheet({ building, onClose }: BuildingSheetProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (building) {
      // Small delay for animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [building]);

  if (!building) return null;

  const info = BUILDING_INFO[building.id] || {
    description: 'Un lieu mystérieux du village...',
    actions: ['Explorer'],
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 z-20 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 bg-bg-sombre border-t-2 border-accent-or/30 rounded-t-2xl px-5 py-6 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '60vh' }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-ardoise/50 rounded-full mx-auto mb-4" />

        {/* Side-view sprite */}
        {SIDE_SPRITES[building.id] && (
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SIDE_SPRITES[building.id]}
              alt={building.label}
              data-pixel="true"
              className="h-24 w-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        )}

        {/* Title */}
        <h3
          className="text-accent-or mb-1"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}
        >
          {building.label}
        </h3>

        {building.resident && (
          <p
            className="text-beige-chemin text-sm mb-3"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Résident : {building.resident}
          </p>
        )}

        {/* Description */}
        <p
          className="text-texte-clair/70 text-sm leading-relaxed mb-5"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {info.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {info.actions.map((action) => (
            <button
              key={action}
              className="pixel-btn pixel-btn--secondary w-full text-left"
              style={{ fontSize: '9px' }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
