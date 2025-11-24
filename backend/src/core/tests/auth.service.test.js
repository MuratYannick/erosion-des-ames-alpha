const { User, sequelize } = require('../models');
const authService = require('../services/auth.service');
const emailService = require('../services/email.service');

// Mock du service email
jest.mock('../services/email.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ messageId: 'test-123' }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ messageId: 'test-456' }),
}));

describe('AuthService - Email Verification and Password Reset', () => {
  // Emails de test differents pour eviter les conflits
  const verifyTestEmail = 'svcverify@example.com';
  const resetTestEmail = 'svcreset@example.com';

  beforeAll(async () => {
    await sequelize.sync({ force: false });
  });

  afterAll(async () => {
    await User.destroy({
      where: { email: [verifyTestEmail, resetTestEmail] },
      force: true,
    });
    await sequelize.close();
  });

  describe('Email Verification', () => {
    const testUser = {
      username: 'SvcVerifyTest',
      email: verifyTestEmail,
      password: 'Password1!',
      cguAccepted: true,
    };

    let createdUser;

    beforeEach(async () => {
      jest.clearAllMocks();
      await User.destroy({
        where: { email: testUser.email },
        force: true,
      });
    });

    describe('generateVerificationToken()', () => {
      test('should generate a 64-character hex token', () => {
        const token = authService.generateVerificationToken();

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBe(64);
        expect(/^[a-f0-9]+$/.test(token)).toBe(true);
      });

      test('should generate unique tokens', () => {
        const token1 = authService.generateVerificationToken();
        const token2 = authService.generateVerificationToken();
        const token3 = authService.generateVerificationToken();

        expect(token1).not.toBe(token2);
        expect(token2).not.toBe(token3);
        expect(token1).not.toBe(token3);
      });
    });

    describe('register() - verification token', () => {
      test('should create user with verification token', async () => {
        const result = await authService.register(testUser);

        expect(result.user).toBeDefined();
        expect(result.user.emailVerified).toBe(false);

        const user = await User.findByEmail(testUser.email);
        expect(user.verificationToken).toBeDefined();
        expect(user.verificationToken).not.toBeNull();
        expect(user.verificationTokenExpires).toBeDefined();
      });

      test('should set verification token expiry to 24 hours', async () => {
        await authService.register(testUser);

        const user = await User.findByEmail(testUser.email);
        const expectedExpiry = Date.now() + 24 * 60 * 60 * 1000;

        const expiryTime = new Date(user.verificationTokenExpires).getTime();
        expect(expiryTime).toBeGreaterThan(expectedExpiry - 60000);
        expect(expiryTime).toBeLessThan(expectedExpiry + 60000);
      });

      test('should call sendVerificationEmail', async () => {
        await authService.register(testUser);

        expect(emailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      });

      test('should not block registration if email fails', async () => {
        emailService.sendVerificationEmail.mockRejectedValueOnce(new Error('SMTP error'));

        const result = await authService.register(testUser);

        expect(result.user).toBeDefined();
        expect(result.accessToken).toBeDefined();
      });
    });

    describe('verifyEmail()', () => {
      beforeEach(async () => {
        await authService.register(testUser);
        createdUser = await User.findByEmail(testUser.email);
      });

      test('should verify email with valid token', async () => {
        const token = createdUser.verificationToken;
        const result = await authService.verifyEmail(token);

        expect(result.emailVerified).toBe(true);

        const user = await User.findByEmail(testUser.email);
        expect(user.emailVerified).toBe(true);
        expect(user.verificationToken).toBeNull();
        expect(user.verificationTokenExpires).toBeNull();
      });

      test('should throw error for invalid token', async () => {
        await expect(authService.verifyEmail('invalid_token')).rejects.toThrow();
      });

      test('should throw error for null token', async () => {
        await expect(authService.verifyEmail(null)).rejects.toThrow();
      });

      test('should throw error for expired token', async () => {
        await createdUser.update({
          verificationTokenExpires: new Date(Date.now() - 1000),
        });

        await expect(authService.verifyEmail(createdUser.verificationToken)).rejects.toThrow();
      });
    });

    describe('sendVerificationEmail()', () => {
      beforeEach(async () => {
        await authService.register(testUser);
        createdUser = await User.findByEmail(testUser.email);
        jest.clearAllMocks();
      });

      test('should send verification email for unverified user', async () => {
        const result = await authService.sendVerificationEmail(createdUser.id);

        expect(result.message).toBeDefined();
        expect(emailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      });

      test('should generate new token when sending', async () => {
        const oldToken = createdUser.verificationToken;

        await authService.sendVerificationEmail(createdUser.id);

        const updatedUser = await User.findByEmail(testUser.email);
        expect(updatedUser.verificationToken).not.toBe(oldToken);
      });

      test('should throw error if user not found', async () => {
        await expect(
          authService.sendVerificationEmail('00000000-0000-0000-0000-000000000000')
        ).rejects.toThrow();
      });

      test('should throw error if email already verified', async () => {
        await createdUser.update({ emailVerified: true });

        await expect(authService.sendVerificationEmail(createdUser.id)).rejects.toThrow();
      });
    });
  });

  describe('Password Reset', () => {
    const testUser = {
      username: 'SvcResetTest',
      email: resetTestEmail,
      password: 'Password1!',
      cguAccepted: true,
    };

    let createdUser;

    beforeEach(async () => {
      jest.clearAllMocks();
      await User.destroy({
        where: { email: testUser.email },
        force: true,
      });
    });

    describe('forgotPassword()', () => {
      beforeEach(async () => {
        await authService.register(testUser);
        createdUser = await User.findByEmail(testUser.email);
        jest.clearAllMocks();
      });

      test('should create reset token for existing email', async () => {
        const result = await authService.forgotPassword(testUser.email);

        expect(result.message).toBeDefined();

        const user = await User.findByEmail(testUser.email);
        expect(user.resetPasswordToken).toBeDefined();
        expect(user.resetPasswordToken).not.toBeNull();
        expect(user.resetPasswordExpires).toBeDefined();
      });

      test('should set reset token expiry to 1 hour', async () => {
        await authService.forgotPassword(testUser.email);

        const user = await User.findByEmail(testUser.email);
        const expectedExpiry = Date.now() + 60 * 60 * 1000;

        const expiryTime = new Date(user.resetPasswordExpires).getTime();
        expect(expiryTime).toBeGreaterThan(expectedExpiry - 60000);
        expect(expiryTime).toBeLessThan(expectedExpiry + 60000);
      });

      test('should send password reset email', async () => {
        await authService.forgotPassword(testUser.email);

        expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      });

      test('should return message for non-existent email (security)', async () => {
        const result = await authService.forgotPassword('nonexistent@example.com');

        expect(result.message).toBeDefined();
        expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      });

      test('should throw error for null email', async () => {
        await expect(authService.forgotPassword(null)).rejects.toThrow();
      });

      test('should not throw error if email sending fails', async () => {
        emailService.sendPasswordResetEmail.mockRejectedValueOnce(new Error('SMTP error'));

        const result = await authService.forgotPassword(testUser.email);
        expect(result.message).toBeDefined();
      });
    });

    describe('resetPassword()', () => {
      let resetToken;

      beforeEach(async () => {
        await authService.register(testUser);
        await authService.forgotPassword(testUser.email);
        createdUser = await User.findByEmail(testUser.email);
        resetToken = createdUser.resetPasswordToken;
        jest.clearAllMocks();
      });

      test('should reset password with valid token', async () => {
        const newPassword = 'NewPassword2!';
        const result = await authService.resetPassword(resetToken, newPassword);

        expect(result.message).toBeDefined();

        const user = await User.findByEmail(testUser.email);
        expect(user.resetPasswordToken).toBeNull();
        expect(user.resetPasswordExpires).toBeNull();
      });

      test('should hash new password', async () => {
        const newPassword = 'NewPassword2!';
        await authService.resetPassword(resetToken, newPassword);

        const user = await User.findByEmail(testUser.email);
        expect(user.password).not.toBe(newPassword);
        expect(user.password.startsWith('$2')).toBe(true);
      });

      test('should allow login with new password', async () => {
        const newPassword = 'NewPassword2!';
        await authService.resetPassword(resetToken, newPassword);

        const loginResult = await authService.login(testUser.email, newPassword);
        expect(loginResult.user).toBeDefined();
        expect(loginResult.accessToken).toBeDefined();
      });

      test('should throw error for invalid token', async () => {
        await expect(authService.resetPassword('invalid_token', 'NewPassword2!')).rejects.toThrow();
      });

      test('should throw error for null token', async () => {
        await expect(authService.resetPassword(null, 'NewPassword2!')).rejects.toThrow();
      });

      test('should throw error for null password', async () => {
        await expect(authService.resetPassword(resetToken, null)).rejects.toThrow();
      });

      test('should throw error for expired token', async () => {
        await createdUser.update({
          resetPasswordExpires: new Date(Date.now() - 1000),
        });

        await expect(authService.resetPassword(resetToken, 'NewPassword2!')).rejects.toThrow();
      });

      test('should invalidate token after use', async () => {
        await authService.resetPassword(resetToken, 'NewPassword2!');

        await expect(authService.resetPassword(resetToken, 'AnotherPassword3!')).rejects.toThrow();
      });

      test('should validate new password format', async () => {
        await expect(authService.resetPassword(resetToken, 'weak')).rejects.toThrow();
      });
    });
  });
});
