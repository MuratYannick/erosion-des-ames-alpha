const request = require('supertest');
const express = require('express');
const categoriesRoutes = require('../../src/routes/forum');
const { Category, Section } = require('../../src/models');

// Mock des modèles
jest.mock('../../src/models');

describe('Categories API Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/forum', categoriesRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /forum/categories', () => {
    it('devrait retourner toutes les catégories avec status 200', async () => {
      const mockCategories = [
        { id: 1, name: 'Catégorie 1', slug: 'categorie-1', display_order: 0 },
        { id: 2, name: 'Catégorie 2', slug: 'categorie-2', display_order: 1 }
      ];

      Category.findAll = jest.fn().mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/forum/categories')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockCategories
      });
    });

    it('devrait retourner les catégories avec sections si include_sections=true', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Catégorie 1',
          slug: 'categorie-1',
          sections: [
            { id: 1, name: 'Section 1', slug: 'section-1' }
          ]
        }
      ];

      Category.findAll = jest.fn().mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/forum/categories?include_sections=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].sections).toBeDefined();
    });

    it('devrait gérer les erreurs serveur avec status 500', async () => {
      Category.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/forum/categories')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Erreur');
    });
  });

  describe('GET /forum/categories/:id', () => {
    it('devrait retourner une catégorie par ID', async () => {
      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        slug: 'categorie-1'
      };

      Category.findOne = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app)
        .get('/forum/categories/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      Category.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/forum/categories/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvée');
    });
  });

  describe('GET /forum/categories/slug/:slug', () => {
    it('devrait retourner une catégorie par slug', async () => {
      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        slug: 'categorie-1'
      };

      Category.findOne = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app)
        .get('/forum/categories/slug/categorie-1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('categorie-1');
    });

    it('devrait retourner 404 si slug non trouvé', async () => {
      Category.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/forum/categories/slug/inexistant')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /forum/categories', () => {
    it('devrait créer une nouvelle catégorie', async () => {
      const newCategory = {
        name: 'Nouvelle Catégorie',
        slug: 'nouvelle-categorie',
        description: 'Description test'
      };

      const mockCreatedCategory = {
        id: 1,
        ...newCategory
      };

      Category.create = jest.fn().mockResolvedValue(mockCreatedCategory);

      const response = await request(app)
        .post('/forum/categories')
        .send(newCategory)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('créée avec succès');
      expect(response.body.data.name).toBe(newCategory.name);
    });

    it('devrait retourner 400 si nom ou slug manquant', async () => {
      const invalidCategory = {
        name: 'Test'
        // slug manquant
      };

      const response = await request(app)
        .post('/forum/categories')
        .send(invalidCategory)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requis');
    });

    it('devrait retourner 400 si slug existe déjà', async () => {
      const duplicateCategory = {
        name: 'Test',
        slug: 'test'
      };

      const error = new Error('Duplicate');
      error.name = 'SequelizeUniqueConstraintError';
      Category.create = jest.fn().mockRejectedValue(error);

      const response = await request(app)
        .post('/forum/categories')
        .send(duplicateCategory)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('existe déjà');
    });
  });

  describe('PUT /forum/categories/:id', () => {
    it('devrait mettre à jour une catégorie', async () => {
      const updatedData = {
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

      Category.findOne = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app)
        .put('/forum/categories/1')
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('mise à jour');
      expect(mockCategory.update).toHaveBeenCalled();
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      Category.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/forum/categories/999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /forum/categories/:id', () => {
    it('devrait supprimer une catégorie (soft delete)', async () => {
      const mockCategory = {
        id: 1,
        name: 'Catégorie 1',
        update: jest.fn().mockResolvedValue(true)
      };

      Category.findOne = jest.fn().mockResolvedValue(mockCategory);

      const response = await request(app)
        .delete('/forum/categories/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('supprimée');
      expect(mockCategory.update).toHaveBeenCalledWith({
        deleted_at: expect.any(Date)
      });
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      Category.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/forum/categories/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
