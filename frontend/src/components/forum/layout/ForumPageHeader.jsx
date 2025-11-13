import { Plus, Edit, Trash2, ArrowRightLeft } from 'lucide-react';
import ActionButton from '../buttons/ActionButton';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * ForumPageHeader - En-tête réutilisable pour les pages du forum
 * Affiche le titre, badges et actions disponibles
 *
 * @param {Object} props
 * @param {string} props.title - Titre de la page
 * @param {string} props.description - Description (optionnel)
 * @param {Object} props.badges - Badges à afficher
 * @param {Object} props.stats - Statistiques à afficher
 * @param {Object} props.actions - Actions disponibles
 */
const ForumPageHeader = ({
  title,
  description,
  badges = {},
  stats = {},
  actions = {},
}) => {
  const { user } = useAuth();

  const {
    isPinned = false,
    isLocked = false,
    isPublic = true,
  } = badges;

  const {
    views,
    replies,
    topics,
    sections,
  } = stats;

  const {
    // Actions de création (primary)
    onNew,
    newLabel,
    newPermission = true,

    // Actions d'édition (primary)
    onEdit,
    editPermission = false,

    // Actions de déplacement (danger)
    onMove,
    movePermission = false,

    // Actions de suppression (danger)
    onDelete,
    deletePermission = false,
    isDeleting = false,
  } = actions;

  return (
    <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="text-2xl md:text-3xl font-titre-Jeu text-ochre-500">
          {title}
        </h1>

        {/* Boutons d'action (taille large) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Bouton de création (primary) */}
          {onNew && newPermission && (
            <ActionButton
              icon={Plus}
              label={newLabel || 'Nouveau'}
              onClick={onNew}
              variant="primary"
              size="large"
            />
          )}

          {/* Bouton d'édition (primary) */}
          {onEdit && editPermission && (
            <ActionButton
              icon={Edit}
              onClick={onEdit}
              variant="primary"
              size="small"
              title="Modifier"
            />
          )}

          {/* Bouton de déplacement (danger) */}
          {onMove && movePermission && (
            <ActionButton
              icon={ArrowRightLeft}
              onClick={onMove}
              variant="danger"
              size="small"
              title="Déplacer"
            />
          )}

          {/* Bouton de suppression (danger) */}
          {onDelete && deletePermission && (
            <ActionButton
              icon={Trash2}
              onClick={onDelete}
              variant="danger"
              size="small"
              title="Supprimer"
              isLoading={isDeleting}
            />
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-city-300 font-texte-corps text-base md:text-lg mb-3">
          {description}
        </p>
      )}

      {/* Badges et stats */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Badge Épinglé */}
        {isPinned && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-ochre-900 border border-ochre-700 text-ochre-300 rounded text-sm font-texte-corps">
            Épinglé
          </span>
        )}

        {/* Badge Verrouillé */}
        {isLocked && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-city-700 border border-city-600 text-city-300 rounded text-sm font-texte-corps">
            Verrouillé
          </span>
        )}

        {/* Badge Privé */}
        {!isPublic && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blood-900 border border-blood-700 text-blood-300 rounded text-sm font-texte-corps">
            Privé
          </span>
        )}

        {/* Statistiques */}
        {(views !== undefined || replies !== undefined || topics !== undefined || sections !== undefined) && (
          <div className="ml-auto flex items-center gap-4 text-sm text-city-400 font-texte-corps">
            {views !== undefined && <span>{views} vues</span>}
            {replies !== undefined && <span>{replies} réponses</span>}
            {topics !== undefined && <span>{topics} topics</span>}
            {sections !== undefined && <span>{sections} sections</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPageHeader;
