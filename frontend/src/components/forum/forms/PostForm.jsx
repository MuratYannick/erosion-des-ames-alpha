import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, User, Users } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getMyCharacters } from '../../../services/charactersService';

/**
 * PostForm - Formulaire de création/édition d'un post
 *
 * @param {Object} props
 * @param {Object} props.initialData - Données initiales (mode édition)
 * @param {Function} props.onSubmit - Callback appelé lors de la soumission (data)
 * @param {Function} props.onCancel - Callback appelé lors de l'annulation
 * @param {boolean} props.isLoading - Indique si la soumission est en cours
 * @param {string} props.error - Message d'erreur éventuel
 * @param {boolean} props.isEditing - Mode édition (true) ou création (false)
 */
const PostForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  isEditing = false
}) => {
  const { user } = useAuth();

  // État du formulaire
  const [content, setContent] = useState(initialData?.content || '');
  const [authorType, setAuthorType] = useState(
    initialData?.author_character_id ? 'character' : 'user'
  );
  const [selectedCharacterId, setSelectedCharacterId] = useState(
    initialData?.author_character_id || null
  );

  // Personnages de l'utilisateur
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [charactersError, setCharactersError] = useState(null);

  // Charger les personnages de l'utilisateur
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoadingCharacters(true);
        const response = await getMyCharacters();
        const charactersData = response.data?.data || response.data || [];
        setCharacters(Array.isArray(charactersData) ? charactersData : []);
      } catch (err) {
        console.error('Erreur lors du chargement des personnages:', err);
        setCharactersError('Impossible de charger vos personnages');
      } finally {
        setLoadingCharacters(false);
      }
    };

    if (user) {
      fetchCharacters();
    }
  }, [user]);

  // Gérer le changement de type d'auteur
  const handleAuthorTypeChange = (e) => {
    const newType = e.target.value;
    setAuthorType(newType);

    // Réinitialiser la sélection de personnage si on passe en mode user
    if (newType === 'user') {
      setSelectedCharacterId(null);
    }
  };

  // Gérer la soumission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    // Préparer les données selon le type d'auteur
    const data = {
      content: content.trim()
    };

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
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message d'erreur */}
      {error && (
        <div className="bg-blood-900/20 border border-blood-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blood-400 shrink-0 mt-0.5" />
            <p className="text-blood-300 font-texte-corps text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Sélecteur de type d'auteur (seulement en mode création) */}
      {!isEditing && (
        <div className="space-y-3">
          <label className="block text-ochre-400 font-texte-corps font-semibold text-sm">
            Poster en tant que <span className="text-blood-400">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option User (HRP) */}
            <label
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${authorType === 'user'
                  ? 'bg-ochre-900/20 border-ochre-600 text-ochre-300'
                  : 'bg-city-800 border-city-700 text-city-300 hover:border-city-600'
                }
              `}
            >
              <input
                type="radio"
                name="authorType"
                value="user"
                checked={authorType === 'user'}
                onChange={handleAuthorTypeChange}
                className="sr-only"
              />
              <User className="w-5 h-5 shrink-0" />
              <div className="flex-1">
                <div className="font-texte-corps font-semibold">
                  {user?.username || 'Utilisateur'}
                </div>
                <div className="text-xs opacity-75">Post HRP (Hors Roleplay)</div>
              </div>
            </label>

            {/* Option Character (RP) */}
            <label
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${authorType === 'character'
                  ? 'bg-ochre-900/20 border-ochre-600 text-ochre-300'
                  : 'bg-city-800 border-city-700 text-city-300 hover:border-city-600'
                }
                ${characters.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="radio"
                name="authorType"
                value="character"
                checked={authorType === 'character'}
                onChange={handleAuthorTypeChange}
                disabled={characters.length === 0}
                className="sr-only"
              />
              <Users className="w-5 h-5 shrink-0" />
              <div className="flex-1">
                <div className="font-texte-corps font-semibold">Personnage</div>
                <div className="text-xs opacity-75">Post RP (Roleplay)</div>
              </div>
            </label>
          </div>

          {/* Sélection du personnage si type character */}
          {authorType === 'character' && (
            <div className="space-y-2 pl-4">
              {loadingCharacters ? (
                <div className="flex items-center gap-2 text-city-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Chargement des personnages...</span>
                </div>
              ) : charactersError ? (
                <p className="text-blood-400 text-sm font-texte-corps">{charactersError}</p>
              ) : characters.length === 0 ? (
                <p className="text-city-400 text-sm font-texte-corps">
                  Vous n'avez pas encore de personnage. Créez-en un pour poster en RP.
                </p>
              ) : (
                <select
                  value={selectedCharacterId || ''}
                  onChange={(e) => setSelectedCharacterId(parseInt(e.target.value))}
                  required={authorType === 'character'}
                  className="w-full px-4 py-2.5 bg-city-800 border border-city-700 rounded-lg text-city-200 font-texte-corps focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Sélectionnez un personnage --</option>
                  {characters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                      {char.clan && ` (${char.clan.name})`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      )}

      {/* Champ de contenu */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-ochre-400 font-texte-corps font-semibold text-sm">
          Contenu <span className="text-blood-400">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          placeholder="Écrivez votre message ici..."
          className="w-full px-4 py-3 bg-city-800 border border-city-700 rounded-lg text-city-200 font-texte-corps placeholder-city-500 focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent transition-all resize-vertical"
        />
        <p className="text-city-500 font-texte-corps text-xs">
          {content.length} caractères
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-city-700">
        <button
          type="submit"
          disabled={isLoading || !content.trim() || (authorType === 'character' && !selectedCharacterId)}
          className="flex-1 px-6 py-3 bg-ochre-600 hover:bg-ochre-500 disabled:bg-city-700 disabled:cursor-not-allowed text-city-950 font-texte-corps font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
            </>
          ) : (
            <span>{isEditing ? 'Modifier le post' : 'Publier le post'}</span>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 bg-city-700 hover:bg-city-600 disabled:opacity-50 disabled:cursor-not-allowed text-city-200 font-texte-corps rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default PostForm;
