import api from './forum/api';

/**
 * Service pour la gestion des personnages
 */

/**
 * Récupérer tous les personnages
 * @returns {Promise<Array>}
 */
export const getAllCharacters = async () => {
  return api.get('/characters');
};

/**
 * Récupérer un personnage par ID
 * @param {number} id - ID du personnage
 * @returns {Promise<Object>}
 */
export const getCharacterById = async (id) => {
  return api.get(`/characters/${id}`);
};

/**
 * Récupérer les personnages de l'utilisateur connecté
 * @returns {Promise<Array>}
 */
export const getMyCharacters = async () => {
  return api.get('/forum/characters/me');
};

/**
 * Créer un nouveau personnage
 * @param {Object} data - Données du personnage
 * @returns {Promise<Object>}
 */
export const createCharacter = async (data) => {
  return api.post('/characters', data);
};

/**
 * Mettre à jour un personnage
 * @param {number} id - ID du personnage
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateCharacter = async (id, data) => {
  return api.put(`/characters/${id}`, data);
};

/**
 * Supprimer un personnage
 * @param {number} id - ID du personnage
 * @returns {Promise<Object>}
 */
export const deleteCharacter = async (id) => {
  return api.delete(`/characters/${id}`);
};

export default {
  getAllCharacters,
  getCharacterById,
  getMyCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
