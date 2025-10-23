const About = () => {
  return (
    <section className="bg-city-900 py-16 md:py-24 border-b border-city-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Titre de Section */}
          <h2 className="text-4xl md:text-5xl font-titre-Jeu text-ochre-500 text-center mb-12">
            À Propos du Jeu
          </h2>

          {/* Contenu Principal */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Colonne 1 */}
            <div className="bg-city-800 border-l-4 border-ochre-600 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-alternative-1 text-ochre-400 mb-4">
                Un Monde Dévasté
              </h3>
              <p className="font-texte-corps text-city-300 leading-relaxed">
                Suite à une catastrophe dont les origines ont été oubliées, le
                monde tel que nous le connaissions a disparu. Les ruines des
                anciennes villes servent désormais de refuge aux survivants,
                tandis qu'une guerre sans fin fait rage et que la nature reprend ses droits sur les vestiges de la
                civilisation.
              </p>
            </div>

            {/* Colonne 2 */}
            <div className="bg-city-800 border-l-4 border-nature-600 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-alternative-1 text-nature-400 mb-4">
                Survie et Évolution
              </h3>
              <p className="font-texte-corps text-city-300 leading-relaxed">
                Dans ce nouveau monde hostile, chaque décision compte. Explorez
                des zones dangereuses, collectez des ressources rares, combattez
                des créatures mutantes et d'autres joueurs. Votre capacité à
                vous adapter déterminera votre survie.
              </p>
            </div>
          </div>

          {/* Description Additionnelle */}
          <div className="bg-city-850 p-8 rounded-lg border-2 border-city-700">
            <p className="font-texte-corps text-city-300 text-center text-lg leading-relaxed">
              <span className="text-ochre-500 font-bold">Érosion des Âmes</span>{" "}
              est un jeu de rôle en ligne où vous incarnez un survivant dans un
              univers post-apocalyptique. Choisissez votre faction, développez
              vos compétences, &oelig;uvrez pour votre clan et participez à
              l'histoire évolutive de ce monde en ruine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
