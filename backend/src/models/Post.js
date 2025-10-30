const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  author_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null si c'est un character qui est l'auteur
  },
  author_character_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null si c'est un user qui est l'auteur
  },
  author_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  is_locked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  validate: {
    // Validation XOR : soit author_user_id, soit author_character_id (pas les deux, pas aucun)
    authorXor() {
      const hasUser = this.author_user_id !== null && this.author_user_id !== undefined;
      const hasCharacter = this.author_character_id !== null && this.author_character_id !== undefined;

      if (hasUser && hasCharacter) {
        throw new Error('Un post ne peut avoir qu\'un seul type d\'auteur (user OU character, pas les deux)');
      }

      if (!hasUser && !hasCharacter) {
        throw new Error('Un post doit avoir un auteur (user ou character)');
      }
    }
  },
  indexes: [
    {
      name: 'idx_posts_topic',
      fields: ['topic_id']
    },
    {
      name: 'idx_posts_author_user',
      fields: ['author_user_id']
    },
    {
      name: 'idx_posts_author_character',
      fields: ['author_character_id']
    },
    {
      name: 'idx_posts_deleted',
      fields: ['deleted_at']
    },
    {
      name: 'idx_posts_topic_created',
      fields: ['topic_id', 'created_at']
    }
  ]
});

module.exports = Post;
