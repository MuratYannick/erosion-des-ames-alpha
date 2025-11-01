'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Récupérer les IDs des utilisateurs par leur nom
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, user_name FROM users WHERE user_name IN ('PJ-eclaireur', 'PJ-veilleur', 'PJ-neutre', 'PJ-symbiote', 'PJ-sentinelles', 'PJ-vagabond', 'PJ-dead')`
    );

    const userEclaireur = users.find(u => u.user_name === 'PJ-eclaireur');
    const userVeilleur = users.find(u => u.user_name === 'PJ-veilleur');
    const userNeutre = users.find(u => u.user_name === 'PJ-neutre');
    const userSymbiote = users.find(u => u.user_name === 'PJ-symbiote');
    const userSentinelles = users.find(u => u.user_name === 'PJ-sentinelles');
    const userVagabond = users.find(u => u.user_name === 'PJ-vagabond');
    const userDead = users.find(u => u.user_name === 'PJ-dead');

    await queryInterface.bulkInsert('characters', [
      // Personnage pour PJ-eclaireur - Éclaireur sans clan
      {
        name: 'Kael l\'Éveillé',
        user_id: userEclaireur.id,
        ethnie_id: 1, // Les Éveillés
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: null, // Sans clan
        is_dead: false,
        is_leader: false,
        description: 'Un jeune Éveillé qui n\'a pas encore choisi son clan. Il observe et apprend les différentes castes avant de prendre sa décision.',
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      // Personnage pour PJ-veilleur - Veilleur sans clan
      {
        name: 'Elena la Pure',
        user_id: userVeilleur.id,
        ethnie_id: 2, // Les Inaltérés
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        clan_id: null, // Sans clan
        is_dead: false,
        is_leader: false,
        description: 'Une Inaltérée récemment arrivée à la Citadelle du Renouveau. Elle doit encore prouver sa valeur avant de rejoindre un clan.',
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      // Personnage pour PJ-neutre - Neutre sans clan
      {
        name: 'Ash le Solitaire',
        user_id: userNeutre.id,
        ethnie_id: 1, // Les Éveillés (mais neutre)
        faction_id: null, // Pas de faction
        clan_id: null, // Sans clan
        is_dead: false,
        is_leader: false,
        description: 'Un mutant qui a choisi de rester neutre, refusant de rejoindre les Éclaireurs. Il survit seul dans les Terres Désolées.',
        created_at: oneHourAgo,
        updated_at: oneHourAgo,
        deleted_at: null
      },
      // Personnage pour PJ-symbiote - Éclaireur avec clan Symbiotes
      {
        name: 'Lyra la Cultivatrice',
        user_id: userSymbiote.id,
        ethnie_id: 1, // Les Éveillés
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: 2, // La Caste des Symbiotes
        is_dead: false,
        is_leader: false,
        description: 'Une Symbiote talentueuse qui a développé des techniques uniques pour cultiver des plantes mutées. Elle est respectée pour sa capacité à comprendre la nature transformée.',
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },
      // Personnage pour PJ-sentinelles - Veilleur avec clan Sentinelles
      {
        name: 'Marcus le Protecteur',
        user_id: userSentinelles.id,
        ethnie_id: 2, // Les Inaltérés
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        clan_id: 8, // Le Clan des Sentinelles
        is_dead: false,
        is_leader: false,
        description: 'Un guerrier expérimenté des Sentinelles, défendant la Citadelle du Renouveau contre les menaces extérieures. Sa loyauté envers les Veilleurs est absolue.',
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },
      // Personnage pour PJ-vagabond - Neutre avec clan Vagabonds du Vent
      {
        name: 'Zara la Marcheuse',
        user_id: userVagabond.id,
        ethnie_id: 2, // Les Inaltérés (mais neutre)
        faction_id: null, // Pas de faction
        clan_id: 15, // Les Vagabonds du Vent
        is_dead: false,
        is_leader: false,
        description: 'Une marchande itinérante des Vagabonds du Vent. Elle parcourt les terres désolées, commerçant avec tous sans distinction, apportant des nouvelles et des marchandises rares.',
        created_at: oneDayAgo,
        updated_at: oneDayAgo,
        deleted_at: null
      },
      // Personnage pour PJ-dead - Personnage mort
      {
        name: 'Theron le Tombé',
        user_id: userDead.id,
        ethnie_id: 1, // Les Éveillés
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        clan_id: 5, // La Caste des Sentinelles du Chaos
        is_dead: true, // Personnage mort
        is_leader: false,
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
