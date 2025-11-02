const topicsController = require('../../src/controllers/forum/topicsController');
const { Topic, Section, User, Character, Faction, Clan } = require('../../src/models');

jest.mock('../../src/models', () => ({
  Topic: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  Section: {
    findByPk: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  Character: {
    findByPk: jest.fn()
  },
  Faction: {},
  Clan: {}
}));

describe('Topics Controller', () => {
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

  describe('getAllTopics', () => {
    it('devrait retourner tous les topics', async () => {
      const mockTopics = [
        { id: 1, title: 'Topic 1', slug: 'topic-1', is_pinned: true },
        { id: 2, title: 'Topic 2', slug: 'topic-2', is_pinned: false }
      ];

      Topic.findAll.mockResolvedValue(mockTopics);

      await topicsController.getAllTopics(req, res);

      expect(Topic.findAll).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: expect.any(Array),
        order: [
          ['is_pinned', 'DESC'],
          ['updated_at', 'DESC']
        ]
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTopics
      });
    });

    it('devrait filtrer par section_id', async () => {
      req.query = { section_id: '5' };

      const mockTopics = [{ id: 1, title: 'Topic 1', section_id: 5 }];
      Topic.findAll.mockResolvedValue(mockTopics);

      await topicsController.getAllTopics(req, res);

      expect(Topic.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            section_id: '5'
          })
        })
      );
    });

    it('devrait filtrer par is_pinned', async () => {
      req.query = { is_pinned: 'true' };

      Topic.findAll.mockResolvedValue([]);

      await topicsController.getAllTopics(req, res);

      expect(Topic.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            is_pinned: true
          })
        })
      );
    });

    it('devrait gérer les erreurs', async () => {
      const error = new Error('Database error');
      Topic.findAll.mockRejectedValue(error);

      await topicsController.getAllTopics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erreur lors de la récupération des topics',
        error: error.message
      });
    });
  });

  describe('getTopicById', () => {
    it('devrait retourner un topic par ID et incrémenter les vues', async () => {
      req.params.id = '1';

      const mockTopic = {
        id: 1,
        title: 'Topic 1',
        views_count: 10,
        increment: jest.fn().mockResolvedValue(true)
      };

      Topic.findOne.mockResolvedValue(mockTopic);

      await topicsController.getTopicById(req, res);

      expect(Topic.findOne).toHaveBeenCalledWith({
        where: { id: '1', deleted_at: null },
        include: expect.any(Array)
      });

      expect(mockTopic.increment).toHaveBeenCalledWith('views_count');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTopic
      });
    });

    it('devrait retourner 404 si topic non trouvé', async () => {
      req.params.id = '999';

      Topic.findOne.mockResolvedValue(null);

      await topicsController.getTopicById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Topic non trouvé'
      });
    });
  });

  describe('getTopicBySlug', () => {
    it('devrait retourner un topic par slug et incrémenter les vues', async () => {
      req.params.slug = 'topic-1';

      const mockTopic = {
        id: 1,
        slug: 'topic-1',
        title: 'Topic 1',
        increment: jest.fn().mockResolvedValue(true)
      };

      Topic.findOne.mockResolvedValue(mockTopic);

      await topicsController.getTopicBySlug(req, res);

      expect(Topic.findOne).toHaveBeenCalledWith({
        where: { slug: 'topic-1', deleted_at: null },
        include: expect.any(Array)
      });

      expect(mockTopic.increment).toHaveBeenCalledWith('views_count');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTopic
      });
    });
  });

  describe('createTopic', () => {
    it('devrait créer un topic avec un auteur utilisateur', async () => {
      req.body = {
        title: 'Nouveau Topic',
        slug: 'nouveau-topic',
        section_id: 1,
        author_user_id: 1,
        author_name: 'User1'
      };

      const mockSection = { id: 1, name: 'Section 1' };
      const mockUser = { id: 1, user_name: 'User1' };
      const mockTopic = {
        id: 1,
        ...req.body,
        views_count: 0,
        reload: jest.fn().mockResolvedValue(true)
      };

      Section.findByPk.mockResolvedValue(mockSection);
      User.findByPk.mockResolvedValue(mockUser);
      Topic.create.mockResolvedValue(mockTopic);

      await topicsController.createTopic(req, res);

      expect(Section.findByPk).toHaveBeenCalledWith(1);
      expect(User.findByPk).toHaveBeenCalledWith(1);

      expect(Topic.create).toHaveBeenCalledWith({
        title: 'Nouveau Topic',
        slug: 'nouveau-topic',
        section_id: 1,
        author_user_id: 1,
        author_character_id: undefined,
        author_name: 'User1',
        faction_id: undefined,
        clan_id: undefined,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 0
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Topic créé avec succès',
        data: mockTopic
      });
    });

    it('devrait créer un topic avec un personnage', async () => {
      req.body = {
        title: 'Topic RP',
        slug: 'topic-rp',
        section_id: 1,
        author_character_id: 1,
        author_name: 'Personnage1'
      };

      const mockSection = { id: 1 };
      const mockCharacter = { id: 1, name: 'Personnage1' };
      const mockTopic = {
        id: 1,
        ...req.body,
        reload: jest.fn()
      };

      Section.findByPk.mockResolvedValue(mockSection);
      Character.findByPk.mockResolvedValue(mockCharacter);
      Topic.create.mockResolvedValue(mockTopic);

      await topicsController.createTopic(req, res);

      expect(Character.findByPk).toHaveBeenCalledWith(1);
      expect(Topic.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('devrait retourner 400 si champs requis manquants', async () => {
      req.body = {
        title: 'Test'
      };

      await topicsController.createTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le titre, le slug, la section et le nom d\'auteur sont requis'
      });
      expect(Topic.create).not.toHaveBeenCalled();
    });

    it('devrait retourner 400 si ni user ni character', async () => {
      req.body = {
        title: 'Test',
        slug: 'test',
        section_id: 1,
        author_name: 'Test'
      };

      await topicsController.createTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Un topic doit avoir soit un auteur utilisateur, soit un auteur personnage'
      });
    });

    it('devrait retourner 400 si la section n\'existe pas', async () => {
      req.body = {
        title: 'Test',
        slug: 'test',
        section_id: 999,
        author_user_id: 1,
        author_name: 'Test'
      };

      Section.findByPk.mockResolvedValue(null);

      await topicsController.createTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'La section spécifiée n\'existe pas'
      });
    });

    it('devrait gérer les erreurs de slug dupliqué', async () => {
      req.body = {
        title: 'Test',
        slug: 'test',
        section_id: 1,
        author_user_id: 1,
        author_name: 'Test'
      };

      const mockSection = { id: 1 };
      const mockUser = { id: 1 };

      Section.findByPk.mockResolvedValue(mockSection);
      User.findByPk.mockResolvedValue(mockUser);

      const error = new Error('Duplicate');
      error.name = 'SequelizeUniqueConstraintError';
      Topic.create.mockRejectedValue(error);

      await topicsController.createTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Un topic avec ce slug existe déjà'
      });
    });
  });

  describe('updateTopic', () => {
    it('devrait mettre à jour un topic', async () => {
      req.params.id = '1';
      req.body = {
        title: 'Titre modifié',
        is_pinned: true
      };

      const mockTopic = {
        id: 1,
        title: 'Ancien titre',
        is_pinned: false,
        is_locked: false,
        display_order: 0,
        update: jest.fn().mockResolvedValue(true)
      };

      Topic.findOne.mockResolvedValue(mockTopic);

      await topicsController.updateTopic(req, res);

      expect(mockTopic.update).toHaveBeenCalledWith({
        title: 'Titre modifié',
        is_pinned: true,
        is_locked: false,
        display_order: 0
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Topic mis à jour avec succès',
        data: mockTopic
      });
    });

    it('devrait retourner 404 si topic non trouvé', async () => {
      req.params.id = '999';
      req.body = { title: 'Test' };

      Topic.findOne.mockResolvedValue(null);

      await topicsController.updateTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTopic', () => {
    it('devrait supprimer un topic (soft delete)', async () => {
      req.params.id = '1';

      const mockTopic = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      Topic.findOne.mockResolvedValue(mockTopic);

      await topicsController.deleteTopic(req, res);

      expect(mockTopic.update).toHaveBeenCalledWith({
        deleted_at: expect.any(Date)
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Topic supprimé avec succès'
      });
    });

    it('devrait retourner 404 si topic non trouvé', async () => {
      req.params.id = '999';

      Topic.findOne.mockResolvedValue(null);

      await topicsController.deleteTopic(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
