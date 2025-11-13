import { useState, useEffect } from 'react';
import { Loader2, User as UserIcon, Users } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getMyCharacters } from '../../../services/charactersService';

/**
 * TopicForm - Formulaire de création/édition de topic
 * Inclut le champ pour le premier post lors de la création
 *
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales pour l'édition (optionnel)
 * @param {Function} props.onSubmit - Callback appelé lors de la soumission (data)
 * @param {Function} props.onCancel - Callback appelé lors de l'annulation
 * @param {boolean} props.isLoading - Indique si la soumission est en cours
 * @param {string} props.error - Message d'erreur éventuel
 * @param {boolean} props.isEditing - true = édition, false = création
 */
const TopicForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  isEditing = false
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || '');
  const [firstPostContent, setFirstPostContent] = useState(initialData?.first_post_content || '');
  const [authorType, setAuthorType] = useState(initialData?.author_character_id ? 'character' : 'user');
  const [selectedCharacterId, setSelectedCharacterId] = useState(initialData?.author_character_id || null);
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  // Charger les personnages de l'utilisateur
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user) return;

      try {
        setLoadingCharacters(true);
        const response = await getMyCharacters();
        const charactersData = response.data?.data || response.data || [];
        setCharacters(Array.isArray(charactersData) ? charactersData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des personnages:', err);
        setCharacters([]);
      } finally {
        setLoadingCharacters(false);
      }
    };

    fetchCharacters();
  }, [user]);

  // Générer le slug à partir du titre
  const generateSlug = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non-alphanumériques par des tirets
      .replace(/^-+|-+$/g, ''); // Enlever les tirets en début et fin
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      return;
    }

    if (!isEditing && !firstPostContent.trim()) {
      return;
    }

    // Construire les données
    const data = {
      title: title.trim(),
      slug: generateSlug(title.trim())
    };

    // Ajouter le contenu du premier post seulement en mode création
    if (!isEditing) {
      data.first_post_content = firstPostContent.trim();
    }

    // Gérer l'auteur
    if (authorType === 'character') {
      if (!selectedCharacterId) {
        return;
      }

      const selectedChar = characters.find(c => c.id === selectedCharacterId);
      data.author_character_id = selectedCharacterId;
      data.author_user_id = null;
      data.author_name = selectedChar?.name || 'Personnage';
    } else {
      data.author_user_id = user.id;
      data.author_character_id = null;
      data.author_name = user.username || 'Utilisateur';
    }

    // En mode édition, on ne peut pas changer l'auteur
    if (isEditing) {
      delete data.author_user_id;
      delete data.author_character_id;
      delete data.author_name;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Titre du topic */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">
          Titre du topic *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
          maxLength={200}
          placeholder="Entrez le titre de votre topic..."
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-ochre-600 disabled:opacity-50"
        />
        <p className="text-xs text-neutral-500 mt-1">
          Le slug sera généré automatiquement à partir du titre
        </p>
      </div>

      {/* Contenu du premier post (seulement en création) */}
      {!isEditing && (
        <div>
          <label htmlFor="firstPostContent" className="block text-sm font-medium text-neutral-300 mb-2">
            Premier message *
          </label>
          <textarea
            id="firstPostContent"
            value={firstPostContent}
            onChange={(e) => setFirstPostContent(e.target.value)}
            disabled={isLoading}
            required
            rows={8}
            placeholder="Rédigez le premier message de votre topic..."
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-ochre-600 disabled:opacity-50 resize-y"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Le premier message permet de lancer la discussion
          </p>
        </div>
      )}

      {/* Sélection du type d'auteur (seulement en création) */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Publier en tant que *
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Option User (HRP) */}
            <button
              type="button"
              onClick={() => setAuthorType('user')}
              disabled={isLoading}
              className={`p-4 rounded-lg border-2 transition-all ${
                authorType === 'user'
                  ? 'border-ochre-600 bg-ochre-900/20'
                  : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                <UserIcon className={`w-5 h-5 ${authorType === 'user' ? 'text-ochre-400' : 'text-neutral-400'}`} />
                <div className="text-left">
                  <div className={`font-medium ${authorType === 'user' ? 'text-ochre-400' : 'text-neutral-300'}`}>
                    Utilisateur (HRP)
                  </div>
                  <div className="text-xs text-neutral-500">
                    {user?.username || 'Utilisateur'}
                  </div>
                </div>
              </div>
            </button>

            {/* Option Character (RP) */}
            <button
              type="button"
              onClick={() => setAuthorType('character')}
              disabled={isLoading || loadingCharacters || characters.length === 0}
              className={`p-4 rounded-lg border-2 transition-all ${
                authorType === 'character'
                  ? 'border-ochre-600 bg-ochre-900/20'
                  : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${authorType === 'character' ? 'text-ochre-400' : 'text-neutral-400'}`} />
                <div className="text-left">
                  <div className={`font-medium ${authorType === 'character' ? 'text-ochre-400' : 'text-neutral-300'}`}>
                    Personnage (RP)
                  </div>
                  <div className="text-xs text-neutral-500">
                    {loadingCharacters ? 'Chargement...' : characters.length === 0 ? 'Aucun personnage' : 'Sélectionner'}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Sélection du personnage si RP */}
          {authorType === 'character' && characters.length > 0 && (
            <div className="mt-4">
              <label htmlFor="character" className="block text-sm font-medium text-neutral-300 mb-2">
                Choisissez votre personnage
              </label>
              <select
                id="character"
                value={selectedCharacterId || ''}
                onChange={(e) => setSelectedCharacterId(e.target.value ? parseInt(e.target.value) : null)}
                disabled={isLoading}
                required
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-200 focus:outline-none focus:border-ochre-600 disabled:opacity-50"
              >
                <option value="">Sélectionnez un personnage</option>
                {characters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name} {char.is_dead ? '(Décédé)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading || (!isEditing && authorType === 'character' && !selectedCharacterId)}
          className="px-6 py-2 bg-ochre-600 hover:bg-ochre-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEditing ? 'Modification...' : 'Création...'}</span>
            </>
          ) : (
            <span>{isEditing ? 'Modifier' : 'Créer le topic'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default TopicForm;
