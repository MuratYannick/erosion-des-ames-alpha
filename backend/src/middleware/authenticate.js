const { verifyAccessToken, extractTokenFromHeader } = require('../services/jwtService');
const { User } = require('../models');

/**
 * Middleware d'authentification JWT
 * Vérifie le token et charge l'utilisateur complet depuis la DB
 * Ajoute req.user avec les données complètes de l'utilisateur
 */
async function authenticateToken(req, res, next) {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expiré',
          error: 'TokenExpiredError',
          expiredAt: error.expiredAt
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token invalide',
          error: 'JsonWebTokenError'
        });
      }
      throw error;
    }

    // Charger l'utilisateur depuis la DB pour avoir les données à jour
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] } // Ne jamais exposer le hash
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier que le compte n'est pas suspendu/banni
    if (user.deleted_at) {
      return res.status(403).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user.toJSON();

    next();
  } catch (error) {
    console.error('Erreur dans authenticateToken:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'authentification',
      error: error.message
    });
  }
}

/**
 * Middleware optionnel - ajoute req.user si un token est présent, sinon continue
 * Utile pour les routes accessibles avec ou sans authentification
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // Pas de token, continuer sans utilisateur
      req.user = null;
      return next();
    }

    // Token présent, essayer de le vérifier
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });

      if (user && !user.deleted_at) {
        req.user = user.toJSON();
      } else {
        req.user = null;
      }
    } catch (error) {
      // Token invalide ou expiré, continuer sans utilisateur
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Erreur dans optionalAuth:', error);
    // En cas d'erreur, continuer sans utilisateur
    req.user = null;
    next();
  }
}

/**
 * Middleware pour vérifier que l'utilisateur a un rôle spécifique
 * À utiliser APRÈS authenticateToken
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis: ${allowedRoles.join(' ou ')}`,
        userRole: req.user.role
      });
    }

    next();
  };
}

/**
 * Middleware pour vérifier que l'utilisateur est admin
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware pour vérifier que l'utilisateur est admin ou moderator
 */
const requireModerator = requireRole('admin', 'moderator');

/**
 * Middleware pour vérifier que l'utilisateur est admin, moderator ou game_master
 */
const requireStaff = requireRole('admin', 'moderator', 'game_master');

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireModerator,
  requireStaff
};
