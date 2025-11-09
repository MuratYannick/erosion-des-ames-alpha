const { Category, Section } = require('../../models');
const { checkPermission } = require('../../services/permissionEvaluator');

/**
 * Fonction helper pour ajouter les permissions de l'utilisateur à une section
 * @param {Object} section - Section
 * @param {Object} user - Utilisateur connecté (peut être null)
 * @param {Object} character - Personnage utilisé (optionnel)
 * @returns {Object} - Section avec permissions ajoutées
 */
async function addPermissionsToSection(section, user = null, character = null) {
  const sectionData = section.toJSON ? section.toJSON() : section;

  // Évaluer les permissions pour cette section
  const permissions = {
    canView: await checkPermission(user, character, 'section', sectionData.id, 'view'),
    canEdit: await checkPermission(user, character, 'section', sectionData.id, 'edit'),
    canCreateSection: await checkPermission(user, character, 'section', sectionData.id, 'create_section'),
    canCreateTopic: await checkPermission(user, character, 'section', sectionData.id, 'create_topic'),
    canPin: await checkPermission(user, character, 'section', sectionData.id, 'pin'),
    canLock: await checkPermission(user, character, 'section', sectionData.id, 'lock'),
    canMoveSection: await checkPermission(user, character, 'section', sectionData.id, 'move_section')
  };

  sectionData.permissions = permissions;

  return sectionData;
}

/**
 * Fonction helper pour ajouter les permissions de l'utilisateur à une catégorie
 * @param {Object} category - Catégorie
 * @param {Object} user - Utilisateur connecté (peut être null)
 * @param {Object} character - Personnage utilisé (optionnel)
 * @returns {Object} - Catégorie avec permissions ajoutées
 */
async function addPermissionsToCategory(category, user = null, character = null) {
  const categoryData = category.toJSON ? category.toJSON() : category;

  // Évaluer les permissions pour cette catégorie
  const permissions = {
    canView: await checkPermission(user, character, 'category', categoryData.id, 'view'),
    canEdit: await checkPermission(user, character, 'category', categoryData.id, 'edit'),
    canCreateSection: await checkPermission(user, character, 'category', categoryData.id, 'create_section'),
    canMoveSection: await checkPermission(user, character, 'category', categoryData.id, 'move_section')
  };

  categoryData.permissions = permissions;

  return categoryData;
}

/**
 * Récupérer toutes les catégories avec leurs sections
 */
exports.getAllCategories = async (req, res) => {
  try {
    const { include_sections } = req.query;

    const includeOptions = [];

    if (include_sections === 'true') {
      includeOptions.push({
        model: Section,
        as: 'sections',
        where: { deleted_at: null, parent_section_id: null },
        required: false,
        attributes: ['id', 'name', 'slug', 'description', 'display_order', 'is_pinned']
      });
    }

    const categories = await Category.findAll({
      where: { deleted_at: null },
      include: includeOptions,
      order: [
        ['display_order', 'ASC'],
        ['id', 'ASC']
      ]
    });

    // Ajouter les permissions pour chaque catégorie
    const categoriesWithPermissions = await Promise.all(
      categories.map(category => addPermissionsToCategory(category, req.user, req.character))
    );

    res.json({
      success: true,
      data: categoriesWithPermissions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};

/**
 * Récupérer une catégorie par ID
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, deleted_at: null },
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

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message
    });
  }
};

/**
 * Récupérer une catégorie par slug
 */
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug, deleted_at: null },
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

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle catégorie (admin seulement)
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, display_order } = req.body;

    // Validation
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et le slug sont requis'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      display_order: display_order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une catégorie (admin seulement)
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, display_order } = req.body;

    const category = await Category.findOne({
      where: { id, deleted_at: null }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    await category.update({
      name: name || category.name,
      slug: slug || category.slug,
      description: description !== undefined ? description : category.description,
      display_order: display_order !== undefined ? display_order : category.display_order
    });

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce slug existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie',
      error: error.message
    });
  }
};

/**
 * Récupérer les sections d'une catégorie
 */
exports.getSectionsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la catégorie existe
    const category = await Category.findOne({
      where: { id, deleted_at: null }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    // Récupérer les sections de cette catégorie (seulement les sections principales, pas les sous-sections)
    const sections = await Section.findAll({
      where: {
        category_id: id,
        parent_section_id: null,
        deleted_at: null
      },
      order: [
        ['is_pinned', 'DESC'],
        ['display_order', 'ASC'],
        ['id', 'ASC']
      ]
    });

    // Ajouter les permissions pour chaque section
    const sectionsWithPermissions = await Promise.all(
      sections.map(section => addPermissionsToSection(section, req.user, req.character))
    );

    res.json({
      success: true,
      data: sectionsWithPermissions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sections:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sections',
      error: error.message
    });
  }
};

/**
 * Supprimer une catégorie (soft delete, admin seulement)
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, deleted_at: null }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    await category.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie',
      error: error.message
    });
  }
};
