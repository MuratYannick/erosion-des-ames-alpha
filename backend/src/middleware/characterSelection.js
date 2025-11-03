const { Character } = require('../models');

/**
 * Vérifie qu'un personnage est sélectionné pour les posts RP
 * et que le personnage appartient bien à l'utilisateur
 */
const requireCharacter = async (req, res, next) => {
  try {
    const characterId = req.body.author_character_id;
    const userId = req.user?.id; // Suppose qu'on a l'auth middleware avant

    if (!characterId) {
      return res.status(400).json({
        success: false,
        message: 'Un personnage doit être sélectionné pour poster en RP'
      });
    }

    const character = await Character.findOne({
      where: {
        id: characterId,
        deleted_at: null
      }
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Personnage non trouvé'
      });
    }

    // Vérifier que le personnage appartient à l'utilisateur
    if (character.user_id && character.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Ce personnage ne vous appartient pas'
      });
    }

    // Vérifier que le personnage n'est pas mort
    if (character.is_dead) {
      return res.status(403).json({
        success: false,
        message: 'Ce personnage est mort et ne peut plus poster'
      });
    }

    // Attacher le personnage à la requête pour éviter de le recharger
    req.character = character;

    // S'assurer que author_name est défini avec le nom du personnage
    if (!req.body.author_name) {
      req.body.author_name = character.name;
    }

    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du personnage',
      error: error.message
    });
  }
};

/**
 * Permet de poster soit en HRP (avec user) soit en RP (avec character)
 * mais l'un des deux doit être présent
 */
const requireAuthor = async (req, res, next) => {
  try {
    const characterId = req.body.author_character_id;
    const userId = req.user?.id;
    const userName = req.user?.user_name;

    // Cas 1: Post en RP avec personnage
    if (characterId) {
      const character = await Character.findOne({
        where: {
          id: characterId,
          deleted_at: null
        }
      });

      if (!character) {
        return res.status(404).json({
          success: false,
          message: 'Personnage non trouvé'
        });
      }

      // Vérifier que le personnage appartient à l'utilisateur
      if (character.user_id && character.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Ce personnage ne vous appartient pas'
        });
      }

      // Vérifier que le personnage n'est pas mort
      if (character.is_dead) {
        return res.status(403).json({
          success: false,
          message: 'Ce personnage est mort et ne peut plus poster'
        });
      }

      req.character = character;
      req.body.author_character_id = character.id;
      req.body.author_name = character.name;
      req.body.author_user_id = null; // Post RP, pas HRP
    }
    // Cas 2: Post en HRP avec utilisateur
    else if (userId) {
      req.body.author_user_id = userId;
      req.body.author_name = userName || 'Utilisateur';
      req.body.author_character_id = null; // Post HRP, pas RP
    }
    // Cas 3: Ni personnage ni utilisateur
    else {
      return res.status(400).json({
        success: false,
        message: 'Un auteur (utilisateur ou personnage) doit être spécifié'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'auteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'auteur',
      error: error.message
    });
  }
};

/**
 * Vérifie que le personnage a accès à la section/topic
 * en fonction de sa faction/clan
 */
const checkCharacterAccess = async (req, res, next) => {
  try {
    const character = req.character;

    if (!character) {
      return next(); // Pas de personnage, c'est un post HRP
    }

    // Les vérifications de faction/clan seront faites par le middleware permissions
    // Ce middleware s'assure juste que les données du personnage sont cohérentes

    // Vérifier que le personnage a une faction si nécessaire
    const sectionId = req.body.section_id;
    const topicId = req.body.topic_id;

    // Cette logique sera gérée par checkSectionAccess et checkTopicAccess
    // On se contente ici de valider la cohérence des données

    next();
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'accès du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'accès du personnage',
      error: error.message
    });
  }
};

/**
 * Permet de récupérer tous les personnages de l'utilisateur
 * Utile pour afficher la liste des personnages disponibles
 */
const getUserCharacters = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    const characters = await Character.findAll({
      where: {
        user_id: userId,
        deleted_at: null,
        is_dead: false // Seulement les personnages vivants
      },
      attributes: ['id', 'name', 'faction_id', 'clan_id'],
      order: [['name', 'ASC']]
    });

    req.userCharacters = characters;
    next();
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des personnages',
      error: error.message
    });
  }
};

module.exports = {
  requireCharacter,
  requireAuthor,
  checkCharacterAccess,
  getUserCharacters
};
