import apiRequest from './api';

/**
 * Service pour la gestion des topics du forum
 */

/**
 * Récupérer tous les topics
 * @returns {Promise<Array>}
 */
export const getAllTopics = async () => {
  return apiRequest('/forum/topics');
};

/**
 * Récupérer un topic par ID
 * @param {number} id - ID du topic
 * @returns {Promise<Object>}
 */
export const getTopicById = async (id) => {
  return apiRequest(`/forum/topics/${id}`);
};

/**
 * Récupérer un topic par slug
 * @param {string} slug - Slug du topic
 * @returns {Promise<Object>}
 */
export const getTopicBySlug = async (slug) => {
  return apiRequest(`/forum/topics/slug/${slug}`);
};

/**
 * Récupérer les topics d'une section
 * @param {number} sectionId - ID de la section
 * @returns {Promise<Array>}
 */
export const getTopicsBySection = async (sectionId) => {
  return apiRequest(`/forum/sections/${sectionId}/topics`);
};

/**
 * Créer un nouveau topic
 * @param {Object} data - Données du topic
 * @returns {Promise<Object>}
 */
export const createTopic = async (data) => {
  return apiRequest('/forum/topics', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Mettre à jour un topic
 * @param {number} id - ID du topic
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateTopic = async (id, data) => {
  return apiRequest(`/forum/topics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Supprimer un topic
 * @param {number} id - ID du topic
 * @returns {Promise<Object>}
 */
export const deleteTopic = async (id) => {
  return apiRequest(`/forum/topics/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Épingler/Désépingler un topic (moderator)
 * @param {number} id - ID du topic
 * @param {boolean} isPinned - État épinglé
 * @returns {Promise<Object>}
 */
export const pinTopic = async (id, isPinned) => {
  return apiRequest(`/forum/topics/${id}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({ is_pinned: isPinned }),
  });
};

/**
 * Verrouiller/Déverrouiller un topic (moderator)
 * @param {number} id - ID du topic
 * @param {boolean} isLocked - État verrouillé
 * @returns {Promise<Object>}
 */
export const lockTopic = async (id, isLocked) => {
  return apiRequest(`/forum/topics/${id}/lock`, {
    method: 'PATCH',
    body: JSON.stringify({ is_locked: isLocked }),
  });
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
};
