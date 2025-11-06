import { Link } from 'react-router-dom';
import { MessageSquare, Lock, Users, ChevronRight } from 'lucide-react';

/**
 * SectionCard - Carte d'affichage d'une section
 * Design post-apocalyptique responsive
 *
 * @param {Object} section - Données de la section
 * @param {number} section.id - ID
 * @param {string} section.name - Nom
 * @param {string} section.slug - Slug pour URL
 * @param {string} section.description - Description
 * @param {boolean} section.is_public - Section publique ou privée
 * @param {boolean} section.is_locked - Section verrouillée
 * @param {number} section.topicsCount - Nombre de topics
 * @param {number} section.subsectionsCount - Nombre de sous-sections
 * @param {Object} section.lastTopic - Dernier topic posté
 * @param {string} categorySlug - Slug de la catégorie parente
 */
const SectionCard = ({ section, categorySlug }) => {
  const {
    slug,
    name,
    description,
    is_public,
    is_locked,
    topicsCount = 0,
    subsectionsCount = 0,
    lastTopic = null,
  } = section;

  return (
    <Link
      to={`/forum/${categorySlug}/${slug}`}
      className="block bg-neutral-800 border border-neutral-700 hover:border-ochre-600 rounded-lg p-4 sm:p-5 transition-all duration-200 hover:shadow-lg group"
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Icône gauche */}
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
          {is_locked ? (
            <Lock size={20} className="text-blood-400" />
          ) : (
            <MessageSquare size={20} className="text-ochre-500" />
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          {/* Titre et badge */}
          <div className="flex items-start gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-['Permanent_Marker'] text-ochre-400 group-hover:text-ochre-300 transition-colors line-clamp-1">
              {name}
            </h3>
            {!is_public && (
              <span className="shrink-0 px-2 py-0.5 bg-blood-900 text-blood-300 text-xs rounded border border-blood-700">
                Privée
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Stats et dernier topic */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Stats */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>{topicsCount} topics</span>
              </div>
              {subsectionsCount > 0 && (
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{subsectionsCount} sous-sections</span>
                </div>
              )}
            </div>

            {/* Dernier topic */}
            {lastTopic && (
              <div className="text-xs text-neutral-500 truncate">
                Dernier: <span className="text-neutral-400">{lastTopic.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Chevron droit */}
        <div className="shrink-0 flex items-center">
          <ChevronRight
            size={20}
            className="text-neutral-600 group-hover:text-ochre-500 transition-colors"
          />
        </div>
      </div>
    </Link>
  );
};

export default SectionCard;
