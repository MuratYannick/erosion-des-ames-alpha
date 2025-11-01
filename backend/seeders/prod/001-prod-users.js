'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Utilisateur admin temporaire pour les contenus initiaux
    // ATTENTION : Cet utilisateur sera supprimé en hard-delete par le seeder final (010-prod-cleanup.js)
    const password = await bcrypt.hash('123456', 10);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        user_name: 'l\'équipe de développement',
        email: 'dev@erosion-des-ames.com',
        password_hash: password,
        is_active: true,
        email_verified: true,
        role: 'admin',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { id: 1 }, {});
  }
};
