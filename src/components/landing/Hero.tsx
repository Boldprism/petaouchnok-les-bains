import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1a2e1a 0%, #2d4a1e 40%, #1a3020 100%)',
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Étoiles pixel décoratives */}
      <div className="absolute top-12 left-8 text-[#F5C842] text-2xl animate-[pulse-gold_3s_ease-in-out_infinite]">
        ✦
      </div>
      <div className="absolute top-24 right-12 text-[#F5C842] text-lg animate-[pulse-gold_3s_ease-in-out_infinite_0.5s]">
        ✦
      </div>
      <div className="absolute bottom-40 left-16 text-[#F5C842] text-sm animate-[pulse-gold_3s_ease-in-out_infinite_1s]">
        ✦
      </div>
      <div className="absolute top-1/3 right-6 text-[#F5C842] text-xs animate-[pulse-gold_3s_ease-in-out_infinite_1.5s]">
        ✦
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/buildings/side/boulangerie_side.png"
        alt=""
        className="absolute bottom-6 left-[5%] h-[100px] md:h-[120px] w-auto opacity-90 animate-[float_4s_ease-in-out_infinite]"
        style={{
          imageRendering: 'pixelated',
          filter: 'drop-shadow(3px 4px 0px rgba(0,0,0,0.4))',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/buildings/side/mairie_side.png"
        alt=""
        className="absolute bottom-4 right-[15%] h-[110px] md:h-[130px] w-auto opacity-85 animate-[float_4s_ease-in-out_infinite_0.8s]"
        style={{
          imageRendering: 'pixelated',
          filter: 'drop-shadow(3px 4px 0px rgba(0,0,0,0.4))',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/buildings/side/bibliotheque_side.png"
        alt=""
        className="absolute bottom-8 right-[55%] md:right-[60%] h-[80px] md:h-[100px] w-auto opacity-75 animate-[float_4s_ease-in-out_infinite_1.5s]"
        style={{
          imageRendering: 'pixelated',
          filter: 'drop-shadow(3px 4px 0px rgba(0,0,0,0.4))',
        }}
      />

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
