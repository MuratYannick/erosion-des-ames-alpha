import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caracteres';
    } else {
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir une minuscule';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir une majuscule';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir un chiffre';
      } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir un caractere special';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      await authService.resetPassword(token, formData.password);
      setSuccess(true);

      // Redirection vers login apres 3 secondes
      setTimeout(() => {
        navigate('/login?reset=true');
      }, 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Le lien de reinitialisation est invalide ou a expire.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Erosion des Ames</h1>
          </div>
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg text-center">
            <p>Token de reinitialisation manquant.</p>
            <Link
              to="/forgot-password"
              className="mt-4 inline-block text-purple-400 hover:text-purple-300"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Erosion des Ames</h1>
          <h2 className="mt-4 text-xl text-gray-300">Reinitialiser le mot de passe</h2>
        </div>

        {!success ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Nouveau mot de passe
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
                  8 caracteres min. 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300"
                >
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {loading ? 'Reinitialisation...' : 'Reinitialiser le mot de passe'}
            </button>

            <p className="text-center text-gray-400">
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Retour a la connexion
              </Link>
            </p>
          </form>
        ) : (
          <div className="mt-8">
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-6 py-4 rounded-lg text-center">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">Mot de passe reinitialise !</p>
              <p className="mt-2 text-sm text-green-400">
                Redirection vers la page de connexion...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
