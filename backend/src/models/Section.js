const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parent_section_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = section de premier niveau
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
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'sections',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  indexes: [
    {
      name: 'idx_sections_category',
      fields: ['category_id']
    },
    {
      name: 'idx_sections_parent',
      fields: ['parent_section_id']
    },
    {
      name: 'idx_sections_faction',
      fields: ['faction_id']
    },
    {
      name: 'idx_sections_clan',
      fields: ['clan_id']
    },
    {
      name: 'idx_sections_pinned_order',
      fields: ['is_pinned', 'display_order']
    },
    {
      name: 'idx_sections_deleted',
      fields: ['deleted_at']
    }
  ]
});

module.exports = Section;
