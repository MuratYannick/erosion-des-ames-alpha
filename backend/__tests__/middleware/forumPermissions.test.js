const { requireForumPermission, canViewTopic, canEditTopic } = require('../../src/middleware/forumPermissions');
const { checkPermission } = require('../../src/services/permissionEvaluator');
const { Topic, Section, Category, Character } = require('../../src/models');

jest.mock('../../src/services/permissionEvaluator');
jest.mock('../../src/models');

describe('Forum Permissions Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null,
      params: {},
      body: {},
      query: {},
      path: ''
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireForumPermission', () => {
    it('devrait autoriser si checkPermission retourne true', async () => {
      req.params.id = 5;
      req.path = '/topics';
      req.user = { id: 1, role: 'admin' };

      Topic.findByPk = jest.fn().mockResolvedValue({ id: 5 });
      checkPermission.mockResolvedValue(true);

      const middleware = requireForumPermission('view', { resourceType: 'topic' });
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait refuser avec 403 si checkPermission retourne false', async () => {
      req.params.id = 5;
      req.path = '/topics';
      req.user = { id: 1, role: 'player' };

      Topic.findByPk = jest.fn().mockResolvedValue({ id: 5 });
      checkPermission.mockResolvedValue(false);

      const middleware = requireForumPermission('edit', { resourceType: 'topic' });
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('permission')
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait charger le personnage depuis body.author_character_id', async () => {
      req.params.id = 5;
      req.path = '/topics';
      req.user = { id: 1, role: 'player' };
      req.body.author_character_id = 10;

      const mockCharacter = { id: 10, user_id: 1 };
      Character.findByPk = jest.fn().mockResolvedValue(mockCharacter);
      Topic.findByPk = jest.fn().mockResolvedValue({ id: 5 });
      checkPermission.mockResolvedValue(true);

      const middleware = requireForumPermission('view', { resourceType: 'topic' });
      await middleware(req, res, next);

      expect(Character.findByPk).toHaveBeenCalledWith(10);
      expect(checkPermission).toHaveBeenCalledWith(
        req.user,
        mockCharacter,
        'topic',
        5,
        'view',
        expect.any(Object)
      );
    });

    it('devrait détecter resourceType depuis le path', async () => {
      req.params.id = 3;
      req.path = '/sections/3';
      req.user = { id: 1, role: 'moderator' };

      Section.findByPk = jest.fn().mockResolvedValue({ id: 3 });
      checkPermission.mockResolvedValue(true);

      const middleware = requireForumPermission('view'); // Pas de resourceType fourni
      await middleware(req, res, next);

      expect(checkPermission).toHaveBeenCalledWith(
        req.user,
        null,
        'section', // Déduit du path
        3,
        'view',
        expect.any(Object)
      );
    });

    it('devrait utiliser section_id depuis body', async () => {
      req.body.section_id = 7;
      req.user = { id: 1, role: 'admin' };

      Section.findByPk = jest.fn().mockResolvedValue({ id: 7 });
      checkPermission.mockResolvedValue(true);

      const middleware = requireForumPermission('create_topic');
      await middleware(req, res, next);

      expect(checkPermission).toHaveBeenCalledWith(
        req.user,
        null,
        'section',
        7,
        'create_topic',
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs avec 500', async () => {
      req.params.id = 5;
      req.path = '/topics';

      Topic.findByPk = jest.fn().mockRejectedValue(new Error('DB Error'));

      const middleware = requireForumPermission('view', { resourceType: 'topic' });
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Erreur'),
        error: 'DB Error'
      });
    });

    it('devrait fonctionner sans utilisateur (non connecté)', async () => {
      req.params.id = 1;
      req.path = '/topics';
      req.user = null; // Pas connecté

      Topic.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      checkPermission.mockResolvedValue(true); // allowed_roles=null autorise tout le monde

      const middleware = requireForumPermission('view', { resourceType: 'topic' });
      await middleware(req, res, next);

      expect(checkPermission).toHaveBeenCalledWith(
        null,
        null,
        'topic',
        1,
        'view',
        expect.any(Object)
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Pre-configured middlewares', () => {
    it('canViewTopic devrait configurer resourceType=topic', async () => {
      req.params.id = 5;
      req.user = { id: 1 };

      Topic.findByPk = jest.fn().mockResolvedValue({ id: 5 });
      checkPermission.mockResolvedValue(true);

      const middleware = canViewTopic();
      await middleware(req, res, next);

      expect(checkPermission).toHaveBeenCalledWith(
        req.user,
        null,
        'topic',
        5,
        'view',
        expect.any(Object)
      );
    });

    it('canEditTopic devrait utiliser permission edit', async () => {
      req.params.id = 5;
      req.user = { id: 1, role: 'moderator' };

      Topic.findByPk = jest.fn().mockResolvedValue({
        id: 5,
        author_user_id: 1
      });
      checkPermission.mockResolvedValue(true);

      const middleware = canEditTopic();
      await middleware(req, res, next);

      expect(checkPermission).toHaveBeenCalledWith(
        req.user,
        null,
        'topic',
        5,
        'edit',
        expect.objectContaining({ id: 5 }) // Resource complète pour author_override
      );
    });
  });

  describe('Resource determination', () => {
    it('devrait retourner 400 si impossible de déterminer la ressource', async () => {
      req.user = { id: 1 };
      // Pas de params, pas de body, path vide

      const middleware = requireForumPermission('view');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Impossible de déterminer')
      });
    });

    it('devrait prioriser resourceType fourni dans options', async () => {
      req.params.id = 3;
      req.path = '/wrong-path'; // Path ne correspond pas

      Section.findByPk = jest.fn().mockResolvedValue({ id: 3 });
      checkPermission.mockResolvedValue(true);

      const middleware = requireForumPermission('view', { resourceType: 'section' });
      await middleware(req, res, next);

      expect(checkPermission).toHaveBeenCalledWith(
        null,
        null,
        'section', // Prend l'option, pas le path
        3,
        'view',
        expect.any(Object)
      );
    });
  });
});
