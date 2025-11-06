import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Composant Breadcrumb - Fil d'Ariane
 * Affiche le chemin de navigation actuel dans le forum
 *
 * @param {Array} items - Liste des éléments du breadcrumb
 * @param {string} items[].label - Libellé de l'élément
 * @param {string} items[].path - Chemin de navigation (optionnel pour le dernier)
 *
 * @example
 * <Breadcrumb items={[
 *   { label: 'Accueil', path: '/forum' },
 *   { label: 'Catégorie', path: '/forum/category/1' },
 *   { label: 'Section' }
 * ]} />
 */
const Breadcrumb = ({ items = [] }) => {
  // Si pas d'items, on affiche juste l'accueil
  if (items.length === 0) {
    return (
      <nav
        className="bg-neutral-800 border-b border-neutral-700 px-4 py-2.5 sm:px-6 lg:px-8"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2 text-sm">
          <li className="flex items-center">
            <Link
              to="/forum"
              className="text-ochre-400 hover:text-ochre-300 transition-colors flex items-center gap-1"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Forum</span>
            </Link>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav
      className="bg-neutral-800 border-b border-neutral-700 px-4 py-2.5 sm:px-6 lg:px-8"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm flex-wrap">
        {/* Accueil avec icône */}
        <li className="flex items-center">
          <Link
            to="/forum"
            className="text-ochre-400 hover:text-ochre-300 transition-colors flex items-center gap-1"
            title="Retour au forum"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Forum</span>
          </Link>
        </li>

        {/* Séparateur */}
        {items.length > 0 && (
          <ChevronRight size={16} className="text-neutral-500" aria-hidden="true" />
        )}

        {/* Items du breadcrumb */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {!isLast && item.path ? (
                <>
                  <Link
                    to={item.path}
                    className="text-ochre-400 hover:text-ochre-300 transition-colors truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                  <ChevronRight
                    size={16}
                    className="text-neutral-500 ml-2"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <span
                  className="text-neutral-300 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
                  aria-current="page"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
