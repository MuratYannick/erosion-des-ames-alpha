'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forum_permissions_view', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resource_type: {
        type: Sequelize.ENUM('category', 'section', 'topic'),
        allowNull: false,
        comment: 'Type de ressource concernée'
      },
      resource_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID de la ressource'
      },
      allowed_roles: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Liste des rôles autorisés (null = tous)'
      },
      require_terms_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'CGU acceptées requises'
      },
      require_forum_rules_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Règlement forum accepté requis'
      },
      require_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Email vérifié requis'
      },
      require_character: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Personnage requis'
      },
      require_character_alive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Personnage vivant requis'
      },
      require_character_is_leader: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Personnage leader requis'
      },
      required_faction_ids: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'IDs des factions autorisées (null = toutes)'
      },
      required_clan_ids: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'IDs des clans autorisés (null = tous)'
      },
      author_override: {
        type: Sequelize.ENUM('none', 'and', 'or'),
        defaultValue: 'none',
        allowNull: false,
        comment: 'Comportement pour l\'auteur: none=pas de privilège, and=conditions ET auteur, or=conditions OU auteur'
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Priorité d\'évaluation (plus haute = évaluée en premier)'
      },
      is_deny: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'true = règle de refus explicite'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index pour recherche rapide par ressource
    await queryInterface.addIndex('forum_permissions_view', ['resource_type', 'resource_id'], {
      name: 'idx_fpv_resource'
    });

    // Index pour priorité
    await queryInterface.addIndex('forum_permissions_view', ['priority'], {
      name: 'idx_fpv_priority'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forum_permissions_view');
  }
};
