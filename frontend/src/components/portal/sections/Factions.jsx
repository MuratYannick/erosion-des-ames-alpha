const Factions = () => {
  const factions = [
    {
      name: 'Les Éclaireurs de l\'Aube Nouvelle',
      tagline: 'Évolution et Ordre Naturel',
      color: 'mutant',
      icon: '🌿',
      description:
        'Faction exclusive aux Éveillés, ces survivants à la peau légèrement grisâtre se considèrent comme les élus d\'un dieu qui a purgé la Terre de l\'humanité corrompue. Pour eux, le grand cataclysme était nécessaire pour libérer la nature de l\'emprise destructrice de la technologie. Organisés en clans, ils ne jurent que par l\'ordre naturel.',
      philosophy:
        'Nous n\'avons pas muté, nous avons évolué. Les Purs sont une abomination qui doit disparaître.',
      objective: 'Éradiquer les Veilleurs de l\'Ancien Monde et purifier la Terre des derniers vestiges technologiques.',
    },
    {
      name: 'Les Veilleurs de l\'Ancien Monde',
      tagline: 'Savoir et Reconquête',
      color: 'pure',
      icon: '⚙️',
      description:
        'Faction exclusive aux Purs, ces survivants non-mutants se considèrent comme les derniers vrais humains. Ils vouent un culte aux technologies oubliées de l\'ancien monde, seule arme capable de reconquérir une nature devenue hostile et dégénérée. Pour eux, les Éveillés font partie de cette dégénérescence et représentent une menace de contamination.',
      philosophy:
        'La technologie nous a élevés au-dessus de la nature. Les mutants sont une maladie à éradiquer.',
      objective: 'Éliminer les Éclaireurs de l\'Aube Nouvelle et restaurer la suprématie humaine par la technologie.',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-city-900 to-city-950 py-16 md:py-24 border-b border-city-700">
      <div className="container mx-auto px-4">
        {/* Titre de Section */}
        <h2 className="text-4xl md:text-5xl font-titre-Jeu text-ochre-500 text-center mb-6">
          Les Factions Principales
        </h2>
        <p className="font-texte-corps text-city-400 text-center text-lg mb-12 max-w-3xl mx-auto">
          Deux grandes factions s'affrontent dans un conflit sans merci. Les sociétés tribales
          qui subsistent ont régressé au stade pré-technologique. Chaque faction est organisée
          en clans internes, unis par une même vision radicale de l'avenir.
        </p>

        {/* Grille des Factions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {factions.map((faction) => (
            <div
              key={faction.name}
              className={`bg-city-800 rounded-lg overflow-hidden shadow-xl transition-all transform hover:scale-[1.02] ${
                faction.color === 'mutant'
                  ? 'border-2 border-nature-800 hover:shadow-nature-800/50'
                  : 'border-2 border-blue-900 hover:shadow-blue-900/50'
              }`}
            >
              {/* Header */}
              <div className={`p-6 text-center ${
                faction.color === 'mutant'
                  ? 'bg-nature-900 border-b-2 border-nature-800'
                  : 'bg-blue-950 border-b-2 border-blue-900'
              }`}>
                <div className="text-6xl mb-3">{faction.icon}</div>
                <h3 className={`text-3xl font-titre-Jeu mb-2 ${
                  faction.color === 'mutant' ? 'text-nature-600' : 'text-blue-600'
                }`}>
                  {faction.name}
                </h3>
                <p className={`font-alternative-1 text-xl tracking-wide ${
                  faction.color === 'mutant' ? 'text-nature-500' : 'text-blue-500'
                }`}>
                  {faction.tagline}
                </p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Description */}
                <p className="font-texte-corps text-city-300 mb-6 leading-relaxed">
                  {faction.description}
                </p>

                {/* Philosophie */}
                <div className="mb-6">
                  <h4 className={`font-alternative-1 text-lg mb-3 tracking-wider ${
                    faction.color === 'mutant' ? 'text-nature-600' : 'text-blue-600'
                  }`}>
                    Philosophie de la faction :
                  </h4>
                  <p className={`font-texte-corps text-city-200 text-base italic leading-relaxed`}>
                    "{faction.philosophy}"
                  </p>
                </div>

                {/* Objectif */}
                <div className={`bg-city-800 p-4 rounded ${
                  faction.color === 'mutant'
                    ? 'border-l-4 border-nature-800'
                    : 'border-l-4 border-blue-900'
                }`}>
                  <h4 className="font-alternative-1 text-sm text-ochre-400 mb-2 tracking-wider">
                    Objectif principal :
                  </h4>
                  <p className="font-texte-corps text-city-300 text-sm leading-relaxed">
                    {faction.objective}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note sur les Clans Neutres */}
        <div className="text-center mt-12 max-w-4xl mx-auto">
          <div className="bg-city-800 border-2 border-neutral-dark rounded-lg p-6">
            <h3 className="text-xl font-alternative-1 text-neutral mb-3">
              Les Clans Neutres
            </h3>
            <p className="font-texte-corps text-city-400 text-sm leading-relaxed mb-3">
              En marge de ces deux factions, des clans neutres survivent tant bien que mal.
              Certains sont exclusifs à une ethnie, d'autres sont mixtes. Ils servent d'espions,
              de mercenaires, de marchands ou de messagers pour l'une ou l'autre faction, parfois
              les deux. Mal vus par les factions principales, ils naviguent dans un équilibre précaire.
            </p>
            <p className="font-texte-corps text-blood-400 text-xs italic">
              Note : Les clans neutres ne seront pas jouables dans la version Alpha, mais pourront
              être utiles aux Maîtres de Jeu pour enrichir leurs campagnes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Factions;
