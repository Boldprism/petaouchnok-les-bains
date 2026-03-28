'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav';
import MiniMap from '@/components/game/MiniMap';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';

  return (
    <div className="flex min-h-[100dvh] max-w-6xl mx-auto bg-bg-nuit">
      {/* Colonne gauche — minimap desktop (masquée sur mobile et sur /map) */}
      {!isMapPage && (
        <div className="hidden md:flex md:w-[430px] md:flex-shrink-0 md:sticky md:top-0 md:h-[100dvh] border-r border-[#6FB234]/30">
          <MiniMap />
        </div>
      )}

      {/* Colonne droite — contenu + nav */}
          <div className={`flex-1 flex flex-col h-dvh ${isMapPage ? 'max-w-[430px] md:max-w-none' : ''} mx-auto md:mx-0`}>
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
