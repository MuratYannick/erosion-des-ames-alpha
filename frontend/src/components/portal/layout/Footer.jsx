import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-city-950 border-t-2 border-ochre-600 py-8">
      <div className="container mx-auto px-4">
        {/* Contenu Principal */}
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* Colonne 1: À Propos */}
          <div>
            <h3 className="text-xl font-titre-Jeu text-ochre-500 mb-4">
              Érosion des Âmes
            </h3>
            <p className="font-texte-corps text-city-400 text-sm leading-relaxed">
              Un MMORPG post-apocalyptique où deux factions luttent pour la survie
              dans un monde dévasté par l'Érosion.
            </p>
          </div>

          {/* Colonne 2: Navigation */}
          <div>
            <h4 className="text-lg font-alternative-1 text-ochre-400 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="font-texte-corps text-city-400 hover:text-ochre-500 transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/forum"
                  className="font-texte-corps text-city-400 hover:text-ochre-500 transition-colors text-sm"
                >
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  to="/game"
                  className="font-texte-corps text-city-400 hover:text-ochre-500 transition-colors text-sm"
                >
                  Jeu
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Compte */}
          <div>
            <h4 className="text-lg font-alternative-1 text-ochre-400 mb-4">
              Compte
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/register"
                  className="font-texte-corps text-city-400 hover:text-ochre-500 transition-colors text-sm"
                >
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="font-texte-corps text-city-400 hover:text-ochre-500 transition-colors text-sm"
                >
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-city-800 my-6"></div>

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="font-texte-corps text-city-500 text-sm mb-4 md:mb-0">
            © {currentYear} Érosion des Âmes - Alpha. Tous droits réservés.
          </p>

          {/* Badge de version */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blood-900 border border-blood-700 text-blood-300 font-texte-corps text-xs rounded">
              ALPHA v0.1.0
            </span>
            <span className="px-3 py-1 bg-city-800 border border-city-600 text-city-400 font-texte-corps text-xs rounded">
              EN DÉVELOPPEMENT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
