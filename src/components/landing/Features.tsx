const steps = [
  {
    sprite: '/assets/buildings/side/boulangerie_side.png',
    title: "Tu t'abonnes",
    description: 'Tu choisis ton prénom et ton animal. Le village te connaît déjà.',
  },
  {
    sprite: '/assets/buildings/side/mairie_side.png',
    title: 'Tu reçois',
    description:
      'Une lettre physique + des indices chaque mois. Des objets parfois étranges, toujours beaux.',
  },
  {
    sprite: '/assets/buildings/side/hublot_side.png',
    title: 'Tu joues',
    description:
      "L'app mobile prolonge l'expérience entre les envois. Explore le village, cultive, résous des énigmes.",
  },
];

export default function Features() {
  return (
    <section
      id="comment-ca-marche"
      className="px-6 py-20"
      style={{
        background: '#2d4a1e',
        borderBottom: '4px solid #6FB234',
      }}
    >
      <h2
        className="text-[#F5C842] text-center mb-12"
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
            className="relative p-6"
            style={{
              background: '#e8d5a8',
              border: '4px solid #8b6914',
              boxShadow: '4px 4px 0px #5a4010',
            }}
          >
            {/* Numéro pixel */}
            <span
              className="absolute -top-3 -left-2 w-7 h-7 flex items-center justify-center text-white"
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '9px',
                background: '#6FB234',
                border: '2px solid #4A9122',
              }}
            >
              {i + 1}
            </span>

            <div className="flex items-start gap-4">
              {/* Sprite bâtiment */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.sprite}
                alt=""
                className="w-12 h-12 shrink-0 mt-1"
                style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
              />
              <div>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '11px',
                    color: '#2a1a0a',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: '#4a3520',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
