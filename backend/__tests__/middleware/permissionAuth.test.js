const { requirePermissionAdmin, mockAdminUser, mockModeratorUser } = require('../../src/middleware/permissionAuth');

describe('Permission Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('requirePermissionAdmin', () => {
    it('devrait autoriser un utilisateur admin', () => {
      req.user = {
        id: 1,
        role: 'admin',
        terms_accepted: false,
        forum_rules_accepted: false,
        email_verified: false
      };

      requirePermissionAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait autoriser un moderator avec toutes les conditions remplies', () => {
      req.user = {
        id: 2,
        role: 'moderator',
        terms_accepted: true,
        forum_rules_accepted: true,
        email_verified: true
      };

      requirePermissionAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait refuser un moderator sans CGU acceptées', () => {
      req.user = {
        id: 2,
        role: 'moderator',
        terms_accepted: false,
        forum_rules_accepted: true,
        email_verified: true
      };

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vous devez accepter les CGU pour gérer les permissions'
      });
    });

    it('devrait refuser un moderator sans règlement accepté', () => {
      req.user = {
        id: 2,
        role: 'moderator',
        terms_accepted: true,
        forum_rules_accepted: false,
        email_verified: true
      };

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vous devez accepter le règlement du forum pour gérer les permissions'
      });
    });

    it('devrait refuser un moderator sans email vérifié', () => {
      req.user = {
        id: 2,
        role: 'moderator',
        terms_accepted: true,
        forum_rules_accepted: true,
        email_verified: false
      };

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vous devez vérifier votre email pour gérer les permissions'
      });
    });

    it('devrait refuser un utilisateur non connecté', () => {
      req.user = null;

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentification requise pour gérer les permissions'
      });
    });

    it('devrait refuser un game_master', () => {
      req.user = {
        id: 3,
        role: 'game_master',
        terms_accepted: true,
        forum_rules_accepted: true,
        email_verified: true
      };

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Seuls les administrateurs et modérateurs peuvent gérer les permissions'
      });
    });

    it('devrait refuser un player', () => {
      req.user = {
        id: 4,
        role: 'player',
        terms_accepted: true,
        forum_rules_accepted: true,
        email_verified: true
      };

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Seuls les administrateurs et modérateurs peuvent gérer les permissions'
      });
    });

    it('devrait gérer les erreurs internes', () => {
      // Simuler une erreur en passant un objet qui va throw lors de l'accès aux propriétés
      req.user = {
        get role() {
          throw new Error('Test error');
        }
      };

      requirePermissionAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erreur lors de la vérification des droits',
        error: 'Test error'
      });
    });
  });

  describe('mockAdminUser', () => {
    it('devrait ajouter un utilisateur admin mock en mode test', () => {
      process.env.NODE_ENV = 'test';

      mockAdminUser(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('admin');
      expect(req.user.terms_accepted).toBe(true);
      expect(req.user.forum_rules_accepted).toBe(true);
      expect(req.user.email_verified).toBe(true);
      expect(next).toHaveBeenCalled();
    });

    it('devrait refuser en mode production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      mockAdminUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Mock auth désactivé en production'
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('mockModeratorUser', () => {
    it('devrait ajouter un utilisateur moderator mock en mode test', () => {
      process.env.NODE_ENV = 'test';

      mockModeratorUser(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('moderator');
      expect(req.user.terms_accepted).toBe(true);
      expect(req.user.forum_rules_accepted).toBe(true);
      expect(req.user.email_verified).toBe(true);
      expect(next).toHaveBeenCalled();
    });

    it('devrait refuser en mode production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      mockModeratorUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
