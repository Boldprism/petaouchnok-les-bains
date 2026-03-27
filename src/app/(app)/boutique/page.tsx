'use client';

import { useState } from 'react';

interface ShopItem {
  name: string;
  price: number;
  description: string;
}

interface Shop {
  id: string;
  emoji: string;
  name: string;
  keeper: string;
  greeting: string;
  items: ShopItem[];
}

const SHOPS: Shop[] = [
  {
    id: 'boulangerie',
    emoji: '🥐',
    name: 'Boulangerie',
    keeper: 'Gaston Mielleux',
    greeting: 'Ah, un client ! Goûtez donc ce croissant. Il a une saveur que personne n\'arrive à nommer.',
    items: [
      { name: 'Croissant Doré', price: 5, description: 'Boost de récolte +10% pendant 1h' },
      { name: 'Pain de la Source', price: 15, description: 'Double les Éclats récoltés pendant 2h' },
      { name: 'Tarte Mystère', price: 30, description: 'Révèle un fragment de lore aléatoire' },
    ],
  },
  {
    id: 'bibliotheque',
    emoji: '📚',
    name: 'Bibliothèque',
    keeper: 'Madeleine Épinette',
    greeting: 'Chaque livre ici contient un secret. Certains en contiennent deux. Lequel cherchez-vous ?',
    items: [
      { name: 'Feuillet Ancien', price: 20, description: 'Fragment de lore du Mois 1' },
      { name: 'Carnet de Ziggy', price: 50, description: 'Fragment rare du Mystérieux' },
      { name: 'Registre Annoté', price: 100, description: 'Fragment légendaire — indice clé' },
    ],
  },
  {
    id: 'epicerie',
    emoji: '🛒',
    name: 'Épicerie',
    keeper: 'Noisette Grignotier',
    greeting: 'Bienvenue ! On a tout ce qu\'il faut. Et même des choses dont vous ignoriez avoir besoin.',
    items: [
      { name: 'Graines de Vanille', price: 10, description: 'Plante une culture (récolte en 4h)' },
      { name: 'Pelle Dorée', price: 25, description: 'Débloque une nouvelle parcelle' },
      { name: 'Fiole de Source', price: 40, description: 'Accélère la pousse (÷2 le temps)' },
    ],
  },
];

export default function BoutiquePage() {
  const [activeShop, setActiveShop] = useState<string | null>(null);

  const shop = SHOPS.find((s) => s.id === activeShop);

  return (
    <div className="flex flex-col min-h-full p-4">
      <h1
        className="text-accent-or mb-6"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', textShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
      >
        BOUTIQUES
      </h1>

      {!shop ? (
        /* Shop list */
        <div className="flex flex-col gap-3">
          {SHOPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveShop(s.id)}
              className="text-left bg-bg-sombre border-2 border-ardoise/30 p-4 hover:border-accent-or/40 transition-colors"
              style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <div>
                  <h3
                    className="text-beige-clair"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', lineHeight: '1.6' }}
                  >
                    {s.name}
                  </h3>
                  <p
                    className="text-texte-clair/50 text-sm"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {s.keeper}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Shop detail */
        <div>
          <button
            onClick={() => setActiveShop(null)}
            className="text-ardoise mb-4 flex items-center gap-1"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}
          >
            ← Retour
          </button>

          {/* Keeper greeting */}
          <div
            className="bg-bg-sombre border-2 border-ardoise/30 p-4 mb-4"
            style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{shop.emoji}</span>
              <div>
                <h3
                  className="text-accent-or"
                  style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
                >
                  {shop.name}
                </h3>
                <p
                  className="text-beige-chemin text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {shop.keeper}
                </p>
              </div>
            </div>
            <p
              className="text-texte-clair/70 text-sm italic leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              &laquo;&nbsp;{shop.greeting}&nbsp;&raquo;
            </p>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2">
            {shop.items.map((item) => (
              <div
                key={item.name}
                className="bg-bg-sombre border border-ardoise/20 p-3 flex items-center justify-between"
              >
                <div className="flex-1 mr-3">
                  <h4
                    className="text-beige-clair mb-0.5"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: '1.5' }}
                  >
                    {item.name}
                  </h4>
                  <p
                    className="text-texte-clair/50 text-xs"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.description}
                  </p>
                </div>
                <button
                  className="pixel-btn pixel-btn--primary shrink-0"
                  style={{ fontSize: '8px', padding: '8px 12px' }}
                >
                  ✦ {item.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
