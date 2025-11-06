import apiRequest from './api';

/**
 * Service pour la gestion des catégories du forum
 */

/**
 * Récupérer toutes les catégories
 * @returns {Promise<Array>}
 */
export const getAllCategories = async () => {
  return apiRequest('/forum/categories');
};

/**
 * Récupérer une catégorie par ID
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object>}
 */
export const getCategoryById = async (id) => {
  return apiRequest(`/forum/categories/${id}`);
};

/**
 * Récupérer une catégorie par slug
 * @param {string} slug - Slug de la catégorie
 * @returns {Promise<Object>}
 */
export const getCategoryBySlug = async (slug) => {
  return apiRequest(`/forum/categories/slug/${slug}`);
};

/**
 * Créer une nouvelle catégorie (admin uniquement)
 * @param {Object} data - Données de la catégorie
 * @returns {Promise<Object>}
 */
export const createCategory = async (data) => {
  return apiRequest('/forum/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Mettre à jour une catégorie (admin uniquement)
 * @param {number} id - ID de la catégorie
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateCategory = async (id, data) => {
  return apiRequest(`/forum/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Supprimer une catégorie (admin uniquement)
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object>}
 */
export const deleteCategory = async (id) => {
  return apiRequest(`/forum/categories/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
