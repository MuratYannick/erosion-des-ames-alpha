import apiRequest from './api';

/**
 * Service pour la gestion des sections du forum
 */

/**
 * Récupérer toutes les sections
 * @returns {Promise<Array>}
 */
export const getAllSections = async () => {
  return apiRequest('/forum/sections');
};

/**
 * Récupérer une section par ID
 * @param {number} id - ID de la section
 * @returns {Promise<Object>}
 */
export const getSectionById = async (id) => {
  return apiRequest(`/forum/sections/${id}`);
};

/**
 * Récupérer une section par slug
 * @param {string} slug - Slug de la section
 * @returns {Promise<Object>}
 */
export const getSectionBySlug = async (slug) => {
  return apiRequest(`/forum/sections/slug/${slug}`);
};

/**
 * Récupérer les sections d'une catégorie
 * @param {number} categoryId - ID de la catégorie
 * @returns {Promise<Array>}
 */
export const getSectionsByCategory = async (categoryId) => {
  return apiRequest(`/forum/categories/${categoryId}/sections`);
};

/**
 * Récupérer les sous-sections d'une section
 * @param {number} sectionId - ID de la section parente
 * @returns {Promise<Array>}
 */
export const getSubsections = async (sectionId) => {
  return apiRequest(`/forum/sections/${sectionId}/subsections`);
};

/**
 * Créer une nouvelle section (admin/moderator)
 * @param {Object} data - Données de la section
 * @returns {Promise<Object>}
 */
export const createSection = async (data) => {
  return apiRequest('/forum/sections', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Mettre à jour une section (admin/moderator)
 * @param {number} id - ID de la section
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateSection = async (id, data) => {
  return apiRequest(`/forum/sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Supprimer une section (admin/moderator)
 * @param {number} id - ID de la section
 * @returns {Promise<Object>}
 */
export const deleteSection = async (id) => {
  return apiRequest(`/forum/sections/${id}`, {
    method: 'DELETE',
  });
};

export default {
  getAllSections,
  getSectionById,
  getSectionBySlug,
  getSectionsByCategory,
  getSubsections,
  createSection,
  updateSection,
  deleteSection,
};
