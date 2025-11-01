'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ethnies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identifiant unique de l\'ethnie'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nom de l\'ethnie'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description de l\'ethnie'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date de création'
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        comment: 'Date de dernière modification'
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'Date de suppression (soft-delete)'
      }
    });

    // Index sur name pour recherches rapides
    await queryInterface.addIndex('ethnies', ['name'], {
      name: 'idx_ethnies_name',
      unique: true
    });

    // Index pour soft-delete
    await queryInterface.addIndex('ethnies', ['deleted_at'], {
      name: 'idx_ethnies_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ethnies');
  }
};
