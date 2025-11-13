import { Loader2 } from 'lucide-react';

/**
 * ActionButton - Bouton d'action réutilisable avec variantes
 *
 * Thèmes de couleur :
 * - primary (ochre) : pour les actions de création et d'édition
 * - danger (red) : pour les actions de déplacement et suppression
 *
 * Tailles :
 * - large : pour les en-têtes de page (bouton avec texte)
 * - small : pour les icônes dans les cartes
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icône du bouton
 * @param {string} props.label - Texte du bouton (optionnel pour small)
 * @param {Function} props.onClick - Callback lors du clic
 * @param {boolean} props.disabled - Bouton désactivé
 * @param {boolean} props.isLoading - Affiche un spinner
 * @param {'primary'|'danger'} props.variant - Thème de couleur (default: 'primary')
 * @param {'large'|'small'} props.size - Taille du bouton (default: 'small')
 * @param {string} props.title - Tooltip
 */
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'small',
  title,
}) => {
  // Classes de base
  const baseClasses = 'transition-colors rounded-lg font-medium';

  // Classes selon la taille
  const sizeClasses = {
    large: 'px-4 py-2 flex items-center gap-2',
    small: 'p-2',
  };

  // Classes selon la variante
  const variantClasses = {
    primary: {
      large: 'bg-ochre-600 hover:bg-ochre-700 text-white',
      small: 'text-neutral-400 hover:text-ochre-400 hover:bg-neutral-700/50',
    },
    danger: {
      large: 'bg-red-600 hover:bg-red-700 text-white',
      small: 'text-neutral-400 hover:text-red-400 hover:bg-neutral-700/50',
    },
  };

  // Classes pour l'état désactivé
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  // Combiner toutes les classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant][size]}
    ${(disabled || isLoading) ? disabledClasses : ''}
  `.trim().replace(/\s+/g, ' ');

  // Taille de l'icône selon la taille du bouton
  const iconSize = size === 'large' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      title={title}
    >
      {isLoading ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : (
        Icon && <Icon className={iconSize} />
      )}
      {size === 'large' && label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
