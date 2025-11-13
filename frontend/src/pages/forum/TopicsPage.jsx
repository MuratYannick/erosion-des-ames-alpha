import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, X, Plus } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import ForumPageHeader from '../../components/forum/layout/ForumPageHeader';
import { TopicCard, SectionCard } from '../../components/forum/cards';
import ActionButton from '../../components/forum/buttons/ActionButton';
import TopicForm from '../../components/forum/forms/TopicForm';
import { getSectionBySlug, updateSection, deleteSection, moveSection } from '../../services/forum/sectionsService';
import { getTopicsBySection, createTopic } from '../../services/forum/topicsService';
import { handleError } from '../../utils/errorHandler';
import { useAuth } from '../../contexts/AuthContext';

/**
 * TopicsPage - Page affichant les topics d'une section
 * Route: /forum/:categorySlug/:sectionSlug
 */
const TopicsPage = () => {
  const { categorySlug, sectionSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [section, setSection] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour la modale de création de topic
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer la section
        const sectionResponse = await getSectionBySlug(sectionSlug);
        // api.get retourne { data: { success: true, data: {...} } }
        const sectionData = sectionResponse.data?.data || sectionResponse.data;

        if (!sectionData || !sectionData.id) {
          setError('Section non trouvée');
          setLoading(false);
          return;
        }

        setSection(sectionData);

        // Récupérer les topics de cette section
        const topicsResponse = await getTopicsBySection(sectionData.id);
        // api.get retourne { data: { success: true, data: [...] } }
        const topicsData = topicsResponse.data?.data || topicsResponse.data || [];
        setTopics(Array.isArray(topicsData) ? topicsData : []);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        // Utiliser handleError pour les erreurs système
        const wasRedirected = handleError(err, navigate);

        // Si l'erreur n'a pas été redirigée, afficher un message local
        if (!wasRedirected) {
          setError(err.message || 'Impossible de charger les topics');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionSlug, navigate]);

  // Ouvrir la modal de création de topic
  const handleOpenNewTopic = () => {
    setShowNewTopicModal(true);
    setSubmitError(null);
  };

  // Fermer la modal de création de topic
  const handleCloseNewTopic = () => {
    if (isSubmitting) return;
    setShowNewTopicModal(false);
    setSubmitError(null);
  };

  // Soumettre le nouveau topic
  const handleSubmitNewTopic = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ajouter la section_id
      const topicData = {
        ...data,
        section_id: section.id
      };

      const response = await createTopic(topicData);
      const newTopic = response.data?.data || response.data;

      // Naviguer vers le nouveau topic
      if (newTopic?.slug) {
        navigate(`/forum/${categorySlug}/${sectionSlug}/${newTopic.slug}`);
      } else {
        // Si pas de slug, recharger la liste des topics
        const topicsResponse = await getTopicsBySection(section.id);
        const topicsData = topicsResponse.data?.data || topicsResponse.data || [];
        setTopics(Array.isArray(topicsData) ? topicsData : []);
        setShowNewTopicModal(false);
      }
    } catch (err) {
      console.error('Erreur lors de la création du topic:', err);
      setSubmitError(err.response?.data?.message || 'Erreur lors de la création du topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Breadcrumb (Forum est déjà ajouté par le composant Breadcrumb)
  const breadcrumbItems = section ? (() => {
    const items = [];

    // Catégorie
    items.push({
      label: section.category?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: `/forum/${categorySlug}`
    });

    // Hiérarchie complète des sections parentes (de la racine à la section parente directe)
    if (section.parentHierarchy && Array.isArray(section.parentHierarchy)) {
      section.parentHierarchy.forEach(parentSection => {
        items.push({
          label: parentSection.name,
          path: `/forum/${categorySlug}/${parentSection.slug}`
        });
      });
    }

    // Section actuelle
    items.push({ label: section.name });

    return items;
  })() : [];

  // État de chargement
  if (loading) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-ochre-500 animate-spin mx-auto mb-4" />
            <p className="text-city-400 font-texte-corps">Chargement des topics...</p>
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
  if (!section) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-ochre-500 mx-auto mb-4" />
            <h2 className="text-xl font-alternative-1 text-city-300 mb-2">Section introuvable</h2>
            <p className="text-city-400 font-texte-corps">
              La section demandée n'existe pas ou a été supprimée.
            </p>
          </div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        {/* En-tête de la section */}
        <ForumPageHeader
          title={section.name}
          description={section.description}
          badges={{
            isPinned: section.is_pinned,
            isLocked: section.is_locked,
            isPublic: section.is_public,
          }}
          stats={{
            topics: topics.length,
            sections: section.childSections?.length || 0,
          }}
          actions={{
            // Action de création de topic (primary)
            onNew: !section.is_locked ? handleOpenNewTopic : null,
            newLabel: 'Nouveau topic',
            newPermission: user !== null,

            // Action d'édition de section (primary) - TODO
            onEdit: null, // handleOpenEditSection,
            editPermission: user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'moderator' || section.permissions?.canEdit),

            // Action de déplacement de section (danger) - TODO
            onMove: null, // handleOpenMoveSection,
            movePermission: user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'moderator' || section.permissions?.canMove),

            // Action de suppression de section (danger) - TODO
            onDelete: null, // handleDeleteSection,
            deletePermission: user && (user.role === 'admin' || user.role === 'super_admin' || section.permissions?.canEdit),
          }}
        />

        {/* TODO: Bouton pour créer une sous-section - À ajouter */}
        {user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'moderator') && (
          <div className="flex justify-end">
            <ActionButton
              icon={Plus}
              label="Nouvelle sous-section"
              onClick={() => navigate(`/forum/new-section?category=${section.category_id}&parent=${section.id}`)}
              variant="primary"
              size="large"
            />
          </div>
        )}

        {/* Liste des sous-sections (si existantes) */}
        {section.childSections && section.childSections.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-alternative-1 text-ochre-400 mb-3">
              Sous-sections
            </h2>
            {section.childSections.map((childSection) => (
              <SectionCard
                key={childSection.id}
                section={childSection}
                categorySlug={categorySlug}
              />
            ))}
          </div>
        )}

        {/* Liste des topics */}
        {topics.length === 0 ? (
          <div className="bg-city-800 border-2 border-city-700 rounded-lg p-8 text-center">
            <p className="text-city-400 font-texte-corps">
              Aucun topic dans cette section pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {section.childSections && section.childSections.length > 0 && (
              <h2 className="text-xl font-alternative-1 text-ochre-400 mb-3 mt-8">
                Topics
              </h2>
            )}
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                categorySlug={categorySlug}
                sectionSlug={sectionSlug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modale de création de topic */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-titre text-ochre-400">Créer un nouveau topic</h2>
              <button
                onClick={handleCloseNewTopic}
                disabled={isSubmitting}
                className="p-2 text-city-400 hover:text-city-200 hover:bg-city-700 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <TopicForm
              onSubmit={handleSubmitNewTopic}
              onCancel={handleCloseNewTopic}
              isLoading={isSubmitting}
              error={submitError}
              isEditing={false}
            />
          </div>
        </div>
      )}
    </ForumLayout>
  );
};

export default TopicsPage;
