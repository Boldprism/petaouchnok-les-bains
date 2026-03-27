import Link from 'next/link';

export default function Pricing() {
  return (
    <section
      className="px-6 py-20"
      style={{
        background: '#2d4a1e',
        borderBottom: '4px solid #6FB234',
      }}
    >
      <div
        className="max-w-[480px] mx-auto text-center p-12"
        style={{
          background: '#1a2e1a',
          border: '6px solid #F5C842',
          boxShadow: '8px 8px 0px #b8960a, inset 0 0 0 2px #F5C842',
        }}
      >
        {/* Étoiles décoratives */}
        <div
          className="mb-4 tracking-[8px]"
          style={{ color: '#F5C842', opacity: 0.4, fontSize: '14px' }}
        >
          ✦ ✦ ✦ ✦ ✦
        </div>

        {/* Badge */}
        <div
          className="inline-block px-4 py-2 mb-8"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '9px',
            background: 'rgba(245,200,66,0.1)',
            color: '#F5C842',
            border: '2px solid rgba(245,200,66,0.2)',
          }}
        >
          ✦ ABONNEMENT MENSUEL
        </div>

        {/* Prix */}
        <div className="mb-6">
          <span
            className="block"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(24px, 8vw, 40px)',
              color: '#F5C842',
              textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
            }}
          >
            14,90€
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: '#F0EAD6',
              opacity: 0.6,
            }}
          >
            par mois
          </span>
        </div>

        {/* Détails */}
        <ul
          className="text-sm space-y-3 mb-8 text-left max-w-xs mx-auto"
          style={{
            fontFamily: 'var(--font-body)',
            color: '#F0EAD6',
            opacity: 0.8,
          }}
        >
          <li>📬 Lettre physique + indices chaque mois</li>
          <li>🎮 Accès complet à l&apos;app interactive</li>
          <li>✦ Éclats de Source offerts à l&apos;inscription</li>
          <li>🔓 Sans engagement — résiliable à tout moment</li>
        </ul>

        {/* Première box */}
        <p
          className="text-sm italic mb-8"
          style={{
            fontFamily: 'var(--font-body)',
            color: '#C8A96E',
          }}
        >
          Premier envoi : La Lettre de Bienvenue
        </p>

        {/* CTA */}
        <Link
          href="/inscription"
          className="pixel-btn pixel-btn--primary inline-block"
        >
          S&apos;abonner maintenant
        </Link>
      </div>
    </section>
  );
}
