'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ForumPermissionCreateSection extends Model {
    static associate(models) {
      // Pas d'association directe
    }
  }

  ForumPermissionCreateSection.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resource_type: {
      type: DataTypes.ENUM('category', 'section'),
      allowNull: false
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    allowed_roles: {
      type: DataTypes.JSON,
      allowNull: true
    },
    require_terms_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    require_forum_rules_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    require_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    require_character: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    require_character_alive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    require_character_is_leader: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    required_faction_ids: {
      type: DataTypes.JSON,
      allowNull: true
    },
    required_clan_ids: {
      type: DataTypes.JSON,
      allowNull: true
    },
    author_override: {
      type: DataTypes.ENUM('none', 'and', 'or'),
      defaultValue: 'none'
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_deny: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ForumPermissionCreateSection',
    tableName: 'forum_permissions_create_section',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ForumPermissionCreateSection;
};
