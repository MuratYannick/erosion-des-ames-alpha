import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import { getAllCategories } from '../../services/forum/categoriesService';

// Mapping des slugs de catégories vers les noms d'images
const CATEGORY_IMAGES = {
  'forum-general': '/forumIllustrations/forumGeneral.png',
  'forum-hrp': '/forumIllustrations/forumHRP.png',
  'forum-rp': '/forumIllustrations/forumRP.png',
  // Fallback pour les catégories sans image définie
  'default': '/forumIllustrations/forumGeneral.png'
};

/**
 * CategoriesPage - Page d'accueil du forum
 * Affiche les catégories sous forme d'images cliquables
 */
const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllCategories();
      // Le backend retourne { success: true, data: [...] }
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError('Impossible de charger les catégories. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (slug) => {
    return CATEGORY_IMAGES[slug] || CATEGORY_IMAGES['default'];
  };

  const handleCategoryClick = (category) => {
    navigate(`/forum/${category.slug}`);
  };

  return (
    <ForumLayout breadcrumbItems={[]}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-titre-Jeu text-ochre-500 mb-4">
            Forum - Érosion des Âmes
          </h1>
          <p className="text-city-400 font-texte-corps text-base sm:text-lg max-w-3xl mx-auto">
            Bienvenue sur le forum de l'Érosion des Âmes. Plongez dans les terres désolées et
            partagez vos aventures avec la communauté.
          </p>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <Loader2 className="w-16 h-16 text-ochre-500 animate-spin mb-4" />
            <p className="text-city-400 font-texte-corps text-lg">Chargement des catégories...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <div className="bg-blood-900 border-2 border-blood-700 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-blood-400 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-blood-300 font-alternative-1 text-xl mb-2">Erreur</h3>
              <p className="text-blood-200 font-texte-corps mb-4">{error}</p>
              <button
                onClick={fetchCategories}
                className="px-6 py-3 bg-blood-800 hover:bg-blood-700 text-blood-200 font-texte-corps rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Grille des catégories avec images */}
        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <div className="text-center py-16 sm:py-24">
                <p className="text-city-400 font-texte-corps text-xl mb-4">
                  Aucune catégorie disponible pour le moment.
                </p>
                <p className="text-city-500 font-texte-corps">
                  Les catégories seront bientôt créées par les administrateurs.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative overflow-hidden rounded-lg border-2 border-ochre-600 hover:border-ochre-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-ochre-600/50 focus:outline-none focus:ring-4 focus:ring-ochre-500/50"
                  >
                    {/* Image de la catégorie */}
                    <div className="aspect-video relative overflow-hidden bg-city-900">
                      <img
                        src={getCategoryImage(category.slug)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay au hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-city-950/90 via-city-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    </div>

                    {/* Nom de la catégorie */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h2 className="text-2xl sm:text-3xl font-titre-Jeu text-ochre-500 group-hover:text-ochre-400 transition-colors mb-2">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-city-300 font-texte-corps text-sm sm:text-base line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Badge avec nombre de sections */}
                    {category.sectionsCount > 0 && (
                      <div className="absolute top-4 right-4 bg-ochre-600 text-white px-3 py-1 rounded-full text-sm font-texte-corps font-bold shadow-lg">
                        {category.sectionsCount} section{category.sectionsCount > 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Statistiques globales du forum */}
            {categories.length > 0 && (
              <div className="bg-city-800 border-2 border-city-700 rounded-lg p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-alternative-1 text-ochre-500 mb-6 text-center">
                  Statistiques du Forum
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-city-900 border border-city-700 rounded-lg p-4 text-center">
                    <div className="text-3xl sm:text-4xl font-titre-Jeu text-ochre-400 mb-2">
                      {categories.length}
                    </div>
                    <div className="text-sm text-city-400 font-texte-corps">
                      Catégorie{categories.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="bg-city-900 border border-city-700 rounded-lg p-4 text-center">
                    <div className="text-3xl sm:text-4xl font-titre-Jeu text-ochre-400 mb-2">
                      {categories.reduce((sum, cat) => sum + (cat.sectionsCount || 0), 0)}
                    </div>
                    <div className="text-sm text-city-400 font-texte-corps">Sections</div>
                  </div>
                  <div className="bg-city-900 border border-city-700 rounded-lg p-4 text-center">
                    <div className="text-3xl sm:text-4xl font-titre-Jeu text-ochre-400 mb-2">
                      {categories.reduce((sum, cat) => sum + (cat.topicsCount || 0), 0)}
                    </div>
                    <div className="text-sm text-city-400 font-texte-corps">Topics</div>
                  </div>
                  <div className="bg-city-900 border border-city-700 rounded-lg p-4 text-center">
                    <div className="text-3xl sm:text-4xl font-titre-Jeu text-ochre-400 mb-2">
                      {categories.reduce((sum, cat) => sum + (cat.postsCount || 0), 0) || '---'}
                    </div>
                    <div className="text-sm text-city-400 font-texte-corps">Messages</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ForumLayout>
  );
};

export default CategoriesPage;
