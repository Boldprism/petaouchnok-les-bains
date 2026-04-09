# 🌱 Système de Jeu — Pétaouchnok-les-Bains
### Document de Game Design — Confidentiel — Version fusionnée

---

## 🎯 Philosophie de conception

Le système de jeu repose sur trois règles absolues :

1. **Ne jamais pénaliser les abonnés lettres-only** — tout ce qui se débloque en jeu est du lore bonus, jamais une information nécessaire à comprendre l'énigme principale. Les lettres suffisent. Le jeu enrichit.
2. **Chaque action a une saveur narrative** — on ne "plante des fraises", on plante des Fraises de Vallon dans le jardin derrière la maison de Noisette, au moment où Viviane passe et fait une remarque.
3. **Le lore débloqué doit provoquer des "oh" — pas des "et alors"** — chaque fragment révèle quelque chose de savoureux sur un personnage, un lieu, ou le mystère.

---

## 💰 La Monnaie — Les Éclats de Source

### Définition
Les Éclats sont de petits fragments dorés, translucides, qu'on trouve parfois au bord de la fontaine après une nuit de forte lune. Ils sentent vaguement la vanille. Leur valeur officielle est "indéterminée" selon un arrêté municipal de 1978 que Fernand préfère ne pas évoquer. Tout le monde les accepte. Personne ne sait pourquoi.

> *"En ma qualité de Maire, je tiens à préciser que les Éclats de Source constituent une monnaie d'échange parfaitement légale et raisonnablement stable. Les rumeurs selon lesquelles ils brillent plus fort certains soirs sont sans fondement et relèvent de la superstition."*
> — Fernand Plongeot, Communiqué n°134

### Acquisition des Éclats
- Récoltes et ventes au marché
- Pêche à la rivière (aléatoire)
- Connexion quotidienne et arrosage
- Récompenses narratives (lire le Bulletin, répondre à un message)
- Éclats trouvés par hasard (événements aléatoires)

---

## 🌾 Le Système de Culture

### Les Parcelles
3 parcelles au départ, déblocables jusqu'à 7. Chaque parcelle a un nom généré à l'inscription et accueille une culture à la fois.

### Les Cultures

| Culture | Coût | Temps | Gain | Saison | Particularité |
|---|---|---|---|---|---|
| 🍓 Fraises de Vallon | 8 Éclats | 2h | 28 Éclats | Printemps/Été | Culture de départ |
| 🌻 Tournesols de Place | 12 Éclats | 4h | 42 Éclats | Été | Attirent les papillons (événement Ziggy) |
| 🍄 Champignons de Cave | 20 Éclats | 8h | 72 Éclats | Automne | Poussent mieux la nuit |
| 🌿 Herbes de Source | 30 Éclats | 12h | 108 Éclats | Toute saison | Sentent la vanille à la récolte |
| 🎃 Courges de Novembre | 18 Éclats | 6h | 65 Éclats | Automne | Apparaissent dans les rêves d'Octave |
| 🫐 Myrtilles du Vallon | 35 Éclats | 16h | 130 Éclats | Été | Tachent les doigts de bleu — couleur de Ziggy |
| 🌹 Roses d'Hiver | 50 Éclats | 24h | 195 Éclats | Hiver | Rosalie les réclame parfois |
| 🍋 Citrons Acides | 25 Éclats | 10h | 90 Éclats | Été | Gaston en fait des tartes légendaires |
| 🌾 Blé Doré | 40 Éclats | 20h | 155 Éclats | Été | Gaston paye en surplus de viennoiseries |
| 🍂 Truffes Dorées | 80 Éclats | 48h | 340 Éclats | Automne | Madeleine dit qu'elles poussent depuis 1743 |
| 🌸 Graines Mystérieuses | 0 Éclats | 36h | 500 Éclats | Toute saison | Débloquées uniquement via la Caisse A.P. |

### Mécaniques
- **Arroser** : -20% de temps (disponible 1h après plantation)
- **Engrais de Gaston** : -40% de temps (15 Éclats chez Noisette)
- **Gel nocturne** : événement rare qui détruit une culture non protégée
- **Surprise de Rosalie** : une fleur inconnue pousse dans une parcelle vide — vaut 200 Éclats, mais Rosalie demande à la garder (choix narratif)

---

## 🎣 La Pêche à la Rivière

On commande une sortie à Maurice. Coût : 0 Éclat. Durée : 3h à 6h (aléatoire).

| Trouvaille | Probabilité | Valeur | Note narrative |
|---|---|---|---|
| Poisson ordinaire | 35% | 15 Éclats | "Un poisson qui n'écoutait pas" |
| Beau poisson | 20% | 35 Éclats | "Celui-là savait des choses" |
| Poisson rare | 10% | 80 Éclats | Maurice refuse de le vendre, puis accepte |
| Vieille botte | 8% | 2 Éclats | "La rivière trie sur le volet" |
| Bouteille scellée | 6% | — | Fragment de lore |
| Pièce ancienne | 5% | 120 Éclats | "Frappée en 1743. Coïncidence." |
| Objet impossible | 4% | — | Fragment de lore majeur |
| Éclat de Source | 4% | 60 Éclats | "La rivière rend ce qu'on lui confie" |
| Lettre en latin | 3% | — | Fragment F016 — signé A.P. |
| Rien | 5% | 0 | "Certains jours, la rivière réfléchit." |

