import { useState } from 'react';
import PortalLayout from '../../components/portal/layout/PortalLayout';

const Univers = () => {
  const [activeSection, setActiveSection] = useState('mise-en-situation');

  const navigationItems = [
    {
      id: 'mise-en-situation',
      title: 'Mise en situation',
      icon: '🔥',
    },
    {
      id: 'factions-clans',
      title: 'Les factions et ses clans',
      icon: '⚔️',
    },
    {
      id: 'survivre',
      title: 'Survivre dans ce monde cruel',
      icon: '🛡️',
    },
    {
      id: 'bestiaire',
      title: 'Le bestiaire',
      icon: '🐺',
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

              {/* Navigation des sections */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`p-6 rounded-lg font-texte-corps text-center transition-all transform hover:scale-105 ${
                      activeSection === item.id
                        ? 'bg-ochre-600 text-white shadow-xl border-2 border-ochre-500'
                        : 'bg-city-800 text-city-300 hover:bg-city-700 border-2 border-city-700'
                    }`}
                  >
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <span className="text-sm font-alternative-1">{item.title}</span>
                  </button>
                ))}
              </div>

              {/* Section Mise en situation */}
              {activeSection === 'mise-en-situation' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-8 text-center">
                    Mise en situation
                  </h2>

                  {/* Image */}
                  <div className="mb-8">
                    <img
                      src="/portalIlustrations/campFire.png"
                      alt="Feu de camp dans les ruines"
                      className="w-full rounded-lg shadow-2xl"
                    />
                  </div>

                  {/* Texte d'introduction */}
                  <div className="space-y-6 font-texte-corps text-city-300 leading-relaxed">
                    <p className="text-lg">
                      L'année exacte a été oubliée. Les calendriers, comme tant d'autres vestiges
                      de l'ancien monde, n'ont plus de sens. Ce que les survivants savent avec certitude,
                      c'est que <span className="text-ochre-500 font-bold">le Grand Cataclysme</span> a tout détruit.
                    </p>

                    <p className="text-lg">
                      Un jour, sans avertissement, la civilisation s'est effondrée. Les villes se sont vidées,
                      les gouvernements ont disparu, et la nature a reconquis ce que l'humanité lui avait pris.
                      Les technologies complexes de l'ancien monde sont tombées dans l'oubli. Les survivants,
                      organisés en clans tribaux, ont régressé à un stade pré-technologique.
                    </p>

                    <p className="text-lg">
                      Mais le Cataclysme a laissé une autre marque : certains humains ont subi une légère
                      mutation, leur peau prenant une teinte <span className="text-nature-600 font-bold">légèrement grisâtre</span>.
                      Rien de plus. Pas de pouvoirs mystiques, pas de capacités surhumaines. Juste une différence
                      physique mineure... qui a suffi à diviser à jamais l'humanité.
                    </p>

                    <div className="border-l-4 border-ochre-600 pl-6 my-8 bg-city-900 p-6 rounded">
                      <p className="text-xl italic text-ochre-400">
                        "Nous sommes tous des survivants du même cataclysme. Pourtant, nous nous entretuons
                        pour une nuance de peau. La folie de l'ancien monde n'a pas disparu avec lui."
                      </p>
                      <p className="text-sm text-city-500 mt-4">
                        - Carnet d'un voyageur neutre, Date inconnue
                      </p>
                    </div>

                    <p className="text-lg">
                      Aujourd'hui, deux grandes factions s'affrontent dans un conflit sans merci, chacune
                      organisée en clans internes unis par une vision radicale de l'avenir. Entre foi en la
                      nature et culte de la technologie perdue, chaque survivant doit choisir son camp ou
                      vivre en marge, condamné à errer dans un monde qui ne pardonne aucune faiblesse.
                    </p>
                  </div>
                </div>
              )}

              {/* Section Factions et Clans - Placeholder */}
              {activeSection === 'factions-clans' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                    Les factions et ses clans
                  </h2>
                  <p className="font-texte-corps text-city-400 text-center text-lg">
                    Section à compléter...
                  </p>
                </div>
              )}

              {/* Section Survivre - Placeholder */}
              {activeSection === 'survivre' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                    Survivre dans ce monde cruel
                  </h2>
                  <p className="font-texte-corps text-city-400 text-center text-lg">
                    Section à compléter...
                  </p>
                </div>
              )}

              {/* Section Bestiaire - Placeholder */}
              {activeSection === 'bestiaire' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                    Le bestiaire
                  </h2>
                  <p className="font-texte-corps text-city-400 text-center text-lg">
                    Section à compléter...
                  </p>
                </div>
              )}

              {/* Navigation vers autres pages */}
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
