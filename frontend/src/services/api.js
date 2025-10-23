const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Configuration de base pour les requêtes fetch
 */
const fetchConfig = (token = null) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Gestion des erreurs API
 */
const handleResponse = async (response) => {
  // Créer un objet d'erreur avec le statut HTTP
  if (!response.ok) {
    const error = new Error('HTTP Error');
    error.response = {
      status: response.status,
      statusText: response.statusText
    };

    try {
      const data = await response.json();
      error.message = data.error || data.message || 'Une erreur est survenue';
      error.response.data = data;
    } catch (e) {
      error.message = response.statusText || 'Une erreur est survenue';
    }

    throw error;
  }

  return await response.json();
};

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Inscription
   */
  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      ...fetchConfig(),
      body: JSON.stringify({ username, email, password }),
    });

    return handleResponse(response);
  },

  /**
   * Connexion
   */
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      ...fetchConfig(),
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  getMe: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      ...fetchConfig(token),
    });

    return handleResponse(response);
  },
};

export default authService;
