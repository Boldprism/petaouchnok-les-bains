import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Characters from '@/components/landing/Characters';
import Pricing from '@/components/landing/Pricing';

export default function LandingPage() {
  return (
    <main className="min-h-dvh" style={{ background: '#1a2e1a' }}>
      <Hero />
      <Features />
      <Characters />
      <Pricing />

      {/* Footer */}
      <footer
        className="px-6 py-12 text-center"
        style={{ background: '#1a2e1a', borderTop: '4px solid #6FB234' }}
      >
        <p
          className="mb-3"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#F5C842' }}
        >
          PÉTAOUCHNOK-LES-BAINS
        </p>
        <p
          className="text-sm italic mb-6 max-w-xs mx-auto"
          style={{ fontFamily: 'var(--font-body)', color: '#F0EAD6', opacity: 0.5 }}
        >
          Pétaouchnok-les-Bains existe depuis toujours et existera toujours. Probablement.
        </p>
        <div
          className="flex justify-center gap-6 text-xs"
          style={{ color: '#F0EAD6', opacity: 0.3 }}
        >
          <span>CGV</span>
          <span>Mentions légales</span>
          <span>Contact</span>
        </div>
      </footer>
    </main>
  );
}
