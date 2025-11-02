'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'Identifiant unique de l\'utilisateur'
      },
      user_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nom d\'utilisateur (5-50 caractères)'
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hash du mot de passe'
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Email (non unique pour permettre multicompte)'
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indique si l\'email a été vérifié'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Indique si le compte est actif'
      },
      role: {
        type: Sequelize.ENUM('admin', 'moderator', 'game-master', 'player'),
        allowNull: false,
        defaultValue: 'player',
        comment: 'Rôle de l\'utilisateur sur le forum'
      },
      forum_rules_accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indique si l\'utilisateur a accepté les règles du forum'
      },
      forum_rules_accepted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'Date d\'acceptation des règles du forum'
      },
      terms_accepted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indique si l\'utilisateur a accepté les CGU'
      },
      terms_accepted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'Date d\'acceptation des CGU'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Date de création du compte'
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

    // Ajouter les index
    await queryInterface.addIndex('users', ['user_name'], {
      name: 'idx_users_user_name',
      unique: true
    });

    await queryInterface.addIndex('users', ['email'], {
      name: 'idx_users_email'
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role'
    });

    await queryInterface.addIndex('users', ['deleted_at'], {
      name: 'idx_users_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
