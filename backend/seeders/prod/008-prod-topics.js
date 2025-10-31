'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('topics', [
      // Topic 1: Message de bienvenue dans "Annonces"
      {
        id: 1,
        title: 'Bienvenue sur Érosion des Âmes !',
        section_id: 1, // Section "Annonces"
        author_user_id: 1, // Premier utilisateur (admin)
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topic 2: Règlement du Forum dans "Règlement et CGU"
      {
        id: 2,
        title: 'Règlement du Forum',
        section_id: 2, // Section "Règlement et CGU"
        author_user_id: 1,
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: true,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topic 3: CGU dans "Règlement et CGU"
      {
        id: 3,
        title: 'CGU',
        section_id: 2, // Section "Règlement et CGU"
        author_user_id: 1,
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 2,
        is_pinned: true,
        is_locked: true,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topic 4: Présentation dans "Campement de Réfugiés"
      {
        id: 4,
        title: 'Hey toi!! Qui es-tu ?',
        section_id: 4, // Section "Campement de Réfugiés"
        author_user_id: 1,
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        views_count: 0,
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
