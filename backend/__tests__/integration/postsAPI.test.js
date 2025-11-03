const request = require('supertest');
const express = require('express');
const forumRoutes = require('../../src/routes/forum');
const { Post, Topic, User, Character } = require('../../src/models');

jest.mock('../../src/models');

// Mock des middlewares d'authentification et de permissions
jest.mock('../../src/middleware/authenticate', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = {
      id: 1,
      username: 'testuser',
      role: 'admin',
      email_verified: true,
      terms_accepted: true,
      forum_rules_accepted: true
    };
    next();
  }),
  requireAdmin: jest.fn((req, res, next) => next())
}));

jest.mock('../../src/middleware/forumPermissions', () => ({
  canViewCategory: jest.fn(() => (req, res, next) => next()),
  canViewSection: jest.fn(() => (req, res, next) => next()),
  canViewTopic: jest.fn(() => (req, res, next) => next()),
  canCreateSection: jest.fn(() => (req, res, next) => next()),
  canCreateTopic: jest.fn(() => (req, res, next) => next()),
  canCreatePost: jest.fn(() => (req, res, next) => next()),
  canEditCategory: jest.fn(() => (req, res, next) => next()),
  canEditSection: jest.fn(() => (req, res, next) => next()),
  canEditTopic: jest.fn(() => (req, res, next) => next()),
  canEditPost: jest.fn(() => (req, res, next) => next()),
  canMoveSection: jest.fn(() => (req, res, next) => next()),
  canMoveTopic: jest.fn(() => (req, res, next) => next()),
  canMovePost: jest.fn(() => (req, res, next) => next()),
  canPinSection: jest.fn(() => (req, res, next) => next()),
  canPinTopic: jest.fn(() => (req, res, next) => next()),
  canLockSection: jest.fn(() => (req, res, next) => next()),
  canLockTopic: jest.fn(() => (req, res, next) => next())
}));

