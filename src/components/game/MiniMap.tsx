'use client';

const BUILDINGS = [
  { name: 'boulangerie', x: 128, y: 384, w: 96, h: 96 },
  { name: 'mairie', x: 256, y: 352, w: 96, h: 96 },
  { name: 'bibliotheque', x: 416, y: 384, w: 96, h: 96 },
  { name: 'epicerie', x: 128, y: 544, w: 96, h: 96 },
  { name: 'garage', x: 416, y: 544, w: 96, h: 96 },
  { name: 'fleuriste', x: 64, y: 224, w: 64, h: 64 },
  { name: 'medecin', x: 448, y: 224, w: 64, h: 64 },
  { name: 'hublot', x: 480, y: 736, w: 96, h: 96 },
  { name: 'leonie', x: 64, y: 736, w: 96, h: 96 },
  { name: 'bulletin', x: 256, y: 736, w: 64, h: 64 },
  { name: 'maurice', x: 32, y: 928, w: 64, h: 64 },
];

// Map is 20×36 tiles @ 32px = 640×1152
const MAP_W = 640;
const MAP_H = 1152;

export default function MiniMap() {
  return (
    <div className="relative w-full h-full bg-[#6FB234] overflow-hidden">
      {/* Tileset master as background — scaled to fit */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/assets/map/tileset_master.png)',
          backgroundSize: '100% auto',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated',
          opacity: 0.3,
        }}
      />

      {/* Village label */}
      <div className="absolute top-4 left-0 right-0 text-center z-10">
        <p
          className="text-[#F5C842]/80"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}
        >
          PÉTAOUCHNOK-LES-BAINS
        </p>
      </div>

      {/* Buildings grid — positioned in a simplified layout */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: 280, height: 320 }}>
          {BUILDINGS.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={b.name}
              src={`/assets/buildings/topdown/${b.name}_topdown.png`}
              alt={b.name}
              className="absolute animate-[float_4s_ease-in-out_infinite]"
              style={{
                width: 40,
                height: 40,
                imageRendering: 'pixelated',
                objectFit: 'contain',
                left: `${(b.x / MAP_W) * 280}px`,
                top: `${(b.y / MAP_H) * 320}px`,
                animationDelay: `${(b.x * 7 + b.y * 3) % 3000}ms`,
                filter: 'drop-shadow(1px 2px 0px rgba(0,0,0,0.3))',
              }}
            />
          ))}

          {/* Source thermale — cercle doré */}
          <div
            className="absolute w-6 h-6 rounded-full animate-[pulse-gold_3s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, #F5C842 0%, #FFD700 40%, transparent 70%)',
              left: `${(320 / MAP_W) * 280}px`,
              top: `${(576 / MAP_H) * 320}px`,
            }}
          />
        </div>
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,44,26,0.6) 100%)',
        }}
      />
    </div>
  );
}
