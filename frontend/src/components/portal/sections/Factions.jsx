const Factions = () => {
  const factions = [
    {
      name: 'Les Éveillés',
      tagline: 'Mutation et Pouvoir',
      color: 'mutant',
      icon: '⚡',
      description:
        'Les Éveillés ont été transformés par l\'Érosion. Ils possèdent des capacités surnaturelles qui défient les lois de la nature. Certains peuvent manipuler l\'énergie, d\'autres ont développé une force surhumaine ou des sens aiguisés.',
      strengths: [
        'Pouvoirs psioniques et mutations',
        'Résistance accrue aux radiations',
        'Capacités de régénération',
        'Sens développés',
      ],
      philosophy:
        'L\'évolution est inévitable. Embrassez le changement ou périssez.',
    },
    {
      name: 'Les Purs',
      tagline: 'Technologie et Préservation',
      color: 'pure',
      icon: '🛡',
      description:
        'Les Purs ont résisté aux effets de l\'Érosion grâce à la technologie et leur volonté de préserver l\'humanité originelle. Ils maîtrisent les anciennes technologies et développent constamment de nouveaux équipements pour survivre.',
      strengths: [
        'Maîtrise technologique avancée',
        'Équipements de protection sophistiqués',
        'Arsenal d\'armes high-tech',
        'Connaissances scientifiques',
      ],
      philosophy:
        'L\'humanité doit rester humaine. La technologie est notre salut.',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-city-900 to-city-950 py-16 md:py-24 border-b border-city-700">
      <div className="container mx-auto px-4">
        {/* Titre de Section */}
        <h2 className="text-4xl md:text-5xl font-titre-Jeu text-ochre-500 text-center mb-6">
          Choisissez Votre Faction
        </h2>
        <p className="font-texte-corps text-city-400 text-center text-lg mb-12 max-w-2xl mx-auto">
          Deux philosophies s'opposent dans ce monde nouveau. Votre choix déterminera
          votre gameplay et vos alliances.
        </p>

        {/* Grille des Factions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {factions.map((faction) => (
            <div
              key={faction.name}
              className={`bg-city-800 border-2 border-${faction.color} rounded-lg overflow-hidden shadow-xl hover:shadow-${faction.color}/50 transition-all transform hover:scale-[1.02]`}
            >
              {/* Header */}
              <div className={`bg-${faction.color}-dark p-6 text-center border-b-2 border-${faction.color}`}>
                <div className="text-6xl mb-3">{faction.icon}</div>
                <h3 className={`text-3xl font-titre-Jeu text-${faction.color}-light mb-2`}>
                  {faction.name}
                </h3>
                <p className={`font-alternative-1 text-xl text-${faction.color}-light`}>
                  {faction.tagline}
                </p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Description */}
                <p className="font-texte-corps text-city-300 mb-6 leading-relaxed">
                  {faction.description}
                </p>

                {/* Forces */}
                <div className="mb-6">
                  <h4 className={`font-alternative-1 text-lg text-${faction.color} mb-3`}>
                    Forces principales :
                  </h4>
                  <ul className="space-y-2">
                    {faction.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start font-texte-corps text-city-400"
                      >
                        <span className={`text-${faction.color} mr-2`}>▸</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Philosophie */}
                <div className={`bg-city-900 border-l-4 border-${faction.color} p-4 rounded`}>
                  <p className={`font-texte-corps text-${faction.color}-light italic text-sm`}>
                    "{faction.philosophy}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center mt-12">
          <p className="font-texte-corps text-city-500 text-sm">
            Note : Votre choix de faction sera définitif et influencera votre expérience de jeu.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Factions;
