import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import { TopicCard, SectionCard } from '../../components/forum/cards';
import { NewSectionButton } from '../../components/forum/buttons';
import EditSectionButton from '../../components/forum/buttons/EditSectionButton';
import MoveSectionButton from '../../components/forum/buttons/MoveSectionButton';
import { getSectionBySlug } from '../../services/forum/sectionsService';
import { getTopicsBySection } from '../../services/forum/topicsService';
import { handleError } from '../../utils/errorHandler';

/**
 * TopicsPage - Page affichant les topics d'une section
 * Route: /forum/:categorySlug/:sectionSlug
 */
const TopicsPage = () => {
  const { categorySlug, sectionSlug } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-titre-Jeu text-ochre-500">
              {section.name}
            </h1>
            <div className="flex items-center gap-3">
              <MoveSectionButton
                sectionId={section.id}
                permissions={section.permissions}
              />
              <EditSectionButton
                sectionId={section.id}
                permissions={section.permissions}
              />
              <NewSectionButton
                category={section.category}
                section={section}
              />
            </div>
          </div>
          {section.description && (
            <p className="text-city-300 font-texte-corps text-base md:text-lg">
              {section.description}
            </p>
          )}

          {/* Badges pour section privée/verrouillée */}
          <div className="flex flex-wrap gap-2 mt-4">
            {!section.is_public && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blood-900 border border-blood-700 text-blood-300 rounded text-sm font-texte-corps">
                Privée
              </span>
            )}
            {section.is_locked && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-city-700 border border-city-600 text-city-300 rounded text-sm font-texte-corps">
                Verrouillée
              </span>
            )}
          </div>
        </div>

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
    </ForumLayout>
  );
};

export default TopicsPage;
