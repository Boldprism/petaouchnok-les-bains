'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav';
import MiniMap from '@/components/game/MiniMap';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';

  return (
    <div className="flex w-full min-h-[100dvh] bg-bg-nuit md:max-w-6xl md:mx-auto">
      {/* Minimap desktop uniquement */}
      {!isMapPage && (
        <div className="hidden md:flex md:w-[430px] md:flex-shrink-0 md:sticky md:top-0 md:h-[100dvh] border-r border-[#6FB234]/30">
          <MiniMap />
        </div>
      )}

      {/* Colonne contenu */}
      <div className={`flex flex-col h-dvh ${isMapPage
          ? 'flex-1 max-w-[430px] md:max-w-none mx-auto md:mx-0'
          : 'w-full'
        }`}>
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}