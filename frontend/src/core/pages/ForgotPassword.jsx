import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      // On affiche toujours le meme message pour des raisons de securite
      // (ne pas reveler si l'email existe ou non)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Erosion des Ames</h1>
          <h2 className="mt-4 text-xl text-gray-300">Mot de passe oublie</h2>
        </div>

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <p className="text-gray-400 text-sm mb-4">
                Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser votre
                mot de passe.
              </p>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">Email envoye !</p>
              <p className="mt-2 text-sm text-green-400">
                Si un compte existe avec cette adresse email, vous recevrez un lien de
                reinitialisation.
              </p>
            </div>
            <p className="mt-6 text-center text-gray-400">
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Retour a la connexion
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
