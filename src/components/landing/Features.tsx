const steps = [
  {
    emoji: '📬',
    title: "Tu t'abonnes",
    description: 'Tu choisis ton prénom et ton animal. Le village te connaît déjà.',
  },
  {
    emoji: '💌',
    title: 'Tu reçois',
    description:
      'Une lettre physique + des indices chaque mois. Des objets parfois étranges, toujours beaux.',
  },
  {
    emoji: '🎮',
    title: 'Tu joues',
    description:
      "L'app mobile prolonge l'expérience entre les envois. Explore le village, cultive, résous des énigmes.",
  },
];

export default function Features() {
  return (
    <section id="comment-ca-marche" className="px-6 py-20 bg-bg-sombre">
      <h2
        className="text-accent-or text-center mb-12"
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(10px, 3vw, 14px)',
          textShadow: '2px 2px 0 rgba(0,0,0,0.4)',
        }}
      >
        COMMENT ÇA MARCHE
      </h2>

      <div className="max-w-lg mx-auto flex flex-col gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-bg-nuit border-2 border-ardoise/30 p-6 relative"
            style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
          >
            {/* Numéro pixel */}
            <span
              className="absolute -top-3 -left-2 bg-dore-source text-texte-sombre w-8 h-8 flex items-center justify-center"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
            >
              {i + 1}
            </span>

            <div className="text-3xl mb-3">{step.emoji}</div>
            <h3
              className="text-beige-clair mb-2"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}
            >
              {step.title}
            </h3>
            <p
              className="text-texte-clair/70 text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
