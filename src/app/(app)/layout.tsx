'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav';
import MiniMap from '@/components/game/MiniMap';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';

  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-bg-nuit">
      {/* Zone principale — flex row */}
      <div className="flex flex-1 min-h-0">
        {/* Minimap desktop — masquée sur /map */}
        {!isMapPage && (
          <div className="hidden md:flex md:w-[430px] md:flex-shrink-0 md:sticky md:top-0 md:h-[calc(100dvh-64px)] border-r border-[#6FB234]/30">
            <MiniMap />
          </div>
        )}

        {/* Contenu — toujours flex-1 */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* BottomNav — toujours pleine largeur */}
      <BottomNav />
    </div>
  );
}