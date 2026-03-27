'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import BuildingSheet from '@/components/game/BuildingSheet';
import EclatCounter from '@/components/ui/EclatCounter';

const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-vert-village flex items-center justify-center">
      <p
        className="text-white"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
      >
        Chargement du village...
      </p>
    </div>
  ),
});

interface Building {
  id: string;
  label: string;
  resident?: string | null;
}

export default function MapPage() {
  const [activeBuilding, setActiveBuilding] = useState<Building | null>(null);

  return (
    <div className="relative w-full h-[calc(100dvh-64px)] overflow-hidden">
      {/* HUD — Éclats */}
      <div className="absolute top-3 left-3 z-10">
        <EclatCounter />
      </div>

      {/* Phaser */}
      <PhaserGame
        onBuildingClick={(building) => setActiveBuilding(building)}
        onSourceClick={() =>
          setActiveBuilding({ id: 'source', label: '✦ Source Thermale' })
        }
      />

      {/* Bottom sheet bâtiment */}
      <BuildingSheet
        building={activeBuilding}
        onClose={() => setActiveBuilding(null)}
      />
    </div>
  );
}
