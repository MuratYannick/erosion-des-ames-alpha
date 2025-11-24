const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Middleware d'authentification JWT
 * Vérifie que le token est valide et ajoute les informations utilisateur à req.user
 */
const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Token d'authentification requis",
      });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier le token
    const decoded = verifyToken(token);

    // Ajouter les informations utilisateur à la requête
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide',
    });
  }
};

/**
 * Middleware de vérification d'email
 * Vérifie que l'utilisateur a confirmé son adresse email
 * Doit être utilisé APRES le middleware authenticate
 */
const requireEmailVerified = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise',
      });
    }

    // Récupérer l'utilisateur depuis la base de données pour avoir le statut emailVerified à jour
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Vérifier que l'email est vérifié
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Veuillez vérifier votre email avant d'accéder à cette ressource",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification de l'email",
    });
  }
};

/**
 * Middleware de vérification des rôles
 * @param  {...string} roles - Rôles autorisés
 */
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Récupérer l'utilisateur depuis la base de données pour avoir le rôle à jour
      const user = await User.findByPk(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Votre compte a été bloqué',
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé pour ce rôle',
        });
      }

      // Mettre à jour le rôle dans req.user
      req.user.role = user.role;

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des autorisations',
      });
    }
  };
};

module.exports = {
  authenticate,
  requireEmailVerified,
  authorize,
};
