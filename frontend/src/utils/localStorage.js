/**
 * Utilitaires pour gérer le localStorage
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const storage = {
  /**
   * Sauvegarder le token
   */
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Récupérer le token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Supprimer le token
   */
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Sauvegarder les données utilisateur
   */
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Récupérer les données utilisateur
   */
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Supprimer les données utilisateur
   */
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Tout effacer
   */
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export default storage;
