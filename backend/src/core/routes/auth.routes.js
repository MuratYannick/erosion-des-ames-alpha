const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
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
 * @desc    Recuperer le profil de l'utilisateur connecte
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile);

/**
 * @route   POST /api/v1/auth/send-verification-email
 * @desc    Renvoyer l'email de verification
 * @access  Private
 */
router.post('/send-verification-email', authenticate, authController.sendVerificationEmail);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verifier l'email avec le token
 * @access  Public
 */
router.get('/verify-email/:token', authController.verifyEmail);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Demander la reinitialisation du mot de passe
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reinitialiser le mot de passe avec le token
 * @access  Public
 */
router.post('/reset-password/:token', resetPasswordValidation, authController.resetPassword);

module.exports = router;
