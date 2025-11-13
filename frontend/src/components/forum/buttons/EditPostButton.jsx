import { Edit2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * EditPostButton - Bouton pour éditer un post
 * Affiche conditionnellement selon les permissions
 *
 * @param {Object} props
 * @param {Object} props.post - Post à éditer
 * @param {Function} props.onClick - Callback appelé au clic
 */
const EditPostButton = ({ post, onClick }) => {
  const { user } = useAuth();

  // Vérifier si l'utilisateur peut éditer ce post
  const canEditPost = () => {
    // Pas connecté
    if (!user) return false;

    // Vérifier si c'est l'auteur du post
    const isAuthor = post.author_user_id === user.id;

    // Admin peut toujours éditer (à adapter selon votre logique de rôles)
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    // Vérifier les permissions si disponibles
    if (post?.permissions) {
      return post.permissions.canEdit;
    }

    // Par défaut, autoriser si auteur ou admin
    return isAuthor || isAdmin;
  };

  // Ne rien afficher si pas de permission
  if (!canEditPost()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-city-400 hover:text-ochre-400 hover:bg-city-700 rounded transition-colors text-sm font-texte-corps"
      title="Éditer ce post"
    >
      <Edit2 className="w-4 h-4" />
      <span>Éditer</span>
    </button>
  );
};

export default EditPostButton;
