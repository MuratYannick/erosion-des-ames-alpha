import { Plus } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * NewTopicButton - Bouton pour créer un nouveau topic
 *
 * @param {Object} props
 * @param {Object} props.section - La section dans laquelle créer le topic
 * @param {Function} props.onClick - Callback appelé lors du clic
 */
const NewTopicButton = ({ section, onClick }) => {
  const { user } = useAuth();

  // Vérifier les permissions
  const canCreateTopic = () => {
    if (!user) return false;

    // Vérifier si la section est verrouillée
    if (section?.is_locked) return false;

    // Vérifier les permissions depuis la section si disponibles
    if (section?.permissions) {
      return section.permissions.canCreateTopic;
    }

    // Par défaut, seuls les utilisateurs connectés peuvent créer des topics
    return true;
  };

  if (!canCreateTopic()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-ochre-600 hover:bg-ochre-700 text-white rounded-lg transition-colors font-medium"
    >
      <Plus className="w-5 h-5" />
      <span>Nouveau topic</span>
    </button>
  );
};

export default NewTopicButton;
