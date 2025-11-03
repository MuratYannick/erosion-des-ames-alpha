'use strict';

/**
 * Seeder pour les permissions par défaut du forum
 *
 * Permissions par défaut:
 *
 * 1. CATEGORIES:
 *    - view: tout le monde
 *    - create_section: admin uniquement
 *    - edit: jamais (statique)
 *    - move_section: admin uniquement
 *
 * 2. SECTIONS:
 *    - view: tout le monde
 *    - create_section: admin + moderator (CGU + règlement + email)
 *    - create_topic: admin + moderator (CGU + règlement + email)
 *    - edit: admin + moderator (CGU + règlement + email)
 *    - move_section: admin + moderator (CGU + règlement + email)
 *    - move_topic: admin + moderator (CGU + règlement + email)
 *    - pin: admin + moderator (CGU + règlement + email)
 *    - lock: admin + moderator (CGU + règlement + email)
 *
 * 3. TOPICS:
 *    - view: tout le monde
 *    - edit: admin + moderator (CGU + règlement + email) + l'auteur
 *    - move_post: admin + moderator (CGU + règlement + email)
 *    - pin: admin + moderator (CGU + règlement + email)
 *    - lock: admin + moderator (CGU + règlement + email)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ===== PERMISSIONS POUR CATEGORIES =====

    // VIEW - Tout le monde peut voir les catégories
    await queryInterface.bulkInsert('forum_permissions_view', [{
      resource_type: 'category',
      resource_id: 0, // 0 = règle globale pour toutes les catégories
      allowed_roles: null, // null = tout le monde
      require_terms_accepted: false,
      require_forum_rules_accepted: false,
      require_email_verified: false,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // CREATE_SECTION - Admin uniquement
    await queryInterface.bulkInsert('forum_permissions_create_section', [{
      resource_type: 'category',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin']),
      require_terms_accepted: false,
      require_forum_rules_accepted: false,
      require_email_verified: false,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // EDIT - Jamais (catégories statiques)
    // Pas de règle = politique par défaut (false)

    // MOVE_SECTION - Admin uniquement
    await queryInterface.bulkInsert('forum_permissions_move_section', [{
      resource_type: 'category',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin']),
      require_terms_accepted: false,
      require_forum_rules_accepted: false,
      require_email_verified: false,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // ===== PERMISSIONS POUR SECTIONS =====

    // VIEW - Tout le monde
    await queryInterface.bulkInsert('forum_permissions_view', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: null,
      require_terms_accepted: false,
      require_forum_rules_accepted: false,
      require_email_verified: false,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // CREATE_SECTION - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_create_section', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // CREATE_TOPIC - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_create_topic', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // EDIT - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_edit', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // MOVE_SECTION - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_move_section', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // MOVE_TOPIC - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_move_topic', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // PIN - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_pin', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // LOCK - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_lock', [{
      resource_type: 'section',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // ===== PERMISSIONS POUR TOPICS =====

    // VIEW - Tout le monde
    await queryInterface.bulkInsert('forum_permissions_view', [{
      resource_type: 'topic',
      resource_id: 0,
      allowed_roles: null,
      require_terms_accepted: false,
      require_forum_rules_accepted: false,
      require_email_verified: false,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // EDIT - Admin + Moderator avec conditions OU l'auteur
    await queryInterface.bulkInsert('forum_permissions_edit', [{
      resource_type: 'topic',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'or', // Conditions OU est l'auteur
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // MOVE_POST - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_move_post', [{
      resource_type: 'topic',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // PIN - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_pin', [{
      resource_type: 'topic',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);

    // LOCK - Admin + Moderator avec conditions
    await queryInterface.bulkInsert('forum_permissions_lock', [{
      resource_type: 'topic',
      resource_id: 0,
      allowed_roles: JSON.stringify(['admin', 'moderator']),
      require_terms_accepted: true,
      require_forum_rules_accepted: true,
      require_email_verified: true,
      require_character: false,
      require_character_alive: true,
      require_character_is_leader: false,
      required_faction_ids: null,
      required_clan_ids: null,
      author_override: 'none',
      priority: 0,
      is_deny: false,
      created_at: now,
      updated_at: now
    }]);
  },

  async down(queryInterface, Sequelize) {
    // Supprimer toutes les permissions par défaut (resource_id = 0)
    await queryInterface.bulkDelete('forum_permissions_view', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_create_section', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_create_topic', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_edit', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_move_section', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_move_topic', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_move_post', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_pin', { resource_id: 0 });
    await queryInterface.bulkDelete('forum_permissions_lock', { resource_id: 0 });
  }
};
