/**
 * Gestionnaire d'erreurs global pour rediriger vers les pages d'erreur appropriées
 */

/**
 * Redirige vers la page d'erreur appropriée en fonction du code d'erreur
 * @param {Error|Object} error - L'erreur capturée
 * @param {Function} navigate - La fonction de navigation de react-router-dom
 * @param {Object} options - Options de configuration
 * @param {boolean} options.skipValidationErrors - Si true, ne redirige pas les erreurs de formulaire (400, 401, 409)
 * @returns {boolean} - true si l'erreur a été redirigée, false sinon
 */
export const handleError = (error, navigate, options = {}) => {
  const { skipValidationErrors = false } = options;

  console.error('Error caught:', error);

  // Erreur réseau (Failed to fetch, Network error, etc.)
  if (
    error.message === 'Failed to fetch' ||
    error.message === 'Network Error' ||
    error.message?.includes('network') ||
    !navigator.onLine
  ) {
    navigate('/error/network');
    return true;
  }

  // Erreur HTTP avec code de statut
  if (error.response?.status) {
    const status = error.response.status;

    // Si skipValidationErrors est activé, ne pas rediriger les erreurs de formulaire
    // 400: Erreurs de validation (champs invalides)
    // 401: Erreurs d'authentification (mauvais identifiants)
    // 409: Erreurs de conflit (email/username déjà existant)
    if (skipValidationErrors && (status === 400 || status === 401 || status === 409)) {
      return false;
    }

    switch (status) {
      case 401:
        navigate('/error/401');
        return true;
      case 403:
        navigate('/error/403');
        return true;
      case 404:
        navigate('/error/404');
        return true;
      case 500:
        navigate('/error/500');
        return true;
      case 503:
        navigate('/error/503');
        return true;
      default:
        // Pour les autres erreurs 4xx, rediriger vers 404
        if (status >= 400 && status < 500) {
          navigate('/error/404');
          return true;
        }
        // Pour les autres erreurs 5xx, rediriger vers 500
        else if (status >= 500) {
          navigate('/error/500');
          return true;
        }
        break;
    }
    return false;
  }

  // Erreur JavaScript non gérée - rediriger vers 500
  navigate('/error/500');
  return true;
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
