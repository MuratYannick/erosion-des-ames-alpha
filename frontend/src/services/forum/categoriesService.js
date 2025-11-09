import api from './api';

/**
 * Service pour la gestion des catégories du forum
 */

/**
 * Récupérer toutes les catégories
 * @returns {Promise<Array>}
 */
export const getAllCategories = async () => {
  return api.get('/forum/categories');
};

/**
 * Récupérer une catégorie par ID
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object>}
 */
export const getCategoryById = async (id) => {
  return api.get(`/forum/categories/${id}`);
};

/**
 * Récupérer une catégorie par slug
 * @param {string} slug - Slug de la catégorie
 * @returns {Promise<Object>}
 */
export const getCategoryBySlug = async (slug) => {
  return api.get(`/forum/categories/slug/${slug}`);
};

/**
 * Créer une nouvelle catégorie (admin uniquement)
 * @param {Object} data - Données de la catégorie
 * @returns {Promise<Object>}
 */
export const createCategory = async (data) => {
  return api.post('/forum/categories', data);
};

/**
 * Mettre à jour une catégorie (admin uniquement)
 * @param {number} id - ID de la catégorie
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateCategory = async (id, data) => {
  return api.put(`/forum/categories/${id}`, data);
};

/**
 * Supprimer une catégorie (admin uniquement)
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object>}
 */
export const deleteCategory = async (id) => {
  return api.delete(`/forum/categories/${id}`);
};

export default {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
