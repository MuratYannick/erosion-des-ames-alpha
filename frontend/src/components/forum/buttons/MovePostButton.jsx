import { ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * MovePostButton - Bouton pour déplacer un post vers un autre topic
 *
 * @param {Object} props
 * @param {Object} props.post - Le post à déplacer
 * @param {Function} props.onClick - Callback appelé lors du clic
 */
const MovePostButton = ({ post, onClick }) => {
  const { user } = useAuth();

  // Vérifier les permissions
  const canMovePost = () => {
    if (!user) return false;

    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isModerator = user.role === 'moderator';

    // Vérifier les permissions depuis le post si disponibles
    if (post?.permissions) {
      return post.permissions.canMove;
    }

    // Sinon, vérifier le rôle
    return isAdmin || isModerator;
  };

  if (!canMovePost()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="p-2 text-neutral-400 hover:text-ochre-400 hover:bg-neutral-700/50 rounded transition-colors"
      title="Déplacer ce post"
    >
      <ArrowRightLeft className="w-4 h-4" />
    </button>
  );
};

export default MovePostButton;
