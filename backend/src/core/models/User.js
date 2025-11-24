const bcrypt = require('bcrypt');
const {
  validateUsername,
  validatePassword,
  validateEmail,
} = require('../validators/userValidators');

const SALT_ROUNDS = 10;

const ROLES = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  GAME_MASTER: 'GAME_MASTER',
  PLAYER: 'PLAYER',
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          customValidator(value) {
            const result = validateUsername(value);
            if (!result.isValid) {
              throw new Error(result.message);
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          customValidator(value) {
            const result = validateEmail(value);
            if (!result.isValid) {
              throw new Error(result.message);
            }
          },
        },
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      verificationTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.PLAYER,
      },
      cguAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cguAcceptedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      forumRulesAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      forumRulesAcceptedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      blockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true, // Soft delete with deletedAt
      indexes: [
        {
          unique: true,
          fields: ['username'],
          where: { deletedAt: null },
          name: 'unique_username_active',
        },
        {
          unique: true,
          fields: ['email'],
          where: { deletedAt: null },
          name: 'unique_email_active',
        },
      ],
      hooks: {
        beforeCreate: async (user) => {
          // Valider le mot de passe avant hashage
          const passwordValidation = validatePassword(user.password);
          if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message);
          }
          // Hash le mot de passe
          user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        },
        beforeUpdate: async (user) => {
          // Si le mot de passe a changé, le valider et le hasher
          if (user.changed('password')) {
            const passwordValidation = validatePassword(user.password);
            if (!passwordValidation.isValid) {
              throw new Error(passwordValidation.message);
            }
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
          }
        },
      },
    }
  );

  // Instance methods
  User.prototype.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.verificationToken;
    delete values.resetPasswordToken;
    return values;
  };

  // Class methods
  User.ROLES = ROLES;

  User.findByEmail = function (email) {
    return this.findOne({ where: { email: email.toLowerCase() } });
  };

  User.findByUsername = function (username) {
    return this.findOne({ where: { username } });
  };

  User.findByVerificationToken = function (token) {
    return this.findOne({ where: { verificationToken: token } });
  };

  User.findByResetPasswordToken = function (token) {
    return this.findOne({ where: { resetPasswordToken: token } });
  };

  return User;
};
