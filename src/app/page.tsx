import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Characters from '@/components/landing/Characters';
import Pricing from '@/components/landing/Pricing';

export default function LandingPage() {
  return (
    <main className="min-h-dvh bg-bg-nuit">
      <Hero />
      <Features />
      <Characters />
      <Pricing />

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-ardoise/20 text-center">
        <p
          className="text-accent-or mb-3"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
        >
          PÉTAOUCHNOK-LES-BAINS
        </p>
        <p
          className="text-texte-clair/50 text-sm italic mb-6 max-w-xs mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Pétaouchnok-les-Bains existe depuis toujours et existera toujours. Probablement.
        </p>
        <div className="flex justify-center gap-6 text-texte-clair/30 text-xs">
          <span>CGV</span>
          <span>Mentions légales</span>
          <span>Contact</span>
        </div>
      </footer>
    </main>
  );
}
