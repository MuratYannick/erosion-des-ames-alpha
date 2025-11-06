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
  const token = localStorage.getItem('token');

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

    // Si 401, token expiré
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expirée');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur API');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export default apiRequest;
