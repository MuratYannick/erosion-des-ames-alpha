import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import SectionForm from '../../components/forum/forms/SectionForm';
import { createSection, getSectionById } from '../../services/forum/sectionsService';
import { getCategoryById } from '../../services/forum/categoriesService';

/**
 * NewSectionPage - Page de création d'une nouvelle section
 * Route: /forum/sections/new
 */
const NewSectionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Nouvelle section' }
  ]);

  // Récupérer les paramètres d'URL pour pré-remplir le formulaire
  const initialData = {
    category_id: searchParams.get('category_id') || '',
    parent_section_id: searchParams.get('parent_section_id') || ''
  };

  // Construire le breadcrumb en fonction de la hiérarchie
  useEffect(() => {
    const buildBreadcrumb = async () => {
      const items = [];

      try {
        // Si on crée une sous-section
        if (initialData.parent_section_id) {
          const sectionRes = await getSectionById(initialData.parent_section_id);
          const section = sectionRes.data?.data || sectionRes.data;

          // Récupérer la catégorie parente
          if (section.category_id) {
            const categoryRes = await getCategoryById(section.category_id);
            const category = categoryRes.data?.data || categoryRes.data;
            items.push({
              label: category.name,
              path: `/forum/category/${category.slug}`
            });
          }

          // Construire la chaîne des sections parentes
          const buildSectionChain = async (sectionData) => {
            if (sectionData.parent_section_id) {
              const parentRes = await getSectionById(sectionData.parent_section_id);
              const parent = parentRes.data?.data || parentRes.data;
              await buildSectionChain(parent);
            }

            items.push({
              label: sectionData.name,
              path: `/forum/section/${sectionData.slug}`
            });
          };

          await buildSectionChain(section);
        }
        // Si on crée une section dans une catégorie
        else if (initialData.category_id) {
          const categoryRes = await getCategoryById(initialData.category_id);
          const category = categoryRes.data?.data || categoryRes.data;
          items.push({
            label: category.name,
            path: `/forum/category/${category.slug}`
          });
        }
      } catch (err) {
        console.error('Erreur lors de la construction du breadcrumb:', err);
      }

      items.push({ label: 'Nouvelle section' });
      setBreadcrumbItems(items);
    };

    if (initialData.category_id || initialData.parent_section_id) {
      buildBreadcrumb();
    }
  }, [initialData.category_id, initialData.parent_section_id]);

  // Gérer la soumission
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createSection(formData);

      // Rediriger vers la page précédente après création réussie
      if (response.success && response.data) {
        navigate(-1);
      }
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de la création de la section'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer l'annulation
  const handleCancel = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <ForumLayout breadcrumbItems={breadcrumbItems}>
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-titre-Jeu text-ochre-500">
            Créer une nouvelle section
          </h1>
          <p className="text-city-300 font-texte-corps mt-2">
            Remplissez les informations pour créer une nouvelle section du forum.
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-city-800 border border-city-700 rounded-lg p-6">
          <SectionForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            error={error}
            isEditMode={false}
          />
        </div>

        {/* Aide */}
        <div className="bg-city-900 border border-city-700 rounded-lg p-6 mt-6">
          <h3 className="text-ochre-400 font-alternative-1 mb-3">💡 Aide</h3>
          <ul className="space-y-2 text-city-300 font-texte-corps text-sm">
            <li>
              <strong className="text-ochre-400">Nom:</strong> Le nom affiché de la section (ex: "Annonces Importantes")
            </li>
            <li>
              <strong className="text-ochre-400">Slug:</strong> Identifiant unique pour l'URL, généré automatiquement (ex: "annonces-importantes")
            </li>
            <li>
              <strong className="text-ochre-400">Faction/Clan:</strong> Permet de signifier que la section concerne une faction ou un clan spécifique
            </li>
            <li>
              <strong className="text-ochre-400">Section publique:</strong> Si désactivé, seuls les membres de la faction/clan peuvent accéder
            </li>
            <li>
              <strong className="text-ochre-400">Épingler:</strong> Les sections épinglées apparaissent en haut de la liste
            </li>
            <li>
              <strong className="text-ochre-400">Verrouiller:</strong> Empêche la création de nouveaux topics dans cette section
            </li>
          </ul>
        </div>
      </div>
    </ForumLayout>
  );
};

export default NewSectionPage;
