'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('sections', [
      // Catégorie 1: Annonces Officielles
      {
        id: 1,
        name: 'Annonces du Staff',
        description: 'Annonces officielles de l\'équipe d\'administration.',
        category_id: 1,
        parent_section_id: null, // Section de premier niveau
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
        name: 'Événements & Quêtes',
        description: 'Annonces des événements et quêtes spéciales.',
        category_id: 1,
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

      // Catégorie 2: Taverne du Voyageur
      {
        id: 3,
        name: 'Présentations',
        description: 'Venez vous présenter à la communauté !',
        category_id: 2,
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
        id: 4,
        name: 'Discussions Générales',
        description: 'Discussions hors-jeu sur tous les sujets.',
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

      // Catégorie 3: Le Monde d'Érosion des Âmes
      {
        id: 5,
        name: 'Lore & Histoire',
        description: 'Découvrez l\'histoire et les légendes du monde.',
        category_id: 3,
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

      // Catégorie 4: Roleplay In-Game (avec affiliations)
      {
        id: 6,
        name: 'Le Royaume de Lumière',
        description: 'Section RP pour la faction du Royaume de Lumière.',
        category_id: 4,
        parent_section_id: null,
        faction_id: 1, // Royaume de Lumière
        clan_id: null,
        is_public: true, // Visible par tous
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 7,
        name: 'Quartier des Chevaliers',
        description: 'Zone réservée aux Chevaliers de l\'Aube.',
        category_id: 4,
        parent_section_id: 6, // Sous-section du Royaume
        faction_id: 1,
        clan_id: 1, // Chevaliers de l'Aube
        is_public: false, // Restreint au clan
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 8,
        name: 'La Horde Sauvage',
        description: 'Section RP pour la faction de la Horde Sauvage.',
        category_id: 4,
        parent_section_id: null,
        faction_id: 3, // Horde Sauvage
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
        name: 'Campement du Crâne Brisé',
        description: 'Zone privée de la tribu du Crâne Brisé.',
        category_id: 4,
        parent_section_id: 8, // Sous-section de la Horde
        faction_id: 3,
        clan_id: 4, // Tribu du Crâne Brisé
        is_public: false, // Restreint au clan
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Catégorie 5: Support & Aide
      {
        id: 10,
        name: 'Questions Techniques',
        description: 'Problèmes techniques ? Posez vos questions ici.',
        category_id: 5,
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
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sections', null, {});
  }
};
