'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sections', {
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
      slug: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        comment: 'URL-friendly identifier for section'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      parent_section_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // null = section de premier niveau
        references: {
          model: 'sections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Index sur category_id pour récupérer toutes les sections d'une catégorie
    await queryInterface.addIndex('sections', ['category_id'], {
      name: 'idx_sections_category'
    });

    // Index sur parent_section_id pour récupérer les sous-sections
    await queryInterface.addIndex('sections', ['parent_section_id'], {
      name: 'idx_sections_parent'
    });

    // Index sur faction_id pour jointures rapides
    await queryInterface.addIndex('sections', ['faction_id'], {
      name: 'idx_sections_faction'
    });

    // Index sur clan_id pour jointures rapides
    await queryInterface.addIndex('sections', ['clan_id'], {
      name: 'idx_sections_clan'
    });

    // Index composé pour trier les sections (pinned first, puis par ordre)
    await queryInterface.addIndex('sections', ['is_pinned', 'display_order'], {
      name: 'idx_sections_pinned_order'
    });

    // Index sur deleted_at pour soft-delete
    await queryInterface.addIndex('sections', ['deleted_at'], {
      name: 'idx_sections_deleted'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sections');
  }
};
