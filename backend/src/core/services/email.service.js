const nodemailer = require('nodemailer');
const verifyEmailTemplate = require('../templates/verifyEmail');
const resetPasswordTemplate = require('../templates/resetPassword');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialise le transporteur nodemailer
   * Appele une seule fois au demarrage
   */
  initialize() {
    if (this.initialized) return;

    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_PORT === '465', // true pour port 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    // En mode developpement sans config SMTP, utiliser un transporteur de test
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
      console.warn('[EmailService] SMTP non configure. Les emails seront logges en console.');
      this.transporter = null;
    } else {
      this.transporter = nodemailer.createTransport(config);
    }

    this.initialized = true;
  }

  /**
   * Envoie un email
   * @param {Object} options - Options de l'email
   * @param {string} options.to - Destinataire
   * @param {string} options.subject - Sujet
   * @param {string} options.html - Corps HTML
   * @param {string} options.text - Corps texte
   * @returns {Promise<Object>} Resultat de l'envoi
   */
  async sendEmail({ to, subject, html, text }) {
    this.initialize();

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@erosion-des-ames.com',
      to,
      subject,
      html,
      text,
    };

    // Si pas de transporteur (mode dev sans SMTP), logger l'email
    if (!this.transporter) {
      console.log('[EmailService] Email simule:');
      console.log(`  To: ${to}`);
      console.log(`  Subject: ${subject}`);
      console.log(`  Body (text): ${text.substring(0, 200)}...`);
      return { messageId: 'simulated-' + Date.now(), simulated: true };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Email envoye: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Erreur d'envoi:`, error.message);
      throw new Error("Impossible d'envoyer l'email. Veuillez reessayer plus tard.");
    }
  }

  /**
   * Envoie un email de verification
   * @param {Object} user - Utilisateur
   * @param {string} user.email - Email de l'utilisateur
   * @param {string} user.username - Nom d'utilisateur
   * @param {string} token - Token de verification
   * @returns {Promise<Object>} Resultat de l'envoi
   */
  async sendVerificationEmail(user, token) {
    const baseUrl = process.env.EMAIL_VERIFY_URL || 'http://localhost:5173/verify-email';
    const verificationUrl = `${baseUrl}?token=${token}`;

    const { subject, html, text } = verifyEmailTemplate({
      username: user.username,
      verificationUrl,
    });

    return this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Envoie un email de reinitialisation de mot de passe
   * @param {Object} user - Utilisateur
   * @param {string} user.email - Email de l'utilisateur
   * @param {string} user.username - Nom d'utilisateur
   * @param {string} token - Token de reinitialisation
   * @returns {Promise<Object>} Resultat de l'envoi
   */
  async sendPasswordResetEmail(user, token) {
    const baseUrl = process.env.PASSWORD_RESET_URL || 'http://localhost:5173/reset-password';
    const resetUrl = `${baseUrl}?token=${token}`;

    const { subject, html, text } = resetPasswordTemplate({
      username: user.username,
      resetUrl,
    });

    return this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
    });
  }

  /**
   * Verifie la configuration SMTP
   * @returns {Promise<boolean>} True si la configuration est valide
   */
  async verifyConnection() {
    this.initialize();

    if (!this.transporter) {
      console.warn('[EmailService] Pas de transporteur configure');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('[EmailService] Connexion SMTP verifiee avec succes');
      return true;
    } catch (error) {
      console.error('[EmailService] Echec de verification SMTP:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
