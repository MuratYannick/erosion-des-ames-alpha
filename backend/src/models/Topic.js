const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  slug: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 250],
      is: /^[a-z0-9-]+$/i // Alphanumeric + hyphens only
    }
  },
  section_id: {
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
  faction_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = pas d'affiliation
  },
  clan_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = pas d'affiliation
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  is_locked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'topics',
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
        throw new Error('Un topic ne peut avoir qu\'un seul type d\'auteur (user OU character, pas les deux)');
      }

      if (!hasUser && !hasCharacter) {
        throw new Error('Un topic doit avoir un auteur (user ou character)');
      }
    }
  },
  indexes: [
    {
      name: 'idx_topics_section',
      fields: ['section_id']
    },
    {
      name: 'idx_topics_author_user',
      fields: ['author_user_id']
    },
    {
      name: 'idx_topics_author_character',
      fields: ['author_character_id']
    },
    {
      name: 'idx_topics_faction',
      fields: ['faction_id']
    },
    {
      name: 'idx_topics_clan',
      fields: ['clan_id']
    },
    {
      name: 'idx_topics_pinned_order',
      fields: ['is_pinned', 'display_order']
    },
    {
      name: 'idx_topics_deleted',
      fields: ['deleted_at']
    }
  ]
});

module.exports = Topic;
