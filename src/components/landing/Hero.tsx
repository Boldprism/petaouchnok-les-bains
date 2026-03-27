import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Fond vert village avec motif */}
      <div
        className="absolute inset-0 bg-vert-village opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, #4A9122 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4A9122 0%, transparent 50%)',
        }}
      />

      {/* Étoiles pixel décoratives */}
      <div className="absolute top-12 left-8 text-accent-or text-2xl animate-[pulse-gold_3s_ease-in-out_infinite]">
        ✦
      </div>
      <div className="absolute top-24 right-12 text-accent-or text-lg animate-[pulse-gold_3s_ease-in-out_infinite_0.5s]">
        ✦
      </div>
      <div className="absolute bottom-32 left-16 text-accent-or text-sm animate-[pulse-gold_3s_ease-in-out_infinite_1s]">
        ✦
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Titre pixel */}
        <h1
          className="text-accent-or leading-relaxed mb-6"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(14px, 4vw, 22px)',
            textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
          }}
        >
          PÉTAOUCHNOK
          <br />
          <span className="text-texte-clair" style={{ fontSize: 'clamp(10px, 2.5vw, 14px)' }}>
            LES-BAINS
          </span>
        </h1>

        {/* Sous-titre serif */}
        <p
          className="text-beige-clair text-lg md:text-xl mb-4 italic"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Un village. Un mystère. Une lettre par mois.
        </p>

        {/* Description */}
        <p
          className="text-texte-clair/80 text-sm md:text-base mb-10 leading-relaxed max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Chaque mois, une lettre physique arrive chez vous. Elle vient d&apos;un village qui
          n&apos;existe sur aucune carte. Et pourtant — quelque chose vous dit que vous y êtes
          déjà allé.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/inscription"
            className="pixel-btn pixel-btn--primary inline-block"
          >
            S&apos;abonner — 14,90€/mois
          </Link>
          <a
            href="#comment-ca-marche"
            className="text-beige-chemin text-sm hover:text-accent-or transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Découvrir le village ↓
          </a>
        </div>
      </div>

      {/* Ligne de sol pixel */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-vert-fonce" />
    </section>
  );
}
