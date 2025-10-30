const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ethnie = sequelize.define('Ethnie', {
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
  }
}, {
  tableName: 'ethnies',
  timestamps: false, // Pas de timestamps pour cette table de référence
  underscored: true,
  indexes: [
    {
      name: 'idx_ethnies_name',
      fields: ['name']
    }
  ]
});

module.exports = Ethnie;
