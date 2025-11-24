const request = require('supertest');
const app = require('../../index');
const { User, sequelize } = require('../models');

describe('Auth API', () => {
  const validUser = {
    username: 'TestUser',
    email: 'test@example.com',
    password: 'Password1!',
    cguAccepted: true,
  };

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: false });
  });

  beforeEach(async () => {
    // Clean up test users before each test
    await User.destroy({
      where: { email: validUser.email },
      force: true,
    });
  });

  afterAll(async () => {
    // Cleanup and close connection
    await User.destroy({
      where: { email: validUser.email },
      force: true,
    });
    await sequelize.close();
  });

  describe('POST /api/v1/auth/register', () => {
    test('should register a new user successfully', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    test('should reject registration with existing email', async () => {
      // First registration
      await request(app).post('/api/v1/auth/register').send(validUser);

      // Second registration with same email
      const res = await request(app).post('/api/v1/auth/register').send({
        ...validUser,
        username: 'DifferentUser',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('email');
    });

    test('should reject registration with existing username', async () => {
      // First registration
      await request(app).post('/api/v1/auth/register').send(validUser);

      // Second registration with same username
      const res = await request(app).post('/api/v1/auth/register').send({
        ...validUser,
        email: 'different@example.com',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject registration without CGU acceptance', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validUser,
          cguAccepted: false,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject registration with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validUser,
          password: 'weak',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject registration with invalid username', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...validUser,
          username: 'ab',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app).post('/api/v1/auth/register').send(validUser);
    });

    test('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    test('should reject login with wrong password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: 'WrongPassword1!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject login with non-existent email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: validUser.password,
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject login without email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        password: validUser.password,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let accessToken;

    beforeEach(async () => {
      // Register and get token
      const registerRes = await request(app).post('/api/v1/auth/register').send(validUser);
      accessToken = registerRes.body.data.accessToken;
    });

    test('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
    });

    test('should reject request without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    let refreshToken;

    beforeEach(async () => {
      // Register and get tokens
      const registerRes = await request(app).post('/api/v1/auth/register').send(validUser);
      refreshToken = registerRes.body.data.refreshToken;
    });

    test('should return new tokens with valid refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/refresh-token').send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    test('should reject request without refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/refresh-token').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject request with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid_token' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let accessToken;

    beforeEach(async () => {
      // Register and get token
      const registerRes = await request(app).post('/api/v1/auth/register').send(validUser);
      accessToken = registerRes.body.data.accessToken;
    });

    test('should logout successfully with valid token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should reject logout without token', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
