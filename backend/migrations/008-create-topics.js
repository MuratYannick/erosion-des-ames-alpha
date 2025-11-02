'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('topics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(250),
        allowNull: false,
        unique: true,
        comment: 'URL-friendly identifier for topic'
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      author_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null si c'est un character qui est l'auteur
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      author_character_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null si c'est un user qui est l'auteur
        references: {
          model: 'characters',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      author_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Nom de l\'auteur conservé même après suppression'
      },
      faction_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = pas d'affiliation à une faction
        references: {
          model: 'factions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      clan_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = pas d'affiliation à un clan
        references: {
          model: 'clans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'False = restreint au clan/faction affilié'
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Numéro d\'ordre d\'importance'
      },
      is_pinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      views_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
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

    // Index sur section_id pour récupérer tous les topics d'une section
    await queryInterface.addIndex('topics', ['section_id'], {
      name: 'idx_topics_section'
    });

    // Index sur author_user_id pour récupérer tous les topics d'un user
    await queryInterface.addIndex('topics', ['author_user_id'], {
      name: 'idx_topics_author_user'
    });

    // Index sur author_character_id pour récupérer tous les topics d'un character
    await queryInterface.addIndex('topics', ['author_character_id'], {
      name: 'idx_topics_author_character'
    });

    // Index sur faction_id pour jointures rapides
    await queryInterface.addIndex('topics', ['faction_id'], {
      name: 'idx_topics_faction'
    });

    // Index sur clan_id pour jointures rapides
    await queryInterface.addIndex('topics', ['clan_id'], {
      name: 'idx_topics_clan'
    });

    // Index composé pour trier les topics (pinned first, puis par ordre)
    await queryInterface.addIndex('topics', ['is_pinned', 'display_order'], {
      name: 'idx_topics_pinned_order'
    });

    // Index sur deleted_at pour soft-delete
    await queryInterface.addIndex('topics', ['deleted_at'], {
      name: 'idx_topics_deleted'
    });

    // Note: La contrainte CHECK pour author_user_id XOR author_character_id
    // sera gérée au niveau de l'application (Sequelize model validation)
    // car MySQL ne permet pas les CHECK sur les colonnes avec FK
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('topics');
  }
};
