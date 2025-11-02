'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Récupérer les IDs des ethnies par leur nom
    const [ethnies] = await queryInterface.sequelize.query(
      `SELECT id, name FROM ethnies WHERE name IN ('Les Éveillés', 'Les Inaltérés')`
    );

    const ethnieEveilles = ethnies.find(e => e.name === 'Les Éveillés');
    const ethnieInalteres = ethnies.find(e => e.name === 'Les Inaltérés');

    await queryInterface.bulkInsert('factions', [
      {
        name: 'Les Éclaireurs de l\'Aube Nouvelle',
        description: 'La faction des Éclaireurs ne jure que par l\'ordre de la nature : ils n\'ont pas muté, ils ont évolué. Le grand cataclysme a été lancé par leur dieu pour purifier la terre de l\'homme et de sa technologie, responsable de la destruction de la nature. Pour eux, ils sont les élus et tous les non-mutants doivent périr. Mais le plus urgent dans leur quête de purification reste l\'éradication de l\'autre faction, les clans neutres restants peuvent attendre.',
        ethnie_id: ethnieEveilles.id, // Faction exclusive aux Éveillés
        is_playable: true,
        leader_name: null,
        outpost_name: 'L\'Oasis des Transformés',
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        name: 'Les Veilleurs de l\'Ancien Monde',
        description: 'La faction des Veilleurs ne jure que par les anciens savoirs oubliés : la technologie. C\'est le seul moyen de reprendre le dessus sur cette nature dégénérée devenue hostile. Pour eux, les mutants font partie de cette dégénérescence et doivent tous être exterminés avant qu\'ils contaminent les rares humains encore purs qu\'ils sont. Le plus urgent dans leur quête de purification restant l\'éradication de l\'autre faction, les clans neutres restants peuvent attendre.',
        ethnie_id: ethnieInalteres.id, // Faction exclusive aux Inaltérés
        is_playable: true,
        leader_name: null,
        outpost_name: 'La Citadelle du Renouveau',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('factions', null, {});
  }
};
