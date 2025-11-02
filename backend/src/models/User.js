const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [5, 50]
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: false, // Email non unique pour permettre multicompte
    validate: {
      isEmail: true
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'moderator', 'game-master', 'player'),
    defaultValue: 'player',
    allowNull: false
  },
  forum_rules_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  forum_rules_accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  terms_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  terms_accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  indexes: [
    {
      name: 'idx_users_user_name',
      fields: ['user_name'],
      unique: true
    },
    {
      name: 'idx_users_email',
      fields: ['email']
    },
    {
      name: 'idx_users_role',
      fields: ['role']
    },
    {
      name: 'idx_users_deleted_at',
      fields: ['deleted_at']
    }
  ]
});

module.exports = User;
