const crypto = require('crypto');
const { User } = require('../models');
const { generateTokenPair, verifyToken } = require('../utils/jwt');
const emailService = require('./email.service');

// Durees d'expiration des tokens
const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 heures
const RESET_PASSWORD_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 heure

class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Object} Utilisateur créé et tokens
   */
  async register(userData) {
    const { username, email, password, cguAccepted } = userData;

    // Vérifier si l'email existe déjà
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Vérifier si le username existe déjà
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new Error("Ce nom d'utilisateur est déjà utilisé");
    }

    // Vérifier que les CGU sont acceptées
    if (!cguAccepted) {
      throw new Error('Vous devez accepter les CGU pour vous inscrire');
    }

    // Generer le token de verification
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    // Creer l'utilisateur
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      cguAccepted: true,
      cguAcceptedAt: new Date(),
      verificationToken,
      verificationTokenExpires,
    });

    // Envoyer l'email de verification
    try {
      await emailService.sendVerificationEmail(user, verificationToken);
    } catch (error) {
      console.error('[AuthService] Erreur envoi email verification:', error.message);
      // On ne bloque pas l'inscription si l'email echoue
    }

    // Generer les tokens JWT
    const tokens = generateTokenPair(user);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Connexion d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Object} Utilisateur et tokens
   */
  async login(email, password) {
    // Trouver l'utilisateur par email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier si le compte est bloqué
    if (user.isBlocked) {
      throw new Error('Votre compte a été bloqué. Contactez un administrateur.');
    }

    // Vérifier le mot de passe
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const tokens = generateTokenPair(user);

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Rafraîchir le token d'accès
   * @param {string} refreshToken - Token de rafraîchissement
   * @returns {Object} Nouveaux tokens
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = verifyToken(refreshToken);

      // Trouver l'utilisateur
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      if (user.isBlocked) {
        throw new Error('Votre compte a été bloqué');
      }

      // Générer de nouveaux tokens
      const tokens = generateTokenPair(user);

      return tokens;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token de rafraîchissement expiré');
      }
      throw new Error('Token de rafraîchissement invalide');
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object} Profil utilisateur
   */
  async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user.toJSON();
  }

  /**
   * Genere un token de verification aleatoire
   * @returns {string} Token hexadecimal de 64 caracteres
   */
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verifie l'email d'un utilisateur via le token
   * @param {string} token - Token de verification
   * @returns {Object} Utilisateur verifie
   */
  async verifyEmail(token) {
    if (!token) {
      throw new Error('Token de verification requis');
    }

    const user = await User.findByVerificationToken(token);

    if (!user) {
      throw new Error('Token de verification invalide');
    }

    // Verifier si le token a expire
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      throw new Error('Le token de verification a expire. Veuillez en demander un nouveau.');
    }

    // Marquer l'email comme verifie
    await user.update({
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    return user.toJSON();
  }

  /**
   * Renvoie un email de verification
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object} Message de confirmation
   */
  async sendVerificationEmail(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('Utilisateur non trouve');
    }

    if (user.emailVerified) {
      throw new Error('Votre email est deja verifie');
    }

    // Generer un nouveau token
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    await user.update({
      verificationToken,
      verificationTokenExpires,
    });

    // Envoyer l'email
    await emailService.sendVerificationEmail(user, verificationToken);

    return { message: 'Email de verification envoye' };
  }

  /**
   * Demande de reinitialisation de mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Object} Message de confirmation
   */
  async forgotPassword(email) {
    if (!email) {
      throw new Error('Email requis');
    }

    const user = await User.findByEmail(email);

    // Ne pas reveler si l'email existe ou non (securite)
    if (!user) {
      return {
        message: 'Si un compte existe avec cet email, vous recevrez un lien de reinitialisation.',
      };
    }

    // Generer le token de reset
    const resetPasswordToken = this.generateVerificationToken();
    const resetPasswordExpires = new Date(Date.now() + RESET_PASSWORD_TOKEN_EXPIRY);

    await user.update({
      resetPasswordToken,
      resetPasswordExpires,
    });

    // Envoyer l'email
    try {
      await emailService.sendPasswordResetEmail(user, resetPasswordToken);
    } catch (error) {
      console.error('[AuthService] Erreur envoi email reset:', error.message);
      // Ne pas reveler l'erreur a l'utilisateur
    }

    return {
      message: 'Si un compte existe avec cet email, vous recevrez un lien de reinitialisation.',
    };
  }

  /**
   * Reinitialise le mot de passe avec le token
   * @param {string} token - Token de reinitialisation
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Object} Message de confirmation
   */
  async resetPassword(token, newPassword) {
    if (!token) {
      throw new Error('Token de reinitialisation requis');
    }

    if (!newPassword) {
      throw new Error('Nouveau mot de passe requis');
    }

    const user = await User.findByResetPasswordToken(token);

    if (!user) {
      throw new Error('Token de reinitialisation invalide');
    }

    // Verifier si le token a expire
    if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
      throw new Error('Le token de reinitialisation a expire. Veuillez en demander un nouveau.');
    }

    // Mettre a jour le mot de passe et effacer le token
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Mot de passe reinitialise avec succes' };
  }
}

module.exports = new AuthService();
