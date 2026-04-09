import Link from 'next/link';

export default function VillagePage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between p-4">

      {/* Center — placeholder card */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="pixel-card p-6 w-full max-w-sm text-center">
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🗺️</span>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 9,
            color: 'var(--btn-gold-text)',
            lineHeight: '1.6',
            marginBottom: 12,
          }}>
            VILLAGE DE PÉTAOUCHNOK
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#5a3a10',
            lineHeight: 1.6,
            marginBottom: 20,
          }}>
            La carte du village arrive bientôt.
            En attendant, explorez les autres sections.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/commerces" className="app-btn w-full text-center block">
              ALLER AUX COMMERCES →
            </Link>
            <Link href="/jardin" className="app-btn w-full text-center block">
              ALLER AU JARDIN →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom — Maurice card */}
      <div className="w-full max-w-sm mt-4">
        <div className="pixel-card p-4">
          <div className="flex items-start gap-3">
            <span style={{ fontSize: 32 }}>🦭</span>
            <div className="flex-1">
              <h3 style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 8,
                color: 'var(--btn-gold-text)',
                marginBottom: 4,
              }}>
                Maurice Plongeur
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: '#5a3a10',
                fontStyle: 'italic',
                lineHeight: 1.5,
                marginBottom: 10,
              }}>
                &laquo;&nbsp;La rivière connaît des histoires que la mer n&apos;a jamais entendues.&nbsp;&raquo;
              </p>
              <Link href="/peche" className="app-btn block text-center" style={{ fontSize: 8 }}>
                ALLER À LA PÊCHE →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
