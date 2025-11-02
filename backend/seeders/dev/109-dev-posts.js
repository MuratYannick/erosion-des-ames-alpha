'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Dynamic lookups for foreign keys
    const [topics] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM topics`
    );

    const topicIdBySlug = {};
    topics.forEach(topic => {
      topicIdBySlug[topic.slug] = topic.id;
    });

    const [users] = await queryInterface.sequelize.query(
      `SELECT id, user_name FROM users`
    );

    const userIdByName = {};
    users.forEach(user => {
      userIdByName[user.user_name] = user.id;
    });

    const [characters] = await queryInterface.sequelize.query(
      `SELECT id, name FROM characters`
    );

    const characterIdByName = {};
    characters.forEach(char => {
      characterIdByName[char.name] = char.id;
    });


    await queryInterface.bulkInsert('posts', [
      // ==========================================
      // POSTS HRP
      // ==========================================

      // Post 1: Premier post du topic 1 (Annonce admin)
      {
        content: 'Bienvenue à tous dans cette phase de test d\'Érosion des Âmes !\n\nNous sommes ravis de vous accueillir dans ce monde post-apocalyptique où deux factions s\'affrontent pour leur survie. Cette phase de test nous permettra de :\n\n- Tester les fonctionnalités du forum\n- Vérifier le système de permissions\n- Recueillir vos retours pour améliorer l\'expérience de jeu\n\nN\'hésitez pas à explorer toutes les sections, créer vos personnages et participer aux discussions !\n\nBon jeu à tous !',
        topic_id: topicIdBySlug['dev-ouverture-phase-test'], // Ouverture de la phase de test
        author_user_id: userIdByName['admin'], // admin
        author_character_id: null,
        author_name: 'admin',
        is_locked: false,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
        deleted_at: null
      },

      // Post 2: Réponse au topic 1 par moderator
      {
        content: 'Super ! Hâte de voir ce que tout le monde va créer comme histoires. Le système de factions a l\'air vraiment intéressant.',
        topic_id: topicIdBySlug['dev-ouverture-phase-test'],
        author_user_id: userIdByName['moderator'], // moderator
        author_character_id: null,
        author_name: 'moderator',
        is_locked: false,
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },

      // Post 3: Premier post du topic 2 (Suggestion moderator)
      {
        content: 'Salut à tous !\n\nJe me demandais si on pourrait avoir un système de commerce entre joueurs. Ça pourrait être intéressant pour :\n\n1. Échanger des ressources entre personnages\n2. Créer des personnages marchands\n3. Développer des interactions RP autour du commerce\n\nQu\'en pensez-vous ? Est-ce que ça cadrerait bien avec l\'univers du jeu ?',
        topic_id: topicIdBySlug['dev-idee-systeme-commerce'], // Idée : Système de commerce
        author_user_id: userIdByName['moderator'], // moderator
        author_character_id: null,
        author_name: 'moderator',
        is_locked: false,
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },

      // Post 4: Réponse au topic 2 par game-master
      {
        content: 'Excellente idée ! Les Vagabonds du Vent pourraient jouer un rôle important dans ce système. Je note ça pour les futures améliorations.',
        topic_id: topicIdBySlug['dev-idee-systeme-commerce'],
        author_user_id: userIdByName['game-master'], // game-master
        author_character_id: null,
        author_name: 'game-master',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Posts 5-7: Présentations dans le topic 3 (Campement de Réfugiés)
      // Post du créateur du topic
      {
        content: 'Salut tout le monde !\n\nJe m\'appelle PJ-eclaireur et je viens de rejoindre Érosion des Âmes. J\'ai créé un personnage Éveillé, Kael l\'Éveillé, qui vient d\'arriver à l\'Oasis des Transformés.\n\nJ\'ai hâte de découvrir l\'univers et de jouer avec vous tous !',
        topic_id: topicIdBySlug['dev-presentation-pj-eclaireur'], // Présentation de PJ-eclaireur
        author_user_id: userIdByName['PJ-eclaireur'], // PJ-eclaireur
        author_character_id: null,
        author_name: 'PJ-eclaireur',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Réponse de PJ-veilleur
      {
        content: 'Bienvenue ! Moi c\'est PJ-veilleur, j\'ai créé Elena la Pure chez les Veilleurs. On est adversaires en RP mais on peut quand même discuter ici ! 😊',
        topic_id: topicIdBySlug['dev-presentation-pj-eclaireur'],
        author_user_id: userIdByName['PJ-veilleur'], // PJ-veilleur
        author_character_id: null,
        author_name: 'PJ-veilleur',
        is_locked: false,
        created_at: thirtyMinutesAgo,
        updated_at: thirtyMinutesAgo,
        deleted_at: null
      },

      // Réponse de PJ-symbiote
      {
        content: 'Bienvenue parmi les Éveillés ! Si tu as besoin de conseils pour choisir ton clan, n\'hésite pas. Moi j\'ai rejoint les Symbiotes et c\'est passionnant !',
        topic_id: topicIdBySlug['dev-presentation-pj-eclaireur'],
        author_user_id: userIdByName['PJ-symbiote'], // PJ-symbiote
        author_character_id: null,
        author_name: 'PJ-symbiote',
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // POSTS RP
      // ==========================================

      // Posts du topic 4 (Rassemblement des Éveillés - privé Éclaireurs)
      // Post initial par Kael l'Éveillé
      {
        content: '*S\'avance lentement vers la place centrale, observant les autres Éveillés rassemblés*\n\nFrères et sœurs de la mutation... Je suis Kael, nouvellement arrivé à l\'Oasis. J\'ai entendu parler de votre cause et je souhaite comprendre comment je pourrais servir notre peuple.\n\n*Regarde autour de lui avec curiosité*\n\nQuelqu\'un pourrait-il m\'expliquer les rôles des différentes castes ?',
        topic_id: topicIdBySlug['dev-rp-rassemblement-eveilles'], // [RP] Rassemblement des Éveillés
        author_user_id: null,
        author_character_id: characterIdByName['Kael l\'Éveillé'], // Kael l'Éveillé
        author_name: 'Kael l\'Éveillé',
        is_locked: false,
        created_at: twoHoursAgo,
        updated_at: twoHoursAgo,
        deleted_at: null
      },

      // Réponse par Lyra la Cultivatrice
      {
        content: '*Sourit chaleureusement et s\'approche de Kael*\n\nBienvenue, jeune Éveillé. Je suis Lyra, membre de la Caste des Symbiotes. Nous travaillons avec la nature mutée pour nourrir notre peuple et adapter notre Oasis à ce nouveau monde.\n\n*Montre les jardins luxuriants autour d\'eux*\n\nChaque caste a son importance. Les Sensitifs explorent les terres, les Forgerons de Chair nous soignent, les Sentinelles du Chaos nous protègent, et les Scrutateurs étudient les ruines de l\'Ancien Monde.\n\nQu\'est-ce qui t\'attire, Kael ?',
        topic_id: topicIdBySlug['dev-rp-rassemblement-eveilles'],
        author_user_id: null,
        author_character_id: characterIdByName['Lyra la Cultivatrice'], // Lyra la Cultivatrice
        author_name: 'Lyra la Cultivatrice',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Posts du topic 5 (Patrouille nocturne - privé Veilleurs)
      // Post initial par Marcus le Protecteur
      {
        content: '*Se tient droit dans le Hall Principal, armure impeccable*\n\nSentinelles, le rapport de la patrouille de cette nuit est troublant. Des traces de mutants ont été repérées près du secteur nord de la Citadelle.\n\n*Déploie une carte sur la table*\n\nNous devons renforcer la surveillance. Je demande trois volontaires pour une patrouille renforcée à l\'aube. Qui se porte volontaire ?',
        topic_id: topicIdBySlug['dev-rp-patrouille-nocturne'], // [RP] Patrouille nocturne
        author_user_id: null,
        author_character_id: characterIdByName['Marcus le Protecteur'], // Marcus le Protecteur
        author_name: 'Marcus le Protecteur',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Réponse par Elena la Pure
      {
        content: '*S\'avance et salue respectueusement*\n\nCommandant Marcus, je me porte volontaire. Même si je suis nouvelle, je sais manier l\'arc et je connais les protocoles de patrouille.\n\n*Pose la main sur son carquois*\n\nJe ne laisserai aucun mutant menacer notre Citadelle.',
        topic_id: topicIdBySlug['dev-rp-patrouille-nocturne'],
        author_user_id: null,
        author_character_id: characterIdByName['Elena la Pure'], // Elena la Pure
        author_name: 'Elena la Pure',
        is_locked: false,
        created_at: thirtyMinutesAgo,
        updated_at: thirtyMinutesAgo,
        deleted_at: null
      },

      // Posts du topic 6 (Caravane dans le désert - public)
      // Post initial par Zara la Marcheuse
      {
        content: '*Arrête sa caravane près d\'un point d\'eau asséché*\n\nEncre une journée de marche à travers ces terres maudites... Mais les Vagabonds du Vent ne s\'arrêtent jamais.\n\n*Sort des marchandises de ses sacoches*\n\nJ\'ai des nouvelles des deux factions, des vivres, et quelques objets intéressants à échanger. Que quelqu\'un m\'entende ou non, je continuerai ma route demain à l\'aube.\n\n*S\'assoit près d\'un feu de camp improvisé*\n\nCe monde est hostile, mais il y a encore des gens qui ont besoin de commerce et d\'information.',
        topic_id: topicIdBySlug['dev-rp-caravane-desert'], // [RP] Une caravane dans le désert
        author_user_id: null,
        author_character_id: characterIdByName['Zara la Marcheuse'], // Zara la Marcheuse
        author_name: 'Zara la Marcheuse',
        is_locked: false,
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },

      // Réponse par Ash le Solitaire
      {
        content: '*Émerge de l\'ombre d\'un rocher, capuche rabattue*\n\nMarchande. Je t\'ai suivie depuis le dernier campement.\n\n*S\'approche lentement, mains visibles*\n\nPas d\'inquiétude, je ne suis pas hostile. J\'ai besoin d\'informations sur les mouvements des Éclaireurs dans la région ouest. Et j\'ai de quoi payer.\n\n*Montre une bourse en cuir*\n\nQu\'as-tu entendu ?',
        topic_id: topicIdBySlug['dev-rp-caravane-desert'],
        author_user_id: null,
        author_character_id: characterIdByName['Ash le Solitaire'], // Ash le Solitaire
        author_name: 'Ash le Solitaire',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Posts du topic 7 (Arrivée d'un étranger - public)
      // Post initial par Ash le Solitaire
      {
        content: '*S\'arrête devant l\'entrée de l\'Oasis, observant les gardes*\n\nJe cherche refuge pour la nuit. Je ne suis pas membre de votre faction, mais je ne suis pas une menace non plus.\n\n*Écarte lentement les mains, montrant qu\'il n\'est pas armé*\n\nJe suis un Éveillé, comme vous. Mais je préfère rester libre plutôt que de choisir un camp dans cette guerre absurde.\n\n*Regarde vers l\'horizon*\n\nUne nuit à l\'abri, c\'est tout ce que je demande. Je repartirai à l\'aube.',
        topic_id: topicIdBySlug['dev-rp-arrivee-etranger'], // [RP] Arrivée d'un étranger
        author_user_id: null,
        author_character_id: characterIdByName['Ash le Solitaire'], // Ash le Solitaire
        author_name: 'Ash le Solitaire',
        is_locked: false,
        created_at: twoHoursAgo,
        updated_at: twoHoursAgo,
        deleted_at: null
      },

      // Réponse par Kael l'Éveillé
      {
        content: '*Sort de l\'Oasis et observe l\'étranger avec curiosité*\n\nUn Éveillé neutre ? C\'est rare de nos jours...\n\n*Se tourne vers l\'intérieur de l\'Oasis*\n\nJe ne suis pas garde, mais je peux aller chercher quelqu\'un qui pourra décider. Tu dis vouloir rester neutre, mais dans ce monde, peut-on vraiment se le permettre ?\n\n*Croise les bras, attendant une réponse*',
        topic_id: topicIdBySlug['dev-rp-arrivee-etranger'],
        author_user_id: null,
        author_character_id: characterIdByName['Kael l\'Éveillé'], // Kael l'Éveillé
        author_name: 'Kael l\'Éveillé',
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
