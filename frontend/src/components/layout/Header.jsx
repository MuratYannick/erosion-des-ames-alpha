import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/hooks/useAuth';
import { Button } from '../ui';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Accueil', to: '/', disabled: false },
    { label: 'A propos', to: '/about', disabled: false },
    { label: 'Forum', to: '/forum', disabled: true },
    { label: 'Jeu', to: '/game', disabled: true },
  ];

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Erosion des <span className="text-purple-400">Ames</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.disabled ? '#' : link.to}
                onClick={(e) => link.disabled && e.preventDefault()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  link.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {link.disabled && <span className="ml-1 text-xs text-gray-600">(bientot)</span>}
              </Link>
            ))}
          </nav>

          {/* User Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-400 text-sm">
                  Bonjour, <span className="text-purple-400 font-medium">{user?.username}</span>
                </span>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Profil
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Deconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.disabled ? '#' : link.to}
                  onClick={(e) => {
                    if (link.disabled) {
                      e.preventDefault();
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    link.disabled
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {link.disabled && <span className="ml-1 text-xs text-gray-600">(bientot)</span>}
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <span className="px-4 text-gray-400 text-sm">
                    Bonjour, <span className="text-purple-400 font-medium">{user?.username}</span>
                  </span>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Deconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
