const characters = [
  {
    emoji: '🦦',
    name: 'Fernand Plongeot',
    title: 'Le Maire',
    quote: 'En ma qualité de Maire, je vous souhaite la bienvenue.',
    color: '#587098',
  },
  {
    emoji: '🦔',
    name: 'Madeleine Épinette',
    title: 'La Bibliothécaire',
    quote: 'Chaque livre ici contient un secret. Certains en contiennent deux.',
    color: '#7B5EA7',
  },
  {
    emoji: '🦋',
    name: 'Ziggy Sans-Nom',
    title: 'Le Mystérieux',
    quote: '...',
    color: '#4A9122',
  },
  {
    emoji: '🐭',
    name: 'Pip Minuscule',
    title: "L'Enfant",
    quote: "Tu l'entends aussi, la mélodie ? Elle vient de la Source.",
    color: '#F5C842',
  },
];

export default function Characters() {
  return (
    <section className="px-6 py-20">
      <h2
        className="text-accent-or text-center mb-12"
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 'clamp(10px, 3vw, 14px)',
          textShadow: '2px 2px 0 rgba(0,0,0,0.4)',
        }}
      >
        LES HABITANTS
      </h2>

      <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
        {characters.map((char) => (
          <div
            key={char.name}
            className="bg-bg-sombre border-2 p-4 flex flex-col items-center text-center"
            style={{
              borderColor: char.color + '40',
              boxShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
            }}
          >
            <span className="text-4xl mb-2">{char.emoji}</span>
            <h3
              className="text-beige-clair mb-1"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: '1.6' }}
            >
              {char.name}
            </h3>
            <p
              className="text-sm mb-2"
              style={{ fontFamily: 'var(--font-body)', color: char.color }}
            >
              {char.title}
            </p>
            <p
              className="text-texte-clair/60 text-xs italic leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              &laquo;&nbsp;{char.quote}&nbsp;&raquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
