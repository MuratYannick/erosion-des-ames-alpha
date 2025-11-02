'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      topic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topics',
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

    // Index sur topic_id pour récupérer tous les posts d'un topic
    await queryInterface.addIndex('posts', ['topic_id'], {
      name: 'idx_posts_topic'
    });

    // Index sur author_user_id pour récupérer tous les posts d'un user
    await queryInterface.addIndex('posts', ['author_user_id'], {
      name: 'idx_posts_author_user'
    });

    // Index sur author_character_id pour récupérer tous les posts d'un character
    await queryInterface.addIndex('posts', ['author_character_id'], {
      name: 'idx_posts_author_character'
    });

    // Index sur deleted_at pour soft-delete
    await queryInterface.addIndex('posts', ['deleted_at'], {
      name: 'idx_posts_deleted'
    });

    // Index composé pour trier les posts par date de création dans un topic
    await queryInterface.addIndex('posts', ['topic_id', 'created_at'], {
      name: 'idx_posts_topic_created'
    });

    // Note: La contrainte CHECK pour author_user_id XOR author_character_id
    // sera gérée au niveau de l'application (Sequelize model validation)
    // car MySQL ne permet pas les CHECK sur les colonnes avec FK
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
