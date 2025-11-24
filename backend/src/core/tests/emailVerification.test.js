const request = require('supertest');
const app = require('../../index');
const { User, sequelize } = require('../models');
const emailService = require('../services/email.service');

// Mock du service email pour eviter l'envoi de vrais emails
jest.mock('../services/email.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ messageId: 'test-123' }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ messageId: 'test-456' }),
}));

describe('Email Verification and Password Reset API', () => {
  // Utilisateurs de test avec des emails differents pour eviter les conflits
  const verifyUser = {
    username: 'VerifyTest',
    email: 'verify@example.com',
    password: 'Password1!',
    cguAccepted: true,
  };

  const resetUser = {
    username: 'ResetTest',
    email: 'reset@example.com',
    password: 'Password1!',
    cguAccepted: true,
  };

  beforeAll(async () => {
    await sequelize.sync({ force: false });
  });

  afterAll(async () => {
    // Nettoyer tous les utilisateurs de test
    await User.destroy({
      where: { email: [verifyUser.email, resetUser.email] },
      force: true,
    });
    await sequelize.close();
  });

  describe('Email Verification', () => {
    let accessToken;
    let userId;

    beforeEach(async () => {
      jest.clearAllMocks();
      await User.destroy({
        where: { email: verifyUser.email },
        force: true,
      });
    });

    describe('Registration sends verification email', () => {
      test('should send verification email on registration', async () => {
        const res = await request(app).post('/api/v1/auth/register').send(verifyUser);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        // Verifier que sendVerificationEmail a ete appele
        expect(emailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            email: verifyUser.email.toLowerCase(),
            username: verifyUser.username,
          }),
          expect.any(String)
        );
      });

      test('should create user with verification token', async () => {
        await request(app).post('/api/v1/auth/register').send(verifyUser);

        const user = await User.findByEmail(verifyUser.email);
        expect(user.verificationToken).toBeDefined();
        expect(user.verificationToken).not.toBeNull();
        expect(user.verificationTokenExpires).toBeDefined();
        expect(user.emailVerified).toBe(false);
      });
    });

    describe('POST /api/v1/auth/send-verification-email', () => {
      beforeEach(async () => {
        const registerRes = await request(app).post('/api/v1/auth/register').send(verifyUser);
        accessToken = registerRes.body.data.accessToken;
        userId = registerRes.body.data.user.id;
        jest.clearAllMocks();
      });

      test('should send verification email with valid auth', async () => {
        const res = await request(app)
          .post('/api/v1/auth/send-verification-email')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(emailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      });

      test('should reject without authentication (401)', async () => {
        const res = await request(app).post('/api/v1/auth/send-verification-email');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      test('should reject with invalid token (401)', async () => {
        const res = await request(app)
          .post('/api/v1/auth/send-verification-email')
          .set('Authorization', 'Bearer invalid_token');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });

      test('should reject if email already verified', async () => {
        await User.update({ emailVerified: true }, { where: { id: userId } });

        const res = await request(app)
          .post('/api/v1/auth/send-verification-email')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('GET /api/v1/auth/verify-email/:token', () => {
      let verificationToken;

      beforeEach(async () => {
        await request(app).post('/api/v1/auth/register').send(verifyUser);
        const user = await User.findByEmail(verifyUser.email);
        verificationToken = user.verificationToken;
      });

      test('should verify email with valid token', async () => {
        const res = await request(app).get(`/api/v1/auth/verify-email/${verificationToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.emailVerified).toBe(true);

        const user = await User.findByEmail(verifyUser.email);
        expect(user.emailVerified).toBe(true);
        expect(user.verificationToken).toBeNull();
        expect(user.verificationTokenExpires).toBeNull();
      });

      test('should reject with invalid token', async () => {
        const res = await request(app).get('/api/v1/auth/verify-email/invalid_token_12345');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject with expired token', async () => {
        await User.update(
          { verificationTokenExpires: new Date(Date.now() - 1000) },
          { where: { email: verifyUser.email } }
        );

        const res = await request(app).get(`/api/v1/auth/verify-email/${verificationToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject with empty token', async () => {
        const res = await request(app).get('/api/v1/auth/verify-email/');
        expect(res.status).toBe(404);
      });
    });
  });

  describe('Password Reset', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      await User.destroy({
        where: { email: resetUser.email },
        force: true,
      });
    });

    describe('POST /api/v1/auth/forgot-password', () => {
      beforeEach(async () => {
        await request(app).post('/api/v1/auth/register').send(resetUser);
        jest.clearAllMocks();
      });

      test('should send reset email for existing user', async () => {
        const res = await request(app).post('/api/v1/auth/forgot-password').send({
          email: resetUser.email,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

        const user = await User.findByEmail(resetUser.email);
        expect(user.resetPasswordToken).toBeDefined();
        expect(user.resetPasswordToken).not.toBeNull();
        expect(user.resetPasswordExpires).toBeDefined();
      });

      test('should return same message for non-existent email (security)', async () => {
        const res = await request(app).post('/api/v1/auth/forgot-password').send({
          email: 'nonexistent@example.com',
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      });

      test('should reject without email', async () => {
        const res = await request(app).post('/api/v1/auth/forgot-password').send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('POST /api/v1/auth/reset-password/:token', () => {
      let resetToken;
      const newPassword = 'NewPassword2!';

      beforeEach(async () => {
        await request(app).post('/api/v1/auth/register').send(resetUser);
        await request(app).post('/api/v1/auth/forgot-password').send({
          email: resetUser.email,
        });

        const user = await User.findByEmail(resetUser.email);
        resetToken = user.resetPasswordToken;
        jest.clearAllMocks();
      });

      test('should reset password with valid token', async () => {
        const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: newPassword,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const user = await User.findByEmail(resetUser.email);
        expect(user.resetPasswordToken).toBeNull();
        expect(user.resetPasswordExpires).toBeNull();
      });

      test('should allow login with new password after reset', async () => {
        await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: newPassword,
        });

        const loginRes = await request(app).post('/api/v1/auth/login').send({
          email: resetUser.email,
          password: newPassword,
        });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.success).toBe(true);
        expect(loginRes.body.data.accessToken).toBeDefined();
      });

      test('should reject old password after reset', async () => {
        await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: newPassword,
        });

        const loginRes = await request(app).post('/api/v1/auth/login').send({
          email: resetUser.email,
          password: resetUser.password,
        });

        expect(loginRes.status).toBe(401);
        expect(loginRes.body.success).toBe(false);
      });

      test('should reject with invalid token', async () => {
        const res = await request(app)
          .post('/api/v1/auth/reset-password/invalid_token_12345')
          .send({
            password: newPassword,
          });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject with expired token', async () => {
        await User.update(
          { resetPasswordExpires: new Date(Date.now() - 1000) },
          { where: { email: resetUser.email } }
        );

        const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: newPassword,
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject without password', async () => {
        const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should reject invalid password format', async () => {
        const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: 'weak',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should invalidate token after use (single use)', async () => {
        await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: newPassword,
        });

        const res = await request(app).post(`/api/v1/auth/reset-password/${resetToken}`).send({
          password: 'AnotherPassword3!',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  });
});
