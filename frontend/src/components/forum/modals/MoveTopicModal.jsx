import { useState, useEffect } from 'react';
import { X, Search, Loader2, ArrowRightLeft, ChevronRight } from 'lucide-react';
import { getAllCategories } from '../../../services/forum/categoriesService';
import { getAllSections } from '../../../services/forum/sectionsService';

/**
 * MoveTopicModal - Modal pour déplacer un topic vers une autre section
 *
 * @param {Object} props
 * @param {Object} props.topic - Le topic à déplacer
 * @param {Function} props.onMove - Callback appelé lors du déplacement (sectionId)
 * @param {Function} props.onClose - Callback appelé lors de la fermeture
 * @param {boolean} props.isLoading - Indique si le déplacement est en cours
 * @param {string} props.error - Message d'erreur éventuel
 */
const MoveTopicModal = ({ topic, onMove, onClose, isLoading = false, error = null }) => {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getAllCategories();
        const categoriesData = response.data?.data || response.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Charger les sections quand une catégorie est sélectionnée
  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedCategoryId) {
        setSections([]);
        setSelectedSectionId(null);
        return;
      }

      try {
        setLoadingSections(true);
        const response = await getAllSections();
        const sectionsData = response.data?.data || response.data || [];

        // Filtrer pour obtenir toutes les sections de la catégorie (avec leurs sous-sections)
        const allSectionsInCategory = (Array.isArray(sectionsData) ? sectionsData : [])
          .filter(s => s.category_id === selectedCategoryId);

        // Construire une structure hiérarchique plate avec indentation
        const buildFlatHierarchy = (sections, parentId = null, level = 0) => {
          const children = sections.filter(s => s.parent_section_id === parentId);
          let result = [];

          children.forEach(section => {
            // Exclure la section actuelle du topic
            if (section.id !== topic.section_id) {
              result.push({
                ...section,
                level,
                displayName: '  '.repeat(level) + (level > 0 ? '└ ' : '') + section.name
              });
              result = result.concat(buildFlatHierarchy(sections, section.id, level + 1));
            }
          });

          return result;
        };

        const hierarchicalSections = buildFlatHierarchy(allSectionsInCategory);
        setSections(hierarchicalSections);
        setSelectedSectionId(null);
      } catch (err) {
        console.error('Erreur lors du chargement des sections:', err);
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [selectedCategoryId, topic.section_id]);

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer les sections selon la recherche
  const filteredSections = sections.filter(sec =>
    sec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMove = () => {
    if (!selectedSectionId) return;
    onMove(selectedSectionId);
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedSection = sections.find(s => s.id === selectedSectionId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-6 h-6 text-ochre-400" />
            <h2 className="text-2xl font-titre text-ochre-400">Déplacer le topic</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Info du topic */}
        <div className="mb-6 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
          <p className="text-sm text-neutral-400 mb-1">Topic à déplacer :</p>
          <p className="text-neutral-200 font-medium">{topic.title}</p>
          <p className="text-xs text-neutral-500 mt-2">Par {topic.author_name}</p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Rechercher une catégorie ou section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-ochre-600"
          />
        </div>

        {/* Sélection hiérarchique */}
        <div className="space-y-6">
          {/* Étape 1: Catégorie */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              1. Sélectionnez une catégorie
            </label>
            {loadingCategories ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-ochre-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {filteredCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedCategoryId === category.id
                        ? 'bg-ochre-600 text-white'
                        : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-neutral-400 mt-1 line-clamp-1">
                        {category.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Étape 2: Section */}
          {selectedCategoryId && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                2. Sélectionnez la section de destination dans "{selectedCategory?.name}"
              </label>
              {loadingSections ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-ochre-400" />
                </div>
              ) : filteredSections.length === 0 ? (
                <p className="text-neutral-500 text-sm py-4">
                  Aucune section disponible (la section actuelle est exclue)
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {filteredSections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedSectionId === section.id
                          ? 'bg-ochre-600 text-white'
                          : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      <div className="font-medium font-mono text-sm">
                        {section.displayName}
                      </div>
                      {section.description && (
                        <div className="text-xs text-neutral-400 mt-1 line-clamp-1 ml-4">
                          {section.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Résumé du déplacement */}
        {selectedSectionId && (
          <div className="mt-6 p-4 bg-ochre-900/20 border border-ochre-600/30 rounded-lg">
            <p className="text-sm text-neutral-300 mb-2">Le topic sera déplacé vers :</p>
            <div className="flex items-center gap-2 text-ochre-400 text-sm">
              <span>{selectedCategory?.name}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium">{selectedSection?.name}</span>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-neutral-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleMove}
            disabled={!selectedSectionId || isLoading}
            className="px-6 py-2 bg-ochre-600 hover:bg-ochre-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Déplacement...</span>
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-4 h-4" />
                <span>Déplacer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveTopicModal;
