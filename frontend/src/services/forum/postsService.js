import api from './api';

/**
 * Service pour la gestion des posts du forum
 */

/**
 * Récupérer tous les posts
 * @returns {Promise<Array>}
 */
export const getAllPosts = async () => {
  return api.get('/forum/posts');
};

/**
 * Récupérer un post par ID
 * @param {number} id - ID du post
 * @returns {Promise<Object>}
 */
export const getPostById = async (id) => {
  return api.get(`/forum/posts/${id}`);
};

/**
 * Récupérer les posts d'un topic
 * @param {number} topicId - ID du topic
 * @returns {Promise<Array>}
 */
export const getPostsByTopic = async (topicId) => {
  return api.get(`/forum/topics/${topicId}/posts`);
};

/**
 * Créer un nouveau post
 * @param {Object} data - Données du post
 * @returns {Promise<Object>}
 */
export const createPost = async (data) => {
  return api.post('/forum/posts', data);
};

/**
 * Mettre à jour un post
 * @param {number} id - ID du post
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updatePost = async (id, data) => {
  return api.put(`/forum/posts/${id}`, data);
};

/**
 * Supprimer un post
 * @param {number} id - ID du post
 * @returns {Promise<Object>}
 */
export const deletePost = async (id) => {
  return api.delete(`/forum/posts/${id}`);
};

/**
 * Verrouiller/Déverrouiller un post (moderator)
 * @param {number} id - ID du post
 * @param {boolean} isLocked - État verrouillé
 * @returns {Promise<Object>}
 */
export const lockPost = async (id, isLocked) => {
  return api.patch(`/forum/posts/${id}/lock`, { is_locked: isLocked });
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
