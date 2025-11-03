const categoriesController = require('../../src/controllers/forum/categoriesController');
const { Category, Section } = require('../../src/models');

// Mock des modèles
jest.mock('../../src/models', () => ({
  Category: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  Section: {
    findAll: jest.fn()
  }
}));

describe('Categories Controller', () => {
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

  describe('getAllCategories', () => {
    it('devrait retourner toutes les catégories sans sections', async () => {
      const mockCategories = [
        { id: 1, name: 'Catégorie 1', slug: 'categorie-1' },
        { id: 2, name: 'Catégorie 2', slug: 'categorie-2' }
      ];

      Category.findAll.mockResolvedValue(mockCategories);

      await categoriesController.getAllCategories(req, res);

      expect(Category.findAll).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: [],
        order: [['display_order', 'ASC'], ['id', 'ASC']]
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategories
      });
    });

    it('devrait retourner toutes les catégories avec sections', async () => {
      req.query.include_sections = 'true';

      const mockCategories = [
        {
          id: 1,
          name: 'Catégorie 1',
          slug: 'categorie-1',
          sections: [{ id: 1, name: 'Section 1' }]
        }
      ];

      Category.findAll.mockResolvedValue(mockCategories);

      await categoriesController.getAllCategories(req, res);

      expect(Category.findAll).toHaveBeenCalledWith({
        where: { deleted_at: null },
        include: [
          {
            model: Section,
            as: 'sections',
            where: { deleted_at: null, parent_section_id: null },
            required: false,
            attributes: ['id', 'name', 'slug', 'description', 'display_order', 'is_pinned']
          }
        ],
        order: [['display_order', 'ASC'], ['id', 'ASC']]
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategories
      });
    });

    it('devrait gérer les erreurs correctement', async () => {
      const error = new Error('Database error');
      Category.findAll.mockRejectedValue(error);

      await categoriesController.getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erreur lors de la récupération des catégories',
        error: error.message
      });
    });
  });

  describe('getCategoryById', () => {
    it('devrait retourner une catégorie par ID', async () => {
      req.params.id = '1';

      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        slug: 'categorie-1',
        sections: []
      };

      Category.findOne.mockResolvedValue(mockCategory);

      await categoriesController.getCategoryById(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({
        where: { id: '1', deleted_at: null },
        include: [
          {
            model: Section,
            as: 'sections',
            where: { deleted_at: null, parent_section_id: null },
            required: false,
            attributes: ['id', 'name', 'slug', 'description', 'display_order', 'is_pinned', 'is_locked']
          }
        ]
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategory
      });
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      req.params.id = '999';

      Category.findOne.mockResolvedValue(null);

      await categoriesController.getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Catégorie non trouvée'
      });
    });
  });

  describe('getCategoryBySlug', () => {
    it('devrait retourner une catégorie par slug', async () => {
      req.params.slug = 'categorie-1';

      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        slug: 'categorie-1'
      };

      Category.findOne.mockResolvedValue(mockCategory);

      await categoriesController.getCategoryBySlug(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({
        where: { slug: 'categorie-1', deleted_at: null },
        include: expect.any(Array)
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategory
      });
    });

    it('devrait retourner 404 si slug non trouvé', async () => {
      req.params.slug = 'inexistant';

      Category.findOne.mockResolvedValue(null);

      await categoriesController.getCategoryBySlug(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Catégorie non trouvée'
      });
    });
  });

  describe('createCategory', () => {
    it('devrait créer une nouvelle catégorie', async () => {
      req.body = {
        name: 'Nouvelle Catégorie',
        slug: 'nouvelle-categorie',
        description: 'Description test',
        display_order: 1
      };

      const mockCategory = {
        id: 1,
        ...req.body
      };

      Category.create.mockResolvedValue(mockCategory);

      await categoriesController.createCategory(req, res);

      expect(Category.create).toHaveBeenCalledWith({
        name: 'Nouvelle Catégorie',
        slug: 'nouvelle-categorie',
        description: 'Description test',
        display_order: 1
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Catégorie créée avec succès',
        data: mockCategory
      });
    });

    it('devrait retourner 400 si nom ou slug manquant', async () => {
      req.body = {
        name: 'Test'
      };

      await categoriesController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le nom et le slug sont requis'
      });
      expect(Category.create).not.toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de contrainte unique', async () => {
      req.body = {
        name: 'Test',
        slug: 'test'
      };

      const error = new Error('Duplicate');
      error.name = 'SequelizeUniqueConstraintError';
      Category.create.mockRejectedValue(error);

      await categoriesController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
      });
    });
  });

  describe('updateCategory', () => {
    it('devrait mettre à jour une catégorie', async () => {
      req.params.id = '1';
      req.body = {
        name: 'Catégorie Modifiée',
        description: 'Nouvelle description'
      };

      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        slug: 'categorie-1',
        description: 'Ancienne description',
        display_order: 0,
        update: jest.fn().mockResolvedValue(true)
      };

      Category.findOne.mockResolvedValue(mockCategory);

      await categoriesController.updateCategory(req, res);

      expect(mockCategory.update).toHaveBeenCalledWith({
        name: 'Catégorie Modifiée',
        slug: 'categorie-1',
        description: 'Nouvelle description',
        display_order: 0
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Catégorie mise à jour avec succès',
        data: mockCategory
      });
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      req.params.id = '999';
      req.body = { name: 'Test' };

      Category.findOne.mockResolvedValue(null);

      await categoriesController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Catégorie non trouvée'
      });
    });
  });

  describe('deleteCategory', () => {
    it('devrait supprimer une catégorie (soft delete)', async () => {
      req.params.id = '1';

      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        update: jest.fn().mockResolvedValue(true)
      };

      Category.findOne.mockResolvedValue(mockCategory);

      await categoriesController.deleteCategory(req, res);

      expect(mockCategory.update).toHaveBeenCalledWith({
        deleted_at: expect.any(Date)
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Catégorie supprimée avec succès'
      });
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      req.params.id = '999';

      Category.findOne.mockResolvedValue(null);

      await categoriesController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Catégorie non trouvée'
      });
    });
  });
});
