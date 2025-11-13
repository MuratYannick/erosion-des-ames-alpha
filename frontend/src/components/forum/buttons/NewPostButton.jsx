import { MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * NewPostButton - Bouton pour créer un nouveau post
 * Affiche conditionnellement selon les permissions
 *
 * @param {Object} props
 * @param {Object} props.topic - Topic dans lequel créer le post
 * @param {Function} props.onClick - Callback appelé au clic
 */
const NewPostButton = ({ topic, onClick }) => {
  const { user } = useAuth();

  // Vérifier si l'utilisateur peut créer un post
  const canCreatePost = () => {
    // Pas connecté
    if (!user) return false;

    // Topic verrouillé
    if (topic?.is_locked) return false;

    // Vérifier les permissions si disponibles
    if (topic?.permissions) {
      return topic.permissions.canCreatePost;
    }

    // Par défaut, autoriser si connecté et non verrouillé
    return true;
  };

  // Ne rien afficher si pas de permission
  if (!canCreatePost()) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-ochre-600 hover:bg-ochre-500 text-city-950 font-texte-corps font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
    >
      <MessageSquarePlus className="w-5 h-5" />
      <span className="hidden sm:inline">Nouveau message</span>
      <span className="sm:hidden">Répondre</span>
    </button>
  );
};

export default NewPostButton;
