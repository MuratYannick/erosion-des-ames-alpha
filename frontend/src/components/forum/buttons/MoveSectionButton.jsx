import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * MoveSectionButton - Bouton de déplacement d'une section
 * N'apparaît que si l'utilisateur a la permission de déplacer la section
 *
 * @param {Object} props
 * @param {number} props.sectionId - ID de la section
 * @param {Object} props.permissions - Permissions de l'utilisateur sur cette section
 */
const MoveSectionButton = ({ sectionId, permissions }) => {
  const { user } = useAuth();

  // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  // Ne pas afficher le bouton si l'utilisateur n'a pas la permission de déplacer
  if (!permissions?.canMoveSection) {
    return null;
  }

  return (
    <Link
      to={`/forum/sections/${sectionId}/move`}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-city-600 hover:bg-city-500 text-city-100 font-alternative-1 text-sm rounded transition-colors"
      title="Déplacer cette section"
    >
      <MoveRight className="w-4 h-4" />
      <span>Déplacer</span>
    </Link>
  );
};

export default MoveSectionButton;
