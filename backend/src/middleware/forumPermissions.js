const { checkPermission } = require('../services/permissionEvaluator');
const { Category, Section, Topic, Post, Character } = require('../models');

/**
 * Middleware factory pour vérifier les permissions forum
 * @param {string} permissionType - Type de permission à vérifier
 * @param {Object} options - Options supplémentaires
 * @returns {Function} Middleware Express
 */
function requireForumPermission(permissionType, options = {}) {
  return async (req, res, next) => {
    try {
      // Récupérer l'utilisateur depuis req (suppose qu'un auth middleware a été exécuté avant)
      const user = req.user || null;

      // Récupérer le personnage si fourni
      let character = null;
      const characterId = req.body?.author_character_id || req.query?.character_id || req.params?.character_id;

      if (characterId) {
        character = await Character.findByPk(characterId);
      }

      // Déterminer la ressource à vérifier
      const { resourceType, resourceId, resource } = await determineResource(req, options);

      if (!resourceType || !resourceId) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de déterminer la ressource à vérifier'
        });
      }

      // Vérifier la permission
      const hasPermission = await checkPermission(
        user,
        character,
        resourceType,
        resourceId,
        permissionType,
        resource
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Vous n'avez pas la permission nécessaire (${permissionType}) pour cette action`
        });
      }

      // Permission accordée, passer au middleware suivant
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des permissions',
        error: error.message
      });
    }
  };
}

/**
 * Détermine la ressource (type, id) à partir de la requête
 * @param {Object} req - Requête Express
 * @param {Object} options - Options de configuration
 * @returns {Promise<Object>} - {resourceType, resourceId, resource}
 */
async function determineResource(req, options) {
  let resourceType = options.resourceType;
  let resourceId = null;
  let resource = null;

  // Si resourceType n'est pas fourni, essayer de le déduire
  if (!resourceType) {
    // Vérifier dans les params
    if (req.params.category_id || req.body?.category_id) {
      resourceType = 'category';
      resourceId = req.params.category_id || req.body?.category_id;
    } else if (req.params.section_id || req.body?.section_id) {
      resourceType = 'section';
      resourceId = req.params.section_id || req.body?.section_id;
    } else if (req.params.topic_id || req.body?.topic_id) {
      resourceType = 'topic';
      resourceId = req.params.topic_id || req.body?.topic_id;
    } else if (req.params.id) {
      // Essayer de déduire du path
      if (req.path.includes('/categories')) {
        resourceType = 'category';
        resourceId = req.params.id;
      } else if (req.path.includes('/sections')) {
        resourceType = 'section';
        resourceId = req.params.id;
      } else if (req.path.includes('/topics')) {
        resourceType = 'topic';
        resourceId = req.params.id;
      }
    }
  } else {
    // resourceType fourni, trouver l'ID
    const idField = `${resourceType}_id`;
    resourceId = req.params[idField] || req.body?.[idField] || req.params.id;
  }

  // Charger la ressource complète si nécessaire (pour author_override)
  if (resourceId) {
    if (resourceType === 'topic') {
      resource = await Topic.findByPk(resourceId);
    } else if (resourceType === 'section') {
      resource = await Section.findByPk(resourceId);
    } else if (resourceType === 'category') {
      resource = await Category.findByPk(resourceId);
    }
  }

  return {
    resourceType,
    resourceId: resourceId ? parseInt(resourceId) : null,
    resource
  };
}

/**
 * Middlewares pré-configurés pour les actions courantes
 */
module.exports = {
  requireForumPermission,

  // View permissions
  canViewCategory: () => requireForumPermission('view', { resourceType: 'category' }),
  canViewSection: () => requireForumPermission('view', { resourceType: 'section' }),
  canViewTopic: () => requireForumPermission('view', { resourceType: 'topic' }),

  // Create permissions
  canCreateSection: () => requireForumPermission('create_section'),
  canCreateTopic: () => requireForumPermission('create_topic', { resourceType: 'section' }),
  // Posts are created in topics - check topic's edit permission (posts inherit from topic)
  canCreatePost: () => requireForumPermission('edit', { resourceType: 'topic' }),

  // Edit permissions
  canEditCategory: () => requireForumPermission('edit', { resourceType: 'category' }),
  canEditSection: () => requireForumPermission('edit', { resourceType: 'section' }),
  canEditTopic: () => requireForumPermission('edit', { resourceType: 'topic' }),
  // Posts inherit edit permission from their topic
  canEditPost: () => requireForumPermission('edit', { resourceType: 'topic' }),

  // Move permissions
  canMoveSection: () => requireForumPermission('move_section'),
  canMoveTopic: () => requireForumPermission('move_topic', { resourceType: 'section' }),
  canMovePost: () => requireForumPermission('move_post', { resourceType: 'topic' }),

  // Pin/Lock permissions
  canPinSection: () => requireForumPermission('pin', { resourceType: 'section' }),
  canPinTopic: () => requireForumPermission('pin', { resourceType: 'topic' }),
  canLockSection: () => requireForumPermission('lock', { resourceType: 'section' }),
  canLockTopic: () => requireForumPermission('lock', { resourceType: 'topic' })
};
