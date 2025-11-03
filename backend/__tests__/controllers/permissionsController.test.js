const permissionsController = require('../../src/controllers/forum/permissionsController');

// Mock models before requiring
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

describe('Permissions Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllPermissions', () => {
    it('devrait récupérer toutes les permissions pour un type valide', async () => {
      req.params.permissionType = 'view';
      const mockPermissions = [{ id: 1 }, { id: 2 }];

      ForumPermissionView.findAll = jest.fn().mockResolvedValue(mockPermissions);

      await permissionsController.getAllPermissions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.stringContaining('2 règle(s)'),
        data: mockPermissions
      });
    });

    it('devrait retourner 400 pour un type invalide', async () => {
      req.params.permissionType = 'invalid';

      await permissionsController.getAllPermissions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('invalide')
      });
    });

    it('devrait gérer les erreurs de base de données', async () => {
      req.params.permissionType = 'view';
      ForumPermissionView.findAll = jest.fn().mockRejectedValue(new Error('DB Error'));

      await permissionsController.getAllPermissions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Erreur'),
        error: 'DB Error'
      });
    });
  });

  describe('getPermissionById', () => {
    it('devrait récupérer une permission par ID', async () => {
      req.params.permissionType = 'edit';
      req.params.id = '1';
      const mockPermission = { id: 1, resource_type: 'topic' };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(mockPermission);

      await permissionsController.getPermissionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPermission
      });
    });

    it('devrait retourner 404 si non trouvée', async () => {
      req.params.permissionType = 'edit';
      req.params.id = '999';

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(null);

      await permissionsController.getPermissionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Règle de permission non trouvée'
      });
    });
  });

  describe('getPermissionsByResource', () => {
    it('devrait récupérer les permissions pour une ressource', async () => {
      req.params.permissionType = 'view';
      req.params.resourceType = 'section';
      req.params.resourceId = '5';
      const mockPermissions = [{ id: 1 }];

      ForumPermissionView.findAll = jest.fn().mockResolvedValue(mockPermissions);

      await permissionsController.getPermissionsByResource(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.stringContaining('section #5'),
        data: mockPermissions
      });
      expect(ForumPermissionView.findAll).toHaveBeenCalledWith({
        where: {
          resource_type: 'section',
          resource_id: '5'
        },
        order: [['priority', 'DESC']]
      });
    });
  });

  describe('createPermission', () => {
    it('devrait créer une nouvelle permission', async () => {
      req.params.permissionType = 'view';
      req.body = {
        resource_type: 'section',
        resource_id: 10,
        allowed_roles: ['admin'],
        priority: 5
      };
      const mockCreated = { id: 1, ...req.body };

      ForumPermissionView.create = jest.fn().mockResolvedValue(mockCreated);

      await permissionsController.createPermission(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.stringContaining('créée avec succès'),
        data: mockCreated
      });
    });

    it('devrait retourner 400 si resource_type manquant', async () => {
      req.params.permissionType = 'view';
      req.body = {
        resource_id: 10,
        allowed_roles: ['admin']
      };

      await permissionsController.createPermission(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Le champ resource_type est requis'
      });
    });

    it('devrait retourner 400 si resource_id manquant', async () => {
      req.params.permissionType = 'view';
      req.body = {
        resource_type: 'section',
        allowed_roles: ['admin']
      };

      await permissionsController.createPermission(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('resource_id est requis')
      });
    });

    it('devrait gérer les erreurs de validation Sequelize', async () => {
      req.params.permissionType = 'view';
      req.body = {
        resource_type: 'section',
        resource_id: 0,
        priority: 'invalid'
      };

      const validationError = {
        name: 'SequelizeValidationError',
        errors: [
          { path: 'priority', message: 'Must be integer' }
        ]
      };

      ForumPermissionView.create = jest.fn().mockRejectedValue(validationError);

      await permissionsController.createPermission(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erreur de validation',
        errors: [{ field: 'priority', message: 'Must be integer' }]
      });
    });
  });

  describe('updatePermission', () => {
    it('devrait mettre à jour une permission', async () => {
      req.params.permissionType = 'edit';
      req.params.id = '1';
      req.body = { priority: 10, is_deny: true };

      const mockPermission = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(mockPermission);

      await permissionsController.updatePermission(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.stringContaining('mise à jour'),
        data: mockPermission
      });
      expect(mockPermission.update).toHaveBeenCalledWith(req.body);
    });

    it('devrait retourner 404 si permission non trouvée', async () => {
      req.params.permissionType = 'edit';
      req.params.id = '999';
      req.body = { priority: 10 };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(null);

      await permissionsController.updatePermission(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Règle de permission non trouvée'
      });
    });

    it('ne devrait pas permettre la modification de l\'ID', async () => {
      req.params.permissionType = 'edit';
      req.params.id = '1';
      req.body = { id: 999, priority: 10 };

      const mockPermission = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };

      ForumPermissionEdit.findByPk = jest.fn().mockResolvedValue(mockPermission);

      await permissionsController.updatePermission(req, res);

      // L'ID devrait avoir été supprimé du body
      expect(mockPermission.update).toHaveBeenCalledWith({ priority: 10 });
    });
  });

  describe('deletePermission', () => {
    it('devrait supprimer une permission', async () => {
      req.params.permissionType = 'view';
      req.params.id = '1';

      const mockPermission = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      ForumPermissionView.findByPk = jest.fn().mockResolvedValue(mockPermission);

      await permissionsController.deletePermission(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.stringContaining('supprimée avec succès')
      });
      expect(mockPermission.destroy).toHaveBeenCalled();
    });

    it('devrait retourner 404 si permission non trouvée', async () => {
      req.params.permissionType = 'view';
      req.params.id = '999';

      ForumPermissionView.findByPk = jest.fn().mockResolvedValue(null);

      await permissionsController.deletePermission(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Règle de permission non trouvée'
      });
    });

    it('devrait gérer les erreurs de suppression', async () => {
      req.params.permissionType = 'view';
      req.params.id = '1';

      const mockPermission = {
        id: 1,
        destroy: jest.fn().mockRejectedValue(new Error('Cannot delete'))
      };

      ForumPermissionView.findByPk = jest.fn().mockResolvedValue(mockPermission);

      await permissionsController.deletePermission(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Erreur'),
        error: 'Cannot delete'
      });
    });
  });
});
