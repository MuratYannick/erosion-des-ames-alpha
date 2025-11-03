'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Dynamic lookups for foreign keys
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories WHERE slug IN ('forum-general', 'forum-hrp', 'forum-rp')`
    );

    const categoryIdBySlug = {};
    categories.forEach(cat => {
      categoryIdBySlug[cat.slug] = cat.id;
    });

    const [factions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM factions WHERE name IN ('Les Éclaireurs de l\\'Aube Nouvelle', 'Les Veilleurs de l\\'Ancien Monde')`
    );

    const factionEclaireurs = factions.find(f => f.name === 'Les Éclaireurs de l\'Aube Nouvelle');
    const factionVeilleurs = factions.find(f => f.name === 'Les Veilleurs de l\'Ancien Monde');

    const [clans] = await queryInterface.sequelize.query(`SELECT id, name FROM clans`);

    const clanIdByName = {};
    clans.forEach(clan => {
      clanIdByName[clan.name] = clan.id;
    });

    // Insert parent sections first (those with parent_section_id: null)

    await queryInterface.bulkInsert('sections', [
      // ==========================================
      // CATÉGORIE 1: FORUM GÉNÉRAL
      // ==========================================
      {
        name: 'Annonces',
        slug: 'annonces',
        description: 'Annonces de Staff et events.',
        category_id: categoryIdBySlug['forum-general'], // Forum Général
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
        name: 'Règlement et CGU',
        slug: 'reglement-et-cgu',
        description: 'Règlement du site et Conditions Générales d\'Utilisation.',
        category_id: categoryIdBySlug['forum-general'],
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
        name: 'Survivre dans ce Monde Cruel',
        slug: 'survivre-dans-ce-monde-cruel',
        description: 'Règles du jeu et FAQ.',
        category_id: categoryIdBySlug['forum-general'],
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
        name: 'Campement de Réfugiés',
        slug: 'campement-de-refugies',
        description: 'Présentez-vous à la communauté !',
        category_id: categoryIdBySlug['forum-general'],
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
        name: 'Autour du Jeu',
        slug: 'autour-du-jeu',
        description: 'Idées d\'amélioration du jeu, rapport de bugs, suggestions, etc.',
        category_id: categoryIdBySlug['forum-hrp'], // Forum HRP
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
        name: 'Autour d\'un Feu de Camp',
        slug: 'autour-dun-feu-de-camp',
        description: 'Discussions sur tout et n\'importe quoi : centres d\'intérêts, cinéma, musique, blagues, etc.',
        category_id: categoryIdBySlug['forum-hrp'],
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
        name: 'Entrée de l\'Oasis des Transformés',
        slug: 'entree-oasis-des-transformes',
        description: 'Tout ce qui concerne les Éclaireurs de l\'Aube Nouvelle.',
        category_id: categoryIdBySlug['forum-rp'], // Forum RP
        parent_section_id: null,
        faction_id: factionEclaireurs.id, // Les Éclaireurs de l'Aube Nouvelle
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
        name: 'Portes de la Citadelle du Renouveau',
        slug: 'portes-citadelle-du-renouveau',
        description: 'Tout ce qui concerne les Veilleurs de l\'Ancien Monde.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: null,
        faction_id: factionVeilleurs.id, // Les Veilleurs de l'Ancien Monde
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
        name: 'Les Rumeurs des Terres Abandonnées',
        slug: 'rumeurs-terres-abandonnees',
        description: 'Tout ce qui se passe en dehors des factions.',
        category_id: categoryIdBySlug['forum-rp'],
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
      },

      // ==========================================
    ], {});

    // Query inserted parent sections to get their IDs for child sections
    const [insertedSections] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM sections`
    );

    const sectionIdBySlug = {};
    insertedSections.forEach(section => {
      sectionIdBySlug[section.slug] = section.id;
    });

    // ==========================================
    // SOUS-SECTIONS: OASIS DES TRANSFORMÉS (Éclaireurs)
    // ==========================================
    await queryInterface.bulkInsert('sections', [
      // ==========================================
      {
        name: 'Annonces de la Faction',
        slug: 'eclaireurs-annonces',
        description: 'Annonces officielles des Éclaireurs de l\'Aube Nouvelle.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['entree-oasis-des-transformes'], // Parent: Entrée de l'Oasis des Transformés
        faction_id: factionEclaireurs.id,
        clan_id: null,
        is_public: false, // Réservé aux membres de la faction
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Place Centrale de l\'Oasis',
        slug: 'eclaireurs-place-centrale',
        description: 'Lieu de rassemblement et discussions entre Éclaireurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['entree-oasis-des-transformes'],
        faction_id: factionEclaireurs.id,
        clan_id: null,
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'eclaireurs-missions',
        description: 'Propositions de missions et contrats pour les Éclaireurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['entree-oasis-des-transformes'],
        faction_id: factionEclaireurs.id,
        clan_id: null,
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Quartiers des Clans',
        slug: 'eclaireurs-quartiers-clans',
        description: 'Espaces réservés aux différents clans des Éclaireurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['entree-oasis-des-transformes'],
        faction_id: factionEclaireurs.id,
        clan_id: null,
        is_public: false,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // SOUS-SECTIONS: CITADELLE DU RENOUVEAU (Veilleurs)
      // ==========================================
      {
        name: 'Annonces de la Faction',
        slug: 'veilleurs-annonces',
        description: 'Annonces officielles des Veilleurs de l\'Ancien Monde.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['portes-citadelle-du-renouveau'], // Parent: Portes de la Citadelle du Renouveau
        faction_id: factionVeilleurs.id,
        clan_id: null,
        is_public: false, // Réservé aux membres de la faction
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Hall Principal de la Citadelle',
        slug: 'veilleurs-hall-principal',
        description: 'Lieu de rassemblement et discussions entre Veilleurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['portes-citadelle-du-renouveau'],
        faction_id: factionVeilleurs.id,
        clan_id: null,
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'veilleurs-missions',
        description: 'Propositions de missions et contrats pour les Veilleurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['portes-citadelle-du-renouveau'],
        faction_id: factionVeilleurs.id,
        clan_id: null,
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Quartiers des Clans',
        slug: 'veilleurs-quartiers-clans',
        description: 'Espaces réservés aux différents clans des Veilleurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['portes-citadelle-du-renouveau'],
        faction_id: factionVeilleurs.id,
        clan_id: null,
        is_public: false,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Panneau d'Affichage PUBLIC pour Éclaireurs
      {
        name: 'Panneau d\'Affichage',
        slug: 'eclaireurs-panneau-affichage',
        description: 'Informations publiques et messages des Éclaireurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['entree-oasis-des-transformes'],
        faction_id: factionEclaireurs.id,
        clan_id: null,
        is_public: true, // PUBLIC
        display_order: 5,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Panneau d'Affichage PUBLIC pour Veilleurs
      {
        name: 'Panneau d\'Affichage',
        slug: 'veilleurs-panneau-affichage',
        description: 'Informations publiques et messages des Veilleurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['portes-citadelle-du-renouveau'],
        faction_id: factionVeilleurs.id,
        clan_id: null,
        is_public: true, // PUBLIC
        display_order: 5,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // SOUS-SECTIONS: CLANS JOUABLES ÉCLAIREURS
      // ==========================================
      // Clan 2: La Caste des Symbiotes
      {
        name: 'La Caste des Symbiotes',
        slug: 'clan-symbiotes',
        description: 'Espace du clan des Symbiotes.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['eclaireurs-quartiers-clans'], // Quartiers des Clans Éclaireurs
        faction_id: factionEclaireurs.id,
        clan_id: clanIdByName['La Caste des Symbiotes'],
        is_public: false,
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 3: La Caste des Sensitifs
      {
        name: 'La Caste des Sensitifs',
        slug: 'clan-sensitifs',
        description: 'Espace du clan des Sensitifs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['eclaireurs-quartiers-clans'],
        faction_id: factionEclaireurs.id,
        clan_id: clanIdByName['La Caste des Sensitifs'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 4: La Caste des Forgerons de Chair
      {
        name: 'La Caste des Forgerons de Chair',
        slug: 'clan-forgerons-chair',
        description: 'Espace du clan des Forgerons de Chair.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['eclaireurs-quartiers-clans'],
        faction_id: factionEclaireurs.id,
        clan_id: clanIdByName['La Caste des Forgerons de Chair'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 5: La Caste des Sentinelles du Chaos
      {
        name: 'La Caste des Sentinelles du Chaos',
        slug: 'clan-sentinelles-chaos',
        description: 'Espace du clan des Sentinelles du Chaos.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['eclaireurs-quartiers-clans'],
        faction_id: factionEclaireurs.id,
        clan_id: clanIdByName['La Caste des Sentinelles du Chaos'],
        is_public: false,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 6: La Caste des Scrutateurs
      {
        name: 'La Caste des Scrutateurs',
        slug: 'clan-scrutateurs',
        description: 'Espace du clan des Scrutateurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['eclaireurs-quartiers-clans'],
        faction_id: factionEclaireurs.id,
        clan_id: clanIdByName['La Caste des Scrutateurs'],
        is_public: false,
        display_order: 5,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // SOUS-SECTIONS: CLANS JOUABLES VEILLEURS
      // ==========================================
      // Clan 8: Le Clan des Sentinelles
      {
        name: 'Le Clan des Sentinelles',
        slug: 'clan-sentinelles',
        description: 'Espace du Clan des Sentinelles.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['veilleurs-quartiers-clans'], // Quartiers des Clans Veilleurs
        faction_id: factionVeilleurs.id,
        clan_id: clanIdByName['Le Clan des Sentinelles'],
        is_public: false,
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 9: Le Clan des Pourvoyeurs
      {
        name: 'Le Clan des Pourvoyeurs',
        slug: 'clan-pourvoyeurs',
        description: 'Espace du Clan des Pourvoyeurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['veilleurs-quartiers-clans'],
        faction_id: factionVeilleurs.id,
        clan_id: clanIdByName['Le Clan des Pourvoyeurs'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 10: Le Clan des Archivistes
      {
        name: 'Le Clan des Archivistes',
        slug: 'clan-archivistes',
        description: 'Espace du Clan des Archivistes.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['veilleurs-quartiers-clans'],
        faction_id: factionVeilleurs.id,
        clan_id: clanIdByName['Le Clan des Archivistes'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 11: Le Clan des Purificateurs
      {
        name: 'Le Clan des Purificateurs',
        slug: 'clan-purificateurs',
        description: 'Espace du Clan des Purificateurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['veilleurs-quartiers-clans'],
        faction_id: factionVeilleurs.id,
        clan_id: clanIdByName['Le Clan des Purificateurs'],
        is_public: false,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 12: Le Clan des Explorateurs
      {
        name: 'Le Clan des Explorateurs',
        slug: 'clan-explorateurs',
        description: 'Espace du Clan des Explorateurs.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['veilleurs-quartiers-clans'],
        faction_id: factionVeilleurs.id,
        clan_id: clanIdByName['Le Clan des Explorateurs'],
        is_public: false,
        display_order: 5,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // SECTIONS: CLANS NEUTRES (sous "Les Rumeurs des Terres Abandonnées")
      // ==========================================
      // Clan 13: Les Veilleurs des Ruines
      {
        name: 'Les Veilleurs des Ruines',
        slug: 'clan-veilleurs-ruines',
        description: 'Archéologues impartiaux explorant les ruines du monde ancien.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'], // Les Rumeurs des Terres Abandonnées
        faction_id: null,
        clan_id: clanIdByName['Les Veilleurs des Ruines'],
        is_public: true,
        display_order: 1,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 14: Le Peuple des Ombres
      {
        name: 'Le Peuple des Ombres',
        slug: 'clan-peuple-ombres',
        description: 'Mutants furtifs vivant dans les ténèbres.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Le Peuple des Ombres'],
        is_public: true,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 15: Les Vagabonds du Vent
      {
        name: 'Les Vagabonds du Vent',
        slug: 'clan-vagabonds-vent',
        description: 'Marchands nomades parcourant les terres désolées.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Vagabonds du Vent'],
        is_public: true,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 16: Les Artisans du Réemploi
      {
        name: 'Les Artisans du Réemploi',
        slug: 'clan-artisans-reemploi',
        description: 'Réparateurs et bricoleurs de génie.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Artisans du Réemploi'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 17: Les Frères de la Terre Brûlée
      {
        name: 'Les Frères de la Terre Brûlée',
        slug: 'clan-freres-terre-brulee',
        description: 'Mercenaires sans foi ni loi.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Frères de la Terre Brûlée'],
        is_public: true,
        display_order: 5,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 18: Le Sanctuaire du Silence
      {
        name: 'Le Sanctuaire du Silence',
        slug: 'clan-sanctuaire-silence',
        description: 'Pacifistes refusant tout conflit.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Le Sanctuaire du Silence'],
        is_public: true,
        display_order: 6,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 19: Les Collecteurs de Chuchotis
      {
        name: 'Les Collecteurs de Chuchotis',
        slug: 'clan-collecteurs-chuchotis',
        description: 'Espions et informateurs des terres désolées.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Collecteurs de Chuchotis'],
        is_public: true,
        display_order: 7,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 20: Les Semeurs d'Espoir
      {
        name: 'Les Semeurs d\'Espoir',
        slug: 'clan-semeurs-espoir',
        description: 'Cherchant la réconciliation entre les peuples.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Semeurs d\'Espoir'],
        is_public: true,
        display_order: 8,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 21: Les Loups Solitaires
      {
        name: 'Les Loups Solitaires',
        slug: 'clan-loups-solitaires',
        description: 'Bandits et pillards des ruines.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Loups Solitaires'],
        is_public: true,
        display_order: 9,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      // Clan 22: Les Dévoreurs d'Âmes
      {
        name: 'Les Dévoreurs d\'Âmes',
        slug: 'clan-devoreurs-ames',
        description: 'Cannibales fanatiques des terres maudites.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['rumeurs-terres-abandonnees'],
        faction_id: null,
        clan_id: clanIdByName['Les Dévoreurs d\'Âmes'],
        is_public: true,
        display_order: 10,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // SOUS-SECTIONS: CLANS NEUTRES (4 sous-sections par clan)
      // ==========================================
      // Clan 13: Les Veilleurs des Ruines
      {
        name: 'Annonces du Clan',
        slug: 'veilleurs-ruines-annonces',
        description: 'Annonces officielles des Veilleurs des Ruines.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-veilleurs-ruines'],
        faction_id: null,
        clan_id: clanIdByName['Les Veilleurs des Ruines'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'veilleurs-ruines-rassemblement',
        description: 'Discussions entre membres des Veilleurs des Ruines.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-veilleurs-ruines'],
        faction_id: null,
        clan_id: clanIdByName['Les Veilleurs des Ruines'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'veilleurs-ruines-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-veilleurs-ruines'],
        faction_id: null,
        clan_id: clanIdByName['Les Veilleurs des Ruines'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'veilleurs-ruines-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-veilleurs-ruines'],
        faction_id: null,
        clan_id: clanIdByName['Les Veilleurs des Ruines'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 14: Le Peuple des Ombres
      {
        name: 'Annonces du Clan',
        slug: 'peuple-ombres-annonces',
        description: 'Annonces officielles du Peuple des Ombres.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-peuple-ombres'],
        faction_id: null,
        clan_id: clanIdByName['Le Peuple des Ombres'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'peuple-ombres-rassemblement',
        description: 'Discussions entre membres du Peuple des Ombres.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-peuple-ombres'],
        faction_id: null,
        clan_id: clanIdByName['Le Peuple des Ombres'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'peuple-ombres-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-peuple-ombres'],
        faction_id: null,
        clan_id: clanIdByName['Le Peuple des Ombres'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'peuple-ombres-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-peuple-ombres'],
        faction_id: null,
        clan_id: clanIdByName['Le Peuple des Ombres'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 15: Les Vagabonds du Vent
      {
        name: 'Annonces du Clan',
        slug: 'vagabonds-vent-annonces',
        description: 'Annonces officielles des Vagabonds du Vent.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-vagabonds-vent'],
        faction_id: null,
        clan_id: clanIdByName['Les Vagabonds du Vent'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'vagabonds-vent-rassemblement',
        description: 'Discussions entre membres des Vagabonds du Vent.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-vagabonds-vent'],
        faction_id: null,
        clan_id: clanIdByName['Les Vagabonds du Vent'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'vagabonds-vent-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-vagabonds-vent'],
        faction_id: null,
        clan_id: clanIdByName['Les Vagabonds du Vent'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'vagabonds-vent-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-vagabonds-vent'],
        faction_id: null,
        clan_id: clanIdByName['Les Vagabonds du Vent'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 16: Les Artisans du Réemploi
      {
        name: 'Annonces du Clan',
        slug: 'artisans-reemploi-annonces',
        description: 'Annonces officielles des Artisans du Réemploi.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-artisans-reemploi'],
        faction_id: null,
        clan_id: clanIdByName['Les Artisans du Réemploi'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'artisans-reemploi-rassemblement',
        description: 'Discussions entre membres des Artisans du Réemploi.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-artisans-reemploi'],
        faction_id: null,
        clan_id: clanIdByName['Les Artisans du Réemploi'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'artisans-reemploi-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-artisans-reemploi'],
        faction_id: null,
        clan_id: clanIdByName['Les Artisans du Réemploi'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'artisans-reemploi-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-artisans-reemploi'],
        faction_id: null,
        clan_id: clanIdByName['Les Artisans du Réemploi'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 17: Les Frères de la Terre Brûlée
      {
        name: 'Annonces du Clan',
        slug: 'freres-terre-brulee-annonces',
        description: 'Annonces officielles des Frères de la Terre Brûlée.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-freres-terre-brulee'],
        faction_id: null,
        clan_id: clanIdByName['Les Frères de la Terre Brûlée'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'freres-terre-brulee-rassemblement',
        description: 'Discussions entre membres des Frères de la Terre Brûlée.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-freres-terre-brulee'],
        faction_id: null,
        clan_id: clanIdByName['Les Frères de la Terre Brûlée'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'freres-terre-brulee-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-freres-terre-brulee'],
        faction_id: null,
        clan_id: clanIdByName['Les Frères de la Terre Brûlée'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'freres-terre-brulee-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-freres-terre-brulee'],
        faction_id: null,
        clan_id: clanIdByName['Les Frères de la Terre Brûlée'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 18: Le Sanctuaire du Silence
      {
        name: 'Annonces du Clan',
        slug: 'sanctuaire-silence-annonces',
        description: 'Annonces officielles du Sanctuaire du Silence.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-sanctuaire-silence'],
        faction_id: null,
        clan_id: clanIdByName['Le Sanctuaire du Silence'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'sanctuaire-silence-rassemblement',
        description: 'Discussions entre membres du Sanctuaire du Silence.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-sanctuaire-silence'],
        faction_id: null,
        clan_id: clanIdByName['Le Sanctuaire du Silence'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'sanctuaire-silence-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-sanctuaire-silence'],
        faction_id: null,
        clan_id: clanIdByName['Le Sanctuaire du Silence'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'sanctuaire-silence-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-sanctuaire-silence'],
        faction_id: null,
        clan_id: clanIdByName['Le Sanctuaire du Silence'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 19: Les Collecteurs de Chuchotis
      {
        name: 'Annonces du Clan',
        slug: 'collecteurs-chuchotis-annonces',
        description: 'Annonces officielles des Collecteurs de Chuchotis.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-collecteurs-chuchotis'],
        faction_id: null,
        clan_id: clanIdByName['Les Collecteurs de Chuchotis'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'collecteurs-chuchotis-rassemblement',
        description: 'Discussions entre membres des Collecteurs de Chuchotis.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-collecteurs-chuchotis'],
        faction_id: null,
        clan_id: clanIdByName['Les Collecteurs de Chuchotis'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'collecteurs-chuchotis-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-collecteurs-chuchotis'],
        faction_id: null,
        clan_id: clanIdByName['Les Collecteurs de Chuchotis'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'collecteurs-chuchotis-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-collecteurs-chuchotis'],
        faction_id: null,
        clan_id: clanIdByName['Les Collecteurs de Chuchotis'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 20: Les Semeurs d'Espoir
      {
        name: 'Annonces du Clan',
        slug: 'semeurs-espoir-annonces',
        description: 'Annonces officielles des Semeurs d\'Espoir.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-semeurs-espoir'],
        faction_id: null,
        clan_id: clanIdByName['Les Semeurs d\'Espoir'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'semeurs-espoir-rassemblement',
        description: 'Discussions entre membres des Semeurs d\'Espoir.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-semeurs-espoir'],
        faction_id: null,
        clan_id: clanIdByName['Les Semeurs d\'Espoir'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'semeurs-espoir-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-semeurs-espoir'],
        faction_id: null,
        clan_id: clanIdByName['Les Semeurs d\'Espoir'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'semeurs-espoir-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-semeurs-espoir'],
        faction_id: null,
        clan_id: clanIdByName['Les Semeurs d\'Espoir'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 21: Les Loups Solitaires
      {
        name: 'Annonces du Clan',
        slug: 'loups-solitaires-annonces',
        description: 'Annonces officielles des Loups Solitaires.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-loups-solitaires'],
        faction_id: null,
        clan_id: clanIdByName['Les Loups Solitaires'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'loups-solitaires-rassemblement',
        description: 'Discussions entre membres des Loups Solitaires.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-loups-solitaires'],
        faction_id: null,
        clan_id: clanIdByName['Les Loups Solitaires'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'loups-solitaires-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-loups-solitaires'],
        faction_id: null,
        clan_id: clanIdByName['Les Loups Solitaires'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'loups-solitaires-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-loups-solitaires'],
        faction_id: null,
        clan_id: clanIdByName['Les Loups Solitaires'],
        is_public: true,
        display_order: 4,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clan 22: Les Dévoreurs d'Âmes
      {
        name: 'Annonces du Clan',
        slug: 'devoreurs-ames-annonces',
        description: 'Annonces officielles des Dévoreurs d\'Âmes.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-devoreurs-ames'],
        faction_id: null,
        clan_id: clanIdByName['Les Dévoreurs d\'Âmes'],
        is_public: false,
        display_order: 1,
        is_pinned: true,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Lieu de Rassemblement',
        slug: 'devoreurs-ames-rassemblement',
        description: 'Discussions entre membres des Dévoreurs d\'Âmes.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-devoreurs-ames'],
        faction_id: null,
        clan_id: clanIdByName['Les Dévoreurs d\'Âmes'],
        is_public: false,
        display_order: 2,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Missions et Contrats',
        slug: 'devoreurs-ames-missions',
        description: 'Propositions de missions du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-devoreurs-ames'],
        faction_id: null,
        clan_id: clanIdByName['Les Dévoreurs d\'Âmes'],
        is_public: false,
        display_order: 3,
        is_pinned: false,
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Panneau d\'Affichage',
        slug: 'devoreurs-ames-panneau',
        description: 'Informations publiques du clan.',
        category_id: categoryIdBySlug['forum-rp'],
        parent_section_id: sectionIdBySlug['clan-devoreurs-ames'],
        faction_id: null,
        clan_id: clanIdByName['Les Dévoreurs d\'Âmes'],
        is_public: true,
        display_order: 4,
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
