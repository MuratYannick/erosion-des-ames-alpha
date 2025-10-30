'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ethnies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });

    // Index sur name pour recherches rapides
    await queryInterface.addIndex('ethnies', ['name'], {
      name: 'idx_ethnies_name'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ethnies');
  }
};
