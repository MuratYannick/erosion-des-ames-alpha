'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'JWT refresh token pour renouveler l\'access token'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'refresh_token');
  }
};