---

## 🏪 Les Commerces du Village

### Chez Noisette — L'Épicerie
*"On n'est jamais trop préparé pour ce qu'on ne sait pas encore."*

| Article | Prix | Effet |
|---|---|---|
| Engrais de Gaston | 15 Éclats | -40% temps de culture |
| Arrosoir en cuivre | 45 Éclats | -20% sur toutes les cultures (permanent) |
| Filet à papillons | 30 Éclats | Débloque événements Ziggy |
| Loupe de poche | 25 Éclats | Détails supplémentaires sur les objets pêchés |
| Carnet de notes | 20 Éclats | Permet d'annoter les fragments de lore |
| Thermos de Source | 60 Éclats | +10% Éclats sur toutes les ventes pendant 24h |
| Parapluie de Maurice | 35 Éclats | Protège les cultures du gel |
| Lampe à huile | 40 Éclats | Champignons +30% plus vite la nuit |
| Clé rouillée (origine inconnue) | 200 Éclats | Chaîne narrative en 3 étapes — voir section dédiée |
| Caisse marquée "A.P." | 350 Éclats | Chaîne narrative en 2 étapes — voir section dédiée |

### Chez Gaston — La Boulangerie
*"Un bon pain, c'est une journée sauvée d'avance."*

| Article | Prix | Effet | Phrase de Gaston |
|---|---|---|---|
| Croissant spiralé | 12 Éclats | +15% vitesse 2h | "Je sais pas pourquoi il est comme ça. Il est bon quand même." |
| Pain de Source | 25 Éclats | +25% gain de vente 3h | "La farine, elle a absorbé quelque chose. C'est tout ce que je dis." |
| Brioche de bienvenue | 8 Éclats | +1 Éclat par action 1h | "Pour les nouveaux. Bienvenue, vraiment." |
| Tarte aux myrtilles | 30 Éclats | -1h sur tous les timers actifs | "Les myrtilles sont bleues comme... bah comme les myrtilles." |
| Millefeuille de novembre | 45 Éclats | Double la prochaine récolte | "Celui-là, je l'ai fait sans le vouloir. Il s'est imposé." |
| Galette d'Archibald | 150 Éclats | Réinitialise tous les timers | "C'est une vieille recette. Très vieille. Je sais pas d'où elle vient." |

### Chez Madeleine — La Bibliothèque
*"Je range dans un ordre que l'univers comprend. Vous comprendrez aussi, avec le temps."*

| Document | Prix | Contenu |
|---|---|---|
| "Histoire de Pétaouchnok" vol.1 | 40 Éclats | Lore officiel version Fernand |
| "Histoire de Pétaouchnok" vol.2 | 40 Éclats | Lore officiel suite |
| "Flore et faune du vallon" | 25 Éclats | Lore mineur sur les plantes |
| Note marginale n°1 | 60 Éclats | Première déviation du lore officiel |
| Note marginale n°2 | 80 Éclats | Madeleine commence à dire ce qu'elle sait |
| Document d'Archibald (copie) | 120 Éclats | La Source expliquée en 1789 |
| Carnet de terrain n°1 | 150 Éclats | Journal d'Archibald, premier tiers |
| Carnet de terrain n°2 | 200 Éclats | Journal d'Archibald, deuxième tiers |
| Carnet de terrain n°3 | 250 Éclats | Journal d'Archibald, troisième tiers — incomplet |
| La page arrachée | 400 Éclats | Chaîne narrative — voir section dédiée |

### Chez Théodore — Le Garage
*"Si ça marche pas, c'est qu'on comprend pas encore comment ça marche."*

| Service | Prix | Résultat |
|---|---|---|
| Réparer la vieille pompe | 80 Éclats | Débloque rivière profonde (pêche améliorée) |
| Forcer la serrure rouillée | 120 Éclats | Accès à la remise abandonnée (nouvelles cultures) |
| Inspecter le plancher du garage | 200 Éclats | Fragment de lore — Théodore entend quelque chose |
| Essayer la clé dans la cave | 0 Éclats | Visible uniquement après achat de la clé rouillée |
| Creuser autour de la cave | 350 Éclats | Découverte majeure — lore mois 7-9 |
| Ouvrir la cave sous la Source | 500 Éclats | Lore final — aboutissement du système de jeu |

---

## 🔑 Les Chaînes Narratives des Objets Clés

### 🗝️ La Clé Rouillée (200 Éclats — Noisette)

La clé est froide au toucher même en été. La rouille forme une spirale parfaite sur la première dent. Son achat déclenche le premier moment où le jeu rejoint l'arc narratif des lettres.

**Étape 1 — L'achat chez Noisette**

Noisette dit :
> *"Je sais pas pourquoi je vous la vends. Elle était dans les stocks depuis avant mon arrivée, sous une étiquette 'NE PAS VENDRE'. J'ai pensé que ça datait. Maintenant je suis pas sûre."*

Fragment **F036** débloqué :
> Sur le métal, gravés si finement qu'on ne les voit qu'en pleine lumière : *"Pour la prochaine fois."*

