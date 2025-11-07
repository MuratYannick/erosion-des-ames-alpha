import api from './api';

/**
 * Service pour les clans du forum
 */

/**
 * Récupérer tous les clans
 */
export const getAllClans = async () => {
  const response = await api.get('/forum/clans');
  return response.data;
};

/**
 * Récupérer un clan par ID
 */
export const getClanById = async (id) => {
  const response = await api.get(`/forum/clans/${id}`);
  return response.data;
};

/**
 * Récupérer les clans d'une faction
 */
export const getClansByFaction = async (factionId) => {
  const response = await api.get(`/forum/factions/${factionId}/clans`);
  return response.data;
};

/**
 * Créer un nouveau clan (admin seulement)
 */
export const createClan = async (clanData) => {
  const response = await api.post('/forum/clans', clanData);
  return response.data;
};

/**
 * Mettre à jour un clan (admin seulement)
 */
export const updateClan = async (id, clanData) => {
  const response = await api.put(`/forum/clans/${id}`, clanData);
  return response.data;
};

/**
 * Supprimer un clan (admin seulement)
 */
export const deleteClan = async (id) => {
  const response = await api.delete(`/forum/clans/${id}`);
  return response.data;
};
