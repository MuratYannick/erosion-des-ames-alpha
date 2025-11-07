import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * NewSectionButton - Bouton pour créer une nouvelle section
 *
 * @param {Object} props
 * @param {Object} props.category - Catégorie parente (si on crée une section racine)
 * @param {Object} props.section - Section parente (si on crée une sous-section)
 * @param {string} props.className - Classes CSS additionnelles
 */
const NewSectionButton = ({ category, section, className = '' }) => {
  const navigate = useNavigate();
  const { canCreateSection } = useAuth();

  // Déterminer la ressource à vérifier (section ou catégorie)
  const resource = section || category;

  // Vérifier les permissions
  const canCreate = canCreateSection(category, section);

  // Si pas de permission, ne pas afficher le bouton
  if (!canCreate) {
    return null;
  }

  // Si la ressource est verrouillée, ne pas afficher le bouton
  if (resource?.is_locked) {
    return null;
  }

  const handleClick = () => {
    // Construire l'URL avec les query params pour pré-remplir le formulaire
    const params = new URLSearchParams();

    if (category) {
      params.set('category_id', category.id);
    }

    if (section) {
      params.set('parent_section_id', section.id);
      // Si on a une section, on a aussi sa catégorie
      if (section.category_id) {
        params.set('category_id', section.category_id);
      }
    }

    navigate(`/forum/sections/new?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-ochre-600 hover:bg-ochre-500 text-city-950 font-alternative-1 rounded transition-colors ${className}`}
      title={section ? 'Créer une sous-section' : 'Créer une nouvelle section'}
    >
      <Plus className="w-5 h-5" />
      <span className="hidden sm:inline">
        {section ? 'Nouvelle sous-section' : 'Nouvelle section'}
      </span>
      <span className="sm:hidden">Nouveau</span>
    </button>
  );
};

export default NewSectionButton;
