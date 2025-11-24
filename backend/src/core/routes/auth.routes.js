const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} = require('../middlewares/validation.middleware');

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Déconnexion d'un utilisateur
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Rafraîchir le token d'accès
 * @access  Public
 */
router.post('/refresh-token', refreshTokenValidation, authController.refreshToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
