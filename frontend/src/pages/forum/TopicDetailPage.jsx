import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import { PostCard } from '../../components/forum/cards';
import { getTopicBySlug } from '../../services/forum/topicsService';
import { getPostsByTopic } from '../../services/forum/postsService';
import { handleError } from '../../utils/errorHandler';

/**
 * TopicDetailPage - Page affichant les posts d'un topic
 * Route: /forum/:categorySlug/:sectionSlug/:topicSlug
 */
const TopicDetailPage = () => {
  const { categorySlug, sectionSlug, topicSlug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6">
          <h1 className="text-2xl md:text-3xl font-titre-Jeu text-ochre-500 mb-3">
            {topic.title}
          </h1>

          {/* Badges pour topic épinglé/verrouillé */}
          <div className="flex flex-wrap gap-2 items-center">
            {topic.is_pinned && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-ochre-900 border border-ochre-700 text-ochre-300 rounded text-sm font-texte-corps">
                Épinglé
              </span>
            )}
            {topic.is_locked && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-city-700 border border-city-600 text-city-300 rounded text-sm font-texte-corps">
                Verrouillé
              </span>
            )}
            {!topic.is_public && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blood-900 border border-blood-700 text-blood-300 rounded text-sm font-texte-corps">
                Privé
              </span>
            )}

            {/* Stats */}
            <div className="ml-auto flex items-center gap-4 text-sm text-city-400 font-texte-corps">
              <span>{topic.views_count || 0} vues</span>
              <span>{posts.length} réponses</span>
            </div>
          </div>
        </div>

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
              />
            ))}
          </div>
        )}
      </div>
    </ForumLayout>
  );
};

export default TopicDetailPage;
