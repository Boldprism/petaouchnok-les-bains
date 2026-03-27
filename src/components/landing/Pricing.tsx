import Link from 'next/link';

export default function Pricing() {
  return (
    <section className="px-6 py-20 bg-bg-sombre">
      <div className="max-w-md mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-block bg-accent-or/10 text-accent-or px-4 py-2 mb-8"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}
        >
          ✦ ABONNEMENT MENSUEL
        </div>

        {/* Prix */}
        <div className="mb-6">
          <span
            className="text-accent-or block"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(24px, 8vw, 40px)',
              textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
            }}
          >
            14,90€
          </span>
          <span
            className="text-texte-clair/60"
            style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
          >
            par mois
          </span>
        </div>

        {/* Détails */}
        <ul
          className="text-texte-clair/80 text-sm space-y-3 mb-8"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <li>📬 Lettre physique + indices chaque mois</li>
          <li>🎮 Accès complet à l&apos;app interactive</li>
          <li>✦ Éclats de Source offerts à l&apos;inscription</li>
          <li>🔓 Sans engagement — résiliable à tout moment</li>
        </ul>

        {/* Première box */}
        <p
          className="text-beige-chemin text-sm italic mb-8"
          style={{ fontFamily: 'var(--font-body)' }}
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
