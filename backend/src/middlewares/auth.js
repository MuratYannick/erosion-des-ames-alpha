const { verifyToken } = require('../utils/jwt');

/**
 * Middleware d'authentification
 * Vérifie la présence et la validité du token JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token manquant'
      });
    }

    // Format attendu: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Format du token invalide'
      });
    }

    const token = parts[1];

    // Vérifier le token
    const decoded = verifyToken(token);

    // Attacher les informations de l'utilisateur à la requête
    req.user = decoded;

    next();
  } catch (error) {
    if (error.message === 'Token expiré') {
      return res.status(401).json({
        error: 'Token expiré'
      });
    }
    if (error.message === 'Token invalide') {
      return res.status(401).json({
        error: 'Token invalide'
      });
    }
    return res.status(500).json({
      error: 'Erreur d\'authentification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = authMiddleware;
