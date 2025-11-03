import { Link } from 'react-router-dom';
import { MessageSquare, Pin, Lock, Eye, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * TopicCard - Carte d'affichage d'un topic
 * Design post-apocalyptique responsive
 *
 * @param {Object} topic - Données du topic
 * @param {number} topic.id - ID
 * @param {string} topic.title - Titre
 * @param {string} topic.slug - Slug pour URL
 * @param {boolean} topic.is_pinned - Topic épinglé
 * @param {boolean} topic.is_locked - Topic verrouillé
 * @param {number} topic.views_count - Nombre de vues
 * @param {number} topic.postsCount - Nombre de posts
 * @param {string} topic.author_name - Nom de l'auteur
 * @param {string} topic.created_at - Date de création
 * @param {Object} topic.lastPost - Dernier post
 */
const TopicCard = ({ topic }) => {
  const {
    slug,
    title,
    is_pinned,
    is_locked,
    views_count = 0,
    postsCount = 0,
    author_name,
    created_at,
    lastPost = null,
  } = topic;

  // Formater la date relative
  const timeAgo = created_at
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })
    : '';

  return (
    <Link
      to={`/forum/topic/${slug}`}
      className={`block border rounded-lg p-4 transition-all duration-200 hover:shadow-lg group ${
        is_pinned
          ? 'bg-ochre-950 border-ochre-700 hover:border-ochre-600'
          : 'bg-neutral-800 border-neutral-700 hover:border-ochre-600'
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Icône gauche */}
        <div
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            is_pinned ? 'bg-ochre-800' : 'bg-neutral-700'
          }`}
        >
          {is_locked ? (
            <Lock size={18} className="text-blood-400" />
          ) : is_pinned ? (
            <Pin size={18} className="text-ochre-300" />
          ) : (
            <MessageSquare size={18} className="text-ochre-500" />
          )}
        </div>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          {/* Titre et badges */}
          <div className="flex items-start gap-2 mb-2">
            <h3 className="flex-1 text-base sm:text-lg font-semibold text-ochre-400 group-hover:text-ochre-300 transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex gap-1 shrink-0">
              {is_pinned && (
                <span className="px-2 py-0.5 bg-ochre-900 text-ochre-300 text-xs rounded border border-ochre-700">
                  Épinglé
                </span>
              )}
              {is_locked && (
                <span className="px-2 py-0.5 bg-blood-900 text-blood-300 text-xs rounded border border-blood-700">
                  Verrouillé
                </span>
              )}
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-neutral-500">
            {/* Auteur et date */}
            <div className="flex items-center gap-1">
              <User size={12} />
              <span className="text-neutral-400">{author_name}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageSquare size={12} />
                <span>{postsCount} réponses</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{views_count} vues</span>
              </div>
            </div>
          </div>

          {/* Dernier post */}
          {lastPost && (
            <div className="mt-2 pt-2 border-t border-neutral-700 text-xs text-neutral-500">
              Dernier message par{' '}
              <span className="text-neutral-400">{lastPost.author_name}</span> •{' '}
              {formatDistanceToNow(new Date(lastPost.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
