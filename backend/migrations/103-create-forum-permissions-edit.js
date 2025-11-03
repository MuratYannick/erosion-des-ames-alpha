'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forum_permissions_edit', {
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
        allowNull: false
      },
      require_forum_rules_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      require_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      require_character: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      require_character_alive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      require_character_is_leader: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      required_faction_ids: {
        type: Sequelize.JSON,
        allowNull: true
      },
      required_clan_ids: {
        type: Sequelize.JSON,
        allowNull: true
      },
      author_override: {
        type: Sequelize.ENUM('none', 'and', 'or'),
        defaultValue: 'none',
        allowNull: false,
        comment: 'Permet à l\'auteur d\'éditer/supprimer'
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      is_deny: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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

    await queryInterface.addIndex('forum_permissions_edit', ['resource_type', 'resource_id'], {
      name: 'idx_fpe_resource'
    });

    await queryInterface.addIndex('forum_permissions_edit', ['priority'], {
      name: 'idx_fpe_priority'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forum_permissions_edit');
  }
};
