const postsController = require('../../src/controllers/forum/postsController');
const { Post, Topic, User, Character } = require('../../src/models');

jest.mock('../../src/models', () => ({
  Post: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn()
  },
  Topic: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  Character: {
    findByPk: jest.fn()
  }
}));

describe('Posts Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('devrait retourner tous les posts sans pagination', async () => {
      const mockPosts = [
        { id: 1, content: 'Post 1', topic_id: 1 },
        { id: 2, content: 'Post 2', topic_id: 1 }
      ];

      Post.findAll.mockResolvedValue(mockPosts);

      await postsController.getAllPosts(req, res);

      expect(Post.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPosts
      });
    });

    it('devrait retourner les posts avec pagination', async () => {
      req.query = { limit: '10', offset: '0' };

      const mockPosts = [{ id: 1, content: 'Post 1' }];
      Post.findAll.mockResolvedValue(mockPosts);
      Post.count.mockResolvedValue(25);

      await postsController.getAllPosts(req, res);

      expect(Post.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 0
        })
      );

      expect(Post.count).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPosts,
        pagination: {
          total: 25,
          limit: 10,
          offset: 0
        }
      });
    });

    it('devrait filtrer par topic_id', async () => {
      req.query = { topic_id: '5' };

      const mockPosts = [{ id: 1, content: 'Post 1', topic_id: 5 }];
      Post.findAll.mockResolvedValue(mockPosts);

      await postsController.getAllPosts(req, res);

      expect(Post.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            topic_id: '5'
          })
        })
      );
    });
  });

  describe('getPostById', () => {
    it('devrait retourner un post par ID', async () => {
      req.params.id = '1';

      const mockPost = {
        id: 1,
        content: 'Contenu du post',
        topic: { id: 1, title: 'Topic 1' }
      };

      Post.findOne.mockResolvedValue(mockPost);

      await postsController.getPostById(req, res);

      expect(Post.findOne).toHaveBeenCalledWith({
        where: { id: '1', deleted_at: null },
        include: expect.any(Array)
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPost
      });
    });

    it('devrait retourner 404 si post non trouvé', async () => {
      req.params.id = '999';

      Post.findOne.mockResolvedValue(null);

      await postsController.getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Post non trouvé'
      });
    });
  });

  describe('createPost', () => {
    it('devrait créer un post avec un auteur utilisateur', async () => {
      req.body = {
        content: 'Nouveau post',
        topic_id: 1,
        author_user_id: 1,
        author_name: 'User1'
      };

      const mockTopic = {
        id: 1,
        title: 'Topic 1',
        is_locked: false,
        update: jest.fn().mockResolvedValue(true)
      };

      const mockUser = { id: 1, user_name: 'User1' };

      const mockPost = {
        id: 1,
        ...req.body,
        reload: jest.fn().mockResolvedValue(true)
      };

      Topic.findOne.mockResolvedValue(mockTopic);
      User.findByPk.mockResolvedValue(mockUser);
      Post.create.mockResolvedValue(mockPost);

      await postsController.createPost(req, res);

      expect(Topic.findOne).toHaveBeenCalledWith({
        where: { id: 1, deleted_at: null }
      });

      expect(User.findByPk).toHaveBeenCalledWith(1);

      expect(Post.create).toHaveBeenCalledWith({
        content: 'Nouveau post',
        topic_id: 1,
        author_user_id: 1,
        author_character_id: undefined,
        author_name: 'User1',
        is_locked: false
      });

      expect(mockTopic.update).toHaveBeenCalledWith({
        updated_at: expect.any(Date)
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Post créé avec succès',
        data: mockPost
      });
    });

    it('devrait créer un post avec un personnage', async () => {
      req.body = {
        content: 'Post RP',
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

      const mockPost = {
        id: 1,
        ...req.body,
        reload: jest.fn()
      };

      Topic.findOne.mockResolvedValue(mockTopic);
      Character.findByPk.mockResolvedValue(mockCharacter);
      Post.create.mockResolvedValue(mockPost);

      await postsController.createPost(req, res);

      expect(Character.findByPk).toHaveBeenCalledWith(1);
      expect(Post.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('devrait retourner 400 si champs requis manquants', async () => {
      req.body = {
        content: 'Test'
      };

      await postsController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le contenu, le topic et le nom d\'auteur sont requis'
      });
      expect(Post.create).not.toHaveBeenCalled();
    });

    it('devrait retourner 400 si ni user ni character', async () => {
      req.body = {
        content: 'Test',
        topic_id: 1,
        author_name: 'Test'
      };

      await postsController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Un post doit avoir soit un auteur utilisateur, soit un auteur personnage'
      });
    });

    it('devrait retourner 400 si le topic n\'existe pas', async () => {
      req.body = {
        content: 'Test',
        topic_id: 999,
        author_user_id: 1,
        author_name: 'Test'
      };

      Topic.findOne.mockResolvedValue(null);

      await postsController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le topic spécifié n\'existe pas'
      });
    });

    it('devrait retourner 403 si le topic est verrouillé', async () => {
      req.body = {
        content: 'Test',
        topic_id: 1,
        author_user_id: 1,
        author_name: 'Test'
      };

      const mockTopic = {
        id: 1,
        is_locked: true
      };

      Topic.findOne.mockResolvedValue(mockTopic);

      await postsController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ce topic est verrouillé, vous ne pouvez pas y poster'
      });
    });
  });

  describe('updatePost', () => {
    it('devrait mettre à jour un post', async () => {
      req.params.id = '1';
      req.body = {
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

      Post.findOne.mockResolvedValue(mockPost);
      Topic.findByPk.mockResolvedValue(mockTopic);

      await postsController.updatePost(req, res);

      expect(mockPost.update).toHaveBeenCalledWith({
        content: 'Contenu modifié',
        is_locked: false
      });

      expect(mockTopic.update).toHaveBeenCalledWith({
        updated_at: expect.any(Date)
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Post mis à jour avec succès',
        data: mockPost
      });
    });

    it('devrait retourner 403 si le post est verrouillé', async () => {
      req.params.id = '1';
      req.body = {
        content: 'Nouveau contenu'
      };

      const mockPost = {
        id: 1,
        is_locked: true
      };

      Post.findOne.mockResolvedValue(mockPost);

      await postsController.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ce post est verrouillé, vous ne pouvez pas le modifier'
      });
    });

    it('devrait retourner 404 si post non trouvé', async () => {
      req.params.id = '999';
      req.body = { content: 'Test' };

      Post.findOne.mockResolvedValue(null);

      await postsController.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deletePost', () => {
    it('devrait supprimer un post (soft delete)', async () => {
      req.params.id = '1';

      const mockPost = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      Post.findOne.mockResolvedValue(mockPost);

      await postsController.deletePost(req, res);

      expect(mockPost.update).toHaveBeenCalledWith({
        deleted_at: expect.any(Date)
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Post supprimé avec succès'
      });
    });

    it('devrait retourner 404 si post non trouvé', async () => {
      req.params.id = '999';

      Post.findOne.mockResolvedValue(null);

      await postsController.deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
