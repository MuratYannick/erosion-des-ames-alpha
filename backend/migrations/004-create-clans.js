'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clans', {
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
      faction_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = clan neutre
        references: {
          model: 'factions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ethnie_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = clan mixte
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
        comment: 'Indique si le clan est jouable'
      },
      is_leader: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indique si le clan est le clan leader de sa faction'
      },
      leader_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
        comment: 'Nom du leader du clan (conservé pour l\'historique)'
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

    // Index sur faction_id pour jointures rapides
    await queryInterface.addIndex('clans', ['faction_id'], {
      name: 'idx_clans_faction'
    });

    // Index sur ethnie_id pour jointures rapides
    await queryInterface.addIndex('clans', ['ethnie_id'], {
      name: 'idx_clans_ethnie'
    });

    // Index sur is_playable pour filtrer les clans jouables
    await queryInterface.addIndex('clans', ['is_playable'], {
      name: 'idx_clans_playable'
    });

    // Index sur deleted_at pour soft-delete
    await queryInterface.addIndex('clans', ['deleted_at'], {
      name: 'idx_clans_deleted'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clans');
  }
};
