import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, MoveRight, X } from 'lucide-react';
import { getAllCategories } from '../../../services/forum/categoriesService';
import { getAllSections } from '../../../services/forum/sectionsService';

/**
 * MoveSectionForm - Formulaire de déplacement d'une section
 *
 * @param {Object} props
 * @param {Object} props.section - Section à déplacer
 * @param {Function} props.onSubmit - Callback appelé lors de la soumission (destinationType, destinationId)
 * @param {Function} props.onCancel - Callback appelé lors de l'annulation
 * @param {boolean} props.isLoading - Indique si la soumission est en cours
 * @param {string} props.error - Message d'erreur éventuel
 */
const MoveSectionForm = ({
  section,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null
}) => {
  // État du formulaire
  const [destinationType, setDestinationType] = useState('category');
  const [destinationId, setDestinationId] = useState('');

  // Données des selects
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [categoriesRes, sectionsRes] = await Promise.all([
          getAllCategories(),
          getAllSections()
        ]);

        setCategories(categoriesRes.data?.data || categoriesRes.data || []);

        // Filtrer les sections pour exclure :
        // 1. La section elle-même
        // 2. Les sous-sections de la section (pour éviter les boucles)
        const allSections = sectionsRes.data?.data || sectionsRes.data || [];
        const validSections = allSections.filter(s => {
          // Exclure la section elle-même
          if (s.id === section.id) return false;

          // Exclure les sous-sections directes
          if (s.parent_section_id === section.id) return false;

          // TODO: Exclure récursivement tous les enfants
          // Pour l'instant on fait simple
          return true;
        });

        setSections(validSections);
        setLoadingData(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setDataError('Erreur lors du chargement des données');
        setLoadingData(false);
      }
    };

    fetchData();
  }, [section.id]);

  // Gérer la soumission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destinationId) {
      return;
    }

    onSubmit(destinationType, parseInt(destinationId));
  };

  // Filtrer les destinations disponibles selon le type
  const availableDestinations = destinationType === 'category' ? categories : sections;

  // Affichage pendant le chargement
  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 text-ochre-500 animate-spin" />
        <p className="text-city-300 font-texte-corps">Chargement des destinations...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur de chargement
  if (dataError) {
    return (
      <div className="bg-blood-900/20 border border-blood-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blood-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-blood-300 font-texte-corps">{dataError}</p>
            <button
              onClick={onCancel}
              className="mt-3 px-4 py-2 bg-city-700 hover:bg-city-600 text-city-200 rounded-lg transition-colors font-texte-corps text-sm"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titre */}
      <div className="border-b border-city-700 pb-4">
        <h2 className="text-2xl font-titre text-ochre-400 flex items-center gap-2">
          <MoveRight className="w-6 h-6" />
          Déplacer la section
        </h2>
        <p className="mt-2 text-city-300 font-texte-corps text-sm">
          Section à déplacer : <span className="text-ochre-300 font-semibold">{section.name}</span>
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-blood-900/20 border border-blood-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blood-400 shrink-0 mt-0.5" />
            <p className="text-blood-300 font-texte-corps text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Type de destination */}
      <div className="space-y-2">
        <label className="block text-ochre-400 font-texte-corps font-semibold text-sm">
          Type de destination
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="destinationType"
              value="category"
              checked={destinationType === 'category'}
              onChange={(e) => {
                setDestinationType(e.target.value);
                setDestinationId('');
              }}
              className="w-4 h-4 text-ochre-500 bg-city-800 border-city-700 focus:ring-ochre-500"
            />
            <span className="text-city-300 font-texte-corps text-sm">
              Catégorie (section racine)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="destinationType"
              value="section"
              checked={destinationType === 'section'}
              onChange={(e) => {
                setDestinationType(e.target.value);
                setDestinationId('');
              }}
              className="w-4 h-4 text-ochre-500 bg-city-800 border-city-700 focus:ring-ochre-500"
            />
            <span className="text-city-300 font-texte-corps text-sm">
              Section (sous-section)
            </span>
          </label>
        </div>
      </div>

      {/* Sélection de la destination */}
      <div className="space-y-2">
        <label htmlFor="destination" className="block text-ochre-400 font-texte-corps font-semibold text-sm">
          Destination <span className="text-blood-400">*</span>
        </label>
        <select
          id="destination"
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-city-800 border border-city-700 rounded-lg text-city-200 font-texte-corps focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent transition-all"
        >
          <option value="">
            -- Sélectionnez {destinationType === 'category' ? 'une catégorie' : 'une section'} --
          </option>
          {availableDestinations.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name}
              {destinationType === 'section' && dest.category && ` (${dest.category.name})`}
            </option>
          ))}
        </select>
        <p className="text-city-400 font-texte-corps text-xs italic">
          {destinationType === 'category'
            ? 'La section sera déplacée à la racine de la catégorie sélectionnée'
            : 'La section deviendra une sous-section de la section sélectionnée'}
        </p>
      </div>

      {/* Aperçu du déplacement */}
      {destinationId && (
        <div className="bg-ochre-900/20 border border-ochre-700 rounded-lg p-4">
          <p className="text-ochre-300 font-texte-corps text-sm">
            <MoveRight className="w-4 h-4 inline mr-2" />
            La section <strong>{section.name}</strong> sera déplacée vers :
          </p>
          <p className="text-ochre-200 font-texte-corps font-semibold mt-2">
            {availableDestinations.find(d => d.id === parseInt(destinationId))?.name}
          </p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-city-700">
        <button
          type="submit"
          disabled={isLoading || !destinationId}
          className="flex-1 px-6 py-3 bg-ochre-600 hover:bg-ochre-500 disabled:bg-city-700 disabled:cursor-not-allowed text-city-950 font-texte-corps font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Déplacement en cours...</span>
            </>
          ) : (
            <>
              <MoveRight className="w-5 h-5" />
              <span>Déplacer la section</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-city-700 hover:bg-city-600 disabled:opacity-50 disabled:cursor-not-allowed text-city-200 font-texte-corps rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          <span>Annuler</span>
        </button>
      </div>
    </form>
  );
};

export default MoveSectionForm;
