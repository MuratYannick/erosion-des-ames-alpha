import PortalLayout from '../../components/portal/layout/PortalLayout';

const Univers = () => {
  const loreItems = [
    {
      title: 'L\'Érosion',
      icon: '⚡',
      color: 'ochre',
      content:
        'L\'événement cataclysmique qui a transformé le monde. Une vague d\'énergie mystérieuse qui a érodé non seulement la matière, mais aussi les âmes elles-mêmes. Son origine reste un mystère que certains cherchent encore à percer.',
    },
    {
      title: 'Les Zones Érodées',
      icon: '🌪️',
      color: 'blood',
      content:
        'Des zones où l\'Érosion est encore active. Le temps et l\'espace y sont distordus, les lois de la physique deviennent imprévisibles. Dangereuses mais riches en ressources rares, elles attirent les plus audacieux.',
    },
    {
      title: 'Les Ruines',
      icon: '🏚️',
      color: 'neutral',
      content:
        'Les vestiges des anciennes villes. Certaines sont devenues des refuges pour les survivants, d\'autres sont hantées par des créatures mutantes. Chaque ruine cache des secrets de l\'ancien monde.',
    },
    {
      title: 'Les Créatures',
      icon: '👾',
      color: 'nature',
      content:
        'L\'Érosion a transformé la faune terrestre. Des bêtes mutées rôdent dans les zones abandonnées. Certaines sont devenues plus intelligentes, d\'autres plus féroces. La nature a repris ses droits... différemment.',
    },
    {
      title: 'La Technologie Pré-Érosion',
      icon: '⚙️',
      color: 'pure',
      content:
        'Les reliques de l\'ancien monde. Les Purs cherchent à préserver et comprendre cette technologie, tandis que les Éveillés la considèrent comme obsolète. Pourtant, elle reste puissante entre de bonnes mains.',
    },
    {
      title: 'Les Pouvoirs Psioniques',
      icon: '🧠',
      color: 'mutant',
      content:
        'Les capacités développées par les Éveillés. Télékinésie, manipulation de l\'énergie, sens augmentés... Chaque Éveillé manifeste des pouvoirs uniques, mais tous puisent dans l\'essence même de l\'Érosion.',
    },
  ];

  return (
    <PortalLayout>
      <section className="bg-city-900">
        {/* Bannière avec image de fond - Titre et Sous-titre */}
        <div
          className="relative bg-cover bg-center bg-no-repeat py-20 md:py-32"
          style={{
            backgroundImage: 'url(/portalIlustrations/banner.png)',
          }}
        >
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Titre */}
              <h1 className="text-4xl md:text-6xl font-titre-Jeu text-ochre-500 mb-6 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
                L'Univers
              </h1>

              {/* Sous-titre */}
              <p className="text-xl md:text-2xl font-alternative-1 text-ochre-300 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                Le lore d'un monde post-apocalyptique
              </p>
            </div>
          </div>
        </div>

        {/* Contenu sous la bannière */}
        <div className="bg-gradient-to-b from-city-900 via-city-950 to-city-900 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 mb-12 shadow-xl">
              <p className="font-texte-corps text-city-300 text-lg leading-relaxed text-center">
                Plongez dans le lore d'<span className="text-ochre-500 font-bold">Érosion des Âmes</span>,
                un monde post-apocalyptique où l'humanité lutte pour sa survie entre mutation et
                préservation, dans les ruines d'une civilisation disparue.
              </p>
            </div>

            {/* Grille des éléments de Lore */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {loreItems.map((item, index) => (
                <div
                  key={index}
                  className={`bg-city-800 border-2 border-${item.color} rounded-lg p-6 hover:bg-city-750 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-${item.color}/30`}
                >
                  <div className="text-5xl mb-4 text-center">{item.icon}</div>
                  <h3 className={`text-xl font-alternative-1 text-${item.color} text-center mb-4`}>
                    {item.title}
                  </h3>
                  <p className="font-texte-corps text-city-300 text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Section détaillée */}
            <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
              <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                Le Monde d'Aujourd'hui
              </h2>

              <div className="space-y-6 font-texte-corps text-city-300 leading-relaxed">
                <p className="text-lg">
                  Les grandes métropoles ne sont plus que des coquilles vides, des squelettes
                  de béton et d'acier envahis par la végétation mutante. Entre ces ruines,
                  des communautés de survivants se sont formées, chacune avec sa propre vision
                  de l'avenir.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-city-900 border-l-4 border-mutant p-6 rounded">
                    <h4 className="text-lg font-alternative-1 text-mutant mb-3">
                      Les Colonies Éveillées
                    </h4>
                    <p className="text-sm">
                      Établies dans les Zones Érodées, ces communautés vivent en symbiose avec
                      l'énergie de l'Érosion. Leurs architectures défient la géométrie euclidienne,
                      leurs cultures célèbrent la transformation.
                    </p>
                  </div>

                  <div className="bg-city-900 border-l-4 border-pure p-6 rounded">
                    <h4 className="text-lg font-alternative-1 text-pure mb-3">
                      Les Citadelles Pures
                    </h4>
                    <p className="text-sm">
                      Protégées par des boucliers technologiques, ces forteresses maintiennent
                      les traditions de l'ancien monde. Ordre, science et discipline sont leurs
                      piliers fondamentaux.
                    </p>
                  </div>
                </div>

                <p className="text-lg">
                  Entre ces deux extrêmes, des zones neutres existent - des marchés où les deux
                  factions commercent, des territoires disputés où la guerre fait rage, et des
                  terres sauvages où seuls les plus forts survivent.
                </p>

                <div className="border-l-4 border-ochre-600 pl-6 my-8 bg-city-900 p-6 rounded">
                  <p className="text-lg italic text-ochre-400">
                    "Dans ce nouveau monde, chaque choix a un prix. Chaque pouvoir a un coût.
                    Et chaque survivant doit décider : qui était-il avant l'Érosion, et qui
                    veut-il devenir après ?"
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/intro"
                className="px-6 py-3 bg-city-700 hover:bg-city-600 text-ochre-400 font-texte-corps text-center rounded-lg transition-all"
              >
                ← Retour à l'Introduction
              </a>
              <a
                href="/reglement"
                className="px-6 py-3 bg-ochre-600 hover:bg-ochre-500 text-white font-texte-corps text-center rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Règlement & CGU →
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Univers;
