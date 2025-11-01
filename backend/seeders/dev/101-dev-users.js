'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hasher le même mot de passe pour tous les comptes de test
    const testPassword = await bcrypt.hash('TestDev2024!', 10);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('users', [
      // Compte admin
      {
        id: 1,
        user_name: 'admin',
        email: 'admin@erosion-des-ames.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'admin',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneDayAgo,
        terms_accepted: true,
        terms_accepted_at: oneDayAgo,
        created_at: oneDayAgo,
        updated_at: oneDayAgo
      },
      // Compte moderator
      {
        id: 2,
        user_name: 'moderator',
        email: 'moderator@erosion-des-ames.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'moderator',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneDayAgo,
        terms_accepted: true,
        terms_accepted_at: oneDayAgo,
        created_at: oneDayAgo,
        updated_at: oneDayAgo
      },
      // Compte game-master
      {
        id: 3,
        user_name: 'game-master',
        email: 'gm@erosion-des-ames.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'game-master',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneDayAgo,
        terms_accepted: true,
        terms_accepted_at: oneDayAgo,
        created_at: oneDayAgo,
        updated_at: oneDayAgo
      },
      // Player 1: PJ-eclaireur (Éclaireur sans clan)
      {
        id: 4,
        user_name: 'PJ-eclaireur',
        email: 'pj-eclaireur@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 2: PJ-veilleur (Veilleur sans clan)
      {
        id: 5,
        user_name: 'PJ-veilleur',
        email: 'pj-veilleur@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 3: PJ-neutre (personnage neutre sans clan)
      {
        id: 6,
        user_name: 'PJ-neutre',
        email: 'pj-neutre@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 4: PJ-symbiote (Éclaireur avec clan Symbiotes)
      {
        id: 7,
        user_name: 'PJ-symbiote',
        email: 'pj-symbiote@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 5: PJ-sentinelles (Veilleur avec clan Sentinelles)
      {
        id: 8,
        user_name: 'PJ-sentinelles',
        email: 'pj-sentinelles@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 6: PJ-vagabond (neutre avec clan Vagabonds du Vent)
      {
        id: 9,
        user_name: 'PJ-vagabond',
        email: 'pj-vagabond@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 7: PJ-dead (personnage mort)
      {
        id: 10,
        user_name: 'PJ-dead',
        email: 'pj-dead@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: oneHourAgo,
        updated_at: oneHourAgo
      },
      // Player 8: no-PJ (sans personnage)
      {
        id: 11,
        user_name: 'no-PJ',
        email: 'no-pj@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: true,
        forum_rules_accepted_at: oneHourAgo,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: now,
        updated_at: now
      },
      // Player 9: no-rules (sans personnage, règlement non accepté)
      {
        id: 12,
        user_name: 'no-rules',
        email: 'no-rules@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: false,
        forum_rules_accepted_at: null,
        terms_accepted: true,
        terms_accepted_at: oneHourAgo,
        created_at: now,
        updated_at: now
      },
      // Player 10: no-rules-cgu (sans personnage, règlement et CGU non acceptés)
      {
        id: 13,
        user_name: 'no-rules-cgu',
        email: 'no-rules-cgu@example.com',
        password_hash: testPassword,
        is_active: true,
        email_verified: true,
        role: 'player',
        forum_rules_accepted: false,
        forum_rules_accepted_at: null,
        terms_accepted: false,
        terms_accepted_at: null,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
