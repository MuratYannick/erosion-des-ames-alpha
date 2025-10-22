'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hasher les mots de passe
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password456', 10);
    const password3 = await bcrypt.hash('password789', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@erosion-des-ames.com',
        password_hash: password1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: password2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'player1',
        email: 'player1@example.com',
        password_hash: password3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
