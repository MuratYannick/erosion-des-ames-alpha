const request = require('supertest');
const express = require('express');
const permissionsRouter = require('../../src/routes/permissions');

// Mock des modèles avant de les require
jest.mock('../../src/models', () => ({
  ForumPermissionView: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  ForumPermissionEdit: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

const { ForumPermissionView, ForumPermissionEdit } = require('../../src/models');

const app = express();
app.use(express.json());
app.use('/permissions', permissionsRouter);

describe('Permissions API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /permissions/:permissionType', () => {
    it('devrait récupérer toutes les règles de permission view', async () => {
      const mockPermissions = [
        {
          id: 1,
          resource_type: 'category',
          resource_id: 0,
          allowed_roles: null,
          priority: 0,
          is_deny: false
        },
        {
          id: 2,
          resource_type: 'section',
          resource_id: 5,
          allowed_roles: ['admin', 'moderator'],
          priority: 10,
          is_deny: false
        }
      ];

      ForumPermissionView.findAll = jest.fn().mockResolvedValue(mockPermissions);

      const response = await request(app)
        .get('/permissions/view')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(ForumPermissionView.findAll).toHaveBeenCalledWith({
        order: [['priority', 'DESC'], ['created_at', 'DESC']]
      });
    });

    it('devrait retourner 400 pour un type de permission invalide', async () => {
      const response = await request(app)
        .get('/permissions/invalid_type')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('invalide');
    });

    it('devrait gérer les erreurs de base de données', async () => {
      ForumPermissionView.findAll = jest.fn().mockRejectedValue(new Error('DB Error'));

      const response = await request(app)
        .get('/permissions/view')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Erreur');
    });
  });

  describe('GET /permissions/:permissionType/:id', () => {
    it('devrait récupérer une règle spécifique par ID', async () => {
      const mockPermission = {
        id: 1,
        resource_type: 'topic',
        resource_id: 10,
        allowed_roles: ['admin'],
        priority: 5,
        is_deny: false
      };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(mockPermission);

      const response = await request(app)
        .get('/permissions/edit/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(ForumPermissionEdit.findByPk).toHaveBeenCalledWith('1');
    });

    it('devrait retourner 404 si la règle n\'existe pas', async () => {
      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/permissions/edit/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvée');
    });
  });

  describe('GET /permissions/:permissionType/resource/:resourceType/:resourceId', () => {
    it('devrait récupérer les règles pour une ressource spécifique', async () => {
      const mockPermissions = [
        {
          id: 3,
          resource_type: 'section',
          resource_id: 5,
          allowed_roles: ['player'],
          priority: 15,
          is_deny: false
        }
      ];

      ForumPermissionView.findAll = jest.fn().mockResolvedValue(mockPermissions);

      const response = await request(app)
        .get('/permissions/view/resource/section/5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(ForumPermissionView.findAll).toHaveBeenCalledWith({
        where: {
          resource_type: 'section',
          resource_id: '5'
        },
        order: [['priority', 'DESC']]
      });
    });
  });

  describe('POST /permissions/:permissionType', () => {
    it('devrait créer une nouvelle règle de permission', async () => {
      const newPermission = {
        resource_type: 'section',
        resource_id: 10,
        allowed_roles: ['admin', 'moderator'],
        require_terms_accepted: true,
        require_forum_rules_accepted: true,
        require_email_verified: true,
        priority: 5,
        is_deny: false
      };

      const mockCreatedPermission = {
        id: 5,
        ...newPermission
      };

      ForumPermissionView.create = jest.fn().mockResolvedValue(mockCreatedPermission);

      const response = await request(app)
        .post('/permissions/view')
        .send(newPermission)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('créée avec succès');
      expect(response.body.data.id).toBe(5);
      expect(ForumPermissionView.create).toHaveBeenCalledWith(newPermission);
    });

    it('devrait retourner 400 si resource_type manquant', async () => {
      const invalidPermission = {
        resource_id: 10,
        allowed_roles: ['admin']
      };

      const response = await request(app)
        .post('/permissions/view')
        .send(invalidPermission)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('resource_type');
    });

    it('devrait retourner 400 si resource_id manquant', async () => {
      const invalidPermission = {
        resource_type: 'section',
        allowed_roles: ['admin']
      };

      const response = await request(app)
        .post('/permissions/view')
        .send(invalidPermission)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('resource_id');
    });

    it('devrait gérer les erreurs de validation Sequelize', async () => {
      const validationError = {
        name: 'SequelizeValidationError',
        errors: [
          { path: 'priority', message: 'Priority must be an integer' }
        ]
      };

      ForumPermissionView.create = jest.fn().mockRejectedValue(validationError);

      const response = await request(app)
        .post('/permissions/view')
        .send({
          resource_type: 'section',
          resource_id: 0,
          priority: 'invalid'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /permissions/:permissionType/:id', () => {
    it('devrait mettre à jour une règle de permission', async () => {
      const mockPermission = {
        id: 1,
        resource_type: 'topic',
        resource_id: 10,
        allowed_roles: ['admin'],
        priority: 5,
        is_deny: false,
        update: jest.fn().mockResolvedValue(true)
      };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(mockPermission);

      const updates = {
        priority: 10,
        is_deny: true
      };

      const response = await request(app)
        .put('/permissions/edit/1')
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('mise à jour');
      expect(mockPermission.update).toHaveBeenCalledWith(updates);
    });

    it('devrait retourner 404 si la règle n\'existe pas', async () => {
      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/permissions/edit/999')
        .send({ priority: 10 })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvée');
    });

    it('ne devrait pas permettre la modification de l\'ID', async () => {
      const mockPermission = {
        id: 1,
        resource_type: 'topic',
        resource_id: 10,
        update: jest.fn().mockResolvedValue(true)
      };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(mockPermission);

      await request(app)
        .put('/permissions/edit/1')
        .send({ id: 999, priority: 10 })
        .expect(200);

      // Vérifier que l'ID n'est pas dans les updates
      expect(mockPermission.update).toHaveBeenCalledWith({ priority: 10 });
    });
  });

  describe('DELETE /permissions/:permissionType/:id', () => {
    it('devrait supprimer une règle de permission', async () => {
      const mockPermission = {
        id: 1,
        resource_type: 'section',
        resource_id: 5,
        destroy: jest.fn().mockResolvedValue(true)
      };

      ForumPermissionView.findByPk = jest.fn().mockResolvedValue(mockPermission);

      const response = await request(app)
        .delete('/permissions/view/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('supprimée avec succès');
      expect(mockPermission.destroy).toHaveBeenCalled();
    });

    it('devrait retourner 404 si la règle n\'existe pas', async () => {
      ForumPermissionView.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/permissions/view/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('non trouvée');
    });

    it('devrait gérer les erreurs de suppression', async () => {
      const mockPermission = {
        id: 1,
        destroy: jest.fn().mockRejectedValue(new Error('DB Error'))
      };

      ForumPermissionView.findByPk = jest.fn().mockResolvedValue(mockPermission);

      const response = await request(app)
        .delete('/permissions/view/1')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Erreur');
    });
  });

  describe('Types de permissions valides', () => {
    const validTypes = [
      'view',
      'create_section',
      'create_topic',
      'edit',
      'move_section',
      'move_topic',
      'move_post',
      'pin',
      'lock'
    ];

    validTypes.forEach(type => {
      it(`devrait accepter le type de permission: ${type}`, async () => {
        // Mock le modèle correspondant
        const ModelName = `ForumPermission${type.split('_').map(w =>
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join('')}`;

        // Créer un mock temporaire pour ce modèle
        const mockModel = {
          findAll: jest.fn().mockResolvedValue([])
        };

        // Injecter le mock dans PERMISSION_MODELS
        const { PERMISSION_MODELS } = require('../../src/services/permissionEvaluator');
        PERMISSION_MODELS[type] = mockModel;

        const response = await request(app)
          .get(`/permissions/${type}`)
          .expect(200);

        expect(response.body.success).toBe(true);
      });
    });
  });
});
