const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Clan = sequelize.define('Clan', {
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
  faction_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = clan neutre
  },
  ethnie_id: {
    type: DataTypes.INTEGER,
    allowNull: true // null = clan mixte
  },
  is_playable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  is_leader: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
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
  tableName: 'clans',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  indexes: [
    {
      name: 'idx_clans_faction',
      fields: ['faction_id']
    },
    {
      name: 'idx_clans_ethnie',
      fields: ['ethnie_id']
    },
    {
      name: 'idx_clans_playable',
      fields: ['is_playable']
    },
    {
      name: 'idx_clans_deleted',
      fields: ['deleted_at']
    }
  ]
});

module.exports = Clan;
