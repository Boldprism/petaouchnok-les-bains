'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ANIMALS = [
  { id: 'loutre', emoji: '🦦', name: 'Loutre' },
  { id: 'herisson', emoji: '🦔', name: 'Hérisson' },
  { id: 'papillon', emoji: '🦋', name: 'Papillon' },
  { id: 'souris', emoji: '🐭', name: 'Souris' },
  { id: 'renard', emoji: '🦊', name: 'Renard' },
  { id: 'hibou', emoji: '🦉', name: 'Hibou' },
  { id: 'grenouille', emoji: '🐸', name: 'Grenouille' },
  { id: 'ecureuil', emoji: '🐿️', name: 'Écureuil' },
];

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prenom, setPrenom] = useState('');
  const [animal, setAnimal] = useState('');
  const [adresse, setAdresse] = useState({
    nom: '',
    rue: '',
    cp: '',
    ville: '',
    pays: 'France',
  });

  const handleSubmit = () => {
    // TODO: Create Supabase account + save data
    router.push('/map');
  };

  return (
    <div
      className="min-h-dvh p-6 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #2A2D3E 0%, #1A1C2C 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <h1
          className="text-accent-or text-center mb-2"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
        >
          INSCRIPTION
        </h1>
        <p
          className="text-texte-clair/50 text-center text-sm mb-8"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Étape {step} sur 2
        </p>

        {step === 1 ? (
          /* Step 1 — Personnage */
          <div
            className="bg-bg-sombre border-2 border-beige-chemin/20 p-6"
            style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
          >
            <h2
              className="text-beige-clair mb-4"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            >
              TON PERSONNAGE
            </h2>

            {/* Prénom */}
            <label
              className="block text-texte-clair/70 text-sm mb-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Choisis un prénom
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom au village"
              className="w-full bg-bg-nuit border-2 border-ardoise/30 text-texte-clair px-3 py-2 mb-6 text-sm focus:border-accent-or/50 focus:outline-none"
              style={{ fontFamily: 'var(--font-body)' }}
            />

            {/* Animal grid */}
            <label
              className="block text-texte-clair/70 text-sm mb-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Choisis ton animal
            </label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {ANIMALS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAnimal(a.id)}
                  className={`flex flex-col items-center gap-1 p-3 border-2 transition-colors ${
                    animal === a.id
                      ? 'border-accent-or bg-accent-or/10'
                      : 'border-ardoise/20 hover:border-ardoise/40'
                  }`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <span
                    className="text-texte-clair/60"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px' }}
                  >
                    {a.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => prenom && animal && setStep(2)}
              disabled={!prenom || !animal}
              className="pixel-btn pixel-btn--primary w-full disabled:opacity-40"
            >
              Confirmer mon personnage
            </button>
          </div>
        ) : (
          /* Step 2 — Adresse */
          <div
            className="bg-bg-sombre border-2 border-beige-chemin/20 p-6"
            style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
          >
            <h2
              className="text-beige-clair mb-4"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            >
              TON ADRESSE
            </h2>
            <p
              className="text-texte-clair/50 text-sm mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Pour recevoir tes lettres du village
            </p>

            {[
              { key: 'nom', label: 'Prénom / Nom', placeholder: 'Marie Dupont' },
              { key: 'rue', label: 'Adresse', placeholder: '12 rue des Éclats' },
              { key: 'cp', label: 'Code postal', placeholder: '75001' },
              { key: 'ville', label: 'Ville', placeholder: 'Paris' },
              { key: 'pays', label: 'Pays', placeholder: 'France' },
            ].map((field) => (
              <div key={field.key} className="mb-3">
                <label
                  className="block text-texte-clair/70 text-xs mb-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  value={adresse[field.key as keyof typeof adresse]}
                  onChange={(e) =>
                    setAdresse((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className="w-full bg-bg-nuit border-2 border-ardoise/30 text-texte-clair px-3 py-2 text-sm focus:border-accent-or/50 focus:outline-none"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            ))}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="pixel-btn pixel-btn--secondary flex-1"
              >
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={!adresse.nom || !adresse.rue || !adresse.cp || !adresse.ville}
                className="pixel-btn pixel-btn--primary flex-1 disabled:opacity-40"
              >
                M&apos;installer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
