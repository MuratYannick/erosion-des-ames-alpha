/**
 * Service API pour le forum
 * Communication avec le backend Express
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Fonction générique pour les requêtes API
 * @param {string} endpoint - Point de terminaison de l'API
 * @param {Object} options - Options fetch (method, headers, body, etc.)
 * @returns {Promise<Object>} Réponse JSON
 */
const apiRequest = async (endpoint, options = {}) => {
  // Chercher le token dans sessionStorage d'abord, puis localStorage
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Gestion des codes d'erreur HTTP avec redirection vers pages d'erreur personnalisées
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Erreur inconnue' }));

      switch (response.status) {
        case 401:
          // Non authentifié - rediriger vers login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expirée');

        case 403:
          // Interdit - rediriger vers page 403
          window.location.href = '/error/403';
          throw new Error(data.error || 'Accès interdit');

        case 404:
          // Non trouvé - rediriger vers page 404
          window.location.href = '/error/404';
          throw new Error(data.error || 'Ressource introuvable');

        case 500:
          // Erreur serveur - rediriger vers page 500
          window.location.href = '/error/500';
          throw new Error(data.error || 'Erreur serveur');

        case 503:
          // Service indisponible - rediriger vers page 503
          window.location.href = '/error/503';
          throw new Error(data.error || 'Service indisponible');

        default:
          // Autres erreurs - afficher le message d'erreur
          throw new Error(data.error || `Erreur ${response.status}`);
      }
    }

    const data = await response.json();
    // Retourner un objet axios-like avec data
    return { data };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);

    // Si c'est une erreur réseau (pas de réponse du serveur)
    if (error.message === 'Failed to fetch' || !navigator.onLine) {
      window.location.href = '/error/network';
    }

    // Retourner une erreur axios-like
    if (error.response) {
      throw error;
    }

    // Pour les autres erreurs, créer un objet erreur axios-like
    const axiosError = new Error(error.message);
    axiosError.response = {
      data: { message: error.message },
      status: 500
    };
    throw axiosError;
  }
};

// Export avec méthodes HTTP (style axios)
const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options = {}) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }),
  put: (endpoint, data, options = {}) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }),
  patch: (endpoint, data, options = {}) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options
  }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { method: 'DELETE', ...options }),
};

export default api;
