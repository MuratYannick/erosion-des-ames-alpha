const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Faction = sequelize.define('Faction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ethnie_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = faction mixte
  },
  is_playable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  main_clan_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = pas de clan principal
  },
  leader_name: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'factions',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  indexes: [
    {
      name: 'idx_factions_ethnie',
      fields: ['ethnie_id']
    },
    {
      name: 'idx_factions_playable',
      fields: ['is_playable']
    },
    {
      name: 'idx_factions_deleted',
      fields: ['deleted_at']
    },
    {
      name: 'idx_factions_main_clan',
      fields: ['main_clan_id']
    }
  ]
});

module.exports = Faction;
