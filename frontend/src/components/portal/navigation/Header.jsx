import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import UserMenu from './UserMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-city-950 border-b-2 border-ochre-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et Titre */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-ochre-500 text-4xl font-titre-Jeu group-hover:text-ochre-400 transition-colors">
              ⚔
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-titre-Jeu text-ochre-500 group-hover:text-ochre-400 transition-colors">
                Érosion des Âmes
              </h1>
              <p className="text-xs md:text-sm text-city-400 font-texte-corps">
                Alpha - Monde Post-Apocalyptique
              </p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Navigation />
            <UserMenu />
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-ochre-500 hover:text-ochre-400 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-city-700">
            <div className="flex flex-col space-y-4">
              <Navigation mobile />
              <div className="pt-4 border-t border-city-700">
                <UserMenu mobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
