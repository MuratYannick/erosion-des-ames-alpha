import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/forum/api';
import { handleError } from '../utils/errorHandler';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        user_name: formData.username,
        password: formData.password
      });

      if (response.data.success) {
        // Utiliser le contexte d'authentification
        login(
          response.data.user,
          response.data.token,
          response.data.refreshToken,
          formData.rememberMe
        );

        // Rediriger vers la page d'accueil
        navigate('/home');
      }
    } catch (err) {
      // Gérer toutes les erreurs HTTP via handleError
      // Les erreurs 4xx/5xx/network seront redirigées vers les pages d'erreur appropriées
      // sauf les erreurs 400 qui sont des erreurs de validation
      const wasRedirected = handleError(err, navigate, { skipValidationErrors: true });

      // Si l'erreur n'a pas été redirigée (erreur 400), afficher le message dans le formulaire
      if (!wasRedirected) {
        setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-city-950 via-city-900 to-city-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-4xl font-titre-Jeu text-ochre-500 hover:text-ochre-400 transition-colors">
              Érosion des Âmes
            </h1>
          </Link>
          <h2 className="text-2xl font-alternative-1 text-city-300">
            Connexion
          </h2>
          <p className="mt-2 text-sm font-texte-corps text-city-500">
            Accédez à votre compte
          </p>
        </div>

        <div className="bg-city-800 border-2 border-ochre-600 rounded-lg shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-blood-900 border-2 border-blood-700 text-blood-300 px-4 py-3 rounded font-texte-corps text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-texte-corps text-city-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-city-900 border-2 border-city-700 rounded text-city-200 placeholder-city-600 font-texte-corps focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-ochre-500 transition-colors"
                  placeholder="votre_nom_utilisateur"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-texte-corps text-city-300 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-city-900 border-2 border-city-700 rounded text-city-200 placeholder-city-600 font-texte-corps focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-ochre-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 bg-city-900 border-2 border-city-700 rounded text-ochre-600 focus:ring-2 focus:ring-ochre-500 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm font-texte-corps text-city-300 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-ochre-600 hover:bg-ochre-500 text-white font-texte-corps text-lg rounded transition-all transform hover:scale-105 shadow-lg hover:shadow-ochre-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-city-700">
              <p className="text-sm font-texte-corps text-city-400">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-ochre-500 hover:text-ochre-400 font-bold transition-colors">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm font-texte-corps text-city-500 hover:text-ochre-500 transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
