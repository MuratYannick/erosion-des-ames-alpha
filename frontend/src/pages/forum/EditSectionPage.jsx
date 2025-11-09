import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import SectionForm from '../../components/forum/forms/SectionForm';
import { getSectionById, updateSection, deleteSection } from '../../services/forum/sectionsService';
import { getCategoryById } from '../../services/forum/categoriesService';

/**
 * EditSectionPage - Page d'édition/suppression d'une section
 * Route: /forum/sections/:id/edit
 */
const EditSectionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Éditer section' }
  ]);

  // Modales de confirmation
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // Charger la section à éditer
  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const response = await getSectionById(id);
        const sectionData = response.data?.data || response.data;
        setSection(sectionData);

        // Construire le breadcrumb
        await buildBreadcrumb(sectionData);
      } catch (err) {
        console.error('Erreur lors du chargement de la section:', err);
        setLoadError(err.response?.data?.message || 'Impossible de charger la section');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSection();
    }
  }, [id]);

  // Construire le breadcrumb
  const buildBreadcrumb = async (sectionData) => {
    const items = [];

    try {
      // Récupérer la catégorie
      if (sectionData.category_id) {
        const categoryRes = await getCategoryById(sectionData.category_id);
        const category = categoryRes.data?.data || categoryRes.data;
        items.push({
          label: category.name,
          path: `/forum/category/${category.slug}`
        });
      }

      // Construire la chaîne des sections parentes
      const buildSectionChain = async (section) => {
        if (section.parent_section_id) {
          const parentRes = await getSectionById(section.parent_section_id);
          const parent = parentRes.data?.data || parentRes.data;
          await buildSectionChain(parent);
          items.push({
            label: parent.name,
            path: `/forum/section/${parent.slug}`
          });
        }
      };

      await buildSectionChain(sectionData);

      // Ajouter la section actuelle
      items.push({
        label: sectionData.name,
        path: `/forum/section/${sectionData.slug}`
      });

      items.push({ label: 'Éditer' });
    } catch (err) {
      console.error('Erreur lors de la construction du breadcrumb:', err);
    }

    setBreadcrumbItems(items);
  };

  // Ouvrir la modale de confirmation pour l'édition
  const handleSubmit = (formData) => {
    setPendingData(formData);
    setShowEditConfirm(true);
  };

  // Confirmer la modification
  const confirmEdit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setShowEditConfirm(false);

      const response = await updateSection(id, pendingData);

      if (response.success || response.data) {
        navigate(-1);
      }
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setSubmitError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de la modification de la section'
      );
    } finally {
      setIsSubmitting(false);
      setPendingData(null);
    }
  };

  // Ouvrir la modale de confirmation pour la suppression
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setShowDeleteConfirm(false);

      await deleteSection(id);
      navigate(-1);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setSubmitError(
        err.response?.data?.message ||
        'Une erreur est survenue lors de la suppression de la section'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer l'annulation
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-12 h-12 text-ochre-500 animate-spin" />
        </div>
      </ForumLayout>
    );
  }

  if (loadError || !section) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-blood-900 border border-blood-700 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-blood-300 flex-shrink-0" />
              <div>
                <h3 className="font-alternative-1 text-blood-300 mb-1">Erreur</h3>
                <p className="text-city-300 font-texte-corps text-sm">
                  {loadError || 'Section introuvable'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout breadcrumbItems={breadcrumbItems}>
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-titre-Jeu text-ochre-500">
            Éditer la section
          </h1>
          <p className="text-city-300 font-texte-corps mt-2">
            Modifiez les informations de la section "{section.name}"
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-city-800 border border-city-700 rounded-lg p-6">
          <SectionForm
            initialData={section}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
            isLoading={isSubmitting}
            error={submitError}
            isEditMode={true}
            permissions={section.permissions}
          />
        </div>

        {/* Aide */}
        <div className="bg-city-900 border border-city-700 rounded-lg p-6 mt-6">
          <h3 className="text-ochre-400 font-alternative-1 mb-3">💡 Aide</h3>
          <ul className="space-y-2 text-city-300 font-texte-corps text-sm">
            <li>
              <strong className="text-ochre-400">Nom:</strong> Le nom affiché de la section
            </li>
            <li>
              <strong className="text-ochre-400">Slug:</strong> Identifiant unique pour l'URL
            </li>
            <li>
              <strong className="text-ochre-400">Faction/Clan:</strong> Permet de signifier que la section concerne une faction ou un clan spécifique
            </li>
            <li>
              <strong className="text-ochre-400">Section publique:</strong> Si désactivé, seuls les membres de la faction/clan peuvent accéder
            </li>
            <li>
              <strong className="text-blood-400">⚠️ Suppression:</strong> La suppression d'une section est définitive. Toutes les sous-sections et topics seront également supprimés.
            </li>
          </ul>
        </div>
      </div>

      {/* Modale de confirmation - Modification */}
      {showEditConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-titre-Jeu text-ochre-500 mb-4">
              Confirmer la modification
            </h3>
            <p className="text-city-300 font-texte-corps mb-4">
              Êtes-vous sûr de vouloir modifier cette section ?
            </p>

            {/* Avertissement si passage de public à privé */}
            {section?.is_public && pendingData && !pendingData.is_public && (
              <div className="bg-blood-900 border border-blood-600 rounded-lg p-4 mb-4">
                <p className="text-blood-300 font-texte-corps text-sm">
                  ⚠️ <strong>Attention:</strong> Vous rendez cette section privée. Toutes les sous-sections et topics contenus deviendront également privés et ne seront accessibles qu'aux membres de la faction/clan associés.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditConfirm(false);
                  setPendingData(null);
                }}
                className="px-6 py-2 bg-city-700 hover:bg-city-600 text-city-200 font-alternative-1 rounded transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmEdit}
                className="px-6 py-2 bg-ochre-600 hover:bg-ochre-500 text-city-950 font-alternative-1 rounded transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de confirmation - Suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-city-800 border-2 border-blood-600 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-titre-Jeu text-blood-400 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-city-300 font-texte-corps mb-4">
              Êtes-vous sûr de vouloir supprimer définitivement cette section ?
            </p>
            <p className="text-blood-300 font-texte-corps text-sm mb-6">
              ⚠️ Cette action est irréversible. Toutes les sous-sections et topics contenus seront également supprimés.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-city-700 hover:bg-city-600 text-city-200 font-alternative-1 rounded transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2 bg-blood-600 hover:bg-blood-500 text-white font-alternative-1 rounded transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </ForumLayout>
  );
};

export default EditSectionPage;