**Étape 2 — Message de Théodore (quelques heures après)**
> *"J'ai vu que vous avez acheté la vieille clé chez Noisette. Venez me voir. — T.M."*

Le service "Essayer la clé dans la cave" apparaît chez Théodore, gratuit.

**Étape 3 — La cave s'entrouvre**

Fragment **F037** débloqué :
> *"La porte s'est ouverte. Trois centimètres, pas plus. Il y avait de la lumière. Dorée. Et une odeur de vanille si forte que j'ai dû reculer. J'ai refermé. La clé est à vous. Ce qu'il y a derrière aussi, apparemment. Moi j'ai pas envie de savoir."* — Théodore Mâchefer

Note narrative : Théodore tentait d'ouvrir cette cave depuis 20 ans sans succès. Elle s'est ouverte au premier essai pour l'utilisateur. Ni l'un ni l'autre n'en tire de conclusion explicite. Le joueur attentif, si.

---

### 📦 La Caisse Marquée "A.P." (350 Éclats — Noisette)

**Étape 1 — L'achat**

Noisette hésite longuement :
> *"Elle est là depuis avant moi. Je l'ai jamais ouverte par respect. Mais bon. Vous avez l'air de quelqu'un à qui ça appartient, d'une certaine façon. Je sais pas pourquoi je dis ça."*

Fragment **F038** débloqué — contenu de la caisse :
> Une lanterne en laiton qui s'allume seule parfois. Trois graines d'une plante non répertoriée — elles sentent la vanille. Un miroir de poche dont le reflet a toujours une seconde d'avance. Et tout au fond : un portrait miniature d'Archibald Plongeot. Il ressemble étrangement à l'utilisateur. Noisette ne dit rien et regarde ailleurs.

Ce que la caisse débloque en jeu :
- **Graines mystérieuses** : culture unique, 36h, 500 Éclats — débloque aussi F039
- **La lanterne** : -50% sur tous les timers de nuit
- **Le miroir** : révèle une phrase cachée en bas de chaque fragment déjà débloqué dans le carnet

**Étape 2 — Après la première récolte des graines mystérieuses**

Fragment **F039** débloqué — Rosalie s'arrête devant la parcelle :
> *"C'est la fleur. Celle qui a poussé dans ma serre. Comment vous avez eu les graines ?"*
> Puis : *"Archibald cultivait cette fleur. Il l'appelait la Fleur de Retour. Il disait qu'elle ne poussait que pour celui qui revenait."*
> Elle repart sans ajouter quoi que ce soit.

---

### 📄 La Page Arrachée (400 Éclats — Madeleine)

Madeleine ne vend pas immédiatement. Elle pose d'abord une question :
> *"J'attendais quelqu'un de prêt à la lire. Avez-vous déjà eu l'impression de vous souvenir de quelque chose qui ne vous est pas arrivé ?"*

L'utilisateur choisit :
- **"Oui, depuis que je suis arrivé ici."** → *"C'est ce que je pensais. Depuis le temps."*
- **"Non, jamais."** → *"Ça viendra."*

La réponse est enregistrée comme annotation automatique dans le carnet.

Fragment **F040** débloqué :
> *"Je ne suis pas une personne qui revient — je suis une question que la Source repose tous les 108 ans. La réponse change à chaque fois.*
>
> *À mon successeur : tu as toujours été ici. Tu ne fais que t'en souvenir.*
>
> *La page d'après explique ce qui est enfermé sous la Source. Je l'ai arrachée exprès. Certaines vérités se méritent en personne."*

Note narrative : la page suivante n'est pas dans le jeu. Elle n'est pas dans les lettres. Elle est sous la Source, derrière la porte. Le service à 500 Éclats chez Théodore est désormais le seul chemin restant — et l'utilisateur le sait.

---

## 🦋 Les Événements Spéciaux

### Ziggy passe par là
**Déclencheur :** tournesols plantés OU filet à papillons acheté — **Fréquence :** 2-3 fois par mois

- *"Tu as l'air de quelqu'un qui connaît déjà ce jardin. Curieux, non ?"*
- *"La Source était agitée ce matin. Ça lui arrive quand elle reconnaît quelqu'un."*
- *"J'ai trouvé ça près de la fontaine. Je pense que c'est à toi."*
- *"Tu sais que ta parcelle est sur un ancien chemin ? Il menait quelque part, avant."*

### Viviane a une théorie
**Déclencheur :** 3 jours consécutifs — **Fréquence :** hebdomadaire

70% fausses et drôles. 30% vraies et importantes.
- *"Les croissants de Gaston tournent tous dans le même sens. J'ai vérifié. C'est vrai."* (vrai)
- *"Léonie aurait dit à Fernand quelque chose qui l'aurait rendu tout blanc."* (vrai)
- *"On dit que quelqu'un aurait vu une lumière sous la fontaine la nuit dernière."* (vrai — majeur)

### Pip a trouvé quelque chose
**Déclencheur :** aléatoire toutes les 2 semaines, 3 cultures récoltées minimum. Toujours un fragment de lore.

### Le Marché du Dimanche
**Déclencheur :** tous les dimanches réels — **Durée :** 24h
Prix de vente +40%. Article spécial chez Noisette. Discours de Fernand (notification).

