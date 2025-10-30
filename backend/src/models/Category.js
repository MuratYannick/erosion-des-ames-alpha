const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
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
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // Active le soft-delete
  deletedAt: 'deleted_at',
  indexes: [
    {
      name: 'idx_categories_order',
      fields: ['display_order']
    },
    {
      name: 'idx_categories_deleted',
      fields: ['deleted_at']
    }
  ]
});

module.exports = Category;
