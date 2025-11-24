import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    cguAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 8) {
      newErrors.username = "Le nom d'utilisateur doit contenir au moins 8 caractères";
    }

    if (!/^[a-zA-Z-' ]+$/.test(formData.username)) {
      newErrors.username = 'Caractères autorisés : lettres, tirets, espaces, apostrophes';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else {
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir une minuscule';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir une majuscule';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir un chiffre';
      } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir un caractère spécial';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.cguAccepted) {
      newErrors.cguAccepted = 'Vous devez accepter les CGU';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        cguAccepted: formData.cguAccepted,
      });
      navigate('/');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Erosion des Ames</h1>
          <h2 className="mt-4 text-xl text-gray-300">Inscription</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Nom d&apos;utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="JeanDupont"
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              <p className="mt-1 text-xs text-gray-500">
                8 caractères min. Lettres, tirets, espaces, apostrophes autorisés.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">
                8 caractères min. 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="cguAccepted"
                name="cguAccepted"
                type="checkbox"
                checked={formData.cguAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="cguAccepted" className="ml-2 text-sm text-gray-300">
                J&apos;accepte les{' '}
                <a href="/cgu" className="text-purple-400 hover:text-purple-300">
                  Conditions Générales d&apos;Utilisation
                </a>
              </label>
            </div>
            {errors.cguAccepted && <p className="text-sm text-red-500">{errors.cguAccepted}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>

          <p className="text-center text-gray-400">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
