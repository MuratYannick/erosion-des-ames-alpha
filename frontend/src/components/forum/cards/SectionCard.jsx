import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Lock, Users, ChevronRight, Pin } from 'lucide-react';
import EditSectionButton from '../buttons/EditSectionButton';
import { togglePinSection, toggleLockSection } from '../../../services/forum/sectionsService';

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
 * @param {Object} section.permissions - Permissions de l'utilisateur sur cette section
 * @param {string} categorySlug - Slug de la catégorie parente
 */
const SectionCard = ({ section, categorySlug, onUpdate }) => {
  const {
    id,
    slug,
    name,
    description,
    is_public,
    topicsCount = 0,
    subsectionsCount = 0,
    lastTopic = null,
    permissions = null,
  } = section;

  // États locaux pour les toggles
  const [isLocked, setIsLocked] = useState(section.is_locked);
  const [isPinned, setIsPinned] = useState(section.is_pinned);
  const [isToggling, setIsToggling] = useState(false);

  // Toggle lock
  const handleToggleLock = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!permissions?.canLock || isToggling) return;

    try {
      setIsToggling(true);
      await toggleLockSection(id);
      setIsLocked(!isLocked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erreur toggle lock:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Toggle pin
  const handleTogglePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!permissions?.canPin || isToggling) return;

    try {
      setIsToggling(true);
      await togglePinSection(id);
      setIsPinned(!isPinned);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erreur toggle pin:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="relative bg-neutral-800 border border-neutral-700 hover:border-ochre-600 rounded-lg p-4 sm:p-5 transition-all duration-200 hover:shadow-lg group">
      {/* Bouton éditer (en haut à droite) */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <EditSectionButton sectionId={id} permissions={permissions} />
      </div>

      <Link
        to={`/forum/${categorySlug}/${slug}`}
        className="block"
      >
        <div className="flex gap-3 sm:gap-4">
          {/* Icône gauche - Lock/Unlock cliquable */}
          <div
            className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
              isPinned ? 'bg-ochre-800' : 'bg-neutral-700'
            } ${
              permissions?.canLock ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
            }`}
            onClick={permissions?.canLock ? handleToggleLock : undefined}
            title={permissions?.canLock ? (isLocked ? 'Cliquez pour déverrouiller' : 'Cliquez pour verrouiller') : ''}
          >
            {isLocked ? (
              <Lock size={20} className="text-blood-400" />
            ) : (
              <MessageSquare size={20} className="text-ochre-500" />
            )}
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 pr-16">
            {/* Titre et badges */}
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-['Permanent_Marker'] text-ochre-400 group-hover:text-ochre-300 transition-colors line-clamp-1">
                {name}
              </h3>

              {/* Badges - Pin cliquable si permission */}
              <div className="flex gap-1 shrink-0">
                {(isPinned || permissions?.canPin) && (
                  <button
                    onClick={handleTogglePin}
                    disabled={!permissions?.canPin || isToggling}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${
                      isPinned
                        ? 'bg-ochre-900 text-ochre-300 border-ochre-700'
                        : 'bg-neutral-800 text-neutral-500 border-neutral-600'
                    } ${
                      permissions?.canPin
                        ? 'cursor-pointer hover:opacity-80 transition-opacity'
                        : 'cursor-default'
                    }`}
                    title={permissions?.canPin ? (isPinned ? 'Cliquez pour désépingler' : 'Cliquez pour épingler') : 'Section épinglée'}
                  >
                    <Pin size={12} className={isPinned ? 'fill-current' : ''} />
                    {isPinned && <span>Épinglée</span>}
                  </button>
                )}
                {isLocked && (
                  <span className="px-2 py-0.5 bg-blood-900 text-blood-300 text-xs rounded border border-blood-700">
                    Verrouillée
                  </span>
                )}
                {!is_public && (
                  <span className="px-2 py-0.5 bg-blood-900 text-blood-300 text-xs rounded border border-blood-700">
                    Privée
                  </span>
                )}
              </div>
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
    </div>
  );
};

export default SectionCard;
