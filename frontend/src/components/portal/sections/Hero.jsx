import { Link } from 'react-router-dom';
import { storage } from '../../../utils/localStorage';

const Hero = () => {
  const token = storage.getToken();

  return (
    <section className="relative bg-city-900 border-b-4 border-ochre-600">
      {/* Bannière avec image de fond - Titre et Sous-titre */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-32 md:py-48"
        style={{
          backgroundImage: 'url(/portalIllustrations/banner.png)',
        }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Titre Principal */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-titre-Jeu text-ochre-500 mb-6 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
              ÉROSION DES ÂMES
            </h1>

            {/* Sous-titre */}
            <p className="text-2xl md:text-3xl font-alternative-1 text-ochre-300 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              Survivez dans un monde dévasté
            </p>
          </div>
        </div>
      </div>

      {/* Section sous la bannière - Description, Boutons et Badge */}
      <div className="bg-gradient-to-b from-city-900 to-city-950 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* Description */}
            <p className="text-base md:text-lg font-texte-corps text-city-300 mb-10 leading-relaxed">
              Dans un monde post-apocalyptique ravagé par une catastrophe mystérieuse,
              deux factions s'affrontent : les <span className="text-mutant font-bold">Éveillés</span>,
              dotés de pouvoirs étranges, et les <span className="text-pure font-bold">Purs</span>,
              derniers vestiges de l'humanité d'antan.
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {!token ? (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 bg-ochre-600 hover:bg-ochre-500 text-white font-texte-corps text-lg rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-ochre-600/50"
                  >
                    Commencer l'Aventure
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-city-700 hover:bg-city-600 text-ochre-400 font-texte-corps text-lg rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Se Connecter
                  </Link>
                </>
              ) : (
                <Link
                  to="/game"
                  className="w-full sm:w-auto px-8 py-4 bg-nature-600 hover:bg-nature-500 text-white font-texte-corps text-lg rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-nature-600/50"
                >
                  Entrer dans le Jeu
                </Link>
              )}
            </div>

            {/* Badge Alpha */}
            <div>
              <span className="inline-block px-4 py-2 bg-blood-900 border-2 border-blood-700 text-blood-300 font-alternative-1 text-sm rounded-full">
                VERSION ALPHA - EN DÉVELOPPEMENT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ochre-500 to-transparent"></div>
    </section>
  );
};

export default Hero;
