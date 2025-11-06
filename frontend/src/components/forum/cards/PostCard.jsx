import { User, Edit2, Trash2, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * PostCard - Carte d'affichage d'un post
 * Design post-apocalyptique responsive
 *
 * @param {Object} post - Données du post
 * @param {number} post.id - ID
 * @param {string} post.content - Contenu markdown
 * @param {string} post.author_name - Nom de l'auteur
 * @param {string} post.created_at - Date de création
 * @param {string} post.updated_at - Date de modification
 * @param {boolean} post.is_locked - Post verrouillé
 * @param {boolean} post.canEdit - L'utilisateur peut éditer
 * @param {boolean} post.canDelete - L'utilisateur peut supprimer
 * @param {Function} onEdit - Callback édition
 * @param {Function} onDelete - Callback suppression
 */
const PostCard = ({ post, onEdit, onDelete }) => {
  const {
    id,
    content,
    author_name,
    created_at,
    updated_at,
    is_locked,
    canEdit = false,
    canDelete = false,
  } = post;

  const timeAgo = created_at
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })
    : '';

  const isEdited = updated_at && updated_at !== created_at;

  return (
    <article className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-ochre-800 rounded-full flex items-center justify-center">
            <User size={20} className="text-ochre-200" />
          </div>

          {/* Auteur et date */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-ochre-400">{author_name}</h4>
              {is_locked && (
                <Lock size={14} className="text-blood-400" title="Post verrouillé" />
              )}
            </div>
            <p className="text-xs text-neutral-500">
              {timeAgo}
              {isEdited && ' • Modifié'}
            </p>
          </div>
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && !is_locked && (
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => onEdit(id)}
                className="p-2 text-neutral-400 hover:text-ochre-400 hover:bg-neutral-700 rounded transition-colors"
                aria-label="Éditer"
              >
                <Edit2 size={16} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-2 text-neutral-400 hover:text-blood-400 hover:bg-neutral-700 rounded transition-colors"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contenu du post */}
      <div className="prose prose-invert prose-ochre max-w-none">
        <div
          className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Footer (signature, badges, etc.) */}
      <div className="mt-4 pt-4 border-t border-neutral-700">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div>
            {/* On pourrait ajouter la signature du joueur ici */}
          </div>
          <div className="flex items-center gap-2">
            {/* Badges, réactions, etc. */}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
