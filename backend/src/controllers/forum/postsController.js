const { Post, Topic, User, Character } = require('../../models');

/**
 * Récupérer tous les posts
 */
exports.getAllPosts = async (req, res) => {
  try {
    const { topic_id, author_user_id, author_character_id, limit, offset } = req.query;

    const where = { deleted_at: null };
    if (topic_id) where.topic_id = topic_id;
    if (author_user_id) where.author_user_id = author_user_id;
    if (author_character_id) where.author_character_id = author_character_id;

    const options = {
      where,
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['id', 'title', 'slug']
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
        }
      ],
      order: [['created_at', 'ASC']]
    };

    // Pagination
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);

    const posts = await Post.findAll(options);

    // Compter le total si pagination
    let total = null;
    if (limit || offset) {
      total = await Post.count({ where });
    }

    res.json({
      success: true,
      data: posts,
      ...(total !== null && {
        pagination: {
          total,
          limit: parseInt(limit) || null,
          offset: parseInt(offset) || 0
        }
      })
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
 * Récupérer un post par ID
 */
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id, deleted_at: null },
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['id', 'title', 'slug', 'section_id']
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
          attributes: ['id', 'name', 'faction_id', 'clan_id'],
          required: false
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du post',
      error: error.message
    });
  }
};

/**
 * Créer un nouveau post
 */
exports.createPost = async (req, res) => {
  try {
    const {
      content,
      topic_id,
      author_user_id,
      author_character_id,
      author_name,
      is_locked
    } = req.body;

    // Validation
    if (!content || !topic_id || !author_name) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu, le topic et le nom d\'auteur sont requis'
      });
    }

    // Un post doit avoir soit un auteur utilisateur, soit un auteur personnage
    if (!author_user_id && !author_character_id) {
      return res.status(400).json({
        success: false,
        message: 'Un post doit avoir soit un auteur utilisateur, soit un auteur personnage'
      });
    }

    // Vérifier que le topic existe
    const topic = await Topic.findOne({
      where: { id: topic_id, deleted_at: null }
    });

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Le topic spécifié n\'existe pas'
      });
    }

    // Vérifier que le topic n'est pas verrouillé
    if (topic.is_locked) {
      return res.status(403).json({
        success: false,
        message: 'Ce topic est verrouillé, vous ne pouvez pas y poster'
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

    const post = await Post.create({
      content,
      topic_id,
      author_user_id,
      author_character_id,
      author_name,
      is_locked: is_locked || false
    });

    // Mettre à jour la date de dernière modification du topic
    await topic.update({ updated_at: new Date() });

    // Recharger avec les associations
    await post.reload({
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['id', 'title', 'slug']
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
      message: 'Post créé avec succès',
      data: post
    });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du post',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un post
 */
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_locked } = req.body;

    const post = await Post.findOne({
      where: { id, deleted_at: null }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    // Vérifier que le post n'est pas verrouillé
    if (post.is_locked && is_locked === undefined) {
      return res.status(403).json({
        success: false,
        message: 'Ce post est verrouillé, vous ne pouvez pas le modifier'
      });
    }

    await post.update({
      content: content || post.content,
      is_locked: is_locked !== undefined ? is_locked : post.is_locked
    });

    // Mettre à jour la date de dernière modification du topic
    const topic = await Topic.findByPk(post.topic_id);
    if (topic) {
      await topic.update({ updated_at: new Date() });
    }

    res.json({
      success: true,
      message: 'Post mis à jour avec succès',
      data: post
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du post',
      error: error.message
    });
  }
};

/**
 * Supprimer un post (soft delete)
 */
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[DELETE POST] ID reçu:', id);

    const post = await Post.findByPk(id);

    console.log('[DELETE POST] Post trouvé:', post ? `id=${post.id}` : 'null');

    if (!post) {
      console.log('[DELETE POST] Post non trouvé - retour 404');
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    console.log('[DELETE POST] Appel de destroy() pour soft delete...');
    // Avec paranoid: true, destroy() fait un soft delete (met à jour deleted_at)
    await post.destroy();

    console.log('[DELETE POST] Post supprimé avec succès');

    res.json({
      success: true,
      message: 'Post supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du post',
      error: error.message
    });
  }
};

/**
 * Déplacer un post vers un autre topic
 */
exports.movePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_topic_id } = req.body;

    if (!new_topic_id) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID du topic de destination est requis'
      });
    }

    // Récupérer le post
    const post = await Post.findOne({
      where: { id, deleted_at: null }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    // Vérifier que le topic actuel est différent du nouveau
    if (post.topic_id === new_topic_id) {
      return res.status(400).json({
        success: false,
        message: 'Le post est déjà dans ce topic'
      });
    }

    // Vérifier que le topic de destination existe
    const newTopic = await Topic.findOne({
      where: { id: new_topic_id, deleted_at: null }
    });

    if (!newTopic) {
      return res.status(404).json({
        success: false,
        message: 'Le topic de destination n\'existe pas'
      });
    }

    // Vérifier que le topic de destination n'est pas verrouillé
    if (newTopic.is_locked) {
      return res.status(403).json({
        success: false,
        message: 'Le topic de destination est verrouillé'
      });
    }

    // Récupérer l'ancien topic pour mise à jour
    const oldTopic = await Topic.findByPk(post.topic_id);

    // Déplacer le post
    await post.update({ topic_id: new_topic_id });

    // Mettre à jour les dates de modification des topics
    await newTopic.update({ updated_at: new Date() });
    if (oldTopic) {
      await oldTopic.update({ updated_at: new Date() });
    }

    // Recharger avec les associations
    await post.reload({
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['id', 'title', 'slug', 'section_id']
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

    res.json({
      success: true,
      message: 'Post déplacé avec succès',
      data: post
    });
  } catch (error) {
    console.error('Erreur lors du déplacement du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du déplacement du post',
      error: error.message
    });
  }
};
