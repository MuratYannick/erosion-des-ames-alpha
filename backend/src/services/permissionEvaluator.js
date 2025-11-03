const {
  ForumPermissionView,
  ForumPermissionCreateSection,
  ForumPermissionCreateTopic,
  ForumPermissionEdit,
  ForumPermissionMoveSection,
  ForumPermissionMoveTopic,
  ForumPermissionMovePost,
  ForumPermissionPin,
  ForumPermissionLock,
  Category,
  Section,
  Topic
} = require('../models');

/**
 * Mapping des types de permissions vers leurs modèles
 */
const PERMISSION_MODELS = {
  view: ForumPermissionView,
  create_section: ForumPermissionCreateSection,
  create_topic: ForumPermissionCreateTopic,
  edit: ForumPermissionEdit,
  move_section: ForumPermissionMoveSection,
  move_topic: ForumPermissionMoveTopic,
  move_post: ForumPermissionMovePost,
  pin: ForumPermissionPin,
  lock: ForumPermissionLock
};

/**
 * Politiques par défaut selon le type de permission
 */
const DEFAULT_POLICIES = {
  view: true, // Par défaut, tout le monde peut voir
  create_section: false,
  create_topic: false,
  edit: false,
  move_section: false,
  move_topic: false,
  move_post: false,
  pin: false,
  lock: false
};

/**
 * Récupère la chaîne d'héritage pour une ressource
 * @param {string} resourceType - 'category', 'section', 'topic'
 * @param {number} resourceId - ID de la ressource
 * @returns {Array} - Liste des ressources dans l'ordre d'héritage
 */
async function getInheritanceChain(resourceType, resourceId) {
  const chain = [{ type: resourceType, id: resourceId }];

  if (resourceType === 'topic') {
    // Topic → Section → Section Parent(s) → Category
    const topic = await Topic.findByPk(resourceId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Category,
          as: 'category'
        }]
      }]
    });

    if (!topic) return chain;

    // Ajouter la section du topic
    if (topic.section) {
      chain.push({ type: 'section', id: topic.section.id });

      // Remonter la hiérarchie des sections parentes
      let currentSection = topic.section;
      while (currentSection.parent_section_id) {
        const parentSection = await Section.findByPk(currentSection.parent_section_id);
        if (!parentSection) break;

        chain.push({ type: 'section', id: parentSection.id });
        currentSection = parentSection;
      }

      // Ajouter la catégorie
      if (currentSection.category_id) {
        chain.push({ type: 'category', id: currentSection.category_id });
      }
    }
  } else if (resourceType === 'section') {
    // Section → Section Parent(s) → Category
    const section = await Section.findByPk(resourceId, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!section) return chain;

    // Remonter la hiérarchie des sections parentes
    let currentSection = section;
    while (currentSection.parent_section_id) {
      const parentSection = await Section.findByPk(currentSection.parent_section_id);
      if (!parentSection) break;

      chain.push({ type: 'section', id: parentSection.id });
      currentSection = parentSection;
    }

    // Ajouter la catégorie
    if (currentSection.category_id) {
      chain.push({ type: 'category', id: currentSection.category_id });
    }
  }
  // Pour 'category', pas d'héritage supplémentaire

  return chain;
}

/**
 * Récupère toutes les règles de permission pour une ressource (avec héritage)
 * @param {string} resourceType - Type de la ressource
 * @param {number} resourceId - ID de la ressource
 * @param {string} permissionType - Type de permission
 * @returns {Array} - Liste des règles triées par priorité
 */
async function getPermissionRules(resourceType, resourceId, permissionType) {
  const Model = PERMISSION_MODELS[permissionType];
  if (!Model) {
    throw new Error(`Type de permission invalide: ${permissionType}`);
  }

  const inheritanceChain = await getInheritanceChain(resourceType, resourceId);
  const allRules = [];

  // Récupérer les règles pour chaque niveau de la chaîne d'héritage
  for (const resource of inheritanceChain) {
    const rules = await Model.findAll({
      where: {
        resource_type: resource.type,
        resource_id: resource.id
      }
    });

    allRules.push(...rules.map(rule => rule.toJSON()));
  }

  // Trier par priorité (plus haute en premier)
  return allRules.sort((a, b) => b.priority - a.priority);
}

/**
 * Évalue une règle de permission pour un utilisateur/personnage
 * @param {Object} rule - Règle de permission
 * @param {Object} user - Utilisateur connecté
 * @param {Object} character - Personnage (optionnel)
 * @param {Object} resource - Ressource à vérifier (pour author_override)
 * @returns {boolean|null} - true si autorisé, false si refusé, null si ne match pas
 */
