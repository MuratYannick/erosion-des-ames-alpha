import api from './api';

/**
 * Service pour la gestion des sections du forum
 */

/**
 * Récupérer toutes les sections
 * @returns {Promise<Array>}
 */
export const getAllSections = async () => {
  return api.get('/forum/sections');
};

/**
 * Récupérer une section par ID
 * @param {number} id - ID de la section
 * @returns {Promise<Object>}
 */
export const getSectionById = async (id) => {
  return api.get(`/forum/sections/${id}`);
};

/**
 * Récupérer une section par slug
 * @param {string} slug - Slug de la section
 * @returns {Promise<Object>}
 */
export const getSectionBySlug = async (slug) => {
  return api.get(`/forum/sections/slug/${slug}`);
};

/**
 * Récupérer les sections d'une catégorie
 * @param {number} categoryId - ID de la catégorie
 * @returns {Promise<Array>}
 */
export const getSectionsByCategory = async (categoryId) => {
  return api.get(`/forum/categories/${categoryId}/sections`);
};

/**
 * Récupérer les sous-sections d'une section
 * @param {number} sectionId - ID de la section parente
 * @returns {Promise<Array>}
 */
export const getSubsections = async (sectionId) => {
  return api.get(`/forum/sections/${sectionId}/subsections`);
};

/**
 * Créer une nouvelle section (admin/moderator)
 * @param {Object} data - Données de la section
 * @returns {Promise<Object>}
 */
export const createSection = async (data) => {
  return api.post('/forum/sections', data);
};

/**
 * Mettre à jour une section (admin/moderator)
 * @param {number} id - ID de la section
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>}
 */
export const updateSection = async (id, data) => {
  return api.put(`/forum/sections/${id}`, data);
};

/**
 * Supprimer une section (admin/moderator)
 * @param {number} id - ID de la section
 * @returns {Promise<Object>}
 */
export const deleteSection = async (id) => {
  return api.delete(`/forum/sections/${id}`);
};

/**
 * Toggle l'épinglage d'une section
 * @param {number} id - ID de la section
 * @returns {Promise<Object>}
 */
export const togglePinSection = async (id) => {
  return api.patch(`/forum/sections/${id}/pin`);
};

/**
 * Toggle le verrouillage d'une section
 * @param {number} id - ID de la section
 * @returns {Promise<Object>}
 */
export const toggleLockSection = async (id) => {
  return api.patch(`/forum/sections/${id}/lock`);
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
  togglePinSection,
  toggleLockSection,
};
