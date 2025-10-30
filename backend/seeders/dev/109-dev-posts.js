'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('posts', [
      // Posts dans le topic d'annonce
      {
        id: 1,
        content: 'Bienvenue à tous les aventuriers sur le forum d\'Érosion des Âmes ! Ce monde fantastique vous attend avec ses mystères, ses dangers et ses légendes. Amusez-vous bien et respectez les règles du forum !',
        topic_id: 1,
        author_user_id: 1, // admin
        author_character_id: null,
        author_name: 'admin',
        is_locked: false,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
        deleted_at: null
      },

      // Posts dans la présentation
      {
        id: 2,
        content: 'Salut tout le monde ! Je suis nouveau ici et j\'ai hâte de découvrir ce monde. J\'ai créé un personnage elfe ranger, Elendil le Sage. Au plaisir de jouer avec vous !',
        topic_id: 2,
        author_user_id: 2, // testuser
        author_character_id: null,
        author_name: 'testuser',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      {
        id: 3,
        content: 'Bienvenue parmi nous testuser ! Les elfes sont un excellent choix. N\'hésite pas si tu as des questions !',
        topic_id: 2,
        author_user_id: 1, // admin
        author_character_id: null,
        author_name: 'admin',
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Posts dans la question technique
      {
        id: 4,
        content: 'Bonjour, je ne comprends pas bien comment fonctionne le système de magie. Quelqu\'un peut m\'expliquer ?',
        topic_id: 3,
        author_user_id: 3, // player1
        author_character_id: null,
        author_name: 'player1',
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Posts RP dans le conseil du royaume
      {
        id: 5,
        content: '*Se lève et s\'incline devant le conseil*\n\nMes seigneurs, j\'ai des nouvelles inquiétantes des frontières. Des créatures des ténèbres ont été aperçues près du village de Lunargent. Je propose d\'envoyer une patrouille de chevaliers pour enquêter.',
        topic_id: 4,
        author_user_id: null,
        author_character_id: 1, // Arathorn le Preux
        author_name: 'Arathorn le Preux',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      {
        id: 6,
        content: '*Hoche la tête gravement*\n\nVos paroles sont sages, Commandant Arathorn. Ces menaces ne peuvent être ignorées. J\'autorise le déploiement d\'une unité de chevaliers. Que la lumière vous protège.',
        topic_id: 4,
        author_user_id: null,
        author_character_id: 5, // Roi Aldric
        author_name: 'Roi Aldric',
        is_locked: false,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Posts RP dans l'entraînement des recrues (section privée)
      {
        id: 7,
        content: '*Frappe son épée contre son bouclier*\n\nRecrues ! Aujourd\'hui nous allons travailler les formations de combat. Par deux, en position ! Montrez-moi ce que vous avez appris !',
        topic_id: 5,
        author_user_id: null,
        author_character_id: 8, // Marcus le Commandant
        author_name: 'Marcus le Commandant',
        is_locked: false,
        created_at: twoDaysAgo,
        updated_at: twoDaysAgo,
        deleted_at: null
      },
      {
        id: 8,
        content: '*Se met en position de garde avec son épée et son bouclier*\n\nÀ vos ordres, Commandant ! Je suis prêt à défendre le Royaume !',
        topic_id: 5,
        author_user_id: null,
        author_character_id: 1, // Arathorn le Preux
        author_name: 'Arathorn le Preux',
        is_locked: false,
        created_at: twoHoursAgo,
        updated_at: twoHoursAgo,
        deleted_at: null
      },

      // Posts RP dans la chasse en forêt
      {
        id: 9,
        content: '*S\'agenouille et examine les traces au sol*\n\nRegardez ces empreintes... Un groupe de loups a traversé la forêt il y a quelques heures. Nous devons rester vigilants.',
        topic_id: 6,
        author_user_id: null,
        author_character_id: 2, // Elendil le Sage
        author_name: 'Elendil le Sage',
        is_locked: false,
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },

      // Posts RP dans le raid orc (section privée)
      {
        id: 10,
        content: '*Rugit de satisfaction*\n\nLe village tombe ! Guerriers du Crâne Brisé, montrez votre force ! Pour la Horde !',
        topic_id: 7,
        author_user_id: null,
        author_character_id: 6, // Grom le Destructeur
        author_name: 'Grom le Destructeur',
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
