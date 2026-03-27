'use client';

import { useState } from 'react';

const LETTRES = [
  {
    id: 'lettre-bienvenue',
    month: 1,
    title: 'La Lettre de Bienvenue',
    from: 'Fernand Plongeot, Maire',
    date: 'Le 1er du mois',
    unlocked: true,
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
    title: 'La Mélodie de la Source',
    from: 'Pip Minuscule',
    date: 'Le 1er du mois',
    unlocked: false,
    content: '',
  },
  {
    id: 'lettre-3',
    month: 3,
    title: 'Le Registre Disparu',
    from: 'Madeleine Épinette',
    date: 'Le 1er du mois',
    unlocked: false,
    content: '',
  },
];

export default function LettresPage() {
  const [openLetter, setOpenLetter] = useState<string | null>(null);

  const activeLetter = LETTRES.find((l) => l.id === openLetter);

  return (
    <div className="flex flex-col min-h-full p-4">
      <h1
        className="text-accent-or mb-6"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
      >
        LETTRES
      </h1>

      {!activeLetter ? (
        /* Letter list */
        <div className="flex flex-col gap-3">
          {LETTRES.map((lettre) => (
            <button
              key={lettre.id}
              onClick={() => lettre.unlocked && setOpenLetter(lettre.id)}
              className={`text-left bg-bg-sombre border-2 p-4 transition-colors ${
                lettre.unlocked
                  ? 'border-beige-chemin/30 hover:border-accent-or/40'
                  : 'border-ardoise/20 opacity-50'
              }`}
              style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
              disabled={!lettre.unlocked}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lettre.unlocked ? '💌' : '🔒'}</span>
                <div>
                  <h3
                    className="text-beige-clair"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: '1.6' }}
                  >
                    {lettre.title}
                  </h3>
                  <p
                    className="text-texte-clair/50 text-sm"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {lettre.unlocked ? `De ${lettre.from}` : `Mois ${lettre.month}`}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Open letter view */
        <div>
          <button
            onClick={() => setOpenLetter(null)}
            className="text-ardoise mb-4 flex items-center gap-1"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
          >
            ← Retour
          </button>

          <div
            className="p-6 border-2 border-beige-chemin/30"
            style={{
              background: 'linear-gradient(135deg, #E8D5A8 0%, #D4C098 100%)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <h2
              className="text-texte-sombre mb-1"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            >
              {activeLetter.title}
            </h2>
            <p
              className="text-texte-sombre/60 text-sm italic mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              De {activeLetter.from} — {activeLetter.date}
            </p>
            <div className="w-full h-px bg-texte-sombre/20 mb-4" />
            <p
              className="text-texte-sombre/80 text-sm leading-relaxed whitespace-pre-line"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {activeLetter.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
