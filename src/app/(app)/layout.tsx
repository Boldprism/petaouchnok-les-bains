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
    <div className="app-container flex flex-col w-full h-[100dvh] bg-[var(--app-bg)]">

      {/* ─── HEADER ─── */}
      <header
        className="shrink-0 flex items-center justify-between px-3"
        style={{
          height: 52,
          background: 'var(--app-bg-dark)',
          borderBottom: '2px solid var(--btn-gold-border)',
        }}
      >
        {/* Left — Logo */}
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 16 }}>🏠</span>
          <span
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 7,
              color: 'var(--nav-active)',
              letterSpacing: 1,
            }}
          >
            PÉTAOUCHNOK
          </span>
        </div>

        {/* Center — HUD Stats */}
        <div className="flex items-center gap-2">
          {/* Éclats */}
          <button
            className="flex items-center gap-1 px-2 py-1"
            onClick={() => setEclatsOpen(true)}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--hud-eclat)',
              fontFamily: 'var(--font-mono)',
              fontSize: 16,
              color: 'var(--hud-eclat)',
              cursor: 'pointer',
            }}
          >
            ✦ 245
          </button>
          {/* Lore */}
          <div
            className="flex items-center gap-1 px-2 py-1"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--hud-lore)',
              fontFamily: 'var(--font-mono)',
              fontSize: 16,
              color: 'var(--hud-lore)',
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
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--btn-gold-border)',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          🎒
        </button>
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
        <div className="relative z-[1]">
          {children}
        </div>
      </main>

      {/* ─── BOTTOM NAV ─── */}
      <nav
        className="shrink-0 flex items-center justify-around"
        style={{
          height: 64,
          background: 'var(--nav-bg)',
          borderTop: '3px solid var(--btn-gold-border)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
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
                  fontSize: isActive ? 25 : 22,
                  lineHeight: 1,
                  transition: 'font-size 150ms',
                  ...(isActive
                    ? {
                        background: 'rgba(200,160,48,0.2)',
                        border: '1px solid var(--nav-active)',
                        borderRadius: 4,
                        padding: '3px 6px',
                      }
                    : { padding: '3px 6px', opacity: 0.6 }),
                }}
              >
                {tab.emoji}
              </span>
              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: 6,
                  color: isActive ? 'var(--nav-active)' : 'var(--nav-inactive)',
                  opacity: isActive ? 1 : 0.6,
                  letterSpacing: 0.5,
                }}
              >
                [{tab.label}]
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ─── MODAL INVENTAIRE ─── */}
      <ModalInventaire open={inventaireOpen} onClose={() => setInventaireOpen(false)} />
      <ModalEclats open={eclatsOpen} onClose={() => setEclatsOpen(false)} />
    </div>
  );
}
