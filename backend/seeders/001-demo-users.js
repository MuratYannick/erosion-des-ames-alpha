'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hasher les mots de passe
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password456', 10);
    const password3 = await bcrypt.hash('password789', 10);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        email: 'admin@erosion-des-ames.com',
        password_hash: password1,
        is_active: true,
        email_verified: true,
        role: 'admin',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: password2,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: now,
        terms_accepted: true,
        terms_accepted_at: now,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        username: 'player1',
        email: 'player1@example.com',
        password_hash: password3,
        is_active: true,
        email_verified: false,
        role: 'player',
        forum_rules_accepted: false,
        forum_rules_accepted_at: null,
        terms_accepted: true,
        terms_accepted_at: now,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
