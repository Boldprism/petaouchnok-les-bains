'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/map', label: 'Map', sprite: '/assets/buildings/topdown/mairie_topdown.png' },
  { href: '/carnet', label: 'Carnet', sprite: '/assets/buildings/topdown/bibliotheque_topdown.png' },
  { href: '/lettres', label: 'Lettres', sprite: '/assets/buildings/topdown/bulletin_topdown.png' },
  { href: '/boutique', label: 'Boutique', sprite: '/assets/buildings/topdown/epicerie_topdown.png' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="h-16 bg-ardoise/90 backdrop-blur-sm border-t border-ardoise/40 flex items-center justify-around shrink-0"
      style={{
        boxShadow: '0 -2px 8px rgba(0,0,0,0.3)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 min-w-[60px] py-2 transition-transform ${
              isActive ? 'scale-110' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tab.sprite}
              alt={tab.label}
              className={isActive ? 'animate-[float_2s_ease-in-out_infinite]' : 'opacity-60'}
              style={{
                width: 24,
                height: 24,
                imageRendering: 'pixelated',
                objectFit: 'contain',
              }}
            />
            <span
              className={isActive ? 'text-accent-or' : 'text-texte-clair/50'}
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px' }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
