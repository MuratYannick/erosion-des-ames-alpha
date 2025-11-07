import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import SectionForm from '../../components/forum/forms/SectionForm';
import { createSection } from '../../services/forum/sectionsService';

/**
 * NewSectionPage - Page de création d'une nouvelle section
 * Route: /forum/sections/new
 */
const NewSectionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer les paramètres d'URL pour pré-remplir le formulaire
  const initialData = {
    category_id: searchParams.get('category_id') || '',
    parent_section_id: searchParams.get('parent_section_id') || ''
  };

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Forum', path: '/forum' },
    { label: 'Nouvelle section' }
  ];

  // Gérer la soumission
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createSection(formData);

      // Rediriger vers la nouvelle section
      if (response.success && response.data) {
        // Construire l'URL de la section
        // On devrait récupérer le categorySlug, mais pour simplifier on redirige vers le forum
        navigate('/forum', {
          state: { message: 'Section créée avec succès!' }
        });
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
              <strong className="text-ochre-400">Catégorie:</strong> La catégorie parente à laquelle appartient cette section
            </li>
            <li>
              <strong className="text-ochre-400">Section parente:</strong> Pour créer une sous-section, sélectionnez la section parente
            </li>
            <li>
              <strong className="text-ochre-400">Faction/Clan:</strong> Permet de restreindre l'accès à une faction ou un clan spécifique
            </li>
            <li>
              <strong className="text-ochre-400">Section publique:</strong> Si décoché, seuls les membres de la faction/clan peuvent accéder
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
