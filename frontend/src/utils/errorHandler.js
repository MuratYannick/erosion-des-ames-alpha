/**
 * Gestionnaire d'erreurs global pour rediriger vers les pages d'erreur appropriées
 */

/**
 * Redirige vers la page d'erreur appropriée en fonction du code d'erreur
 * @param {Error|Object} error - L'erreur capturée
 * @param {Function} navigate - La fonction de navigation de react-router-dom
 */
export const handleError = (error, navigate) => {
  console.error('Error caught:', error);

  // Erreur réseau (Failed to fetch, Network error, etc.)
  if (
    error.message === 'Failed to fetch' ||
    error.message === 'Network Error' ||
    error.message?.includes('network') ||
    !navigator.onLine
  ) {
    navigate('/error/network');
    return;
  }

  // Erreur HTTP avec code de statut
  if (error.response?.status) {
    const status = error.response.status;

    switch (status) {
      case 401:
        navigate('/error/401');
        break;
      case 403:
        navigate('/error/403');
        break;
      case 404:
        navigate('/error/404');
        break;
      case 500:
        navigate('/error/500');
        break;
      case 503:
        navigate('/error/503');
        break;
      default:
        // Pour les autres erreurs 4xx, rediriger vers 404
        if (status >= 400 && status < 500) {
          navigate('/error/404');
        }
        // Pour les autres erreurs 5xx, rediriger vers 500
        else if (status >= 500) {
          navigate('/error/500');
        }
        break;
    }
    return;
  }

  // Erreur JavaScript non gérée - rediriger vers 500
  navigate('/error/500');
};

/**
 * Wrapper try/catch pour les appels API
 * @param {Function} apiCall - La fonction d'appel API à exécuter
 * @param {Function} navigate - La fonction de navigation
 * @param {Function} onSuccess - Callback en cas de succès (optionnel)
 * @returns {Promise}
 */
export const withErrorHandling = async (apiCall, navigate, onSuccess = null) => {
  try {
    const result = await apiCall();
    if (onSuccess) {
      onSuccess(result);
    }
    return result;
  } catch (error) {
    handleError(error, navigate);
    throw error; // Re-throw pour permettre un traitement supplémentaire si nécessaire
  }
};

/**
 * Hook personnalisé pour gérer les erreurs dans les composants React
 * Peut être utilisé avec un error boundary
 */
export class ErrorBoundary {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }
}
