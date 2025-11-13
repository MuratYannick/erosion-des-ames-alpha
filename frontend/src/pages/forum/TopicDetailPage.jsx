import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, X } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import ForumPageHeader from '../../components/forum/layout/ForumPageHeader';
import { PostCard } from '../../components/forum/cards';
import PostForm from '../../components/forum/forms/PostForm';
import TopicForm from '../../components/forum/forms/TopicForm';
import MovePostModal from '../../components/forum/modals/MovePostModal';
import MoveTopicModal from '../../components/forum/modals/MoveTopicModal';
import ActionButton from '../../components/forum/buttons/ActionButton';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getTopicBySlug, updateTopic, deleteTopic, moveTopic } from '../../services/forum/topicsService';
import { getPostsByTopic, createPost, updatePost, deletePost, movePost } from '../../services/forum/postsService';
import { handleError } from '../../utils/errorHandler';

/**
 * TopicDetailPage - Page affichant les posts d'un topic
 * Route: /forum/:categorySlug/:sectionSlug/:topicSlug
 */
const TopicDetailPage = () => {
  const { categorySlug, sectionSlug, topicSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour la modale de création de post
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // État pour la modale d'édition de post
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editSubmitError, setEditSubmitError] = useState(null);

  // État pour la suppression
  const [isDeletingPostId, setIsDeletingPostId] = useState(null);

  // État pour le déplacement de post
  const [showMovePostModal, setShowMovePostModal] = useState(false);
  const [movingPost, setMovingPost] = useState(null);
  const [isMoveSubmitting, setIsMoveSubmitting] = useState(false);
  const [moveSubmitError, setMoveSubmitError] = useState(null);

  // État pour l'édition du topic
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [isEditTopicSubmitting, setIsEditTopicSubmitting] = useState(false);
  const [editTopicError, setEditTopicError] = useState(null);

  // État pour la suppression du topic
  const [isDeletingTopic, setIsDeletingTopic] = useState(false);

  // État pour le déplacement du topic
  const [showMoveTopicModal, setShowMoveTopicModal] = useState(false);
  const [isMoveTopicSubmitting, setIsMoveTopicSubmitting] = useState(false);
  const [moveTopicError, setMoveTopicError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le topic
        const topicResponse = await getTopicBySlug(topicSlug);
        // api.get retourne { data: { success: true, data: {...} } }
        const topicData = topicResponse.data?.data || topicResponse.data;

        if (!topicData || !topicData.id) {
          setError('Topic non trouvé');
          setLoading(false);
          return;
        }

        setTopic(topicData);

        // Récupérer les posts de ce topic
        const postsResponse = await getPostsByTopic(topicData.id);
        // api.get retourne { data: { success: true, data: [...] } }
        const postsData = postsResponse.data?.data || postsResponse.data || [];
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        // Utiliser handleError pour les erreurs système
        const wasRedirected = handleError(err, navigate);

        // Si l'erreur n'a pas été redirigée, afficher un message local
        if (!wasRedirected) {
          setError(err.message || 'Impossible de charger le topic');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicSlug, navigate]);

  // Ouvrir la modale de création
  const handleOpenNewPost = () => {
    setShowNewPostModal(true);
    setSubmitError(null);
  };

  // Fermer la modale
  const handleCloseNewPost = () => {
    setShowNewPostModal(false);
    setSubmitError(null);
  };

  // Soumettre un nouveau post
  const handleSubmitNewPost = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ajouter le topic_id
      const postData = {
        ...data,
        topic_id: topic.id
      };

      await createPost(postData);

      // Recharger les posts
      const postsResponse = await getPostsByTopic(topic.id);
      const postsData = postsResponse.data?.data || postsResponse.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);

      // Fermer la modale
      setShowNewPostModal(false);
    } catch (err) {
      console.error('Erreur lors de la création du post:', err);
      setSubmitError(err.response?.data?.message || 'Erreur lors de la création du post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ouvrir la modale d'édition
  const handleOpenEditPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setShowEditPostModal(true);
      setEditSubmitError(null);
    }
  };

  // Fermer la modale d'édition
  const handleCloseEditPost = () => {
    setShowEditPostModal(false);
    setEditingPost(null);
    setEditSubmitError(null);
  };

  // Soumettre l'édition d'un post
  const handleSubmitEditPost = async (data) => {
    try {
      setIsEditSubmitting(true);
      setEditSubmitError(null);

      await updatePost(editingPost.id, data);

      // Recharger les posts
      const postsResponse = await getPostsByTopic(topic.id);
      const postsData = postsResponse.data?.data || postsResponse.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);

      // Fermer la modale
      setShowEditPostModal(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Erreur lors de la modification du post:', err);
      setEditSubmitError(err.response?.data?.message || 'Erreur lors de la modification du post');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Supprimer un post
  const handleDeletePost = async (postId) => {
    try {
      setIsDeletingPostId(postId);

      await deletePost(postId);

      // Recharger les posts
      const postsResponse = await getPostsByTopic(topic.id);
      const postsData = postsResponse.data?.data || postsResponse.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      console.error('Erreur lors de la suppression du post:', err);
      // Vous pouvez afficher une notification d'erreur ici si vous avez un système de notification
    } finally {
      setIsDeletingPostId(null);
    }
  };

  // Ouvrir le modal de déplacement
  const handleOpenMovePost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setMovingPost(post);
      setShowMovePostModal(true);
      setMoveSubmitError(null);
    }
  };

  // Fermer le modal de déplacement
  const handleCloseMovePost = () => {
    if (isMoveSubmitting) return;
    setShowMovePostModal(false);
    setMovingPost(null);
    setMoveSubmitError(null);
  };

  // Soumettre le déplacement
  const handleSubmitMovePost = async (newTopicId) => {
    try {
      setIsMoveSubmitting(true);
      setMoveSubmitError(null);

      await movePost(movingPost.id, newTopicId);

      // Recharger les posts (le post déplacé ne sera plus dans la liste)
      const postsResponse = await getPostsByTopic(topic.id);
      const postsData = postsResponse.data?.data || postsResponse.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);

      setShowMovePostModal(false);
      setMovingPost(null);
    } catch (err) {
      console.error('Erreur lors du déplacement du post:', err);
      setMoveSubmitError(err.response?.data?.message || 'Erreur lors du déplacement du post');
    } finally {
      setIsMoveSubmitting(false);
    }
  };

  // Ouvrir le modal d'édition du topic
  const handleOpenEditTopic = () => {
    setShowEditTopicModal(true);
    setEditTopicError(null);
  };

  // Fermer le modal d'édition du topic
  const handleCloseEditTopic = () => {
    if (isEditTopicSubmitting) return;
    setShowEditTopicModal(false);
    setEditTopicError(null);
  };

  // Soumettre l'édition du topic
  const handleSubmitEditTopic = async (data) => {
    try {
      setIsEditTopicSubmitting(true);
      setEditTopicError(null);

      await updateTopic(topic.id, data);

      // Recharger le topic
      const topicResponse = await getTopicBySlug(topicSlug);
      const topicData = topicResponse.data?.data || topicResponse.data;
      setTopic(topicData);

      setShowEditTopicModal(false);
    } catch (err) {
      console.error('Erreur lors de la modification du topic:', err);
      setEditTopicError(err.response?.data?.message || 'Erreur lors de la modification du topic');
    } finally {
      setIsEditTopicSubmitting(false);
    }
  };

  // Supprimer le topic
  const handleDeleteTopic = async (topicId) => {
    try {
      setIsDeletingTopic(true);

      await deleteTopic(topicId);

      // Rediriger vers la section parente
      navigate(`/forum/${categorySlug}/${sectionSlug}`);
    } catch (err) {
      console.error('Erreur lors de la suppression du topic:', err);
      setIsDeletingTopic(false);
    }
  };

  // Ouvrir le modal de déplacement du topic
  const handleOpenMoveTopic = () => {
    setShowMoveTopicModal(true);
    setMoveTopicError(null);
  };

  // Fermer le modal de déplacement du topic
  const handleClosMoveTopic = () => {
    if (isMoveTopicSubmitting) return;
    setShowMoveTopicModal(false);
    setMoveTopicError(null);
  };

  // Soumettre le déplacement du topic
  const handleSubmitMoveTopic = async (newSectionId) => {
    try {
      setIsMoveTopicSubmitting(true);
      setMoveTopicError(null);

      await moveTopic(topic.id, newSectionId);

      // Recharger le topic pour obtenir la nouvelle section
      const topicResponse = await getTopicBySlug(topicSlug);
      const topicData = topicResponse.data?.data || topicResponse.data;

      // Rediriger vers le nouveau chemin du topic
      if (topicData?.section?.slug) {
        const newSectionSlug = topicData.section.slug;
        const newCategorySlug = topicData.section.category?.slug || categorySlug;
        navigate(`/forum/${newCategorySlug}/${newSectionSlug}/${topicSlug}`);

        // Rafraîchir la page pour mettre à jour le breadcrumb
        window.location.reload();
      } else {
        // Si pas de nouveau slug, juste fermer le modal et recharger
        setShowMoveTopicModal(false);
        setTopic(topicData);
      }
    } catch (err) {
      console.error('Erreur lors du déplacement du topic:', err);
      setMoveTopicError(err.response?.data?.message || 'Erreur lors du déplacement du topic');
    } finally {
      setIsMoveTopicSubmitting(false);
    }
  };

  // Breadcrumb (Forum est déjà ajouté par le composant Breadcrumb)
  const breadcrumbItems = topic ? (() => {
    const items = [];

    // Catégorie
    items.push({
      label: topic.section?.category?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: `/forum/${categorySlug}`
    });

    // Hiérarchie complète des sections parentes (de la racine à la section parente directe)
    if (topic.section?.parentHierarchy && Array.isArray(topic.section.parentHierarchy)) {
      topic.section.parentHierarchy.forEach(parentSection => {
        items.push({
          label: parentSection.name,
          path: `/forum/${categorySlug}/${parentSection.slug}`
        });
      });
    }

    // Section
    items.push({
      label: topic.section?.name || sectionSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: `/forum/${categorySlug}/${sectionSlug}`
    });

    // Topic actuel
    items.push({ label: topic.title });

    return items;
  })() : [];

  // État de chargement
  if (loading) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-ochre-500 animate-spin mx-auto mb-4" />
            <p className="text-city-400 font-texte-corps">Chargement du topic...</p>
          </div>
        </div>
      </ForumLayout>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-blood-500 mx-auto mb-4" />
            <h2 className="text-xl font-alternative-1 text-blood-300 mb-2">Erreur</h2>
            <p className="text-city-400 font-texte-corps">{error}</p>
          </div>
        </div>
      </ForumLayout>
    );
  }

  // État vide
  if (!topic) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-ochre-500 mx-auto mb-4" />
            <h2 className="text-xl font-alternative-1 text-city-300 mb-2">Topic introuvable</h2>
            <p className="text-city-400 font-texte-corps">
              Le topic demandé n'existe pas ou a été supprimé.
            </p>
          </div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        {/* En-tête du topic */}
        <ForumPageHeader
          title={topic.title}
          badges={{
            isPinned: topic.is_pinned,
            isLocked: topic.is_locked,
            isPublic: topic.is_public,
          }}
          stats={{
            views: topic.views_count || 0,
            replies: posts.length,
          }}
          actions={{
            // Action de création (primary)
            onNew: !topic.is_locked ? handleOpenNewPost : null,
            newLabel: 'Nouveau message',
            newPermission: user !== null,

            // Action d'édition (primary)
            onEdit: handleOpenEditTopic,
            editPermission: user && (topic.author_user_id === user.id || user.role === 'admin' || user.role === 'super_admin' || topic.permissions?.canEdit),

            // Action de déplacement (danger)
            onMove: handleOpenMoveTopic,
            movePermission: user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'moderator' || topic.permissions?.canMove),

            // Action de suppression (danger)
            onDelete: () => handleDeleteTopic(topic.id),
            deletePermission: user && (topic.author_user_id === user.id || user.role === 'admin' || user.role === 'super_admin' || topic.permissions?.canEdit),
            isDeleting: isDeletingTopic,
          }}
        />

        {/* Liste des posts */}
        {posts.length === 0 ? (
          <div className="bg-city-800 border-2 border-city-700 rounded-lg p-8 text-center">
            <p className="text-city-400 font-texte-corps">
              Aucun message dans ce topic pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                isFirstPost={index === 0}
                onEdit={handleOpenEditPost}
                onDelete={handleDeletePost}
                onMove={handleOpenMovePost}
                isDeleting={isDeletingPostId === post.id}
              />
            ))}
          </div>
        )}

        {/* Bouton nouveau post en bas de page (répétition pour UX) */}
        {posts.length > 0 && !topic.is_locked && user && (
          <div className="flex justify-center pt-4">
            <ActionButton
              icon={Plus}
              label="Nouveau message"
              onClick={handleOpenNewPost}
              variant="primary"
              size="large"
            />
          </div>
        )}
      </div>

      {/* Modale de création de post */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-titre text-ochre-400">Nouveau message</h2>
              <button
                onClick={handleCloseNewPost}
                disabled={isSubmitting}
                className="p-2 text-city-400 hover:text-city-200 hover:bg-city-700 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <PostForm
              onSubmit={handleSubmitNewPost}
              onCancel={handleCloseNewPost}
              isLoading={isSubmitting}
              error={submitError}
              isEditing={false}
            />
          </div>
        </div>
      )}

      {/* Modale d'édition de post */}
      {showEditPostModal && editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-titre text-ochre-400">Modifier le message</h2>
              <button
                onClick={handleCloseEditPost}
                disabled={isEditSubmitting}
                className="p-2 text-city-400 hover:text-city-200 hover:bg-city-700 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <PostForm
              initialData={editingPost}
              onSubmit={handleSubmitEditPost}
              onCancel={handleCloseEditPost}
              isLoading={isEditSubmitting}
              error={editSubmitError}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {/* Modale de déplacement de post */}
      {showMovePostModal && movingPost && (
        <MovePostModal
          post={movingPost}
          onMove={handleSubmitMovePost}
          onClose={handleCloseMovePost}
          isLoading={isMoveSubmitting}
          error={moveSubmitError}
        />
      )}

      {/* Modale d'édition de topic */}
      {showEditTopicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-titre text-ochre-400">Modifier le topic</h2>
              <button
                onClick={handleCloseEditTopic}
                disabled={isEditTopicSubmitting}
                className="p-2 text-city-400 hover:text-city-200 hover:bg-city-700 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <TopicForm
              initialData={topic}
              onSubmit={handleSubmitEditTopic}
              onCancel={handleCloseEditTopic}
              isLoading={isEditTopicSubmitting}
              error={editTopicError}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {/* Modale de déplacement de topic */}
      {showMoveTopicModal && (
        <MoveTopicModal
          topic={topic}
          onMove={handleSubmitMoveTopic}
          onClose={handleClosMoveTopic}
          isLoading={isMoveTopicSubmitting}
          error={moveTopicError}
        />
      )}
    </ForumLayout>
  );
};

export default TopicDetailPage;
