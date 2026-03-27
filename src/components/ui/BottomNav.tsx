'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/map', label: 'Map', icon: '🗺️' },
  { href: '/carnet', label: 'Carnet', icon: '📖' },
  { href: '/lettres', label: 'Lettres', icon: '💌' },
  { href: '/boutique', label: 'Boutique', icon: '🛒' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="h-16 bg-ardoise/90 backdrop-blur-sm border-t border-ardoise/40 flex items-center justify-around shrink-0"
      style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.3)' }}
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
            <span className={`text-xl ${isActive ? 'animate-[float_2s_ease-in-out_infinite]' : ''}`}>
              {tab.icon}
            </span>
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
