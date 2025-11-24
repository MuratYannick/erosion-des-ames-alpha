const { User } = require('../models');
const { generateTokenPair, verifyToken } = require('../utils/jwt');

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

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      cguAccepted: true,
      cguAcceptedAt: new Date(),
    });

    // Générer les tokens
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
}

module.exports = new AuthService();
