const request = require('supertest');
const app = require('../../index');
const { User, sequelize } = require('../models');

// Mock du service email pour ne pas envoyer de vrais emails
jest.mock('../services/email.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ messageId: 'mock-verification-email' }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ messageId: 'mock-reset-email' }),
  initialize: jest.fn(),
  verifyConnection: jest.fn().mockResolvedValue(true),
}));

const emailService = require('../services/email.service');

describe('Email Verification & Password Reset API', () => {
  const testUser = {
    username: 'EmailTestUser',
    email: 'emailtest@example.com',
    password: 'Password1!',
    cguAccepted: true,
  };

  let accessToken;
  let userId;

  beforeAll(async () => {
    await sequelize.sync({ force: false });
  });

  beforeEach(async () => {
    // Nettoyer les utilisateurs de test
    await User.destroy({
      where: { email: testUser.email },
      force: true,
    });
    await User.destroy({
      where: { email: 'nonexistent@example.com' },
      force: true,
    });

    // Reinitialiser les mocks
    jest.clearAllMocks();

    // Creer un utilisateur pour les tests
    const registerRes = await request(app).post('/api/v1/auth/register').send(testUser);
    accessToken = registerRes.body.data.accessToken;
    userId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await User.destroy({
      where: { email: testUser.email },
      force: true,
    });
    await sequelize.close();
  });

  // ==========================================================================
  // Tests pour POST /api/v1/auth/send-verification-email
  // ==========================================================================
  describe('POST /api/v1/auth/send-verification-email', () => {
    test('should send verification email with authenticated user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('verification');
      expect(emailService.sendVerificationEmail).toHaveBeenCalled();
    });

    test('should reject send-verification-email without authentication', async () => {
      const res = await request(app).post('/api/v1/auth/send-verification-email');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject send-verification-email with invalid token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject if email is already verified', async () => {
      // Marquer l'email comme verifie
      const user = await User.findByPk(userId);
      await user.update({ emailVerified: true });

      const res = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('verifie');
    });
  });

  // ==========================================================================
  // Tests pour GET /api/v1/auth/verify-email/:token
  // ==========================================================================
  describe('GET /api/v1/auth/verify-email/:token', () => {
    test('should verify email with valid token', async () => {
      // Recuperer le token de verification de l'utilisateur
      const user = await User.findByPk(userId);
      const verificationToken = user.verificationToken;

      const res = await request(app).get(`/api/v1/auth/verify-email/${verificationToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verifier que l'email est marque comme verifie
      const updatedUser = await User.findByPk(userId);
      expect(updatedUser.emailVerified).toBe(true);
      expect(updatedUser.verificationToken).toBeNull();
    });

    test('should reject verify-email with invalid token', async () => {
      const res = await request(app).get('/api/v1/auth/verify-email/invalid_token_12345');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('invalide');
    });

    test('should reject verify-email with expired token', async () => {
      // Mettre une date d'expiration dans le passe
      const user = await User.findByPk(userId);
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h dans le passe
      await user.update({ verificationTokenExpires: expiredDate });

      const res = await request(app).get(`/api/v1/auth/verify-email/${user.verificationToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('expire');
    });

    test('should reject verify-email with empty token', async () => {
      const res = await request(app).get('/api/v1/auth/verify-email/');

      // Express renverra 404 pour une route non trouvee
      expect(res.status).toBe(404);
    });
  });

  // ==========================================================================
  // Tests pour POST /api/v1/auth/forgot-password
  // ==========================================================================
  describe('POST /api/v1/auth/forgot-password', () => {
    test('should return 200 with existing email', async () => {
      const res = await request(app).post('/api/v1/auth/forgot-password').send({
        email: testUser.email,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('reinitialisation');
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    test('should return 200 with non-existent email (security)', async () => {
      const res = await request(app).post('/api/v1/auth/forgot-password').send({
        email: 'nonexistent@example.com',
      });

      // Meme reponse pour ne pas reveler si l'email existe
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('reinitialisation');
      // L'email ne doit pas etre envoye
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    test('should reject forgot-password without email', async () => {
      const res = await request(app).post('/api/v1/auth/forgot-password').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject forgot-password with invalid email format', async () => {
      const res = await request(app).post('/api/v1/auth/forgot-password').send({
        email: 'invalid-email',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should create reset password token in database', async () => {
      await request(app).post('/api/v1/auth/forgot-password').send({
        email: testUser.email,
      });

      const user = await User.findByPk(userId);
      expect(user.resetPasswordToken).not.toBeNull();
      expect(user.resetPasswordExpires).not.toBeNull();
      expect(new Date(user.resetPasswordExpires) > new Date()).toBe(true);
    });
  });

  // ==========================================================================
  // Tests pour POST /api/v1/auth/reset-password/:token
  // ==========================================================================
  describe('POST /api/v1/auth/reset-password/:token', () => {
    let resetToken;

    beforeEach(async () => {
      // Demander un reset password pour obtenir un token
      await request(app).post('/api/v1/auth/forgot-password').send({
        email: testUser.email,
      });

      // Recuperer le token depuis la base de donnees
      const user = await User.findByPk(userId);
      resetToken = user.resetPasswordToken;
    });

    test('should reset password with valid token', async () => {
      const newPassword = 'NewPassword1!';

      const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
        password: newPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('succes');

      // Verifier que le token est efface
      const user = await User.findByPk(userId);
      expect(user.resetPasswordToken).toBeNull();
      expect(user.resetPasswordExpires).toBeNull();

      // Verifier que le nouveau mot de passe fonctionne
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: newPassword,
      });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
    });

    test('should reject reset-password with invalid token', async () => {
      const res = await request(app).post('/api/v1/auth/reset-password/invalid_token_12345').send({
        password: 'NewPassword1!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('invalide');
    });

    test('should reject reset-password with expired token', async () => {
      // Mettre une date d'expiration dans le passe
      const user = await User.findByPk(userId);
      const expiredDate = new Date(Date.now() - 60 * 60 * 1000); // 1h dans le passe
      await user.update({ resetPasswordExpires: expiredDate });

      const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
        password: 'NewPassword1!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('expire');
    });

    test('should reject reset-password without password', async () => {
      const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject reset-password with weak password', async () => {
      const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
        password: 'weak',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject reset-password with empty token in URL', async () => {
      const res = await request(app).post('/api/v1/auth/reset-password/').send({
        password: 'NewPassword1!',
      });

      // Express renverra 404 pour une route non trouvee
      expect(res.status).toBe(404);
    });
  });

  // ==========================================================================
  // Tests d'integration supplementaires
  // ==========================================================================
  describe('Integration tests', () => {
    test('should complete full email verification flow', async () => {
      // 1. L'utilisateur demande un nouvel email de verification
      const sendRes = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(sendRes.status).toBe(200);

      // 2. Recuperer le nouveau token
      const user = await User.findByPk(userId);
      const verificationToken = user.verificationToken;

      // 3. Verifier l'email
      const verifyRes = await request(app).get(`/api/v1/auth/verify-email/${verificationToken}`);

      expect(verifyRes.status).toBe(200);

      // 4. L'utilisateur est maintenant verifie
      const updatedUser = await User.findByPk(userId);
      expect(updatedUser.emailVerified).toBe(true);
    });

    test('should complete full password reset flow', async () => {
      const newPassword = 'CompletelyNewPassword1!';

      // 1. Demander la reinitialisation
      const forgotRes = await request(app).post('/api/v1/auth/forgot-password').send({
        email: testUser.email,
      });

      expect(forgotRes.status).toBe(200);

      // 2. Recuperer le token
      const user = await User.findByPk(userId);
      const resetToken = user.resetPasswordToken;

      // 3. Reinitialiser le mot de passe
      const resetRes = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
        password: newPassword,
      });

      expect(resetRes.status).toBe(200);

      // 4. Se connecter avec le nouveau mot de passe
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: newPassword,
      });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.data.accessToken).toBeDefined();

      // 5. L'ancien mot de passe ne fonctionne plus
      const oldLoginRes = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(oldLoginRes.status).toBe(401);
    });

    test('should not allow reusing verification token', async () => {
      // 1. Recuperer le token
      const user = await User.findByPk(userId);
      const verificationToken = user.verificationToken;

      // 2. Premiere verification - doit reussir
      const firstVerify = await request(app).get(`/api/v1/auth/verify-email/${verificationToken}`);
      expect(firstVerify.status).toBe(200);

      // 3. Deuxieme verification avec le meme token - doit echouer
      const secondVerify = await request(app).get(`/api/v1/auth/verify-email/${verificationToken}`);
      expect(secondVerify.status).toBe(400);
      expect(secondVerify.body.message).toContain('invalide');
    });

    test('should not allow reusing reset password token', async () => {
      // 1. Demander un reset
      await request(app).post('/api/v1/auth/forgot-password').send({
        email: testUser.email,
      });

      // 2. Recuperer le token
      const user = await User.findByPk(userId);
      const resetToken = user.resetPasswordToken;

      // 3. Premier reset - doit reussir
      const firstReset = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
        password: 'FirstNewPassword1!',
      });
      expect(firstReset.status).toBe(200);

      // 4. Deuxieme reset avec le meme token - doit echouer
      const secondReset = await request(app)
        .post(`/api/v1/auth/reset-password/${resetToken}`)
        .send({
          password: 'SecondNewPassword1!',
        });
      expect(secondReset.status).toBe(400);
      expect(secondReset.body.message).toContain('invalide');
    });
  });
});
