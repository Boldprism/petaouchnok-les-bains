import Link from 'next/link';

const BUILDINGS = [
  { name: 'bibliotheque', h: 80, opacity: 0.6, delay: '0s' },
  { name: 'fleuriste',    h: 70, opacity: 0.6, delay: '0.4s' },
  { name: 'boulangerie',  h: 110, opacity: 0.9, delay: '0.8s' },
  { name: 'mairie',       h: 120, opacity: 1,   delay: '1.2s' },
  { name: 'hublot',       h: 95, opacity: 0.9, delay: '1.6s' },
  { name: 'epicerie',     h: 75, opacity: 0.6, delay: '2.0s' },
  { name: 'medecin',      h: 70, opacity: 0.6, delay: '2.4s' },
];

const STARS = [
  { top: '8%',  left: '6%',  size: 10, delay: '0s' },
  { top: '12%', right: '10%', size: 8,  delay: '0.5s' },
  { top: '25%', left: '15%', size: 6,  delay: '1s' },
  { top: '20%', right: '5%', size: 7,  delay: '1.5s' },
  { top: '40%', left: '3%',  size: 9,  delay: '0.3s' },
  { top: '35%', right: '18%', size: 6, delay: '0.8s' },
  { top: '55%', left: '20%', size: 8,  delay: '1.2s' },
  { top: '50%', right: '8%', size: 10, delay: '1.8s' },
  { top: '65%', left: '10%', size: 7,  delay: '2.1s' },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d4a1e 40%, #1a3020 100%)',
      }}
    >
      {/* Float animation for buildings */}
      <style>{`
        @keyframes building-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Étoiles pixel décoratives */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute text-[#F5C842] animate-[pulse-gold_3s_ease-in-out_infinite]"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            fontSize: `${star.size}px`,
            animationDelay: star.delay,
          }}
        >
          ✦
        </div>
      ))}

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(111,178,52,0.2)',
            border: '1px solid rgba(111,178,52,0.4)',
            color: '#6FB234',
            fontFamily: 'var(--font-pixel)',
            fontSize: '7px',
            padding: '5px 10px',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}
        >
          📮 BOX D&apos;ABONNEMENT MENSUELLE
        </div>

        {/* Titre pixel — une seule ligne */}
        <h1
          className="text-[#F5C842] leading-relaxed mb-6 whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(10px, 3.2vw, 18px)',
            textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
          }}
        >
          PÉTAOUCHNOK-LES-BAINS
        </h1>

        {/* Sous-titre serif */}
        <p
          className="text-[#E8D5A8] text-lg md:text-xl mb-4 italic"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Un village. Un mystère. Une lettre par mois.
        </p>

        {/* Description */}
        <p
          className="text-[#F0EAD6]/80 text-sm md:text-base mb-10 leading-relaxed max-w-md mx-auto"
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
            className="text-[#C8A96E] text-sm hover:text-[#F5C842] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Découvrir le village ↓
          </a>
        </div>
      </div>

      {/* Bâtiments side-view flottants en bas */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-end gap-2 px-4">
        {BUILDINGS.map((b) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.name}
            src={`/assets/buildings/side/${b.name}_side.png`}
            alt=""
            style={{
              height: `${b.h}px`,
              width: 'auto',
              opacity: b.opacity,
              imageRendering: 'pixelated' as const,
              filter: 'drop-shadow(3px 4px 0px rgba(0,0,0,0.4))',
              animation: `building-float 4s ease-in-out infinite`,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>

      {/* Bande pixel art herbe en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            #6FB234 0px, #6FB234 4px,
            #4A9122 4px, #4A9122 8px,
            #6FB234 8px, #6FB234 16px,
            #5a9e2a 16px, #5a9e2a 20px
          )`,
          borderTop: '2px solid #4A9122',
        }}
      />
    </section>
  );
}
