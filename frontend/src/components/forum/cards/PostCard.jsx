import { User, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import EditPostButton from '../buttons/EditPostButton';
import DeletePostButton from '../buttons/DeletePostButton';
import MovePostButton from '../buttons/MovePostButton';

/**
 * PostCard - Carte d'affichage d'un post
 * Design post-apocalyptique responsive
 *
 * @param {Object} props
 * @param {Object} props.post - Données du post
 * @param {boolean} props.isFirstPost - Indique si c'est le premier post (post d'origine du topic)
 * @param {Function} props.onEdit - Callback appelé lors du clic sur éditer (postId)
 * @param {Function} props.onDelete - Callback appelé lors de la suppression (postId)
 * @param {Function} props.onMove - Callback appelé lors du clic sur déplacer (postId)
 * @param {boolean} props.isDeleting - Indique si une suppression est en cours
 */
const PostCard = ({ post, isFirstPost = false, onEdit, onDelete, onMove, isDeleting = false }) => {
  const {
    id,
    content,
    author_name,
    created_at,
    updated_at,
    is_locked,
    author_user_id,
    author_character_id,
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
        {!is_locked && (
          <div className="flex items-center gap-2">
            <EditPostButton post={post} onClick={() => onEdit(id)} />
            <DeletePostButton post={post} onDelete={onDelete} isDeleting={isDeleting} />
            <MovePostButton post={post} onClick={() => onMove(id)} />
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
