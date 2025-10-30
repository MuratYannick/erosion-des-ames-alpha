'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = PNJ (non joueur)
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ethnie_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // obligatoire
        references: {
          model: 'ethnies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // ne pas supprimer une ethnie si des personnages l'utilisent
      },
      faction_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = pas de faction
        references: {
          model: 'factions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      clan_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = pas de clan
        references: {
          model: 'clans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_dead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Index sur user_id pour récupérer tous les personnages d'un user
    await queryInterface.addIndex('characters', ['user_id'], {
      name: 'idx_characters_user'
    });

    // Index sur ethnie_id pour jointures rapides
    await queryInterface.addIndex('characters', ['ethnie_id'], {
      name: 'idx_characters_ethnie'
    });

    // Index sur faction_id pour jointures rapides
    await queryInterface.addIndex('characters', ['faction_id'], {
      name: 'idx_characters_faction'
    });

    // Index sur clan_id pour jointures rapides
    await queryInterface.addIndex('characters', ['clan_id'], {
      name: 'idx_characters_clan'
    });

    // Index sur is_dead pour filtrer les personnages vivants/morts
    await queryInterface.addIndex('characters', ['is_dead'], {
      name: 'idx_characters_dead'
    });

    // Index sur deleted_at pour soft-delete
    await queryInterface.addIndex('characters', ['deleted_at'], {
      name: 'idx_characters_deleted'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('characters');
  }
};
