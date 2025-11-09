import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, MoveRight, X } from 'lucide-react';
import { getAllCategories } from '../../../services/forum/categoriesService';
import { getAllSections } from '../../../services/forum/sectionsService';
import DestinationTreeNode from '../tree/DestinationTreeNode';

/**
 * MoveSectionForm - Formulaire de déplacement d'une section avec arborescence
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
  // État de la catégorie sélectionnée
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // État de la destination sélectionnée (catégorie ou section)
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Données chargées
  const [categories, setCategories] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Arborescence de la catégorie sélectionnée
  const [treeData, setTreeData] = useState([]);
  const [disabledIds, setDisabledIds] = useState(new Set());

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [categoriesRes, sectionsRes] = await Promise.all([
          getAllCategories(),
          getAllSections()
        ]);

        const cats = categoriesRes.data?.data || categoriesRes.data || [];
        const secs = sectionsRes.data?.data || sectionsRes.data || [];

        setCategories(cats);
        setAllSections(secs);

        // Pré-sélectionner la catégorie actuelle de la section
        if (section.category_id) {
          setSelectedCategoryId(section.category_id);
        }

        setLoadingData(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setDataError('Erreur lors du chargement des données');
        setLoadingData(false);
      }
    };

    fetchData();
  }, [section.id, section.category_id]);

  // Construire l'arborescence quand la catégorie change
  useEffect(() => {
    if (!selectedCategoryId || categories.length === 0 || allSections.length === 0) {
      setTreeData([]);
      return;
    }

    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const tree = buildCategoryTree(category, allSections, section);
    setTreeData(tree.nodes);
    setDisabledIds(tree.disabledIds);
  }, [selectedCategoryId, categories, allSections, section]);

  /**
   * Construire l'arborescence d'une catégorie spécifique
   */
  const buildCategoryTree = (category, sections, currentSection) => {
    const disabledSet = new Set();

    // Marquer la section elle-même comme désactivée
    disabledSet.add(currentSection.id);

    // Fonction récursive pour obtenir tous les descendants d'une section
    const getAllDescendants = (sectionId, allSections) => {
      const descendants = new Set();
      const children = allSections.filter(s => s.parent_section_id === sectionId);

      children.forEach(child => {
        descendants.add(child.id);
        const grandChildren = getAllDescendants(child.id, allSections);
        grandChildren.forEach(gc => descendants.add(gc));
      });

      return descendants;
    };

    // Marquer tous les descendants comme désactivés
    const descendants = getAllDescendants(currentSection.id, sections);
    descendants.forEach(id => disabledSet.add(id));

    // Marquer les sections sans permission canMoveSection comme désactivées
    // canMoveSection sur une section = permission de déplacer des sections vers/depuis cette section
    sections.forEach(s => {
      if (s.category_id === category.id && s.permissions && !s.permissions.canMoveSection) {
        disabledSet.add(s.id);
      }
    });

    // Fonction récursive pour construire les enfants d'une section
    const buildSectionChildren = (parentId, allSections) => {
      return allSections
        .filter(s => s.parent_section_id === parentId && s.category_id === category.id)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(s => ({
          id: s.id,
          name: s.name,
          type: 'section',
          permissions: s.permissions,
          children: buildSectionChildren(s.id, allSections)
        }));
    };

    // Construire l'arborescence de cette catégorie
    // Commencer par un nœud catégorie racine, puis ses sections racines
    const rootSections = sections
      .filter(s => s.category_id === category.id && !s.parent_section_id)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map(s => ({
        id: s.id,
        name: s.name,
        type: 'section',
        permissions: s.permissions,
        children: buildSectionChildren(s.id, sections)
      }));

    // Retourner la catégorie avec ses sections
    // Note: Si l'utilisateur n'a pas canCreateSection sur la catégorie,
    // le nœud catégorie sera désactivé côté composant DestinationTreeNode
    const categoryNode = {
      id: category.id,
      name: category.name,
      type: 'category',
      permissions: category.permissions,
      children: rootSections
    };

    return { nodes: [categoryNode], disabledIds: disabledSet };
  };

  // Gérer le changement de catégorie
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    setSelectedCategoryId(categoryId);
    setSelectedDestination(null); // Réinitialiser la sélection
  };

  // Gérer la sélection d'une destination dans l'arborescence
  const handleSelectDestination = (type, id, name) => {
    setSelectedDestination({ type, id, name });
  };

  // Gérer la soumission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDestination) {
      return;
    }

    onSubmit(selectedDestination.type, selectedDestination.id);
  };

  // Affichage pendant le chargement
  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 text-ochre-500 animate-spin" />
        <p className="text-city-300 font-texte-corps">Chargement des données...</p>
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

      {/* Instructions */}
      <div className="bg-ochre-900/10 border border-ochre-700/30 rounded-lg p-4">
        <p className="text-ochre-300 font-texte-corps text-sm">
          <strong>Étape 1 :</strong> Sélectionnez la catégorie de destination
        </p>
        <p className="text-ochre-300 font-texte-corps text-sm mt-1">
          <strong>Étape 2 :</strong> Cliquez sur la <strong>catégorie</strong> (section racine)
          ou une <strong>section</strong> (sous-section) dans l'arborescence
        </p>
        <p className="text-ochre-400/70 font-texte-corps text-xs mt-2 italic">
          Les destinations invalides sont grisées et barrées.
        </p>
      </div>

      {/* Sélection de la catégorie */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-ochre-400 font-texte-corps font-semibold text-sm">
          Catégorie de destination <span className="text-blood-400">*</span>
        </label>
        <select
          id="category"
          value={selectedCategoryId || ''}
          onChange={handleCategoryChange}
          required
          className="w-full px-4 py-2.5 bg-city-800 border border-city-700 rounded-lg text-city-200 font-texte-corps focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent transition-all"
        >
          <option value="">-- Sélectionnez une catégorie --</option>
          {categories
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Arborescence de sélection (affichée seulement si catégorie sélectionnée) */}
      {selectedCategoryId && (
        <div className="space-y-2">
          <label className="block text-ochre-400 font-texte-corps font-semibold text-sm">
            Destination dans l'arborescence <span className="text-blood-400">*</span>
          </label>
          <div className="bg-city-900 border border-city-700 rounded-lg p-3 max-h-96 overflow-y-auto">
            {treeData.length === 0 ? (
              <p className="text-city-400 font-texte-corps text-sm text-center py-4">
                Aucune destination disponible dans cette catégorie
              </p>
            ) : (
              treeData.map((node) => (
                <DestinationTreeNode
                  key={`${node.type}-${node.id}`}
                  node={node}
                  level={0}
                  selected={selectedDestination}
                  onSelect={handleSelectDestination}
                  disabledIds={disabledIds}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Aperçu de la sélection */}
      {selectedDestination && (
        <div className="bg-ochre-900/20 border border-ochre-700 rounded-lg p-4">
          <p className="text-ochre-300 font-texte-corps text-sm mb-2">
            <MoveRight className="w-4 h-4 inline mr-2" />
            Destination sélectionnée :
          </p>
          <div className="bg-city-800 rounded px-3 py-2">
            <p className="text-ochre-200 font-texte-corps font-semibold">
              {selectedDestination.name}
            </p>
            <p className="text-city-400 font-texte-corps text-xs mt-1">
              {selectedDestination.type === 'category'
                ? 'La section deviendra une section racine de cette catégorie'
                : 'La section deviendra une sous-section'}
            </p>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-city-700">
        <button
          type="submit"
          disabled={isLoading || !selectedDestination}
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
