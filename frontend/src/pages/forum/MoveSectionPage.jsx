import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle, MoveRight } from 'lucide-react';
import ForumLayout from '../../components/forum/layout/ForumLayout';
import MoveSectionForm from '../../components/forum/forms/MoveSectionForm';
import { getSectionById, moveSectionTo } from '../../services/forum/sectionsService';
import { getCategoryById } from '../../services/forum/categoriesService';

/**
 * MoveSectionPage - Page de déplacement d'une section
 * Route: /forum/sections/:id/move
 */
const MoveSectionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Déplacer section' }
  ]);

  // Modale de confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);

  // Charger la section à déplacer
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

      items.push({ label: 'Déplacer' });
    } catch (err) {
      console.error('Erreur lors de la construction du breadcrumb:', err);
    }

    setBreadcrumbItems(items);
  };

  // Ouvrir la modale de confirmation
  const handleSubmit = (destinationType, destinationId) => {
    setPendingMove({ destinationType, destinationId });
    setShowConfirm(true);
  };

  // Confirmer le déplacement
  const handleConfirmMove = async () => {
    if (!pendingMove) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await moveSectionTo(id, pendingMove.destinationType, pendingMove.destinationId);

      // Rediriger vers la section (elle aura peut-être un nouveau slug)
      // Pour l'instant on redirige vers les catégories
      navigate('/forum');
    } catch (err) {
      console.error('Erreur lors du déplacement:', err);
      setSubmitError(err.response?.data?.message || 'Erreur lors du déplacement de la section');
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  // Annuler l'opération
  const handleCancel = () => {
    // Retourner vers la section
    if (section?.slug) {
      navigate(`/forum/section/${section.slug}`);
    } else {
      navigate('/forum');
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 text-ochre-500 animate-spin" />
          <p className="text-city-300 font-texte-corps">Chargement de la section...</p>
        </div>
      </ForumLayout>
    );
  }

  // Affichage en cas d'erreur
  if (loadError || !section) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="bg-blood-900/20 border border-blood-700 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blood-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-titre text-blood-300 mb-2">
                Erreur de chargement
              </h2>
              <p className="text-blood-200 font-texte-corps mb-4">
                {loadError || 'Section non trouvée'}
              </p>
              <button
                onClick={() => navigate('/forum')}
                className="px-4 py-2 bg-city-700 hover:bg-city-600 text-city-200 rounded-lg transition-colors font-texte-corps text-sm"
              >
                Retour au forum
              </button>
            </div>
          </div>
        </div>
      </ForumLayout>
    );
  }

  // Vérifier les permissions
  if (!section.permissions?.canMoveSection) {
    return (
      <ForumLayout breadcrumbItems={breadcrumbItems}>
        <div className="bg-blood-900/20 border border-blood-700 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blood-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-titre text-blood-300 mb-2">
                Permission refusée
              </h2>
              <p className="text-blood-200 font-texte-corps mb-4">
                Vous n'avez pas la permission de déplacer cette section.
              </p>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-city-700 hover:bg-city-600 text-city-200 rounded-lg transition-colors font-texte-corps text-sm"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout breadcrumbItems={breadcrumbItems}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
          <MoveSectionForm
            section={section}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            error={submitError}
          />
        </div>
      </div>

      {/* Modale de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-titre text-ochre-400 mb-4 flex items-center gap-2">
              <MoveRight className="w-5 h-5" />
              Confirmer le déplacement
            </h3>
            <p className="text-city-300 font-texte-corps mb-6">
              Êtes-vous sûr de vouloir déplacer cette section ? Cette action modifiera sa position et celle de tous ses enfants dans l'arborescence du forum.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmMove}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-ochre-600 hover:bg-ochre-500 disabled:bg-city-700 disabled:cursor-not-allowed text-city-950 font-texte-corps font-semibold rounded-lg transition-colors"
              >
                {isSubmitting ? 'Déplacement...' : 'Confirmer'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-city-700 hover:bg-city-600 disabled:opacity-50 text-city-200 font-texte-corps rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </ForumLayout>
  );
};

export default MoveSectionPage;
