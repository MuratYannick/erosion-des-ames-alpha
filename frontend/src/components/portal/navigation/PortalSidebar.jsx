import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PortalSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Accueil', path: '/', icon: '🏠' },
    { name: 'Intro', path: '/intro', icon: '📖' },
    { name: 'Univers', path: '/univers', icon: '🌍' },
    { name: 'Règlement & CGU', path: '/reglement', icon: '📜' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Bouton Toggle - Toujours visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-32 z-40 bg-ochre-600 hover:bg-ochre-500 text-white p-3 rounded-r-lg shadow-lg transition-all transform hover:scale-105"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          )}
        </svg>
      </button>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-24 bottom-0 w-64 bg-city-900 border-r-2 border-ochre-600 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header du Sidebar */}
          <div className="p-6 border-b-2 border-city-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-alternative-1 text-ochre-500">
                Navigation Portail
              </h2>
              <p className="text-xs font-texte-corps text-city-500 mt-1">
                Explorez le monde
              </p>
            </div>
            {/* Bouton de fermeture */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-ochre-500 hover:text-ochre-400 transition-colors p-2 hover:bg-city-800 rounded"
              aria-label="Fermer le menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-grow p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-texte-corps text-base transition-all ${
                      isActive(item.path)
                        ? 'bg-ochre-600 text-white shadow-lg'
                        : 'text-city-300 hover:bg-city-800 hover:text-ochre-400'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer du Sidebar */}
          <div className="p-4 border-t-2 border-city-800">
            <p className="text-xs font-texte-corps text-city-500 text-center">
              Version Alpha 0.1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PortalSidebar;
