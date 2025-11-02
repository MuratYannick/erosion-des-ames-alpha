'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('factions', {
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
      },
      ethnie_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = faction mixte
        references: {
          model: 'ethnies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_playable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Indique si la faction est jouable'
      },
      leader_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
        comment: 'Nom du leader de la faction (conservé pour l\'historique)'
      },
      outpost_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
        comment: 'Nom de l\'avant-poste principal de la faction'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date de création'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
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

    // Index sur ethnie_id pour jointures rapides
    await queryInterface.addIndex('factions', ['ethnie_id'], {
      name: 'idx_factions_ethnie'
    });

    // Index sur is_playable pour filtrer les factions jouables
    await queryInterface.addIndex('factions', ['is_playable'], {
      name: 'idx_factions_playable'
    });

    // Index sur deleted_at pour soft-delete
    await queryInterface.addIndex('factions', ['deleted_at'], {
      name: 'idx_factions_deleted'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('factions');
  }
};
