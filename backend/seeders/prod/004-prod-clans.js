'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('clans', [
      {
        id: 1,
        name: 'Les Chevaliers de l\'Aube',
        description: 'Ordre de chevaliers d\'élite au service du Royaume de Lumière.',
        faction_id: 1, // Royaume de Lumière
        ethnie_id: 1, // Clan exclusif aux Humains
        is_playable: true,
        leader_character_id: null, // Sera rempli après création des personnages
        leader_name: 'Commandant Marcus',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 2,
        name: 'Les Mages de l\'Arcane',
        description: 'Confrérie de mages étudiant les arts arcaniques.',
        faction_id: 1, // Royaume de Lumière
        ethnie_id: null, // Clan mixte
        is_playable: true,
        leader_character_id: null,
        leader_name: 'Archimage Theron',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'Les Assassins Silencieux',
        description: 'Organisation secrète d\'assassins au service de la Confrérie des Ombres.',
        faction_id: 2, // Confrérie des Ombres
        ethnie_id: null, // Clan mixte
        is_playable: true,
        leader_character_id: null,
        leader_name: 'Lame Noire',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 4,
        name: 'La Tribu du Crâne Brisé',
        description: 'Tribu orc la plus puissante de la Horde Sauvage.',
        faction_id: 3, // Horde Sauvage
        ethnie_id: 4, // Clan exclusif aux Orcs
        is_playable: true,
        leader_character_id: null,
        leader_name: 'Chef Throk',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 5,
        name: 'Les Gardes-Feuilles',
        description: 'Rangers elfiques protégeant les frontières de la forêt.',
        faction_id: 4, // Gardiens de la Forêt
        ethnie_id: 2, // Clan exclusif aux Elfes
        is_playable: true,
        leader_character_id: null,
        leader_name: 'Rôdeur Aelrindel',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 6,
        name: 'Les Forgerons de Pierre',
        description: 'Guilde de forgerons nains indépendants.',
        faction_id: null, // Clan neutre
        ethnie_id: 3, // Clan exclusif aux Nains
        is_playable: true,
        leader_character_id: null,
        leader_name: 'Maître Forgeron Durin',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clans', null, {});
  }
};
