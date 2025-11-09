import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';

/**
 * DestinationTreeNode - Nœud de l'arborescence pour sélection de destination
 *
 * @param {Object} props
 * @param {Object} props.node - Données du nœud (category ou section)
 * @param {string} props.node.id - ID du nœud
 * @param {string} props.node.name - Nom affiché
 * @param {string} props.node.type - Type: 'category' ou 'section'
 * @param {Array} props.node.children - Enfants (sections)
 * @param {number} props.level - Niveau de profondeur (0 = racine)
 * @param {Object} props.selected - Destination sélectionnée {type, id}
 * @param {Function} props.onSelect - Callback de sélection (type, id, name)
 * @param {Set} props.disabledIds - IDs des sections désactivées
 */
const DestinationTreeNode = ({
  node,
  level = 0,
  selected,
  onSelect,
  disabledIds = new Set()
}) => {
  const [isExpanded, setIsExpanded] = useState(level === 0); // Catégories ouvertes par défaut

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selected?.type === node.type && selected?.id === node.id;

  // Vérifier si le nœud est désactivé :
  // 1. Si dans la liste disabledIds (section courante ou descendants)
  // 2. Si pas de permission move_section sur cette destination
  //    La permission move_section signifie que l'utilisateur peut :
  //    - Déplacer les sections enfants DEPUIS cet élément
  //    - Utiliser cet élément COMME destination (déplacer des sections VERS)
  let isDisabled = disabledIds.has(node.id);

  if (!isDisabled && node.permissions) {
    // Pour déplacer une section VERS cette destination, l'utilisateur doit avoir
    // la permission move_section sur la destination (catégorie ou section)
    if (!node.permissions.canMoveSection) {
      isDisabled = true;
    }
  }

  // Calcul de l'indentation
  const indentSize = level * 20;

  // Gérer le clic sur le chevron (expand/collapse)
  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  // Gérer la sélection du nœud
  const handleSelect = () => {
    if (!isDisabled) {
      onSelect(node.type, node.id, node.name);
    }
  };

  // Icône selon le type et l'état
  const getIcon = () => {
    if (node.type === 'category') {
      return isExpanded ? (
        <FolderOpen className="w-5 h-5 text-ochre-500" />
      ) : (
        <Folder className="w-5 h-5 text-ochre-500" />
      );
    } else {
      return <File className="w-4 h-4 text-city-400" />;
    }
  };

  return (
    <div className="select-none">
      {/* Nœud actuel */}
      <div
        className={`
          flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors
          ${isSelected
            ? 'bg-ochre-700 text-ochre-100'
            : isDisabled
            ? 'bg-city-800/50 text-city-500 cursor-not-allowed opacity-50'
            : 'hover:bg-city-700 text-city-200'
          }
        `}
        style={{ paddingLeft: `${indentSize + 12}px` }}
        onClick={handleSelect}
      >
        {/* Chevron expand/collapse */}
        <button
          onClick={handleToggle}
          className={`
            shrink-0 p-0.5 rounded transition-colors
            ${hasChildren ? 'hover:bg-city-600' : 'invisible'}
          `}
          disabled={!hasChildren}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Icône */}
        <div className="shrink-0">
          {getIcon()}
        </div>

        {/* Nom */}
        <span className={`
          font-texte-corps text-sm truncate
          ${node.type === 'category' ? 'font-semibold' : ''}
          ${isDisabled ? 'line-through' : ''}
        `}>
          {node.name}
        </span>

        {/* Badge si désactivé */}
        {isDisabled && (
          <span className="ml-auto text-xs text-blood-400 font-texte-corps italic">
            (invalide)
          </span>
        )}
      </div>

      {/* Enfants (si développé) */}
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <DestinationTreeNode
              key={`${child.type}-${child.id}`}
              node={child}
              level={level + 1}
              selected={selected}
              onSelect={onSelect}
              disabledIds={disabledIds}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationTreeNode;
