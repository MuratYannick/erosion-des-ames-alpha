import { Link } from 'react-router-dom';
import { MessageSquare, Users, ChevronRight } from 'lucide-react';

/**
 * CategoryCard - Carte d'affichage d'une catégorie
 * Design post-apocalyptique responsive
 *
 * @param {Object} category - Données de la catégorie
 * @param {number} category.id - ID
 * @param {string} category.name - Nom
 * @param {string} category.slug - Slug pour URL
 * @param {string} category.description - Description
 * @param {number} category.sectionsCount - Nombre de sections
 * @param {number} category.topicsCount - Nombre de topics
 */
const CategoryCard = ({ category }) => {
  const {
    slug,
    name,
    description,
    sectionsCount = 0,
    topicsCount = 0,
  } = category;

  return (
    <Link
      to={`/forum/category/${slug}`}
      className="block bg-neutral-800 border border-neutral-700 hover:border-ochre-600 rounded-lg p-4 sm:p-6 transition-all duration-200 hover:shadow-lg group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-['Permanent_Marker'] text-ochre-400 group-hover:text-ochre-300 transition-colors truncate">
            {name}
          </h2>
        </div>
        <ChevronRight
          size={24}
          className="text-neutral-600 group-hover:text-ochre-500 transition-colors shrink-0"
        />
      </div>

      {/* Description */}
      {description && (
        <p className="text-neutral-300 text-sm sm:text-base mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Users size={16} className="text-ochre-500" />
          <span>
            <span className="font-semibold text-neutral-300">{sectionsCount}</span>{' '}
            {sectionsCount > 1 ? 'sections' : 'section'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageSquare size={16} className="text-ochre-500" />
          <span>
            <span className="font-semibold text-neutral-300">{topicsCount}</span>{' '}
            {topicsCount > 1 ? 'topics' : 'topic'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
