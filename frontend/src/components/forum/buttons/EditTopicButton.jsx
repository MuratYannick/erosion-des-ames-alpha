import { Edit } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * EditTopicButton - Bouton pour éditer un topic
 *
 * @param {Object} props
 * @param {Object} props.topic - Le topic à éditer
 * @param {Function} props.onClick - Callback appelé lors du clic
 */
const EditTopicButton = ({ topic, onClick }) => {
  const { user } = useAuth();

  // Vérifier les permissions
  const canEditTopic = () => {
    if (!user) return false;

    const isAuthor = topic.author_user_id === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    // Vérifier les permissions depuis le topic si disponibles
    if (topic?.permissions) {
      return topic.permissions.canEdit;
    }

    // Sinon, l'auteur ou un admin peut éditer
    return isAuthor || isAdmin;
  };

  if (!canEditTopic()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="p-2 text-neutral-400 hover:text-ochre-400 hover:bg-neutral-700/50 rounded transition-colors"
      title="Modifier ce topic"
    >
      <Edit className="w-4 h-4" />
    </button>
  );
};

export default EditTopicButton;
