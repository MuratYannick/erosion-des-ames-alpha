import { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * DeleteTopicButton - Bouton pour supprimer un topic avec confirmation
 *
 * @param {Object} props
 * @param {Object} props.topic - Le topic à supprimer
 * @param {Function} props.onDelete - Callback appelé lors de la suppression (topicId)
 * @param {boolean} props.isDeleting - Indique si la suppression est en cours
 */
const DeleteTopicButton = ({ topic, onDelete, isDeleting = false }) => {
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Vérifier les permissions
  const canDeleteTopic = () => {
    if (!user) return false;

    const isAuthor = topic.author_user_id === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    // Vérifier les permissions depuis le topic si disponibles
    if (topic?.permissions) {
      return topic.permissions.canEdit; // On utilise canEdit pour la suppression aussi
    }

    // Sinon, l'auteur ou un admin peut supprimer
    return isAuthor || isAdmin;
  };

  if (!canDeleteTopic()) {
    return null;
  }

  const handleConfirmDelete = () => {
    onDelete(topic.id);
    setShowConfirmModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        disabled={isDeleting}
        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-700/50 rounded transition-colors disabled:opacity-50"
        title="Supprimer ce topic"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Modal de confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-900/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-200 mb-2">
                  Supprimer ce topic ?
                </h3>
                <p className="text-neutral-400 text-sm mb-2">
                  Cette action est irréversible. Le topic "{topic.title}" et tous ses messages seront supprimés définitivement.
                </p>
                <p className="text-red-400 text-sm font-medium">
                  Êtes-vous vraiment sûr de vouloir continuer ?
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteTopicButton;
