'use client';

const BUILDINGS = [
  { file: 'bibliotheque_side', height: 80, opacity: 0.6, delay: '0s' },
  { file: 'fleuriste_side',    height: 70, opacity: 0.6, delay: '0.4s' },
  { file: 'boulangerie_side',  height: 110, opacity: 1,  delay: '0.8s' },
  { file: 'mairie_side',       height: 120, opacity: 1,  delay: '1.2s' },
  { file: 'hublot_side',       height: 95, opacity: 1,  delay: '1.6s' },
  { file: 'epicerie_side',     height: 75, opacity: 0.6, delay: '2.0s' },
  { file: 'medecin_side',      height: 70, opacity: 0.6, delay: '2.4s' },
];

const STARS = [
  { top: '8%',  left: '4%',  size: 10, delay: '0s' },
  { top: '15%', left: '92%', size: 10, delay: '1.2s' },
  { top: '6%',  left: '78%', size: 7,  delay: '0.6s' },
  { top: '72%', left: '3%',  size: 7,  delay: '2s' },
  { top: '30%', left: '97%', size: 7,  delay: '1.8s' },
  { top: '50%', left: '8%',  size: 6,  delay: '0.3s' },
  { top: '22%', left: '50%', size: 6,  delay: '2.4s' },
  { top: '40%', left: '18%', size: 6,  delay: '1.5s' },
  { top: '65%', left: '85%', size: 6,  delay: '0.9s' },
];

export default function Hero() {
  return (
    <section style={{
      background: '#1a2e1a',
      minHeight: '100dvh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px 0',
    }}>

      {/* Étoiles */}
      {STARS.map((s, i) => (
        <span key={i} style={{
          position: 'absolute',
          top: s.top,
          left: s.left,
          color: '#F5C842',
          fontSize: s.size,
          animation: `twinkle 3s ease-in-out ${s.delay} infinite`,
          pointerEvents: 'none',
        }}>✦</span>
      ))}

      {/* Halo central */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 350,
        background: 'radial-gradient(ellipse, rgba(245,200,66,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Contenu centré */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: 580 }}>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(111,178,52,0.2)',
          border: '1px solid rgba(111,178,52,0.4)',
          color: '#6FB234',
          fontFamily: 'var(--font-pixel)',
          fontSize: 7,
          padding: '5px 10px',
          marginBottom: 20,
          letterSpacing: 1,
        }}>
          📮 BOX D&apos;ABONNEMENT MENSUELLE
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          color: '#F5C842',
          fontSize: 'clamp(14px, 2.5vw, 22px)',
          lineHeight: 1.6,
          marginBottom: 8,
          textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
        }}>
          PÉTAOUCHNOK-LES-BAINS
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          color: '#F0EAD6',
          fontSize: 18,
          marginBottom: 20,
          opacity: 0.9,
        }}>
          Un village. Un mystère. Une lettre par mois.
        </p>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#F0EAD6',
          fontSize: 13,
          lineHeight: 1.8,
          opacity: 0.7,
          marginBottom: 36,
          maxWidth: 440,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Chaque mois, une lettre physique arrive chez vous. Elle vient d&apos;un village
          qui n&apos;existe sur aucune carte. Et pourtant — quelque chose vous dit que
          vous y êtes déjà allé.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button className="pixel-btn pixel-btn--primary" style={{ fontSize: 9, padding: '14px 28px' }}>
            S&apos;ABONNER — 14,90€/MOIS
          </button>
          <a href="#features" style={{
            fontFamily: 'var(--font-body)',
            color: '#C8A96E',
            fontSize: 12,
            opacity: 0.8,
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            Découvrir le village ↓
          </a>
        </div>
      </div>

      {/* Bâtiments */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        marginTop: 40,
        height: 160,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: '0 5%',
      }}>
        {BUILDINGS.map((b, i) => (
          <div key={i} style={{
            opacity: b.opacity,
            animation: `float 4s ease-in-out ${b.delay} infinite`,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/buildings/side/${b.file}.png`}
              height={b.height}
              alt=""
              style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
            />
          </div>
        ))}
      </div>

      {/* Bande herbe */}
      <div style={{
        width: '100%',
        height: 18,
        background: '#6FB234',
        flexShrink: 0,
        borderTop: '4px solid #7fc847',
      }} />

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}
