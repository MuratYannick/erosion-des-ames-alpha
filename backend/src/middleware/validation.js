/**
 * Middleware de validation des données pour les requêtes API
 */

/**
 * Validation générique de champs requis
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach(field => {
      if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Champs requis manquants: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Validation pour la création de catégorie
 */
const validateCategory = (req, res, next) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et le slug sont requis'
    });
  }

  // Valider le format du slug
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      message: 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
    });
  }

  next();
};

/**
 * Validation pour la création de section
 */
const validateSection = (req, res, next) => {
  const { name, slug, category_id } = req.body;

  if (!name || !slug || !category_id) {
    return res.status(400).json({
      success: false,
      message: 'Le nom, le slug et la catégorie sont requis'
    });
  }

  // Valider le format du slug
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      message: 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
    });
  }

  // Valider que category_id est un nombre
  if (isNaN(parseInt(category_id))) {
    return res.status(400).json({
      success: false,
      message: 'L\'ID de catégorie doit être un nombre'
    });
  }

  next();
};

/**
 * Validation pour la création de topic
 */
const validateTopic = (req, res, next) => {
  const { title, slug, section_id, author_name } = req.body;

  if (!title || !slug || !section_id || !author_name) {
    return res.status(400).json({
      success: false,
      message: 'Le titre, le slug, la section et le nom d\'auteur sont requis'
    });
  }

  // Valider le format du slug
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      message: 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
    });
  }

  // Valider la longueur du titre
  if (title.length < 3 || title.length > 255) {
    return res.status(400).json({
      success: false,
      message: 'Le titre doit contenir entre 3 et 255 caractères'
    });
  }

  next();
};

/**
 * Validation pour la création de post
 */
const validatePost = (req, res, next) => {
  const { content, topic_id, author_name } = req.body;

  if (!content || !topic_id || !author_name) {
    return res.status(400).json({
      success: false,
      message: 'Le contenu, le topic et le nom d\'auteur sont requis'
    });
  }

  // Valider la longueur du contenu
  if (content.length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Le contenu ne peut pas être vide'
    });
  }

  if (content.length > 50000) {
    return res.status(400).json({
      success: false,
      message: 'Le contenu ne peut pas dépasser 50000 caractères'
    });
  }

  next();
};

/**
 * Validation pour la création de personnage
 */
const validateCharacter = (req, res, next) => {
  const { name, ethnie_id } = req.body;

  if (!name || !ethnie_id) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et l\'ethnie sont requis'
    });
  }

  // Valider la longueur du nom
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Le nom doit contenir entre 2 et 100 caractères'
    });
  }

  next();
};

/**
 * Validation pour les ethnies
 */
const validateEthnie = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Le nom est requis'
    });
  }

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Le nom doit contenir entre 2 et 100 caractères'
    });
  }

  next();
};

/**
 * Validation pour les factions
 */
const validateFaction = (req, res, next) => {
  const { name, ethnie_id } = req.body;

  if (!name || !ethnie_id) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et l\'ethnie sont requis'
    });
  }

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Le nom doit contenir entre 2 et 100 caractères'
    });
  }

  next();
};

/**
 * Validation pour les clans
 */
const validateClan = (req, res, next) => {
  const { name, faction_id } = req.body;

  if (!name || !faction_id) {
    return res.status(400).json({
      success: false,
      message: 'Le nom et la faction sont requis'
    });
  }

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Le nom doit contenir entre 2 et 100 caractères'
    });
  }

  next();
};

/**
 * Sanitize les données en supprimant les espaces superflus
 */
const sanitizeData = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

/**
 * Validation des paramètres de pagination
 */
const validatePagination = (req, res, next) => {
  const { limit, offset } = req.query;

  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre limit doit être un nombre entre 1 et 100'
      });
    }
  }

  if (offset) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre offset doit être un nombre positif'
      });
    }
  }

  next();
};

/**
 * Validation des IDs dans les paramètres
 */
const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: `Le paramètre ${paramName} est requis`
      });
    }

    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum < 1) {
      return res.status(400).json({
        success: false,
        message: `Le paramètre ${paramName} doit être un nombre positif`
      });
    }

    next();
  };
};

/**
 * Validation des slugs dans les paramètres
 */
const validateSlug = (req, res, next) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({
      success: false,
      message: 'Le slug est requis'
    });
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      message: 'Format de slug invalide'
    });
  }

  next();
};

module.exports = {
  validateRequired,
  validateCategory,
  validateSection,
  validateTopic,
  validatePost,
  validateCharacter,
  validateEthnie,
  validateFaction,
  validateClan,
  sanitizeData,
  validatePagination,
  validateId,
  validateSlug
};
