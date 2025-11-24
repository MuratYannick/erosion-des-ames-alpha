'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajouter les champs pour la vérification d'email
    await queryInterface.addColumn('users', 'verificationToken', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('users', 'verificationTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Ajouter les champs pour la réinitialisation de mot de passe
    await queryInterface.addColumn('users', 'resetPasswordToken', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });

    // Index sur verificationToken pour les recherches rapides
    await queryInterface.addIndex('users', ['verificationToken'], {
      name: 'idx_users_verification_token',
    });

    // Index sur resetPasswordToken pour les recherches rapides
    await queryInterface.addIndex('users', ['resetPasswordToken'], {
      name: 'idx_users_reset_password_token',
    });
  },

  async down(queryInterface) {
    // Supprimer les index
    await queryInterface.removeIndex('users', 'idx_users_verification_token');
    await queryInterface.removeIndex('users', 'idx_users_reset_password_token');

    // Supprimer les colonnes
    await queryInterface.removeColumn('users', 'verificationToken');
    await queryInterface.removeColumn('users', 'verificationTokenExpires');
    await queryInterface.removeColumn('users', 'resetPasswordToken');
    await queryInterface.removeColumn('users', 'resetPasswordExpires');
  },
};
