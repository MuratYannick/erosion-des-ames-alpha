import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import { SectionCard } from '../../components/forum/cards';
import { NewSectionButton } from '../../components/forum/buttons';
import { getCategoryBySlug } from '../../services/forum/categoriesService';
import { getSectionsByCategory } from '../../services/forum/sectionsService';

/**
 * SectionsPage - Page affichant les sections d'une catégorie
 * Route: /forum/:categorySlug
 */
const SectionsPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer la catégorie
        const categoryResponse = await getCategoryBySlug(categorySlug);
        const categoryData = categoryResponse.data || categoryResponse;
        setCategory(categoryData);

        // Récupérer les sections de cette catégorie
        const sectionsResponse = await getSectionsByCategory(categoryData.id);
        const sectionsData = sectionsResponse.data || sectionsResponse;
        setSections(Array.isArray(sectionsData) ? sectionsData : []);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err.message || 'Impossible de charger les sections');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  // Breadcrumb
  const breadcrumbItems = category ? [
    { label: 'Forum', path: '/forum' },
    { label: category.name }
  ] : [];

  // État de chargement
  if (loading) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-ochre-500 animate-spin mx-auto mb-4" />
            <p className="text-city-400 font-texte-corps">Chargement des sections...</p>
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
  if (!category) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-ochre-500 mx-auto mb-4" />
            <h2 className="text-xl font-alternative-1 text-city-300 mb-2">Catégorie introuvable</h2>
            <p className="text-city-400 font-texte-corps">
              La catégorie demandée n'existe pas ou a été supprimée.
            </p>
          </div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout breadcrumbItems={breadcrumbItems}>
      <div className="space-y-6">
        {/* En-tête de la catégorie */}
        <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-titre-Jeu text-ochre-500">
              {category.name}
            </h1>
            <NewSectionButton category={category} />
          </div>
          {category.description && (
            <p className="text-city-300 font-texte-corps text-base md:text-lg">
              {category.description}
            </p>
          )}
        </div>

        {/* Liste des sections */}
        {sections.length === 0 ? (
          <div className="bg-city-800 border-2 border-city-700 rounded-lg p-8 text-center">
            <p className="text-city-400 font-texte-corps">
              Aucune section dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                categorySlug={categorySlug}
              />
            ))}
          </div>
        )}
      </div>
    </ForumLayout>
  );
};

export default SectionsPage;
