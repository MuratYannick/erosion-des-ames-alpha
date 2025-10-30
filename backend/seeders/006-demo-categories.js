'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Annonces Officielles',
        description: 'Annonces importantes de l\'équipe de modération et des game masters.',
        display_order: 1,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 2,
        name: 'Taverne du Voyageur',
        description: 'Discussions hors-jeu, présentations et discussions générales.',
        display_order: 2,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'Le Monde d\'Érosion des Âmes',
        description: 'Discussions sur l\'univers, le lore et l\'histoire du jeu.',
        display_order: 3,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 4,
        name: 'Roleplay In-Game',
        description: 'Sections dédiées au jeu de rôle pour chaque faction et clan.',
        display_order: 4,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 5,
        name: 'Support & Aide',
        description: 'Besoin d\'aide ? Questions techniques ou sur le jeu.',
        display_order: 5,
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
