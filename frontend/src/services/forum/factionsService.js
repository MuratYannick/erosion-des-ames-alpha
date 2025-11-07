import api from './api';

/**
 * Service pour les factions du forum
 */

/**
 * Récupérer toutes les factions
 */
export const getAllFactions = async () => {
  const response = await api.get('/forum/factions');
  return response.data;
};

/**
 * Récupérer une faction par ID
 */
export const getFactionById = async (id) => {
  const response = await api.get(`/forum/factions/${id}`);
  return response.data;
};

/**
 * Créer une nouvelle faction (admin seulement)
 */
export const createFaction = async (factionData) => {
  const response = await api.post('/forum/factions', factionData);
  return response.data;
};

/**
 * Mettre à jour une faction (admin seulement)
 */
export const updateFaction = async (id, factionData) => {
  const response = await api.put(`/forum/factions/${id}`, factionData);
  return response.data;
};

/**
 * Supprimer une faction (admin seulement)
 */
export const deleteFaction = async (id) => {
  const response = await api.delete(`/forum/factions/${id}`);
  return response.data;
};
