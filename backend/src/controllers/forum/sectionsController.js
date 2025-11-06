const { Section, Category, Faction, Clan, Topic } = require('../../models');

/**
 * Récupérer toutes les sections
 */
exports.getAllSections = async (req, res) => {
  try {
    const { category_id, faction_id, clan_id, is_public, parent_section_id } = req.query;

    const where = { deleted_at: null };
    if (category_id) where.category_id = category_id;
    if (faction_id) where.faction_id = faction_id;
    if (clan_id) where.clan_id = clan_id;
    if (is_public !== undefined) where.is_public = is_public === 'true';
    if (parent_section_id !== undefined) {
      where.parent_section_id = parent_section_id === 'null' ? null : parent_section_id;
    }

    const sections = await Section.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'parentSection',
          attributes: ['id', 'name', 'slug'],
          required: false
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [
        ['is_pinned', 'DESC'],
        ['display_order', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: sections
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
 * Récupérer une section par ID avec ses sous-sections
 */
exports.getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findOne({
      where: { id, deleted_at: null },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: Section,
          as: 'parentSection',
          attributes: ['id', 'name', 'slug'],
          required: false
        },
        {
          model: Section,
          as: 'childSections',
          where: { deleted_at: null },
          required: false,
          attributes: ['id', 'name', 'slug', 'description', 'display_order', 'is_pinned', 'is_locked', 'is_public']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name', 'description'],
          required: false
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name', 'description'],
          required: false
        }
      ]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }

    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la section:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la section',
      error: error.message
    });
  }
};

/**
 * Récupérer une section par slug
 */
exports.getSectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const section = await Section.findOne({
      where: { slug, deleted_at: null },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: Section,
          as: 'parentSection',
          attributes: ['id', 'name', 'slug'],
          required: false
        },
        {
          model: Section,
          as: 'childSections',
          where: { deleted_at: null },
          required: false,
          attributes: ['id', 'name', 'slug', 'description', 'display_order', 'is_pinned', 'is_locked', 'is_public']
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name', 'description'],
          required: false
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name', 'description'],
          required: false
        }
      ]
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }

    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la section:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la section',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle section (admin/moderator seulement)
 */
exports.createSection = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      category_id,
      parent_section_id,
      faction_id,
      clan_id,
      is_public,
      display_order,
      is_pinned,
      is_locked
    } = req.body;

    // Validation
    if (!name || !slug || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Le nom, le slug et la catégorie sont requis'
      });
    }

    // Vérifier que la catégorie existe
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'La catégorie spécifiée n\'existe pas'
      });
    }

    // Vérifier que la section parente existe si spécifiée
    if (parent_section_id) {
      const parentSection = await Section.findByPk(parent_section_id);
      if (!parentSection) {
        return res.status(400).json({
          success: false,
          message: 'La section parente spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier que la faction existe si spécifiée
    if (faction_id) {
      const faction = await Faction.findByPk(faction_id);
      if (!faction) {
        return res.status(400).json({
          success: false,
          message: 'La faction spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier que le clan existe si spécifié
    if (clan_id) {
      const clan = await Clan.findByPk(clan_id);
      if (!clan) {
        return res.status(400).json({
          success: false,
          message: 'Le clan spécifié n\'existe pas'
        });
      }
    }

    const section = await Section.create({
      name,
      slug,
      description,
      category_id,
      parent_section_id,
      faction_id,
      clan_id,
      is_public: is_public !== undefined ? is_public : true,
      display_order: display_order || 0,
      is_pinned: is_pinned || false,
      is_locked: is_locked || false
    });

    // Recharger avec les associations
    await section.reload({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'parentSection',
          attributes: ['id', 'name', 'slug'],
          required: false
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Section créée avec succès',
      data: section
    });
  } catch (error) {
    console.error('Erreur lors de la création de la section:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une section avec ce slug existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la section',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une section (admin/moderator seulement)
 */
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      category_id,
      parent_section_id,
      faction_id,
      clan_id,
      is_public,
      display_order,
      is_pinned,
      is_locked
    } = req.body;

    const section = await Section.findOne({
      where: { id, deleted_at: null }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }

    // Vérifier que la catégorie existe si modifiée
    if (category_id && category_id !== section.category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'La catégorie spécifiée n\'existe pas'
        });
      }
    }

    // Vérifier que la section parente existe si modifiée
    if (parent_section_id !== undefined && parent_section_id !== section.parent_section_id) {
      if (parent_section_id !== null) {
        // Empêcher une section de devenir sa propre parente
        if (parent_section_id === id) {
          return res.status(400).json({
            success: false,
            message: 'Une section ne peut pas être sa propre parente'
          });
        }

        const parentSection = await Section.findByPk(parent_section_id);
        if (!parentSection) {
          return res.status(400).json({
            success: false,
            message: 'La section parente spécifiée n\'existe pas'
          });
        }
      }
    }

    // Vérifier que la faction existe si modifiée
    if (faction_id !== undefined && faction_id !== section.faction_id) {
      if (faction_id !== null) {
        const faction = await Faction.findByPk(faction_id);
        if (!faction) {
          return res.status(400).json({
            success: false,
            message: 'La faction spécifiée n\'existe pas'
          });
        }
      }
    }

    // Vérifier que le clan existe si modifié
    if (clan_id !== undefined && clan_id !== section.clan_id) {
      if (clan_id !== null) {
        const clan = await Clan.findByPk(clan_id);
        if (!clan) {
          return res.status(400).json({
            success: false,
            message: 'Le clan spécifié n\'existe pas'
          });
        }
      }
    }

    await section.update({
      name: name || section.name,
      slug: slug || section.slug,
      description: description !== undefined ? description : section.description,
      category_id: category_id || section.category_id,
      parent_section_id: parent_section_id !== undefined ? parent_section_id : section.parent_section_id,
      faction_id: faction_id !== undefined ? faction_id : section.faction_id,
      clan_id: clan_id !== undefined ? clan_id : section.clan_id,
      is_public: is_public !== undefined ? is_public : section.is_public,
      display_order: display_order !== undefined ? display_order : section.display_order,
      is_pinned: is_pinned !== undefined ? is_pinned : section.is_pinned,
      is_locked: is_locked !== undefined ? is_locked : section.is_locked
    });

    // Recharger avec les associations
    await section.reload({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Section,
          as: 'parentSection',
          attributes: ['id', 'name', 'slug'],
          required: false
        },
        {
          model: Faction,
          as: 'faction',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Clan,
          as: 'clan',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Section mise à jour avec succès',
      data: section
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la section:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Une section avec ce slug existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la section',
      error: error.message
    });
  }
};

/**
 * Récupérer les topics d'une section
 */
exports.getTopicsBySection = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la section existe
    const section = await Section.findOne({
      where: { id, deleted_at: null }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }

    // Récupérer les topics de cette section
    const topics = await Topic.findAll({
      where: {
        section_id: id,
        deleted_at: null
      },
      order: [
        ['is_pinned', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des topics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des topics',
      error: error.message
    });
  }
};

/**
 * Supprimer une section (soft delete, admin seulement)
 */
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findOne({
      where: { id, deleted_at: null }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }

    await section.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Section supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la section:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la section',
      error: error.message
    });
  }
};
