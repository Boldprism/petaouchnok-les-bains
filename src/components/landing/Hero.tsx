'use client';

import { useEffect, useRef } from 'react';

const BUILDINGS_BG = [
  { file: 'bibliotheque_side', h: 55, delay: '0s', x: '3%' },
  { file: 'leonie_side', h: 50, delay: '2s', x: '18%' },
  { file: 'bulletin_side', h: 48, delay: '1s', x: '72%' },
  { file: 'medecin_side', h: 52, delay: '3s', x: '88%' },
];

const BUILDINGS_MID = [
  { file: 'fleuriste_side', h: 80, delay: '0.5s', x: '8%' },
  { file: 'garage_side', h: 85, delay: '1.5s', x: '78%' },
  { file: 'epicerie_side', h: 78, delay: '2.5s', x: '62%' },
];

const BUILDINGS_FG = [
  { file: 'boulangerie_side', h: 130, delay: '1s', x: '12%' },
  { file: 'mairie_side', h: 145, delay: '0s', x: '30%' },
  { file: 'hublot_side', h: 120, delay: '2s', x: '64%' },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Particules Éclats de Source
    const particles: { x: number; y: number; size: number; speed: number; opacity: number; drift: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        drift: (Math.random() - 0.5) * 0.3,
      });
    }

    let animId: number;
    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

        const pulse = (Math.sin(t * 2 + p.x) + 1) / 2;
        ctx.save();
        ctx.globalAlpha = p.opacity * (0.5 + pulse * 0.5);
        ctx.fillStyle = '#F5C842';
        ctx.font = `${p.size * 4}px monospace`;
        ctx.fillText('✦', p.x, p.y);
        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #0d1a0d 0%, #1a3010 25%, #2d4a1e 55%, #3d6128 75%, #4a7a30 90%, #6FB234 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Canvas particules */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />

      {/* Halo Source thermale */}
      <div style={{
        position: 'absolute',
        bottom: '28%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(245,200,66,0.18) 0%, rgba(245,200,66,0.06) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        animation: 'pulseGlow 4s ease-in-out infinite',
      }} />

      {/* Brume atmosphérique */}
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: 0, right: 0,
        height: 120,
        background: 'linear-gradient(180deg, transparent 0%, rgba(45,74,30,0.7) 60%, rgba(45,74,30,0.95) 100%)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {/* COUCHE 1 — bâtiments arrière-plan */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(18% + 8px)',
        left: 0, right: 0,
        height: 70,
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 4,
        filter: 'brightness(0.4) blur(1.5px)',
        opacity: 0.6,
      }}>
        {BUILDINGS_BG.map((b, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={`/assets/buildings/side/${b.file}.png`}
            style={{ position: 'absolute', left: b.x, height: b.h, imageRendering: 'pixelated', bottom: 0, animation: `float 6s ease-in-out ${b.delay} infinite` }}
            alt="" />
        ))}
      </div>

      {/* COUCHE 2 — bâtiments milieu */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(18% + 4px)',
        left: 0, right: 0,
        height: 100,
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 5,
        filter: 'brightness(0.65)',
        opacity: 0.8,
      }}>
        {BUILDINGS_MID.map((b, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={`/assets/buildings/side/${b.file}.png`}
            style={{ position: 'absolute', left: b.x, height: b.h, imageRendering: 'pixelated', bottom: 0, animation: `float 5s ease-in-out ${b.delay} infinite` }}
            alt="" />
        ))}
      </div>

      {/* COUCHE 3 — bâtiments premier plan */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        left: 0, right: 0,
        height: 160,
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 6,
      }}>
        {BUILDINGS_FG.map((b, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={`/assets/buildings/side/${b.file}.png`}
            style={{ position: 'absolute', left: b.x, height: b.h, imageRendering: 'pixelated', bottom: 0, filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.6))', animation: `float 4s ease-in-out ${b.delay} infinite` }}
            alt="" />
        ))}
      </div>

      {/* Bande herbe multicouche */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 7 }}>
        <div style={{ height: 8, background: '#4a9122' }} />
        <div style={{ height: 14, background: '#5aa828' }} />
        <div style={{ height: 20, background: '#6FB234' }} />
        <div style={{ height: 8, background: '#7fc847' }} />
      </div>

      {/* CONTENU centré */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 200px',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(111,178,52,0.15)',
          border: '1px solid rgba(111,178,52,0.5)',
          color: '#7fc847',
          fontFamily: 'var(--font-pixel)',
          fontSize: 7,
          padding: '6px 14px',
          marginBottom: 28,
          letterSpacing: 2,
        }}>
          ✦ BOX D&apos;ABONNEMENT MENSUELLE ✦
        </div>

        {/* Titre avec ombre profonde */}
        <h1 style={{
          fontFamily: 'var(--font-pixel)',
          color: '#F5C842',
          fontSize: 'clamp(16px, 3vw, 28px)',
          lineHeight: 1.7,
          marginBottom: 4,
          textShadow: '0 0 40px rgba(245,200,66,0.4), 4px 4px 0 rgba(0,0,0,0.8), 8px 8px 0 rgba(0,0,0,0.3)',
          animation: 'titleGlow 4s ease-in-out infinite',
        }}>
          PÉTAOUCHNOK-LES-BAINS
        </h1>

        {/* Ligne décorative */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, transparent, #C8A96E)' }} />
          <span style={{ color: '#F5C842', fontSize: 10 }}>✦</span>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, #C8A96E, transparent)' }} />
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          color: '#F0EAD6',
          fontSize: 'clamp(16px, 2vw, 22px)',
          marginBottom: 20,
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        }}>
          Un village. Un mystère. Une lettre par mois.
        </p>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#F0EAD6',
          fontSize: 13,
          lineHeight: 1.9,
          opacity: 0.75,
          marginBottom: 40,
          maxWidth: 420,
          textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
        }}>
          Chaque mois, une lettre physique arrive chez vous. Elle vient d&apos;un village
          qui n&apos;existe sur aucune carte. Et pourtant — quelque chose vous dit que
          vous y êtes déjà allé.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <button className="pixel-btn pixel-btn--primary" style={{
            fontSize: 10,
            padding: '16px 32px',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.5), 0 0 30px rgba(245,200,66,0.3)',
          }}>
            S&apos;ABONNER — 14,90€/MOIS
          </button>
          <a href="#features" style={{
            fontFamily: 'var(--font-body)',
            color: '#C8A96E',
            fontSize: 13,
            opacity: 0.8,
            textDecoration: 'none',
            animation: 'bounce 2s ease-in-out infinite',
          }}>
            Découvrir le village ↓
          </a>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 40px rgba(245,200,66,0.3), 4px 4px 0 rgba(0,0,0,0.8); }
          50% { text-shadow: 0 0 60px rgba(245,200,66,0.6), 4px 4px 0 rgba(0,0,0,0.8); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}
