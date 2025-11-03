const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authenticate');

/**
 * Routes d'authentification
 */

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Routes protégées (nécessitent un access token)
router.get('/me', authenticateToken, authController.me);

module.exports = router;
