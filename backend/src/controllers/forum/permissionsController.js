const { PERMISSION_MODELS } = require('../../services/permissionEvaluator');

/**
 * Mapping des types de permissions vers leurs noms de table
 */
const PERMISSION_TYPES = {
  view: 'view',
  create_section: 'create_section',
  create_topic: 'create_topic',
  edit: 'edit',
  move_section: 'move_section',
  move_topic: 'move_topic',
  move_post: 'move_post',
  pin: 'pin',
  lock: 'lock'
};

/**
 * Récupère toutes les règles de permission pour un type donné
 */
async function getAllPermissions(req, res) {
  try {
    const { permissionType } = req.params;

    if (!PERMISSION_TYPES[permissionType]) {
      return res.status(400).json({
        success: false,
        message: `Type de permission invalide: ${permissionType}`
      });
    }

    const Model = PERMISSION_MODELS[permissionType];
    const permissions = await Model.findAll({
      order: [['priority', 'DESC'], ['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: `${permissions.length} règle(s) de permission ${permissionType} récupérée(s)`,
      data: permissions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des permissions',
      error: error.message
    });
  }
}

/**
 * Récupère une règle de permission par ID
 */
async function getPermissionById(req, res) {
  try {
    const { permissionType, id } = req.params;

    if (!PERMISSION_TYPES[permissionType]) {
      return res.status(400).json({
        success: false,
        message: `Type de permission invalide: ${permissionType}`
      });
    }

    const Model = PERMISSION_MODELS[permissionType];
    const permission = await Model.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Règle de permission non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: permission
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la permission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la permission',
      error: error.message
    });
  }
}

/**
 * Récupère les règles de permission pour une ressource spécifique
 */
async function getPermissionsByResource(req, res) {
  try {
    const { permissionType, resourceType, resourceId } = req.params;

    if (!PERMISSION_TYPES[permissionType]) {
      return res.status(400).json({
        success: false,
        message: `Type de permission invalide: ${permissionType}`
      });
    }

    const Model = PERMISSION_MODELS[permissionType];
    const permissions = await Model.findAll({
      where: {
        resource_type: resourceType,
        resource_id: resourceId
      },
      order: [['priority', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: `${permissions.length} règle(s) trouvée(s) pour ${resourceType} #${resourceId}`,
      data: permissions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des permissions par ressource:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des permissions',
      error: error.message
    });
  }
}

/**
 * Crée une nouvelle règle de permission
 */
async function createPermission(req, res) {
  try {
    const { permissionType } = req.params;

    if (!PERMISSION_TYPES[permissionType]) {
      return res.status(400).json({
        success: false,
        message: `Type de permission invalide: ${permissionType}`
      });
    }

    const Model = PERMISSION_MODELS[permissionType];

    // Validation des champs requis
    const { resource_type, resource_id } = req.body;

    if (!resource_type) {
      return res.status(400).json({
        success: false,
        message: 'Le champ resource_type est requis'
      });
    }

    if (resource_id === undefined || resource_id === null) {
      return res.status(400).json({
        success: false,
        message: 'Le champ resource_id est requis (utilisez 0 pour une règle globale)'
      });
    }

    // Créer la règle
    const permission = await Model.create(req.body);

    res.status(201).json({
      success: true,
      message: `Règle de permission ${permissionType} créée avec succès`,
      data: permission
    });
  } catch (error) {
    console.error('Erreur lors de la création de la permission:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la permission',
      error: error.message
    });
  }
}

/**
 * Met à jour une règle de permission
 */
async function updatePermission(req, res) {
  try {
    const { permissionType, id } = req.params;

    if (!PERMISSION_TYPES[permissionType]) {
      return res.status(400).json({
        success: false,
        message: `Type de permission invalide: ${permissionType}`
      });
    }

    const Model = PERMISSION_MODELS[permissionType];
    const permission = await Model.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Règle de permission non trouvée'
      });
    }

    // Ne pas permettre la modification de l'ID
    delete req.body.id;

    await permission.update(req.body);

    res.status(200).json({
      success: true,
      message: `Règle de permission ${permissionType} mise à jour avec succès`,
      data: permission
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la permission:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la permission',
      error: error.message
    });
  }
}

/**
 * Supprime une règle de permission
 */
async function deletePermission(req, res) {
  try {
    const { permissionType, id } = req.params;

    if (!PERMISSION_TYPES[permissionType]) {
      return res.status(400).json({
        success: false,
        message: `Type de permission invalide: ${permissionType}`
      });
    }

    const Model = PERMISSION_MODELS[permissionType];
    const permission = await Model.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Règle de permission non trouvée'
      });
    }

    await permission.destroy();

    res.status(200).json({
      success: true,
      message: `Règle de permission ${permissionType} supprimée avec succès`
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la permission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la permission',
      error: error.message
    });
  }
}

module.exports = {
  getAllPermissions,
  getPermissionById,
  getPermissionsByResource,
  createPermission,
  updatePermission,
  deletePermission,
  PERMISSION_TYPES
};
