'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('topics', [
      // Topics par des users
      {
        id: 1,
        title: 'Bienvenue sur Érosion des Âmes !',
        section_id: 1, // Annonces du Staff
        author_user_id: 1, // admin
        author_character_id: null,
        author_name: 'admin',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: true, // Verrouillé car c'est une annonce
        views_count: 42,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
        deleted_at: null
      },
      {
        id: 2,
        title: 'Présentation de Testuser',
        section_id: 3, // Présentations
        author_user_id: 2, // testuser
        author_character_id: null,
        author_name: 'testuser',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 15,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      {
        id: 3,
        title: 'Question sur les mécaniques de jeu',
        section_id: 10, // Questions Techniques
        author_user_id: 3, // player1
        author_character_id: null,
        author_name: 'player1',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 8,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topics par des characters (RP)
      {
        id: 4,
        title: '[RP] Réunion du conseil du Royaume',
        section_id: 6, // Le Royaume de Lumière
        author_user_id: null,
        author_character_id: 1, // Arathorn le Preux
        author_name: 'Arathorn le Preux',
        faction_id: 1, // Royaume de Lumière
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 23,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      {
        id: 5,
        title: '[RP] Entraînement des recrues',
        section_id: 7, // Quartier des Chevaliers (privé)
        author_user_id: null,
        author_character_id: 8, // Marcus le Commandant
        author_name: 'Marcus le Commandant',
        faction_id: 1,
        clan_id: 1, // Chevaliers de l'Aube
        is_public: false, // Restreint au clan
        display_order: 0,
        is_pinned: true, // Épinglé dans la section
        is_locked: false,
        views_count: 12,
        created_at: twoDaysAgo,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 6,
        title: '[RP] La chasse dans la forêt ancienne',
        section_id: 6, // Le Royaume de Lumière
        author_user_id: null,
        author_character_id: 2, // Elendil le Sage
        author_name: 'Elendil le Sage',
        faction_id: 4, // Gardiens de la Forêt
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 18,
        created_at: oneHourAgo,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 7,
        title: '[RP] Raid sur le village humain',
        section_id: 9, // Campement du Crâne Brisé (privé)
        author_user_id: null,
        author_character_id: 6, // Grom le Destructeur
        author_name: 'Grom le Destructeur',
        faction_id: 3, // Horde Sauvage
        clan_id: 4, // Tribu du Crâne Brisé
        is_public: false, // Restreint au clan
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 9,
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('topics', null, {});
  }
};
