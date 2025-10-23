import PortalLayout from '../../components/portal/layout/PortalLayout';

const Intro = () => {
  return (
    <PortalLayout>
      <section className="bg-gradient-to-b from-city-900 via-city-950 to-city-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Titre */}
            <h1 className="text-4xl md:text-6xl font-titre-Jeu text-ochre-500 text-center mb-8">
              Introduction
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl font-alternative-1 text-ochre-300 text-center mb-12">
              Bienvenue dans l'univers dévasté d'Érosion des Âmes
            </p>

            {/* Contenu Principal */}
            <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
              <div className="space-y-6 font-texte-corps text-city-300 leading-relaxed">
                <p className="text-lg">
                  L'année exacte a été oubliée. Les calendriers n'ont plus de sens dans un monde
                  où le temps lui-même semble se distordre. Ce que l'humanité savait avec certitude,
                  c'est que <span className="text-ochre-500 font-bold">l'Érosion</span> a tout changé.
                </p>

                <p className="text-lg">
                  Un jour, sans avertissement, une vague d'énergie mystérieuse a balayé la planète.
                  Les villes ont craqué, les gouvernements se sont effondrés, et la nature elle-même
                  s'est rebellée contre la civilisation. Mais le plus terrifiant n'était pas la
                  destruction physique... c'était ce qui est arrivé aux <span className="text-mutant font-bold">âmes</span>.
                </p>

                <div className="border-l-4 border-ochre-600 pl-6 my-8 bg-city-900 p-6 rounded">
                  <p className="text-xl italic text-ochre-400">
                    "Certains ont été touchés par l'Érosion et ont changé. D'autres ont résisté
                    et se sont accrochés à ce qu'ils étaient. Mais personne n'est resté indemne."
                  </p>
                  <p className="text-sm text-city-500 mt-4">
                    - Archives des Survivants, Date inconnue
                  </p>
                </div>

                <p className="text-lg">
                  Aujourd'hui, deux factions dominent les vestiges de notre monde :
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-city-900 border-2 border-mutant rounded-lg p-6">
                    <h3 className="text-xl font-alternative-1 text-mutant mb-3">
                      ⚡ Les Éveillés
                    </h3>
                    <p>
                      Ceux qui ont embrassé le changement, qui ont laissé l'Érosion transformer
                      leur essence même. Leurs pouvoirs défient la logique, mais à quel prix ?
                    </p>
                  </div>

                  <div className="bg-city-900 border-2 border-pure rounded-lg p-6">
                    <h3 className="text-xl font-alternative-1 text-pure mb-3">
                      🛡 Les Purs
                    </h3>
                    <p>
                      Ceux qui ont refusé de céder, qui ont développé la technologie pour
                      préserver leur humanité originelle. Leur science est leur bouclier.
                    </p>
                  </div>
                </div>

                <p className="text-lg">
                  Entre ces deux philosophies opposées, entre mutation et préservation, entre
                  l'ancien et le nouveau monde, vous devrez choisir votre voie.
                </p>

                <p className="text-lg text-ochre-500 font-bold text-center mt-8">
                  Votre histoire commence maintenant. Quel survivant serez-vous ?
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
      </section>
    </PortalLayout>
  );
};

export default Intro;
