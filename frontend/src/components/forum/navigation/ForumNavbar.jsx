import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '../../../hooks/useBreakpoint';

/**
 * ForumNavbar - Barre de navigation principale du forum
 * Layout: [Logo + Titre] [Menu Navigation] [User Menu]
 * Responsive: Menu hamburger sur mobile/tablette (< lg)
 */
const ForumNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Simulation user (à remplacer par contexte auth)
  const user = {
    username: 'Joueur1',
    role: 'player',
    avatar: null,
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // TODO: Implémenter la déconnexion
    navigate('/portal');
  };

  // Menu items des catégories (à récupérer depuis l'API plus tard)
  const categoryMenuItems = [
    { id: 1, name: 'Hors Roleplay', slug: 'hors-roleplay', path: '/forum/category/hors-roleplay' },
    { id: 2, name: 'Roleplay', slug: 'roleplay', path: '/forum/category/roleplay' },
    { id: 3, name: 'Archives', slug: 'archives', path: '/forum/category/archives' },
  ];

  return (
    <header className="bg-neutral-900 border-b border-ochre-600 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Section Gauche: Logo + Titre */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link to="/forum" className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Logo */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ochre-600 rounded-lg flex items-center justify-center">
              <span className="text-neutral-900 font-bold text-lg sm:text-xl">E</span>
            </div>
            {/* Titre */}
            <h1 className="text-ochre-400 font-['Metal_Mania'] text-lg sm:text-xl lg:text-2xl whitespace-nowrap hidden xs:block">
              Érosion des Âmes
            </h1>
          </Link>
        </div>

        {/* Section Milieu: Navigation principale (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Retour au portail */}
          <Link
            to="/portal"
            className="px-4 py-2 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Portail
          </Link>

          {/* Séparateur */}
          <div className="w-px h-6 bg-neutral-700 mx-2" />

          {/* Catégories */}
          {categoryMenuItems.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="px-4 py-2 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Section Droite: User Menu + Menu Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Menu (Desktop) */}
          <div className="hidden sm:block relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors"
              aria-label="Menu utilisateur"
              aria-expanded={isUserMenuOpen}
            >
              <User size={20} />
              <span className="hidden md:inline">{user.username}</span>
            </button>

            {/* Dropdown User Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl py-2">
                <Link
                  to="/forum/profile"
                  className="flex items-center gap-2 px-4 py-2 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-700 transition-colors"
                >
                  <User size={18} />
                  Mon profil
                </Link>
                <Link
                  to="/forum/settings"
                  className="flex items-center gap-2 px-4 py-2 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-700 transition-colors"
                >
                  <Settings size={18} />
                  Paramètres
                </Link>
                <hr className="my-2 border-neutral-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-blood-400 hover:text-blood-300 hover:bg-neutral-700 transition-colors"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Bouton Menu Hamburger (Mobile/Tablet) */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile/Tablet (< lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-900">
          <nav className="px-4 py-4 space-y-1">
            {/* Retour au portail */}
            <Link
              to="/portal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Retour au Portail
            </Link>

            {/* Séparateur */}
            <hr className="border-neutral-800 my-2" />

            {/* Catégories */}
            {categoryMenuItems.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors"
              >
                {category.name}
              </Link>
            ))}

            {/* Séparateur */}
            <hr className="border-neutral-800 my-2" />

            {/* User Menu (Mobile) */}
            <div className="sm:hidden space-y-1">
              <Link
                to="/forum/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2"
              >
                <User size={18} />
                Mon profil ({user.username})
              </Link>
              <Link
                to="/forum/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-neutral-300 hover:text-ochre-400 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2"
              >
                <Settings size={18} />
                Paramètres
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-3 text-blood-400 hover:text-blood-300 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ForumNavbar;
