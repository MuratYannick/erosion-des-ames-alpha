import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Votre email a ete verifie avec succes.');

        // Redirection vers login apres 3 secondes
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Le lien de verification est invalide ou a expire.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Erosion des Ames</h1>
          <h2 className="mt-4 text-xl text-gray-300">Verification de l&apos;email</h2>
        </div>

        <div className="mt-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-300">Verification en cours...</p>
            </div>
          )}

          {status === 'success' && (
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
              <p className="text-lg font-medium">{message}</p>
              <p className="mt-2 text-sm text-green-400">
                Redirection vers la page de connexion...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg text-center">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">{message}</p>
              <Link to="/login" className="mt-4 inline-block text-purple-400 hover:text-purple-300">
                Retour a la connexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
