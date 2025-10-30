'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Seeder vide - tous les clans sont déjà en production
    // Pas besoin de données supplémentaires pour le développement
  },

  async down(queryInterface, Sequelize) {
    // Rien à supprimer
  }
};
