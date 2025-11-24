const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Génère un token d'accès JWT
 * @param {Object} payload - Données à inclure dans le token
 * @returns {string} Token JWT
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Génère un token de rafraîchissement JWT
 * @param {Object} payload - Données à inclure dans le token
 * @returns {string} Token JWT de rafraîchissement
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object} Payload décodé
 * @throws {Error} Si le token est invalide ou expiré
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Génère une paire de tokens (accès + rafraîchissement)
 * @param {Object} user - Utilisateur pour lequel générer les tokens
 * @returns {Object} Objet contenant accessToken et refreshToken
 */
const generateTokenPair = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ userId: user.id }),
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateTokenPair,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
