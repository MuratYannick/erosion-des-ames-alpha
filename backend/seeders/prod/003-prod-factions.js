'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('factions', [
      {
        id: 1,
        name: 'Le Royaume de Lumière',
        description: 'Alliance des peuples civilisés luttant contre les ténèbres.',
        ethnie_id: null, // Faction mixte
        is_playable: true,
        main_clan_id: null, // Sera rempli après création des clans
        leader_name: 'Roi Aldric',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 2,
        name: 'La Confrérie des Ombres',
        description: 'Organisation secrète manipulant les pouvoirs interdits.',
        ethnie_id: null, // Faction mixte
        is_playable: true,
        main_clan_id: null,
        leader_name: 'Maître des Ombres',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'La Horde Sauvage',
        description: 'Union des tribus orcs conquérant les terres par la force.',
        ethnie_id: 4, // Faction exclusive aux Orcs
        is_playable: true,
        main_clan_id: null,
        leader_name: 'Chef de Guerre Grom',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 4,
        name: 'Les Gardiens de la Forêt',
        description: 'Elfes protecteurs des forêts anciennes et de la nature.',
        ethnie_id: 2, // Faction exclusive aux Elfes
        is_playable: true,
        main_clan_id: null,
        leader_name: 'Dame Sylvana',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 5,
        name: 'La Légion Infernale',
        description: 'Armée démoniaque cherchant à envahir le monde mortel.',
        ethnie_id: 5, // Faction exclusive aux Démons
        is_playable: false, // Non jouable (PNJ uniquement)
        main_clan_id: null,
        leader_name: 'Seigneur Démon Azrael',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('factions', null, {});
  }
};