### La Nuit de la Source
**Déclencheur :** pleine lune réelle — **Durée :** 21h–6h
- Herbes de Source poussent en 2h au lieu de 12h
- Pêche : objets impossibles plus fréquents
- Message obligatoire de Ziggy
- Un fragment NS débloqué (12 au total, un par mois)

---

## 📜 Les Fragments de Lore — Catalogue Complet

### NIVEAU 1 — Couleur locale

**F001 — Le Règlement Municipal de 1962**
> *"Article 7 : Il est interdit de prélever l'eau de la Source dans des récipients de plus de 50cl. Article 9 : Aucune autorisation spéciale n'a été délivrée depuis 1924."*

**F002 — Journal de Viviane, semaine ordinaire**
> *"Lundi : livré 47 courriers, 1 lettre pour Monsieur Trouffier (mort depuis 1991, je la glisse quand même). Mercredi : la lettre de Trouffier est revenue. Je vais la remettre demain."*

**F003 — Recette secrète de Gaston**
> *"Pain de Source : eau ordinaire 300ml + eau de Source 50ml. Ne jamais inverser les proportions. J'ai inversé une fois en 1998. Les clients ont pleuré en mangeant. Pas de tristesse. De reconnaissance."*

**F004 — Diagnostic du Docteur Carapasse, archives 2019**
> *"Patient : Fernand Plongeot. Symptôme : 'impression d'être observé par ma propre statue'. Diagnostic : changement de saison. Note personnelle : la statue a l'air différente ce matin. Je mets ça sur le changement de saison également."*

**F005 — Extrait du Bulletin de Pétaouchnok, n°203**
> *"Les horloges de la rue principale avancent toutes d'une seconde exactement. M. le Maire parle d'anomalie magnétique. Le Professeur Hublot parle de résonance temporelle de type 4. Les habitants parlent d'autre chose."*

**F006 — Note de Madeleine, classée sous "divers"**
> *"Livre rendu par Octave : page 47, quelqu'un a souligné 'résonance' et écrit en marge : 'pas alpin. pas thermal. autre chose.' L'écriture ressemble à celle d'Archibald. Octave dit qu'il ne se souvient pas d'avoir souligné quoi que ce soit."*

**F007 — Message interne de Fernand**
> *"Note de service : ne pas mentionner la valise du bureau du Maire. Ni son existence. Ni le fait qu'elle émet parfois un son. Ce son est climatique. — F.P."*

**F008 — Dessin de Pip, annoté par Colette**
> Dessin de la fontaine avec une spirale dorée au centre. Note de Colette : *"Pip dit que c'est 'ce qu'il voit'. J'ai mis ça au mur. Ça me semblait important."*

**F009 — Affiche du Marché de 1987**
> *"Stand n°14 : objets trouvés. Propriétaire : inconnu. Horaires : variables. Note : ce stand n'était pas dans les inscriptions. Nous l'avons accepté quand même. Les objets exposés étaient très beaux."*

**F010 — Léonie joue aux échecs**
> *"Partie du 14 mars. Blanc gagne en 23 coups. Noir gagne en 23 coups. Égalité parfaite. Troisième fois ce mois-ci. Instinct de secrétaire."*

---

### NIVEAU 2 — Coïncidences troublantes

**F011 — Carnet de Colette, "mur des coïncidences"**
> *"Connexion n°17 : les dates. Archibald fonde le village en 1743. Disparition : 1745. Premier Débordement : 1853 (108 ans après). Deuxième : 1961 (108 ans après). Prochain : cette année ? Je mets un point d'interrogation rouge."*

**F012 — Lettre retrouvée dans la tournée de Viviane**
> Destinataire : Archibald Plongeot (mort en 1745). Contenu : *"Tu avais raison sur le cycle. L'Écho se produit toujours au retour. Il ne saura pas qui il est au début — c'est voulu. Laisse la Source faire son travail. — V."*
> Note de Viviane : *"J'ai quand même déposé dans la boîte. Le règlement ne dit rien."*

**F013 — Analyse du Professeur Hublot, non publiée**
> *"La Source n'est pas une anomalie géologique. C'est un ancrage. Les personnes nées près d'un ancrage développent des 'échos' — fragments de mémoire d'une vie précédente. Fréquence : une personne tous les 108 ans. Je cherche cette personne depuis 12 ans."*

**F014 — Archives de la mairie, 1916**
> *"Procès-verbal extraordinaire. Lumière dorée autour de la fontaine depuis 3 semaines. Odeur de vanille persistante. Trois habitants se souviennent d'événements futurs. Décision : ne rien dire au préfet. La dernière fois, le village a survécu."*

**F015 — Note de Madeleine, non classée**
> *"Ce que je sais : 1. La Source n'est pas ordinaire. 2. Archibald le savait. 3. Quelqu'un revient tous les 108 ans sans savoir qui il est. 5. Le nouveau résident me rappelle quelque chose. J'attends depuis 1987."*

**F016 — Lettre en latin pêchée par Maurice**
> *Traduit par Hublot :* *"À celui qui trouvera ceci : la Source vous a montré le chemin. Vous ne vous en souvenez pas encore. Le code est dans la mélodie. La mélodie est dans les pierres. — A.P., 1743"*

