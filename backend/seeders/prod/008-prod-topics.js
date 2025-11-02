'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Dynamic lookups for foreign keys
    const [sections] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM sections WHERE slug IN ('annonces', 'reglement-et-cgu', 'campement-de-refugies')`
    );

    const sectionIdBySlug = {};
    sections.forEach(section => {
      sectionIdBySlug[section.slug] = section.id;
    });

    const [users] = await queryInterface.sequelize.query(
      `SELECT id, user_name FROM users WHERE user_name = 'l\\'équipe de développement'`
    );

    const devUserId = users[0].id;


    await queryInterface.bulkInsert('topics', [
      // Topic 1: Message de bienvenue dans "Annonces"
      {
        title: 'Bienvenue sur Érosion des Âmes !',
        slug: 'bienvenue-sur-erosion-des-ames',
        section_id: sectionIdBySlug['annonces'], // Section "Annonces"
        author_user_id: devUserId, // Premier utilisateur (admin)
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topic 2: Règlement du Forum dans "Règlement et CGU"
      {
        title: 'Règlement du Forum',
        slug: 'reglement-du-forum',
        section_id: sectionIdBySlug['reglement-et-cgu'], // Section "Règlement et CGU"
        author_user_id: devUserId,
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: true,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topic 3: CGU dans "Règlement et CGU"
      {
        title: 'CGU',
        slug: 'cgu',
        section_id: sectionIdBySlug['reglement-et-cgu'], // Section "Règlement et CGU"
        author_user_id: devUserId,
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 2,
        is_pinned: true,
        is_locked: true,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Topic 4: Présentation dans "Campement de Réfugiés"
      {
        title: 'Hey toi!! Qui es-tu ?',
        slug: 'hey-toi-qui-es-tu',
        section_id: sectionIdBySlug['campement-de-refugies'], // Section "Campement de Réfugiés"
        author_user_id: devUserId,
        author_character_id: null,
        author_name: 'Équipe de Développement',
        faction_id: null,
        clan_id: null,
        is_public: true,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        views_count: 0,
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('topics', null, {});
  }
};
