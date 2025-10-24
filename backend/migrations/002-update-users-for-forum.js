'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Supprimer la contrainte UNIQUE sur email
    // Utiliser une requête SQL brute pour être sûr
    await queryInterface.sequelize.query('ALTER TABLE users DROP INDEX email');
    await queryInterface.sequelize.query('ALTER TABLE users DROP INDEX idx_email');

    // 2. Modifier last_login pour inclure l'heure (déjà DATE, donc OK)
    // 3. Modifier created_at pour inclure l'heure (déjà DATE, donc OK)
    // 4. Modifier updated_at pour inclure l'heure (déjà DATE, donc OK)

    // 5. Ajouter colonne email_verified
    await queryInterface.addColumn('users', 'email_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      after: 'email'
    });

    // 6. Ajouter colonne role
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'moderator', 'game-master', 'player'),
      defaultValue: 'player',
      allowNull: false,
      after: 'email_verified'
    });

    // 7. Ajouter colonne forum_rules_accepted
    await queryInterface.addColumn('users', 'forum_rules_accepted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      after: 'role'
    });

    // 8. Ajouter colonne forum_rules_accepted_at
    await queryInterface.addColumn('users', 'forum_rules_accepted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'forum_rules_accepted'
    });

    // 9. Ajouter colonne terms_accepted
    await queryInterface.addColumn('users', 'terms_accepted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      after: 'forum_rules_accepted_at'
    });

    // 10. Ajouter colonne terms_accepted_at
    await queryInterface.addColumn('users', 'terms_accepted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'terms_accepted'
    });

    // Ajouter index sur role pour optimiser les requêtes
    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_role'
    });
  },

  async down(queryInterface, Sequelize) {
    // Supprimer l'index sur role
    await queryInterface.removeIndex('users', 'idx_role');

    // Supprimer les colonnes dans l'ordre inverse
    await queryInterface.removeColumn('users', 'terms_accepted_at');
    await queryInterface.removeColumn('users', 'terms_accepted');
    await queryInterface.removeColumn('users', 'forum_rules_accepted_at');
    await queryInterface.removeColumn('users', 'forum_rules_accepted');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'email_verified');

    // Remettre la contrainte UNIQUE sur email
    await queryInterface.sequelize.query('ALTER TABLE users ADD UNIQUE INDEX email (email)');
    await queryInterface.sequelize.query('ALTER TABLE users ADD INDEX idx_email (email)');
  }
};