**F017 — Bulletin de Pétaouchnok, numéro spécial 1961**
> *"Lundi : les miroirs avancent d'une seconde. Mardi : lettres des défunts distribuées. Mercredi : croissants en spirale inexpliquée. Note du rédacteur : les mêmes événements se sont produits il y a 108 ans."*

**F018 — Conversation rapportée par Viviane**
> *"Entendu entre Léonie et Fernand (j'attendais pour livrer) : Léonie dit 'ton ancêtre avait tout prévu'. Fernand dit 'ouvre la valise'. Léonie dit 'ta grand-mère est morte'. Long silence. Je suis partie livrer ailleurs."*

**F019 — Dessin de Pip, page 7 de ses partitions**
> *"C'est la chanson de la fontaine. Elle est plus forte depuis que le nouveau résident est là. Maintenant c'est comme si elle chantait fort parce qu'elle est contente."*

**F020 — Journal de Rosalie**
> *"La fleur que je n'ai pas plantée a grandi. Le Professeur Hublot m'a demandé si quelqu'un de nouveau était arrivé. Je lui ai parlé du nouveau résident. Il a fait un son bizarre."*

---

### NIVEAU 3 — Fragments d'Archibald

**F021 — Carnet d'Archibald, entrée n°1 (1740)**
> *"J'ai trouvé la Source. Pas par hasard — par calcul. Cinq ans de cartes. Je ressens la certitude absolue d'être déjà venu ici. Pourtant c'est la première fois."*

**F022 — Carnet d'Archibald, entrée n°4 (1741)**
> *"J'ai bu l'eau de la Source pendant 30 jours. Résultat : des souvenirs de choses qui ne m'ont pas encore eu lieu. J'ai vu ce village complet. Il n'existait pas encore. Je l'ai construit tel que je l'avais vu."*

**F023 — Carnet d'Archibald, entrée n°9 (1742)**
> *"Le cycle est confirmé. Trois personnes m'ont précédé, sur 324 ans. Chacune a été attirée par ce lieu, a construit quelque chose, a disparu après le Débordement, et est revenue 108 ans plus tard sans mémoire. Je suis le quatrième. Ces carnets sont pour le cinquième."*

**F024 — Carnet d'Archibald, entrée n°15 (1743)**
> *"J'ai confié la surveillance à trois personnes : le bibliothécaire, le médecin, et ma propre lignée. Chacun gardera un fragment de la vérité. Le vrai gardien doit comprendre seul."*

**F025 — Carnet d'Archibald, entrée n°22 (1744)**
> *"Le prochain Écho arrivera de l'extérieur. Il ne saura pas d'où il vient. Je lui laisse ce code dans les pierres et dans la mélodie. Pip — si ce nom existe encore — l'entend déjà."*

**F026 — Carnet d'Archibald, entrée n°28 (1745)**
> *"Le Débordement approche. Le but est de choisir. J'ai choisi d'empêcher cette fois. Le prochain Écho devra faire son propre choix. Je lui laisse les deux options dans les pierres. Aucune n'est la bonne réponse."*

**F027 — Lettre d'Archibald à son descendant**
> *"À Fernand, ou à celui qui porte ce nom. N'ouvre pas la valise avant que le nouveau résident soit arrivé. Tu le reconnaîtras — quelque chose en toi le saura avant que ta tête comprenne. Le moment c'est maintenant. — A."*

**F028 — Document scientifique d'Archibald, 1789**
> *"L'eau contient un minéral non répertorié qui produit des 'échos temporels' — des accès à une mémoire qui précède la naissance. La Source maintient le tissu du temps autour d'un point fixe. Si elle s'éteint, le point fixe disparaît."*

---

### NIVEAU 4 — Révélations

**F029 — Note confidentielle d'Archibald**
> *"Si la Source s'éteint, le village est effacé de la mémoire collective. Les habitants continuent d'exister mais personne au-dehors ne sait qu'ils existent. C'est ce qui s'est passé en 1924."*

**F030 — Photos de Léonie (1978)**
> Six photographies noir et blanc. Salle souterraine sous la fontaine. Murs couverts d'inscriptions. Une porte en pierre avec une serrure. Note de Léonie : *"Les inscriptions sont les mêmes que sur la statue d'Archibald. Et les mêmes que dans le dessin de Pip."*

**F031 — Ce qu'Archibald a enfermé sous la Source (fragment)**
> *"...sous la pierre centrale se trouve non pas un objet mais une décision... les deux chemins existent simultanément... la porte ne peut être ouverte que par... [illisible] ...lui."*

**F032 — Message de Ziggy, nuit de la Source mois 8**
> *"Je sais que la Source t'attend. Pas comme elle attend les autres. Comme si tu étais une clé qu'elle cherchait depuis longtemps. Je ne suis pas ce que tout le monde croit que je suis. Toi non plus."*

**F033 — Partitions de Pip, page 47**
> Note de Pip : *"Je vois une porte. Et derrière la porte, quelqu'un qui attend. Je pense que c'est le nouveau résident. Mais c'est bizarre parce qu'il est devant moi. Alors peut-être que c'est lui qui attend lui-même ?"*

