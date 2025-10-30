const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Character = sequelize.define('Character', {
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = PNJ (non joueur)
  },
  ethnie_id: {
    type: DataTypes.INTEGER,
    allowNull: false // obligatoire
  },
  faction_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = pas de faction
  },
  clan_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = pas de clan
  },
  is_dead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'characters',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  indexes: [
    {
      name: 'idx_characters_user',
      fields: ['user_id']
    },
    {
      name: 'idx_characters_ethnie',
      fields: ['ethnie_id']
    },
    {
      name: 'idx_characters_faction',
      fields: ['faction_id']
    },
    {
      name: 'idx_characters_clan',
      fields: ['clan_id']
    },
    {
      name: 'idx_characters_dead',
      fields: ['is_dead']
    },
    {
      name: 'idx_characters_deleted',
      fields: ['deleted_at']
    }
  ]
});

module.exports = Character;
