const Features = () => {
  const features = [
    {
      icon: '🌍',
      title: 'Monde Ouvert',
      description:
        'Explorez un vaste monde post-apocalyptique rempli de ruines, de zones dangereuses et de secrets enfouis.',
      color: 'ochre',
    },
    {
      icon: '⚔️',
      title: 'Combat PvP & PvE',
      description:
        'Affrontez d\'autres joueurs dans des zones de conflit ou combattez des créatures mutantes en solo ou en groupe.',
      color: 'blood',
    },
    {
      icon: '🎯',
      title: 'Système de Compétences',
      description:
        'Développez votre personnage avec un système de compétences flexible adapté à votre style de jeu.',
      color: 'nature',
    },
    {
      icon: '🏭',
      title: 'Craft & Ressources',
      description:
        'Collectez des ressources rares et fabriquez des équipements, armes et consommables pour survivre.',
      color: 'neutral',
    },
    {
      icon: '👥',
      title: 'Guildes & Alliances',
      description:
        'Rejoignez ou créez une guilde, forgez des alliances et participez à des guerres de territoires.',
      color: 'pure',
    },
    {
      icon: '📜',
      title: 'Quêtes Évolutives',
      description:
        'Participez à une histoire dynamique où vos choix et actions influencent le monde et ses événements.',
      color: 'mutant',
    },
  ];

  return (
    <section className="bg-city-900 py-16 md:py-24 border-b border-city-700">
      <div className="container mx-auto px-4">
        {/* Titre de Section */}
        <h2 className="text-4xl md:text-5xl font-titre-Jeu text-ochre-500 text-center mb-6">
          Fonctionnalités
        </h2>
        <p className="font-texte-corps text-city-400 text-center text-lg mb-12 max-w-2xl mx-auto">
          Découvrez les principales mécaniques de jeu qui font d'Érosion des Âmes
          une expérience unique.
        </p>

        {/* Grille des Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-city-800 border-2 border-${feature.color} rounded-lg p-6 hover:bg-city-750 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-${feature.color}/30`}
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">{feature.icon}</div>

              {/* Titre */}
              <h3 className={`text-xl font-alternative-1 text-${feature.color} text-center mb-3`}>
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-texte-corps text-city-300 text-sm text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section Additionnelle */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-city-800 via-city-850 to-city-800 border-2 border-ochre-600 rounded-lg p-8">
            <h3 className="text-2xl font-alternative-1 text-ochre-400 text-center mb-4">
              Et bien plus encore...
            </h3>
            <p className="font-texte-corps text-city-300 text-center leading-relaxed">
              Le jeu est en développement constant. De nouvelles fonctionnalités, zones,
              quêtes et mécaniques seront ajoutées régulièrement. Rejoignez la communauté
              sur le forum pour participer aux discussions et influencer le développement !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
