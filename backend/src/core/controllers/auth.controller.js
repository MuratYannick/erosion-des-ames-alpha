const authService = require('../services/auth.service');

class AuthController {
  /**
   * POST /api/v1/auth/register
   * Inscription d'un nouvel utilisateur
   */
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   * Connexion d'un utilisateur
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Déconnexion d'un utilisateur
   * Note: Côté serveur, on ne fait rien car JWT est stateless
   * Le client doit supprimer le token de son côté
   */
  async logout(_req, res) {
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  }

  /**
   * POST /api/v1/auth/refresh-token
   * Rafraîchir le token d'accès
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Token de rafraîchissement requis',
        });
      }

      const tokens = await authService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        message: 'Token rafraîchi avec succès',
        data: tokens,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   * Recuperer le profil de l'utilisateur connecte
   */
  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.user.userId);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/v1/auth/send-verification-email
   * Renvoyer l'email de verification
   */
  async sendVerificationEmail(req, res) {
    try {
      const result = await authService.sendVerificationEmail(req.user.userId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/v1/auth/verify-email/:token
   * Verifier l'email avec le token
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const user = await authService.verifyEmail(token);
      res.status(200).json({
        success: true,
        message: 'Email verifie avec succes',
        data: { user },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   * Demander la reinitialisation du mot de passe
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/v1/auth/reset-password/:token
   * Reinitialiser le mot de passe avec le token
   */
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
