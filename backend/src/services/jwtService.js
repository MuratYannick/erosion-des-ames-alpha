const jwt = require('jsonwebtoken');

// Clés secrètes (à définir dans .env en production)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-key-change-in-production';

// Durées de vie des tokens
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'; // 7 jours

/**
 * Génère un access token JWT
 * @param {Object} user - Utilisateur (doit contenir id, username, role)
 * @returns {string} Access token JWT
 */
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    email_verified: user.email_verified,
    terms_accepted: user.terms_accepted,
    forum_rules_accepted: user.forum_rules_accepted
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'erosion-des-ames-api',
    audience: 'erosion-des-ames-app'
  });
}

/**
 * Génère un refresh token JWT
 * @param {Object} user - Utilisateur (doit contenir id)
 * @returns {string} Refresh token JWT
 */
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    type: 'refresh'
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'erosion-des-ames-api',
    audience: 'erosion-des-ames-app'
  });
}

/**
 * Génère une paire de tokens (access + refresh)
 * @param {Object} user - Utilisateur
 * @returns {Object} { accessToken, refreshToken }
 */
function generateTokenPair(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
}

/**
 * Vérifie et décode un access token
 * @param {string} token - Access token JWT
 * @returns {Object} Payload décodé
 * @throws {Error} Si le token est invalide ou expiré
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, {
      issuer: 'erosion-des-ames-api',
      audience: 'erosion-des-ames-app'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const expiredError = new Error('Access token expiré');
      expiredError.name = 'TokenExpiredError';
      expiredError.expiredAt = error.expiredAt;
      throw expiredError;
    }
    if (error.name === 'JsonWebTokenError') {
      const invalidError = new Error('Access token invalide');
      invalidError.name = 'JsonWebTokenError';
      throw invalidError;
    }
    throw error;
  }
}

/**
 * Vérifie et décode un refresh token
 * @param {string} token - Refresh token JWT
 * @returns {Object} Payload décodé
 * @throws {Error} Si le token est invalide ou expiré
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'erosion-des-ames-api',
      audience: 'erosion-des-ames-app'
    });

    // Vérifier que c'est bien un refresh token
    if (decoded.type !== 'refresh') {
      throw new Error('Token invalide (type incorrect)');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const expiredError = new Error('Refresh token expiré');
      expiredError.name = 'TokenExpiredError';
      expiredError.expiredAt = error.expiredAt;
      throw expiredError;
    }
    if (error.name === 'JsonWebTokenError') {
      const invalidError = new Error('Refresh token invalide');
      invalidError.name = 'JsonWebTokenError';
      throw invalidError;
    }
    throw error;
  }
}

/**
 * Décode un token sans vérifier la signature (pour inspection)
 * @param {string} token - Token JWT
 * @returns {Object} Payload décodé (non vérifié)
 */
function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Extrait le token du header Authorization
 * @param {string} authHeader - Header Authorization (format: "Bearer <token>")
 * @returns {string|null} Token extrait ou null
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  extractTokenFromHeader,
  // Export des constantes pour les tests
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
};
