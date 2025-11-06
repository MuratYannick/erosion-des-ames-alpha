import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import ForumLayout from '../components/layout/ForumLayout';
import { CategoryCard } from '../components/cards';
import { getAllCategories } from '../services/categoriesService';

/**
 * CategoriesPage - Page d'accueil du forum
 * Affiche la liste de toutes les catégories
 */
const CategoriesPage = () => {
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
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError('Impossible de charger les catégories. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForumLayout breadcrumbItems={[]}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Metal_Mania'] text-ochre-400 mb-3">
          Forum - Érosion des Âmes
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-3xl">
          Bienvenue sur le forum de l'Érosion des Âmes. Plongez dans les terres désolées et
          partagez vos aventures avec la communauté.
        </p>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <Loader2 size={48} className="text-ochre-500 animate-spin mb-4" />
          <p className="text-neutral-400">Chargement des catégories...</p>
        </div>
      )}

      {/* État d'erreur */}
      {error && !loading && (
        <div className="bg-blood-900 border border-blood-700 rounded-lg p-4 sm:p-6 flex items-start gap-3">
          <AlertCircle size={24} className="text-blood-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blood-300 font-semibold mb-1">Erreur</h3>
            <p className="text-blood-200 text-sm">{error}</p>
            <button
              onClick={fetchCategories}
              className="mt-3 px-4 py-2 bg-blood-800 hover:bg-blood-700 text-blood-200 rounded transition-colors text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      {!loading && !error && (
        <>
          {categories.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-neutral-400 text-lg mb-4">
                Aucune catégorie disponible pour le moment.
              </p>
              <p className="text-neutral-500 text-sm">
                Les catégories seront bientôt créées par les administrateurs.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Statistiques globales du forum (optionnel) */}
      {!loading && !error && categories.length > 0 && (
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-ochre-400">
                {categories.length}
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-1">Catégories</div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-ochre-400">
                {categories.reduce((sum, cat) => sum + (cat.sectionsCount || 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-1">Sections</div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-ochre-400">
                {categories.reduce((sum, cat) => sum + (cat.topicsCount || 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-1">Topics</div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-ochre-400">
                {/* À calculer depuis l'API plus tard */}
                ---
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 mt-1">Messages</div>
            </div>
          </div>
        </div>
      )}
    </ForumLayout>
  );
};

export default CategoriesPage;
