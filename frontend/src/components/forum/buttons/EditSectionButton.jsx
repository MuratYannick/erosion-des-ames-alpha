import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * EditSectionButton - Bouton d'édition d'une section
 * N'apparaît que si l'utilisateur a la permission d'éditer la section
 *
 * @param {Object} props
 * @param {number} props.sectionId - ID de la section
 * @param {Object} props.permissions - Permissions de l'utilisateur sur cette section
 */
const EditSectionButton = ({ sectionId, permissions }) => {
  const { user } = useAuth();

  // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  // Ne pas afficher le bouton si l'utilisateur n'a pas la permission d'éditer
  if (!permissions?.canEdit) {
    return null;
  }

  return (
    <Link
      to={`/forum/sections/${sectionId}/edit`}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-ochre-600 hover:bg-ochre-500 text-city-950 font-alternative-1 text-sm rounded transition-colors"
      title="Éditer/Supprimer cette section"
    >
      <Edit className="w-4 h-4" />
      <span>Éditer</span>
    </Link>
  );
};

export default EditSectionButton;
