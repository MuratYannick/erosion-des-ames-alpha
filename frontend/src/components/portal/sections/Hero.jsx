import { Link } from 'react-router-dom';
import { storage } from '../../../utils/localStorage';

const Hero = () => {
  const token = storage.getToken();

  return (
    <section className="relative bg-gradient-to-b from-city-900 via-city-800 to-city-900 py-20 md:py-32 border-b-4 border-ochre-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Titre Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-titre-Jeu text-ochre-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">
            ÉROSION DES ÂMES
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl font-alternative-1 text-ochre-300 mb-4">
            Survivez dans un monde dévasté
          </p>

          {/* Description */}
          <p className="text-base md:text-lg font-texte-corps text-city-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Dans un monde post-apocalyptique ravagé par une catastrophe mystérieuse,
            deux factions s'affrontent : les <span className="text-mutant font-bold">Éveillés</span>,
            dotés de pouvoirs étranges, et les <span className="text-pure font-bold">Purs</span>,
            derniers vestiges de l'humanité d'antan.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          <div className="mt-8">
            <span className="inline-block px-4 py-2 bg-blood-900 border-2 border-blood-700 text-blood-300 font-alternative-1 text-sm rounded-full">
              VERSION ALPHA - EN DÉVELOPPEMENT
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ochre-500 to-transparent"></div>
    </section>
  );
};

export default Hero;
