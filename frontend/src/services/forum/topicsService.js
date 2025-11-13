import api from './api';

/**
 * Service pour la gestion des topics du forum
 */

/**
 * Récupérer tous les topics
 * @returns {Promise<Array>}
 */
export const getAllTopics = async () => {
  return api.get('/forum/topics');
};

/**
 * Récupérer un topic par ID
 * @param {number} id - ID du topic
 * @returns {Promise<Object>}
 */
export const getTopicById = async (id) => {
  return api.get(`/forum/topics/${id}`);
};

/**
 * Récupérer un topic par slug
 * @param {string} slug - Slug du topic
 * @returns {Promise<Object>}
 */
export const getTopicBySlug = async (slug) => {
  return api.get(`/forum/topics/slug/${slug}`);
};

/**
 * Récupérer les topics d'une section
 * @param {number} sectionId - ID de la section
 * @returns {Promise<Array>}
 */
export const getTopicsBySection = async (sectionId) => {
  return api.get(`/forum/sections/${sectionId}/topics`);
};

/**
 * Créer un nouveau topic
 * @param {Object} data - Données du topic
 * @returns {Promise<Object>}
 */
export const createTopic = async (data) => {
  return api.post('/forum/topics', data);
};

/**
 * Mettre à jour un topic
 * @param {number} id - ID du topic
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateTopic = async (id, data) => {
  return api.put(`/forum/topics/${id}`, data);
};

/**
 * Supprimer un topic
 * @param {number} id - ID du topic
 * @returns {Promise<Object>}
 */
export const deleteTopic = async (id) => {
  return api.delete(`/forum/topics/${id}`);
};

/**
 * Épingler/Désépingler un topic (moderator)
 * @param {number} id - ID du topic
 * @param {boolean} isPinned - État épinglé
 * @returns {Promise<Object>}
 */
export const pinTopic = async (id, isPinned) => {
  return api.patch(`/forum/topics/${id}/pin`, { is_pinned: isPinned });
};

/**
 * Verrouiller/Déverrouiller un topic (moderator)
 * @param {number} id - ID du topic
 * @param {boolean} isLocked - État verrouillé
 * @returns {Promise<Object>}
 */
export const lockTopic = async (id, isLocked) => {
  return api.patch(`/forum/topics/${id}/lock`, { is_locked: isLocked });
};

/**
 * Déplacer un topic vers une autre section
 * @param {number} id - ID du topic
 * @param {number} newSectionId - ID de la section de destination
 * @returns {Promise<Object>}
 */
export const moveTopic = async (id, newSectionId) => {
  return api.patch(`/forum/topics/${id}/move`, { new_section_id: newSectionId });
};

export default {
  getAllTopics,
  getTopicById,
  getTopicBySlug,
  getTopicsBySection,
  createTopic,
  updateTopic,
  deleteTopic,
  pinTopic,
  lockTopic,
  moveTopic,
};
