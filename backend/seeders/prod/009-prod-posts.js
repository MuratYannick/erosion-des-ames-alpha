'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('posts', [
      // Post 1: Message de bienvenue dans le topic "Bienvenue sur Érosion des Âmes !"
      {
        id: 1,
        content: `Bienvenue sur **Érosion des Âmes** !

Chers survivants,

Nous sommes ravis de vous accueillir dans ce monde post-apocalyptique où chaque jour est un combat pour la survie.

Dans cet univers dévasté par le grand cataclysme, deux factions s'opposent dans une lutte acharnée :
- **Les Éclaireurs de l'Aube Nouvelle** : Les mutants éveillés qui voient leur transformation comme une évolution divine
- **Les Veilleurs de l'Ancien Monde** : Les inaltérés qui préservent la pureté de l'humanité et les savoirs ancestraux

Entre ces deux forces, les clans neutres tentent de survivre, chacun avec ses propres règles et sa propre vision de ce nouveau monde.

**Quelques conseils pour bien débuter :**
1. Prenez le temps de lire le règlement et les règles du jeu
2. Présentez-vous dans le Campement de Réfugiés
3. Choisissez votre faction (ou restez neutre) et créez votre personnage
4. Explorez les différentes sections du forum

N'hésitez pas à poser vos questions dans les sections appropriées. L'équipe de modération et la communauté sont là pour vous aider.

Que votre survie soit longue et prospère dans ces terres désolées !

*L'Équipe de Développement d'Érosion des Âmes*`,
        topic_id: 1, // Topic "Bienvenue sur Érosion des Âmes !"
        author_user_id: 1, // Admin
        author_character_id: null,
        author_name: 'Équipe de Développement',
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
