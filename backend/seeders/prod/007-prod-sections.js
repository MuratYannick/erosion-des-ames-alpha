'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('sections', [
      // ==========================================
      // CATÉGORIE 1: FORUM GÉNÉRAL
      // ==========================================
      {
        id: 1,
        name: 'Annonces',
        description: 'Annonces de Staff et events.',
        category_id: 1, // Forum Général
        parent_section_id: null,
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 2,
        name: 'Règlement et CGU',
        description: 'Règlement du site et Conditions Générales d\'Utilisation.',
        category_id: 1,
        parent_section_id: null,
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 2,
        is_pinned: false,
        is_locked: true,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'Survivre dans ce Monde Cruel',
        description: 'Règles du jeu et FAQ.',
        category_id: 1,
        parent_section_id: null,
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 3,
        is_pinned: false,
        is_locked: true,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 4,
        name: 'Campement de Réfugiés',
        description: 'Présentez-vous à la communauté !',
        category_id: 1,
        parent_section_id: null,
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // CATÉGORIE 2: FORUM HRP (HORS ROLE-PLAY)
      // ==========================================
      {
        id: 5,
        name: 'Autour du Jeu',
        description: 'Idées d\'amélioration du jeu, rapport de bugs, suggestions, etc.',
        category_id: 2, // Forum HRP
        parent_section_id: null,
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 6,
        name: 'Autour d\'un Feu de Camp',
        description: 'Discussions sur tout et n\'importe quoi : centres d\'intérêts, cinéma, musique, blagues, etc.',
        category_id: 2,
        parent_section_id: null,
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // CATÉGORIE 3: FORUM RP (ROLE-PLAY)
      // ==========================================
      {
        id: 7,
        name: 'Entrée de l\'Oasis des Transformés',
        description: 'Tout ce qui concerne les Éclaireurs de l\'Aube Nouvelle.',
        category_id: 3, // Forum RP
        parent_section_id: null,
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 8,
        name: 'Portes de la Citadelle du Renouveau',
        description: 'Tout ce qui concerne les Veilleurs de l\'Ancien Monde.',
        category_id: 3,
        parent_section_id: null,
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        clan_id: null,
        is_public: true,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 9,
        name: 'Les Rumeurs des Terres Abandonnées',
        description: 'Tout ce qui se passe en dehors des factions.',
        category_id: 3,
        parent_section_id: null,
        faction_id: null, // Pas de faction
        clan_id: null,
        is_public: true,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sections', null, {});
  }
};