function evaluateRule(rule, user, character, resource = null) {
  // Étape 1: Vérifier author_override='or' en premier (avant le rôle)
  if (resource && rule.author_override === 'or') {
    const isAuthor = checkIsAuthor(user, character, resource);
    if (isAuthor) {
      return !rule.is_deny; // Auteur autorisé, respecter is_deny
    }
    // Pas l'auteur, continuer l'évaluation normale
  }

  // Étape 2: Vérifier le rôle
  if (rule.allowed_roles !== null && rule.allowed_roles.length > 0) {
    if (!user || !rule.allowed_roles.includes(user.role)) {
      return null; // Rôle non autorisé, passer à la règle suivante
    }
  }
  // allowed_roles = null signifie "tout le monde" (même non connecté)

  // Si pas d'utilisateur et allowed_roles n'est pas null, refuser
  if (!user && rule.allowed_roles !== null) {
    return null;
  }

  // Étape 3: Vérifier author_override='and'
  if (resource && rule.author_override === 'and') {
    const isAuthor = checkIsAuthor(user, character, resource);
    if (!isAuthor) {
      return null; // Pas l'auteur, règle non applicable
    }
    // Est l'auteur, continuer l'évaluation des conditions
  }

  // Étape 3: Vérifier conditions utilisateur (si rôle applicable)
  if (user && user.role !== 'admin') { // Admin bypass ces conditions
    if (rule.require_terms_accepted && !user.terms_accepted) return null;
    if (rule.require_forum_rules_accepted && !user.forum_rules_accepted) return null;
    if (rule.require_email_verified && !user.email_verified) return null;
  }

  // Étape 4: Vérifier conditions personnage
  if (rule.require_character) {
    if (!character) return null; // Personnage requis mais absent

    // Vérifications selon le rôle
    if (user) {
      if (user.role === 'admin' || user.role === 'moderator') {
        // Admin et moderator peuvent utiliser n'importe quel personnage
      } else if (user.role === 'game_master') {
        // GM peut utiliser les PNJ (user_id null) ou ses propres personnages
        if (character.user_id !== null && character.user_id !== user.id) {
          return null;
        }
      } else {
        // Player: doit être son propre personnage
        if (character.user_id !== user.id) return null;
      }
    }

    // Vérifier vivant
    if (rule.require_character_alive && character.is_dead) return null;

    // Vérifier leader
    if (rule.require_character_is_leader && !character.is_leader) return null;

    // Vérifier faction
    if (rule.required_faction_ids && Array.isArray(rule.required_faction_ids) && rule.required_faction_ids.length > 0) {
      if (!rule.required_faction_ids.includes(character.faction_id)) return null;
    }

    // Vérifier clan
    if (rule.required_clan_ids && Array.isArray(rule.required_clan_ids) && rule.required_clan_ids.length > 0) {
      if (!rule.required_clan_ids.includes(character.clan_id)) return null;
    }
  }

  // Toutes les conditions sont remplies
  // Si c'est une règle de refus, retourner false, sinon true
  return !rule.is_deny;
}

/**
 * Vérifie si l'utilisateur/personnage est l'auteur de la ressource
 * @param {Object} user - Utilisateur
 * @param {Object} character - Personnage
 * @param {Object} resource - Ressource (topic ou post avec author fields)
 * @returns {boolean}
 */
function checkIsAuthor(user, character, resource) {
  if (!resource) return false;

  // Vérifier author_user_id
  if (resource.author_user_id && user && resource.author_user_id === user.id) {
    return true;
  }

  // Vérifier author_character_id
  if (resource.author_character_id && character && resource.author_character_id === character.id) {
    return true;
  }

  return false;
}

/**
 * Vérifie si un utilisateur a une permission sur une ressource
 * @param {Object} user - Utilisateur connecté (peut être null si non connecté)
 * @param {Object} character - Personnage utilisé (optionnel)
 * @param {string} resourceType - 'category', 'section', 'topic'
 * @param {number} resourceId - ID de la ressource
 * @param {string} permissionType - Type de permission à vérifier
 * @param {Object} resource - Ressource complète (pour author_override)
 * @returns {Promise<boolean>} - true si autorisé, false sinon
 */
async function checkPermission(user, character, resourceType, resourceId, permissionType, resource = null) {
  try {
    // Récupérer toutes les règles applicables
    const rules = await getPermissionRules(resourceType, resourceId, permissionType);

    // Évaluer chaque règle par ordre de priorité
    for (const rule of rules) {
      const result = evaluateRule(rule, user, character, resource);

      if (result === true) {
        return true; // Permission accordée
      } else if (result === false) {
        return false; // Permission refusée explicitement
      }
      // result === null: règle non applicable, continuer
    }

    // Aucune règle ne match, appliquer la politique par défaut
    return DEFAULT_POLICIES[permissionType] || false;
  } catch (error) {
    console.error('Erreur lors de la vérification de permission:', error);
    return false; // En cas d'erreur, refuser par sécurité
  }
}

module.exports = {
  checkPermission,
  getPermissionRules,
  getInheritanceChain,
  evaluateRule,
  PERMISSION_MODELS,
  DEFAULT_POLICIES
};
