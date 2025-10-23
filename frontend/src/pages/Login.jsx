import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { storage } from '../utils/localStorage';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password);

      // Sauvegarder le token et les données utilisateur
      storage.setToken(response.token);
      storage.setUser(response.user);

      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (err) {
      setError(err.message);
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
                <label htmlFor="email" className="block text-sm font-texte-corps text-city-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-city-900 border-2 border-city-700 rounded text-city-200 placeholder-city-600 font-texte-corps focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-ochre-500 transition-colors"
                  placeholder="votre@email.com"
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
