'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/ui/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-bg-nuit">
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
