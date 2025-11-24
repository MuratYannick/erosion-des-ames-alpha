'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER'),
        allowNull: false,
        defaultValue: 'PLAYER',
      },
      cguAccepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cguAcceptedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      forumRulesAccepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      forumRulesAcceptedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      isBlocked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      blockedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });

    // Index unique sur username (seulement pour les comptes non supprimés)
    await queryInterface.addIndex('users', ['username'], {
      unique: true,
      where: { deletedAt: null },
      name: 'unique_username_active',
    });

    // Index unique sur email (seulement pour les comptes non supprimés)
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      where: { deletedAt: null },
      name: 'unique_email_active',
    });

    // Index sur role pour les requêtes de filtrage
    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role',
    });

    // Index sur isBlocked pour les requêtes de modération
    await queryInterface.addIndex('users', ['isBlocked'], {
      name: 'idx_users_blocked',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
