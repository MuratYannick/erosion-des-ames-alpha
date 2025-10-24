const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: false, // Modifié : email non unique (certains utilisateurs peuvent avoir 2 comptes)
    validate: {
      isEmail: true
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_username',
      fields: ['username']
    },
    {
      name: 'idx_email',
      fields: ['email']
    },
    {
      name: 'idx_role',
      fields: ['role']
    }
  ]
});

module.exports = User;
