import apiRequest from './api';

/**
 * Service pour la gestion des posts du forum
 */

/**
 * Récupérer tous les posts
 * @returns {Promise<Array>}
 */
export const getAllPosts = async () => {
  return apiRequest('/forum/posts');
};

/**
 * Récupérer un post par ID
 * @param {number} id - ID du post
 * @returns {Promise<Object>}
 */
export const getPostById = async (id) => {
  return apiRequest(`/forum/posts/${id}`);
};

/**
 * Récupérer les posts d'un topic
 * @param {number} topicId - ID du topic
 * @returns {Promise<Array>}
 */
export const getPostsByTopic = async (topicId) => {
  return apiRequest(`/forum/topics/${topicId}/posts`);
};

/**
 * Créer un nouveau post
 * @param {Object} data - Données du post
 * @returns {Promise<Object>}
 */
export const createPost = async (data) => {
  return apiRequest('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Mettre à jour un post
 * @param {number} id - ID du post
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updatePost = async (id, data) => {
  return apiRequest(`/forum/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Supprimer un post
 * @param {number} id - ID du post
 * @returns {Promise<Object>}
 */
export const deletePost = async (id) => {
  return apiRequest(`/forum/posts/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Verrouiller/Déverrouiller un post (moderator)
 * @param {number} id - ID du post
 * @param {boolean} isLocked - État verrouillé
 * @returns {Promise<Object>}
 */
export const lockPost = async (id, isLocked) => {
  return apiRequest(`/forum/posts/${id}/lock`, {
    method: 'PATCH',
    body: JSON.stringify({ is_locked: isLocked }),
  });
};

export default {
  getAllPosts,
  getPostById,
  getPostsByTopic,
  createPost,
  updatePost,
  deletePost,
  lockPost,
};
