import PortalLayout from '../../components/portal/layout/PortalLayout';

const Intro = () => {
  return (
    <PortalLayout>
      <section className="bg-city-900">
        {/* Bannière avec image de fond - Titre et Sous-titre */}
        <div
          className="relative bg-cover bg-center bg-no-repeat py-20 md:py-32"
          style={{
            backgroundImage: 'url(/portalIllustrations/banner.png)',
          }}
        >
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Titre */}
              <h1 className="text-4xl md:text-6xl font-titre-Jeu text-ochre-500 mb-6 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
                Introduction
              </h1>

              {/* Sous-titre */}
              <p className="text-xl md:text-2xl font-alternative-1 text-ochre-300 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                Bienvenue dans l'univers dévasté d'Érosion des Âmes
              </p>
            </div>
          </div>
        </div>

        {/* Contenu sous la bannière */}
        <div className="bg-gradient-to-b from-city-900 via-city-950 to-city-900 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
            {/* Contenu Principal */}
            <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
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
                  Aujourd'hui, deux grandes factions s'affrontent dans un conflit sans merci :
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-nature-950 border-2 border-nature-800 rounded-lg p-6">
                    <h3 className="text-xl font-alternative-1 text-nature-600 mb-3">
                      🌿 Les Éclaireurs de l'Aube Nouvelle
                    </h3>
                    <p>
                      Les Éveillés à la peau grisâtre, qui se croient élus d'un dieu vengeur.
                      Pour eux, le Cataclysme était une purification divine contre la technologie
                      destructrice. Organisés en clans, ils ne jurent que par l'ordre naturel.
                    </p>
                  </div>

                  <div className="bg-blue-950 border-2 border-blue-900 rounded-lg p-6">
                    <h3 className="text-xl font-alternative-1 text-blue-600 mb-3">
                      ⚙️ Les Veilleurs de l'Ancien Monde
                    </h3>
                    <p>
                      Les Purs non-mutés, qui se considèrent comme les derniers vrais humains.
                      Ils vouent un culte aux savoirs technologiques perdus, seule arme pour
                      reconquérir une nature devenue hostile et combattre les mutants dégénérés.
                    </p>
                  </div>
                </div>

                <p className="text-lg">
                  Entre ces deux visions radicales, entre foi en la nature et culte de la technologie,
                  chaque clan doit choisir son camp. Les neutres qui refusent de prendre parti sont
                  méprisés par les deux factions, condamnés à errer en marge de ce conflit total.
                </p>

                <p className="text-lg text-ochre-500 font-bold text-center mt-8">
                  Bienvenue dans Érosion des Âmes. Un jeu de rôle sur table où vos choix façonneront
                  votre destin dans ce monde dévasté.
                </p>
              </div>
            </div>

            {/* Navigation vers les autres pages */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/univers"
                className="px-6 py-3 bg-ochre-600 hover:bg-ochre-500 text-white font-texte-corps text-center rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Découvrir l'Univers →
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-city-700 hover:bg-city-600 text-ochre-400 font-texte-corps text-center rounded-lg transition-all"
              >
                ← Retour à l'Accueil
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Intro;
