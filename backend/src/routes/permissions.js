const express = require('express');
const router = express.Router();

// Controller
const permissionsController = require('../controllers/forum/permissionsController');

// Middleware
const { requirePermissionAdmin, mockAdminUser } = require('../middleware/permissionAuth');

// Temporairement utiliser le mock admin pour les tests
// TODO: Remplacer par le vrai middleware d'authentification JWT
const authMiddleware = process.env.NODE_ENV === 'test' ? mockAdminUser : requirePermissionAdmin;

/**
 * Routes pour la gestion des permissions
 *
 * Pattern: /permissions/:permissionType/...
 *
 * Types de permissions valides:
 * - view
 * - create_section
 * - create_topic
 * - edit
 * - move_section
 * - move_topic
 * - move_post
 * - pin
 * - lock
 */

// ==========================================
// Routes CRUD pour les règles de permission
// ==========================================

/**
 * GET /permissions/:permissionType
 * Récupère toutes les règles pour un type de permission
 * Exemple: GET /permissions/view
 */
router.get('/:permissionType', authMiddleware, permissionsController.getAllPermissions);

/**
 * GET /permissions/:permissionType/:id
 * Récupère une règle spécifique par ID
 * Exemple: GET /permissions/view/1
 */
router.get('/:permissionType/:id', authMiddleware, permissionsController.getPermissionById);

/**
 * GET /permissions/:permissionType/resource/:resourceType/:resourceId
 * Récupère les règles pour une ressource spécifique
 * Exemple: GET /permissions/view/resource/section/5
 */
router.get(
  '/:permissionType/resource/:resourceType/:resourceId',
  authMiddleware,
  permissionsController.getPermissionsByResource
);

/**
 * POST /permissions/:permissionType
 * Crée une nouvelle règle de permission
 * Exemple: POST /permissions/view
 * Body: { resource_type, resource_id, allowed_roles, ... }
 */
router.post('/:permissionType', authMiddleware, permissionsController.createPermission);

/**
 * PUT /permissions/:permissionType/:id
 * Met à jour une règle de permission
 * Exemple: PUT /permissions/view/1
 * Body: { priority, is_deny, ... }
 */
router.put('/:permissionType/:id', authMiddleware, permissionsController.updatePermission);

/**
 * DELETE /permissions/:permissionType/:id
 * Supprime une règle de permission
 * Exemple: DELETE /permissions/view/1
 */
router.delete('/:permissionType/:id', authMiddleware, permissionsController.deletePermission);

module.exports = router;
