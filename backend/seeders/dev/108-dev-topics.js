'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('topics', [
      // ==========================================
      // FORUM GÉNÉRAL - Topics HRP
      // ==========================================

      // Topic 1: Annonce par admin dans "Annonces" (section 1)
      {
        id: 1,
        title: 'Ouverture de la phase de test !',
        slug: 'dev-ouverture-phase-test',
        section_id: 1, // Annonces
        author_user_id: 1, // admin
        author_character_id: null,
        author_name: 'admin',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        views_count: 42,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
        deleted_at: null
      },

      // Topic 2: Suggestion par moderator dans "Autour du Jeu" (section 5)
      {
        id: 2,
        title: 'Idée : Système de commerce entre joueurs',
        slug: 'dev-idee-systeme-commerce',
        section_id: 5, // Autour du Jeu
        author_user_id: 2, // moderator
        author_character_id: null,
        author_name: 'moderator',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 18,
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },

      // Topic 3: Présentations dans "Campement de Réfugiés" (section 4)
      {
        id: 3,
        title: 'Présentation de PJ-eclaireur',
        slug: 'dev-presentation-pj-eclaireur',
        section_id: 4, // Campement de Réfugiés
        author_user_id: 4, // PJ-eclaireur
        author_character_id: null,
        author_name: 'PJ-eclaireur',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 12,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // ==========================================
      // FORUM RP - Topics par des personnages
      // ==========================================

      // Topic 4: Topic RP dans "Place Centrale de l'Oasis" (section 11, privé Éclaireurs)
      {
        id: 4,
        title: '[RP] Rassemblement des Éveillés',
        slug: 'dev-rp-rassemblement-eveilles',
        section_id: 11, // Place Centrale de l'Oasis (privé faction Éclaireurs)
        author_user_id: null,
        author_character_id: 1, // Kael l'Éveillé (PJ-eclaireur)
        author_name: 'Kael l\'Éveillé',
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: null,
        is_public: false,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 15,
        created_at: twoHoursAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Topic 5: Topic RP dans "Hall Principal de la Citadelle" (section 15, privé Veilleurs)
      {
        id: 5,
        title: '[RP] Patrouille nocturne',
        slug: 'dev-rp-patrouille-nocturne',
        section_id: 15, // Hall Principal de la Citadelle (privé faction Veilleurs)
        author_user_id: null,
        author_character_id: 5, // Marcus le Protecteur (PJ-sentinelles)
        author_name: 'Marcus le Protecteur',
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        clan_id: 8, // Le Clan des Sentinelles
        is_public: false,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 9,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Topic 6: Topic RP dans "Les Rumeurs des Terres Abandonnées" (section 9, public)
      {
        id: 6,
        title: '[RP] Une caravane dans le désert',
        slug: 'dev-rp-caravane-desert',
        section_id: 9, // Les Rumeurs des Terres Abandonnées (public)
        author_user_id: null,
        author_character_id: 6, // Zara la Marcheuse (PJ-vagabond)
        author_name: 'Zara la Marcheuse',
        faction_id: null,
        clan_id: 15, // Les Vagabonds du Vent
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 23,
        created_at: oneDayAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Topic 7: Topic RP dans "Entrée de l'Oasis des Transformés" (section 7, public)
      {
        id: 7,
        title: '[RP] Arrivée d\'un étranger',
        slug: 'dev-rp-arrivee-etranger',
        section_id: 7, // Entrée de l'Oasis des Transformés (public)
        author_user_id: null,
        author_character_id: 3, // Ash le Solitaire (PJ-neutre)
        author_name: 'Ash le Solitaire',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 0,
        is_pinned: false,
        is_locked: false,
        views_count: 8,
        created_at: twoHoursAgo,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('topics', null, {});
  }
};
