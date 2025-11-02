const { Section, Topic, Character } = require('../models');

/**
 * Vérifie si un utilisateur a accès à une section privée
 * basée sur les restrictions de faction ou de clan
 */
const checkSectionAccess = async (req, res, next) => {
  try {
    const sectionId = req.params.section_id || req.body.section_id;

    if (!sectionId) {
      return next(); // Pas de section spécifiée, continuer
    }

    const section = await Section.findByPk(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section non trouvée'
      });
    }

    // Si la section est publique, pas besoin de vérifier les permissions
    if (section.is_public) {
      return next();
    }

    // Récupérer le personnage de l'utilisateur s'il en utilise un
    const characterId = req.body.author_character_id || req.query.character_id;

    if (!characterId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: cette section est privée et nécessite un personnage'
      });
    }

    const character = await Character.findByPk(characterId);

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    // Vérifier l'accès selon les restrictions de la section
    if (section.faction_id && section.faction_id !== character.faction_id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: cette section est réservée à une autre faction'
      });
    }

    if (section.clan_id && section.clan_id !== character.clan_id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: cette section est réservée à un autre clan'
      });
    }

    // Accès autorisé
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

/**
 * Vérifie si un utilisateur a accès à un topic privé
 */
const checkTopicAccess = async (req, res, next) => {
  try {
    const topicId = req.params.topic_id || req.body.topic_id;

    if (!topicId) {
      return next();
    }

    const topic = await Topic.findOne({
      where: { id: topicId },
      include: [{
        model: Section,
        as: 'section'
      }]
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic non trouvé'
      });
    }

    // Si le topic est public, pas besoin de vérifier
    if (topic.is_public) {
      return next();
    }

    // Récupérer le personnage de l'utilisateur
    const characterId = req.body.author_character_id || req.query.character_id;

    if (!characterId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: ce topic est privé et nécessite un personnage'
      });
    }

    const character = await Character.findByPk(characterId);

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    // Vérifier l'accès selon les restrictions du topic
    if (topic.faction_id && topic.faction_id !== character.faction_id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: ce topic est réservé à une autre faction'
      });
    }

    if (topic.clan_id && topic.clan_id !== character.clan_id) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: ce topic est réservé à un autre clan'
      });
    }

    // Accès autorisé
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

/**
 * Vérifie si un utilisateur est propriétaire d'une ressource
 * (pour modification/suppression)
 */
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user?.id; // Suppose qu'on a l'auth middleware avant

      const resource = await model.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée'
        });
      }

      // Vérifier si l'utilisateur est le propriétaire
      if (resource.author_user_id && resource.author_user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé: vous n\'êtes pas le propriétaire de cette ressource'
        });
      }

      // Attacher la ressource à la requête pour éviter de la recharger
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification de la propriété:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de la propriété',
        error: error.message
      });
    }
  };
};

/**
 * Vérifie si l'utilisateur a le rôle requis
 */
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: permissions insuffisantes'
      });
    }

    next();
  };
};

module.exports = {
  checkSectionAccess,
  checkTopicAccess,
  checkOwnership,
  checkRole
};