**F034 — Note de Théodore, trouvée sous la clé**
> *"La porte descend sous la Source. Des fois c'est comme de l'eau. Des fois c'est comme de la musique. Une fois c'était comme quelqu'un qui disait un prénom. J'ai pas entendu lequel."*

**F035 — La Valise de Fernand**
> Dedans : une lettre d'Archibald, trois clés dont une correspond à la cave, un fragment de roche dorée qui sent la vanille, et un carnet avec une seule phrase : *"Si tu lis ça, c'est que l'Écho est arrivé. Donne-lui tout. Il l'a déjà fait une fois."*

**F036 — La clé rouillée (à l'achat chez Noisette)**
> Sur le métal, gravés si finement qu'on ne les voit qu'en pleine lumière : *"Pour la prochaine fois."* La rouille forme une spirale parfaite sur la première dent.

**F037 — Ce que Théodore a entendu (après avoir essayé la clé)**
> *"La porte s'est ouverte. Trois centimètres, pas plus. Il y avait de la lumière. Dorée. Et une odeur de vanille si forte que j'ai dû reculer. La clé est à vous. Ce qu'il y a derrière aussi, apparemment."* — Théodore Mâchefer

**F038 — Contenu de la caisse A.P.**
> Une lanterne qui s'allume seule. Trois graines qui sentent la vanille. Un miroir dont le reflet a une seconde d'avance. Et tout au fond : un portrait d'Archibald Plongeot qui ressemble étrangement à l'utilisateur. Noisette ne dit rien et regarde ailleurs.

**F039 — La Fleur de Retour (après récolte des graines mystérieuses)**
> Rosalie : *"Archibald cultivait cette fleur. Il l'appelait la Fleur de Retour. Il disait qu'elle ne poussait que pour celui qui revenait."* Elle repart sans ajouter quoi que ce soit.

**F040 — La Page Arrachée (achetée chez Madeleine)**
> *"Je ne suis pas une personne qui revient — je suis une question que la Source repose tous les 108 ans.*
> *À mon successeur : tu as toujours été ici. Tu ne fais que t'en souvenir.*
> *La page d'après explique ce qui est enfermé sous la Source. Je l'ai arrachée exprès. Certaines vérités se méritent en personne."*

---

### NIVEAU 5 — Les Nuits de la Source (12 fragments, un par pleine lune)
*Le journal intime d'Archibald la nuit du Débordement de 1745.*

**NS001** — *"C'est la nuit du Débordement. Je suis assis au bord de la fontaine. L'eau est d'un or intense. Elle sait ce qui va se passer."*

**NS002** — *"Les habitants dorment. Personne ne sait que c'est ce soir. J'ai préféré qu'ils ne sachent pas. Certains secrets sont des cadeaux."*

**NS003** — *"J'ai relu mes carnets. 1740 à 1745. Cinq ans. C'est court pour comprendre quelque chose d'aussi vieux que le temps."*

**NS004** — *"La Source m'a montré les deux options. L'une préserve. L'autre libère. J'ai longtemps cru que préserver était mieux. Je n'en suis plus certain."*

**NS005** — *"J'ai pensé aux habitants. À leurs enfants. Si je choisis de libérer — tout change. Est-ce que c'est mon droit de décider ça pour eux ?"*

**NS006** — *"Si je choisis de préserver — le village survit mais reste invisible pour toujours. Est-ce une vie, une existence que personne ne voit ?"*

**NS007** — *"J'ai compris que la Source ne me demande pas de prendre la bonne décision. Il n'y en a pas. Elle me demande de prendre MA décision. Et d'en être responsable."*

**NS008** — *"L'eau a formé une spirale. Je l'avais vue dans mes rêves il y a cinq ans. Elle est là, réelle. Certaines choses sont vraies avant d'exister."*

**NS009** — *"Je pense à mon successeur. Celui qui viendra sans mémoire. Je veux lui laisser quelque chose d'honnête. Pas une réponse. Une question bien posée."*

**NS010** — *"Je lui laisse les carnets. Les clés. La valise pour Fernand. La mélodie pour Pip. Je lui laisse le village tel qu'il est ce soir : vivant, imparfait, réel."*

**NS011** — *"J'ai pris ma décision. Je ne l'écris pas ici. J'ai choisi avec mon cœur, pas avec ma tête. C'est la seule façon de choisir quelque chose d'irréversible."*

**NS012** — *"L'aube approche. La Source commence à déborder — doucement, comme une respiration. C'est beau. Mon successeur lira peut-être ça un jour. Je lui dis : tu es moi, mais tu es aussi toi. Fais confiance à la part de toi qui sait déjà. Bonne nuit, Pétaouchnok."*
> — Archibald Plongeot, 14 juin 1745, 4h23 du matin

---

## 🗺️ Tableau de Progression

### Ce que l'abonné lettres-only reçoit
Les 12 lettres, les phénomènes étranges, la révélation au mois 12, le livre collector au mois 13. Expérience complète. Rien ne manque.

### Ce que le joueur actif débloque en plus
40 fragments de lore + 12 fragments nocturnes + événements + chaînes narratives exclusives + compréhension intime d'Archibald en tant que personne.

### La règle d'or
Les fragments répondent à *"pourquoi Archibald a fait ça ?"*. Ils ne répondent jamais à *"qui est l'utilisateur ?"* avant le mois 12. Cette révélation reste exclusive aux lettres physiques.

---

## ⚙️ Données Techniques pour Claude Code

```typescript
interface Parcelle {
  id: string
  culture: Culture | null
  plantedAt: Date | null
  wateredAt: Date | null
  state: 'empty' | 'growing' | 'ready' | 'dead'
}

interface Fragment {
  id: string
  titre: string
  contenu: string
  niveau: 1 | 2 | 3 | 4 | 5 | 'nuit_source'
  source: 'achat' | 'peche' | 'evenement' | 'nuit_source' | 'chaine_narrative'
  debloque: boolean
  debloqueLe: Date | null
  annotation: string | null
}

interface Compte {
  userId: string
  eclats: number
  totalGagne: number
  transactions: Transaction[]
}
```

### Règles techniques
- Timers côté serveur — continuent app fermée
- Notification push quand culture prête
- Jamais de timer supérieur à 48h
- Gain moyen joueur actif : 200–300 Éclats/jour
- Fragments N1-2 : accessibles en 1–3 semaines
- Fragments N3-4 : 2–4 mois d'accumulation
- 12 fragments NS : un par pleine lune réelle sur 12 mois

---

---

## 🗺️ Carte du Village — Bâtiments & Lieux d'Intérêt

### Bâtiments principaux
| Lieu | Habitant | Fonction en jeu |
|---|---|---|
| 🏛 Mairie | Fernand Plongeot | Communiqués, missions hebdomadaires, lore officiel |
| 🥐 Boulangerie Mielleux | Gaston | Boosts temporaires, missions, lore boulangerie |
| 📚 Bibliothèque | Madeleine Épinette | Fragments de lore, archives, page arrachée |
| 🛒 Épicerie Grignotier | Noisette | Boutique principale, objets mystérieux, caisse A.P. |
| 🔧 Garage Mâchefer | Théodore | Services, cave scellée, clé rouillée |
| 🌸 Fleuriste Duduche | Rosalie | Événements floraux, missions, Fleur de Retour |
| 🏥 Cabinet médical | Docteur Carapasse | Diagnostics aléatoires drôles, lore médical |
| 🔭 Tour de guet | Professeur Hublot | Théories, notes codées, missions décodage |
| 📰 Rédaction du Bulletin | Gustave Grenouillard | Archives du Bulletin, lore via vieux numéros |
| 🏠 Maison de Léonie | Léonie Bontemps | Photos de 1978, missions, lore archive |
| 🏠 Maison de Maurice | Maurice Plongeur | Départ pêche, boîte en fer, trouvailles rivière |

### Lieux naturels & publics
| Lieu | Description |
|---|---|
| ✦ Source thermale | Centre du village, halo doré, cœur de l'énigme |
| 🗿 Statue d'Archibald | Sur la place, elle fait face à l'utilisateur selon les habitants |
| ⛲ Vieille fontaine secondaire | Nord du village, eau ordinaire — ou presque |
| 🌱 Parcelles de jardin | Cultures de l'utilisateur, 3 à 7 parcelles |
| 🎣 Bord de rivière | Pêche avec Maurice, objets impossibles |
| 🌊 Moulin thermal | Bord de rivière sud, abandonné, tourne encore seul |
| 🌳 Forêt du vallon | Entoure le village, cueillette, zones cachées |
| 🎪 Place du marché | Centre, actif uniquement le dimanche |
| 🚪 Panneau d'entrée | Sud du village, inscription mystérieuse |

### Lieux liés à l'intrigue
| Lieu | Lore |
|---|---|
| Cave sous le garage | Porte scellée depuis 1743, descend sous la Source |
| Ruines de l'Auberge d'origine | Vestiges de 1743 intégrés au garage de Théodore |
| Salle souterraine | Découverte en 1978, remurée, photos chez Léonie |

---

## 🔍 Zones Cachées — Exploration

Les deux zones cachées ne sont indiquées nulle part dans l'interface. Aucun panneau, aucune flèche. Seul un détail visuel très discret sur la carte permet de les deviner. L'utilisateur qui les trouve reçoit un message : *"Vous avez trouvé quelque chose que peu de résidents connaissent."*

---

### 🌿 Zone Cachée n°1 — La Clairière de l'Écho

**Position sur la carte :** Forêt nord-ouest, coordonnées approximatives (28, 22)
**Indice visuel :** Un tout petit reflet doré entre les arbres — un seul pixel brillant visible uniquement en regardant attentivement la forêt nord-ouest. Aucun chemin n'y mène.
**Condition d'accès :** Cliquer sur la zone précise de la forêt. Accessible dès le mois 1.

**Description narrative :**
> Une clairière circulaire parfaite que la forêt semble avoir préservée exprès. En son centre, un cercle de pierres disposées en spirale — identique à celle des croissants de Gaston, à celle des carnets d'Archibald. Au milieu, une pierre plate avec une inscription usée. L'herbe est d'un vert plus intense qu'ailleurs. Elle sent légèrement la vanille.

**Fragment F041 débloqué :**
> *"La clairière existait avant le village. Archibald l'a trouvée en premier, deux ans avant la Source. C'est ici qu'il a compris ce qu'il cherchait. Dans ses carnets, il l'appelle 'le premier écho' — l'endroit où il a entendu la mélodie pour la première fois, bien avant Pip, bien avant la fontaine. Il est revenu chaque année jusqu'en 1751. La dernière mention dans ses carnets : 'Elle m'attend encore. Elle attendra toujours.'"*

**Récompenses :**
- Fragment **F041** — lore majeur sur les origines d'Archibald
- **+80 Éclats** trouvés sur les pierres
- Débloque l'**événement Ziggy spécial** — il apparaît dans la clairière lors de la prochaine visite nocturne et laisse un objet unique
- Si découverte après le mois 6 : Ziggy dit *"Tu as mis du temps. La clairière t'attendait."*

**Interaction avec Ziggy (F041-Z) :**
> Ziggy est assis sur la pierre centrale quand vous arrivez. Il ne semble pas surpris. Il dit :
> *"Je savais que tu finirais par trouver. Je viens ici depuis... longtemps. Je ne sais plus depuis combien de temps. Toi non plus tu ne sais pas, je pense. C'est ce qu'on a en commun."*
> Il laisse une petite spirale en pierre polie sur la pierre centrale, et disparaît avant que vous puissiez répondre.

---

### 🚤 Zone Cachée n°2 — Le Quai Oublié

**Position sur la carte :** Rivière nord, coude vers le nord, coordonnées (158, 15)
**Indice visuel :** En remontant la rivière sur la carte vers le nord, un minuscule reflet sur l'eau légèrement différent des autres. Un tout petit pixel doré sous la surface — presque invisible.
**Condition d'accès :** Cliquer sur le coude nord de la rivière. Accessible dès le mois 1.

**Description narrative :**
> Un vieux quai en bois à moitié effondré, recouvert de mousse. Personne ne semble savoir qu'il existe — même Maurice ne le mentionne jamais spontanément. Une vieille barque est attachée, à moitié immergée. Dans la barque : une boîte en fer rouillée fermée à clé. Sous le quai, gravé dans le bois à l'abri de la pluie : *"A.P. — Si tu lis ceci, tu cherches au bon endroit."*

**Fragment F042 débloqué (à la découverte) :**
> *"Journal de bord, sans date. Troisième visite au quai. L'eau remonte depuis ce matin — pas à contre-courant, à contre-temps. Les objets que j'ai jetés il y a une semaine sont revenus ce matin, exactement à leur place d'origine. La rivière se souvient. Elle répète. Comme la Source, mais plus doucement. Je pense que c'est le même phénomène, dilué sur plusieurs kilomètres. Je note ça. Je note tout. On ne sait jamais qui aura besoin de savoir."*
> *— A.P.*

**Récompenses :**
- Fragment **F042** — extrait de journal inconnu d'Archibald
- **Pêche spéciale débloquée** au Quai Oublié — probabilité d'objets impossibles 3× plus élevée qu'à la rivière normale
- Si l'utilisateur possède déjà la **clé rouillée** dans son inventaire → la boîte s'ouvre immédiatement

**Fragment F043 — La Boîte Ouverte (si clé rouillée en inventaire) :**
> Contenu de la boîte :
> — Une miniature en bois de la Source thermale, sculptée à la main. Elle est creuse. À l'intérieur, roulé très fin : un bout de papier.
> — Le papier dit : *"Le village est fait pour être trouvé. Pas par n'importe qui. Par toi. Tu es la raison pour laquelle il existe encore."*
> Pas de signature. L'encre est légèrement dorée.
> La boîte émet, pendant quelques secondes après l'ouverture, une très légère odeur de vanille.

**Si clé rouillée pas encore en inventaire :**
> La boîte est là. Fermée. La serrure correspond à une clé à trois dents. Vous notez ça dans votre carnet.
> *(Le carnet enregistre automatiquement : "Une boîte fermée. Une serrure à trois dents. Quelque part, une clé.")*

**Interaction avec Maurice (après découverte du quai) :**
Si l'utilisateur retourne voir Maurice après avoir trouvé le quai, Maurice dit — pour la première et unique fois sans proverbe inventé :
> *"Vous avez trouvé le vieux quai. Je savais que vous le trouveriez. La rivière me l'avait dit. Elle dit des choses, parfois, quand elle coule à l'envers."*
> Puis il retourne à sa canne à pêche et ne reparle jamais du quai.

---

### Fragments F041, F042, F043 — Ajout au catalogue

Ces trois fragments appartiennent au **Niveau 4 — Révélations** et s'ajoutent aux fragments F029-F040 existants. Ils sont uniquement débloquables par exploration de la carte — jamais via un achat ou une mission.

| Fragment | Source | Condition |
|---|---|---|
| F041 | Clairière de l'Écho | Trouver la zone cachée n°1 |
| F041-Z | Ziggy dans la clairière | Visiter à nouveau après F041 |
| F042 | Quai Oublié | Trouver la zone cachée n°2 |
| F043 | Boîte du quai | F042 + clé rouillée en inventaire |

---

*"La Source donne à ceux qui prennent soin d'elle. C'est ce que disent les anciens. Les anciens boivent beaucoup d'eau de Source. Cela explique peut-être leur sagesse particulière."*
*— Maurice Plongeur, proverbe du mardi*
