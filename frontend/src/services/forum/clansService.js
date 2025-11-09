import api from './api';

/**
 * Service pour les clans du forum
 */

/**
 * Récupérer tous les clans
 */
export const getAllClans = async () => {
  return api.get('/forum/clans');
};

/**
 * Récupérer un clan par ID
 */
export const getClanById = async (id) => {
  return api.get(`/forum/clans/${id}`);
};

/**
 * Récupérer les clans d'une faction
 */
export const getClansByFaction = async (factionId) => {
  return api.get(`/forum/factions/${factionId}/clans`);
};

/**
 * Créer un nouveau clan (admin seulement)
 */
export const createClan = async (clanData) => {
  return api.post('/forum/clans', clanData);
};

/**
 * Mettre à jour un clan (admin seulement)
 */
export const updateClan = async (id, clanData) => {
  return api.put(`/forum/clans/${id}`, clanData);
};

/**
 * Supprimer un clan (admin seulement)
 */
export const deleteClan = async (id) => {
  return api.delete(`/forum/clans/${id}`);
};
