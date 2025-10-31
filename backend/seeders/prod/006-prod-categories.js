'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Forum Général',
        description: 'Tout ce qui concerne le fonctionnement du site : annonces, présentation, règlement et CGU, FAQ, etc.',
        display_order: 1,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 2,
        name: 'Forum HRP (Hors Role-Play)',
        description: 'Discussions autour du jeu mais aussi sur un peu tout et n\'importe quoi : centres d\'intérêts, cinéma, musique, blagues, etc.',
        display_order: 2,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'Forum RP (Role-Play)',
        description: 'Tout ce qui se passe dans le jeu : récits des personnages, annonces de contrat, etc.',
        display_order: 3,
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
