'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ModalInventaire from '@/components/ui/ModalInventaire';
import ModalEclats from '@/components/ui/ModalEclats';

/* ─── NAV TABS ─── */
const tabs = [
  { href: '/village',   emoji: '\u{1F5FA}\uFE0F', label: 'VILLAGE' },
  { href: '/jardin',    emoji: '\u{1F33E}',        label: 'JARDIN' },
  { href: '/commerces', emoji: '\u{1F3EA}',        label: 'COMMERCES' },
  { href: '/carnet',    emoji: '\u{1F4DC}',        label: 'CARNET' },
  { href: '/lettres',   emoji: '\u{1F48C}',        label: 'LETTRES' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [inventaireOpen, setInventaireOpen] = useState(false);
  const [eclatsOpen, setEclatsOpen] = useState(false);

  return (
    <div
      className="app-container flex flex-col w-full h-[100dvh]"
      style={{
        backgroundImage: "url('/assets/ui/bg-wood.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        imageRendering: 'pixelated',
      }}
    >

      {/* ─── HEADER ─── */}
      <header
        className="shrink-0 flex items-center justify-center px-3"
        style={{
          height: 52,
          background: '#0e0704',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Bandeau parchemin */}
        <div
          className="flex items-center justify-between w-full"
          style={{
            position: 'relative',
            background: '#e8d8a0',
            borderTop: '2px solid #c8b060',
            borderBottom: '2px solid #c8b060',
            height: 36,
            padding: '0 20px',
          }}
        >
          {/* Épingle gauche */}
          <div
            style={{
              position: 'absolute',
              left: -4,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 10,
              height: 10,
              background: '#d4a017',
              border: '1px solid #9a7010',
              borderRadius: '50%',
              zIndex: 5,
            }}
          />
          {/* Épingle droite */}
          <div
            style={{
              position: 'absolute',
              right: -4,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 10,
              height: 10,
              background: '#d4a017',
              border: '1px solid #9a7010',
              borderRadius: '50%',
              zIndex: 5,
            }}
          />

          {/* Left — Logo */}
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 16 }}>🏠</span>
            <span
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 7,
                color: '#3a1f08',
                letterSpacing: 2,
              }}
            >
              PÉTAOUCHNOK
            </span>
          </div>

          {/* Center — HUD Stats */}
          <div className="flex items-center gap-2">
            {/* Éclats */}
            <button
              className="flex items-center gap-1"
              onClick={() => setEclatsOpen(true)}
              style={{
                background: '#d4b870',
                borderRadius: 3,
                padding: '4px 10px',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                color: '#2a1408',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ✦ 245
            </button>
            {/* Lore */}
            <div
              className="flex items-center gap-1"
              style={{
                background: '#d4b870',
                borderRadius: 3,
                padding: '4px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                color: '#2a1408',
                fontWeight: 'bold',
              }}
            >
              📜 12/60
            </div>
          </div>

          {/* Right — Inventaire */}
          <button
            className="flex items-center justify-center"
            onClick={() => setInventaireOpen(true)}
            style={{
              width: 32,
              height: 32,
              background: '#d4b870',
              border: 'none',
              borderRadius: 3,
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            🎒
          </button>
        </div>

      </header>

      {/* ─── CONTENT ─── */}
      <main className="scrollable-zone flex-1 min-h-0 relative">
        {/* Pixel dot pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            opacity: 0.05,
          }}
        />
        <div className="relative z-[1] h-full">
          {children}
        </div>
      </main>

      {/* ─── BOTTOM NAV ─── */}
      <nav
        className="shrink-0"
        style={{
          height: 72,
          position: 'relative',
          overflow: 'visible',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Fond navbar en 3 parties — coins fixes, centre répété */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          zIndex: 0,
          pointerEvents: 'none',
        }}>
          {/* Coin gauche — fixe */}
          <img
            src="/assets/ui/navbar-left.png"
            alt=""
            style={{
              height: '100%',
              width: 'auto',
              imageRendering: 'pixelated',
              flexShrink: 0,
            }}
          />
          {/* Centre — s'étire */}
          <div style={{
            flex: 1,
            backgroundImage: "url('/assets/ui/navbar-center.png')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            imageRendering: 'pixelated',
          }} />
          {/* Coin droit — fixe */}
          <img
            src="/assets/ui/navbar-right.png"
            alt=""
            style={{
              height: '100%',
              width: 'auto',
              imageRendering: 'pixelated',
              flexShrink: 0,
            }}
          />
        </div>
        {/* Tabs */}
        <div
          className="flex items-center justify-around"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
          }}
        >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5"
              style={{ minWidth: 56 }}
            >
              {/* Emoji with active capsule */}
              <span
                style={{
                  fontSize: isActive ? 28 : 24,
                  lineHeight: 1,
                  transition: 'font-size 150ms',
                  ...(isActive
                    ? {
                        background: 'rgba(200,160,48,0.2)',
                        border: '1px solid var(--nav-active)',
                        borderRadius: 4,
                        padding: '3px 6px',
                      }
                    : { padding: '3px 6px', opacity: 0.75 }),
                }}
              >
                {tab.emoji}
              </span>
              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 9,
                  color: isActive ? '#f0c040' : '#e8d8b0',
                  opacity: isActive ? 1 : 0.85,
                  letterSpacing: 0.5,
                  textShadow: isActive
                    ? '1px 1px 0 #000, -1px -1px 0 #000, 0 0 6px rgba(240,192,64,0.6)'
                    : '1px 1px 0 #000, -1px -1px 0 #000',
                }}
              >
                [{tab.label}]
              </span>
            </Link>
          );
        })}
        </div>
      </nav>

      {/* ─── MODAL INVENTAIRE ─── */}
      <ModalInventaire open={inventaireOpen} onClose={() => setInventaireOpen(false)} />
      <ModalEclats open={eclatsOpen} onClose={() => setEclatsOpen(false)} />
    </div>
  );
}
