'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('characters', [
      // Personnage pour PJ-eclaireur (user_id: 4) - Éclaireur sans clan
      {
        id: 1,
        name: 'Kael l\'Éveillé',
        user_id: 4,
        ethnie_id: 1, // Les Éveillés
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: null, // Sans clan
        is_dead: false,
        description: 'Un jeune Éveillé qui n\'a pas encore choisi son clan. Il observe et apprend les différentes castes avant de prendre sa décision.',
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      // Personnage pour PJ-veilleur (user_id: 5) - Veilleur sans clan
      {
        id: 2,
        name: 'Elena la Pure',
        user_id: 5,
        ethnie_id: 2, // Les Inaltérés
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        clan_id: null, // Sans clan
        is_dead: false,
        description: 'Une Inaltérée récemment arrivée à la Citadelle du Renouveau. Elle doit encore prouver sa valeur avant de rejoindre un clan.',
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      // Personnage pour PJ-neutre (user_id: 6) - Neutre sans clan
      {
        id: 3,
        name: 'Ash le Solitaire',
        user_id: 6,
        ethnie_id: 1, // Les Éveillés (mais neutre)
        faction_id: null, // Pas de faction
        clan_id: null, // Sans clan
        is_dead: false,
        description: 'Un mutant qui a choisi de rester neutre, refusant de rejoindre les Éclaireurs. Il survit seul dans les Terres Désolées.',
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      // Personnage pour PJ-symbiote (user_id: 7) - Éclaireur avec clan Symbiotes
      {
        id: 4,
        name: 'Lyra la Cultivatrice',
        user_id: 7,
        ethnie_id: 1, // Les Éveillés
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: 2, // La Caste des Symbiotes
        is_dead: false,
        description: 'Une Symbiote talentueuse qui a développé des techniques uniques pour cultiver des plantes mutées. Elle est respectée pour sa capacité à comprendre la nature transformée.',
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },
      // Personnage pour PJ-sentinelles (user_id: 8) - Veilleur avec clan Sentinelles
      {
        id: 5,
        name: 'Marcus le Protecteur',
        user_id: 8,
        ethnie_id: 2, // Les Inaltérés
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        clan_id: 8, // Le Clan des Sentinelles
        is_dead: false,
        description: 'Un guerrier expérimenté des Sentinelles, défendant la Citadelle du Renouveau contre les menaces extérieures. Sa loyauté envers les Veilleurs est absolue.',
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },
      // Personnage pour PJ-vagabond (user_id: 9) - Neutre avec clan Vagabonds du Vent
      {
        id: 6,
        name: 'Zara la Marcheuse',
        user_id: 9,
        ethnie_id: 2, // Les Inaltérés (mais neutre)
        faction_id: null, // Pas de faction
        clan_id: 15, // Les Vagabonds du Vent
        is_dead: false,
        description: 'Une marchande itinérante des Vagabonds du Vent. Elle parcourt les terres désolées, commerçant avec tous sans distinction, apportant des nouvelles et des marchandises rares.',
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },
      // Personnage pour PJ-dead (user_id: 10) - Personnage mort
      {
        id: 7,
        name: 'Theron le Tombé',
        user_id: 10,
        ethnie_id: 1, // Les Éveillés
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: 5, // La Caste des Sentinelles du Chaos
        is_dead: true, // Personnage mort
        description: 'Un guerrier des Sentinelles du Chaos qui a trouvé la mort lors d\'un affrontement contre une horde de créatures mutées. Son sacrifice est honoré par sa faction.',
        created_at: oneDayAgo,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('characters', null, {});
  }
};
