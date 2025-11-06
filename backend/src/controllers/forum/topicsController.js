const { Topic, Section, User, Character, Faction, Clan, Post } = require('../../models');

/**
 * Récupérer tous les topics
 */
exports.getAllTopics = async (req, res) => {
  try {
    const { section_id, author_user_id, author_character_id, is_pinned, is_locked } = req.query;

    const where = { deleted_at: null };
    if (section_id) where.section_id = section_id;
    if (author_user_id) where.author_user_id = author_user_id;
    if (author_character_id) where.author_character_id = author_character_id;
    if (is_pinned !== undefined) where.is_pinned = is_pinned === 'true';
    if (is_locked !== undefined) where.is_locked = is_locked === 'true';

    const topics = await Topic.findAll({
      where,
      include: [
        {
          model: Section,
          as: 'section',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'authorUser',
          attributes: ['id', 'user_name'],
          required: false
        },
        {
          model: Character,
          as: 'authorCharacter',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [
        ['is_pinned', 'DESC'],
        ['updated_at', 'DESC']
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
 * Récupérer un topic par ID avec ses posts
 */
exports.getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findOne({
      where: { id, deleted_at: null },
      include: [
        {
          model: Section,
          as: 'section',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: User,
          as: 'authorUser',
          attributes: ['id', 'user_name', 'role'],
          required: false
        },
        {
          model: Character,
          as: 'authorCharacter',
          attributes: ['id', 'name'],
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

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic non trouvé'
      });
    }

    // Incrémenter le compteur de vues
    await topic.increment('views_count');

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du topic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du topic',
      error: error.message
    });
  }
};

/**
 * Récupérer un topic par slug
 */
exports.getTopicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const topic = await Topic.findOne({
      where: { slug, deleted_at: null },
      include: [
        {
          model: Section,
          as: 'section',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: User,
          as: 'authorUser',
          attributes: ['id', 'user_name', 'role'],
          required: false
        },
        {
          model: Character,
          as: 'authorCharacter',
          attributes: ['id', 'name'],
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

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic non trouvé'
      });
    }

    // Incrémenter le compteur de vues
    await topic.increment('views_count');

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du topic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du topic',
      error: error.message
    });
  }
};

/**
 * Créer un nouveau topic
 */
exports.createTopic = async (req, res) => {
  try {
    const {
      title,
      slug,
      section_id,
      author_user_id,
      author_character_id,
      author_name,
      faction_id,
      clan_id,
      is_public,
      display_order,
      is_pinned,
      is_locked
    } = req.body;

    // Validation
    if (!title || !slug || !section_id || !author_name) {
      return res.status(400).json({
        success: false,
        message: 'Le titre, le slug, la section et le nom d\'auteur sont requis'
      });
    }

    // Un topic doit avoir soit un auteur utilisateur, soit un auteur personnage
    if (!author_user_id && !author_character_id) {
      return res.status(400).json({
        success: false,
        message: 'Un topic doit avoir soit un auteur utilisateur, soit un auteur personnage'
      });
    }

    // Vérifier que la section existe
    const section = await Section.findByPk(section_id);
    if (!section) {
      return res.status(400).json({
        success: false,
        message: 'La section spécifiée n\'existe pas'
      });
    }

    // Vérifier que l'utilisateur auteur existe si spécifié
    if (author_user_id) {
      const user = await User.findByPk(author_user_id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'L\'utilisateur auteur spécifié n\'existe pas'
        });
      }
    }

    // Vérifier que le personnage auteur existe si spécifié
    if (author_character_id) {
      const character = await Character.findByPk(author_character_id);
      if (!character) {
        return res.status(400).json({
          success: false,
          message: 'Le personnage auteur spécifié n\'existe pas'
        });
      }
    }

    const topic = await Topic.create({
      title,
      slug,
      section_id,
      author_user_id,
      author_character_id,
      author_name,
      faction_id,
      clan_id,
      is_public: is_public !== undefined ? is_public : true,
      display_order: display_order || 0,
      is_pinned: is_pinned || false,
      is_locked: is_locked || false,
      views_count: 0
    });

    // Recharger avec les associations
    await topic.reload({
      include: [
        {
          model: Section,
          as: 'section',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: User,
          as: 'authorUser',
          attributes: ['id', 'user_name'],
          required: false
        },
        {
          model: Character,
          as: 'authorCharacter',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Topic créé avec succès',
      data: topic
    });
  } catch (error) {
    console.error('Erreur lors de la création du topic:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Un topic avec ce slug existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du topic',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un topic
 */
exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_pinned, is_locked, display_order } = req.body;

    const topic = await Topic.findOne({
      where: { id, deleted_at: null }
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic non trouvé'
      });
    }

    await topic.update({
      title: title || topic.title,
      is_pinned: is_pinned !== undefined ? is_pinned : topic.is_pinned,
      is_locked: is_locked !== undefined ? is_locked : topic.is_locked,
      display_order: display_order !== undefined ? display_order : topic.display_order
    });

    res.json({
      success: true,
      message: 'Topic mis à jour avec succès',
      data: topic
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du topic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du topic',
      error: error.message
    });
  }
};

/**
 * Récupérer les posts d'un topic
 */
exports.getPostsByTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le topic existe
    const topic = await Topic.findOne({
      where: { id, deleted_at: null }
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic non trouvé'
      });
    }

    // Récupérer les posts de ce topic
    const posts = await Post.findAll({
      where: {
        topic_id: id,
        deleted_at: null
      },
      include: [
        {
          model: User,
          as: 'authorUser',
          attributes: ['id', 'user_name', 'role'],
          required: false
        },
        {
          model: Character,
          as: 'authorCharacter',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [
        ['created_at', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des posts',
      error: error.message
    });
  }
};

/**
 * Supprimer un topic (soft delete)
 */
exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findOne({
      where: { id, deleted_at: null }
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic non trouvé'
      });
    }

    await topic.update({
      deleted_at: new Date()
    });

    res.json({
      success: true,
      message: 'Topic supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du topic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du topic',
      error: error.message
    });
  }
};
