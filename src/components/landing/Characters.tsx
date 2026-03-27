const characters = [
  {
    emoji: '🦦',
    name: 'Fernand Plongeot',
    title: 'Le Maire',
    quote: 'En ma qualité de Maire, je vous souhaite la bienvenue.',
    borderColor: '#8b6914',
  },
  {
    emoji: '🦔',
    name: 'Madeleine Épinette',
    title: 'La Bibliothécaire',
    quote: 'Chaque livre ici contient un secret. Certains en contiennent deux.',
    borderColor: '#4a6741',
  },
  {
    emoji: '🦋',
    name: 'Ziggy Sans-Nom',
    title: 'Le Mystérieux',
    quote: "Je suis là depuis longtemps. Ou pas encore. C'est selon.",
    borderColor: '#7b5ea7',
  },
  {
    emoji: '🐭',
    name: 'Pip Minuscule',
    title: "L'Enfant",
    quote: "Tu l'entends aussi, la mélodie ? Elle vient de la Source.",
    borderColor: '#c85a30',
  },
];

export default function Characters() {
  return (
    <section
      className="px-6 py-20"
      style={{
        background: '#1a2e1a',
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
        LES HABITANTS
      </h2>

      <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
        {characters.map((char) => (
          <div
            key={char.name}
            className="p-4 flex flex-col items-center text-center"
            style={{
              background: '#e8d5a8',
              border: `4px solid ${char.borderColor}`,
              boxShadow: '3px 3px 0px rgba(0,0,0,0.3)',
            }}
          >
            <span className="text-4xl mb-2">{char.emoji}</span>
            <h3
              className="mb-1"
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '8px',
                lineHeight: '1.6',
                color: '#2a1a0a',
              }}
            >
              {char.name}
            </h3>
            <p
              className="text-sm mb-2 font-semibold"
              style={{
                fontFamily: 'var(--font-body)',
                color: char.borderColor,
              }}
            >
              {char.title}
            </p>
            <p
              className="text-xs italic leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: '#5a4530',
              }}
            >
              &laquo;&nbsp;{char.quote}&nbsp;&raquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