describe('Posts API Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/forum', forumRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /forum/posts', () => {
    it('devrait retourner tous les posts', async () => {
      const mockPosts = [
        { id: 1, content: 'Post 1', topic_id: 1 },
        { id: 2, content: 'Post 2', topic_id: 1 }
      ];

      Post.findAll = jest.fn().mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/forum/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('devrait retourner les posts avec pagination', async () => {
      const mockPosts = [{ id: 1, content: 'Post 1' }];

      Post.findAll = jest.fn().mockResolvedValue(mockPosts);
      Post.count = jest.fn().mockResolvedValue(25);

      const response = await request(app)
        .get('/forum/posts?limit=10&offset=0')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(25);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.offset).toBe(0);
    });

    it('devrait filtrer par topic_id', async () => {
      const mockPosts = [{ id: 1, content: 'Post 1', topic_id: 5 }];

      Post.findAll = jest.fn().mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/forum/posts?topic_id=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Post.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            topic_id: '5'
          })
        })
      );
    });

    it('devrait filtrer par author_user_id', async () => {
      const mockPosts = [{ id: 1, content: 'Post 1', author_user_id: 2 }];

      Post.findAll = jest.fn().mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/forum/posts?author_user_id=2')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('devrait filtrer par author_character_id', async () => {
      const mockPosts = [{ id: 1, content: 'Post RP', author_character_id: 3 }];

      Post.findAll = jest.fn().mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/forum/posts?author_character_id=3')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /forum/posts/:id', () => {
    it('devrait retourner un post par ID', async () => {
      const mockPost = {
        id: 1,
        content: 'Contenu du post',
        topic: { id: 1, title: 'Topic 1' }
      };

      Post.findOne = jest.fn().mockResolvedValue(mockPost);

      const response = await request(app)
        .get('/forum/posts/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });

    it('devrait retourner 404 si post non trouvé', async () => {
      Post.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/forum/posts/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvé');
    });
  });

  describe('POST /forum/posts', () => {
    it('devrait créer un post avec un auteur utilisateur', async () => {
      const newPost = {
        content: 'Nouveau post HRP',
        topic_id: 1,
        author_user_id: 1,
        author_name: 'User1'
      };

      const mockTopic = {
        id: 1,
        is_locked: false,
        update: jest.fn().mockResolvedValue(true)
      };

      const mockUser = { id: 1, user_name: 'User1' };

      const mockCreatedPost = {
        id: 1,
        ...newPost,
        reload: jest.fn().mockResolvedValue(true)
      };

      Topic.findOne = jest.fn().mockResolvedValue(mockTopic);
      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Post.create = jest.fn().mockResolvedValue(mockCreatedPost);

      const response = await request(app)
        .post('/forum/posts')
        .send(newPost)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('créé avec succès');
      expect(mockTopic.update).toHaveBeenCalledWith({
        updated_at: expect.any(Date)
      });
    });

    it('devrait créer un post avec un personnage (RP)', async () => {
      const newPost = {
        content: 'Post en RP',
        topic_id: 1,
        author_character_id: 1,
        author_name: 'Personnage1'
      };

      const mockTopic = {
        id: 1,
        is_locked: false,
        update: jest.fn()
      };

      const mockCharacter = { id: 1, name: 'Personnage1' };

      const mockCreatedPost = {
        id: 1,
        ...newPost,
        reload: jest.fn()
      };

      Topic.findOne = jest.fn().mockResolvedValue(mockTopic);
      Character.findByPk = jest.fn().mockResolvedValue(mockCharacter);
      Post.create = jest.fn().mockResolvedValue(mockCreatedPost);

      const response = await request(app)
        .post('/forum/posts')
        .send(newPost)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(Character.findByPk).toHaveBeenCalledWith(1);
    });

    it('devrait retourner 400 si champs requis manquants', async () => {
      const invalidPost = {
        content: 'Test'
        // topic_id et author_name manquants
      };

      const response = await request(app)
        .post('/forum/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requis');
    });

    it('devrait retourner 400 si ni user ni character', async () => {
      const invalidPost = {
        content: 'Test',
        topic_id: 1,
        author_name: 'Test'
        // ni author_user_id ni author_character_id
      };

      const response = await request(app)
        .post('/forum/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('soit un auteur utilisateur, soit un auteur personnage');
    });

    it('devrait retourner 400 si le topic n\'existe pas', async () => {
      const invalidPost = {
        content: 'Test',
        topic_id: 999,
        author_user_id: 1,
        author_name: 'Test'
      };

      Topic.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/forum/posts')
        .send(invalidPost)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('n\'existe pas');
    });

    it('devrait retourner 403 si le topic est verrouillé', async () => {
      const newPost = {
        content: 'Test',
        topic_id: 1,
        author_user_id: 1,
        author_name: 'Test'
      };

      const mockTopic = {
        id: 1,
        is_locked: true
      };

      Topic.findOne = jest.fn().mockResolvedValue(mockTopic);

      const response = await request(app)
        .post('/forum/posts')
        .send(newPost)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('verrouillé');
    });

    it('devrait retourner 400 si l\'utilisateur n\'existe pas', async () => {
      const newPost = {
        content: 'Test',
        topic_id: 1,
        author_user_id: 999,
        author_name: 'Test'
      };

      const mockTopic = {
        id: 1,
        is_locked: false
      };

      Topic.findOne = jest.fn().mockResolvedValue(mockTopic);
      User.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/forum/posts')
        .send(newPost)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('utilisateur');
    });

    it('devrait retourner 400 si le personnage n\'existe pas', async () => {
      const newPost = {
        content: 'Test',
        topic_id: 1,
        author_character_id: 999,
        author_name: 'Test'
      };

      const mockTopic = {
        id: 1,
        is_locked: false
      };

      Topic.findOne = jest.fn().mockResolvedValue(mockTopic);
      Character.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/forum/posts')
        .send(newPost)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('personnage');
    });
  });

  describe('PUT /forum/posts/:id', () => {
    it('devrait mettre à jour un post', async () => {
      const updatedData = {
        content: 'Contenu modifié'
      };

      const mockPost = {
        id: 1,
        content: 'Ancien contenu',
        is_locked: false,
        topic_id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      const mockTopic = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      Post.findOne = jest.fn().mockResolvedValue(mockPost);
      Topic.findByPk = jest.fn().mockResolvedValue(mockTopic);

      const response = await request(app)
        .put('/forum/posts/1')
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('mis à jour');
      expect(mockPost.update).toHaveBeenCalled();
      expect(mockTopic.update).toHaveBeenCalled();
    });

    it('devrait retourner 403 si le post est verrouillé', async () => {
      const mockPost = {
        id: 1,
        is_locked: true
      };

      Post.findOne = jest.fn().mockResolvedValue(mockPost);

      const response = await request(app)
        .put('/forum/posts/1')
        .send({ content: 'Test' })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('verrouillé');
    });

    it('devrait retourner 404 si post non trouvé', async () => {
      Post.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/forum/posts/999')
        .send({ content: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /forum/posts/:id', () => {
    it('devrait supprimer un post (soft delete)', async () => {
      const mockPost = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      Post.findOne = jest.fn().mockResolvedValue(mockPost);

      const response = await request(app)
        .delete('/forum/posts/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('supprimé');
      expect(mockPost.update).toHaveBeenCalledWith({
        deleted_at: expect.any(Date)
      });
    });

    it('devrait retourner 404 si post non trouvé', async () => {
      Post.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/forum/posts/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
