import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * DeletePostButton - Bouton pour supprimer un post avec modale de confirmation
 * Affiche conditionnellement selon les permissions
 *
 * @param {Object} props
 * @param {Object} props.post - Post à supprimer
 * @param {Function} props.onDelete - Callback appelé lors de la confirmation (postId)
 * @param {boolean} props.isDeleting - Indique si la suppression est en cours
 */
const DeletePostButton = ({ post, onDelete, isDeleting = false }) => {
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Vérifier si l'utilisateur peut supprimer ce post
  const canDeletePost = () => {
    // Pas connecté
    if (!user) return false;

    // Vérifier si c'est l'auteur du post
    const isAuthor = post.author_user_id === user.id;

    // Admin peut toujours supprimer (à adapter selon votre logique de rôles)
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    // Vérifier les permissions si disponibles
    if (post?.permissions) {
      return post.permissions.canDelete;
    }

    // Par défaut, autoriser si auteur ou admin
    return isAuthor || isAdmin;
  };

  // Ne rien afficher si pas de permission
  if (!canDeletePost()) {
    return null;
  }

  const handleConfirmDelete = () => {
    onDelete(post.id);
    setShowConfirmModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        disabled={isDeleting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-city-400 hover:text-blood-400 hover:bg-city-700 rounded transition-colors text-sm font-texte-corps disabled:opacity-50 disabled:cursor-not-allowed"
        title="Supprimer ce post"
      >
        <Trash2 className="w-4 h-4" />
        <span>Supprimer</span>
      </button>

      {/* Modale de confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-city-800 border-2 border-blood-600 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-blood-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-alternative-1 text-blood-300 mb-2">
                  Confirmer la suppression
                </h3>
                <p className="text-city-300 font-texte-corps">
                  Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
                className="flex-shrink-0 p-2 text-city-400 hover:text-city-200 hover:bg-city-700 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-blood-600 hover:bg-blood-500 disabled:bg-city-700 disabled:cursor-not-allowed text-white font-texte-corps font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Supprimer</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isDeleting}
                className="px-6 py-3 bg-city-700 hover:bg-city-600 disabled:opacity-50 disabled:cursor-not-allowed text-city-200 font-texte-corps rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePostButton;
