'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ForumPermissionView extends Model {
    static associate(models) {
      // Pas d'association directe, les ressources sont identifiées par resource_type + resource_id
    }
  }

  ForumPermissionView.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resource_type: {
      type: DataTypes.ENUM('category', 'section', 'topic'),
      allowNull: false
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    allowed_roles: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue('allowed_roles');
        return value || null;
      }
    },
    require_terms_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    require_forum_rules_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    require_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    require_character: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    require_character_alive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    require_character_is_leader: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    required_faction_ids: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue('required_faction_ids');
        return value || null;
      }
    },
    required_clan_ids: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue('required_clan_ids');
        return value || null;
      }
    },
    author_override: {
      type: DataTypes.ENUM('none', 'and', 'or'),
      defaultValue: 'none',
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_deny: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ForumPermissionView',
    tableName: 'forum_permissions_view',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ForumPermissionView;
};
