import { ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * MoveTopicButton - Bouton pour déplacer un topic vers une autre section
 *
 * @param {Object} props
 * @param {Object} props.topic - Le topic à déplacer
 * @param {Function} props.onClick - Callback appelé lors du clic
 */
const MoveTopicButton = ({ topic, onClick }) => {
  const { user } = useAuth();

  // Vérifier les permissions
  const canMoveTopic = () => {
    if (!user) return false;

    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isModerator = user.role === 'moderator';

    // Vérifier les permissions depuis le topic si disponibles
    if (topic?.permissions) {
      return topic.permissions.canMove;
    }

    // Sinon, vérifier le rôle
    return isAdmin || isModerator;
  };

  if (!canMoveTopic()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="p-2 text-neutral-400 hover:text-ochre-400 hover:bg-neutral-700/50 rounded transition-colors"
      title="Déplacer ce topic"
    >
      <ArrowRightLeft className="w-4 h-4" />
    </button>
  );
};

export default MoveTopicButton;
