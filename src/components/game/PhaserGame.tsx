'use client';

import { useEffect, useRef } from 'react';

interface BuildingEvent {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface PhaserGameProps {
  onBuildingClick: (building: BuildingEvent) => void;
  onSourceClick: () => void;
}

export default function PhaserGame({ onBuildingClick, onSourceClick }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const callbacksRef = useRef({ onBuildingClick, onSourceClick });

  // Keep refs up to date
  callbacksRef.current = { onBuildingClick, onSourceClick };

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Listen for CustomEvents dispatched by MapScene.js
    const handleBuilding = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      callbacksRef.current.onBuildingClick(detail);
    };
    const handleSource = () => {
      callbacksRef.current.onSourceClick();
    };

    window.addEventListener('petaouchnok:open-building', handleBuilding);
    window.addEventListener('petaouchnok:open-source', handleSource);

    // Dynamic import — Phaser cannot run during SSR
    import('phaser').then((Phaser) => {
      import('@/game/MapScene').then((mod) => {
        if (!containerRef.current || gameRef.current) return;

        const MapScene = mod.default;

        const w = containerRef.current!.clientWidth || window.innerWidth;
        const h = containerRef.current!.clientHeight || window.innerHeight - 64;

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: containerRef.current!,
          width: w,
          height: h,
          backgroundColor: '#5a9628', // matche le vert forêt
          pixelArt: true,
          antialias: false,
          roundPixels: true,
          scene: [MapScene],
          scale: {
            mode: Phaser.Scale.NONE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
        };
        gameRef.current = new Phaser.Game(config);
      });
    });

    return () => {
      window.removeEventListener('petaouchnok:open-building', handleBuilding);
      window.removeEventListener('petaouchnok:open-source', handleSource);
      if (gameRef.current) {
        gameRef.current.destroy(true, false);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated', overflow: 'hidden' }}
    />
  );
}
