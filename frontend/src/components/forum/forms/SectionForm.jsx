import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { getAllFactions } from '../../../services/forum/factionsService';
import { getAllClans } from '../../../services/forum/clansService';
import { getSectionById } from '../../../services/forum/sectionsService';

/**
 * SectionForm - Formulaire de création/édition d'une section
 *
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales pour l'édition
 * @param {Function} props.onSubmit - Callback appelé lors de la soumission (données)
 * @param {Function} props.onCancel - Callback appelé lors de l'annulation
 * @param {Function} props.onDelete - Callback appelé lors de la suppression (mode édition)
 * @param {boolean} props.isLoading - Indique si la soumission est en cours
 * @param {string} props.error - Message d'erreur éventuel
 * @param {boolean} props.isEditMode - Mode édition (true) ou création (false)
 * @param {Object} props.permissions - Permissions de l'utilisateur sur cette section
 */
const SectionForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
  error = null,
  isEditMode = false,
  permissions = null
}) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    slug: initialData.slug || '',
    description: initialData.description || '',
    category_id: initialData.category_id || '',
    parent_section_id: initialData.parent_section_id || '',
    faction_id: initialData.faction_id || '',
    clan_id: initialData.clan_id || '',
    is_public: initialData.is_public !== undefined ? initialData.is_public : true,
    display_order: initialData.display_order || 0,
    is_pinned: initialData.is_pinned || false,
    is_locked: initialData.is_locked || false
  });

  // Données des selects
  const [factions, setFactions] = useState([]);
  const [clans, setClans] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Section parente (pour héritage de visibilité)
  const [parentSection, setParentSection] = useState(null);

  // Auto-génération du slug
  const [autoSlug, setAutoSlug] = useState(true);

  // Charger les données des selects et la section parente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const promises = [
          getAllFactions(),
          getAllClans()
        ];

        // Charger la section parente si elle existe
        if (initialData.parent_section_id) {
          promises.push(getSectionById(initialData.parent_section_id));
        }

        const results = await Promise.all(promises);
        const [factionsRes, clansRes, parentSectionRes] = results;

        // api.get retourne { data: { success: true, data: [...] } }
        setFactions(factionsRes.data?.data || factionsRes.data || []);
        setClans(clansRes.data?.data || clansRes.data || []);

        // Si section parente existe
        if (parentSectionRes) {
          const parent = parentSectionRes.data?.data || parentSectionRes.data;
          setParentSection(parent);

          // Si la section parente est privée, forcer la nouvelle section à être privée
          if (parent && !parent.is_public) {
            setFormData(prev => ({
              ...prev,
              is_public: false
            }));
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setDataError('Impossible de charger les données nécessaires');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [initialData.parent_section_id]);

  // Générer un slug à partir du nom
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Auto-génération du slug si activée
    if (name === 'name' && autoSlug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Si on modifie le slug manuellement, désactiver l'auto-génération
    if (name === 'slug' && value !== generateSlug(formData.name)) {
      setAutoSlug(false);
    }

    // Si on change la faction, réinitialiser le clan
    if (name === 'faction_id') {
      setFormData(prev => ({
        ...prev,
        clan_id: ''
      }));
    }
  };

  // Filtrer les clans par faction
  // Si une faction est sélectionnée: clans de cette faction uniquement
  // Si aucune faction: clans neutres (faction_id null) uniquement
  const availableClans = formData.faction_id
    ? clans.filter(clan => clan.faction_id === parseInt(formData.faction_id))
    : clans.filter(clan => clan.faction_id === null);

  // Gérer la soumission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation basique
    if (!formData.name.trim()) {
      return;
    }

    // Préparer les données (convertir les strings vides en null)
    const submitData = {
      ...formData,
      category_id: parseInt(formData.category_id) || null,
      parent_section_id: formData.parent_section_id ? parseInt(formData.parent_section_id) : null,
      faction_id: formData.faction_id ? parseInt(formData.faction_id) : null,
      clan_id: formData.clan_id ? parseInt(formData.clan_id) : null,
      display_order: parseInt(formData.display_order) || 0
    };

    onSubmit(submitData);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-ochre-500 animate-spin" />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="bg-blood-900 border border-blood-700 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blood-300 flex-shrink-0" />
          <div>
            <h3 className="font-alternative-1 text-blood-300 mb-1">Erreur</h3>
            <p className="text-city-300 font-texte-corps text-sm">{dataError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message d'erreur global */}
      {error && (
        <div className="bg-blood-900 border border-blood-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blood-300 flex-shrink-0" />
            <p className="text-blood-300 font-texte-corps text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Nom */}
      <div>
        <label htmlFor="name" className="block text-ochre-400 font-alternative-1 mb-2">
          Nom de la section <span className="text-blood-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
          placeholder="Ex: Annonces Importantes"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-ochre-400 font-alternative-1 mb-2">
          Slug (URL) <span className="text-blood-400">*</span>
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
          placeholder="Ex: annonces-importantes"
        />
        {autoSlug && (
          <p className="text-city-400 text-xs mt-1 font-texte-corps">
            <CheckCircle className="w-3 h-3 inline mr-1" />
            Généré automatiquement
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-ochre-400 font-alternative-1 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors resize-none"
          placeholder="Description de la section..."
        />
      </div>

      {/* Faction */}
      <div>
        <label htmlFor="faction_id" className="block text-ochre-400 font-alternative-1 mb-2">
          Faction (optionnel)
        </label>
        <select
          id="faction_id"
          name="faction_id"
          value={formData.faction_id}
          onChange={handleChange}
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
        >
          <option value="">Aucune</option>
          {factions.map(faction => (
            <option key={faction.id} value={faction.id}>
              {faction.name}
            </option>
          ))}
        </select>
      </div>

      {/* Clan */}
      <div>
        <label htmlFor="clan_id" className="block text-ochre-400 font-alternative-1 mb-2">
          Clan (optionnel)
        </label>
        <select
          id="clan_id"
          name="clan_id"
          value={formData.clan_id}
          onChange={handleChange}
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
        >
          <option value="">Aucun</option>
          {availableClans.map(clan => (
            <option key={clan.id} value={clan.id}>
              {clan.name}
            </option>
          ))}
        </select>
        <p className="text-city-400 text-xs mt-1 font-texte-corps">
          {formData.faction_id
            ? `Clans de la faction sélectionnée`
            : `Clans neutres (hors faction)`}
        </p>
      </div>

      {/* Visibilité - Toggle Switch */}
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="is_public_toggle" className="block text-ochre-400 font-alternative-1 mb-1">
            Section publique
          </label>
          <p className="text-city-400 text-xs font-texte-corps">
            {parentSection && !parentSection.is_public
              ? 'Section privée (héritée de la section parente)'
              : formData.is_public
              ? 'Visible par tous les utilisateurs'
              : 'Visible uniquement par les membres de la faction/clan'}
          </p>
        </div>
        <button
          type="button"
          id="is_public_toggle"
          role="switch"
          aria-checked={formData.is_public}
          disabled={parentSection && !parentSection.is_public}
          onClick={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            formData.is_public ? 'bg-ochre-600' : 'bg-city-700'
          } ${parentSection && !parentSection.is_public ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formData.is_public ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Options */}
      <div className="space-y-3 bg-city-900 border border-city-700 rounded-lg p-4">
        <h3 className="text-ochre-400 font-alternative-1 mb-3">Options</h3>

        {/* Ordre d'affichage */}
        <div>
          <label htmlFor="display_order" className="block text-city-300 font-texte-corps mb-2 text-sm">
            Ordre d'affichage
          </label>
          <input
            type="number"
            id="display_order"
            name="display_order"
            value={formData.display_order}
            onChange={handleChange}
            min="0"
            className="w-full bg-city-800 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          {/* Afficher l'option épingler seulement si l'utilisateur a la permission */}
          {permissions?.canPin && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_pinned"
                checked={formData.is_pinned}
                onChange={handleChange}
                className="w-4 h-4 text-ochre-500 bg-city-800 border-city-700 rounded focus:ring-ochre-500"
              />
              <span className="text-city-300 font-texte-corps text-sm">
                Épingler cette section
              </span>
            </label>
          )}

          {/* Afficher l'option verrouiller seulement si l'utilisateur a la permission */}
          {permissions?.canLock && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_locked"
                checked={formData.is_locked}
                onChange={handleChange}
                className="w-4 h-4 text-ochre-500 bg-city-800 border-city-700 rounded focus:ring-ochre-500"
              />
              <span className="text-city-300 font-texte-corps text-sm">
                Verrouiller cette section
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-between items-center pt-4 border-t border-city-700">
        {/* Bouton Supprimer (mode édition uniquement) */}
        {isEditMode && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isLoading}
            className="px-6 py-2 bg-blood-600 hover:bg-blood-500 text-white font-alternative-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supprimer
          </button>
        )}

        {/* Boutons Annuler et Soumettre */}
        <div className={`flex gap-3 ${isEditMode && onDelete ? '' : 'ml-auto'}`}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 bg-city-800 hover:bg-city-700 text-city-200 font-alternative-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim() || !formData.slug.trim() || !formData.category_id}
            className="px-6 py-2 bg-ochre-600 hover:bg-ochre-500 text-city-950 font-alternative-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditMode ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SectionForm;
