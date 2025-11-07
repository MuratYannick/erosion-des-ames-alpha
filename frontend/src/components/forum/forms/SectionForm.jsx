import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { getAllCategories } from '../../../services/forum/categoriesService';
import { getAllSections } from '../../../services/forum/sectionsService';
import { getAllFactions } from '../../../services/forum/factionsService';
import { getAllClans } from '../../../services/forum/clansService';

/**
 * SectionForm - Formulaire de création/édition d'une section
 *
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales pour l'édition
 * @param {Function} props.onSubmit - Callback appelé lors de la soumission (données)
 * @param {Function} props.onCancel - Callback appelé lors de l'annulation
 * @param {boolean} props.isLoading - Indique si la soumission est en cours
 * @param {string} props.error - Message d'erreur éventuel
 * @param {boolean} props.isEditMode - Mode édition (true) ou création (false)
 */
const SectionForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  isEditMode = false
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
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [factions, setFactions] = useState([]);
  const [clans, setClans] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Auto-génération du slug
  const [autoSlug, setAutoSlug] = useState(true);

  // Charger les données des selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [categoriesRes, sectionsRes, factionsRes, clansRes] = await Promise.all([
          getAllCategories(),
          getAllSections(),
          getAllFactions(),
          getAllClans()
        ]);

        setCategories(categoriesRes.data || []);
        setSections(sectionsRes.data || []);
        setFactions(factionsRes.data || []);
        setClans(clansRes.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setDataError('Impossible de charger les données nécessaires');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

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
  };

  // Filtrer les sections par catégorie pour le parent_section_id
  const availableSections = sections.filter(
    section => section.category_id === parseInt(formData.category_id)
  );

  // Filtrer les clans par faction
  const availableClans = clans.filter(
    clan => clan.faction_id === parseInt(formData.faction_id)
  );

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

      {/* Catégorie */}
      <div>
        <label htmlFor="category_id" className="block text-ochre-400 font-alternative-1 mb-2">
          Catégorie <span className="text-blood-400">*</span>
        </label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors"
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Section parente */}
      <div>
        <label htmlFor="parent_section_id" className="block text-ochre-400 font-alternative-1 mb-2">
          Section parente (optionnel)
        </label>
        <select
          id="parent_section_id"
          name="parent_section_id"
          value={formData.parent_section_id}
          onChange={handleChange}
          disabled={!formData.category_id}
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Aucune (section racine)</option>
          {availableSections.map(section => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
        {!formData.category_id && (
          <p className="text-city-400 text-xs mt-1 font-texte-corps">
            Sélectionnez d'abord une catégorie
          </p>
        )}
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
          disabled={!formData.faction_id}
          className="w-full bg-city-900 border border-city-700 rounded px-4 py-2 text-city-100 font-texte-corps focus:outline-none focus:border-ochre-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Aucun</option>
          {availableClans.map(clan => (
            <option key={clan.id} value={clan.id}>
              {clan.name}
            </option>
          ))}
        </select>
        {!formData.faction_id && (
          <p className="text-city-400 text-xs mt-1 font-texte-corps">
            Sélectionnez d'abord une faction
          </p>
        )}
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="w-4 h-4 text-ochre-500 bg-city-800 border-city-700 rounded focus:ring-ochre-500"
            />
            <span className="text-city-300 font-texte-corps text-sm">
              Section publique (visible par tous)
            </span>
          </label>

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
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-city-700">
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
    </form>
  );
};

export default SectionForm;
