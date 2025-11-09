import api from './api';

/**
 * Service pour les factions du forum
 */

/**
 * Récupérer toutes les factions
 */
export const getAllFactions = async () => {
  return api.get('/forum/factions');
};

/**
 * Récupérer une faction par ID
 */
export const getFactionById = async (id) => {
  return api.get(`/forum/factions/${id}`);
};

/**
 * Créer une nouvelle faction (admin seulement)
 */
export const createFaction = async (factionData) => {
  return api.post('/forum/factions', factionData);
};

/**
 * Mettre à jour une faction (admin seulement)
 */
export const updateFaction = async (id, factionData) => {
  return api.put(`/forum/factions/${id}`, factionData);
};

/**
 * Supprimer une faction (admin seulement)
 */
export const deleteFaction = async (id) => {
  return api.delete(`/forum/factions/${id}`);
};
