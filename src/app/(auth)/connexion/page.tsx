'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // TODO: Supabase auth
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    router.push('/map');
  };

  return (
    <div
      className="min-h-dvh p-6 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #2A2D3E 0%, #1A1C2C 100%)',
      }}
    >
      <div className="w-full max-w-sm">
        <h1
          className="text-accent-or text-center mb-2"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
        >
          CONNEXION
        </h1>
        <p
          className="text-texte-clair/50 text-center text-sm mb-8"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Retour au village
        </p>

        <form
          onSubmit={handleLogin}
          className="bg-bg-sombre border-2 border-beige-chemin/20 p-6"
          style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
        >
          {error && (
            <p className="text-brique text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              {error}
            </p>
          )}

          <label
            className="block text-texte-clair/70 text-sm mb-1"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="villageois@petaouchnok.fr"
            className="w-full bg-bg-nuit border-2 border-ardoise/30 text-texte-clair px-3 py-2 mb-4 text-sm focus:border-accent-or/50 focus:outline-none"
            style={{ fontFamily: 'var(--font-body)' }}
          />

          <label
            className="block text-texte-clair/70 text-sm mb-1"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-bg-nuit border-2 border-ardoise/30 text-texte-clair px-3 py-2 mb-6 text-sm focus:border-accent-or/50 focus:outline-none"
            style={{ fontFamily: 'var(--font-body)' }}
          />

          <button type="submit" className="pixel-btn pixel-btn--primary w-full mb-4">
            Entrer au village
          </button>

          <p className="text-center text-texte-clair/40 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Pas encore inscrit ?{' '}
            <Link href="/inscription" className="text-accent-or hover:underline">
              S&apos;abonner
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
