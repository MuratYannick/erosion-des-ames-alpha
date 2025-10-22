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
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }

  return data;
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
